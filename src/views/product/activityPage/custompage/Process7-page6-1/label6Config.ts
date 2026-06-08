export interface Label6FieldConfig {
  propKey: `modeTypeVal${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
  suffix: string;
}

/** componentType = '0'，page6 交流版 */
export const LABEL6_FIELDS_AC: Label6FieldConfig[] = [
  { propKey: 'modeTypeVal0', suffix: '交流用电量（KWH）：' },
  { propKey: 'modeTypeVal1', suffix: '低压直流用电量（KWH）：' },
  { propKey: 'modeTypeVal2', suffix: '交流功率（W）：' },
  { propKey: 'modeTypeVal3', suffix: '低压直流功率（W）：' },
  { propKey: 'modeTypeVal4', suffix: '低压直流母线用电量（KWH）：' },
  { propKey: 'modeTypeVal5', suffix: '低压直流母线用电功率（W）：' },
  { propKey: 'modeTypeVal6', suffix: '用电量(KWH)：' },
  { propKey: 'modeTypeVal7', suffix: '功率和（W）：' },
  { propKey: 'modeTypeVal8', suffix: '交流输入用电量（KWH）：' },
  { propKey: 'modeTypeVal9', suffix: '交流输入功率（W）：' },
];

/** componentType = '1'，page6-1 高压版 */
export const LABEL6_FIELDS_HV: Label6FieldConfig[] = [
  { propKey: 'modeTypeVal0', suffix: '高压直流用电量（KWH）：' },
  { propKey: 'modeTypeVal1', suffix: '低压直流用电量（KWH）：' },
  { propKey: 'modeTypeVal2', suffix: '高压直流功率（W）：' },
  { propKey: 'modeTypeVal3', suffix: '低压直流功率（W）：' },
  { propKey: 'modeTypeVal4', suffix: '高压直流母线用电量（KWH）：' },
  { propKey: 'modeTypeVal5', suffix: '高压直流母线用电功率（W）：' },
  { propKey: 'modeTypeVal6', suffix: '用电量(KWH)：' },
  { propKey: 'modeTypeVal7', suffix: '功率和（W）：' },
  { propKey: 'modeTypeVal8', suffix: '交流输入用电量（KWH）：' },
  { propKey: 'modeTypeVal9', suffix: '交流输入功率（W）：' },
];

export function getLabel6Fields(componentType: string): Label6FieldConfig[] {
  return componentType === '1' ? LABEL6_FIELDS_HV : LABEL6_FIELDS_AC;
}
