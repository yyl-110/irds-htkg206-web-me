import httpRequest from '@/httpRequest';
import { globaluserId } from '@/views/product/activityPage/custompage/_shared/utils/legacyUser';
import { getCheckTableRows, setCheckTableRows, type Fs15_1LParameterItem, type SealTableRow } from './parameterDefaults';

export const CHECK_EXCEL_NAME = 'FS-J008O形圈设计及校验.xls';

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

export function validateCheckRowInputs(row: SealTableRow) {
  return isFilled(row.p4) && isFilled(row.p5) && isFilled(row.p6) && isFilled(row.p7);
}

export function buildCheckImpStr(row: SealTableRow) {
  return `14,B,${row.p4 ?? ''};2,B,${row.p5 ?? ''};2,D,${row.p6 ?? ''};15,B,${row.p7 ?? ''};`;
}

export function buildCheckCalcPayload(row: SealTableRow) {
  return {
    type: '定制',
    categoryId: '',
    checkId: '',
    sheetNum: 'sheet1',
    custCheckName: CHECK_EXCEL_NAME,
    impStr: buildCheckImpStr(row),
    expStr: 'p8,7,B;p9,7,D;p10,8,B;p11,8,D;p12,16,B;p13,6,F;',
    userid: globaluserId(),
  };
}

export async function runSealCheckCalculation(list: Fs15_1LParameterItem[], selectedRow: SealTableRow) {
  if (!validateCheckRowInputs(selectedRow)) {
    return { ok: false, message: '计算参数不能为空' };
  }

  const response = await calculateCheckDesign(buildCheckCalcPayload(selectedRow));
  if (String(response?.data?.code ?? '') !== '0') {
    return { ok: false, message: String(response?.data?.msg ?? '计算失败') };
  }

  const resList = (response?.data?.data?.result ?? []) as SealTableRow[];
  if (!resList.length) return { ok: true };

  const matchIndex = String(selectedRow.p0 ?? '');
  const checkRows = getCheckTableRows(list).map(row => {
    if (String(row.p0 ?? '') !== matchIndex) return row;
    const next = { ...row };
    resList.forEach(item => {
      for (let i = 8; i <= 13; i += 1) {
        const key = `p${i}`;
        if (item[key]) next[key] = item[key];
      }
    });
    return next;
  });
  setCheckTableRows(list, checkRows);
  return { ok: true };
}
