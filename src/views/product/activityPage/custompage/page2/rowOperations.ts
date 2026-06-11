import { createDefaultMotorRow, type Page2ParameterItem, type Page2TableRow } from './parameterDefaults';

export const MOTOR_SELECT_TABLE_NUM = 'DJ2_T_MOTORSELECT';
export const MODULE_READ_CELL_TYPE = '模块库读取值';

export function getMotorTableRows(list: Page2ParameterItem[]): Page2TableRow[] {
  return list[2]?.tableMap?.rowData ?? [];
}

function ensureMotorRowDelIndexes(rows: Page2TableRow[]) {
  rows.forEach((row, index) => {
    row.delIndex = index;
  });
}

export function setMotorTableRows(list: Page2ParameterItem[], rows: Page2TableRow[]) {
  if (!list[2]?.tableMap) return;
  ensureMotorRowDelIndexes(rows);
  list[2].tableMap.rowData = rows;
  list[2].tableMap.rowNums = rows.length;
  list[2].tableMap.colStr = [
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
    'p17',
    'p18',
    'p19',
    'p20',
  ];
}

export function addMotorRow(list: Page2ParameterItem[]) {
  const rows = [...getMotorTableRows(list)];
  const num = rows.length + 1;
  rows.push(createDefaultMotorRow(num, rows.length));
  setMotorTableRows(list, rows);
}

export function deleteMotorRows(list: Page2ParameterItem[], selectedRowKeys: Array<string | number>) {
  const deleteSet = new Set(
    selectedRowKeys.map(key => Number(key)).filter(index => !Number.isNaN(index) && index >= 0),
  );
  if (!deleteSet.size) return;

  const rows = getMotorTableRows(list).filter((_, index) => !deleteSet.has(index));
  rows.forEach((row, index) => {
    row.p1 = `电机${index + 1}`;
  });
  setMotorTableRows(list, rows);
}

export function applyModuleLibraryToRow(
  list: Page2ParameterItem[],
  rowIndex: number,
  payload: { row?: Record<string, unknown>; columns?: Array<Record<string, unknown>> },
) {
  const tableItem = list.find(item => item.tableNum === MOTOR_SELECT_TABLE_NUM);
  if (!tableItem?.tableMap?.rowData?.[rowIndex]) return;

  const targetRow = tableItem.tableMap.rowData[rowIndex];
  const dataRow = payload.row ?? {};
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const thLength = 20;

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
