export interface Page5TableRow extends Record<string, string | number | undefined> {
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
}

export interface Page5ParameterItem {
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
    rowData?: Page5TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE5_TABLE_NUM = 'DJ5_T_GEARJSBDISPATCH';

/** 齿轮减速比分配表 componentId（customizedProcess-page5 专用） */
export const PAGE5_TABLE_COMPONENT_ID = 20;

const PAGE5_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14'];

export function createDefaultPage5Row(overrides?: Partial<Page5TableRow>): Page5TableRow {
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
    p4: 'tab1002',
    cellParameterId4: '',
    cellParentNum4: 'DJ1_1_DJDH',
    cellInputOrOutput4: '1',
    cellInputName4: '电机产品代号',
    p5: '1750',
    cellParameterId5: '',
    cellParentNum5: 'DJ1_1_DJKZZS',
    cellInputOrOutput5: '1',
    cellInputName5: '电机空载转速',
    p6: '2680',
    cellParameterId6: '',
    cellParentNum6: 'DJ1_1_DJEDZS',
    cellInputOrOutput6: '1',
    cellInputName6: '电机额定转速',
    p7: 'a1086',
    cellParameterId7: '',
    cellParentNum7: 'DJ2_2_JSQDH',
    cellInputOrOutput7: '1',
    cellInputName7: '减速器产品代号',
    p8: '旋转',
    cellParameterId8: '',
    cellParentNum8: 'DJ1_5_MDJSQXS',
    cellInputOrOutput8: '1',
    cellInputName8: '减速器输出形式',
    p9: '1500',
    cellParameterId9: '',
    cellParentNum9: 'DJ2_2_JSQCDB',
    cellInputOrOutput9: '1',
    cellInputName9: '减速器传动比（自动计算）',
    p10: '2750',
    cellParameterId10: '',
    cellParentNum10: 'DJ2_2_JSQSCL_MAX',
    cellInputOrOutput10: '1',
    cellInputName10: '减速器最大输出力',
    p11: '0',
    cellParameterId11: '',
    cellParentNum11: 'DJ2_3_CSZJSB',
    cellInputOrOutput11: '1',
    cellInputName11: '总减速比',
    p12: '0',
    cellParameterId12: '',
    cellParentNum12: 'DJ2_6_MDJSB',
    cellInputOrOutput12: '1',
    cellInputName12: '末端减速比',
    p13: '0',
    cellParameterId13: '',
    cellParentNum13: 'DJ2_6_CLJSB',
    cellInputOrOutput13: '1',
    cellInputName13: '齿轮减速比',
    p14: '0',
    cellParameterId14: '',
    cellParentNum14: 'DJ2_6_CLJSJS',
    cellInputOrOutput14: '1',
    cellInputName14: '齿轮减速级数',
    ...overrides,
  };
}

export function ensurePage5TableComponentIds(list: Page5ParameterItem[]): Page5ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === PAGE5_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: PAGE5_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export function createDefaultPage5ParameterList(pageId = ''): Page5ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '15',
        rowData: [createDefaultPage5Row()],
        colStr: PAGE5_COL_STR,
      },
      tableName: '齿轮减速比分配',
      inputName: '',
      tableType: '2',
      tableNum: PAGE5_TABLE_NUM,
      componentId: PAGE5_TABLE_COMPONENT_ID,
    },
  ];
}
