export interface Page0_5ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  /** 保存到 tables 接口时使用的组件 id */
  componentId?: string | number;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  colData?: Array<{ colName?: string; isShowCol?: string }>;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Array<Record<string, string>>;
    colStr?: string[];
  };
}

export function createDefaultPage0_5ParameterList(pageId = ''): Page0_5ParameterItem[] {
  const data1 = [
    {
      p0: '摇臂长度',
      p1: 'R',
      p2: '42',
      p3: 'mm',
      cellInputOrOutput0: '1',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_BBCD',
      cellInputOrOutput2: '0',
      cellInputOrOutput3: '1',
    },
    {
      p0: '连杆长度',
      p1: 'L',
      p2: '80',
      p3: 'mm',
      cellInputOrOutput0: '1',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_LGCD',
      cellInputOrOutput2: '0',
      cellInputOrOutput3: '1',
    },
    {
      p0: '初始偏向角',
      p1: 'del_0',
      p2: '3',
      p3: '°',
      cellInputOrOutput0: '1',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_CSBXJ',
      cellInputOrOutput2: '0',
      cellInputOrOutput3: '1',
    },
    {
      p0: '支耳初始位置X轴',
      p1: 'Xs0',
      p2: '42',
      p3: 'mm',
      cellInputOrOutput0: '1',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_ZECSWZ_X',
      cellInputOrOutput2: '0',
      cellInputOrOutput3: '1',
    },
  ];

  const data2 = [
    {
      p0: '0',
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: '',
      p7: '',
      p8: '',
      p9: '',
      cellParameterId0: '',
      cellParentNum0: 'DJ1_4_ZDJD',
      cellInputOrOutput0: '0',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_4_HD',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_LGJHD_X',
      cellInputOrOutput2: '1',
      cellParameterId3: '',
      cellParentNum3: 'DJ1_4_LGJHD_Y',
      cellInputOrOutput3: '1',
      cellParameterId4: '',
      cellParentNum4: 'DJ1_4_ZEJHD_Y',
      cellInputOrOutput4: '1',
      cellParameterId5: '',
      cellParentNum5: 'DJ1_4_XC',
      cellInputOrOutput5: '1',
      cellParameterId6: '',
      cellParentNum6: 'DJ1_4_GCJD1',
      cellInputOrOutput6: '1',
      cellParameterId7: '',
      cellParentNum7: 'DJ1_4_GCJD2',
      cellInputOrOutput7: '1',
      cellParameterId8: '',
      cellParentNum8: 'DJ1_4_DXLB',
      cellInputOrOutput8: '1',
      cellParameterId9: '',
      cellParentNum9: 'DJ1_4_JSBXZXS',
      cellInputOrOutput9: '1',
    },
  ];

  const data3 = [
    {
      p0: '1',
      p1: '0',
      p2: '0',
      p3: '0',
      p4: '0',
      p5: '0',
      p6: '0',
      p7: '0',
      p8: '0',
      p9: '0',
      cellParameterId0: '',
      cellParentNum0: 'DJ1_4_ZDJD',
      cellInputOrOutput0: '0',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_4_HD',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_4_LGJHD_X',
      cellInputOrOutput2: '1',
      cellParameterId3: '',
      cellParentNum3: 'DJ1_4_LGJHD_Y',
      cellInputOrOutput3: '1',
      cellParameterId4: '',
      cellParentNum4: 'DJ1_4_ZEJHD_Y',
      cellInputOrOutput4: '1',
      cellParameterId5: '',
      cellParentNum5: 'DJ1_4_XC',
      cellInputOrOutput5: '1',
      cellParameterId6: '',
      cellParentNum6: 'DJ1_4_GCJD1',
      cellInputOrOutput6: '1',
      cellParameterId7: '',
      cellParentNum7: 'DJ1_4_GCJD2',
      cellInputOrOutput7: '1',
      cellParameterId8: '',
      cellParentNum8: 'DJ1_4_DXLB',
      cellInputOrOutput8: '1',
      cellParameterId9: '',
      cellParentNum9: 'DJ1_4_JSBXZXS',
      cellInputOrOutput9: '1',
    },
  ];

  const trip = '';

  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '4',
        rowNums: '4',
        rowData: data1,
        colStr: ['p0', 'p1', 'p2', 'p3'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DJ1-1_T_INPUTPARAMS',
      colData: [
        { colName: '参数定义', isShowCol: '1' },
        { colName: '符号', isShowCol: '1' },
        { colName: '值', isShowCol: '1' },
        { colName: '单位', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '10',
        rowNums: '1',
        rowData: data2,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
      },
      tableName: '零位（初始位置）',
      inputName: '零位（初始位置）',
      tableType: '1',
      tableNum: 'DJ1-1_T_ZEROINITPOSITION',
      componentId: 1,
      colData: [
        { colName: '转动角度', isShowCol: '1' },
        { colName: '弧度', isShowCol: '1' },
        { colName: '摇臂-连杆绞合点X', isShowCol: '1' },
        { colName: '摇臂-连杆绞合点Y', isShowCol: '1' },
        { colName: '连杆-支耳绞合点Y', isShowCol: '1' },
        { colName: '行程', isShowCol: '1' },
        { colName: '过程角度1', isShowCol: '1' },
        { colName: '过程角度2', isShowCol: '1' },
        { colName: '等效力臂', isShowCol: '1' },
        { colName: '减速比修正系统', isShowCol: '1' },
      ],
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '0',
      parameterId: '',
      parameterNum: 'DJ1_4_ZXC',
      defaultValue: trip,
      propertyType: '1',
      pageId,
      inputName: '总行程',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '10',
        rowNums: '1',
        rowData: data3,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
      },
      tableName: '行程计算表',
      inputName: '行程计算表',
      tableType: '2',
      tableNum: 'DJ1-1_T_RESULTDATA',
      componentId: 2,
      colData: [
        { colName: '转动角度', isShowCol: '1' },
        { colName: '弧度', isShowCol: '1' },
        { colName: '摇臂-连杆绞合点X', isShowCol: '1' },
        { colName: '摇臂-连杆绞合点Y', isShowCol: '1' },
        { colName: '连杆-支耳绞合点Y', isShowCol: '1' },
        { colName: '行程', isShowCol: '1' },
        { colName: '过程角度1', isShowCol: '1' },
        { colName: '过程角度2', isShowCol: '1' },
        { colName: '等效力臂', isShowCol: '1' },
        { colName: '减速比修正系统', isShowCol: '1' },
      ],
    },
  ];
}
