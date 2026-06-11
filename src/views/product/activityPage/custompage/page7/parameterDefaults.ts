export interface Page7TableRow extends Record<string, string | number | undefined> {
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
  p17?: string;
  p18?: string;
  p19?: string;
  p20?: string;
  p21?: string;
  p22?: string;
  p23?: string;
  p24?: string;
  p25?: string;
  p26?: string;
  p27?: string;
  p28?: string;
}

export interface Page7ParameterItem {
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
    rowData?: Page7TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE7_TABLE_NUM = 'DJ7_T_XNCHECK';

/** 性能校核计算表 componentId（customizedProcess-page7 专用） */
export const PAGE7_TABLE_COMPONENT_ID = 22;

const PAGE7_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
  'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19',
  'p20', 'p21', 'p22', 'p23', 'p24', 'p25', 'p26', 'p27', 'p28',
];

export function createDefaultPage7Row(overrides?: Partial<Page7TableRow>): Page7TableRow {
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
    cellInputName2: '舟它最大空载速度',
    p3: '2500',
    cellParameterId3: '',
    cellParentNum3: 'DJ2_4_EDZS',
    cellInputOrOutput3: '1',
    cellInputName3: '舟它额定负载速度',
    p4: '100',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputOrOutput4: '1',
    cellInputName4: '理论总减速比',
    p5: '5.15',
    cellParameterId5: '',
    cellParentNum5: 'DJ2_6_CLJSB',
    cellInputOrOutput5: '1',
    cellInputName5: '理论齿轮减速比',
    p6: '6.39',
    cellParameterId6: '',
    cellParentNum6: '',
    cellInputOrOutput6: '1',
    cellInputName6: '齿轮减速比允许的范围-最小值',
    p7: '5.665',
    cellParameterId7: '',
    cellParentNum7: '',
    cellInputOrOutput7: '1',
    cellInputName7: '齿轮减速比允许的范围-最大值',
    p8: '2',
    cellParameterId8: '',
    cellParentNum8: 'DJ2_6_CLJSJS',
    cellInputOrOutput8: '1',
    cellInputName8: '齿轮减速级数',
    p9: '21',
    cellParameterId9: '',
    cellParentNum9: '',
    cellInputOrOutput9: '1',
    cellInputName9: '第一级减速-电机齿数',
    p10: '54',
    cellParameterId10: '',
    cellParentNum10: 'DJ2_7_1JCDLCS',
    cellInputOrOutput10: '1',
    cellInputName10: '第一级减速-从动齿数',
    p11: '18',
    cellParameterId11: '',
    cellParentNum11: 'DJ2_7_2JZDLCS',
    cellInputOrOutput11: '1',
    cellInputName11: '第二级减速-主动轮齿数',
    p12: '40',
    cellParameterId12: '',
    cellParentNum12: 'DJ2_7_2JCDLCS',
    cellInputOrOutput12: '1',
    cellInputName12: '第二级减速-从动轮齿数',
    p13: '18',
    cellParameterId13: '',
    cellParentNum13: 'DJ2_7_3JZDLCS',
    cellInputOrOutput13: '1',
    cellInputName13: '第三级减速-主动轮齿数',
    p14: '40',
    cellParameterId14: '',
    cellParentNum14: 'DJ2_7_3JCDLCS',
    cellInputOrOutput14: '1',
    cellInputName14: '第三级减速-从动轮齿数',
    p15: '20000',
    cellParameterId15: '',
    cellParentNum15: 'DJ1_1_DJKZZS',
    cellInputOrOutput15: '1',
    cellInputName15: '电机空载转速',
    p16: '14000',
    cellParameterId16: '',
    cellParentNum16: 'DJ1_1_DJEDZS',
    cellInputOrOutput16: '1',
    cellInputName16: '电机额定转速',
    p17: '0.5',
    cellParameterId17: '',
    cellParentNum17: 'DJ1_1_DJEDZJ',
    cellInputOrOutput17: '1',
    cellInputName17: '电机额定转矩',
    p18: '1.4',
    cellParameterId18: '',
    cellParentNum18: 'DJ1_1_DJSRLJ_MAX',
    cellInputOrOutput18: '1',
    cellInputName18: '电机最大输出转矩',
    p19: '0.8',
    cellParameterId19: '',
    cellParentNum19: 'DJ2_0_CDXL',
    cellInputOrOutput19: '1',
    cellInputName19: '传动效率',
    p20: '288',
    cellParameterId20: '',
    cellParentNum20: 'DJ2_3_CSZJSB',
    cellInputOrOutput20: '1',
    cellInputName20: '总减速比',
    p21: '1439.85',
    cellParameterId21: '',
    cellParentNum21: 'DJ2_4_JSZ_05',
    cellInputOrOutput21: '1',
    cellInputName21: '舟它额定负载时电机转速',
    p22: '7.88',
    cellParameterId22: '',
    cellParentNum22: 'DJ2_7_SJCLJSB',
    cellInputOrOutput22: '1',
    cellInputName22: '实际齿轮减速比',
    p23: '110.92',
    cellParameterId23: '',
    cellParentNum23: 'DJ2_7_SJCLJSB_0W',
    cellInputOrOutput23: '1',
    cellInputName23: '实际零位总减速比',
    p24: '',
    cellParameterId24: '',
    cellParentNum24: 'DJ2_8_SCLJ_MAX',
    cellInputOrOutput24: '1',
    cellInputName24: '最大输出力矩',
    p25: '',
    cellParameterId25: '',
    cellParentNum25: 'DJ2_8_EDZS',
    cellInputOrOutput25: '1',
    cellInputName25: '负载速度',
    p26: '',
    cellParameterId26: '',
    cellParentNum26: 'DJ2_8_KZZS_MAX',
    cellInputOrOutput26: '1',
    cellInputName26: '最大空载速度',
    p27: '',
    p28: '',
    ...overrides,
  };
}

export function ensurePage7TableComponentIds(list: Page7ParameterItem[]): Page7ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === PAGE7_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: PAGE7_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export function createDefaultPage7ParameterList(pageId = ''): Page7ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '29',
        rowData: [createDefaultPage7Row()],
        colStr: PAGE7_COL_STR,
      },
      tableName: '性能校核计算',
      inputName: '性能校核计算',
      tableType: '2',
      tableNum: PAGE7_TABLE_NUM,
      componentId: PAGE7_TABLE_COMPONENT_ID,
    },
  ];
}
