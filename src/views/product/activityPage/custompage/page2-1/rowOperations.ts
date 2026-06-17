import {
  createDefaultReducerRow,
  REDUCER_TABLE_INDEX,
  REDUCER_TABLE_NUM,
  type Page2_1ParameterItem,
  type Page2_1TableRow,
} from './parameterDefaults';

export const MODULE_READ_CELL_TYPE = '模块库读取值';
const REDUCER_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'];

export function getReducerTableRows(list: Page2_1ParameterItem[]): Page2_1TableRow[] {
  return list[REDUCER_TABLE_INDEX]?.tableMap?.rowData ?? [];
}

function ensureReducerRowDelIndexes(rows: Page2_1TableRow[]) {
  rows.forEach((row, index) => {
    row.delIndex = index;
  });
}

export function setReducerTableRows(list: Page2_1ParameterItem[], rows: Page2_1TableRow[]) {
  if (!list[REDUCER_TABLE_INDEX]?.tableMap) return;
  ensureReducerRowDelIndexes(rows);
  list[REDUCER_TABLE_INDEX].tableMap!.rowData = rows;
  list[REDUCER_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[REDUCER_TABLE_INDEX].tableMap!.colStr = REDUCER_COL_STR;
}

export function addReducerRow(list: Page2_1ParameterItem[]) {
  const rows = [...getReducerTableRows(list)];
  const num = rows.length + 1;
  rows.push(createDefaultReducerRow(num, rows.length));
  setReducerTableRows(list, rows);
}

export function deleteReducerRows(list: Page2_1ParameterItem[], selectedRows: Page2_1TableRow[]) {
  let rows = [...getReducerTableRows(list)];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => row.delIndex !== selected.delIndex);
  });
  rows.forEach((row, index) => {
    row.p1 = `减速器${index + 1}`;
  });
  setReducerTableRows(list, rows);
}

export function applyModuleLibraryToRow(
  list: Page2_1ParameterItem[],
  rowIndex: number,
  payload: { row?: Record<string, unknown>; columns?: Array<Record<string, unknown>> },
) {
  const tableItem = list.find(item => item.tableNum === REDUCER_TABLE_NUM);
  if (!tableItem?.tableMap?.rowData?.[rowIndex]) return;

  const targetRow = tableItem.tableMap.rowData[rowIndex];
  const dataRow = payload.row ?? {};
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const thLength = 14;

  columns.forEach(col => {
    const parameterNum = String(col.parameterNum ?? col.paramNum ?? col.paramCode ?? '').trim();
    const dataIndex = String(col.dataIndex ?? '').trim();
    if (!parameterNum || !dataIndex) return;
    const val = String(dataRow[dataIndex] ?? '');
    if (!val) return;

    for (let j = 2; j < thLength; j++) {
      const parentNum = String(targetRow[`cellParentNum${j}`] ?? '').trim();
      const paramNum = String(targetRow[`parameterNum${j}`] ?? '').trim();
      const cellType = String(targetRow[`cellParaType${j}`] ?? '');
      if (cellType !== MODULE_READ_CELL_TYPE) continue;
      if (parentNum === parameterNum || paramNum === parameterNum) {
        targetRow[`p${j}`] = val;
      }
    }
  });

  tableItem.tableMap.rowData = [...tableItem.tableMap.rowData];
}

