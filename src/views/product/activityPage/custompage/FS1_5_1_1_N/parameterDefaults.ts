export interface FrameCheckRow extends Record<string, string | number | undefined> {
  id?: string | number;
}

export interface Fs151_1_1NParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: FrameCheckRow[];
    colStr?: string[];
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SOURCE_TABLE_NUM = 'FS1-5-1-1M';
export const TABLE_INDEX = 0;
export const TABLE_COL_STR = Array.from({ length: 12 }, (_, i) => `p${i}`);

function cell(index: number, parentNum: string, io: string, name: string): Record<string, string> {
  return {
    [`cellParameterId${index}`]: '',
    [`cellParentNum${index}`]: parentNum,
    [`cellInputOrOutput${index}`]: io,
    [`cellInputName${index}`]: name,
  };
}

export function createFrameCheckRowFromSource(item: Record<string, string | number | undefined>): FrameCheckRow {
  return {
    p0: item.p0 ?? '',
    p1: item.p1 ?? '',
    p2: item.p12 ?? '',
    p3: item.p13 ?? '',
    p4: item.p14 ?? '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: '',
    ...cell(0, '', '0', '序号'),
    ...cell(1, 'FS1_5_1_1M_JQKMC', '1', '加强框名称'),
    ...cell(2, 'FS1_5_1_1M_FXLN', '1', '法向力N(N)'),
    ...cell(3, 'FS1_5_1_1M_JLQ', '1', '剪力Q(N)'),
    ...cell(4, 'FS1_5_1_1M_WJM', '1', '弯矩M(N.M)'),
    ...cell(5, 'FS1_5_1_1N_KYQD', '0', '加强框所用材料层合板轴向抗拉压强度o_u'),
    ...cell(6, 'FS1_5_1_1N_KYQD', '0', '加强框所用材料单向板剪切强度t_ck'),
    ...cell(7, 'FS1_5_1_1N_JQDB', '0', '加强框宽度b'),
    ...cell(8, 'FS1_5_1_1N_JQDH', '0', '加强框高度h'),
    ...cell(9, 'FS1_5_1_1N_ANXS', '0', '安全系数'),
    ...cell(10, 'FS1_5_1_1N_LSQDXS', '0', '剩余拉伸强度系数nu'),
    ...cell(11, 'FS1_5_1_1N_JQQDXS', '0', '剩余剪切强度系数nt'),
  };
}

export function createDefaultFrameCheckRow(): FrameCheckRow {
  return createFrameCheckRowFromSource({ p0: 1, p1: '1', p12: '2', p13: '3', p14: '4' });
}

export function createDefaultFs151_1_1NParameterList(pageId = ''): Fs151_1_1NParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '12',
        rowData: [createDefaultFrameCheckRow()],
        colStr: TABLE_COL_STR,
      },
      tableName: '复合材料加强框校核（矩形截面）',
      inputName: '',
      tableType: '2',
      tableNum: 'FS1-5-1-1N',
    },
  ];
}

export function getFrameCheckRows(list: Fs151_1_1NParameterItem[]): FrameCheckRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as FrameCheckRow[];
}

export function setFrameCheckRows(list: Fs151_1_1NParameterItem[], rows: FrameCheckRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}
