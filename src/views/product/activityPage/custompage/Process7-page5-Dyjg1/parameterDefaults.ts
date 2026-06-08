import { initCustomizedProcessPage7DataDyjg, cloneParameterList } from '../Process7-page5-Dyjg/parameterDefaults';
import type { DyjgParameterItem } from '../Process7-page5-Dyjg/types';

export type { DyjgParameterItem };

export const DYJG1_CONFIG = {
  suffix: '',
  tableNum: 'DY1_1_10_SRTABLE_Dyjg1',
  label: '电源机柜1',
};

export function initCustomizedProcessPage7Data5_Dyjg1(pageid: string): DyjgParameterItem[] {
  return initCustomizedProcessPage7DataDyjg(pageid, DYJG1_CONFIG);
}

export function cloneDyjg1ParameterList(source: DyjgParameterItem[]): DyjgParameterItem[] {
  return cloneParameterList(source);
}
