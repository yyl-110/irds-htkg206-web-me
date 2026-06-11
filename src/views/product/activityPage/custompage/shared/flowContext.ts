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

export function getFlowParameterList(): FlowParameterItem[] {
  return readGlobalContext().flowParameterList ?? [];
}
