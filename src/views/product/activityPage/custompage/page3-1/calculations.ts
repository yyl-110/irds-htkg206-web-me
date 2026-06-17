import { handleCutZero } from '@/utils/tools';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
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

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (text) return text;
  }
  return '';
}

/** 从设计输入等流程参数读取舟它最大输出力矩（与 page3 initData 一致） */
function resolveMaxOutputTorqueFromFlow(): string {
  const paramList = getFlowParameterList();
  let djOutputStyle = '';
  let maxPowerX = '';
  let maxPowerZ = '';

  paramList.forEach(item => {
    if (djOutputStyle === '' && item.paramnum === 'DJ1_1_GZFS') {
      djOutputStyle = item.paramvalue ?? '';
    }
    if (maxPowerX === '' && item.paramnum === 'DJ1_1_SCLJ_MAX_X') {
      maxPowerX = item.paramvalue ?? '';
    }
    if (maxPowerZ === '' && item.paramnum === 'DJ1_1_SCL_MAX_Z') {
      maxPowerZ = item.paramvalue ?? '';
    }
  });

  let maxPower = maxPowerX;
  if (djOutputStyle.substring(0, 2) === '直线') {
    maxPower = maxPowerZ;
  }
  return String(maxPower ?? '').trim();
}

function resolvePage3MaxOutputTorqueRows(): Array<Record<string, string | number | undefined>> {
  return resolveTableRows(
    collectTableSources(null),
    [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }],
    19,
  );
}

function resolveMaxOutputTorqueFromPage3Row(
  page3Rows: Array<Record<string, string | number | undefined>>,
  motorId: string,
  rowIndex: number,
): string {
  if (!page3Rows.length) return '';
  if (motorId) {
    const matched = page3Rows.find(row => readTableCell(row, 0) === motorId);
    if (matched) return readTableCell(matched, 7);
  }
  return readTableCell(page3Rows[rowIndex] ?? page3Rows[0], 7);
}

function resolveUpstreamMaxOutputTorque(
  flowMaxOutputTorque: string,
  page3Rows: Array<Record<string, string | number | undefined>>,
  motorId: string,
  rowIndex: number,
): string {
  return firstNonEmpty(
    flowMaxOutputTorque,
    resolveMaxOutputTorqueFromPage3Row(page3Rows, motorId, rowIndex),
  );
}

/** 对单行执行初始性能计算（原 calculation 方法） */
export function calculatePage3_1Row(
  item: Page3_1TableRow,
  options?: {
    flowMaxOutputTorque?: string;
    page3Rows?: Array<Record<string, string | number | undefined>>;
    rowIndex?: number;
  },
) {
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

  const upstreamMaxOutputTorque = resolveUpstreamMaxOutputTorque(
    String(options?.flowMaxOutputTorque ?? resolveMaxOutputTorqueFromFlow()),
    options?.page3Rows ?? resolvePage3MaxOutputTorqueRows(),
    String(item.p0 ?? '').trim(),
    options?.rowIndex ?? 0,
  );
  if (upstreamMaxOutputTorque) {
    item.p13 = handleCutZero(upstreamMaxOutputTorque);
  } else {
    const val5 = Number(parm5) * Number(parm6) * Number(parm7);
    if (isFiniteNumber(val5)) {
      item.p13 = handleCutZero(val5.toFixed(3));
    }
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
  const flowMaxOutputTorque = resolveMaxOutputTorqueFromFlow();
  const page3Rows = resolvePage3MaxOutputTorqueRows();
  rows.forEach((row, index) => {
    calculatePage3_1Row(row, { flowMaxOutputTorque, page3Rows, rowIndex: index });
  });
  return rows;
}
