export interface Tbdemo1TerminalRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string | number;
  p2?: string | number;
  p3?: string;
}

export interface Tbdemo1ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  /** 保存到 tables 接口时使用的组件 id */
  componentId?: string | number;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  colData?: Array<{ colName?: string; isShowCol?: string }>;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Tbdemo1TerminalRow[];
    colStr?: string[];
    rowNums?: number | string;
  };
}

export const TB_DEMO1_PARAM = {
  TYWZ: 'TB_DEMO1_TYWZ',
  TYFS: 'TB_DEMO1_TYFS',
  MAX_LEVEL: 'TB_DEMO1_MAXLEVEL',
  MIN_LEVEL: 'TB_DEMO1_MINLEVEL',
  TY_PERCENT: 'TB_DEMO1_TYPERCENT',
  SJZDS: 'TB_DEMO1_SJZDS',
  TABLE: 'TB_DEMO1_T_DUANZIDEF',
} as const;

export const TB_DEMO1_TABLE_INDEX = 6;

/** 端子定义表 componentId（customizedProcess-tbdemo1-page1 专用） */
export const TB_DEMO1_TABLE_COMPONENT_ID = 34;

export function ensureTbdemo1TableComponentIds(list: Tbdemo1ParameterItem[]): Tbdemo1ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === TB_DEMO1_PARAM.TABLE) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: TB_DEMO1_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export const TY_WZ_OPTIONS = [
  { value: '高压尾端', label: '高压尾端' },
  { value: '高压首端', label: '高压首端' },
  { value: '中压尾端', label: '中压尾端' },
  { value: '中压首端', label: '中压首端' },
  { value: '低压尾端', label: '低压尾端' },
  { value: '低压首端', label: '低压首端' },
];

export const TY_FS_OPTIONS = [
  { value: 'PM', label: 'PM' },
  { value: 'L', label: 'L' },
  { value: 'NO', label: 'NO' },
];

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3'];

export function createDefaultTerminalRows(): Tbdemo1TerminalRow[] {
  return [
    { p0: '高压', p1: 50000, p2: 110, p3: 'YN' },
    { p0: '中压', p1: 50000, p2: 38.5, p3: 'YN' },
    { p0: '低压', p1: 50000, p2: 10.5, p3: 'D' },
  ];
}

export function createDefaultTbdemo1ParameterList(pageId = ''): Tbdemo1ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.TYWZ,
      parameterId: '',
      defaultValue: '高压尾端',
      pageId,
      inputName: '调压位置',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.TYFS,
      parameterId: '',
      defaultValue: 'PM',
      pageId,
      inputName: '调压方式',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.MAX_LEVEL,
      parameterId: '',
      defaultValue: '8',
      pageId,
      inputName: '最正调压级数',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.MIN_LEVEL,
      parameterId: '',
      defaultValue: '-8',
      pageId,
      inputName: '最负调压级数',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.TY_PERCENT,
      parameterId: '',
      defaultValue: '1.25',
      pageId,
      inputName: '每级调压百分比',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: TB_DEMO1_PARAM.SJZDS,
      parameterId: '',
      defaultValue: '131.25',
      pageId,
      inputName: '实际匝电势et',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '4',
        rowNums: 3,
        rowData: createDefaultTerminalRows(),
        colStr: TABLE_COL_STR,
      },
      tableName: '端子定义表',
      inputName: '端子定义表',
      tableType: '1',
      tableNum: TB_DEMO1_PARAM.TABLE,
      componentId: TB_DEMO1_TABLE_COMPONENT_ID,
      colData: [
        { colName: '端子名称', isShowCol: '1' },
        { colName: '端子容量kVA', isShowCol: '1' },
        { colName: '端子额定电压', isShowCol: '1' },
        { colName: '端子连接组别', isShowCol: '1' },
      ],
    },
  ];
}

export function getTerminalTableRows(list: Tbdemo1ParameterItem[]): Tbdemo1TerminalRow[] {
  return (list[TB_DEMO1_TABLE_INDEX]?.tableMap?.rowData ?? []) as Tbdemo1TerminalRow[];
}
