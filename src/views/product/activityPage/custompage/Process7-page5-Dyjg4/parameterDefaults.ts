import { cloneParameterList, initCustomizedProcessPage7DataDyjg } from '../Process7-page5-Dyjg/parameterDefaults';
import type { DyjgParameterItem } from '../Process7-page5-Dyjg/types';

export type { DyjgParameterItem };

export const DYJG4_CONFIG = {
  suffix: '_4',
  tableNum: 'DY1_1_10_SRTABLE_Dyjg4',
  label: '电源机柜4',
};

export function initCustomizedProcessPage7Data5_Dyjg4(pageid: string): DyjgParameterItem[] {
  return initCustomizedProcessPage7DataDyjg(pageid, DYJG4_CONFIG);
}

export function cloneDyjg4ParameterList(source: DyjgParameterItem[]): DyjgParameterItem[] {
  return cloneParameterList(source);
}
