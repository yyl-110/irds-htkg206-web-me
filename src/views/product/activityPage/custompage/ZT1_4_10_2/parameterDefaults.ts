export interface Zt1SegmentRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
}

export interface Zt1SegmentCountRow extends Record<string, string | number | undefined> {
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
}

export interface Zt1_4102ParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  defaultValue?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: Array<Zt1SegmentRow | Zt1SegmentCountRow>;
    colStr?: string[];
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export interface SbcModelSummaryRow {
  p1?: string;
  p10?: string;
  p11?: string;
}

export const SEGMENT_COUNT_OPTIONS = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
export const INSULATION_OPTIONS = [
  { label: '有', value: '有' },
  { label: '无', value: '无' },
];

const SEGMENT_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
const COUNT_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p8', 'p9', 'p10'];

export function createDefaultSegmentRow(): Zt1SegmentRow {
  return { p0: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' };
}

export function createDefaultSegmentRows(count = 2): Zt1SegmentRow[] {
  return Array.from({ length: count }, () => createDefaultSegmentRow());
}

export function createDefaultSegmentCountRow(): Zt1SegmentCountRow {
  return {
    p0: '2',
    p1: '2',
    p2: '2',
    p3: '2',
    p4: '2',
    p5: '2',
    p6: '2',
    p7: '2',
    p8: '2',
    p9: '2',
    p10: '2',
  };
}

export function createDefaultZt1_4102ParameterList(pageId = ''): Zt1_4102ParameterItem[] {
  const list: Zt1_4102ParameterItem[] = [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '10',
        rowData: [createDefaultSegmentCountRow()],
        colStr: COUNT_COL_STR,
      },
      tableName: '各设备舱分段数',
      inputName: '各设备舱分段数',
      tableType: '1',
      tableNum: 'ZT1_4_10_2_T_FDS',
      colData: Array.from({ length: 10 }, (_, index) => ({
        colName: `设备舱${index + 1}分段数`,
        isShowCol: '1',
      })),
    },
  ];

  for (let i = 1; i <= 10; i++) {
    list.push({
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '3',
        rowNums: '2',
        rowData: createDefaultSegmentRows(2),
        colStr: SEGMENT_COL_STR,
      },
      tableName: `${i}设备舱分段数据`,
      inputName: `${i}设备舱分段数据`,
      tableType: '1',
      tableNum: `ZT1_4_10_2_T_${i}FDDATA`,
      colData: [
        { colName: '舱段名称', isShowCol: '1' },
        { colName: '电缆线槽布置', isShowCol: '1' },
        { colName: '舱段长度', isShowCol: '1' },
        { colName: '照明设备位置', isShowCol: '1' },
        { colName: '保温层', isShowCol: '1' },
        { colName: '开窗布置', isShowCol: '1' },
        { colName: '电缆穿舱孔布置', isShowCol: '1' },
        { colName: '散热空间布置', isShowCol: '1' },
      ],
    });
  }

  return list;
}

export function getSegmentCountRow(list: Zt1_4102ParameterItem[]): Zt1SegmentCountRow {
  return (list[0]?.tableMap?.rowData?.[0] ?? {}) as Zt1SegmentCountRow;
}

export function getSegmentRows(list: Zt1_4102ParameterItem[], cabinNo: number): Zt1SegmentRow[] {
  return (list[cabinNo]?.tableMap?.rowData ?? []) as Zt1SegmentRow[];
}

export function setSegmentRows(list: Zt1_4102ParameterItem[], cabinNo: number, rows: Zt1SegmentRow[]) {
  if (!list[cabinNo]?.tableMap) return;
  list[cabinNo].tableMap.rowData = rows;
  list[cabinNo].tableMap.rowNums = rows.length;
  list[cabinNo].tableMap.colStr = SEGMENT_COL_STR;
}

export function getCabinetSegmentCount(list: Zt1_4102ParameterItem[], cabinIndex: number): number {
  const countRow = getSegmentCountRow(list);
  return Number(countRow[`p${cabinIndex}`] ?? 2);
}

export function resolveCabinetLength(modelRow?: SbcModelSummaryRow): string {
  return String(modelRow?.p11 ?? modelRow?.p10 ?? '');
}
