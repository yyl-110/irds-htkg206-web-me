import {
  cloneParameterList as cloneBase,
  initCustomizedProcessPage7Data5_3 as initBase,
} from '../Process7-page5-3/parameterDefaults';
import type { Page5_3ParameterItem, Page5_3VariantConfig } from '../Process7-page5-3/types';

export type { AssemblyTableRow, Page5_3ParameterItem } from '../Process7-page5-3/types';

export const VARIANT_CONFIG: Page5_3VariantConfig = {
  assemblyTableNum: 'DY1-6-2_3_T_ZPZH_4',
  chassisSourceTableNum: 'DY1-6-2_1_T_XZZHCX_4',
  modelParamPrefix: 'DY4_100_002D',
  templateModel: 'temp_dy4_100_002D.prt',
  exportParamKeys: {
    modelFileName: 'DY1_6_2_2_NAME_4',
    cabinetU: 'DY4_100_001D_U',
    cabinetW: 'DY4_100_001D_W',
    cabinetL: 'DY4_100_001D_L',
    exitWire: 'DY1_6_2_4_LOC_4',
    cabinetH: 'DY4_100_001D_H',
    remark: 'DY1_6_2_2_JGBZ_4',
  },
};

export function initCustomizedProcessPage7Data5_3D(pageid: string): Page5_3ParameterItem[] {
  return initBase(pageid, VARIANT_CONFIG);
}

export function cloneParameterList(source: Page5_3ParameterItem[]): Page5_3ParameterItem[] {
  return cloneBase(source);
}
