import httpRequest from '@/httpRequest';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import { getCheckTableRows, setCheckTableRows, type ConnectionTableRow, type Fs15_1KParameterItem } from './parameterDefaults';

export const CHECK_EXCEL_NAME = 'FS-J007螺栓强度校核计算程序.xls';

function calculateCheckDesign(data: Record<string, unknown>) {
  return httpRequest({
    url: '/calculationCheck/calculateCheckDesign.json',
    method: 'POST',
    data,
  });
}

function isFilled(value: unknown) {
  return value !== undefined && value !== null && String(value) !== '';
}

export function validateCheckRowInputs(row: ConnectionTableRow) {
  for (let i = 2; i <= 13; i += 1) {
    if (!isFilled(row[`p${i}`])) return false;
  }
  return true;
}

export function buildCheckImpStr(row: ConnectionTableRow) {
  const parts: string[] = [];
  for (let i = 2; i <= 13; i += 1) {
    parts.push(`${i},B,${row[`p${i}`] ?? ''}`);
  }
  return `${parts.join(';')};`;
}

export function buildCheckCalcPayload(row: ConnectionTableRow) {
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: CHECK_EXCEL_NAME,
    impStr: buildCheckImpStr(row),
    expStr: 'p14,20,B;p15,25,B;p16,3,D;p17,9,D;p18,16,D;p19,20,D;p20,23,D;',
    userid: globaluserId(),
  };
}

export async function runConnectionCheckCalculation(list: Fs15_1KParameterItem[], selectedRow: ConnectionTableRow) {
  if (!validateCheckRowInputs(selectedRow)) {
    return { ok: false, message: '计算参数不能为空' };
  }

  const response = await calculateCheckDesign(buildCheckCalcPayload(selectedRow));
  if (String(response?.data?.code ?? '') !== '0') {
    return { ok: false, message: String(response?.data?.msg ?? '计算失败') };
  }

  const resList = (response?.data?.data?.result ?? []) as ConnectionTableRow[];
  if (!resList.length) return { ok: true };

  const matchName = String(selectedRow.p1 ?? '');
  const checkRows = getCheckTableRows(list).map(row => {
    if (String(row.p1 ?? '') !== matchName) return row;
    const next = { ...row };
    resList.forEach(item => {
      for (let i = 14; i <= 20; i += 1) {
        const key = `p${i}`;
        if (item[key]) next[key] = item[key];
      }
    });
    return next;
  });
  setCheckTableRows(list, checkRows);
  return { ok: true };
}
