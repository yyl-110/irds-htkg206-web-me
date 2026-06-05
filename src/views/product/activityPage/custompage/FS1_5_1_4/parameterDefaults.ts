export interface FrameRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
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
  cellParameterId4?: string;
  cellParentNum4?: string;
  cellInputOrOutput4?: string;
  cellInputName4?: string;
}

export interface Fs151_4ParameterItem {
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
    rowData?: FrameRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

const OUTER_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4'];
const INNER_COL_STR = ['p0', 'p1', 'p2', 'p3'];

export function createDefaultOuterFrameRow(index: number): FrameRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1D_WKNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1D_WKDES',
    cellInputOrOutput2: '0',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1D_WKL',
    cellInputOrOutput3: '0',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS_1_5_1D_WKWD',
    cellInputOrOutput4: '0',
    cellInputName4: '外加强框外径',
    delIndex: index,
  };
}

export function createDefaultInnerFrameRow(index: number): FrameRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1D_NKNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1D_NKDES',
    cellInputOrOutput2: '0',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1D_NKL',
    cellInputOrOutput3: '0',
    cellInputName3: '与筒零点距离',
    delIndex: index,
  };
}

export function createDefaultFs151_4ParameterList(pageId = ''): Fs151_4ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '5',
        rowData: [createDefaultOuterFrameRow(1)],
        colStr: OUTER_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '功能描述', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '外加强框外径', isShowCol: '1' },
        ],
      },
      tableName: '外加强框',
      inputName: '外加强框',
      tableType: '2',
      tableNum: 'FS1-5-1D',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '4',
        rowData: [createDefaultInnerFrameRow(1)],
        colStr: INNER_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '功能描述', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
        ],
      },
      tableName: '内加强框',
      inputName: '内加强框',
      tableType: '2',
      tableNum: 'FS1-5-1D1',
    },
  ];
}

export function getOuterFrameRows(list: Fs151_4ParameterItem[]): FrameRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as FrameRow[];
}

export function getInnerFrameRows(list: Fs151_4ParameterItem[]): FrameRow[] {
  return (list[1]?.tableMap?.rowData ?? []) as FrameRow[];
}

export function setOuterFrameRows(list: Fs151_4ParameterItem[], rows: FrameRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = OUTER_COL_STR;
}

export function setInnerFrameRows(list: Fs151_4ParameterItem[], rows: FrameRow[]) {
  if (!list[1]?.tableMap) return;
  list[1].tableMap.rowData = rows;
  list[1].tableMap.rowNums = rows.length;
  list[1].tableMap.colStr = INNER_COL_STR;
}

export function renumberFrameRows(rows: FrameRow[]): FrameRow[] {
  return rows.map((row, index) => ({
    ...row,
    p0: String(index + 1),
    delIndex: index,
  }));
}
