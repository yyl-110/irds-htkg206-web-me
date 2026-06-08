import httpRequest from '@/httpRequest';
import {
  getFrameCheckRows,
  setFrameCheckRows,
  type FrameCheckRow,
  type Fs151_1_1NParameterItem,
} from './parameterDefaults';

export interface FrameCheckCalcResultRow {
  p10?: string;
  p11?: string;
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

export function validateFrameCheckInputs(row: FrameCheckRow) {
  for (let i = 2; i <= 9; i += 1) {
    if (!filled(row[`p${i}`])) return false;
  }
  return true;
}

export function buildFrameCheckImpStr(row: FrameCheckRow) {
  const parts = [
    `2,C,${row.p4 ?? ''}`,
    `3,C,${row.p2 ?? ''}`,
    `4,C,${row.p3 ?? ''}`,
    `5,C,${row.p5 ?? ''}`,
    `6,C,${row.p6 ?? ''}`,
    `7,C,${row.p7 ?? ''}`,
    `8,C,${row.p8 ?? ''}`,
    `9,C,${row.p9 ?? ''}`,
  ];
  return parts.map(s => `${s};`).join('');
}

export function buildFrameCheckCalcPayload(row: FrameCheckRow, userId: string | number) {
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: 'FS-J005复合材料加强框校核（矩形截面）.xls',
    impStr: buildFrameCheckImpStr(row),
    expStr: 'p10,17,C;p11,18,C;',
    userid: userId,
  };
}

export function applyFrameCheckCalcResult(
  list: Fs151_1_1NParameterItem[],
  frameName: string | number | undefined,
  rows: FrameCheckCalcResultRow[],
) {
  const tableRows = getFrameCheckRows(list).map(item => {
    if (item.p1 != frameName) return item;
    const merged = { ...item };
    rows.forEach(res => {
      if (res.p10) merged.p10 = res.p10;
      if (res.p11) merged.p11 = res.p11;
    });
    return merged;
  });
  setFrameCheckRows(list, tableRows);
}

export async function runFrameCheckCalculation(
  list: Fs151_1_1NParameterItem[],
  row: FrameCheckRow,
  userId: string | number,
) {
  const payload = buildFrameCheckCalcPayload(row, userId);
  const response = await calculateCheckDesign(payload);
  if (String(response?.data?.code ?? '') !== '0') {
    throw new Error(String(response?.data?.msg ?? '计算失败'));
  }
  const result = (response?.data?.data?.result ?? []) as FrameCheckCalcResultRow[];
  applyFrameCheckCalcResult(list, row.p1, result);
}
