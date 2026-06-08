export {
  NUMERIC_REG,
  TABLE_INDEX,
  TABLE_COL_STR,
  isThicknessField,
  getLaminateTableRows,
  setLaminateTableRows,
  type LaminateRow,
} from '../FS1_5_1_1_K/parameterDefaults';

import {
  createDefaultLaminateRow as createKRow,
  type Fs151_1_1KParameterItem,
  type LaminateRow,
} from '../FS1_5_1_1_K/parameterDefaults';

export type Fs151_1_1OParameterItem = Fs151_1_1KParameterItem;

export function createDefaultLaminateORow(codeNum: number, outputMode = false): LaminateRow {
  return createKRow(codeNum, '蒙皮', outputMode);
}

export function createDefaultFs151_1_1OParameterList(pageId = ''): Fs151_1_1OParameterItem[] {
  const materialFields = [
    ['FS1_5_1_1K_C1YE', '沿纤维方向的弹性模量EL1(GPa)'],
    ['FS1_5_1_1K_C1TE', '垂直于纤维方向的弹性模量ET1(GPa)'],
    ['FS1_5_1_1K_C1V1', '单向板纵向柏松比vLT'],
    ['FS1_5_1_1K_C1V2', '单向板纵横剪切弹性模量GLT(GPa)'],
    ['FS1_5_1_1K_C2YE', '沿纤维方向的弹性模量EL1(GPa)'],
    ['FS1_5_1_1K_C2TE', '垂直于纤维方向的弹性模量ET1(GPa)'],
    ['FS1_5_1_1K_C2V1', '单向板纵向柏松比vLT'],
    ['FS1_5_1_1K_C2V2', '单向板纵横剪切弹性模量GLT(GPa)'],
  ] as const;

  const formItems = materialFields.map(([parameterNum, inputName]) => ({
    inputOrOutput: '0',
    ifSingleLine: '1',
    inputType: '0',
    parameterNum,
    parameterId: '',
    defaultValue: '',
    propertyType: '1',
    pageId,
    inputName,
  }));

  return [
    ...formItems,
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '28',
        rowData: [createDefaultLaminateORow(1)],
        colStr: Array.from({ length: 28 }, (_, i) => `p${i}`),
        colData: Array.from({ length: 28 }, (_, i) => ({ colName: `col${i}`, isShowCol: '1' })),
      },
      tableName: '筒壁层合板性能计算',
      inputName: '筒壁层合板性能计算',
      tableType: '1',
      tableNum: 'FS1-5-1-1K',
    },
  ];
}

export function createAddORow(codeNum: number, delIndex: number): LaminateRow {
  return { ...createDefaultLaminateORow(codeNum, true), delIndex };
}
