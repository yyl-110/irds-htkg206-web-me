import { handleCutZero } from '@/utils/tools';
import type { Page5TableRow } from './parameterDefaults';

/** 齿轮减速比分配计算（原 calculation） */
export function calculateAllPage5Rows(rows: Page5TableRow[], equivalent: number) {
  rows.forEach(row => {
    let parm8 = row.p8;
    let parm9 = row.p9;
    let parm11 = row.p11;

    if (parm9 === '' || parm9 === undefined) {
      parm9 = '0';
    }
    if (parm11 === '' || parm11 === undefined) {
      parm11 = '0';
    }

    let endRatio = '';
    if (parm8 === '直线') {
      endRatio = String((Number(parm9) * equivalent) / 1000);
    } else {
      endRatio = String(parm9);
    }
    row.p12 = handleCutZero(Number(endRatio).toFixed(2));

    let gearRatio = Number(parm11) / Number(endRatio);
    if (Number.isNaN(gearRatio)) {
      gearRatio = 0;
    }
    row.p13 = handleCutZero(gearRatio.toFixed(2));

    let gearLevel = '';
    if (gearRatio <= 3) {
      gearLevel = '1';
    } else if (gearRatio <= 9) {
      gearLevel = '2';
    } else if (gearRatio > 9) {
      gearLevel = '3';
    }
    row.p14 = gearLevel;
  });
  return rows;
}
