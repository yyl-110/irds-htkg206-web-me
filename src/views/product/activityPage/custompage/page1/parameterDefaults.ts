export interface Page1ParameterItem {
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
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  componentId?: string | number;
  colData?: Array<{ colName?: string; isShowCol?: string }>;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Array<Record<string, string>>;
    colStr?: string[];
  };
}

/** 零位表 componentId（customizedProcess-page1 专用，勿与其他定制页复用） */
export const PAGE1_ZERO_TABLE_COMPONENT_ID = 3;
/** 结果数据表 componentId（customizedProcess-page1 专用） */
export const PAGE1_RESULT_TABLE_COMPONENT_ID = 4;

export function initCustomizedProcessPage1Data(pageId = ''): Page1ParameterItem[] {
  const data1 = [
    {
      p0: '喷管摆心',
      p1: '0',
      p2: '0',
      cellInputOrOutput0: '1',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_3_PGBX_X',
      cellInputOrOutput1: '0',
      cellParameterId2: '201',
      cellParentNum2: 'DJ1_3_PGBX_Y',
      cellInputOrOutput2: '0',
    },
    {
      p0: '下支耳（固定端）',
      p1: '27.2',
      p2: '178',
      cellInputOrOutput0: '1',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_3_XZE_X',
      cellInputOrOutput1: '0',
      cellParameterId2: '203',
      cellParentNum2: 'DJ1_3_XZE_Y',
      cellInputOrOutput2: '0',
    },
    {
      p0: '上支耳（自由端）',
      p1: '257',
      p2: '172',
      cellInputOrOutput0: '1',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_3_SZE_X',
      cellInputOrOutput1: '0',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_3_SZE_Y',
      cellInputOrOutput2: '0',
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
      p7: '1',
      cellParameterId0: '',
      cellParentNum0: 'DJ1_3_ZDJD',
      cellInputOrOutput0: '0',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_3_HD',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_3_X',
      cellInputOrOutput2: '1',
      cellParameterId3: '',
      cellParentNum3: 'DJ1_3_Y',
      cellInputOrOutput3: '1',
      cellParameterId4: '',
      cellParentNum4: 'DJ1_3_LENGTH',
      cellInputOrOutput4: '1',
      cellParameterId5: '',
      cellParentNum5: 'DJ1_3_XC',
      cellInputOrOutput5: '1',
      cellParameterId6: '',
      cellParentNum6: 'DJ1_3_DXLB',
      cellInputOrOutput6: '1',
      cellParameterId7: '',
      cellParentNum7: 'DJ1_3_JSBXZXS',
      cellInputOrOutput7: '1',
    },
  ];

  const data3 = [
    {
      p0: '0',
      p1: '0',
      p2: '0',
      p3: '0',
      p4: '0',
      p5: '0',
      p6: '0',
      p7: '0',
      cellParameterId0: '',
      cellParentNum0: 'DJ1_3_ZDJD',
      cellInputOrOutput0: '0',
      cellParameterId1: '',
      cellParentNum1: 'DJ1_3_HD',
      cellInputOrOutput1: '1',
      cellParameterId2: '',
      cellParentNum2: 'DJ1_3_X',
      cellInputOrOutput2: '1',
      cellParameterId3: '',
      cellParentNum3: 'DJ1_3_Y',
      cellInputOrOutput3: '1',
      cellParameterId4: '',
      cellParentNum4: 'DJ1_3_LENGTH',
      cellInputOrOutput4: '1',
      cellParameterId5: '',
      cellParentNum5: 'DJ1_3_XC',
      cellInputOrOutput5: '1',
      cellParameterId6: '',
      cellParentNum6: 'DJ1_3_DXLB',
      cellInputOrOutput6: '1',
      cellParameterId7: '',
      cellParentNum7: 'DJ1_3_JSBXZXS',
      cellInputOrOutput7: '1',
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
        colNums: '3',
        rowNums: '3',
        rowData: data1,
        colStr: ['p0', 'p1', 'p2'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DJ1_T_INPUTPARAMS',
      colData: [
        { colName: '参数定义', isShowCol: '1' },
        { colName: 'X(弹轴方向)', isShowCol: '1' },
        { colName: 'Y', isShowCol: '1' },
      ],
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '8',
        rowNums: '1',
        rowData: data2,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      },
      tableName: '零位（初始位置）',
      inputName: '零位（初始位置）',
      tableType: '1',
      tableNum: 'DJ1_T_ZEROINITPOSITION',
      componentId: PAGE1_ZERO_TABLE_COMPONENT_ID,
      colData: [
        { colName: '转动角度', isShowCol: '1' },
        { colName: '弧度', isShowCol: '1' },
        { colName: 'X', isShowCol: '1' },
        { colName: 'Y', isShowCol: '1' },
        { colName: '长度', isShowCol: '1' },
        { colName: '行程', isShowCol: '1' },
        { colName: '等效力臂', isShowCol: '1' },
        { colName: '减速比修正系数', isShowCol: '1' },
      ],
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '0',
      parameterId: '',
      parameterNum: 'DJ1_3_ZXC',
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
        colNums: '8',
        rowData: data3,
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      },
      tableName: '结果数据',
      inputName: '结果数据',
      tableNum: 'DJ1_T_RESULTDATA',
      tableType: '2',
      componentId: PAGE1_RESULT_TABLE_COMPONENT_ID,
      colData: [
        { colName: '转动角度', isShowCol: '1' },
        { colName: '弧度', isShowCol: '1' },
        { colName: 'X', isShowCol: '1' },
        { colName: 'Y', isShowCol: '1' },
        { colName: '长度', isShowCol: '1' },
        { colName: '行程', isShowCol: '1' },
        { colName: '等效力臂', isShowCol: '1' },
        { colName: '减速比修正系数', isShowCol: '1' },
      ],
    },
  ];
}

export function createDefaultPage1ParameterList(pageId = ''): Page1ParameterItem[] {
  return initCustomizedProcessPage1Data(pageId);
}
