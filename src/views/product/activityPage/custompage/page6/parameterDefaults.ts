export interface Page6TableRow extends Record<string, string | number | undefined> {
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

export interface Page6ParameterItem {
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
    rowData?: Page6TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE6_TABLE_NUM = 'DJ6_T_FINALTOTALJSB';

/** 齿数/实际总减速比表 componentId（customizedProcess-page6 专用） */
export const PAGE6_TABLE_COMPONENT_ID = 21;

const PAGE6_COL_STR = [
  'p0',
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
  'p9',
  'p10',
  'p11',
  'p12',
  'p13',
  'p14',
  'p15',
  'p16',
];

export function createDefaultPage6Row(overrides?: Partial<Page6TableRow>): Page6TableRow {
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
    p7: '7.81',
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
    cellInputName9: '第一级减速-电机齿轮',
    p10: '54',
    cellParameterId10: '',
    cellParentNum10: 'DJ2_7_1JCDLCS',
    cellInputOrOutput10: '1',
    cellInputName10: '第一级减速-第一级从动轮齿数',
    p11: '18',
    cellParameterId11: '',
    cellParentNum11: 'DJ2_7_2JZDLCS',
    cellInputOrOutput11: '0',
    cellInputName11: '第二级主动轮齿数',
    p12: '50',
    cellParameterId12: '',
    cellParentNum12: 'DJ2_7_2JCDLCS',
    cellInputOrOutput12: '0',
    cellInputName12: '第二级从动轮齿数',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: 'DJ2_7_3JZDLCS',
    cellInputOrOutput13: '0',
    cellInputName13: '第三级主动轮齿数',
    p14: '',
    cellParameterId14: '',
    cellParentNum14: 'DJ2_7_3JCDLCS',
    cellInputOrOutput14: '0',
    cellInputName14: '第三级从动轮齿数',
    p15: '',
    cellParameterId15: '',
    cellParentNum15: 'DJ2_7_SJCLJSB',
    cellInputOrOutput15: '0',
    cellInputName15: '实际齿轮减速比',
    p16: '',
    cellParameterId16: '',
    cellParentNum16: 'DJ2_7_SJCLJSB_0W',
    cellInputOrOutput16: '0',
    cellInputName16: '实际零位总减速比',
    ...overrides,
  };
}

export function ensurePage6TableComponentIds(list: Page6ParameterItem[]): Page6ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === PAGE6_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: PAGE6_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export function createDefaultPage6ParameterList(pageId = ''): Page6ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '17',
        rowData: [createDefaultPage6Row()],
        colStr: PAGE6_COL_STR,
      },
      tableName: '确定齿数和最终实际总减速比',
      inputName: '',
      tableType: '2',
      tableNum: PAGE6_TABLE_NUM,
      componentId: PAGE6_TABLE_COMPONENT_ID,
    },
  ];
}
