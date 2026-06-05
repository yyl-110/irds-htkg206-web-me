import { REDUCER_TABLE_NUM } from '../page2-1/parameterDefaults';
import { PAGE5_TABLE_NUM } from '../page5/parameterDefaults';
import { PAGE6_TABLE_NUM } from '../page6/parameterDefaults';
import { PAGE7_TABLE_NUM } from '../page7/parameterDefaults';
import { getFlowTableList } from '../shared/flowContext';
import type { Page8ParameterItem, Page8TableRow } from './parameterDefaults';

export interface Page8InitResult {
  ok: boolean;
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
  data.p0 = String(dispatchRow.p0 ?? '');
  data.p1 = String(dispatchRow.p1 ?? '');
  data.p2 = String(dispatchRow.p2 ?? '');
  data.p3 = String(dispatchRow.p3 ?? '');
  data.p4 = String(csRow.p9 ?? '');
  data.p5 = String(csRow.p10 ?? '');
  data.p6 = String(csRow.p11 ?? '');
  data.p7 = String(csRow.p12 ?? '');
  data.p8 = String(csRow.p13 ?? '');
  data.p9 = String(csRow.p14 ?? '');
  data.p10 = String(csRow.p16 ?? '');
  data.p11 = String(csRow.p8 ?? '');
  data.p12 = String(dispatchRow.p4 ?? '');
  data.p13 = String(dispatchRow.p5 ?? '');
  data.p14 = String(dispatchRow.p6 ?? '');
  data.p15 = xnRow ? String(xnRow.p18 ?? '') : '';
  data.p16 = xnRow ? String(xnRow.p17 ?? '') : '';
  data.p17 = String(dispatchRow.p7 ?? '');
  data.p18 = '';
  data.p19 = String(dispatchRow.p9 ?? '');
  data.p20 = String(dispatchRow.p10 ?? '');

  reducerList.forEach(item => {
    if (item.p2 === dispatchRow.p7) {
      data.p18 = String(item.p3 ?? '');
    }
  });

  applyGearLevelDisplay(data);
  return data;
}

/** 从 page5/6/7/2-1 流程表刷新（原 initData） */
export function applyPage8InitData(list: Page8ParameterItem[]): Page8InitResult {
  const tableList = getFlowTableList();

  let gearDispatchList: Array<Record<string, string | number | undefined>> = [];
  let csZjsbList: Array<Record<string, string | number | undefined>> = [];
  let xnList: Array<Record<string, string | number | undefined>> = [];
  let reducerList: Array<Record<string, string | number | undefined>> = [];

  tableList.forEach(item => {
    if (item.tablenum === REDUCER_TABLE_NUM) {
      reducerList = item.rowdata ?? [];
    }
    if (item.tablenum === PAGE5_TABLE_NUM) {
      gearDispatchList = item.rowdata ?? [];
    }
    if (item.tablenum === PAGE6_TABLE_NUM) {
      csZjsbList = item.rowdata ?? [];
    }
    if (item.tablenum === PAGE7_TABLE_NUM) {
      xnList = item.rowdata ?? [];
    }
  });

  const dataList = gearDispatchList
    .map((item, index) => {
      const csRow = csZjsbList[index];
      if (!csRow) return null;
      return buildRow(item, csRow, xnList[index], reducerList);
    })
    .filter((row): row is Page8TableRow => row !== null);

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
