import { handleCutZero } from '@/utils/tools';
import {
  PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID,
  PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE,
  PAGE9_GEAR_TABLE_NUM,
  PAGE9_INPUT_TABLE_COMPONENT_ID,
  PAGE9_INPUT_TABLE_NUM,
  type Page9GearRow,
  type Page9ParameterItem,
} from './parameterDefaults';

export type Page9TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage9TableColNums(tableMap?: Page9ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapPage9RowToCValueFormat(
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

function resolvePage9TableComponentId(item: Page9ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;

  const tableNum = String(item.tableNum ?? '').trim();
  if (tableNum === PAGE9_INPUT_TABLE_NUM) return PAGE9_INPUT_TABLE_COMPONENT_ID;
  if (tableNum === PAGE9_GEAR_TABLE_NUM) return PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID;

  const schemeMatch = tableNum.match(new RegExp(`^${PAGE9_GEAR_TABLE_NUM}(\\d+)$`));
  if (schemeMatch) {
    const idx = Number(schemeMatch[1]);
    if (!Number.isNaN(idx)) return PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE + idx;
  }
  return undefined;
}

/** values：载荷系数等单行参数，不含表格单元格 */
export function extractPage9SaveParamValues(list: Page9ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：带 componentId 的输入参数表、齿轮应力表（含按方案动态表） */
export function extractPage9TableSavePayload(list: Page9ParameterItem[]): Page9TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolvePage9TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getPage9TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      if (!rowData.length) return null;
      const values = rowData.map(row => mapPage9RowToCValueFormat(row, colNums));
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
    .filter((row): row is Page9TableSaveRow => row != null);
}

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined || value === '--') return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 切向力 Ft = T*2000/m/Z */
export function calcTangentialForce(torque: string | number, module: string | number, teeth: string | number): number {
  const parm = toNumber(torque);
  const parm1 = toNumber(module);
  const parm2 = toNumber(teeth);
  if (!parm1 || !parm2) return 0;
  let val = (parm * 2000) / parm1 / parm2;
  if (Number.isNaN(val)) val = 0;
  return val;
}

/** 齿根弯曲应力 RF = Ft*YF*YS*K/(m*b) */
export function calcRootBendingStress(
  module: string | number,
  teeth: string | number,
  width: string | number,
  yf: string | number,
  ys: string | number,
  tangential: string | number,
  loadCoeff: string | number,
): number {
  const parm1 = toNumber(module);
  const parm2 = toNumber(teeth);
  const parm3 = toNumber(width);
  const parm4 = toNumber(yf);
  const parm5 = toNumber(ys);
  const parm6 = toNumber(tangential);
  const parm7 = toNumber(loadCoeff);
  if (!parm1 || !parm3) return 0;
  let val = (parm6 * parm4 * parm5 * parm7) / parm1 / parm3;
  if (Number.isNaN(val)) val = 0;
  return val;
}

export function applyTangentialForceToRow(row: Page9GearRow, index: number, rows: Page9GearRow[]) {
  if (row.p3 === '' || row.p3 === '--') return;
  const val = calcTangentialForce(row.p1, row.p2, row.p3);
  row.p7 = handleCutZero(val.toFixed(2));
  applyRootBendingStressToRow(row, index, rows);
}

export function applyRootBendingStressToRow(row: Page9GearRow, _index: number, _rows: Page9GearRow[]) {
  const val = calcRootBendingStress(row.p2, row.p3, row.p4, row.p5, row.p6, row.p7, row.p8);
  row.p9 = handleCutZero(val.toFixed(2));
}

/** 全表计算（原 calculation） */
export function calculateAllPage9GearRows(rows: Page9GearRow[]) {
  rows.forEach((row, index) => {
    if (row.p3 === '' || row.p3 === '--') return;
    applyTangentialForceToRow(row, index, rows);
  });
  return rows;
}
