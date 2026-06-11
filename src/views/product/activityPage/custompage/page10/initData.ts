import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { INIT_XN_TABLE_NUM } from '../page4/initData';
import { PAGE9_INPUT_TABLE_NUM } from '../page9/parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  allDegreeTableNum,
  createDefaultDegreeRow,
  PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE,
  PAGE10_BASE_PARAM_COUNT,
  PAGE10_EFFICIENCY_PARAM,
  type Page10DegreeRow,
  type Page10ParameterItem,
  type Page10SchemeRow,
} from './parameterDefaults';

export interface Page10InitResult {
  ok: boolean;
}

export function trimExtraDegreeTables(list: Page10ParameterItem[]) {
  if (list.length > PAGE10_BASE_PARAM_COUNT) {
    list.splice(PAGE10_BASE_PARAM_COUNT);
  }
}

export function getSchemeTableRows(list: Page10ParameterItem[]): Page10SchemeRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as Page10SchemeRow[];
}

export function getDegreeDisplayRows(list: Page10ParameterItem[]): Page10DegreeRow[] {
  return (list[2]?.tableMap?.rowData ?? []) as Page10DegreeRow[];
}

export function setDegreeDisplayRows(list: Page10ParameterItem[], rows: Page10DegreeRow[]) {
  if (!list[2]?.tableMap) return;
  list[2].tableMap.rowData = rows;
  list[2].tableMap.rowNums = rows.length;
}

export function getEfficiencyValue(list: Page10ParameterItem[]): string {
  return String(list[1]?.defaultValue ?? '0.73');
}

export function setEfficiencyValue(list: Page10ParameterItem[], value: string) {
  if (list[1]) list[1].defaultValue = value;
}

export function setSelectedRowIndex(list: Page10ParameterItem[], index: number | string) {
  if (list[3]) list[3].defaultValue = String(index);
}

export function getSelectedRowIndex(list: Page10ParameterItem[]): number {
  return Number(list[3]?.defaultValue ?? -1);
}

function buildDegreeRowFromXn(xnRow: Record<string, string | number | undefined>): Page10DegreeRow {
  return createDefaultDegreeRow({
    p0: '',
    p1: '',
    p2: String(xnRow.p1 ?? ''),
    p3: String(xnRow.p2 ?? ''),
    p4: String(xnRow.p3 ?? ''),
    p5: String(xnRow.p4 ?? ''),
    p6: String(xnRow.p5 ?? ''),
    p7: String(xnRow.p7 ?? ''),
    p8: String(xnRow.p8 ?? ''),
    p9: String(xnRow.p9 ?? ''),
    p10: String(xnRow.p10 ?? ''),
    p11: String(xnRow.p11 ?? ''),
    p12: String(xnRow.p12 ?? ''),
    p13: '',
    p14: '',
    p15: '',
    p16: String(xnRow.p16 ?? ''),
  });
}

/** 从 page9 输入参数等刷新（原 initData） */
export function applyPage10InitData(list: Page10ParameterItem[], pageId: string, userId = ''): Page10InitResult {
  const tableList = getFlowTableList();
  const paramList = getFlowParameterList();

  let checkGearPowerList: Page10SchemeRow[] = [];
  let djInitXnList: Array<Record<string, string | number | undefined>> = [];
  let djList: Array<Record<string, string | number | undefined>> = [];

  tableList.forEach(item => {
    if (item.tablenum === PAGE9_INPUT_TABLE_NUM) {
      checkGearPowerList = (item.rowdata ?? []) as Page10SchemeRow[];
    }
    if (item.tablenum === INIT_XN_TABLE_NUM) {
      djInitXnList = item.rowdata ?? [];
    }
    if (item.tablenum === MOTOR_SELECT_TABLE_NUM) {
      djList = item.rowdata ?? [];
    }
  });

  if (!list[0]?.tableMap || checkGearPowerList.length === 0) {
    return { ok: false };
  }

  let cdxl = getEfficiencyValue(list);
  paramList.forEach(item => {
    if (item.paramnum === PAGE10_EFFICIENCY_PARAM) {
      cdxl = String(item.paramvalue ?? cdxl);
      setEfficiencyValue(list, cdxl);
    }
  });

  djInitXnList.forEach(item => {
    djList.forEach(item1 => {
      if (item.p0 === item1.p1) {
        item.p16 = item1.p2;
      }
    });
  });

  list[0].tableMap.rowData = checkGearPowerList;
  list[0].tableMap.rowNums = checkGearPowerList.length;

  trimExtraDegreeTables(list);

  checkGearPowerList.forEach((schemeRow, index) => {
    djInitXnList.forEach(xnRow => {
      if (schemeRow.p12 === xnRow.p16) {
        const rowData = [buildDegreeRowFromXn(xnRow)];
        list.push({
          inputType: 'table',
          ifSingleLine: 't',
          pageId,
          tableMap: {
            tableType: '1',
            colNums: '16',
            rowNums: 1,
            rowData,
            colStr: [
              'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16',
            ],
          },
          tableName: '全角度性能校核计算',
          inputName: '全角度性能校核计算',
          tableType: '1',
          tableNum: allDegreeTableNum(index),
          componentId: PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE + index,
          addthis: '1',
          treeKey: 5 + index,
          userId,
        });
      }
    });
  });

  setDegreeDisplayRows(list, []);
  setSelectedRowIndex(list, -1);

  return { ok: true };
}

export function applyPage10SchemeSelection(list: Page10ParameterItem[], selected: Page10SchemeRow[]): Page10DegreeRow[] {
  if (!selected.length) return [];
  if (selected.length > 1) return [];

  const schemeRows = getSchemeTableRows(list);
  let selIndex = -1;
  schemeRows.forEach((item, index) => {
    if (item.p0 === selected[0].p0) selIndex = index;
  });
  if (selIndex < 0) return [];

  setSelectedRowIndex(list, selIndex);

  let degreeRows: Page10DegreeRow[] = [];
  list.forEach(item => {
    if (item.tableNum === allDegreeTableNum(selIndex) && item.tableMap?.rowData) {
      degreeRows = (item.tableMap.rowData as Page10DegreeRow[]).map(row => ({ ...row }));
    }
  });

  const efficiency = getEfficiencyValue(list);
  degreeRows.forEach(row => {
    row.p6 = efficiency;
  });

  return degreeRows;
}

export function syncCalculatedDegreeRowsToSource(
  list: Page10ParameterItem[],
  selectedSchemeKey: string,
  rows: Page10DegreeRow[],
) {
  const schemeRows = getSchemeTableRows(list);
  let selIndex = -1;
  schemeRows.forEach((item, index) => {
    if (item.p0 === selectedSchemeKey) selIndex = index;
  });
  if (selIndex < 0) return;

  const target = list.find(item => item.tableNum === allDegreeTableNum(selIndex));
  if (target?.tableMap) {
    target.tableMap.rowData = rows.map(row => ({ ...row }));
    target.tableMap.rowNums = rows.length;
  }
}

export function applyEfficiencyToDegreeRows(list: Page10ParameterItem[], value: string) {
  const rows = getDegreeDisplayRows(list);
  if (!rows.length) return;
  rows.forEach(row => {
    row.p6 = value;
  });
  setDegreeDisplayRows(list, rows);
}
