import { handleCutZero } from '@/utils/tools';
import type { Page9GearRow } from './parameterDefaults';

function toNumber(value: string | number | undefined): number {
  if (value === '' || value === undefined || value === '--') return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/** 切向力 Ft = T*2000/m/Z */
export function calcTangentialForce(torque: string | number, module: string | number, teeth: string | number): number {
  const parm = toNumber(torque);
  const parm1 = toNumber(module);
  const parm2 = toNumber(teeth);
  if (!parm1 || !parm2) return 0;
  let val = (parm * 2000) / parm1 / parm2;
  if (Number.isNaN(val)) val = 0;
  return val;
}

/** 齿根弯曲应力 RF = Ft*YF*YS*K/(m*b) */
export function calcRootBendingStress(
  module: string | number,
  teeth: string | number,
  width: string | number,
  yf: string | number,
  ys: string | number,
  tangential: string | number,
  loadCoeff: string | number,
): number {
  const parm1 = toNumber(module);
  const parm2 = toNumber(teeth);
  const parm3 = toNumber(width);
  const parm4 = toNumber(yf);
  const parm5 = toNumber(ys);
  const parm6 = toNumber(tangential);
  const parm7 = toNumber(loadCoeff);
  if (!parm1 || !parm3) return 0;
  let val = (parm6 * parm4 * parm5 * parm7) / parm1 / parm3;
  if (Number.isNaN(val)) val = 0;
  return val;
}

export function applyTangentialForceToRow(row: Page9GearRow, index: number, rows: Page9GearRow[]) {
  if (row.p3 === '' || row.p3 === '--') return;
  const val = calcTangentialForce(row.p1, row.p2, row.p3);
  row.p7 = handleCutZero(val.toFixed(2));
  applyRootBendingStressToRow(row, index, rows);
}

export function applyRootBendingStressToRow(row: Page9GearRow, _index: number, _rows: Page9GearRow[]) {
  const val = calcRootBendingStress(row.p2, row.p3, row.p4, row.p5, row.p6, row.p7, row.p8);
  row.p9 = handleCutZero(val.toFixed(2));
}

/** 全表计算（原 calculation） */
export function calculateAllPage9GearRows(rows: Page9GearRow[]) {
  rows.forEach((row, index) => {
    if (row.p3 === '' || row.p3 === '--') return;
    applyTangentialForceToRow(row, index, rows);
  });
  return rows;
}
