export interface SummaryRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
}

export interface PointRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string | number;
  delIndex?: number;
  id?: string | number;
}

export interface Zt1_532CParameterItem {
  id?: string | number;
  inputOrOutput?: string;
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
  addthis?: number;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Array<SummaryRow | PointRow>;
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export const ITEMS_PER_INTERFACE_GROUP = 4;

export function getInterfaceGroupCount(list: Zt1_532CParameterItem[]) {
  if (!list.length) return 0;
  return Math.max(0, Math.floor((list.length - 1) / ITEMS_PER_INTERFACE_GROUP));
}

export function getGroupBaseIndex(groupIndex: number) {
  return groupIndex * ITEMS_PER_INTERFACE_GROUP + 1;
}

export function createDefaultPointRow(tableIndex: number, rowIndex: number): PointRow {
  return {
    p0: String(rowIndex),
    p1: '',
    p2: '',
    p3: '',
    p4: tableIndex,
    delIndex: rowIndex,
  };
}

export function createInterfaceGroupItems(pageId: string, groupIndex: number): Zt1_532CParameterItem[] {
  const tableIndex = getGroupBaseIndex(groupIndex) + 1;
  return [
    {
      inputOrOutput: '0',
      inputType: '1',
      ifSingleLine: '0',
      pageId,
      parameterNum: `ZT1_5_3_JKMC${groupIndex}`,
      defaultValue: '',
      inputName: '供电接口表名称',
      addthis: 1,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '5',
        rowNums: '1',
        rowData: [createDefaultPointRow(tableIndex, 1)],
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4'],
      },
      tableName: '点号定义表',
      inputName: '点号定义表',
      tableType: '1',
      tableNum: `ZT1_5_3_DHDY${groupIndex}`,
      colData: [
        { colName: '序号', isShowCol: '1' },
        { colName: '点号', isShowCol: '1' },
        { colName: '点号定义', isShowCol: '1' },
        { colName: '备注', isShowCol: '1' },
        { colName: '备用', isShowCol: '0' },
      ],
      addthis: 1,
    },
    {
      inputOrOutput: '0',
      inputType: '4',
      ifSingleLine: '0',
      pageId,
      parameterNum: `ZT1_5_3_CZ${groupIndex}`,
      defaultValue: '',
      inputName: '插座',
      addthis: 1,
    },
    {
      inputOrOutput: '0',
      inputType: '4',
      ifSingleLine: '0',
      pageId,
      parameterNum: `ZT1_5_3_CT${groupIndex}`,
      defaultValue: '',
      inputName: '插头',
      addthis: 1,
    },
  ];
}

export function createDefaultZt1_532CParameterList(pageId = ''): Zt1_532CParameterItem[] {
  const summaryRows: SummaryRow[] = [{ p0: '1', p1: '', p2: '', p3: '' }];
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '4',
        rowNums: '1',
        rowData: summaryRows,
        colStr: ['p0', 'p1', 'p2', 'p3'],
      },
      tableName: '供电接口汇总表',
      inputName: '供电接口汇总表',
      tableType: '1',
      tableNum: 'ZT1_5_3_2C_T_GDJK',
      colData: [
        { colName: '序号', isShowCol: '1' },
        { colName: '供电接口名称', isShowCol: '1' },
        { colName: '接口', isShowCol: '1' },
        { colName: '备注', isShowCol: '1' },
      ],
    },
    ...createInterfaceGroupItems(pageId, 0),
  ];
}

export function getSummaryRows(list: Zt1_532CParameterItem[]): SummaryRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as SummaryRow[];
}

export function setSummaryRows(list: Zt1_532CParameterItem[], rows: SummaryRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function getPointRows(list: Zt1_532CParameterItem[], tableIndex: number): PointRow[] {
  const item = list[tableIndex];
  return (item?.tableMap?.rowData ?? []) as PointRow[];
}

export function setPointRows(list: Zt1_532CParameterItem[], tableIndex: number, rows: PointRow[]) {
  const item = list[tableIndex];
  if (!item?.tableMap) return;
  item.tableMap.rowData = rows;
  item.tableMap.rowNums = rows.length;
}
