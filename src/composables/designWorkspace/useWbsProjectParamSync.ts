/** WBS 协同：跨任务同名参数 — 其它任务写入项目后的聚合值 vs 本任务已保存值 */

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

/**
 * 跨任务同步闹钟：本任务已有保存值，且与其它任务写入项目的最新值不一致时提示。
 * - 本任务未保存过：自动沿用其它任务的项目值，不提示
 * - 其它任务尚未写入该参数：无跨任务更新，不提示
 * - 编辑中未保存的改动不参与比对（由调用方传入 saved 值）
 */
export function shouldShowWbsProjectParamSyncHint(taskSavedValue: unknown, projectValueFromOtherTasks: unknown): boolean {
  const task = normalizeWbsParamValue(taskSavedValue);
  const project = normalizeWbsParamValue(projectValueFromOtherTasks);
  if (!task) return false;
  if (!project) return false;
  return isWbsParamValueDifferent(task, project);
}

export function isWbsOutputIoType(ioType: unknown): boolean {
  return String(ioType ?? 'INPUT').toUpperCase() === 'OUTPUT';
}

export function isWbsInputIoType(ioType: unknown): boolean {
  return String(ioType ?? 'INPUT').toUpperCase() === 'INPUT';
}

/** 表单初始值：WBS 输出项 当前任务→项目→默认；输入项 当前任务→项目→默认 */
export function resolvePreviewParamBaseValue(options: {
  wbsCollabMode?: boolean;
  savedMap: Map<string, string>;
  projectMap?: Map<string, string>;
  paramCode: string;
  componentDefault?: unknown;
  ioType?: string;
}): string {
  const { wbsCollabMode, savedMap, projectMap, paramCode, componentDefault, ioType } = options;
  if (wbsCollabMode) {
    const code = String(paramCode ?? '').trim();
    const projectVal = projectMap ? lookupWbsParamInMap(projectMap, code) : '';
    const taskSaved = resolveTaskSavedParamValue(savedMap, code, '');
    if (isWbsOutputIoType(ioType)) {
      if (taskSaved) return taskSaved;
      if (projectVal) return projectVal;
      return normalizeWbsParamValue(componentDefault);
    }
    if (taskSaved) return taskSaved;
    if (projectVal) return projectVal;
    return normalizeWbsParamValue(componentDefault);
  }
  const code = String(paramCode ?? '').trim();
  const saved = code && savedMap.has(code) ? String(savedMap.get(code) ?? '') : '';
  return saved || normalizeWbsParamValue(componentDefault);
}

/** 从活动页 componentsJson 收集设计输入（INPUT）参数编码 */
export function collectWbsInputParamCodesFromComponents(componentsJson?: Record<string, any> | null): Set<string> {
  const codes = new Set<string>();
  const cfg = componentsJson || {};
  const lists = [
    ...(Array.isArray(cfg.basicComponentList) ? cfg.basicComponentList : []),
    ...(Array.isArray(cfg.threeDComponentList) ? cfg.threeDComponentList : []),
    ...(Array.isArray(cfg.uploadComponentList) ? cfg.uploadComponentList : []),
    ...(Array.isArray(cfg.tableComponentList) ? cfg.tableComponentList : []),
  ];
  lists.forEach((item: any) => {
    if (!isWbsInputIoType(item?.ioType)) return;
    const code = String(item?.paramCode ?? item?.paramKey ?? '').trim();
    if (code) codes.add(code);
  });
  return codes;
}

/** 设计输入保存项中与已保存值不同的 paramKey（用户修改并推送项目） */
export function findChangedWbsInputParamKeys(options: {
  items: Array<{ paramKey?: string; paramValue?: string }>;
  savedParamValues?: any[] | null;
  componentsJson?: Record<string, any> | null;
}): string[] {
  const inputCodes = collectWbsInputParamCodesFromComponents(options.componentsJson);
  if (!inputCodes.size) return [];
  const savedMap = parseSavedParamValueList(options.savedParamValues);
  const changed: string[] = [];
  options.items.forEach(row => {
    const key = String(row?.paramKey ?? '').trim();
    if (!key || !inputCodes.has(key)) return;
    const prev = savedMap.has(key) ? savedMap.get(key)! : '';
    const next = normalizeWbsParamValue(row?.paramValue);
    if (isWbsParamValueDifferent(prev, next)) changed.push(key);
  });
  return changed;
}

/** 跨任务同步闹钟：设计输入/输出均可；编辑中（当前值≠已保存）不提示 */
export function shouldShowWbsCrossTaskParamSyncHint(options: {
  taskSavedValue: unknown;
  projectValueFromOtherTasks: unknown;
  currentEditValue?: unknown;
}): boolean {
  const { taskSavedValue, projectValueFromOtherTasks, currentEditValue } = options;
  if (!shouldShowWbsProjectParamSyncHint(taskSavedValue, projectValueFromOtherTasks)) return false;
  const saved = normalizeWbsParamValue(taskSavedValue);
  const editing = normalizeWbsParamValue(currentEditValue);
  if (editing !== saved) return false;
  return true;
}
