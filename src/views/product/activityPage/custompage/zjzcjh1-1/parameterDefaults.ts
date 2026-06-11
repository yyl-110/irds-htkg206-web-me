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
  /** 保存到 tables 接口时使用的组件 id */
  componentId?: string | number;
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

export const ZJZCJH1_1_TABLE_NUM = 'ZJZCJH1_1_T_FRAMECHECK';

export const ZJZCJH1_1_TABLE_INDEX = 0;

/** 车架总成校核表 componentId（customizedProcess-zjzcjh1-1 专用） */
export const ZJZCJH1_1_TABLE_COMPONENT_ID = 36;

export function ensureZjzcjhTableComponentIds(list: ZjzcjhParameterItem[]): ZjzcjhParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === ZJZCJH1_1_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: ZJZCJH1_1_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

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
      tableName: '车架总成校核表',
      inputName: '车架总成校核表',
      tableType: '2',
      tableNum: ZJZCJH1_1_TABLE_NUM,
      componentId: ZJZCJH1_1_TABLE_COMPONENT_ID,
    },
  ];
}

export function getCheckTableRows(list: ZjzcjhParameterItem[]): ZjzcjhCheckRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as ZjzcjhCheckRow[];
}
