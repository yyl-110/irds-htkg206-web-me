/**
 * 活动页公式求值（与后端 ActivityFormulaEvaluateHelper 语义对齐，供前端实时联动）。
 * 参数占位：[参数代号]；兼容公式编辑器直接插入的裸代号（如 T_NUM_A+1）。
 */

export type ActivityFormulaEvaluateResult =
  | { ok: true; value: string; numeric: number }
  | { ok: false; value: string; reason: 'empty' | 'missing_param' | 'invalid' };

const PARAM_BRACKET_SOURCE = '\\[([^\\[\\]]+)\\]';
const SAFE_EXPRESSION_PATTERN = /^[\s\d+\-*/().,^A-Za-z_\[\]]+$/;
const SIZE_CALL_SOURCE = 'size\\s*\\(([^()]*)\\)';
const SUM_CALL_SOURCE = 'sum\\s*\\(([^()]*)\\)';

function bracketParamPattern() {
  return new RegExp(PARAM_BRACKET_SOURCE, 'g');
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 从表达式提取依赖的参数代号 */
export function extractFormulaParamCodes(expression: string, knownCodes?: Iterable<string>): string[] {
  const codes = new Set<string>();
  const raw = String(expression ?? '').trim();
  if (!raw) return [];
  let m: RegExpExecArray | null;
  const bracketRe = bracketParamPattern();
  while ((m = bracketRe.exec(raw)) !== null) {
    const code = String(m[1] ?? '').trim();
    if (code) codes.add(code);
  }
  if (knownCodes) {
    const sorted = [...knownCodes].filter(Boolean).sort((a, b) => b.length - a.length);
    for (const code of sorted) {
      const re = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(code)}(?![A-Za-z0-9_])`, 'g');
      if (re.test(raw)) codes.add(code);
    }
  }
  return [...codes];
}

function splitTopLevelArgs(inner: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner.charAt(i);
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(inner.slice(start, i).trim());
      start = i + 1;
    }
  }
  const tail = inner.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

function hasNonBlankValue(paramValues: Record<string, string>, code: string): boolean {
  const v = paramValues[code];
  return v != null && String(v).trim() !== '';
}

function expandSumCalls(expression: string): string {
  const re = new RegExp(SUM_CALL_SOURCE, 'gi');
  return expression.replace(re, (_full, inner: string) => {
    const args = splitTopLevelArgs(inner);
    if (!args.length) throw new Error('sum 函数至少需要一个参数');
    return `(${args.join('+')})`;
  });
}

function replaceSizeCalls(expression: string, paramValues: Record<string, string>): string {
  const re = new RegExp(SIZE_CALL_SOURCE, 'gi');
  return expression.replace(re, (_full, inner: string) => {
    const args = splitTopLevelArgs(inner);
    let count = 0;
    for (const arg of args) {
      const codes = extractFormulaParamCodes(arg, Object.keys(paramValues));
      if (codes.length) {
        for (const code of codes) {
          if (hasNonBlankValue(paramValues, code)) count++;
        }
      } else if (String(arg).trim()) {
        count++;
      }
    }
    return String(count);
  });
}

function parseNumericValue(paramCode: string, raw: string | undefined): number {
  if (raw == null || String(raw).trim() === '') {
    throw new Error(`参数 [${paramCode}] 未提供数值`);
  }
  const text = String(raw).trim().replace(/,/g, '');
  const n = Number(text);
  if (!Number.isFinite(n)) {
    throw new Error(`参数 [${paramCode}] 不是有效数字: ${raw}`);
  }
  return n;
}

function substituteParamRefs(expression: string, paramValues: Record<string, string>, knownCodes: Set<string>): string {
  let result = expression.replace(bracketParamPattern(), (_full, codeRaw: string) => {
    const code = String(codeRaw ?? '').trim();
    return String(parseNumericValue(code, paramValues[code]));
  });
  const sorted = [...knownCodes].sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    const re = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(code)}(?![A-Za-z0-9_])`, 'g');
    result = result.replace(re, () => String(parseNumericValue(code, paramValues[code])));
  }
  return result;
}

function formatResult(value: number): string {
  if (!Number.isFinite(value)) throw new Error('公式计算结果无效');
  if (Math.abs(value - Math.round(value)) < 1e-10) return String(Math.round(value));
  return value
    .toFixed(10)
    .replace(/0+$/, '')
    .replace(/\.$/, '');
}

function evaluateNumericExpression(expr: string): number {
  const normalized = expr.replace(/\bceiling\s*\(/gi, 'ceil(');
  const scope = {
    min: Math.min,
    max: Math.max,
    log: Math.log,
    log10: Math.log10,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    abs: Math.abs,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    ceiling: Math.ceil,
    rad: (x: number) => (x * Math.PI) / 180,
    deg: (x: number) => (x * 180) / Math.PI,
  };
  // eslint-disable-next-line no-new-func
  const fn = new Function(...Object.keys(scope), `"use strict"; return (${normalized});`);
  const result = fn(...Object.values(scope));
  const n = Number(result);
  if (!Number.isFinite(n)) throw new Error('公式计算结果无效');
  return n;
}

/** 求值：依赖参数有空值时返回 missing_param（用于 UI 展示空，不报错） */
export function evaluateActivityFormula(
  expression: string,
  paramValues: Record<string, string>,
  knownCodes?: Iterable<string>,
): ActivityFormulaEvaluateResult {
  const raw = String(expression ?? '').trim();
  if (!raw) return { ok: false, value: '', reason: 'empty' };
  if (raw.length > 4000) return { ok: false, value: '', reason: 'invalid' };
  if (!SAFE_EXPRESSION_PATTERN.test(raw)) return { ok: false, value: '', reason: 'invalid' };

  const known = new Set<string>([...Object.keys(paramValues), ...(knownCodes ? [...knownCodes] : [])]);

  let preprocessed: string;
  try {
    preprocessed = replaceSizeCalls(expandSumCalls(raw), paramValues);
  } catch {
    return { ok: false, value: '', reason: 'invalid' };
  }

  const deps = extractFormulaParamCodes(preprocessed, known);
  for (const code of deps) {
    if (!hasNonBlankValue(paramValues, code)) {
      return { ok: false, value: '', reason: 'missing_param' };
    }
  }

  try {
    const substituted = substituteParamRefs(preprocessed, paramValues, known);
    const numeric = evaluateNumericExpression(substituted);
    const value = formatResult(numeric);
    return { ok: true, value, numeric };
  } catch {
    return { ok: false, value: '', reason: 'invalid' };
  }
}

export interface ActivityFormulaBinding {
  paramCode: string;
  expression: string;
  componentKey: string;
}

/** 是否为公式输出组件（validateRule.formula + OUTPUT） */
export function isFormulaOutputComponent(item: any): boolean {
  if (String(item?.ioType ?? 'INPUT').toUpperCase() !== 'OUTPUT') return false;
  const formula = item?.validateRule?.formula;
  if (!formula || typeof formula !== 'object') return false;
  const mode = String(formula.mode ?? 'FORMULA').toUpperCase();
  if (mode !== 'FORMULA') return false;
  return String(formula.expression ?? '').trim() !== '';
}

export function collectFormulaOutputBindings(
  components: any[],
  getComponentKey: (item: any, index: number) => string,
): ActivityFormulaBinding[] {
  const bindings: ActivityFormulaBinding[] = [];
  components.forEach((item, index) => {
    if (!isFormulaOutputComponent(item)) return;
    const paramCode = String(item?.paramCode ?? item?.paramKey ?? '').trim();
    const expression = String(item?.validateRule?.formula?.expression ?? '').trim();
    if (!paramCode || !expression) return;
    bindings.push({
      paramCode,
      expression,
      componentKey: getComponentKey(item, index),
    });
  });
  return bindings;
}

/** 公式输出之间按依赖拓扑排序；若成环则按原顺序并标记 hasCycle */
export function sortFormulaBindingsTopologically(bindings: ActivityFormulaBinding[]): {
  sorted: ActivityFormulaBinding[];
  hasCycle: boolean;
} {
  if (!bindings.length) return { sorted: [], hasCycle: false };
  const codes = new Set(bindings.map(b => b.paramCode));
  const inDegree = new Map<string, number>();
  const edges = new Map<string, string[]>();
  bindings.forEach(b => {
    inDegree.set(b.paramCode, 0);
    edges.set(b.paramCode, []);
  });
  bindings.forEach(b => {
    const deps = extractFormulaParamCodes(b.expression, codes).filter(code => codes.has(code));
    deps.forEach(dep => {
      edges.get(dep)!.push(b.paramCode);
      inDegree.set(b.paramCode, (inDegree.get(b.paramCode) ?? 0) + 1);
    });
  });
  const queue = bindings.filter(b => (inDegree.get(b.paramCode) ?? 0) === 0).map(b => b.paramCode);
  const sorted: ActivityFormulaBinding[] = [];
  const byCode = new Map(bindings.map(b => [b.paramCode, b]));
  while (queue.length) {
    const code = queue.shift()!;
    const binding = byCode.get(code);
    if (binding) sorted.push(binding);
    for (const next of edges.get(code) ?? []) {
      const deg = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, deg);
      if (deg === 0) queue.push(next);
    }
  }
  if (sorted.length < bindings.length) {
    const rest = bindings.filter(b => !sorted.some(s => s.paramCode === b.paramCode));
    return { sorted: [...sorted, ...rest], hasCycle: true };
  }
  return { sorted, hasCycle: false };
}
