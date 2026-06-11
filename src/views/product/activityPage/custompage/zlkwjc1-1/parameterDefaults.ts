export interface ZlkwjcCheckRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
}

export interface ZlkwjcParameterItem {
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
    rowData?: ZlkwjcCheckRow[];
    colStr?: string[];
    rowNums?: number | string;
  };
}

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4'];

export const ZLKWJC1_1_TABLE_NUM = 'ZLKWJC1_1_T_HOLECHECK';

export const ZLKWJC1_1_TABLE_INDEX = 0;

/** 纵梁孔位检查表 componentId（customizedProcess-zlkwjc1-1 专用） */
export const ZLKWJC1_1_TABLE_COMPONENT_ID = 37;

export function ensureZlkwjcTableComponentIds(list: ZlkwjcParameterItem[]): ZlkwjcParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === ZLKWJC1_1_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: ZLKWJC1_1_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

function createCheckRow(index: string, content: string, overrides?: Partial<ZlkwjcCheckRow>): ZlkwjcCheckRow {
  return {
    p0: index,
    p1: content,
    p2: '',
    p3: '',
    p4: '-',
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
    cellInputOrOutput4: '0',
    cellInputName4: '',
    ...overrides,
  };
}

export function createDefaultCheckRows(): ZlkwjcCheckRow[] {
  return [
    createCheckRow('1', '不同直径孔重叠检查'),
    createCheckRow('2', '孔干涉检查'),
    createCheckRow('3', '两孔最小距离检查'),
    createCheckRow('4', '腹面孔到边最小距离检查'),
    createCheckRow('5', '翼面孔到边最小距离检查'),
  ];
}

export function createDefaultZlkwjcParameterList(pageId = ''): ZlkwjcParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowData: createDefaultCheckRows(),
        colStr: TABLE_COL_STR,
      },
      tableName: '纵梁孔位检查表',
      inputName: '纵梁孔位检查表',
      tableType: '2',
      tableNum: ZLKWJC1_1_TABLE_NUM,
      componentId: ZLKWJC1_1_TABLE_COMPONENT_ID,
    },
  ];
}

export function getCheckTableRows(list: ZlkwjcParameterItem[]): ZlkwjcCheckRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as ZlkwjcCheckRow[];
}

export function setCheckTableRows(list: ZlkwjcParameterItem[], rows: ZlkwjcCheckRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = TABLE_COL_STR;
}
