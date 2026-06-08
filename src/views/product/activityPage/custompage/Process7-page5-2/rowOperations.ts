import { handleCutZero } from '@/utils/tools';
import { SELECT_TABLE_NUM, type CabinetTableRow, type Page5_2ParameterItem } from './parameterDefaults';

export interface ModuleOkPayload {
  para1?: string;
  para3?: string;
  para4?: string;
  arr?: Array<{ name?: string; val?: string }>;
}

const MODULE_READ = '模块库读取值';
const TH_LENGTH = 10;

export function applyModuleBrowseResult(
  list: Page5_2ParameterItem[],
  selectRow: number,
  payload: ModuleOkPayload,
  tableNum: string = SELECT_TABLE_NUM,
) {
  const moduleName = payload.para3 ?? '';
  const moduleNum = payload.para1 ?? '';
  const propStr = payload.arr ?? [];

  const tableItem = list.find(item => item.tableNum === tableNum);
  if (!tableItem?.tableMap?.rowData?.[selectRow]) return;

  const row = tableItem.tableMap.rowData[selectRow] as CabinetTableRow;
  if (row.cellParaType0 === MODULE_READ) row.p0 = moduleNum;
  if (row.cellParaType1 === MODULE_READ) row.p1 = moduleName;

  propStr.forEach(prop => {
    for (let j = 2; j < TH_LENGTH; j += 1) {
      const parentNum = row[`cellParentNum${j}`];
      const parameterNum = row[`parameterNum${j}`];
      if (parentNum === prop.name || parameterNum === prop.name) {
        if (row[`cellParaType${j}`] === MODULE_READ) {
          row[`p${j}`] = prop.val;
        }
      }
    }
  });
}

/** 将标准柜体行同步到复合柜体尺寸「标准」行 */
export function syncCompositeStandardRow(list: Page5_2ParameterItem[]) {
  const standardRow = list[7]?.tableMap?.rowData?.[0] as CabinetTableRow | undefined;
  const compositeStandard = list[8]?.tableMap?.rowData?.[0] as CabinetTableRow | undefined;
  if (!standardRow || !compositeStandard) return;

  compositeStandard.p0 = standardRow.p2;
  compositeStandard.p1 = standardRow.p3;
  compositeStandard.p2 = standardRow.p4;
  compositeStandard.p3 = standardRow.p5;
  compositeStandard.p4 = standardRow.p6;
  compositeStandard.p5 = standardRow.p7;
  compositeStandard.p6 = standardRow.p8;
}

export function calcCabinetDepth(list: Page5_2ParameterItem[]) {
  const val = Number(list[4]?.defaultValue ?? 0) + Number(list[25]?.defaultValue ?? 0);
  if (list[5]) list[5].defaultValue = handleCutZero(val.toFixed(2));
}

export function calcGapAndColor(list: Page5_2ParameterItem[], designH2: string) {
  if (!designH2) return false;
  const val = Number(designH2) - Number(list[10]?.defaultValue ?? 0);
  if (list[12]) list[12].defaultValue = handleCutZero(val.toFixed(2));
  return !(val > 1.4 && val < 3.2);
}

export function calcCabinetHeightH1(list: Page5_2ParameterItem[]) {
  const lower = Number(list[11]?.defaultValue ?? 0);
  const upper = Number(list[13]?.defaultValue ?? 0);
  const designH2 = Number(list[14]?.defaultValue ?? 0);
  const val = designH2 + lower + upper + 5;
  if (list[16]) list[16].defaultValue = handleCutZero(val.toFixed(2));
}

export function applyUpdateElDefaults(list: Page5_2ParameterItem[]) {
  calcCabinetDepth(list);
  if (list[9] && list[3]) {
    list[9].defaultValue = list[3].defaultValue;
  }
  const requirement = list[8]?.tableMap?.rowData?.[1] as CabinetTableRow | undefined;
  if (requirement) {
    requirement.p5 = list[1]?.defaultValue;
    requirement.p6 = list[2]?.defaultValue;
    requirement.p2 = list[3]?.defaultValue;
    requirement.p1 = list[0]?.defaultValue;
  }
  const cabinetU = Number(list[9]?.defaultValue ?? 0);
  if (list[10]) {
    list[10].defaultValue = handleCutZero((cabinetU * 44.45).toFixed(2));
  }
}

export function buildModelParametersStr(list: Page5_2ParameterItem[], startIndex: number, endIndex: number) {
  const parts: string[] = [];
  for (let i = startIndex; i <= endIndex; i += 1) {
    const paramNum = list[i]?.parameterNum;
    if (!paramNum) continue;
    parts.push(`{"Name": "${paramNum}","Type": "double","Value": "${list[i]?.defaultValue ?? ''}","Description": ""}`);
  }
  return parts.join(',');
}

export function isCompositeOverLimit(field: string, record: CabinetTableRow, rows: CabinetTableRow[]): boolean {
  if (record.p0 !== '标准' || !rows[1]) return false;
  const stdVal = Number(record[field]);
  const reqVal = Number(rows[1][field]);
  return !Number.isNaN(stdVal) && !Number.isNaN(reqVal) && stdVal > reqVal;
}
