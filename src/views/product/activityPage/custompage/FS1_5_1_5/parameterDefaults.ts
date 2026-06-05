export interface SkinSegmentRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  delIndex?: number;
  id?: string | number;
  cellParameterId0?: string;
  cellParentNum0?: string;
  cellInputOrOutput0?: string;
  cellInputName0?: string;
  cellParameterId1?: string;
  cellParentNum1?: string;
  cellInputOrOutput1?: string;
  cellInputName1?: string;
  cellParameterId2?: string;
  cellParentNum2?: string;
  cellInputOrOutput2?: string;
  cellInputName2?: string;
  cellParameterId3?: string;
  cellParentNum3?: string;
  cellInputOrOutput3?: string;
  cellInputName3?: string;
}

export interface Fs151_5ParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  defaultValue?: string;
  tableName?: string;
  inputName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: SkinSegmentRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

const SEGMENT_COL_STR = ['p0', 'p1', 'p2', 'p3'];

export function createDefaultOuterSkinRow(index: number): SkinSegmentRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1E_WMPDNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1E_WMPL1',
    cellInputOrOutput2: '0',
    cellInputName2: '与筒零点距离',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1E_WMPL2',
    cellInputOrOutput3: '0',
    cellInputName3: '长度',
    delIndex: index,
  };
}

export function createDefaultInnerSkinRow(index: number): SkinSegmentRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1E_NMPDNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1E_NMPL1',
    cellInputOrOutput2: '0',
    cellInputName2: '与筒零点距离',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1E_NMPL2',
    cellInputOrOutput3: '0',
    cellInputName3: '长度',
    delIndex: index,
  };
}

export function createDefaultFs151_5ParameterList(pageId = ''): Fs151_5ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowData: [createDefaultOuterSkinRow(1)],
        colStr: SEGMENT_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '长度', isShowCol: '1' },
        ],
      },
      tableName: '外蒙皮加强段',
      inputName: '外蒙皮加强段',
      tableType: '2',
      tableNum: 'FS1-5-1_5',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowData: [createDefaultInnerSkinRow(1)],
        colStr: SEGMENT_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '长度', isShowCol: '1' },
        ],
      },
      tableName: '内蒙皮加强段',
      inputName: '内蒙皮加强段',
      tableType: '2',
      tableNum: 'FS1-5-1_5_2',
    },
  ];
}

export function getOuterSkinRows(list: Fs151_5ParameterItem[]): SkinSegmentRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as SkinSegmentRow[];
}

export function getInnerSkinRows(list: Fs151_5ParameterItem[]): SkinSegmentRow[] {
  return (list[1]?.tableMap?.rowData ?? []) as SkinSegmentRow[];
}

export function setOuterSkinRows(list: Fs151_5ParameterItem[], rows: SkinSegmentRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = SEGMENT_COL_STR;
}

export function setInnerSkinRows(list: Fs151_5ParameterItem[], rows: SkinSegmentRow[]) {
  if (!list[1]?.tableMap) return;
  list[1].tableMap.rowData = rows;
  list[1].tableMap.rowNums = rows.length;
  list[1].tableMap.colStr = SEGMENT_COL_STR;
}

export function renumberSkinRows(rows: SkinSegmentRow[]): SkinSegmentRow[] {
  return rows.map((row, index) => ({
    ...row,
    p0: String(index + 1),
    delIndex: index,
  }));
}
