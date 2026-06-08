export interface ConnectionTableRow extends Record<string, string | number | undefined> {
  id?: string | number;
  delIndex?: number;
}

export interface Fs15GParameterItem {
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
    rowData?: ConnectionTableRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SELECT_TABLE_INDEX = 0;
export const CHECK_TABLE_INDEX = 1;
export const SELECT_TABLE_NUM = 'FS1-5G';
export const CHECK_TABLE_NUM = 'FS1-5G1';
export const MODULE_CATEGORY_ID = '462';
export const TEMP_MODEL_FILE = 'TEMP_FS8_075_002.prt';

const SELECT_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4'];
const CHECK_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13',
  'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20',
];

function createSelectRow(num: number, delIndex: number): ConnectionTableRow {
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
    cellInputName3: '螺纹公称直径d',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputOrOutput4: '1',
    cellInputName4: '螺栓光杆或销售直径D(取整)',
    delIndex,
  };
}

function createCheckRow(num: number, delIndex: number): ConnectionTableRow {
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
    cellInputName1: '模型名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '1',
    cellInputName2: '拉力F',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: '',
    cellInputOrOutput3: '1',
    cellInputName3: '剪力N',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputOrOutput4: '1',
    cellInputName4: '材料的屈服强度',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: '',
    cellInputOrOutput5: '0',
    cellInputName5: '材料的抗拉强度',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: '',
    cellInputOrOutput6: '1',
    cellInputName6: '螺纹公称直径d',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: '',
    cellInputOrOutput7: '1',
    cellInputName7: '螺纹小直径d1',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: '',
    cellInputOrOutput8: '1',
    cellInputName8: '螺栓光更或销直径D(取整)',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: '',
    cellInputOrOutput9: '0',
    cellInputName9: '安全系数n',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '牙根宽b',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '旋合圈数z',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: '',
    cellInputOrOutput12: '1',
    cellInputName12: '实际牙高H1',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '拧紧力矩T',
    p14: '',
    cellParameterId14: '',
    cellParentNum14: '',
    cellInputOrOutput14: '1',
    cellInputName14: '剪切剩余强度系数η1',
    p15: '',
    cellParameterId15: '',
    cellParentNum15: '',
    cellInputOrOutput15: '1',
    cellInputName15: '拉剪剩余强度系数η2',
    p16: '',
    cellParameterId16: '',
    cellParentNum16: '',
    cellInputOrOutput16: '1',
    cellInputName16: '螺纹剩余强度系数η3',
    p17: '',
    cellParameterId17: '',
    cellParentNum17: '',
    cellInputOrOutput17: '1',
    cellInputName17: '螺纹剩余强度系数η4',
    p18: '',
    cellParameterId18: '',
    cellParentNum18: '',
    cellInputOrOutput18: '1',
    cellInputName18: '螺纹剩余强度系数η5',
    p19: '',
    cellParameterId19: '',
    cellParentNum19: '',
    cellInputOrOutput19: '1',
    cellInputName19: '螺纹剪切剩余强度系数η6',
    p20: '',
    cellParameterId20: '',
    cellParentNum20: '',
    cellInputOrOutput20: '1',
    cellInputName20: '螺牙剩余强度系数η7',
    delIndex,
  };
}

export function createDefaultFs15GParameterList(pageId = ''): Fs15GParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '5',
        rowData: [createSelectRow(1, 0)],
        colStr: SELECT_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '模型名称', isShowCol: '1' },
          { colName: '模型编号', isShowCol: '1' },
          { colName: '螺纹公称直径d', isShowCol: '1' },
          { colName: '螺栓光杆或销售直径D(取整)', isShowCol: '1' },
        ],
      },
      tableName: '连接件选型',
      inputName: '连接件选型',
      tableType: '1',
      tableNum: SELECT_TABLE_NUM,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '21',
        rowData: [createCheckRow(1, 0)],
        colStr: CHECK_COL_STR,
        colData: CHECK_COL_STR.map((_, i) => ({ colName: String(i), isShowCol: '1' })),
      },
      tableName: '连接件校核',
      inputName: '连接件校核',
      tableType: '1',
      tableNum: CHECK_TABLE_NUM,
    },
  ];
}

export function getSelectTableRows(list: Fs15GParameterItem[]): ConnectionTableRow[] {
  return (list[SELECT_TABLE_INDEX]?.tableMap?.rowData ?? []) as ConnectionTableRow[];
}

export function getCheckTableRows(list: Fs15GParameterItem[]): ConnectionTableRow[] {
  return (list[CHECK_TABLE_INDEX]?.tableMap?.rowData ?? []) as ConnectionTableRow[];
}

export function setSelectTableRows(list: Fs15GParameterItem[], rows: ConnectionTableRow[]) {
  if (!list[SELECT_TABLE_INDEX]?.tableMap) return;
  list[SELECT_TABLE_INDEX].tableMap!.rowData = rows;
  list[SELECT_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[SELECT_TABLE_INDEX].tableMap!.colStr = SELECT_COL_STR;
}

export function setCheckTableRows(list: Fs15GParameterItem[], rows: ConnectionTableRow[]) {
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
