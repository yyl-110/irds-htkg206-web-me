import { handleCutZero } from '@/utils/tools';
import type { Page10DegreeRow } from './parameterDefaults';

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 全角度性能校核计算（原 calculation） */
export function calculateAllPage10DegreeRows(rows: Page10DegreeRow[]) {
  const result: Page10DegreeRow[] = [];

  rows.forEach(row => {
    const data = { ...row };
    const parm1 = toNumber(data.p1);
    const parm2 = toNumber(data.p2);
    const parm5 = toNumber(data.p5);
    const parm6 = toNumber(data.p6);
    const parm7 = toNumber(data.p7);

    let val0 = parm7 / parm6 / parm1;
    if (Number.isNaN(val0) || !Number.isFinite(val0)) val0 = 0;
    data.p11 = val0.toFixed(2);

    let val00 = toNumber(data.p8) - toNumber(data.p10) * val0;
    if (Number.isNaN(val00) || !Number.isFinite(val00)) val00 = 0;
    data.p12 = handleCutZero(val00.toFixed(2));

    let val = parm5 * parm6 * parm1;
    if (Number.isNaN(val) || !Number.isFinite(val)) val = 0;
    data.p13 = val.toFixed(2);

    let val2 = (parm2 * 6) / parm1;
    if (Number.isNaN(val2) || !Number.isFinite(val2)) val2 = 0;
    data.p14 = handleCutZero(val2.toFixed(2));

    let val3 = (val00 / parm1) * (360 / 6.283);
    if (Number.isNaN(val3) || !Number.isFinite(val3)) val3 = 0;
    data.p15 = handleCutZero(val3.toFixed(2));

    result.push(data);
  });

  return result;
}
