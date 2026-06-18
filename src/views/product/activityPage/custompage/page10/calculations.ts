import { handleCutZero } from '@/utils/tools';
import {
  PAGE10_ALL_DEGREE_PREFIX,
  PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE,
  PAGE10_DEGREE_DISPLAY_TABLE_COMPONENT_ID,
  PAGE10_DEGREE_TABLE_NUM,
  PAGE10_INPUT_TABLE_COMPONENT_ID,
  PAGE10_INPUT_TABLE_NUM,
  type Page10DegreeRow,
  type Page10ParameterItem,
  type Page10SchemeRow,
} from './parameterDefaults';

export type Page10DegreeCalculationContext = {
  schemeRow?: Page10SchemeRow;
};

export type Page10TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage10TableColNums(tableMap?: Page10ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage10RowToCValueFormat(
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

function resolvePage10TableComponentId(item: Page10ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;

  const tableNum = String(item.tableNum ?? '').trim();
  if (tableNum === PAGE10_INPUT_TABLE_NUM) return PAGE10_INPUT_TABLE_COMPONENT_ID;
  if (tableNum === PAGE10_DEGREE_TABLE_NUM) return PAGE10_DEGREE_DISPLAY_TABLE_COMPONENT_ID;

  const schemeMatch = tableNum.match(new RegExp(`^${PAGE10_ALL_DEGREE_PREFIX}(\\d+)$`));
  if (schemeMatch) {
    const idx = Number(schemeMatch[1]);
    if (!Number.isNaN(idx)) return PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE + idx;
  }
  return undefined;
}

/** values：传动效率、选择行索引等单行参数 */
export function extractPage10SaveParamValues(list: Page10ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：输入参数表、角度修正表及按方案全角度校核表 */
export function extractPage10TableSavePayload(list: Page10ParameterItem[]): Page10TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage10TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage10TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage10RowToCValueFormat(row, colNums));
      if (!rowData.length) return null;
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
    .filter((row): row is Page10TableSaveRow => row != null);
}

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 全角度性能校核计算（原 calculation） */
export function calculateAllPage10DegreeRows(
  rows: Page10DegreeRow[],
  context?: Page10DegreeCalculationContext,
) {
  const result: Page10DegreeRow[] = [];
  const schemeMaxTorque = toNumber(context?.schemeRow?.p1);
  const schemeTotalRatio = toNumber(context?.schemeRow?.p10);
  const useSchemeMaxTorque = schemeMaxTorque > 0 && schemeTotalRatio > 0;

  rows.forEach(row => {
    const data = { ...row };
    const parm1 = toNumber(data.p1);
    const parm2 = toNumber(data.p2);
    const parm5 = toNumber(data.p5);
    const parm6 = toNumber(data.p6);
    const parm7 = toNumber(data.p7);

    let val0 = parm7 / parm6 / parm1;
    if (Number.isNaN(val0) || !Number.isFinite(val0)) val0 = 0;
    data.p11 = val0.toFixed(2);

    let val00 = toNumber(data.p8) - toNumber(data.p10) * val0;
    if (Number.isNaN(val00) || !Number.isFinite(val00)) val00 = 0;
    data.p12 = handleCutZero(val00.toFixed(2));

    // 方案表「舟它最大输出力矩」为零位输出力矩（已含传动效率），按修正减速比缩放即可；
    // 勿再用 电机最大转矩×传动效率×减速比 重算，否则会等效多乘一次传动效率。
    let val = 0;
    if (useSchemeMaxTorque && parm1 > 0) {
      val = (schemeMaxTorque * parm1) / schemeTotalRatio;
    } else {
      val = parm5 * parm6 * parm1;
    }
    if (Number.isNaN(val) || !Number.isFinite(val)) val = 0;
    data.p13 = val.toFixed(2);

    let val2 = (parm2 * 6) / parm1;
    if (Number.isNaN(val2) || !Number.isFinite(val2)) val2 = 0;
    data.p14 = handleCutZero(val2.toFixed(2));

    let val3 = (val00 / parm1) * (360 / 6.283);
    if (Number.isNaN(val3) || !Number.isFinite(val3)) val3 = 0;
    data.p15 = handleCutZero(val3.toFixed(2));

    result.push(data);
  });

  return result;
}
