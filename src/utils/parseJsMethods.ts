/** 排除关键字，避免把 if/for 等误识别为方法名 */
const RESERVED = new Set([
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'catch',
  'return',
  'new',
  'typeof',
  'void',
  'delete',
  'await',
  'yield',
  'class',
  'function',
  'export',
  'import',
  'default',
  'var',
  'let',
  'const',
  'try',
  'finally',
  'throw',
  'in',
  'of',
  'instanceof',
  'super',
  'this',
  'debugger',
  'with',
  'constructor',
]);

function isMethodName(name: string | undefined): name is string {
  return Boolean(name && /^[A-Za-z_$][\w$]*$/.test(name) && !RESERVED.has(name));
}

/** 去掉块注释、行注释，降低字符串误匹配概率（不处理引号内注释） */
function stripJsComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '\n')
    .replace(/(^|[^:])\/\/.*$/gm, '$1\n');
}

/**
 * 从 JS 源码中解析可调用的方法名（供活动页面配置下拉选择）。
 * 支持：export function、export default {}、module.exports、顶层 function、赋值、对象方法简写等。
 */
export function parseJsMethodNames(source: string): string[] {
  const names = new Set<string>();
  const code = stripJsComments(String(source ?? ''));
  if (!code.trim()) {
    return [];
  }

  const add = (name: string | undefined) => {
    if (isMethodName(name)) {
      names.add(name);
    }
  };

  const patterns: RegExp[] = [
    // export / function 声明
    /\bexport\s+default\s+async\s+function\s+([A-Za-z_$][\w$]*)/g,
    /\bexport\s+default\s+function\s+([A-Za-z_$][\w$]*)/g,
    /\bexport\s+async\s+function\s+([A-Za-z_$][\w$]*)/g,
    /\bexport\s+function\s+([A-Za-z_$][\w$]*)/g,
    /\bexport\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function|\()/g,
    /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g,
    // const foo = function / () =>
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\s*\(/g,
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g,
    // foo = function
    /\b([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\s*\(/g,
    /\b([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g,
    // 对象属性：foo: function / foo: async () =>
    /\b([A-Za-z_$][\w$]*)\s*:\s*(?:async\s+)?function\s*\(/g,
    /\b([A-Za-z_$][\w$]*)\s*:\s*(?:async\s+)?\([^)]*\)\s*=>/g,
    // 对象方法简写：foo() { / async foo() {
    /\b(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g,
    // window.xxx = function
    /\bwindow\.([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\s*\(/g,
    /\bwindow\.([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g,
    // CommonJS
    /\bmodule\.exports\.([A-Za-z_$][\w$]*)\s*=/g,
    /\bexports\.([A-Za-z_$][\w$]*)\s*=/g,
  ];

  // export { foo, bar as baz }
  const exportBrace = /\bexport\s*\{([^}]+)\}/g;
  let braceMatch: RegExpExecArray | null;
  while ((braceMatch = exportBrace.exec(code)) !== null) {
    for (const part of braceMatch[1].split(',')) {
      const seg = part.trim();
      if (!seg) continue;
      const asIdx = seg.lastIndexOf(' as ');
      add(asIdx >= 0 ? seg.slice(asIdx + 4).trim() : seg);
    }
  }

  // module.exports = { a, b: fn, c() {} } — 提取花括号内逗号分隔的键名
  const moduleExportObj = /\b(?:module\.)?exports\s*=\s*\{([^}]*)\}/g;
  let modMatch: RegExpExecArray | null;
  while ((modMatch = moduleExportObj.exec(code)) !== null) {
    parseExportObjectBody(modMatch[1], add);
  }

  // export default { ... }
  const exportDefaultObj = /\bexport\s+default\s*\{([^}]*)\}/g;
  let defMatch: RegExpExecArray | null;
  while ((defMatch = exportDefaultObj.exec(code)) !== null) {
    parseExportObjectBody(defMatch[1], add);
  }

  for (const re of patterns) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) !== null) {
      add(match[1]);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

/** 解析 export default { key, key2: fn } 对象字面量片段中的名称 */
function parseExportObjectBody(body: string, add: (name: string | undefined) => void) {
  const parts = splitTopLevelComma(body);
  for (const part of parts) {
    const seg = part.trim();
    if (!seg) continue;
    // key: value
    const colon = seg.match(/^([A-Za-z_$][\w$]*)\s*:/);
    if (colon) {
      add(colon[1]);
      continue;
    }
    // method() { 或 async method()
    const method = seg.match(/^(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/);
    if (method) {
      add(method[1]);
      continue;
    }
    // 简写属性 key,
    const ident = seg.match(/^([A-Za-z_$][\w$]*)$/);
    if (ident) {
      add(ident[1]);
    }
  }
}

function splitTopLevelComma(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{' || ch === '(' || ch === '[') depth++;
    else if (ch === '}' || ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts;
}
