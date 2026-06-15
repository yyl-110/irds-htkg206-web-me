import { syncTableToFlowContext } from '../_shared/utils/syncTableToFlowContext';
import { PAGE3_1_TABLE_COMPONENT_ID, PAGE3_1_TABLE_NUM, type Page3_1ParameterItem } from './parameterDefaults';
import { getPage3_1TableRows } from './rowOperations';

/** 将 page3-1 初始性能计算表（含 p13-p15）写入流程上下文，供 page4 等下游页读取 */
export function syncPage3_1TableToFlowContext(list: Page3_1ParameterItem[]) {
  syncTableToFlowContext(PAGE3_1_TABLE_NUM, PAGE3_1_TABLE_COMPONENT_ID, getPage3_1TableRows(list), 15);
}
