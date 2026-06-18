import { message } from 'ant-design-vue';
import { parseJsMethodNames } from '@/utils/parseJsMethods';

export type ActivityJsMethod = (params: ActivityJsInvokeParams) => unknown | Promise<unknown>;

export interface ActivityJsInvokeParams extends Record<string, unknown> {
  inputValue: string;
  paramCode: string;
  paramName: string;
  params: Record<string, string>;
}

export interface ActivityJsApplyContext {
  getComponents: () => any[];
  getComponentKey: (item: any, index: number) => string;
  getComponentValue: (item: any, index: number) => string;
  setFieldValue: (componentKey: string, value: string) => void;
  setRadioValue: (componentKey: string, value: string) => void;
  setLastValidValue?: (componentKey: string, value: string) => void;
}

const IO_COMPONENT_TYPES = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'DATE', 'DATA_VIEW', 'RADIO']);
const RESULT_META_KEYS = new Set(['valid', 'message', 'value', 'outputs', 'inputValue', 'paramCode', 'paramName', 'params']);

function mergeModuleExports(target: Record<string, ActivityJsMethod>, mod: Record<string, unknown>) {
  if (!mod || typeof mod !== 'object') return;
  const def = mod.default;
  if (typeof def === 'function') {
    target.default = def as ActivityJsMethod;
  } else if (def && typeof def === 'object') {
    Object.entries(def as Record<string, unknown>).forEach(([name, fn]) => {
      if (typeof fn === 'function') target[name] = fn as ActivityJsMethod;
    });
  }
  Object.entries(mod).forEach(([name, fn]) => {
    if (name === 'default') return;
    if (typeof fn === 'function') target[name] = fn as ActivityJsMethod;
  });
}

function preprocessActivityJsForSandbox(source: string): string {
  let code = source;
  code = code.replace(/\bexport\s+default\s+/g, 'const __activityJsDefaultExport = ');
  code = code.replace(/\bexport\s+(async\s+)?function\s+/g, '$1function ');
  code = code.replace(/\bexport\s+const\s+/g, 'const ');
  code = code.replace(/\bexport\s+\{[^}]+\};?/g, '');
  const names = parseJsMethodNames(source);
  const registrations = names
    .map(name => `if (typeof ${name} === 'function') __registry__['${name}'] = ${name};`)
    .join('\n');
  return `
${code}
if (typeof __activityJsDefaultExport !== 'undefined') {
  if (typeof __activityJsDefaultExport === 'function') __registry__.default = __activityJsDefaultExport;
  else if (__activityJsDefaultExport && typeof __activityJsDefaultExport === 'object') {
    Object.keys(__activityJsDefaultExport).forEach(function (k) {
      if (typeof __activityJsDefaultExport[k] === 'function') __registry__[k] = __activityJsDefaultExport[k];
    });
  }
}
${registrations}
`;
}

function mergeSandboxExports(target: Record<string, ActivityJsMethod>, source: string, supplement = false) {
  const registry: Record<string, ActivityJsMethod> = {};
  const body = preprocessActivityJsForSandbox(source);
  try {
    const runner = new Function('__registry__', `"use strict";\n${body}`);
    runner(registry);
    Object.entries(registry).forEach(([name, fn]) => {
      if (typeof fn !== 'function') return;
      if (supplement && target[name]) return;
      target[name] = fn;
    });
  } catch (e) {
    console.error('activity js sandbox compile failed:', e);
  }
}

/** 下载 JS 文本后编译为可调用的方法表 */
export async function compileActivityPageJsMethods(source: string): Promise<Record<string, ActivityJsMethod>> {
  const text = String(source ?? '').trim();
  if (!text) return {};
  const methods: Record<string, ActivityJsMethod> = {};

  try {
    const blob = new Blob([text], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    try {
      const mod = (await import(/* @vite-ignore */ url)) as Record<string, unknown>;
      mergeModuleExports(methods, mod);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    // 非 ES Module 脚本走 sandbox
  }

  mergeSandboxExports(methods, text, Object.keys(methods).length > 0);
  return methods;
}

export function getComponentJsMethodName(item: any): string {
  if (String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT') return '';
  return String(item?.validateRule?.formula?.jsMethodName ?? '').trim();
}

export function buildActivityJsInvokeParams(
  triggerItem: any,
  triggerIndex: number,
  ctx: Pick<ActivityJsApplyContext, 'getComponents' | 'getComponentValue'>,
): ActivityJsInvokeParams {
  const paramStore: Record<string, string> = {};
  ctx.getComponents().forEach((item, index) => {
    const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
    if (!code) return;
    if (!IO_COMPONENT_TYPES.has(String(item?.componentType ?? ''))) return;
    paramStore[code] = ctx.getComponentValue(item, index);
  });
  const paramCode = String(triggerItem?.paramCode ?? triggerItem?.paramKey ?? '').trim();
  const inputValue = ctx.getComponentValue(triggerItem, triggerIndex);
  return {
    inputValue,
    paramCode,
    paramName: String(triggerItem?.paramName ?? ''),
    params: paramStore,
    ...paramStore,
  };
}

function isOutputIoType(item: any): boolean {
  return String(item?.ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}

function applyValueToComponent(item: any, index: number, value: string, ctx: ActivityJsApplyContext) {
  const key = ctx.getComponentKey(item, index);
  const type = String(item?.componentType ?? '');
  if (type === 'RADIO') {
    ctx.setRadioValue(key, value);
    return;
  }
  ctx.setFieldValue(key, value);
  if (type === 'INPUT') {
    ctx.setLastValidValue?.(key, value);
  }
}

function applyParamValueMap(map: Record<string, unknown>, ctx: ActivityJsApplyContext) {
  const list = ctx.getComponents();
  Object.entries(map).forEach(([codeRaw, rawVal]) => {
    const code = String(codeRaw ?? '').trim();
    if (!code) return;
    const value = rawVal == null ? '' : String(rawVal);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!IO_COMPONENT_TYPES.has(String(item?.componentType ?? ''))) continue;
      if (String(item?.paramCode ?? item?.paramKey ?? '').trim() !== code) continue;
      applyValueToComponent(item, i, value, ctx);
      break;
    }
  });
}

function applyValueToAllOutputs(value: string, ctx: ActivityJsApplyContext) {
  ctx.getComponents().forEach((item, index) => {
    if (!IO_COMPONENT_TYPES.has(String(item?.componentType ?? ''))) return;
    if (!isOutputIoType(item)) return;
    applyValueToComponent(item, index, value, ctx);
  });
}

/** 将 JS 方法返回值写回页面组件 */
export function applyActivityJsInvokeResult(result: unknown, ctx: ActivityJsApplyContext) {
  if (result == null) return;

  if (Array.isArray(result)) {
    const rows = result
      .map(row => ({
        paramCode: String((row as any)?.paramCode ?? (row as any)?.paramKey ?? '').trim(),
        paramValue: (row as any)?.paramValue != null ? String((row as any).paramValue) : '',
      }))
      .filter(row => row.paramCode);
    if (rows.length) {
      applyParamValueMap(Object.fromEntries(rows.map(row => [row.paramCode, row.paramValue])), ctx);
    }
    return;
  }

  if (typeof result !== 'object') {
    applyValueToAllOutputs(String(result), ctx);
    return;
  }

  const obj = result as Record<string, unknown>;
  if (obj.valid === false) {
    message.warning(String(obj.message || '输入校验未通过'));
    return;
  }

  if (obj.outputs && typeof obj.outputs === 'object' && !Array.isArray(obj.outputs)) {
    applyParamValueMap(obj.outputs as Record<string, unknown>, ctx);
    return;
  }

  if ('value' in obj) {
    applyValueToAllOutputs(String(obj.value ?? ''), ctx);
    return;
  }

  const directMap = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !RESULT_META_KEYS.has(key)),
  );
  if (Object.keys(directMap).length) {
    applyParamValueMap(directMap, ctx);
  }
}

export async function invokeActivityJsMethod(
  methods: Record<string, ActivityJsMethod>,
  methodName: string,
  params: ActivityJsInvokeParams,
): Promise<unknown> {
  const fn = methods[methodName];
  if (typeof fn !== 'function') {
    throw new Error(`JS method not found: ${methodName}`);
  }
  return Promise.resolve(fn(params));
}
