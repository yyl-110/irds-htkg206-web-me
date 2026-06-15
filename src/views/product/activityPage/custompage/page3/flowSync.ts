import { upsertFlowTableItem } from '../shared/flowContext';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM, type Page3ParameterItem, type Page3TableRow } from './parameterDefaults';
import { getPage3TableRows } from './rowOperations';

function normalizePage3FlowRow(row: Page3TableRow): Record<string, string | number | undefined> {
  const next: Record<string, string | number | undefined> = { ...row };
  for (let i = 0; i <= 18; i++) {
    const val = String(row[`p${i}`] ?? '').trim();
    if (val) next[`p${i}`] = val;
  }
  return next;
}

/** 将 page3 当前表格（含总减速比 p18 文本框值）写入流程上下文，供 page4 等下游页读取 */
export function syncPage3TableToFlowContext(list: Page3ParameterItem[]) {
  const tableItem = list.find(item => item.ifSingleLine === 't' && item.tableMap);
  if (!tableItem) return;

  const rowdata = getPage3TableRows(list).map(normalizePage3FlowRow);
  if (!rowdata.length) return;

  upsertFlowTableItem({
    tablenum: String(tableItem.tableNum ?? PAGE3_TABLE_NUM),
    componentId: tableItem.componentId ?? PAGE3_TABLE_COMPONENT_ID,
    rowdata,
  });
}
