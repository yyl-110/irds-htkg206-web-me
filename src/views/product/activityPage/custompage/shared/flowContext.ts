/** 流程执行过程中各活动页写入的上下文（对应旧版 vuex flowTableList / flowParameterList） */

export interface FlowTableItem {
  tablenum?: string;
  componentId?: string | number;
  rowdata?: Array<Record<string, string | number | undefined>>;
}

export interface FlowParameterItem {
  paramnum?: string;
  paramvalue?: string;
}

export interface FlowContextSnapshot {
  flowTableList?: FlowTableItem[];
  flowParameterList?: FlowParameterItem[];
}

type GlobalWithFlow = typeof globalThis & {
  __IRD_FLOW_CONTEXT__?: FlowContextSnapshot;
};

function readGlobalContext(): FlowContextSnapshot {
  return (globalThis as GlobalWithFlow).__IRD_FLOW_CONTEXT__ ?? {};
}

/** 供流程引擎或前置活动页注入上下文 */
export function setFlowContext(partial: FlowContextSnapshot) {
  const g = globalThis as GlobalWithFlow;
  g.__IRD_FLOW_CONTEXT__ = {
    ...readGlobalContext(),
    ...partial,
    flowTableList: partial.flowTableList ?? readGlobalContext().flowTableList,
    flowParameterList: partial.flowParameterList ?? readGlobalContext().flowParameterList,
  };
}

export function getFlowTableList(): FlowTableItem[] {
  return readGlobalContext().flowTableList ?? [];
}

/** 按 componentId / tablenum 更新或插入单张流程表（供上游页实时写入，供下游 initData 读取） */
export function upsertFlowTableItem(item: FlowTableItem) {
  const tablenum = String(item.tablenum ?? '').trim();
  const componentId = item.componentId != null && item.componentId !== '' ? String(item.componentId) : '';
  if (!tablenum && !componentId) return;

  const current = getFlowTableList();
  const next = current.filter(row => {
    const rowTablenum = String(row.tablenum ?? '').trim();
    const rowComponentId = row.componentId != null && row.componentId !== '' ? String(row.componentId) : '';
    if (componentId && rowComponentId === componentId) return false;
    if (tablenum && rowTablenum === tablenum) return false;
    return true;
  });
  next.push(item);
  setFlowContext({ flowTableList: next });
}

function flowTableKey(row: FlowTableItem): string {
  const componentId = row.componentId != null && row.componentId !== '' ? String(row.componentId) : '';
  if (componentId) return `id:${componentId}`;
  const tablenum = String(row.tablenum ?? '').trim();
  if (tablenum) return `num:${tablenum}`;
  return '';
}

/** 合并流程表：已存在于 flow 的表不被 task-param-map 快照覆盖（保留上游页实时写入） */
export function mergeFlowTableList(incoming: FlowTableItem[]) {
  if (!incoming.length) return;
  const existingKeys = new Set(getFlowTableList().map(flowTableKey).filter(Boolean));
  incoming.forEach(item => {
    const key = flowTableKey(item);
    if (key && existingKeys.has(key)) return;
    upsertFlowTableItem(item);
    if (key) existingKeys.add(key);
  });
}

export function getFlowParameterList(): FlowParameterItem[] {
  return readGlobalContext().flowParameterList ?? [];
}
