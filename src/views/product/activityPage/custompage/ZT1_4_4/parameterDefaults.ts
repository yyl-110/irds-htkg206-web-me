export interface Zt1_44ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
}

export interface Zt1_44FieldDef {
  index: number;
  label: string;
  parameterNum: string;
  inputName: string;
}

export const AXLE_COUNT_OPTIONS = [
  { label: '2', value: 7 },
  { label: '3', value: 6 },
  { label: '4', value: 5 },
  { label: '5', value: 4 },
  { label: '6', value: 3 },
];

export const INPUT_FIELDS: Zt1_44FieldDef[] = [
  { index: 1, label: '前悬数量：', parameterNum: 'ZT1_4_4_QXSL', inputName: '前悬数量' },
  { index: 2, label: '后悬数量：', parameterNum: 'ZT1_4_4_HXSL', inputName: '后悬数量' },
  { index: 3, label: '质量/t：', parameterNum: 'ZT1_4_4_ZHILIANG', inputName: '质量/t' },
  { index: 4, label: '质心x/mm：', parameterNum: 'ZT1_4_4_ZXX', inputName: '质心x/mm' },
  { index: 5, label: '一桥距回转中心距离：', parameterNum: 'ZT1_4_4_1QJL', inputName: '一桥距回转中心距离' },
  { index: 6, label: '1、2轴距：', parameterNum: 'ZT1_4_4_12J', inputName: '1、2轴距' },
  { index: 7, label: '2、3轴距：', parameterNum: 'ZT1_4_4_23J', inputName: '2、3轴距' },
  { index: 8, label: '3、4轴距：', parameterNum: 'ZT1_4_4_34J', inputName: '3、4轴距' },
  { index: 9, label: '4、5轴距：', parameterNum: 'ZT1_4_4_45J', inputName: '4、5轴距' },
  { index: 10, label: '5、6轴距：', parameterNum: 'ZT1_4_4_56J', inputName: '5、6轴距' },
];

export const MIDDLE_FIELDS: Zt1_44FieldDef[] = [
  { index: 11, label: '前等效支撑：', parameterNum: 'ZT1_4_4_QDXZC', inputName: '前等效支撑' },
  { index: 12, label: '后等效支撑：', parameterNum: 'ZT1_4_4_HDXZC', inputName: '后等效支撑' },
  { index: 13, label: '前后支撑距离：', parameterNum: 'ZT1_4_4_QHZCJL', inputName: '前后支撑距离' },
  { index: 14, label: '前支撑距质心：', parameterNum: 'ZT1_4_4_QZCJZX', inputName: '前支撑距质心' },
  { index: 15, label: '后支撑距质心：', parameterNum: 'ZT1_4_4_HZCJZX', inputName: '后支撑距质心' },
  { index: 16, label: '平均载荷：', parameterNum: 'ZT1_4_4_PJZHOUHE', inputName: '平均载荷' },
];

export const RESULT_FIELDS: Zt1_44FieldDef[] = [
  { index: 17, label: '前悬载荷：', parameterNum: 'ZT1_4_4_QXZH', inputName: '前悬载荷' },
  { index: 18, label: '后悬载荷：', parameterNum: 'ZT1_4_4_HXZH', inputName: '后悬载荷' },
  { index: 19, label: '前悬载荷偏差：', parameterNum: 'ZT1_4_4_QXZHPC', inputName: '前悬载荷偏差' },
  { index: 20, label: '后悬载荷偏差：', parameterNum: 'ZT1_4_4_HXZHPC', inputName: '后悬载荷偏差' },
];

const PARAMETER_INDEX_MAP = new Map<string, number>([
  ['ZT1_4_4_ZHOUSHU', 0],
  ...INPUT_FIELDS.map(field => [field.parameterNum, field.index] as const),
  ...MIDDLE_FIELDS.map(field => [field.parameterNum, field.index] as const),
  ...RESULT_FIELDS.map(field => [field.parameterNum, field.index] as const),
]);

export function createDefaultZt1_44ParameterList(pageId = ''): Zt1_44ParameterItem[] {
  const createItem = (parameterNum: string, inputName: string): Zt1_44ParameterItem => ({
    inputOrOutput: '1',
    ifSingleLine: '1',
    inputType: '0',
    parameterNum,
    parameterId: '',
    defaultValue: '',
    propertyType: '1',
    pageId,
    inputName,
  });

  return [
    createItem('ZT1_4_4_ZHOUSHU', '轴数'),
    ...INPUT_FIELDS.map(field => createItem(field.parameterNum, field.inputName)),
    ...MIDDLE_FIELDS.map(field => createItem(field.parameterNum, field.inputName)),
    ...RESULT_FIELDS.map(field => createItem(field.parameterNum, field.inputName)),
  ];
}

export function getParameterIndex(parameterNum: string) {
  return PARAMETER_INDEX_MAP.get(parameterNum);
}
