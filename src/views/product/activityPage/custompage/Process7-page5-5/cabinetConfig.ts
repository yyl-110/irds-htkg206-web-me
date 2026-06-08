import type { CabinetSectionConfig } from './types';

export const CABINET_SECTIONS: CabinetSectionConfig[] = [
  {
    id: 1,
    label: '电源机柜1',
    visibleParamIndex: 2,
    paramStart: 6,
    outputRouteIndex: 20,
    tableIndex: 66,
    electFileParamIndex: 17,
    envFileParamIndex: 19,
    confirmType: '1',
    changeNumberType: 1,
  },
  {
    id: 2,
    label: '电源机柜2',
    visibleParamIndex: 3,
    paramStart: 21,
    outputRouteIndex: 35,
    tableIndex: 67,
    electFileParamIndex: 32,
    envFileParamIndex: 34,
    confirmType: '2',
    changeNumberType: 2,
  },
  {
    id: 3,
    label: '电源机柜3',
    visibleParamIndex: 4,
    paramStart: 36,
    outputRouteIndex: 50,
    tableIndex: 68,
    electFileParamIndex: 47,
    envFileParamIndex: 49,
    confirmType: '3',
    changeNumberType: 3,
  },
  {
    id: 4,
    label: '电源机柜4',
    visibleParamIndex: 5,
    paramStart: 51,
    outputRouteIndex: 65,
    tableIndex: 69,
    electFileParamIndex: 62,
    envFileParamIndex: 64,
    confirmType: '4',
    changeNumberType: 4,
  },
];

export const HIGH_VOLTAGE_SUPPLY_TYPES = ['交流输入、高压直流母线', '高压直流输入、高压直流母线'];
export const LOW_VOLTAGE_AC_SUPPLY_TYPE = '交流输入、交流母线';
