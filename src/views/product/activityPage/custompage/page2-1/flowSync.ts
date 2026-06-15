import { syncTableToFlowContext } from '../_shared/utils/syncTableToFlowContext';
import { PAGE2_1_REDUCER_TABLE_COMPONENT_ID, REDUCER_TABLE_NUM, type Page2_1ParameterItem } from './parameterDefaults';
import { getReducerTableRows } from './rowOperations';

/** 将 page2-1 减速器选型表写入流程上下文，供 page4/page5 等下游页读取 */
export function syncPage2_1ReducerTableToFlowContext(list: Page2_1ParameterItem[]) {
  syncTableToFlowContext(REDUCER_TABLE_NUM, PAGE2_1_REDUCER_TABLE_COMPONENT_ID, getReducerTableRows(list), 13);
}
