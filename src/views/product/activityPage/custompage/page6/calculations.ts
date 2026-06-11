import { handleCutZero } from '@/utils/tools';
import {
  PAGE6_TABLE_COMPONENT_ID,
  PAGE6_TABLE_NUM,
  type Page6ParameterItem,
  type Page6TableRow,
} from './parameterDefaults';

export type Page6TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage6TableColNums(tableMap?: Page6ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage6RowToCValueFormat(
  row: Record<string, string | number | undefined>,
  colNums: number,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

function resolvePage6TableComponentId(item: Page6ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === PAGE6_TABLE_NUM) return PAGE6_TABLE_COMPONENT_ID;
  return undefined;
}

/** values：本页无单行参数，返回空数组 */
export function extractPage6SaveParamValues(list: Page6ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的齿数/实际总减速比表（page6 专用 componentId=21） */
export function extractPage6TableSavePayload(list: Page6ParameterItem[]): Page6TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage6TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage6TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage6RowToCValueFormat(row, colNums));
      const rawId = String(resolvedId).trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : resolvedId;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    })
    .filter((row): row is Page6TableSaveRow => row != null);
}

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) {
    return 0;
  }
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 确定齿数与实际总减速比计算（原 calculation） */
export function calculateAllPage6Rows(rows: Page6TableRow[]) {
  rows.forEach(row => {
    const parm4 = toNumber(row.p4);
    const parm5 = toNumber(row.p5);
    const parm9 = toNumber(row.p9);
    const parm10 = toNumber(row.p10);
    const parm11 = toNumber(row.p11);
    const parm12 = toNumber(row.p12);
    const parm13 = toNumber(row.p13);
    const parm14 = toNumber(row.p14);

    let val = 0;
    if (parm9 !== 0) {
      val = parm10 / parm9;
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
    if (parm12 !== 0 && parm11 !== 0 && val !== 0) {
      val = (val * parm12) / parm11;
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
    if (parm13 !== 0 && parm14 !== 0 && val !== 0) {
      val = (val * parm14) / parm13;
    }

    row.p15 = handleCutZero(val.toFixed(2));

    let val1 = (parm4 * val) / parm5;
    if (Number.isNaN(val1) || parm5 === 0) {
      val1 = 0;
    }
    row.p16 = handleCutZero(val1.toFixed(2));
  });
  return rows;
}
