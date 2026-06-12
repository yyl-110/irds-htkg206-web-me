import { PAGE4_TABLE_COMPONENT_ID, PAGE4_TABLE_NUM } from '../page4/parameterDefaults';
import { PAGE6_TABLE_COMPONENT_ID, PAGE6_TABLE_NUM } from '../page6/parameterDefaults';
import { PAGE7_TABLE_COMPONENT_ID, PAGE7_TABLE_NUM } from '../page7/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import type { Page5ParameterItem, Page5TableRow } from './parameterDefaults';

export interface Page5InitResult {
  ok: boolean;
  equivalent: number;
}

function firstNonEmpty(...values: Array<string | number | undefined>): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

function findRowByScheme(
  list: Array<Record<string, string | number | undefined>>,
  schemeIndex: number,
  schemeLabel: string,
): Record<string, string | number | undefined> | undefined {
  if (list[schemeIndex]) return list[schemeIndex];
  return list.find(row => String(row.p0 ?? '').trim() === schemeLabel);
}

function readParamFromFlowOrSaved(
  paramList: Array<{ paramnum?: string; paramvalue?: string }>,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
  num: string,
): string {
  let val = '';
  (savedParamValues ?? []).forEach(row => {
    const key = String(row.paramKey ?? row.paramCode ?? '').trim();
    if (!val && key === num) {
      val = String(row.paramValue ?? '').trim();
    }
  });
  if (!val) {
    paramList.forEach(item => {
      if (!val && item.paramnum === num) {
        val = String(item.paramvalue ?? '').trim();
      }
    });
  }
  return val;
}

function buildRowFromCombin(
  schemeIndex: number,
  combinRow: Record<string, string | number | undefined>,
  jsqStyle: string,
  page7Row?: Record<string, string | number | undefined>,
  page6Row?: Record<string, string | number | undefined>,
  existingRow?: Page5TableRow,
): Page5TableRow {
  const data: Page5TableRow = {};
  const schemeLabel = `组合方案${schemeIndex + 1}`;
  data.p0 = schemeLabel;
  data.cellInputOrOutput0 = '1';

  // 初算指标来自 page7/page6；page4 combin 的 p1-p3 是 page3 减速比，不能用于此处
  data.p1 = firstNonEmpty(readTableCell(page7Row, 1), readTableCell(page6Row, 1), existingRow?.p1);
  data.cellInputOrOutput1 = '1';
  data.p2 = firstNonEmpty(readTableCell(page7Row, 2), readTableCell(page6Row, 2), existingRow?.p2);
  data.cellInputOrOutput2 = '1';
  data.p3 = firstNonEmpty(readTableCell(page7Row, 3), readTableCell(page6Row, 3), existingRow?.p3);
  data.cellInputOrOutput3 = '1';

  data.p4 = firstNonEmpty(combinRow.p4, existingRow?.p4);
  data.cellInputOrOutput4 = '1';
  data.p5 = firstNonEmpty(combinRow.p5, existingRow?.p5);
  data.cellInputOrOutput5 = '1';
  data.p6 = firstNonEmpty(combinRow.p6, existingRow?.p6);
  data.cellInputOrOutput6 = '1';
  data.p7 = firstNonEmpty(combinRow.p10, existingRow?.p7);
  data.cellInputOrOutput7 = '1';
  data.p8 = firstNonEmpty(jsqStyle, existingRow?.p8);
  data.cellInputOrOutput8 = '1';
  data.p9 = firstNonEmpty(combinRow.p11, existingRow?.p9);
  data.cellInputOrOutput9 = '1';
  data.p10 = firstNonEmpty(combinRow.p12, existingRow?.p10);
  data.cellInputOrOutput10 = '1';

  // 总减速比：page7 p23 / page6 p16；combin p16 是舟它最大空载转速
  data.p11 = firstNonEmpty(readTableCell(page7Row, 23), readTableCell(page6Row, 16), existingRow?.p11);
  data.cellInputOrOutput11 = '1';

  data.p12 = firstNonEmpty(existingRow?.p12);
  data.cellInputOrOutput12 = '1';
  data.p13 = firstNonEmpty(existingRow?.p13);
  data.cellInputOrOutput13 = '1';
  data.p14 = firstNonEmpty(existingRow?.p14);
  data.cellInputOrOutput14 = '1';

  return data;
}

/** 从组合方案表刷新（原 initData） */
export function applyPage5InitData(
  list: Page5ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Page5InitResult {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);

  const combinList = resolveTableRows(sources, [{ tableNum: PAGE4_TABLE_NUM, componentId: PAGE4_TABLE_COMPONENT_ID }], 16);
  const page7List = resolveTableRows(sources, [{ tableNum: PAGE7_TABLE_NUM, componentId: PAGE7_TABLE_COMPONENT_ID }], 28);
  const page6List = resolveTableRows(sources, [{ tableNum: PAGE6_TABLE_NUM, componentId: PAGE6_TABLE_COMPONENT_ID }], 16);

  const jsqStyle = readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ1_5_MDJSQXS');
  const dxlbStr = readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ1_5_DXLB');
  const equivalent = dxlbStr ? Number(dxlbStr) : 0;

  const existingRows = list[0]?.tableMap?.rowData ?? [];

  const dataList = combinList.map((item, index) => {
    const schemeLabel = `组合方案${index + 1}`;
    const page7Row = findRowByScheme(page7List, index, schemeLabel);
    const page6Row = findRowByScheme(page6List, index, schemeLabel);
    const existingRow = findRowByScheme(existingRows as Array<Record<string, string | number | undefined>>, index, schemeLabel) as Page5TableRow | undefined;
    return buildRowFromCombin(index, item, jsqStyle, page7Row, page6Row, existingRow);
  });

  if (!list[0]?.tableMap) {
    return { ok: false, equivalent };
  }
  if (dataList.length === 0) {
    return { ok: false, equivalent };
  }

  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;
  return { ok: true, equivalent };
}
