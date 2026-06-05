export interface OpeningParamRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p12?: string;
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
  cellParameterId5?: string;
  cellParentNum5?: string;
  cellInputOrOutput5?: string;
  cellInputName5?: string;
  cellParameterId6?: string;
  cellParentNum6?: string;
  cellInputOrOutput6?: string;
  cellInputName6?: string;
}

export interface Fs151_6ParameterItem {
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
    rowData?: OpeningParamRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

const OPENING_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

export function createDefaultOpeningParamRow(index: number): OpeningParamRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '0',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1F_KKNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1F_KKDES',
    cellInputOrOutput2: '0',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1F_KKL1',
    cellInputOrOutput3: '0',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS_1_5_1F_KKDEG',
    cellInputOrOutput4: '0',
    cellInputName4: '与象限的夹角',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS_1_5_1F_KKD1',
    cellInputOrOutput5: '0',
    cellInputName5: '开口规格(直径)',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS_1_5_1F_KKJPG',
    cellInputOrOutput6: '1',
    cellInputName6: '开口规格(接口)',
    p12: '',
    delIndex: index,
  };
}

export function createDefaultFs151_6ParameterList(pageId = ''): Fs151_6ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '7',
        rowData: [createDefaultOpeningParamRow(1)],
        colStr: OPENING_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '功能描述', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '与象限的夹角', isShowCol: '1' },
          { colName: '开口规格(直径)', isShowCol: '1' },
          { colName: '开口规格(接口)', isShowCol: '1' },
        ],
      },
      tableName: '开口参数设计',
      inputName: '开口参数设计',
      tableType: '2',
      tableNum: 'FS1-5-1F',
    },
  ];
}

export function getOpeningParamRows(list: Fs151_6ParameterItem[]): OpeningParamRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as OpeningParamRow[];
}

export function setOpeningParamRows(list: Fs151_6ParameterItem[], rows: OpeningParamRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = OPENING_COL_STR;
}

export function renumberOpeningRows(rows: OpeningParamRow[]): OpeningParamRow[] {
  return rows.map((row, index) => ({
    ...row,
    p0: String(index + 1),
    delIndex: index,
  }));
}
