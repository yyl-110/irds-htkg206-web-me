import httpRequest from '@/httpRequest';
import type { Zt1_44ParameterItem } from './parameterDefaults';

export interface Zt1_44CalcResultRow {
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
}

export function calculateCheckDesign(data: Record<string, unknown>) {
  return httpRequest({
    url: '/calculationCheck/calculateCheckDesign.json',
    method: 'POST',
    data,
  });
}

function isFilled(value: string | undefined) {
  return value !== undefined && value !== '';
}

export function validateZt1_44CalcInputs(list: Zt1_44ParameterItem[]) {
  for (let index = 1; index <= 16; index += 1) {
    if (!isFilled(list[index]?.defaultValue)) {
      return false;
    }
  }
  return true;
}

export function buildZt1_44ImpStr(list: Zt1_44ParameterItem[]) {
  const excelIndex = list[0]?.defaultValue ?? '';
  const pairs: Array<[string, number]> = [
    ['B', 0],
    ['C', 1],
    ['D', 2],
    ['E', 3],
    ['F', 4],
    ['G', 11],
    ['H', 12],
    ['I', 13],
    ['J', 14],
    ['K', 15],
    ['P', 16],
    ['Q', 5],
    ['R', 6],
    ['S', 7],
    ['T', 8],
    ['U', 9],
    ['V', 10],
  ];

  return pairs
    .map(([col, index]) => `${excelIndex},${col},${list[index]?.defaultValue ?? ''}`)
    .join(';')
    .concat(';');
}

export function buildZt1_44CalcPayload(list: Zt1_44ParameterItem[], userId: string | number) {
  const excelIndex = list[0]?.defaultValue ?? '';
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: 'ZT-J013轴荷校核-非平衡桥.xls',
    impStr: buildZt1_44ImpStr(list),
    expStr: `p1,${excelIndex},L;p2,${excelIndex},M;p3,${excelIndex},N;p4,${excelIndex},O;`,
    userid: userId,
  };
}

export function applyZt1_44CalcResult(list: Zt1_44ParameterItem[], rows: Zt1_44CalcResultRow[]) {
  rows.forEach(row => {
    if (row.p1 != null && row.p1 !== '') list[17].defaultValue = String(row.p1);
    if (row.p2 != null && row.p2 !== '') list[18].defaultValue = String(row.p2);
    if (row.p3 != null && row.p3 !== '') list[19].defaultValue = String(row.p3);
    if (row.p4 != null && row.p4 !== '') list[20].defaultValue = String(row.p4);
  });
}
