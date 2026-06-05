export interface ZjzcjhCheckRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
}

export interface ZjzcjhParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: ZjzcjhCheckRow[];
    colStr?: string[];
    rowNums?: number | string;
  };
}

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4'];

function createCheckRow(
  index: string,
  content: string,
  overrides?: Partial<ZjzcjhCheckRow>,
): ZjzcjhCheckRow {
  return {
    p0: index,
    p1: content,
    p2: '',
    p3: '',
    p4: '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '类型',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: 'h',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '0',
    cellInputName2: '',
    cellParameterId3: '',
    cellParentNum3: '',
    cellInputOrOutput3: '0',
    cellInputName3: '',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputOrOutput4: '1',
    cellInputName4: '深',
    ...overrides,
  };
}

export function createDefaultCheckRows(): ZjzcjhCheckRow[] {
  return [
    createCheckRow('1', '驾驶室悬置与车架匹配性检查'),
    createCheckRow('2', '发动机悬置匹性检查'),
    createCheckRow('3', '内侧委部件与外侧委部件装配校核'),
    createCheckRow('4', '车架铆接工艺性检查'),
    createCheckRow('5', '车架螺接工艺性检查'),
  ];
}

export function createDefaultZjzcjhParameterList(pageId = ''): ZjzcjhParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '5',
        rowData: createDefaultCheckRows(),
        colStr: TABLE_COL_STR,
      },
      tableName: '',
      inputName: '',
      tableType: '2',
      tableNum: '',
    },
  ];
}

export function getCheckTableRows(list: ZjzcjhParameterItem[]): ZjzcjhCheckRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as ZjzcjhCheckRow[];
}
