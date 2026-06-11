export interface Page2_1TableRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  delIndex?: number;
  id?: string | number;
}

export interface Page2_1ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  componentId?: string | number;
  id?: string | number;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    colData?: Array<{ colName?: string; isShowCol?: string; ifShowCols?: string }>;
    rowData?: Page2_1TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const REDUCER_TABLE_INDEX = 5;
export const REDUCER_TABLE_NUM = 'DJ2-1_T_JSQSELECT';

/** 减速器选型表 componentId（customizedProcess-page2-1 专用） */
export const PAGE2_1_REDUCER_TABLE_COMPONENT_ID = 16;

const REDUCER_COL_DATA = [
  { colName: '选择', ifShowCols: '1' },
  { colName: '减速器序号', isShowCol: '1' },
  { colName: '产品代号', isShowCol: '1' },
  { colName: '产品名称', isShowCol: '1' },
  { colName: '输出形式', ifShowCols: '1' },
  { colName: '传动比(直线或旋转) N/Nm或r/r', isShowCol: '1' },
  { colName: '最大输出能力(直线或旋转) N或Nm', isShowCol: '1' },
  { colName: '导程(直线)', isShowCol: '1' },
  { colName: '中径(直线)', isShowCol: '1' },
  { colName: '全机械行程(直线或旋转) mm或度', isShowCol: '1' },
  { colName: '重量', isShowCol: '1' },
  { colName: '接口示意图', isShowCol: '1' },
  { colName: '生产厂家', isShowCol: '1' },
  { colName: '其它说明', isShowCol: '1' },
];

const REDUCER_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'];

export function createDefaultReducerRow(reducerNum: number, delIndex: number): Page2_1TableRow {
  return {
    p0: '1',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    p1: `减速器${reducerNum}`,
    cellParameterId1: '',
    cellParentNum1: 'DJ2_2_JSQXH',
    cellInputOrOutput1: '1',
    cellInputName1: '减速器序号',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'DJ2_2_JSQDH',
    cellInputOrOutput2: '1',
    cellInputName2: '减速器产品代号',
    parameterNum2: 'DJ_C004_CPDH',
    cellParaType2: '模块库读取值',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'DJ2_2_JSNAME',
    cellInputOrOutput3: '1',
    cellInputName3: '产品名称',
    parameterNum3: 'DJ_C004_CPMC',
    cellParaType3: '模块库读取值',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'DJ2_2_JSQSCXS',
    cellInputOrOutput4: '1',
    cellInputName4: '输出形式',
    parameterNum4: 'DJ_C004_SCXS',
    cellParaType4: '模块库读取值',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'DJ2_2_JSQCDB',
    cellInputOrOutput5: '1',
    cellInputName5: '传动比',
    parameterNum5: 'DJ_C004_CDB',
    cellParaType5: '模块库读取值',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'DJ2_2_JSQSCL_MAX',
    cellInputOrOutput6: '1',
    cellInputName6: '最大输出能力',
    parameterNum6: 'DJ_C004_ZDSCNL',
    cellParaType6: '模块库读取值',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'DJ2_2_JSQDC',
    cellInputOrOutput7: '1',
    cellInputName7: '导程(直线)',
    parameterNum7: 'DJ_C004_DC',
    cellParaType7: '模块库读取值',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'DJ2_2_JSQZJ',
    cellInputOrOutput8: '1',
    cellInputName8: '中径(直线)',
    parameterNum8: 'DJ_C004_ZJ',
    cellParaType8: '模块库读取值',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'DJ2_2_JSQQJXXC',
    cellInputOrOutput9: '1',
    cellInputName9: '全机械行程(直线或旋转)',
    parameterNum9: 'DJ_C004_QJXXC',
    cellParaType9: '模块库读取值',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: 'DJ2_2_JSQZL',
    cellInputOrOutput10: '1',
    cellInputName10: '重量',
    parameterNum10: 'DJ_C004_WEIGHT',
    cellParaType10: '模块库读取值',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '接口示意图',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'DJ2_2_JSQSCCJ',
    cellInputOrOutput12: '1',
    cellInputName12: '生产厂家',
    parameterNum12: 'DJ_C004_SUPPLY',
    cellParaType12: '模块库读取值',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '其他说明',
    delIndex,
  };
}

export function createDefaultPage2_1ParameterList(pageId = ''): Page2_1ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_JXXC_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '机械行程（单边转角）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_JXXC_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '机械行程（单边直线）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_MDJSQXS',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它末端减速器形式',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_JSQZH_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '减速器载荷（旋转）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_JSQZH_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '减速器载荷（直线）',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '14',
        colData: REDUCER_COL_DATA,
        rowData: [createDefaultReducerRow(1, 1)],
        colStr: REDUCER_COL_STR,
      },
      tableName: '减速器选型',
      inputName: '减速器选型',
      tableType: '2',
      tableNum: REDUCER_TABLE_NUM,
      componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_GZFS',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它工作方式',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_DXLB',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '等效力臂',
    },
  ];
}
