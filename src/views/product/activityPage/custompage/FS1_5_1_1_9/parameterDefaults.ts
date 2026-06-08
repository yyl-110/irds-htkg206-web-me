export interface FrameDesignRow extends Record<string, string | number | undefined> {
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
  p12?: string;
  delIndex?: number;
  id?: string | number;
  [key: `cellParameterId${number}`]: string | undefined;
  [key: `cellParentNum${number}`]: string | undefined;
  [key: `cellInputOrOutput${number}`]: string | undefined;
  [key: `cellInputName${number}`]: string | undefined;
}

export interface LiningDesignRow extends Record<string, string | number | undefined> {
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
  [key: `cellParameterId${number}`]: string | undefined;
  [key: `cellParentNum${number}`]: string | undefined;
  [key: `cellInputOrOutput${number}`]: string | undefined;
  [key: `cellInputName${number}`]: string | undefined;
}

export interface Fs151_1_9ParameterItem {
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
    rowData?: FrameDesignRow[] | LiningDesignRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SOURCE_TABLE_NUM = 'FS1-5-1F';
export const FRAME_TABLE_NUM = 'FS1-5-1-1I';
export const LINING_TABLE_NUM = 'FS1-5-1-1I1';
export const FRAME_TEMP_MODEL = 'TEMP_FS8_075_005.prt';
export const LINING_TEMP_MODEL = 'TEMP_FS8_075_006.prt';

export const FRAME_TABLE_INDEX = 4;
export const LINING_TABLE_INDEX = 5;

const FRAME_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'];
const LINING_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'];

export function createDefaultFrameRow(index = 1): FrameDesignRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_1_5_1I_KKNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS1_1_5_1I_KKDES',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_005_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_005_DEG',
    cellInputOrOutput4: '1',
    cellInputName4: '与象限的夹角',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS1_1_5_1I_KKD',
    cellInputOrOutput5: '1',
    cellInputName5: '开口规格(接口图)',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_005_W2',
    cellInputOrOutput6: '1',
    cellInputName6: '宽度(切向尺寸)',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_005_L2',
    cellInputOrOutput7: '1',
    cellInputName7: '长度(轴向尺寸)',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_005_D1',
    cellInputOrOutput8: '1',
    cellInputName8: '外径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_005_D2',
    cellInputOrOutput9: '1',
    cellInputName9: '内径',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '1',
    cellInputName10: '新文件名',
    p11: FRAME_TEMP_MODEL,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'FS8_075_005_R',
    cellInputOrOutput12: '1',
    cellInputName12: '倒圆角',
    delIndex: index - 1,
  };
}

export function createDefaultLiningRow(index = 1): LiningDesignRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: 'FS1_1_5_1I_CBNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '衬板名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS1_1_5_1I_CBDES',
    cellInputOrOutput2: '1',
    cellInputName2: '衬板功能',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_006_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '衬板中心到筒零点的距离',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_006_DEG',
    cellInputOrOutput4: '1',
    cellInputName4: '衬板中面与筒象限的夹角',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS8_075_006_D2',
    cellInputOrOutput5: '1',
    cellInputName5: '衬板内径',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_006_D1',
    cellInputOrOutput6: '1',
    cellInputName6: '衬板外径',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_006_L2',
    cellInputOrOutput7: '1',
    cellInputName7: '衬板长度(轴向尺寸)',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_006_W2',
    cellInputOrOutput8: '1',
    cellInputName8: '衬板宽度(切向尺寸)',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: '',
    cellInputOrOutput9: '1',
    cellInputName9: '新模型名称',
    p10: LINING_TEMP_MODEL,
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '1',
    cellInputName10: '新模型文件名',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: 'FS8_075_006_R',
    cellInputOrOutput11: '1',
    cellInputName11: '倒圆角',
    delIndex: index - 1,
  };
}

export function createFrameRowFromSource(item: Record<string, string | number | undefined>): FrameDesignRow {
  return {
    p0: item.p0 ?? '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: String(item.p1 ?? ''),
    cellParameterId1: '',
    cellParentNum1: 'FS1_1_5_1I_KKNAME',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: String(item.p2 ?? ''),
    cellParameterId2: '',
    cellParentNum2: 'FS1_1_5_1I_KKDES',
    cellInputOrOutput2: '1',
    cellInputName2: '功能描述',
    p3: String(item.p3 ?? ''),
    cellParameterId3: '',
    cellParentNum3: 'FS8_075_005_L1',
    cellInputOrOutput3: '1',
    cellInputName3: '与筒零点距离',
    p4: String(item.p4 ?? ''),
    cellParameterId4: '',
    cellParentNum4: 'FS8_075_005_DEG',
    cellInputOrOutput4: '1',
    cellInputName4: '与象限的夹角',
    p5: String(item.p6 ?? ''),
    cellParameterId5: '',
    cellParentNum5: 'FS1_1_5_1I_KKD',
    cellInputOrOutput5: '1',
    cellInputName5: '开口规格(接口图)',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS8_075_005_W2',
    cellInputOrOutput6: '1',
    cellInputName6: '宽度(切向尺寸)',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS8_075_005_L2',
    cellInputOrOutput7: '1',
    cellInputName7: '长度(轴向尺寸)',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_005_D1',
    cellInputOrOutput8: '1',
    cellInputName8: '外径',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_005_D2',
    cellInputOrOutput9: '1',
    cellInputName9: '内径',
    p10: '',
    cellParameterId10: '',
    cellParentNum10: '',
    cellInputOrOutput10: '1',
    cellInputName10: '新文件名',
    p11: FRAME_TEMP_MODEL,
    cellParameterId11: '',
    cellParentNum11: '',
    cellInputOrOutput11: '1',
    cellInputName11: '模型文件名',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'FS8_075_005_R',
    cellInputOrOutput12: '1',
    cellInputName12: '倒圆角',
  };
}

export function createDefaultFs151_1_9ParameterList(pageId = ''): Fs151_1_9ParameterItem[] {
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
        colNums: '13',
        rowData: [createDefaultFrameRow(1)],
        colStr: FRAME_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '功能描述', isShowCol: '1' },
          { colName: '与筒零点距离', isShowCol: '1' },
          { colName: '与象限的夹角', isShowCol: '1' },
          { colName: '开口规格(接口图)', isShowCol: '1' },
          { colName: '宽度(切向尺寸)', isShowCol: '1' },
          { colName: '长度(轴向尺寸)', isShowCol: '1' },
          { colName: '外径', isShowCol: '1' },
          { colName: '内径', isShowCol: '1' },
          { colName: '新文件名', isShowCol: '1' },
          { colName: '模型文件名', isShowCol: '1' },
          { colName: '倒圆角', isShowCol: '1' },
        ],
      },
      tableName: '口框设计',
      inputName: '口框设计',
      tableType: '1',
      tableNum: FRAME_TABLE_NUM,
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '12',
        rowData: [createDefaultLiningRow(1)],
        colStr: LINING_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '衬板名称', isShowCol: '1' },
          { colName: '衬板功能', isShowCol: '1' },
          { colName: '衬板中心到筒零点的距离', isShowCol: '1' },
          { colName: '衬板中面与筒象限的夹角', isShowCol: '1' },
          { colName: '衬板内径', isShowCol: '1' },
          { colName: '衬板外径', isShowCol: '1' },
          { colName: '衬板长度(轴向尺寸)', isShowCol: '1' },
          { colName: '衬板宽度(切向尺寸)', isShowCol: '1' },
          { colName: '新模型名称', isShowCol: '1' },
          { colName: '新模型文件名', isShowCol: '1' },
          { colName: '倒圆角', isShowCol: '1' },
        ],
      },
      tableName: '衬板设计',
      inputName: '衬板设计',
      tableType: '1',
      tableNum: LINING_TABLE_NUM,
    },
  ];
}

export function getFrameTableRows(list: Fs151_1_9ParameterItem[]): FrameDesignRow[] {
  return (list[FRAME_TABLE_INDEX]?.tableMap?.rowData ?? []) as FrameDesignRow[];
}

export function getLiningTableRows(list: Fs151_1_9ParameterItem[]): LiningDesignRow[] {
  return (list[LINING_TABLE_INDEX]?.tableMap?.rowData ?? []) as LiningDesignRow[];
}

export function setFrameTableRows(list: Fs151_1_9ParameterItem[], rows: FrameDesignRow[]) {
  if (!list[FRAME_TABLE_INDEX]?.tableMap) return;
  list[FRAME_TABLE_INDEX].tableMap!.rowData = rows;
  list[FRAME_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[FRAME_TABLE_INDEX].tableMap!.colStr = FRAME_COL_STR;
}

export function setLiningTableRows(list: Fs151_1_9ParameterItem[], rows: LiningDesignRow[]) {
  if (!list[LINING_TABLE_INDEX]?.tableMap) return;
  list[LINING_TABLE_INDEX].tableMap!.rowData = rows;
  list[LINING_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[LINING_TABLE_INDEX].tableMap!.colStr = LINING_COL_STR;
}

export function addLiningRow(list: Fs151_1_9ParameterItem[]) {
  const rows = getLiningTableRows(list);
  const num = rows.length + 1;
  rows.push({
    p0: num,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: LINING_TEMP_MODEL,
    delIndex: rows.length,
  });
  setLiningTableRows(list, rows);
}

type RowWithKey = { id?: string | number; delIndex?: number; p0?: string | number };

export function deleteSelectedRows<T extends RowWithKey>(rows: T[], selected: T[]): T[] {
  const remaining = rows.filter(row => {
    return !selected.some(sel => {
      if (sel.id != null && row.id != null) return sel.id === row.id;
      if (sel.delIndex != null && row.delIndex != null) return sel.delIndex === row.delIndex;
      return sel.p0 === row.p0;
    });
  });
  return remaining.map((row, i) => ({ ...row, p0: String(i + 1) }));
}
