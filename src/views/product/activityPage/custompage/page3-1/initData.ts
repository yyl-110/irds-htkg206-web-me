import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { collectTableSources, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import type { Page3_1ParameterItem, Page3_1TableRow } from './parameterDefaults';

function readTableCell(row: Record<string, string | number | undefined> | undefined, pIndex: number): string {
  if (!row) return '';
  const pVal = String(row[`p${pIndex}`] ?? '').trim();
  if (pVal) return pVal;
  return String(row[`c${pIndex + 1}`] ?? '').trim();
}

function buildPage3_1RowFromInitTotalJsb(
  item: Record<string, string | number | undefined>,
  standardLoad: string,
): Page3_1TableRow {
  const data: Page3_1TableRow = {};
  data.p0 = readTableCell(item, 0);
  data.cellInputOrOutput0 = '1';
  data.p1 = readTableCell(item, 1);
  data.cellInputOrOutput1 = '1';
  data.p2 = readTableCell(item, 2);
  data.cellInputOrOutput2 = '1';
  data.p3 = readTableCell(item, 3);
  data.cellInputOrOutput3 = '1';
  data.p4 = readTableCell(item, 4);
  data.cellInputOrOutput4 = '1';
  data.p5 = readTableCell(item, 5);
  data.cellInputOrOutput5 = '1';
  data.p6 = readTableCell(item, 18);
  data.cellInputOrOutput6 = '1';
  data.p7 = standardLoad;
  data.cellInputOrOutput7 = '1';
  for (let i = 8; i <= 15; i++) {
    data[`p${i}`] = '';
    data[`cellParameterId${i}`] = '';
    data[`cellInputOrOutput${i}`] = '1';
  }
  return data;
}

/** 从流程上下文 / 已保存表格刷新（原 initData） */
export function applyPage3_1InitData(
  list: Page3_1ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);

  const djList = resolveTableRows(
    sources,
    [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }],
    19,
  );

  let djOutputStyle = '';
  let standardLoadX = '';
  let standardLoadZ = '';

  paramList.forEach(item => {
    if (djOutputStyle === '' && item.paramnum === 'DJ1_1_GZFS') {
      djOutputStyle = item.paramvalue ?? '';
    }
    if (standardLoadX === '' && item.paramnum === 'DJ1_1_SCLJ_ED_X') {
      standardLoadX = item.paramvalue ?? '';
    }
    if (standardLoadZ === '' && item.paramnum === 'DJ1_1_SCL_ED_Z') {
      standardLoadZ = item.paramvalue ?? '';
    }
  });

  let standardLoad = standardLoadX;
  if (djOutputStyle.substring(0, 2) === '直线') {
    standardLoad = standardLoadZ;
  }

  const dataList = djList.map(item => buildPage3_1RowFromInitTotalJsb(item, standardLoad));

  if (!list[0]?.tableMap) {
    return false;
  }
  if (dataList.length === 0) {
    return false;
  }
  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;
  return true;
}
