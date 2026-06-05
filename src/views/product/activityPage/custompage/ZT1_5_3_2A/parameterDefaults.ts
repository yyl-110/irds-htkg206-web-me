export interface LoadAnalysisRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string | number;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
  delIndex?: number;
  id?: string | number;
}

export interface GradeRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
}

export interface TableHeaderItem {
  colName?: string;
}

export interface ConditionColumnDef {
  title: string;
  field: string;
}

export interface Zt1_532AParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  defaultValue?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  tableheader?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Array<LoadAnalysisRow | GradeRow>;
    colStr?: string[];
    colData?: TableHeaderItem[];
  };
  colData?: TableHeaderItem[];
}

export const DEFAULT_CONDITION_TITLES = ['运输', '待机', '展开', '测试', '发射', '撤收'];

export const POWER_TYPE_OPTIONS = [
  { label: '工频交流', value: 1 },
  { label: '高压直流', value: 2 },
  { label: '低压直流', value: 3 },
];

const FIXED_HEADER = ['序号', '用电设备', '用电类型'];
const REMARK_TITLE = '备注';

export function createDefaultLoadRow(index: number, conditionCount: number): LoadAnalysisRow {
  const row: LoadAnalysisRow = {
    p0: String(index),
    p1: '',
    p2: 1,
    delIndex: index,
  };
  for (let i = 0; i < conditionCount; i++) {
    row[`p${i + 3}`] = '';
  }
  row[`p${conditionCount + 3}`] = '';
  return row;
}

export function createDefaultConditionColumns(): ConditionColumnDef[] {
  return DEFAULT_CONDITION_TITLES.map((title, index) => ({
    title,
    field: `p${index + 3}`,
  }));
}

export function getRemarkField(conditionCount: number): string {
  return `p${conditionCount + 3}`;
}

export function createDefaultGradeRows(): GradeRow[] {
  return [
    { p0: '1', p1: '0级用电设备', p2: '' },
    { p0: '2', p1: '1级用电设备', p2: '' },
  ];
}

export function createDefaultZt1_532AParameterList(pageId = ''): Zt1_532AParameterItem[] {
  const conditionColumns = createDefaultConditionColumns();
  const conditionCount = conditionColumns.length;
  const colStr = ['p0', 'p1', 'p2', ...conditionColumns.map(col => col.field), getRemarkField(conditionCount)];

  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: String(conditionCount + 4),
        rowNums: '1',
        rowData: [createDefaultLoadRow(1, conditionCount)],
        colStr,
        colData: [
          ...FIXED_HEADER.map(colName => ({ colName, isShowCol: '1' })),
          ...conditionColumns.map(col => ({ colName: col.title, isShowCol: '1' })),
          { colName: REMARK_TITLE, isShowCol: '1' },
        ],
      },
      tableName: '用电设备分析表',
      inputName: '用电设备分析表',
      tableType: '1',
      tableNum: 'ZT1_5_3_2A_T_YDSBFX',
      tableheader: JSON.stringify([
        ...FIXED_HEADER.map(colName => ({ colName })),
        ...conditionColumns.map(col => ({ colName: col.title })),
        { colName: REMARK_TITLE },
      ]),
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '3',
        rowNums: '2',
        rowData: createDefaultGradeRows(),
        colStr: ['p0', 'p1', 'p2'],
      },
      tableName: '用电设备等级表',
      inputName: '用电设备等级表',
      tableType: '1',
      tableNum: 'ZT1_5_3_2A_T_YDSBDJ',
      colData: [
        { colName: '序号', isShowCol: '1' },
        { colName: '分系统', isShowCol: '1' },
        { colName: '电缆', isShowCol: '1' },
      ],
    },
  ];
}

export function getLoadRows(list: Zt1_532AParameterItem[]): LoadAnalysisRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as LoadAnalysisRow[];
}

export function setLoadRows(list: Zt1_532AParameterItem[], rows: LoadAnalysisRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function getGradeRows(list: Zt1_532AParameterItem[]): GradeRow[] {
  return (list[1]?.tableMap?.rowData ?? []) as GradeRow[];
}

export function setGradeRows(list: Zt1_532AParameterItem[], rows: GradeRow[]) {
  if (!list[1]?.tableMap) return;
  list[1].tableMap.rowData = rows;
  list[1].tableMap.rowNums = rows.length;
}

export function parseConditionColumnsFromHeader(tableheader?: string): ConditionColumnDef[] | null {
  if (!tableheader) return null;
  try {
    const header = JSON.parse(tableheader) as TableHeaderItem[];
    if (!Array.isArray(header) || header.length <= 4) return null;
    const conditionTitles = header.slice(3, header.length - 1).map(item => String(item.colName ?? '').trim());
    if (conditionTitles.length <= 0) return null;
    return conditionTitles.map((title, index) => ({ title, field: `p${index + 3}` }));
  } catch {
    return null;
  }
}

export function syncTableHeaderMetadata(list: Zt1_532AParameterItem[], conditionColumns: ConditionColumnDef[]) {
  const tableItem = list[0];
  if (!tableItem?.tableMap) return;

  const remarkField = getRemarkField(conditionColumns.length);
  const colStr = ['p0', 'p1', 'p2', ...conditionColumns.map(col => col.field), remarkField];
  const colData = [
    ...FIXED_HEADER.map(colName => ({ colName, isShowCol: '1' })),
    ...conditionColumns.map(col => ({ colName: col.title, isShowCol: '1' })),
    { colName: REMARK_TITLE, isShowCol: '1' },
  ];
  const tableheader = JSON.stringify([
    ...FIXED_HEADER.map(colName => ({ colName })),
    ...conditionColumns.map(col => ({ colName: col.title })),
    { colName: REMARK_TITLE },
  ]);

  tableItem.tableheader = tableheader;
  tableItem.tableMap.colStr = colStr;
  tableItem.tableMap.colData = colData;
  tableItem.tableMap.colNums = String(conditionColumns.length + 4);
  tableItem.colData = colData;
}
