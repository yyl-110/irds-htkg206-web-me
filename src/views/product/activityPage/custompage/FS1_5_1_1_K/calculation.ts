import httpRequest from '@/httpRequest';
import type { Fs151_1_1KParameterItem, LaminateRow } from './parameterDefaults';
import { getLaminateTableRows, setLaminateTableRows } from './parameterDefaults';

export interface LaminateCalcResultRow {
  p22?: string;
  p23?: string;
  p24?: string;
  p25?: string;
  p26?: string;
  p27?: string;
}

export function calculateCheckDesign(data: Record<string, unknown>) {
  return httpRequest({
    url: '/calculationCheck/calculateCheckDesign.json',
    method: 'POST',
    data,
  });
}

function filled(value: unknown) {
  return value !== undefined && value !== '';
}

function normalizeRowFields(row: LaminateRow) {
  for (let i = 2; i <= 21; i += 1) {
    const key = `p${i}`;
    if (!filled(row[key])) row[key] = '0';
  }
}

export function buildLaminateImpStr(list: Fs151_1_1KParameterItem[], row: LaminateRow) {
  normalizeRowFields(row);
  const parts = [
    `2,B,${list[0]?.defaultValue ?? ''}`,
    `3,B,${list[1]?.defaultValue ?? ''}`,
    `4,B,${list[2]?.defaultValue ?? ''}`,
    `5,B,${list[3]?.defaultValue ?? ''}`,
    `2,Q,${list[4]?.defaultValue ?? ''}`,
    `3,Q,${list[5]?.defaultValue ?? ''}`,
    `4,Q,${list[6]?.defaultValue ?? ''}`,
    `5,Q,${list[7]?.defaultValue ?? ''}`,
    `8,B,${row.p2 ?? ''}`,
    `9,B,${row.p3 ?? ''}`,
    `8,C,${row.p4 ?? ''}`,
    `9,C,${row.p5 ?? ''}`,
    `8,D,${row.p6 ?? ''}`,
    `9,D,${row.p7 ?? ''}`,
    `8,E,${row.p8 ?? ''}`,
    `9,E,${row.p9 ?? ''}`,
    `8,F,${row.p10 ?? ''}`,
    `9,F,${row.p11 ?? ''}`,
    `8,Q,${row.p12 ?? ''}`,
    `9,Q,${row.p13 ?? ''}`,
    `8,R,${row.p14 ?? ''}`,
    `9,R,${row.p15 ?? ''}`,
    `8,S,${row.p16 ?? ''}`,
    `9,S,${row.p17 ?? ''}`,
    `8,T,${row.p18 ?? ''}`,
    `9,T,${row.p19 ?? ''}`,
    `8,U,${row.p20 ?? ''}`,
    `9,U,${row.p21 ?? ''}`,
  ];
  return parts.map(s => `${s};`).join('');
}

export function buildLaminateCalcPayload(list: Fs151_1_1KParameterItem[], row: LaminateRow, userId: string | number) {
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: 'FS-J001混杂纤维层合板性能计算.xls',
    impStr: buildLaminateImpStr(list, row),
    expStr: 'p22,11,B;p23,12,B;p24,13,B;p25,14,B;p26,15,B;p27,16,B;',
    userid: userId,
  };
}

export function applyLaminateCalcResult(
  list: Fs151_1_1KParameterItem[],
  segmentNo: string | number | undefined,
  segmentName: string | undefined,
  rows: LaminateCalcResultRow[],
) {
  const tableRows = getLaminateTableRows(list).map(item => {
    if (item.p0 != segmentNo || item.p1 != segmentName) return item;
    const merged = { ...item };
    rows.forEach(res => {
      (['p22', 'p23', 'p24', 'p25', 'p26', 'p27'] as const).forEach(key => {
        if (res[key]) merged[key] = res[key];
      });
    });
    return merged;
  });
  setLaminateTableRows(list, tableRows);
}

export async function runLaminateCalculation(
  list: Fs151_1_1KParameterItem[],
  row: LaminateRow,
  userId: string | number,
) {
  const payload = buildLaminateCalcPayload(list, row, userId);
  const response = await calculateCheckDesign(payload);
  if (String(response?.data?.code ?? '') !== '0') {
    throw new Error(String(response?.data?.msg ?? '计算失败'));
  }
  const result = (response?.data?.data?.result ?? []) as LaminateCalcResultRow[];
  applyLaminateCalcResult(list, row.p0, row.p1, result);
}
