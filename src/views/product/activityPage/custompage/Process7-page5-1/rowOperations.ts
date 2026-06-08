import { handleCutZero } from '@/utils/tools';
import { createChassisRow, TABLE_NUM, type ChassisTableRow, type Page5_1ParameterItem } from './parameterDefaults';

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

export function isBrowseType(p1: unknown) {
  return p1 === '浏览' || p1 === '1' || p1 === 1;
}

export function addTableRow(parameterTempList: Page5_1ParameterItem[]) {
  const rows = [...(parameterTempList[8]?.tableMap?.rowData ?? [])] as ChassisTableRow[];
  const num = rows.length + 1;
  rows.push(
    createChassisRow({
      p0: num,
      p1: 1,
      delIndex: rows.length,
    }),
  );
  parameterTempList[8].tableMap!.rowData = rows;
}

export function deleteTableRows(parameterTempList: Page5_1ParameterItem[], selectedRows: ChassisTableRow[]) {
  let rows = [...(parameterTempList[8]?.tableMap?.rowData ?? [])] as ChassisTableRow[];
  selectedRows.forEach(selected => {
    rows = rows.filter(row => {
      if (selected.id != null && row.id != null) return selected.id !== row.id;
      return selected.delIndex !== row.delIndex;
    });
  });
  rows.forEach((row, index) => {
    row.p0 = String(index + 1);
  });
  parameterTempList[8].tableMap!.rowData = rows;
}

export function runCalculation(parameterTempList: Page5_1ParameterItem[]) {
  const list = parameterTempList[8]?.tableMap?.rowData ?? [];
  if (!list.length) return;

  let heightSum = 0;
  let currentSum = 0;
  const depths: number[] = [];
  const widths: number[] = [];

  list.forEach(item => {
    heightSum += Number(item.p4);
    currentSum += Number(item.p9);
    depths.push(Number(item.p5));
    widths.push(Number(item.p6));
  });

  parameterTempList[9].defaultValue = handleCutZero(heightSum.toFixed(2));
  parameterTempList[10].defaultValue = handleCutZero((heightSum * 44.45).toFixed(2));
  parameterTempList[11].defaultValue = handleCutZero(Math.max(...depths).toFixed(2));
  parameterTempList[12].defaultValue = handleCutZero(Math.max(...widths).toFixed(2));
  parameterTempList[13].defaultValue = handleCutZero(currentSum.toFixed(2));
}

export interface ModuleOkPayload {
  para1?: string;
  para3?: string;
  para4?: string;
  arr?: Array<{ name?: string; val?: string }>;
}

export function applyModuleBrowseResult(
  parameterTempList: Page5_1ParameterItem[],
  selectRow: number,
  payload: ModuleOkPayload,
  tableNum: string = TABLE_NUM,
) {
  const moduleName = payload.para3 ?? '';
  const moduleNum = payload.para1 ?? '';
  const moduleType = payload.para4 ?? '';
  const propStr = payload.arr ?? [];
  const thLength = 10;

  const tableItem = parameterTempList.find(item => item.tableNum === tableNum);
  if (!tableItem?.tableMap?.rowData?.[selectRow]) return;

  const row = tableItem.tableMap.rowData[selectRow] as ChassisTableRow;
  if (row.cellParaType2 === '模块库读取值') row.p2 = moduleNum;
  if (row.cellParaType3 === '模块库读取值') row.p3 = moduleName;
  if (row.cellParaType12 === '模块库读取值') row.p12 = moduleType;

  propStr.forEach(prop => {
    for (let j = 2; j < thLength; j += 1) {
      const parentNum = row[`cellParentNum${j}`];
      const parameterNum = row[`parameterNum${j}`];
      if (parentNum === prop.name || parameterNum === prop.name) {
        if (row[`cellParaType${j}`] === '模块库读取值') {
          row[`p${j}`] = prop.val;
        }
      }
    }
  });
}
