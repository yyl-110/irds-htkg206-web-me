export interface OpeningDesignRow extends Record<string, string | number | undefined> {
  p0?: string | number;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string | number;
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
  cellParameterId7?: string;
  cellParentNum7?: string;
  cellInputOrOutput7?: string;
  cellInputName7?: string;
}

export interface Fs151JParameterItem {
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
    rowData?: OpeningDesignRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
  colData?: Array<{ colName?: string; isShowCol?: string }>;
}

export const REVIEW_OPTIONS = [
  { label: '满足', value: '1' },
  { label: '不满足', value: '2' },
];

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
const SOURCE_TABLE_NUM = 'FS1-5-1F';

export function createDefaultOpeningRow(index = 1): OpeningDesignRow {
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
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS_1_5_1J_CHECK',
    cellInputOrOutput7: '0',
    cellInputName7: '复核',
  };
}

export function createRowFromSourceRow(item: Record<string, string | number | undefined>): OpeningDesignRow {
  return {
    p0: item.p0,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '0',
    cellInputName0: '序号',
    p1: String(item.p1 ?? ''),
    cellParameterId1: '',
    cellParentNum1: 'FS_1_5_1F_KKNAME',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: String(item.p2 ?? ''),
    cellParameterId2: '',
    cellParentNum2: 'FS_1_5_1F_KKDES',
    cellInputOrOutput2: '0',
    cellInputName2: '功能描述',
    p3: String(item.p3 ?? ''),
    cellParameterId3: '',
    cellParentNum3: 'FS_1_5_1F_KKL1',
    cellInputOrOutput3: '0',
    cellInputName3: '与筒零点距离',
    p4: String(item.p4 ?? ''),
    cellParameterId4: '',
    cellParentNum4: 'FS_1_5_1F_KKDEG',
    cellInputOrOutput4: '0',
    cellInputName4: '与象限的夹角',
    p5: String(item.p5 ?? ''),
    cellParameterId5: '',
    cellParentNum5: 'FS_1_5_1F_KKD1',
    cellInputOrOutput5: '0',
    cellInputName5: '开口规格(直径)',
    p6: String(item.p6 ?? ''),
    cellParameterId6: '',
    cellParentNum6: 'FS_1_5_1F_KKJPG',
    cellInputOrOutput6: '1',
    cellInputName6: '开口规格(接口)',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: '',
    cellInputOrOutput7: '1',
    cellInputName7: '复核',
  };
}

export function createDefaultFs151JParameterList(pageId = ''): Fs151JParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '8',
        rowData: [createDefaultOpeningRow(1)],
        colStr: TABLE_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '功能描述', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '与象限的夹角', isShowCol: '1' },
          { colName: '开口规格(直径)', isShowCol: '1' },
          { colName: '开口规格(接口)', isShowCol: '1' },
          { colName: '复核', isShowCol: '1' },
        ],
      },
      tableName: '开口设计',
      inputName: '开口设计',
      tableType: '2',
      tableNum: 'FS1-5-1J',
    },
  ];
}

export function getOpeningRows(list: Fs151JParameterItem[]): OpeningDesignRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as OpeningDesignRow[];
}

export function setOpeningRows(list: Fs151JParameterItem[], rows: OpeningDesignRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
  list[0].tableMap.colStr = TABLE_COL_STR;
}

export { SOURCE_TABLE_NUM };
