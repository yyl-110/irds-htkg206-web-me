export interface Page2TableRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  delIndex?: number;
  id?: string | number;
}

export interface Page2ParameterItem {
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
    colData?: Array<{ colName?: string; isShowCol?: string }>;
    rowData?: Page2TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

const MOTOR_COL_DATA = [
  { colName: '选择', isShowCol: '1' },
  { colName: '类别', isShowCol: '1' },
  { colName: '电机序号', isShowCol: '1' },
  { colName: '产品代号', isShowCol: '1' },
  { colName: '空载速度 r/min', isShowCol: '1' },
  { colName: '额定转速 r/min', isShowCol: '1' },
  { colName: '额定转矩 Nm', isShowCol: '1' },
  { colName: '额定电压 V', isShowCol: '1' },
  { colName: '额定电流 A', isShowCol: '1' },
  { colName: '额定功率 W', isShowCol: '1' },
  { colName: '转速系数 V/(r/min)', isShowCol: '1' },
  { colName: '转矩系数 Nm/A', isShowCol: '1' },
  { colName: '最大输出转矩 Nm', isShowCol: '1' },
  { colName: '等效阻抗 欧姆', isShowCol: '1' },
  { colName: '等效感抗 H', isShowCol: '1' },
  { colName: '转子转动惯量 Kgm2', isShowCol: '1' },
  { colName: '机电时间常数 ms', isShowCol: '1' },
  { colName: '齿轮模数 mm', isShowCol: '1' },
  { colName: '齿轮齿数', isShowCol: '1' },
  { colName: '配置图片', isShowCol: '1' },
  { colName: '其它说明', isShowCol: '1' },
];

const MOTOR_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20'];

/** 电机选型表 componentId（customizedProcess-page2 专用） */
export const PAGE2_MOTOR_TABLE_COMPONENT_ID = 15;

export function createDefaultMotorRow(motorNum: number, delIndex: number): Page2TableRow {
  return {
    p0: '1',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    p1: `电机${motorNum}`,
    cellParameterId1: '',
    cellParentNum1: 'DJ1_1_DJXH',
    cellInputOrOutput1: '1',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'DJ1_1_DJDH',
    cellInputOrOutput2: '1',
    parameterNum2: 'DJ_C003_CPDH',
    cellParaType2: '模块库读取值',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'DJ1_1_DJKZZS',
    cellInputOrOutput3: '1',
    parameterNum3: 'DJ_C003_KZZS',
    cellParaType3: '模块库读取值',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'DJ1_1_DJEDZS',
    cellInputOrOutput4: '1',
    parameterNum4: 'DJ_C003_EDZS',
    cellParaType4: '模块库读取值',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'DJ1_1_DJEDZJ',
    cellInputOrOutput5: '1',
    parameterNum5: 'DJ_C003_EDZJ',
    cellParaType5: '模块库读取值',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'DJ1_1_DJEDDY',
    cellInputOrOutput6: '1',
    parameterNum6: 'DJ_C003_EDDY',
    cellParaType6: '模块库读取值',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'DJ1_1_DJEDDL',
    cellInputOrOutput7: '1',
    parameterNum7: 'DJ_C003_EDDL',
    cellParaType7: '模块库读取值',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'DJ1_1_DJEDGL',
    cellInputOrOutput8: '1',
    parameterNum8: 'DJ_C003_EDGL',
    cellParaType8: '模块库读取值',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'DJ1_1_DJZSXS',
    cellInputOrOutput9: '1',
    parameterNum9: 'DJ_C003_ZSXS',
    cellParaType9: '模块库读取值',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '1',
    parameterNum10: 'DJ_C003_ZJXS',
    cellParaType10: '模块库读取值',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: 'DJ1_1_DJSRLJ_MAX',
    cellInputOrOutput11: '1',
    parameterNum11: 'DJ_C003_ZDSCZJ',
    cellParaType11: '模块库读取值',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'DJ1_1_DJDXZK',
    cellInputOrOutput12: '1',
    parameterNum12: 'DJ_C003_DXZK',
    cellParaType12: '模块库读取值',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: 'DJ1_1_DJDXGK',
    cellInputOrOutput13: '1',
    parameterNum13: 'DJ_C003_DXGL',
    cellParaType13: '模块库读取值',
    p14: '',
    cellParameterId14: '',
    cellParentNum14: 'DJ1_1_DJZZZDGL',
    cellInputOrOutput14: '1',
    parameterNum14: 'DJ_C003_ZZZDGL',
    cellParaType14: '模块库读取值',
    p15: '',
    cellParameterId15: '',
    cellParentNum15: 'DJ1_1_DJSJCS',
    cellInputOrOutput15: '1',
    parameterNum15: 'DJ_C003_TIME',
    cellParaType15: '模块库读取值',
    p16: '',
    cellParameterId16: '',
    cellParentNum16: 'DJ1_1_DJCL_M',
    cellInputOrOutput16: '1',
    parameterNum16: 'DJ_C003_M',
    cellParaType16: '模块库读取值',
    p17: '',
    cellParameterId17: '',
    cellParentNum17: 'DJ1_1_DJCL_B',
    cellInputOrOutput17: '1',
    parameterNum17: 'DJ_C003_W',
    cellParaType17: '模块库读取值',
    p18: '',
    cellParameterId18: '',
    cellParentNum18: 'DJ1_1_DJCL_Z',
    cellInputOrOutput18: '1',
    parameterNum18: 'DJ_C003_Z',
    cellParaType18: '模块库读取值',
    p19: '',
    cellParameterId19: '',
    cellParentNum19: '',
    cellInputOrOutput19: '1',
    p20: '',
    cellParameterId20: '',
    cellParentNum20: '',
    cellInputOrOutput20: '1',
    delIndex,
  };
}

export function createDefaultPage2ParameterList(pageId = ''): Page2ParameterItem[] {
  const defaultRow = createDefaultMotorRow(1, 1);
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_EDGL_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它额定功率（旋转）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_EDGL_Z',
      parameterId: '',
      defaultValue: '8000',
      propertyType: '1',
      pageId,
      inputName: '舟它额定功率（直线）',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '21',
        colData: MOTOR_COL_DATA,
        rowData: [defaultRow],
        colStr: MOTOR_COL_STR,
      },
      tableName: '电机选型',
      inputName: '',
      tableType: '2',
      tableNum: 'DJ2_T_MOTORSELECT',
      componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID,
    },
  ];
}
