export interface Page8TableRow extends Record<string, string | number | undefined> {
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

export interface Page8ParameterItem {
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
  userid?: string;
  addthis?: string;
  treeKey?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Page8TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE8_TABLE_NUM = 'DJ8_T_INITCOMBINSCHEME';
export const PAGE8_SEL_INDEX_PARAM = 'DJ2_9_SELINDEXS';

/** 初步筛选组合方案表 componentId（customizedProcess-page8 专用） */
export const PAGE8_TABLE_COMPONENT_ID = 23;

const PAGE8_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20'];

export function createDefaultPage8Row(overrides?: Partial<Page8TableRow>): Page8TableRow {
  return {
    p0: '组合方案1',
    p1: '',
    p2: '',
    p3: '',
    p4: '21',
    p5: '54',
    p6: '18',
    p7: '40',
    p8: '18',
    p9: '40',
    p10: '98.63',
    p11: '2',
    p12: 'tab1002',
    p13: '20000',
    p14: '14000',
    p15: '1.4',
    p16: '0.5',
    p17: 'a1086',
    p18: '',
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

export function ensurePage8TableComponentIds(list: Page8ParameterItem[]): Page8ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === PAGE8_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: PAGE8_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export function createDefaultPage8ParameterList(pageId = ''): Page8ParameterItem[] {
  return [
    {
      inputName: '初步筛选若干组合方案',
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '21',
        rowNums: 1,
        rowData: [createDefaultPage8Row()],
        colStr: PAGE8_COL_STR,
      },
      tableName: '初步筛选若干组合方案',
      tableType: '1',
      tableNum: PAGE8_TABLE_NUM,
      componentId: PAGE8_TABLE_COMPONENT_ID,
    },
  ];
}

export function createSelectionParamItem(pageId = '', userid = ''): Page8ParameterItem {
  return {
    inputOrOutput: '1',
    ifSingleLine: '1',
    inputType: '0',
    defaultValue: '',
    parameterNum: PAGE8_SEL_INDEX_PARAM,
    pageId,
    inputName: '选择的方案索引',
    addthis: '1',
    treeKey: '2',
    userid,
  };
}
