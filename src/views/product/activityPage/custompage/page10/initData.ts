import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { INIT_XN_TABLE_NUM } from '../page4/initData';
import { PAGE9_INPUT_TABLE_NUM } from '../page9/parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  allDegreeTableNum,
  createDefaultDegreeRow,
  PAGE10_ALL_DEGREE_PREFIX,
  PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE,
  PAGE10_BASE_PARAM_COUNT,
  PAGE10_DEGREE_TABLE_NUM,
  PAGE10_EFFICIENCY_PARAM,
  type Page10DegreeRow,
  type Page10ParameterItem,
  type Page10SchemeRow,
} from './parameterDefaults';
import { getPage10EditableFieldIndexes } from './tableColumns';

export interface Page10InitResult {
  ok: boolean;
}

type DegreeEditableSnapshot = Map<string, Partial<Page10DegreeRow>>;

function isPage10DegreeTable(item: Page10ParameterItem): boolean {
  const tableNum = String(item.tableNum ?? '');
  return tableNum === PAGE10_DEGREE_TABLE_NUM || tableNum.startsWith(`${PAGE10_ALL_DEGREE_PREFIX}`);
}

export function captureDegreeEditableValues(rows: Page10DegreeRow[]): DegreeEditableSnapshot {
  const editableIndexes = getPage10EditableFieldIndexes();
  const saved = new Map<string, Partial<Page10DegreeRow>>();

  rows.forEach((row, rowIndex) => {
    const key = String(row.p0 ?? '').trim() || String(rowIndex);
    const patch: Partial<Page10DegreeRow> = {};
    editableIndexes.forEach(index => {
      patch[`p${index}`] = row[`p${index}`];
      const flag = row[`cellInputOrOutput${index}`];
      if (flag !== undefined && flag !== '') {
        patch[`cellInputOrOutput${index}`] = flag;
      }
      const override = row[`cellUserOverride${index}`];
      if (override !== undefined && override !== '') {
        patch[`cellUserOverride${index}`] = override;
      }
    });
    saved.set(key, patch);
  });
  return saved;
}

export function restoreDegreeEditableValues(
  rows: Page10DegreeRow[],
  saved: DegreeEditableSnapshot,
  options?: { preserveOnlySavedOrManual?: boolean },
) {
  const editableIndexes = getPage10EditableFieldIndexes();
  const preserveOnlySavedOrManual = options?.preserveOnlySavedOrManual ?? false;

  rows.forEach((row, rowIndex) => {
    const key = String(row.p0 ?? '').trim() || String(rowIndex);
    const patch = saved.get(key) ?? saved.get(String(rowIndex));
    if (!patch) return;

    editableIndexes.forEach(index => {
      const field = `p${index}`;
      if (!(field in patch)) return;

      const overrideField = `cellUserOverride${index}`;
      const hasOverride = patch[overrideField] === '1';
      const hasValue = String(patch[field] ?? '') !== '';
      if (preserveOnlySavedOrManual && !hasOverride && !hasValue) return;

      row[field] = patch[field];

      const flagField = `cellInputOrOutput${index}`;
      if (flagField in patch) {
        row[flagField] = patch[flagField];
      }
      if (overrideField in patch) {
        row[overrideField] = patch[overrideField];
      }
    });
  });
}

export function captureAllPage10DegreeTablesEditable(
  list: Page10ParameterItem[],
): Map<string, DegreeEditableSnapshot> {
  const result = new Map<string, DegreeEditableSnapshot>();
  list.forEach(item => {
    if (!isPage10DegreeTable(item)) return;
    const tableNum = String(item.tableNum ?? '');
    const rows = (item.tableMap?.rowData ?? []) as Page10DegreeRow[];
    result.set(tableNum, captureDegreeEditableValues(rows));
  });
  return result;
}

export function restoreAllPage10DegreeTablesEditable(
  list: Page10ParameterItem[],
  saved: Map<string, DegreeEditableSnapshot>,
) {
  list.forEach(item => {
    if (!isPage10DegreeTable(item)) return;
    const tableNum = String(item.tableNum ?? '');
    const snapshot = saved.get(tableNum);
    if (!snapshot) return;
    const rows = (item.tableMap?.rowData ?? []) as Page10DegreeRow[];
    restoreDegreeEditableValues(rows, snapshot);
  });
}

export function markPage10DegreeManualEdit(row: Page10DegreeRow, field: string) {
  const fieldIndex = Number(String(field).replace(/^p/, ''));
  if (!getPage10EditableFieldIndexes().includes(fieldIndex)) return;
  row[`cellUserOverride${fieldIndex}`] = '1';
}

/** 方案表无数据时，用展示表（componentId=31）已合并的后端值补全 */
export function supplementDegreeRowsFromDisplay(list: Page10ParameterItem[], degreeRows: Page10DegreeRow[]) {
  const displayRows = getDegreeDisplayRows(list);
  if (!displayRows.length || !degreeRows.length) return;

  degreeRows.forEach((row, index) => {
    const displayRow = displayRows[index] ?? displayRows[0];
    if (!displayRow) return;

    getPage10EditableFieldIndexes().forEach(fieldIndex => {
      const field = `p${fieldIndex}`;
      const current = String(row[field] ?? '');
      const fallback = String(displayRow[field] ?? '');
      if (!current && fallback) {
        row[field] = displayRow[field];
      }
    });
  });
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

  const degreeEditableSnapshot = captureAllPage10DegreeTablesEditable(list);

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
              'p0',
              'p1',
              'p2',
              'p3',
              'p4',
              'p5',
              'p6',
              'p7',
              'p8',
              'p9',
              'p10',
              'p11',
              'p12',
              'p13',
              'p14',
              'p15',
              'p16',
            ],
          },
          tableName: '全角度性能校核计算',
          inputName: '全角度性能校核计算',
          tableType: '1',
          tableNum: allDegreeTableNum(index),
          componentId: PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE + 100 + index,
          addthis: '1',
          treeKey: 5 + index,
          userId,
        });
      }
    });
  });

  restoreAllPage10DegreeTablesEditable(list, degreeEditableSnapshot);
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
  if (!degreeRows.length) return [];

  supplementDegreeRowsFromDisplay(list, degreeRows);
  const editableSnapshot = captureDegreeEditableValues(degreeRows);

  const efficiency = getEfficiencyValue(list);
  degreeRows.forEach(row => {
    row.p6 = efficiency;
  });

  restoreDegreeEditableValues(degreeRows, editableSnapshot, { preserveOnlySavedOrManual: true });

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
