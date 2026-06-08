import {
  cloneParameterList,
  initCustomizedProcessPage7Data5_5,
  type Page5_5ParameterItem,
} from '../Process7-page5-5/parameterDefaults';

export type { Page5_5ParameterItem } from '../Process7-page5-5/parameterDefaults';
export { cloneParameterList };

const SUPPLY_TYPE_OPTIONS = [
  { label: '交流输入、交流母线' },
  { label: '交流输入、高压直流母线' },
  { label: '高压直流输入、高压直流母线' },
];

export function initCustomizedProcessPage7Data5_InputDyjg(pageid: string): Page5_5ParameterItem[] {
  const list = initCustomizedProcessPage7Data5_5(pageid);
  list[0].selectStrVal = SUPPLY_TYPE_OPTIONS;
  list[0].selectStr = SUPPLY_TYPE_OPTIONS;
  return list;
}

export const INPUT_DYJG_SUPPLY_TYPE_OPTIONS = SUPPLY_TYPE_OPTIONS;
