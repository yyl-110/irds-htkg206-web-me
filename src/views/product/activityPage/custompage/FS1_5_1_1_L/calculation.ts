import httpRequest from '@/httpRequest';
import {
  getCheckTableRows,
  setCheckTableRows,
  type Fs151_1_1LParameterItem,
  type WallCheckRow,
} from './parameterDefaults';

export interface WallCheckCalcResultRow {
  p11?: string;
  p12?: string;
  p13?: string;
  p14?: string;
  p15?: string;
  p16?: string;
  p17?: string;
  p18?: string;
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

export function validateWallCheckInputs(list: Fs151_1_1LParameterItem[], row: WallCheckRow) {
  for (let i = 1; i <= 10; i += 1) {
    if (!filled(row[`p${i}`])) return false;
  }
  for (let i = 1; i <= 4; i += 1) {
    if (!filled(list[i]?.defaultValue)) return false;
  }
  return true;
}

export function buildWallCheckImpStr(list: Fs151_1_1LParameterItem[], row: WallCheckRow) {
  const parts = [
    `1,B,${row.p7 ?? ''}`,
    `2,B,${row.p8 ?? ''}`,
    `3,B,${row.p5 ?? ''}`,
    `4,B,${row.p6 ?? ''}`,
    `6,B,${row.p3 ?? ''}`,
    `7,B,${row.p4 ?? ''}`,
    `8,B,${row.p1 ?? ''}`,
    `9,B,${row.p2 ?? ''}`,
    `12,B,${row.p9 ?? ''}`,
    `23,B,${list[3]?.defaultValue ?? ''}`,
    `24,B,${list[4]?.defaultValue ?? ''}`,
    `26,B,${row.p10 ?? ''}`,
    `34,B,${list[1]?.defaultValue ?? ''}`,
    `37,B,${list[2]?.defaultValue ?? ''}`,
  ];
  return parts.map(s => `${s};`).join('');
}

export function buildWallCheckCalcPayload(list: Fs151_1_1LParameterItem[], row: WallCheckRow, userId: string | number) {
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: 'FS-J003复合材料夹层结构筒壁校核计算程序.xls',
    impStr: buildWallCheckImpStr(list, row),
    expStr: 'p11,11,B;p12,19,B;p13,29,B;p14,32,B;p15,33,B;p16,35,B;p17,36,B;p18,39,B;',
    userid: userId,
  };
}

export function applyWallCheckCalcResult(
  list: Fs151_1_1LParameterItem[],
  segmentNo: string | number | undefined,
  rows: WallCheckCalcResultRow[],
) {
  const tableRows = getCheckTableRows(list).map(item => {
    if (item.p0 != segmentNo) return item;
    const merged = { ...item };
    rows.forEach(res => {
      (['p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18'] as const).forEach(key => {
        if (res[key]) merged[key] = res[key];
      });
    });
    return merged;
  });
  setCheckTableRows(list, tableRows);
}

export async function runWallCheckCalculation(
  list: Fs151_1_1LParameterItem[],
  row: WallCheckRow,
  userId: string | number,
) {
  const payload = buildWallCheckCalcPayload(list, row, userId);
  const response = await calculateCheckDesign(payload);
  if (String(response?.data?.code ?? '') !== '0') {
    throw new Error(String(response?.data?.msg ?? '计算失败'));
  }
  const result = (response?.data?.data?.result ?? []) as WallCheckCalcResultRow[];
  applyWallCheckCalcResult(list, row.p0, result);
}
