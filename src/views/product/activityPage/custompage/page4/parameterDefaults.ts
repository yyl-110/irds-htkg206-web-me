export interface Page4TableRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
  p10?: string;
  p11?: string;
  p12?: string;
  p13?: string;
  p14?: string;
  p15?: string;
  p16?: string;
}

export interface Page4ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
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
    rowData?: Page4TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE4_TABLE_NUM = 'DJ4_T_COMBINSCHEME';

/** 组合方案表 componentId（customizedProcess-page4 专用） */
export const PAGE4_TABLE_COMPONENT_ID = 19;

const PAGE4_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16'];

export function createDefaultPage4Row(): Page4TableRow {
  return {
    p0: '组合方案1',
    cellParameterId0: '',
    cellParentNum0: 'DJ2_5_ZHFA',
    cellInputOrOutput0: '1',
    cellInputName0: '组合方案',
    p1: '2000',
    cellParameterId1: '',
    cellParentNum1: 'DJ2_4_SCLJ_MAX',
    cellInputOrOutput1: '1',
    cellInputName1: '舟它最大输出力矩',
    p2: '1500',
    cellParameterId2: '',
    cellParentNum2: 'DJ2_4_KZZS_MAX',
    cellInputOrOutput2: '1',
    cellInputName2: '舟它最大空载转速',
    p3: '2500',
    cellParameterId3: '',
    cellParentNum3: 'DJ2_4_EDZS',
    cellInputOrOutput3: '1',
    cellInputName3: '舟它额定负载转速',
    p4: 'tab1002',
    cellParameterId4: '',
    cellParentNum4: 'DJ1_1_DJDH',
    cellInputOrOutput4: '1',
    cellInputName4: '电机产品代号',
    p5: '1800',
    cellParameterId5: '',
    cellParentNum5: 'DJ1_1_DJKZZS',
    cellInputOrOutput5: '1',
    cellInputName5: '电机空载转速',
    p6: '2350',
    cellParameterId6: '',
    cellParentNum6: 'DJ1_1_DJEDZS',
    cellInputOrOutput6: '1',
    cellInputName6: '电机额定转速',
    p7: '1.8',
    cellParameterId7: '',
    cellParentNum7: 'DJ1_1_DJEDZJ',
    cellInputOrOutput7: '1',
    cellInputName7: '电机额定转矩',
    p8: '220',
    cellParameterId8: '',
    cellParentNum8: 'DJ1_1_DJEDDY',
    cellInputOrOutput8: '1',
    cellInputName8: '电机额定电压',
    p9: '16',
    cellParameterId9: '',
    cellParentNum9: 'DJ1_1_DJEDDL',
    cellInputOrOutput9: '1',
    cellInputName9: '电机额定电流',
    p10: '1003',
    cellParameterId10: '',
    cellParentNum10: 'DJ2_2_JSQDH',
    cellInputOrOutput10: '1',
    cellInputName10: '末端减速器产品代号',
    p11: '0.75',
    cellParameterId11: '',
    cellParentNum11: 'DJ2_2_JSQCDB',
    cellInputOrOutput11: '1',
    cellInputName11: '末端减速器传动比（自动计算）',
    p12: '380',
    cellParameterId12: '',
    cellParentNum12: 'DJ2_2_JSQSCL_MAX',
    cellInputOrOutput12: '1',
    cellInputName12: '末端减速器最大输出力',
    p13: '600',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '末端减速器导程',
    p14: '245',
    cellParameterId14: '',
    cellParentNum14: 'DJ2_2_JSQZJ',
    cellInputOrOutput14: '1',
    cellInputName14: '末端减速器中径',
    p15: '120',
    cellParameterId15: '',
    cellParentNum15: 'DJ2_3_JXXC_2',
    cellInputOrOutput15: '1',
    cellInputName15: '末端减速器机械行程（一半）',
    p16: '16',
    cellParameterId16: '',
    cellParentNum16: 'DJ2_3_CSZJSB',
    cellInputOrOutput16: '1',
    cellInputName16: '总减速比',
  };
}

export function createDefaultPage4ParameterList(pageId = ''): Page4ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '17',
        rowData: [createDefaultPage4Row()],
        colStr: PAGE4_COL_STR,
      },
      tableName: '组合方案确定',
      inputName: '',
      tableType: '2',
      tableNum: PAGE4_TABLE_NUM,
      componentId: PAGE4_TABLE_COMPONENT_ID,
    },
  ];
}
