export interface FrameForceRow extends Record<string, string | number | undefined> {
  delIndex?: number;
  id?: string | number;
}

export interface Fs151_1_1MParameterItem {
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
    rowData?: FrameForceRow[];
    colStr?: string[];
  };
}

export const TABLE_INDEX = 0;
export const TABLE_COL_STR = Array.from({ length: 16 }, (_, i) => `p${i}`);

function cell(index: number, parentNum: string, io: string, name: string): Record<string, string> {
  return {
    [`cellParameterId${index}`]: '',
    [`cellParentNum${index}`]: parentNum,
    [`cellInputOrOutput${index}`]: io,
    [`cellInputName${index}`]: name,
  };
}

export function createDefaultFrameForceRow(index = 1): FrameForceRow {
  return {
    p0: index,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '1',
    p11: '',
    p12: '',
    p13: '',
    p14: '',
    p15: '',
    ...cell(0, '', '0', '序号'),
    ...cell(1, 'FS1_5_1_1M_JQKMC', '0', '加强框名称'),
    ...cell(2, 'FS1_5_1_1M_JQKR', '0', '加强框中性轴的曲率半径r(m)'),
    ...cell(3, 'FS1_5_1_1M_PHBJ', '0', '加强框和筒壁的配合半径R(m)'),
    ...cell(4, 'FS1_5_1_1M_WQGD', '0', '环圈横截面弯曲刚度EJ(N-m2)'),
    ...cell(5, 'FS1_5_1_1M_ZHSM', '0', '载荷数目n'),
    ...cell(6, 'FS1_5_1_1M_DEG', '0', '角度'),
    ...cell(7, 'FS1_5_1_1M_JXWL', '0', '径向外力'),
    ...cell(8, 'FS1_5_1_1M_QXWL', '0', '切向外力'),
    ...cell(9, 'FS1_5_1_1M_WQLJ', '0', '弯曲力矩'),
    ...cell(10, 'FS1_5_1_1M_JDJJ', '0', '输出内力的角度间距'),
    ...cell(11, 'FS1_5_1_1M_JZB', '0', '输出点的角坐标(°)'),
    ...cell(12, 'FS1_5_1_1M_FXLN', '1', '法向力N(N)'),
    ...cell(13, 'FS1_5_1_1M_JLQ', '1', '剪力Q(m)'),
    ...cell(14, 'FS1_5_1_1M_WJM', '0', '弯矩M(N M)'),
    ...cell(15, 'FS1_5_1_1M_JXRD', '0', '径向挠度(m)'),
  };
}

export function createDefaultFs151_1_1MParameterList(pageId = ''): Fs151_1_1MParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '16',
        rowData: [createDefaultFrameForceRow(1)],
        colStr: TABLE_COL_STR,
      },
      tableName: '加强框内力计算',
      inputName: '',
      tableType: '2',
      tableNum: 'FS1-5-1-1M',
    },
  ];
}

export function getFrameForceRows(list: Fs151_1_1MParameterItem[]): FrameForceRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as FrameForceRow[];
}

export function setFrameForceRows(list: Fs151_1_1MParameterItem[], rows: FrameForceRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function reindexFrameForceRows(rows: FrameForceRow[]) {
  rows.forEach((row, i) => {
    row.p0 = String(i + 1);
  });
}
