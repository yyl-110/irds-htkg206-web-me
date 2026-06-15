import { REDUCER_TABLE_NUM, PAGE2_1_REDUCER_TABLE_COMPONENT_ID } from '../page2-1/parameterDefaults';
import { PAGE5_TABLE_COMPONENT_ID, PAGE5_TABLE_NUM } from '../page5/parameterDefaults';
import { PAGE6_TABLE_COMPONENT_ID, PAGE6_TABLE_NUM } from '../page6/parameterDefaults';
import { PAGE7_TABLE_COMPONENT_ID, PAGE7_TABLE_NUM } from '../page7/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import type { Page8ParameterItem, Page8TableRow } from './parameterDefaults';

export interface Page8InitResult {
  ok: boolean;
}

function firstNonEmpty(...values: Array<string | number | undefined>): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

function applyGearLevelDisplay(row: Page8TableRow) {
  const level = Number(row.p11);
  if (level === 2) {
    row.p8 = '--';
    row.p9 = '--';
  }
  if (level === 1) {
    row.p6 = '--';
    row.p7 = '--';
    row.p8 = '--';
    row.p9 = '--';
  }
}

function buildRow(
  dispatchRow: Record<string, string | number | undefined>,
  csRow: Record<string, string | number | undefined>,
  xnRow: Record<string, string | number | undefined> | undefined,
  reducerList: Array<Record<string, string | number | undefined>>,
): Page8TableRow {
  const data: Page8TableRow = {};
  data.p0 = firstNonEmpty(readTableCell(dispatchRow, 0));
  data.p1 = firstNonEmpty(readTableCell(dispatchRow, 1));
  data.p2 = firstNonEmpty(readTableCell(dispatchRow, 2));
  data.p3 = firstNonEmpty(readTableCell(dispatchRow, 3));
  data.p4 = firstNonEmpty(readTableCell(csRow, 9));
  data.p5 = firstNonEmpty(readTableCell(csRow, 10));
  data.p6 = firstNonEmpty(readTableCell(csRow, 11));
  data.p7 = firstNonEmpty(readTableCell(csRow, 12));
  data.p8 = firstNonEmpty(readTableCell(csRow, 13));
  data.p9 = firstNonEmpty(readTableCell(csRow, 14));
  data.p10 = firstNonEmpty(readTableCell(csRow, 16));
  data.p11 = firstNonEmpty(readTableCell(csRow, 8));
  data.p12 = firstNonEmpty(readTableCell(dispatchRow, 4));
  data.p13 = firstNonEmpty(readTableCell(dispatchRow, 5));
  data.p14 = firstNonEmpty(readTableCell(dispatchRow, 6));
  data.p15 = xnRow ? firstNonEmpty(readTableCell(xnRow, 18)) : '';
  data.p16 = xnRow ? firstNonEmpty(readTableCell(xnRow, 17)) : '';
  data.p17 = firstNonEmpty(readTableCell(dispatchRow, 7));
  data.p18 = '';
  data.p19 = firstNonEmpty(readTableCell(dispatchRow, 9));
  data.p20 = firstNonEmpty(readTableCell(dispatchRow, 10));

  const reducerCode = firstNonEmpty(readTableCell(dispatchRow, 7));
  reducerList.forEach(item => {
    if (reducerCode && reducerCode === readTableCell(item, 2)) {
      data.p18 = firstNonEmpty(readTableCell(item, 3));
    }
  });

  applyGearLevelDisplay(data);
  return data;
}

/** 从 page5/6/7/2-1 流程表构建组合方案行（供 page8/page9 共用） */
export function resolvePage8SchemeRowsFromSources(
  savedTables?: Array<Record<string, unknown>> | null,
): Page8TableRow[] {
  const sources = collectTableSources(savedTables);

  const gearDispatchList = resolveTableRows(
    sources,
    [{ tableNum: PAGE5_TABLE_NUM, componentId: PAGE5_TABLE_COMPONENT_ID }],
    14,
  );
  const csZjsbList = resolveTableRows(
    sources,
    [{ tableNum: PAGE6_TABLE_NUM, componentId: PAGE6_TABLE_COMPONENT_ID }],
    16,
  );
  const xnList = resolveTableRows(
    sources,
    [{ tableNum: PAGE7_TABLE_NUM, componentId: PAGE7_TABLE_COMPONENT_ID }],
    28,
  );
  const reducerList = resolveTableRows(
    sources,
    [{ tableNum: REDUCER_TABLE_NUM, componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID }],
    14,
  );

  return gearDispatchList
    .map((item, index) => {
      const csRow = csZjsbList[index];
      if (!csRow) return null;
      return buildRow(item, csRow, xnList[index], reducerList);
    })
    .filter((row): row is Page8TableRow => row !== null);
}

/** 从 page5/6/7/2-1 流程表刷新（原 initData） */
export function applyPage8InitData(
  list: Page8ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page8InitResult {
  const dataList = resolvePage8SchemeRowsFromSources(savedTables);

  if (!list[0]?.tableMap) {
    return { ok: false };
  }
  if (dataList.length === 0) {
    return { ok: false };
  }

  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;
  return { ok: true };
}
