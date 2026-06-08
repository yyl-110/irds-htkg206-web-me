import { cloneParameterList, initCustomizedProcessPage7DataDyjg } from '../Process7-page5-Dyjg/parameterDefaults';
import type { DyjgParameterItem } from '../Process7-page5-Dyjg/types';

export type { DyjgParameterItem };

export const DYJG2_CONFIG = {
  suffix: '_2',
  tableNum: 'DY1_1_10_SRTABLE_Dyjg2',
  label: '电源机柜2',
};

export function initCustomizedProcessPage7Data5_Dyjg2(pageid: string): DyjgParameterItem[] {
  return initCustomizedProcessPage7DataDyjg(pageid, DYJG2_CONFIG);
}

export function cloneDyjg2ParameterList(source: DyjgParameterItem[]): DyjgParameterItem[] {
  return cloneParameterList(source);
}
