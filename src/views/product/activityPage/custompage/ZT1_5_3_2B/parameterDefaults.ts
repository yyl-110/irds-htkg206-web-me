export interface PowerBranchRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string | number;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  delIndex?: number;
  id?: string | number;
}

export interface Zt1_532BParameterItem {
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
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: PowerBranchRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export const POWER_TYPE_OPTIONS = [
  { label: '工频交流', value: 1 },
  { label: '高压直流', value: 2 },
  { label: '低压直流', value: 3 },
];

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

export function buildBranchLabel(index: number) {
  return `第${index}路`;
}

export function createDefaultPowerBranchRow(index: number): PowerBranchRow {
  return {
    p0: String(index),
    p1: 1,
    p2: buildBranchLabel(index),
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    delIndex: index,
  };
}

export function createDefaultZt1_532BParameterList(pageId = ''): Zt1_532BParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '7',
        rowNums: '1',
        rowData: [createDefaultPowerBranchRow(1)],
        colStr: TABLE_COL_STR,
      },
      tableName: '供电支路表',
      inputName: '供电支路表',
      tableType: '1',
      tableNum: 'ZT1_5_3_2B_T_GDZL',
      colData: [
        { colName: '序号', isShowCol: '1' },
        { colName: '供电类型', isShowCol: '1' },
        { colName: '供电支路', isShowCol: '1' },
        { colName: '用电设备', isShowCol: '1' },
        { colName: '功率', isShowCol: '1' },
        { colName: '供电接口', isShowCol: '1' },
        { colName: '备注', isShowCol: '1' },
      ],
    },
  ];
}

export function getPowerBranchRows(list: Zt1_532BParameterItem[]): PowerBranchRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as PowerBranchRow[];
}

export function setPowerBranchRows(list: Zt1_532BParameterItem[], rows: PowerBranchRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = TABLE_COL_STR;
}

export function renumberPowerBranchRows(rows: PowerBranchRow[]): PowerBranchRow[] {
  return rows.map((row, index) => {
    const nextIndex = index + 1;
    return {
      ...row,
      p0: String(nextIndex),
      p2: buildBranchLabel(nextIndex),
      delIndex: nextIndex,
    };
  });
}
