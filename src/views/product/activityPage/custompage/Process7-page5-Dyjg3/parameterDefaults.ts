import { cloneParameterList, initCustomizedProcessPage7DataDyjg } from '../Process7-page5-Dyjg/parameterDefaults';
import type { DyjgParameterItem } from '../Process7-page5-Dyjg/types';

export type { DyjgParameterItem };

export const DYJG3_CONFIG = {
  suffix: '_3',
  tableNum: 'DY1_1_10_SRTABLE_Dyjg3',
  label: '电源机柜3',
};

export function initCustomizedProcessPage7Data5_Dyjg3(pageid: string): DyjgParameterItem[] {
  return initCustomizedProcessPage7DataDyjg(pageid, DYJG3_CONFIG);
}

export function cloneDyjg3ParameterList(source: DyjgParameterItem[]): DyjgParameterItem[] {
  return cloneParameterList(source);
}
