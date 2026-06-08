export interface ReinforcedFrameRow extends Record<string, string | number | undefined> {
  p0?: string | number;
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
  p11?: string;
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
  cellParameterId8?: string;
  cellParentNum8?: string;
  cellInputOrOutput8?: string;
  cellInputName8?: string;
  cellParameterId9?: string;
  cellParentNum9?: string;
  cellInputOrOutput9?: string;
  cellInputName9?: string;
  cellParameterId10?: string;
  cellParentNum10?: string;
  cellInputOrOutput10?: string;
  cellInputName10?: string;
  cellParameterId11?: string;
  cellParentNum11?: string;
  cellInputOrOutput11?: string;
  cellInputName11?: string;
}

export interface Fs151_1_6ParameterItem {
  inputOrOutput?: string;
  inputType?: string;
  ifSingleLine?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowNums?: string | number;
    rowData?: ReinforcedFrameRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

export const OUTER_SOURCE_TABLE_NUM = 'FS1-5-1D';
export const INNER_SOURCE_TABLE_NUM = 'FS1-5-1D1';
export const OUTER_DESIGN_TABLE_NUM = 'FS1-5-1-1F';
export const INNER_DESIGN_TABLE_NUM = 'FS1-5-1-1F1';
export const OUTER_TEMP_MODEL_FILE = 'TEMP_FS8_075_003.prt';
export const INNER_TEMP_MODEL_FILE = 'TEMP_FS8_075_004.prt';

export const OUTER_TABLE_INDEX = 4;
export const INNER_TABLE_INDEX = 5;

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'];

const OUTER_COL_DATA = [
  { colName: '序号', isShowCol: '1' },
  { colName: '名称', isShowCol: '1' },
  { colName: '功能描述', isShowCol: '1' },
  { colName: '与筒零点距离', isShowCol: '1' },
  { colName: '外加强框宽', isShowCol: '1' },
  { colName: '两侧过度区高度', isShowCol: '1' },
  { colName: '两侧过度区宽度', isShowCol: '1' },
  { colName: '外加强框外径', isShowCol: '1' },
  { colName: '外加强框内径', isShowCol: '1' },
  { colName: '两侧过度区倒圈角', isShowCol: '1' },
  { colName: '新文件名', isShowCol: '1' },
  { colName: '模型文件名', isShowCol: '1' },
];

const INNER_COL_DATA = [
  { colName: '序号', isShowCol: '1' },
  { colName: '名称', isShowCol: '1' },
  { colName: '功能描述', isShowCol: '1' },
  { colName: '与筒零点距离', isShowCol: '1' },
  { colName: '内加强框宽', isShowCol: '1' },
  { colName: '两侧过度区高度', isShowCol: '1' },
  { colName: '两侧过度区宽度', isShowCol: '1' },
  { colName: '内加强框外径', isShowCol: '1' },
  { colName: '内加强框内径', isShowCol: '1' },
  { colName: '两侧过度区倒圈角', isShowCol: '1' },
  { colName: '新文件名', isShowCol: '1' },
  { colName: '模型文件名', isShowCol: '1' },
];

export function createDefaultOuterFrameRow(index = 1): ReinforcedFrameRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_5_1_1F_WNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS8_075_003_L1',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_003_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_003_W1',
    cellInputOrOutput4: '0',
    cellInputName4: '外加强框宽',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS8_075_003_H',
    cellInputOrOutput5: '0',
    cellInputName5: '两侧过度区高度',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_003_W2',
    cellInputOrOutput6: '0',
    cellInputName6: '两侧过度区宽度',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_003_D1',
    cellInputOrOutput7: '0',
    cellInputName7: '外加强框外径',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_003_D2',
    cellInputOrOutput8: '0',
    cellInputName8: '外加强框内径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_003_R',
    cellInputOrOutput9: '0',
    cellInputName9: '两侧过度区倒圈角',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '新文件名',
    p11: OUTER_TEMP_MODEL_FILE,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
    delIndex: index - 1,
  };
}

export function createDefaultInnerFrameRow(index = 1): ReinforcedFrameRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_5_1_1F_NNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS1_5_1_1F_NGNDES',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_004_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_004_W1',
    cellInputOrOutput4: '0',
    cellInputName4: '内加强框宽',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS8_075_004_H',
    cellInputOrOutput5: '0',
    cellInputName5: '两侧过度区高度',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_004_W2',
    cellInputOrOutput6: '0',
    cellInputName6: '两侧过度区宽度',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_004_D1',
    cellInputOrOutput7: '0',
    cellInputName7: '内加强框外径',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_004_D2',
    cellInputOrOutput8: '0',
    cellInputName8: '内加强框内径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_004_R',
    cellInputOrOutput9: '0',
    cellInputName9: '两侧过度区倒圈角',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '新文件名',
    p11: INNER_TEMP_MODEL_FILE,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
    delIndex: index - 1,
  };
}

export function createOuterRowFromSource(source: Record<string, string | number | undefined>): ReinforcedFrameRow {
  return {
    p0: source.p0 ?? '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: source.p1 ?? '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_5_1_1F_WNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: source.p2 ?? '',
    cellParameterId2: '',
    cellParentNum2: 'FS8_075_003_L1',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: source.p3 ?? '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_003_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_003_W1',
    cellInputOrOutput4: '0',
    cellInputName4: '外加强框宽',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS8_075_003_H',
    cellInputOrOutput5: '0',
    cellInputName5: '两侧过度区高度',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_003_W2',
    cellInputOrOutput6: '0',
    cellInputName6: '两侧过度区宽度',
    p7: source.p4 ?? '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_003_D1',
    cellInputOrOutput7: '0',
    cellInputName7: '外加强框外径',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_003_D2',
    cellInputOrOutput8: '0',
    cellInputName8: '外加强框内径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_003_R',
    cellInputOrOutput9: '0',
    cellInputName9: '两侧过度区倒圈角',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '新文件名',
    p11: OUTER_TEMP_MODEL_FILE,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
  };
}

export function createInnerRowFromSource(source: Record<string, string | number | undefined>): ReinforcedFrameRow {
  return {
    p0: source.p0 ?? '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: source.p1 ?? '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_5_1_1F_NNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: source.p2 ?? '',
    cellParameterId2: '',
    cellParentNum2: 'FS1_5_1_1F_NGNDES',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: source.p3 ?? '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_004_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_004_W1',
    cellInputOrOutput4: '0',
    cellInputName4: '内加强框宽',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS8_075_004_H',
    cellInputOrOutput5: '0',
    cellInputName5: '两侧过度区高度',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_004_W2',
    cellInputOrOutput6: '0',
    cellInputName6: '两侧过度区宽度',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_004_D1',
    cellInputOrOutput7: '0',
    cellInputName7: '内加强框外径',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_004_D2',
    cellInputOrOutput8: '0',
    cellInputName8: '内加强框内径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_004_R',
    cellInputOrOutput9: '0',
    cellInputName9: '两侧过度区倒圈角',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '0',
    cellInputName10: '新文件名',
    p11: INNER_TEMP_MODEL_FILE,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
  };
}

export function createDefaultFs151_1_6ParameterList(pageId = ''): Fs151_1_6ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS6_100_001_YD1',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '外蒙皮外径',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1_1A_WMPNJ',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '外蒙皮内径',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1_1C_NMPWJ',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '内蒙皮外径',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS6_100_001_ND1',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '内蒙皮内径',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '12',
        rowData: [createDefaultOuterFrameRow(1)],
        colStr: TABLE_COL_STR,
        colData: OUTER_COL_DATA,
      },
      tableName: '外加强框设计',
      inputName: '外加强框设计',
      tableType: '1',
      tableNum: OUTER_DESIGN_TABLE_NUM,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '12',
        rowData: [createDefaultInnerFrameRow(1)],
        colStr: TABLE_COL_STR,
        colData: INNER_COL_DATA,
      },
      tableName: '内加强框设计',
      inputName: '内加强框设计',
      tableType: '1',
      tableNum: INNER_DESIGN_TABLE_NUM,
    },
  ];
}

export function getOuterFrameRows(list: Fs151_1_6ParameterItem[]): ReinforcedFrameRow[] {
  return (list[OUTER_TABLE_INDEX]?.tableMap?.rowData ?? []) as ReinforcedFrameRow[];
}

export function getInnerFrameRows(list: Fs151_1_6ParameterItem[]): ReinforcedFrameRow[] {
  return (list[INNER_TABLE_INDEX]?.tableMap?.rowData ?? []) as ReinforcedFrameRow[];
}

export function setOuterFrameRows(list: Fs151_1_6ParameterItem[], rows: ReinforcedFrameRow[]) {
  if (!list[OUTER_TABLE_INDEX]?.tableMap) return;
  list[OUTER_TABLE_INDEX].tableMap!.rowData = rows;
  list[OUTER_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[OUTER_TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function setInnerFrameRows(list: Fs151_1_6ParameterItem[], rows: ReinforcedFrameRow[]) {
  if (!list[INNER_TABLE_INDEX]?.tableMap) return;
  list[INNER_TABLE_INDEX].tableMap!.rowData = rows;
  list[INNER_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[INNER_TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function renumberFrameRows(rows: ReinforcedFrameRow[]): ReinforcedFrameRow[] {
  return rows.map((row, index) => ({
    ...row,
    p0: String(index + 1),
    delIndex: index,
  }));
}
