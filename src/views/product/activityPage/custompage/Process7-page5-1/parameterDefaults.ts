import type { Process7ParameterItem } from '../shared/process7/setSaveBtnEnable';

export type Page5_1ParameterItem = Process7ParameterItem & {
  inputOrOutput?: string;
  inputType?: string;
  parameterNum?: string;
  inputName?: string;
  propertyType?: string;
  pageId?: string;
  tableName?: string;
  tableNum?: string;
  tableType?: string;
  tableMap?: Process7ParameterItem['tableMap'] & {
    tableType?: string;
    colNums?: string;
    rowNums?: string | number;
    colStr?: string[];
  };
};

export type ChassisTableRow = Record<string, string | number | undefined>;

export const TABLE_NUM = 'DY1-6-2_1_T_XZZHCX';

export function createChassisRow(partial: ChassisTableRow = {}): ChassisTableRow {
  return {
    p0: '',
    p1: 1,
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: 'TEMP_DY4_100_002.PRT',
    p12: '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '类别',
    cellParameterId2: '',
    cellParentNum2: 'DY1_6_MXMC',
    cellInputOrOutput2: '1',
    cellInputName2: '模型文件名',
    parameterNum2: 'DY_C014_MXMC',
    cellParaType2: '模块库读取值',
    cellParameterId3: '',
    cellParentNum3: 'DY1_6_XCMC',
    cellInputOrOutput3: '1',
    cellInputName3: '插箱名称',
    parameterNum3: 'DY_C014_CXMC',
    cellParaType3: '模块库读取值',
    cellParameterId4: '',
    cellParentNum4: 'DY1_6_XCGD',
    cellInputOrOutput4: '1',
    cellInputName4: '高度(U)',
    parameterNum4: 'DY_C014_CXGD',
    cellParaType4: '模块库读取值',
    cellParameterId5: '',
    cellParentNum5: 'DY1_6_XCSD',
    cellInputOrOutput5: '1',
    cellInputName5: '深度',
    parameterNum5: 'DY_C014_CXSD',
    cellParaType5: '模块库读取值',
    cellParameterId6: '',
    cellParentNum6: 'DY1_6_XCKD',
    cellInputOrOutput6: '1',
    cellInputName6: '宽度',
    parameterNum6: 'DY_C014_CXKD',
    cellParaType6: '模块库读取值',
    cellParameterId7: '',
    cellParentNum7: 'DY1_6_SRDY',
    cellInputOrOutput7: '1',
    cellInputName7: '输入电压V',
    parameterNum7: 'DY_C014_SRDY',
    cellParaType7: '模块库读取值',
    cellParameterId8: '',
    cellParentNum8: 'DY1_6_SCDY',
    cellInputOrOutput8: '1',
    cellInputName8: '输出电压V',
    parameterNum8: 'DY_C014_SCDY',
    cellParaType8: '模块库读取值',
    cellParameterId9: '',
    cellParentNum9: 'DY1_6_SCDL',
    cellInputOrOutput9: '1',
    cellInputName9: '输出电流A',
    parameterNum9: 'DY_C014_SCDL',
    cellParaType9: '模块库读取值',
    cellParameterId10: '',
    cellParentNum10: 'DY1_6_XCBZ',
    cellInputOrOutput10: '1',
    cellInputName10: '备注',
    parameterNum10: 'DY_C014_CXBZ',
    cellParaType10: '模块库读取值',
    cellParameterId11: '',
    cellParentNum11: 'DY1_6_XCMBMX',
    cellInputOrOutput11: '1',
    cellInputName11: '模板模型文件名',
    parameterNum11: 'DY_C014_CXMBMX',
    cellParaType11: '模块库读取值',
    cellParameterId12: '',
    cellParentNum12: '',
    cellInputOrOutput12: '1',
    cellInputName12: '模型类型',
    parameterNum12: '',
    cellParaType12: '模块库读取值',
    ...partial,
  };
}

export function initCustomizedProcessPage7Data5_1(pageid: string): Page5_1ParameterItem[] {
  const data: ChassisTableRow[] = [
    createChassisRow({
      p0: '1',
      p1: 1,
      delIndex: 1,
    }),
  ];

  return [
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_H', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大高度尺寸' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_W', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SCGL', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出功率' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SCLS', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出路数' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_S', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '柜体最大深' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SRDY', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '额定输入电压(V)' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_DQJK', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '电气接口' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_1_10_SRDYFW', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输入电压范围(V)' },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '2',
        colNums: '9',
        rowData: data,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'],
      },
      tableName: '选择组合插箱',
      inputName: '选择组合插箱',
      tableType: '2',
      tableNum: TABLE_NUM,
    },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXGDHU', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱高度（U）和' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXGDH', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱高度和' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXZDSH', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大深度' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_CXZDSW', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '插箱最大宽' },
    { inputOrOutput: '1', ifSingleLine: '1', inputType: '0', parameterNum: 'DY1_6_2_SCDLH', parameterId: '', defaultValue: '', propertyType: '1', pageId: pageid, inputName: '输出电流A(求和)' },
  ];
}

export function cloneParameterList(source: Page5_1ParameterItem[]): Page5_1ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}
