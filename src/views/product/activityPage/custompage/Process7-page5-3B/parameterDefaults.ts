import {
  BASE_VARIANT_CONFIG,
  cloneParameterList as cloneBase,
  initCustomizedProcessPage7Data5_3 as initBase,
} from '../Process7-page5-3/parameterDefaults';
import type { Page5_3ParameterItem, Page5_3VariantConfig } from '../Process7-page5-3/types';

export type { AssemblyTableRow, Page5_3ParameterItem } from '../Process7-page5-3/types';

export const VARIANT_CONFIG: Page5_3VariantConfig = {
  assemblyTableNum: 'DY1-6-2_3_T_ZPZH_2',
  chassisSourceTableNum: 'DY1-6-2_1_T_XZZHCX_2',
  modelParamPrefix: 'DY4_100_002B',
  templateModel: 'temp_dy4_100_002B.prt',
  exportParamKeys: {
    modelFileName: 'DY1_6_2_2_NAME_2',
    cabinetU: 'DY4_100_001B_U',
    cabinetW: 'DY4_100_001B_W',
    cabinetL: 'DY4_100_001B_L',
    exitWire: 'DY1_6_2_4_LOC_2',
    cabinetH: 'DY4_100_001B_H',
    remark: 'DY1_6_2_2_JGBZ_2',
  },
};

export function initCustomizedProcessPage7Data5_3B(pageid: string): Page5_3ParameterItem[] {
  return initBase(pageid, VARIANT_CONFIG);
}

export function cloneParameterList(source: Page5_3ParameterItem[]): Page5_3ParameterItem[] {
  return cloneBase(source);
}

export { BASE_VARIANT_CONFIG };
