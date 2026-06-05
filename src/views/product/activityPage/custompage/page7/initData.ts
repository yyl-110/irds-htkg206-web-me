import { REDUCER_TABLE_NUM } from '../page2-1/parameterDefaults';
import { INIT_XN_TABLE_NUM } from '../page4/initData';
import { PAGE5_TABLE_NUM } from '../page5/parameterDefaults';
import { PAGE6_TABLE_NUM } from '../page6/parameterDefaults';
import { getFlowTableList } from '../shared/flowContext';
import type { Page7ParameterItem, Page7TableRow } from './parameterDefaults';

export interface Page7InitResult {
  ok: boolean;
}

function buildRow(
  zjsbRow: Record<string, string | number | undefined>,
  xnRow: Record<string, string | number | undefined>,
  jsqCode: string,
  gearDispatchList: Array<Record<string, string | number | undefined>>,
): Page7TableRow {
  const data: Page7TableRow = {};
  data.p0 = String(zjsbRow.p0 ?? '');
  data.p1 = String(zjsbRow.p1 ?? '');
  data.p2 = String(zjsbRow.p2 ?? '');
  data.p3 = String(zjsbRow.p3 ?? '');
  data.p4 = String(zjsbRow.p4 ?? '');
  data.p5 = String(zjsbRow.p5 ?? '');
  data.p6 = String(zjsbRow.p6 ?? '');
  data.p7 = String(zjsbRow.p7 ?? '');
  data.p8 = String(zjsbRow.p8 ?? '');
  data.p9 = String(zjsbRow.p9 ?? '');
  data.p10 = String(zjsbRow.p10 ?? '');
  data.p11 = String(zjsbRow.p11 ?? '');
  data.p12 = String(zjsbRow.p12 ?? '');
  data.p13 = String(zjsbRow.p13 ?? '');
  data.p14 = String(zjsbRow.p14 ?? '');
  data.p15 = String(xnRow.p1 ?? '');
  data.p16 = String(xnRow.p2 ?? '');
  data.p17 = String(xnRow.p3 ?? '');
  data.p18 = String(xnRow.p4 ?? '');
  data.p19 = String(xnRow.p5 ?? '');
  data.p20 = String(xnRow.p6 ?? '');

  const fzzj = Number(xnRow.p7) / Number(xnRow.p5) / Number(zjsbRow.p16);
  const fzzs = Number(xnRow.p8) - Number(xnRow.p10) * fzzj;
  data.p21 = Number.isFinite(fzzs) ? fzzs.toFixed(2) : '';
  data.p22 = String(zjsbRow.p15 ?? '');
  data.p23 = String(zjsbRow.p16 ?? '');
  data.p24 = '';
  data.p25 = '';
  data.p26 = '';
  data.p27 = '';
  data.p28 = jsqCode;

  gearDispatchList.forEach(item => {
    if (item.p0 === data.p0) {
      data.p27 = String(item.p4 ?? '');
    }
  });

  return data;
}

/** 从 page6 / page3 / page2-1 / page5 流程表刷新（原 initData） */
export function applyPage7InitData(list: Page7ParameterItem[]): Page7InitResult {
  const tableList = getFlowTableList();

  let zjsbList: Array<Record<string, string | number | undefined>> = [];
  let xnList: Array<Record<string, string | number | undefined>> = [];
  let jsqList: Array<Record<string, string | number | undefined>> = [];
  let gearDispatchList: Array<Record<string, string | number | undefined>> = [];

  tableList.forEach(item => {
    if (item.tablenum === PAGE6_TABLE_NUM) {
      zjsbList = item.rowdata ?? [];
    }
    if (item.tablenum === INIT_XN_TABLE_NUM) {
      xnList = item.rowdata ?? [];
    }
    if (item.tablenum === REDUCER_TABLE_NUM) {
      jsqList = item.rowdata ?? [];
    }
    if (item.tablenum === PAGE5_TABLE_NUM) {
      gearDispatchList = item.rowdata ?? [];
    }
  });

  const dataList: Page7TableRow[] = [];

  xnList.forEach(xnRow => {
    for (let i = 0; i < jsqList.length; i++) {
      const jsqCode = String(jsqList[i].p2 ?? '').trim();
      if (!jsqCode) continue;

      const zjsbRow = zjsbList[dataList.length];
      if (!zjsbRow) continue;

      dataList.push(buildRow(zjsbRow, xnRow, jsqCode, gearDispatchList));
    }
  });

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
