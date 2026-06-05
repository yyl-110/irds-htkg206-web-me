import { isValid } from '@/api/flowData/flowData';
import { handleCutZero } from '@/utils/tools';
import type { Page9SchemeRow } from './parameterDefaults';

export interface GearTorqueValues {
  dj: string | number;
  level1: string | number;
  level2Drive: string | number;
  level2Driven: string | number;
  level3Drive: string | number;
  level3Driven: string | number;
}

function parseGearNum(value: string | number | undefined): string | number {
  if (value === '' || value === undefined || value === '--') return '';
  return value;
}

/** 各级齿轮扭矩（原 initData / selectModelListCheck 中的扭矩链） */
export function calculateGearTorqueChain(
  schemeRow: Page9SchemeRow,
  cdxl: string | number | undefined,
  fractionDigits = 0,
): GearTorqueValues {
  const maxPower = schemeRow.p1;
  const totalJsb = schemeRow.p10;
  const firstGearNum = schemeRow.p5;
  const djGearNum = schemeRow.p4;
  const gearNum = [
    parseGearNum(schemeRow.p4),
    parseGearNum(schemeRow.p5),
    parseGearNum(schemeRow.p6),
    parseGearNum(schemeRow.p7),
    parseGearNum(schemeRow.p8),
    parseGearNum(schemeRow.p9),
  ];

  let djclNiuJu: string | number = 0;
  if (
    isValid(maxPower) &&
    Number(maxPower) > 0 &&
    isValid(totalJsb) &&
    Number(totalJsb) !== 0 &&
    isValid(cdxl) &&
    Number(cdxl) !== 0
  ) {
    djclNiuJu = Number(maxPower) / Number(totalJsb) / Number(cdxl);
  }
  if (Number.isNaN(Number(djclNiuJu))) djclNiuJu = 0;
  djclNiuJu = handleCutZero(Number(djclNiuJu).toFixed(fractionDigits));

  let level1cdlNiuJu: string | number = 0;
  if (
    Number(djclNiuJu) > 0 &&
    isValid(firstGearNum) &&
    Number(firstGearNum) > 0 &&
    isValid(djGearNum) &&
    Number(djGearNum) > 0
  ) {
    level1cdlNiuJu = (Number(djclNiuJu) * Number(firstGearNum)) / Number(djGearNum);
  }
  if (Number.isNaN(Number(level1cdlNiuJu))) level1cdlNiuJu = 0;
  level1cdlNiuJu = handleCutZero(Number(level1cdlNiuJu).toFixed(fractionDigits));

  let level2zdlNiuJu: string | number = level1cdlNiuJu;
  if (!isValid(gearNum[2]) || !isValid(gearNum[3])) {
    level2zdlNiuJu = '';
  }

  let level2cdlNiuJu: string | number = 0;
  if (
    level2zdlNiuJu !== '' &&
    Number(level2zdlNiuJu) > 0 &&
    isValid(gearNum[2]) &&
    Number(gearNum[2]) > 0 &&
    isValid(gearNum[3]) &&
    Number(gearNum[3]) > 0
  ) {
    level2cdlNiuJu = (Number(level2zdlNiuJu) / Number(gearNum[2])) * Number(gearNum[3]);
  }
  if (Number.isNaN(Number(level2cdlNiuJu))) level2cdlNiuJu = 0;
  level2cdlNiuJu = handleCutZero(Number(level2cdlNiuJu).toFixed(fractionDigits));
  if (Number(level2cdlNiuJu) === 0) level2cdlNiuJu = '';

  let level3zdlNiuJu: string | number = level2cdlNiuJu;
  if (!isValid(gearNum[4]) || !isValid(gearNum[5])) {
    level3zdlNiuJu = '';
  }

  let level3cdlNiuJu: string | number = 0;
  if (
    level3zdlNiuJu !== '' &&
    Number(level3zdlNiuJu) > 0 &&
    isValid(gearNum[4]) &&
    Number(gearNum[4]) > 0 &&
    isValid(gearNum[5]) &&
    Number(gearNum[5]) > 0
  ) {
    level3cdlNiuJu = (Number(level3zdlNiuJu) / Number(gearNum[4])) * Number(gearNum[5]);
  }
  if (Number.isNaN(Number(level3cdlNiuJu))) level3cdlNiuJu = 0;
  level3cdlNiuJu = handleCutZero(Number(level3cdlNiuJu).toFixed(fractionDigits));
  if (Number(level3cdlNiuJu) === 0) level3cdlNiuJu = '';

  return {
    dj: djclNiuJu,
    level1: level1cdlNiuJu,
    level2Drive: level2zdlNiuJu,
    level2Driven: level2cdlNiuJu,
    level3Drive: level3zdlNiuJu,
    level3Driven: level3cdlNiuJu,
  };
}

export function extractGearNumbers(schemeRow: Page9SchemeRow) {
  return [
    String(schemeRow.p4 ?? ''),
    String(schemeRow.p5 ?? ''),
    String(schemeRow.p6 ?? ''),
    String(schemeRow.p7 ?? ''),
    String(schemeRow.p8 ?? ''),
    String(schemeRow.p9 ?? ''),
  ];
}
