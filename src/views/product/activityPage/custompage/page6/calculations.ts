import { handleCutZero } from '@/utils/tools';
import type { Page6TableRow } from './parameterDefaults';

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) {
    return 0;
  }
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 确定齿数与实际总减速比计算（原 calculation） */
export function calculateAllPage6Rows(rows: Page6TableRow[]) {
  rows.forEach(row => {
    const parm4 = toNumber(row.p4);
    const parm5 = toNumber(row.p5);
    const parm9 = toNumber(row.p9);
    const parm10 = toNumber(row.p10);
    const parm11 = toNumber(row.p11);
    const parm12 = toNumber(row.p12);
    const parm13 = toNumber(row.p13);
    const parm14 = toNumber(row.p14);

    let val = 0;
    if (parm9 !== 0) {
      val = parm10 / parm9;
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
    if (parm12 !== 0 && parm11 !== 0 && val !== 0) {
      val = (val * parm12) / parm11;
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
    if (parm13 !== 0 && parm14 !== 0 && val !== 0) {
      val = (val * parm14) / parm13;
    }

    row.p15 = handleCutZero(val.toFixed(2));

    let val1 = (parm4 * val) / parm5;
    if (Number.isNaN(val1) || parm5 === 0) {
      val1 = 0;
    }
    row.p16 = handleCutZero(val1.toFixed(2));
  });
  return rows;
}
