export interface GearRatioEntry {
  Z: string;
  YF: string;
  YS: string;
}

/** 齿数 → 齿形系数 / 齿形修正系数对照表（原 initGearRatio） */
export function createGearRatioTable(): GearRatioEntry[] {
  const ZStr = '17,18,19,20,21,22,23,24,25,26,27,28,29,30,35,40,45,50,60,70,80,90,100,150,200';
  const YFStr =
    '2.97,2.91,2.85,2.8,2.76,2.72,2.69,2.65,2.62,2.6,2.57,2.55,2.53,2.52,2.45,2.4,2.35,' +
    '2.32,2.28,2.24,2.22,2.2,2.18,2.14,2.12';
  const YSStr =
    '1.52,1.53,1.54,1.55,1.56,1.57,1.575,1.58,1.59,1.595,1.6,1.61,1.62,1.625,1.65,1.67,' +
    '1.68,1.7,1.73,1.75,1.77,1.78,1.79,1.83,1.865';
  const ZArr = ZStr.split(',');
  const YFArr = YFStr.split(',');
  const YSArr = YSStr.split(',');
  return ZArr.map((Z, index) => ({
    Z,
    YF: YFArr[index] ?? '',
    YS: YSArr[index] ?? '',
  }));
}

export function lookupGearFactors(toothCount: string, table: GearRatioEntry[]) {
  const hit = table.find(item => item.Z === toothCount);
  return hit ? { YF: hit.YF, YS: hit.YS } : { YF: '', YS: '' };
}
