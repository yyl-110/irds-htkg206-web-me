export interface Page11SchemeRow extends Record<string, string | number | undefined> {
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
}

export interface Page11ParameterItem {
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
  propertyType?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Page11SchemeRow[];
    colStr?: string[];
    rowNums?: number | string;
  };
}

export const PAGE11_INPUT_TABLE_NUM = 'DJ11_T_INPUTPARAMS';
export const PAGE11_SEL_ROW_PARAM = 'DJ11_0_SELROWINDEX';

/** 确定最终方案表 componentId（customizedProcess-page11 专用） */
export const PAGE11_INPUT_TABLE_COMPONENT_ID = 33;

export function ensurePage11TableComponentIds(list: Page11ParameterItem[]): Page11ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === PAGE11_INPUT_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: PAGE11_INPUT_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

const SCHEME_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
  'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20',
];

export function createDefaultSchemeRow(overrides?: Partial<Page11SchemeRow>): Page11SchemeRow {
  return {
    p0: '组合方案1',
    p1: '2000',
    p2: '1500',
    p3: '2500',
    p4: '100',
    p5: '5.15',
    p6: '4.635',
    p7: '5.665',
    p8: '4.635',
    p9: '5.665',
    p10: '2',
    p11: '21',
    p12: '48',
    p13: '18',
    p14: '40',
    p15: '5.08',
    p16: '98.63',
    p17: '0',
    p18: '0',
    p19: '',
    p20: '',
    cellInputOrOutput0: '1',
    cellParameterId0: '',
    cellParentNum0: 'DJ2_5_ZHFA',
    cellInputName0: '组合方案',
    cellInputOrOutput1: '1',
    cellParameterId1: '',
    cellParentNum1: 'DJ2_4_SCLJ_MAX',
    cellInputName1: '舟它最大输出力矩',
    cellInputOrOutput2: '1',
    cellParameterId2: '',
    cellParentNum2: 'DJ2_4_KZZS_MAX',
    cellInputName2: '舟它最大空载速度',
    cellInputOrOutput3: '1',
    cellParameterId3: '',
    cellParentNum3: 'DJ2_4_EDZS',
    cellInputName3: '舟它额定负载速度',
    cellInputOrOutput4: '1',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputName4: '第一级减速-电机齿数',
    cellInputOrOutput5: '1',
    cellParameterId5: '',
    cellParentNum5: 'DJ2_7_1JCDLCS',
    cellInputName5: '第一级从动轮齿数',
    cellInputOrOutput6: '1',
    cellParameterId6: '',
    cellParentNum6: 'DJ2_7_2JZDLCS',
    cellInputName6: '第二级主动轮齿数',
    cellInputOrOutput7: '1',
    cellParameterId7: '',
    cellParentNum7: 'DJ2_7_2JCDLCS',
    cellInputName7: '第二级从动轮齿数',
    cellInputOrOutput8: '1',
    cellParameterId8: '',
    cellParentNum8: 'DJ2_7_3JZDLCS',
    cellInputName8: '第三级主动轮齿数',
    cellInputOrOutput9: '1',
    cellParameterId9: '',
    cellParentNum9: 'DJ2_7_3JCDLCS',
    cellInputName9: '第三级从动轮齿数',
    cellInputOrOutput10: '1',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputName10: '总减速比',
    cellInputOrOutput11: '1',
    cellParameterId11: '',
    cellParentNum11: 'DJ2_6_CLJSJS',
    cellInputName11: '齿轮减速级数',
    cellInputOrOutput12: '1',
    cellParameterId12: '',
    cellParentNum12: 'DJ1_1_DJDH',
    cellInputName12: '电机产品代号',
    cellInputOrOutput13: '1',
    cellParameterId13: '',
    cellParentNum13: 'DJ1_1_DJKZZS',
    cellInputName13: '电机空载速度',
    cellInputOrOutput14: '1',
    cellParameterId14: '',
    cellParentNum14: 'DJ1_1_DJEDZS',
    cellInputName14: '电机额定转速',
    cellInputOrOutput15: '1',
    cellParameterId15: '',
    cellParentNum15: 'DJ1_1_DJSRLJ_MAX',
    cellInputName15: '电机最大输出转矩',
    cellInputOrOutput16: '1',
    cellParameterId16: '',
    cellParentNum16: 'DJ1_1_DJEDZJ',
    cellInputName16: '电机额定转矩',
    cellInputOrOutput17: '1',
    cellParameterId17: '',
    cellParentNum17: 'DJ2_2_JSQDH',
    cellInputName17: '减速器产品代号',
    cellInputOrOutput18: '1',
    cellParameterId18: '',
    cellParentNum18: 'DJ2_2_JSQNAME',
    cellInputName18: '减速器产品名称',
    cellInputOrOutput19: '1',
    cellParameterId19: '',
    cellParentNum19: 'DJ2_2_JSQCDB',
    cellInputName19: '传动比（自动计算）',
    cellInputOrOutput20: '1',
    cellParameterId20: '',
    cellParentNum20: 'DJ2_8_SCLJ_MAX',
    cellInputName20: '最大输出力',
    ...overrides,
  };
}

export function createDefaultPage11ParameterList(pageId = ''): Page11ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '21',
        rowNums: 1,
        rowData: [createDefaultSchemeRow()],
        colStr: SCHEME_COL_STR,
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: PAGE11_INPUT_TABLE_NUM,
      componentId: PAGE11_INPUT_TABLE_COMPONENT_ID,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '0',
      parameterId: '',
      parameterNum: PAGE11_SEL_ROW_PARAM,
      defaultValue: '-1',
      propertyType: '1',
      pageId,
      inputName: '选择的行索引',
    },
  ];
}
