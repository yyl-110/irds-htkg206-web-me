export interface SealTableRow extends Record<string, string | number | undefined> {
  id?: string | number;
  delIndex?: number;
}

export interface Fs15_1LParameterItem {
  inputType?: string;
  ifSingleLine?: string;
  pageId?: string;
  parameterId?: string;
  parameterNum?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: SealTableRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SELECT_TABLE_INDEX = 0;
export const CHECK_TABLE_INDEX = 1;
export const SELECT_TABLE_NUM = 'FS1-5-1L';
export const CHECK_TABLE_NUM = 'FS1-5-1L1';
export const MODULE_CATEGORY_ID = '506';
export const PRESSURE_DIRECTION_OPTIONS = [{ label: '外压', value: '外压' }, { label: '内压', value: '内压' }];

const SELECT_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
const CHECK_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'];

function createSelectRow(num: number, delIndex: number): SealTableRow {
  return {
    p0: num,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '模型名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '模型编号',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: '',
    cellInputOrOutput3: '1',
    cellInputName3: '用途描述',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS_C017_D1',
    cellInputOrOutput4: '1',
    cellInputName4: 'O形圈内径d1',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS_C017_D2',
    cellInputOrOutput5: '1',
    cellInputName5: 'O形圈截面直径d2',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS_C017_D2GC',
    cellInputOrOutput6: '1',
    cellInputName6: 'O形圈截面直径公差',
    delIndex,
  };
}

function createCheckRow(num: number, delIndex: number): SealTableRow {
  return {
    p0: num,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '0',
    cellInputName1: '用途描述',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '模型名称',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: '',
    cellInputOrOutput3: '1',
    cellInputName3: '模型编号',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS_C017_D1',
    cellInputOrOutput4: '1',
    cellInputName4: 'O形圈内径d1',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS_C017_D2',
    cellInputOrOutput5: '0',
    cellInputName5: 'O形圈截面直径d2',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS_C017_D2GC',
    cellInputOrOutput6: '1',
    cellInputName6: 'O形圈截面直径公差',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: '',
    cellInputOrOutput7: '1',
    cellInputName7: '压力方向',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: '',
    cellInputOrOutput8: '1',
    cellInputName8: '密封槽深度h',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: '',
    cellInputOrOutput9: '0',
    cellInputName9: '密封槽深度h公差',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '密封槽宽度B',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '密封槽宽度B公差',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: '',
    cellInputOrOutput12: '1',
    cellInputName12: '密封槽外径',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '压缩率Z',
    delIndex,
  };
}

export function createDefaultFs15_1LParameterList(pageId = ''): Fs15_1LParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '7',
        rowData: [createSelectRow(1, 0)],
        colStr: SELECT_COL_STR,
        colData: SELECT_COL_STR.map((_, i) => ({ colName: String(i), isShowCol: '1' })),
      },
      tableName: '密封件选型',
      inputName: '密封件选型',
      tableType: '1',
      tableNum: SELECT_TABLE_NUM,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '14',
        rowData: [createCheckRow(1, 0)],
        colStr: CHECK_COL_STR,
        colData: CHECK_COL_STR.map((_, i) => ({ colName: String(i), isShowCol: '1' })),
      },
      tableName: '密封件校核',
      inputName: '密封件校核',
      tableType: '1',
      tableNum: CHECK_TABLE_NUM,
    },
  ];
}

export function getSelectTableRows(list: Fs15_1LParameterItem[]): SealTableRow[] {
  return (list[SELECT_TABLE_INDEX]?.tableMap?.rowData ?? []) as SealTableRow[];
}

export function getCheckTableRows(list: Fs15_1LParameterItem[]): SealTableRow[] {
  return (list[CHECK_TABLE_INDEX]?.tableMap?.rowData ?? []) as SealTableRow[];
}

export function setSelectTableRows(list: Fs15_1LParameterItem[], rows: SealTableRow[]) {
  if (!list[SELECT_TABLE_INDEX]?.tableMap) return;
  list[SELECT_TABLE_INDEX].tableMap!.rowData = rows;
  list[SELECT_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[SELECT_TABLE_INDEX].tableMap!.colStr = SELECT_COL_STR;
}

export function setCheckTableRows(list: Fs15_1LParameterItem[], rows: SealTableRow[]) {
  if (!list[CHECK_TABLE_INDEX]?.tableMap) return;
  list[CHECK_TABLE_INDEX].tableMap!.rowData = rows;
  list[CHECK_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[CHECK_TABLE_INDEX].tableMap!.colStr = CHECK_COL_STR;
}

export function createDualTableRows(num: number, delIndex: number) {
  return {
    selectRow: createSelectRow(num, delIndex),
    checkRow: createCheckRow(num, delIndex),
  };
}
