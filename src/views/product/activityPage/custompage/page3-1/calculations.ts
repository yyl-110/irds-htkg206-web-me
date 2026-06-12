import { handleCutZero } from '@/utils/tools';
import type { Page3_1ParameterItem, Page3_1TableRow } from './parameterDefaults';
import { PAGE3_1_TABLE_COMPONENT_ID } from './parameterDefaults';

export type Page3_1TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage3_1TableColNums(tableMap?: Page3_1ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage3_1RowToCValueFormat(row: Record<string, string | number | undefined>, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：本页无单行参数，返回空数组 */
export function extractPage3_1SaveParamValues(list: Page3_1ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的初始性能计算表 */
export function extractPage3_1TableSavePayload(list: Page3_1ParameterItem[]): Page3_1TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = getPage3_1TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage3_1RowToCValueFormat(row, colNums));
      const rawId = String(item.componentId ?? PAGE3_1_TABLE_COMPONENT_ID).trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : item.componentId!;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    });
}

function isFiniteNumber(val: number) {
  return !Number.isNaN(val) && val !== Infinity && val !== -Infinity;
}

/** 对单行执行初始性能计算（原 calculation 方法） */
export function calculatePage3_1Row(item: Page3_1TableRow) {
  const parm2 = item.p1;
  const parm3 = item.p2;
  const parm4 = item.p3;
  const parm5 = item.p4;
  const parm6 = item.p5;
  const parm7 = item.p6;
  const parm8 = item.p7;

  const val = (Number(parm2) * 6.283) / 60;
  if (isFiniteNumber(val)) {
    item.p8 = handleCutZero(val.toFixed(3));
  }

  const val1 = (Number(parm3) * 6.283) / 60;
  if (isFiniteNumber(val1)) {
    item.p9 = handleCutZero(val1.toFixed(3));
  }

  const val2 = (Number(val) - Number(val1)) / Number(parm4);
  if (isFiniteNumber(val2)) {
    item.p10 = handleCutZero(val2.toFixed(3));
  }

  const val3 = Number(parm8) / Number(parm6) / Number(parm7);
  if (isFiniteNumber(val3)) {
    item.p11 = handleCutZero(val3.toFixed(3));
  }

  const val4 = Number(val) - Number(val2) * Number(val3);
  if (isFiniteNumber(val4)) {
    item.p12 = handleCutZero(val4.toFixed(3));
  }

  const val5 = Number(parm5) * Number(parm6) * Number(parm7);
  if (isFiniteNumber(val5)) {
    item.p13 = handleCutZero(val5.toFixed(3));
  }

  const val6 = (Number(parm2) * 6) / Number(parm7);
  if (isFiniteNumber(val6)) {
    item.p14 = handleCutZero(val6.toFixed(3));
  }

  const val7 = ((Number(val4) / Number(parm7)) * 360) / 6.283;
  if (isFiniteNumber(val7)) {
    item.p15 = handleCutZero(val7.toFixed(3));
  }
}

export function calculateAllPage3_1Rows(rows: Page3_1TableRow[]) {
  rows.forEach(row => calculatePage3_1Row(row));
  return rows;
}
