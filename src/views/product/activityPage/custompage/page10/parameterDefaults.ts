import type { Page9SchemeRow } from '../page9/parameterDefaults';

export type Page10SchemeRow = Page9SchemeRow;

export interface Page10DegreeRow extends Record<string, string | number | undefined> {
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

export interface Page10ParameterItem {
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
  id?: string | number;
  userid?: string;
  userId?: string;
  addthis?: string;
  treeKey?: string | number;
  propertyType?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Page10SchemeRow[] | Page10DegreeRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE10_INPUT_TABLE_NUM = 'DJ10_T_INPUTPARAMS';
export const PAGE10_DEGREE_TABLE_NUM = 'DJ10_T_DEGREERESET';
export const PAGE10_ALL_DEGREE_PREFIX = 'DJ10_T_ALLDEGREEXNCHECKCAL';
export const PAGE10_EFFICIENCY_PARAM = 'DJ2_0_CDXL';
export const PAGE10_SEL_ROW_PARAM = 'DJ2_0_SELROWINDEX';

const SCHEME_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
  'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20',
];

const DEGREE_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16',
];

export function createDefaultSchemeRow(overrides?: Partial<Page10SchemeRow>): Page10SchemeRow {
  return {
    p0: '组合方案1',
    p1: '2000',
    p2: '2500',
    p3: '1500',
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
    ...overrides,
  };
}

export function createDefaultDegreeRow(overrides?: Partial<Page10DegreeRow>): Page10DegreeRow {
  return {
    p0: '',
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '0.73',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: '',
    p12: '',
    p13: '',
    p14: '',
    p15: '',
    p16: '',
    cellInputOrOutput0: '1',
    cellInputName0: '角度位置',
    cellInputOrOutput1: '1',
    cellInputName1: '修正后总减速比',
    cellInputOrOutput2: '1',
    cellInputName2: '电机空载速度',
    cellInputOrOutput3: '1',
    cellInputName3: '电机额定转速',
    cellInputOrOutput4: '1',
    cellInputName4: '电机额定转矩',
    cellInputOrOutput5: '1',
    cellInputName5: '电机最大输出转矩',
    cellInputOrOutput6: '1',
    cellInputName6: '传动效率',
    cellInputOrOutput7: '1',
    cellInputName7: '舟它额定负载',
    cellInputOrOutput8: '1',
    cellInputName8: '标准单位空载转速',
    cellInputOrOutput9: '1',
    cellInputName9: '标准单位额定转速',
    cellInputOrOutput10: '1',
    cellInputName10: '负载刚度',
    cellInputOrOutput11: '1',
    cellInputName11: '舟它额定负载时电机转矩',
    cellInputOrOutput12: '1',
    cellInputName12: '舟它额定负载时电机转速',
    cellInputOrOutput13: '1',
    cellInputName13: '最大输出力矩',
    cellInputOrOutput14: '1',
    cellInputName14: '负载速度',
    cellInputOrOutput15: '1',
    cellInputName15: '最大空载速度',
    cellInputOrOutput16: '1',
    cellInputName16: '电机代号',
    ...overrides,
  };
}

export function createDefaultPage10ParameterList(pageId = ''): Page10ParameterItem[] {
  const efficiency = '0.73';
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
      tableNum: PAGE10_INPUT_TABLE_NUM,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '0',
      parameterId: '',
      parameterNum: PAGE10_EFFICIENCY_PARAM,
      defaultValue: efficiency,
      propertyType: '1',
      pageId,
      inputName: '传动效率',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '16',
        rowNums: 1,
        rowData: [createDefaultDegreeRow({ p6: efficiency })],
        colStr: DEGREE_COL_STR,
      },
      tableName: '角度修正',
      inputName: '角度修正',
      tableType: '1',
      tableNum: PAGE10_DEGREE_TABLE_NUM,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '0',
      parameterId: '',
      parameterNum: PAGE10_SEL_ROW_PARAM,
      defaultValue: '-1',
      propertyType: '1',
      pageId,
      inputName: '选择的行索引',
    },
  ];
}

export function allDegreeTableNum(index: number) {
  return `${PAGE10_ALL_DEGREE_PREFIX}${index}`;
}

export const PAGE10_BASE_PARAM_COUNT = 4;
