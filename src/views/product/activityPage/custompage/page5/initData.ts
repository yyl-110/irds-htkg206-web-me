import { PAGE4_TABLE_COMPONENT_ID, PAGE4_TABLE_NUM } from '../page4/parameterDefaults';
import { collectTableSources, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import type { Page5ParameterItem, Page5TableRow } from './parameterDefaults';

export interface Page5InitResult {
  ok: boolean;
  equivalent: number;
}

function buildRowFromCombin(
  schemeIndex: number,
  combinRow: Record<string, string | number | undefined>,
  jsqStyle: string,
): Page5TableRow {
  const data: Page5TableRow = {};
  data.p0 = `组合方案${schemeIndex + 1}`;
  data.cellInputOrOutput0 = '1';
  data.p1 = String(combinRow.p1 ?? '');
  data.cellInputOrOutput1 = '1';
  data.p2 = String(combinRow.p2 ?? '');
  data.cellInputOrOutput2 = '1';
  data.p3 = String(combinRow.p3 ?? '');
  data.cellInputOrOutput3 = '1';
  data.p4 = String(combinRow.p4 ?? '');
  data.cellInputOrOutput4 = '1';
  data.p5 = String(combinRow.p5 ?? '');
  data.cellInputOrOutput5 = '1';
  data.p6 = String(combinRow.p6 ?? '');
  data.cellInputOrOutput6 = '1';
  data.p7 = String(combinRow.p10 ?? '');
  data.cellInputOrOutput7 = '1';
  data.p8 = jsqStyle;
  data.cellInputOrOutput8 = '1';
  data.p9 = String(combinRow.p11 ?? '');
  data.cellInputOrOutput9 = '1';
  data.p10 = String(combinRow.p12 ?? '');
  data.cellInputOrOutput10 = '1';
  data.p11 = String(combinRow.p16 ?? '');
  data.cellInputOrOutput11 = '1';
  data.p12 = '';
  data.cellInputOrOutput12 = '1';
  data.p13 = '';
  data.cellInputOrOutput13 = '1';
  data.p14 = '';
  data.cellInputOrOutput14 = '1';
  return data;
}

/** 从组合方案表刷新（原 initData） */
export function applyPage5InitData(
  list: Page5ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page5InitResult {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);

  const combinList = resolveTableRows(
    sources,
    [{ tableNum: PAGE4_TABLE_NUM, componentId: PAGE4_TABLE_COMPONENT_ID }],
    16,
  );

  let jsqStyle = '';
  let equivalent = 0;

  paramList.forEach(item => {
    if (jsqStyle === '' && item.paramnum === 'DJ1_5_MDJSQXS') {
      jsqStyle = item.paramvalue ?? '';
    }
    if (equivalent === 0 && item.paramnum === 'DJ1_5_DXLB' && item.paramvalue) {
      equivalent = Number(item.paramvalue);
    }
  });

  const dataList = combinList.map((item, index) => buildRowFromCombin(index, item, jsqStyle));

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
