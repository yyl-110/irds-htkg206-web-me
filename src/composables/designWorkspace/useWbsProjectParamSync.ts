/** WBS 协同：本任务参数值 vs 项目聚合参数值比对与接收 */

export function normalizeWbsParamValue(v: unknown): string {
  return String(v ?? '').trim();
}

export function parseWbsParamRecord(raw: Record<string, string> | null | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!raw || typeof raw !== 'object') return map;
  Object.entries(raw).forEach(([k, v]) => {
    const code = String(k).trim();
    if (code) map.set(code, normalizeWbsParamValue(v));
  });
  return map;
}

export function lookupWbsParamInMap(map: Map<string, string>, codeRaw: string): string {
  const target = String(codeRaw ?? '').trim();
  if (!target) return '';
  if (map.has(target)) return map.get(target)!;
  const lower = target.toLowerCase();
  for (const [k, v] of map.entries()) {
    if (String(k).trim().toLowerCase() === lower) return v;
  }
  return '';
}

export function parseSavedParamValueList(list: any[] | null | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!Array.isArray(list)) return map;
  list.forEach((row: any) => {
    const code = String(row?.paramCode ?? row?.paramKey ?? row?.code ?? '').trim();
    if (!code) return;
    map.set(code, normalizeWbsParamValue(row?.paramValue ?? row?.value ?? row?.savedValue));
  });
  return map;
}

/** 读取本任务已保存值；存在 key 时即使值为空也返回 ''，避免误用组件默认值 */
export function resolveTaskSavedParamValue(
  map: Map<string, string>,
  paramCodeRaw: string,
  componentDefault?: unknown,
): string {
  const code = String(paramCodeRaw ?? '').trim();
  if (!code) return normalizeWbsParamValue(componentDefault);
  if (map.has(code)) return map.get(code)!;
  const lower = code.toLowerCase();
  for (const [k, v] of map.entries()) {
    if (String(k).trim().toLowerCase() === lower) return v;
  }
  return normalizeWbsParamValue(componentDefault);
}

export function isWbsParamValueDifferent(taskValue: unknown, projectValue: unknown): boolean {
  return normalizeWbsParamValue(taskValue) !== normalizeWbsParamValue(projectValue);
}

/** WBS：本任务有值且与项目值不同时才显示闹钟（任务为空已自动用项目值，无需提示） */
export function shouldShowWbsProjectParamSyncHint(taskValue: unknown, projectValue: unknown): boolean {
  const task = normalizeWbsParamValue(taskValue);
  if (!task) return false;
  return isWbsParamValueDifferent(task, projectValue);
}

/** 表单初始值：WBS 本任务有值用本任务，否则用项目值；独立应用保持原有 fallback 逻辑 */
export function resolvePreviewParamBaseValue(options: {
  wbsCollabMode?: boolean;
  savedMap: Map<string, string>;
  projectMap?: Map<string, string>;
  paramCode: string;
  componentDefault?: unknown;
}): string {
  const { wbsCollabMode, savedMap, projectMap, paramCode, componentDefault } = options;
  if (wbsCollabMode) {
    const code = String(paramCode ?? '').trim();
    const taskSaved = resolveTaskSavedParamValue(savedMap, code, '');
    if (taskSaved) return taskSaved;
    const projectVal = projectMap ? lookupWbsParamInMap(projectMap, code) : '';
    if (projectVal) return projectVal;
    return normalizeWbsParamValue(componentDefault);
  }
  const code = String(paramCode ?? '').trim();
  const saved = code && savedMap.has(code) ? String(savedMap.get(code) ?? '') : '';
  return saved || normalizeWbsParamValue(componentDefault);
}
