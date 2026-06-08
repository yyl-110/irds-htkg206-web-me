import { handleCutZero } from '@/utils/tools';
import { getDesignTableRows, setDesignTableRows, type Fs151_1_2ParameterItem } from './parameterDefaults';

function toNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/** 总厚度 P9 = P6 + P7；等效密度 P12 = (P5*P7 + P3*P6) / P9 */
export function runOuterSkinDesignCalculation(list: Fs151_1_2ParameterItem[]) {
  const rows = getDesignTableRows(list).map(row => {
    const p6 = toNumber(row.p6);
    const p7 = toNumber(row.p7);
    const p3 = toNumber(row.p3);
    const p5 = toNumber(row.p5);
    const total = p6 + p7;
    let density = 0;
    if (total !== 0) {
      density = (p5 * p7 + p3 * p6) / total;
    }
    return {
      ...row,
      p9: total,
      p12: handleCutZero(density.toFixed(3)),
    };
  });
  setDesignTableRows(list, rows);
}
