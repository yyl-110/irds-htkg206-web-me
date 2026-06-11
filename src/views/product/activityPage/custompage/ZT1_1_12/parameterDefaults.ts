export interface Zt1TableRow extends Record<string, string | number | undefined> {
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
  delIndex?: number;
  id?: string | number;
}

export interface Zt1ParameterItem {
  inputOrOutput?: string;
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  defaultValue?: string;
  inputName?: string;
  /** 保存到 tables 接口时使用的组件 id */
  componentId?: string | number;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Zt1TableRow[];
    colStr?: string[];
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];

export const ZT1_1_12_STATS_TABLE_NUM = 'ZT1_1_12_T_YQJTJ';

export const ZT1_1_12_STATS_TABLE_INDEX = 1;

/** 系统元器件统计表 componentId（customizedProcess1-ZT1_1_12 专用） */
export const ZT1_1_12_STATS_TABLE_COMPONENT_ID = 38;

export function ensureZt1TableComponentIds(list: Zt1ParameterItem[]): Zt1ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (item.ifSingleLine === 't' && tableNum === ZT1_1_12_STATS_TABLE_NUM) {
      const rawId = String(item.componentId ?? '').trim();
      if (!rawId) {
        return { ...item, componentId: ZT1_1_12_STATS_TABLE_COMPONENT_ID };
      }
    }
    return item;
  });
}

export function createDefaultTableRow(delIndex = 1): Zt1TableRow {
  return {
    p0: '',
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    delIndex,
  };
}

export function createDefaultZt1ParameterList(pageId = ''): Zt1ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      inputType: '4',
      ifSingleLine: '0',
      pageId,
      parameterNum: 'ZT1_1_12_YQJXY',
      defaultValue: '',
      inputName: '元器件选择原则',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '11',
        rowNums: '1',
        rowData: [createDefaultTableRow(1)],
        colStr: TABLE_COL_STR,
      },
      tableName: '系统元器件统计表',
      inputName: '系统元器件统计表',
      tableType: '1',
      tableNum: ZT1_1_12_STATS_TABLE_NUM,
      componentId: ZT1_1_12_STATS_TABLE_COMPONENT_ID,
      colData: [
        { colName: '系统名称', isShowCol: '1' },
        { colName: '种类', isShowCol: '1' },
        { colName: '数量', isShowCol: '1' },
        { colName: '种类', isShowCol: '1' },
        { colName: '比例', isShowCol: '1' },
        { colName: '数量', isShowCol: '1' },
        { colName: '比例', isShowCol: '1' },
        { colName: '种类', isShowCol: '1' },
        { colName: '比例', isShowCol: '1' },
        { colName: '数量', isShowCol: '1' },
        { colName: '比例', isShowCol: '1' },
      ],
    },
    {
      inputOrOutput: '0',
      inputType: '4',
      ifSingleLine: '0',
      pageId,
      parameterNum: 'ZT1_1_12_YQJQK',
      defaultValue: '',
      inputName: '元器件国产化达标情况及自主可控方案',
    },
  ];
}

export function getStatsTableRows(list: Zt1ParameterItem[]): Zt1TableRow[] {
  return (list[1]?.tableMap?.rowData ?? []) as Zt1TableRow[];
}

export function setStatsTableRows(list: Zt1ParameterItem[], rows: Zt1TableRow[]) {
  if (!list[1]?.tableMap) return;
  list[1].tableMap.rowData = rows;
  list[1].tableMap.rowNums = rows.length;
  list[1].tableMap.colStr = TABLE_COL_STR;
}
