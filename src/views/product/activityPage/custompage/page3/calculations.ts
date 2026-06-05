import { handleCutZero } from '@/utils/tools';
import type { Page3TableRow } from './parameterDefaults';

function isFiniteNumber(val: number) {
  return !Number.isNaN(val) && val !== Infinity && val !== -Infinity;
}

/** 对单行执行初始总减速比计算（原 calculation 方法） */
export function calculatePage3Row(item: Page3TableRow) {
  const parm2 = item.p1;
  const parm3 = item.p2;
  const parm4 = item.p3;
  const parm5 = item.p4;
  const parm6 = item.p5;
  const parm7 = item.p6;
  const parm8 = item.p7;

  const val = (Number(parm2) / 60) * 6.283;
  if (isFiniteNumber(val)) {
    item.p9 = handleCutZero(val.toFixed(3));
  }

  const val1 = (Number(parm3) / 60) * 6.283;
  if (isFiniteNumber(val1)) {
    item.p10 = handleCutZero(val1.toFixed(3));
  }

  const val2 = (Number(val) - Number(val1)) / Number(parm4);
  if (isFiniteNumber(val2)) {
    item.p11 = handleCutZero(val2.toFixed(3));
  }

  const val3 = Number(val1) / 2 / Number(val2);
  if (isFiniteNumber(val3)) {
    item.p12 = handleCutZero(val3.toFixed(3));
  }

  const val4 = Number(val) - Number(val2) * Number(val3);
  if (isFiniteNumber(val4)) {
    item.p13 = handleCutZero(val4.toFixed(3));
  }

  const val5 = Number(val3) * Number(val4);
  if (isFiniteNumber(val5)) {
    item.p14 = handleCutZero(val5.toFixed(3));
  }

  const val6 = Number(parm8) / Number(parm6) / Number(parm5);
  if (isFiniteNumber(val6)) {
    item.p15 = handleCutZero(val6.toFixed(3));
  }

  const val7 = Number(parm8) / Number(parm4) / Number(parm6);
  if (isFiniteNumber(val7)) {
    item.p16 = handleCutZero(val7.toFixed(3));
  }

  const val8 = (Number(parm2) * 6) / Number(parm7);
  if (isFiniteNumber(val8)) {
    item.p17 = handleCutZero(val8.toFixed(3));
  }

  item.p18 = item.p15;
}

export function calculateAllPage3Rows(rows: Page3TableRow[]) {
  rows.forEach(row => calculatePage3Row(row));
  return rows;
}
