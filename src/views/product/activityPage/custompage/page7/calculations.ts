import { handleCutZero } from '@/utils/tools';
import type { Page7TableRow } from './parameterDefaults';

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 性能校核计算（原 calculation） */
export function calculateAllPage7Rows(rows: Page7TableRow[]) {
  rows.forEach(row => {
    const parm13 = toNumber(row.p15);
    const parm16 = toNumber(row.p18);
    const parm17 = toNumber(row.p19);
    const parm18 = toNumber(row.p23);
    const parm19 = toNumber(row.p21);

    let val = parm16 * parm17 * parm18;
    if (Number.isNaN(val)) val = 0;
    row.p24 = handleCutZero(val.toFixed(2));

    let val1 = ((parm19 / parm18) * 360) / 6.283;
    if (Number.isNaN(val1) || parm18 === 0) val1 = 0;
    row.p25 = handleCutZero(val1.toFixed(2));

    let val2 = (parm13 * 6) / parm18;
    if (Number.isNaN(val2) || parm18 === 0) val2 = 0;
    row.p26 = handleCutZero(val2.toFixed(2));
  });
  return rows;
}
