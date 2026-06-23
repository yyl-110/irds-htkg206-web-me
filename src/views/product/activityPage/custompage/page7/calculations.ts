import { handleCutZero } from '@/utils/tools';
import { computeRatedLoadMotorSpeedFromRow } from './calcAuxParams';
import {
  PAGE7_TABLE_COMPONENT_ID,
  PAGE7_TABLE_NUM,
  type Page7ParameterItem,
  type Page7TableRow,
} from './parameterDefaults';

export type Page7TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage7TableColNums(tableMap?: Page7ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage7RowToCValueFormat(
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

function resolvePage7TableComponentId(item: Page7ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === PAGE7_TABLE_NUM) return PAGE7_TABLE_COMPONENT_ID;
  return undefined;
}

/** values：本页无单行参数，返回空数组 */
export function extractPage7SaveParamValues(list: Page7ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的性能校核表（page7 专用 componentId=22） */
export function extractPage7TableSavePayload(list: Page7ParameterItem[]): Page7TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage7TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage7TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage7RowToCValueFormat(row, colNums));
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
    .filter((row): row is Page7TableSaveRow => row != null);
}

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 性能校核计算（原 calculation） */
export function calculateAllPage7Rows(rows: Page7TableRow[]) {
  rows.forEach(row => {
    row.p21 = computeRatedLoadMotorSpeedFromRow(row);

    const parm13 = toNumber(row.p15);
    const parm16 = toNumber(row.p18);
    const parm17 = toNumber(row.p19);
    const parm18 = toNumber(row.p23);
    const parm19 = toNumber(row.p21);

    let val = parm16 * parm17 * parm18;
    if (Number.isNaN(val)) val = 0;
    row.p24 = handleCutZero(val.toFixed(2));

    let val1 = ((parm19 / parm18) * 360) / 6.283;
    if (Number.isNaN(val1) || parm18 === 0) val1 = 0;
    row.p25 = handleCutZero(val1.toFixed(2));

    let val2 = (parm13 * 6) / parm18;
    if (Number.isNaN(val2) || parm18 === 0) val2 = 0;
    row.p26 = handleCutZero(val2.toFixed(2));
  });
  return rows;
}
