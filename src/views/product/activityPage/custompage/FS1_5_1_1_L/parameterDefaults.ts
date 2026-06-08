export interface WallCheckDisplayRow extends Record<string, string | number | undefined> {
  id?: string | number;
}

export interface WallCheckRow extends Record<string, string | number | undefined> {
  id?: string | number;
}

export interface Fs151_1_1LParameterItem {
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
    rowData?: Array<WallCheckDisplayRow | WallCheckRow>;
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SOURCE_TABLE_NUM = 'FS1-5-1-1K';
export const DISPLAY_TABLE_INDEX = 0;
export const CHECK_TABLE_INDEX = 5;

const DISPLAY_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
const CHECK_COL_STR = Array.from({ length: 19 }, (_, i) => `p${i}`);

function cell(index: number, parentNum: string, io: string, name: string): Record<string, string> {
  return {
    [`cellParameterId${index}`]: '',
    [`cellParentNum${index}`]: parentNum,
    [`cellInputOrOutput${index}`]: io,
    [`cellInputName${index}`]: name,
  };
}

export function createDisplayRowFromSource(item: Record<string, string | number | undefined>): WallCheckDisplayRow {
  return {
    p0: item.p0 ?? '',
    p1: item.p1 ?? '',
    p2: item.p22 ?? '',
    p3: item.p23 ?? '',
    p4: item.p24 ?? '',
    p5: item.p25 ?? '',
    p6: item.p26 ?? '',
    p7: item.p27 ?? '',
    ...cell(0, 'FS1_5_1_1K_TDXH', '1', '筒段序号'),
    ...cell(1, 'FS1_5_1_1K_TDMS', '1', '筒段描述'),
    ...cell(2, 'FS1_5_1_1K_T', '1', '层合板总厚度'),
    ...cell(3, 'FS1_5_1_1K_E1', '1', '层合板纵向弹性模量E1'),
    ...cell(4, 'FS1_5_1_1K_E2', '1', '层合板横向弹性模量E2'),
    ...cell(5, 'FS1_5_1_1K_V1', '1', '层合板纵向泊松比V1'),
    ...cell(6, 'FS1_5_1_1K_V2', '1', '层合板纵向泊松比V2'),
    ...cell(7, 'FS1_5_1_1K_G12', '1', '层合板纵横切模量G12'),
  };
}

export function createCheckRowFromInner(item: Record<string, string | number | undefined>): WallCheckRow {
  return {
    p0: item.p0 ?? '',
    p1: '',
    p2: item.p22 ?? '',
    p3: item.p23 ?? '',
    p4: item.p24 ?? '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: '',
    p12: '',
    p13: '',
    p14: '',
    p15: '',
    p16: '',
    p17: '',
    p18: '',
    ...cell(0, 'FS1_5_1_1K_TDXH', '1', '筒段序号'),
    ...cell(1, 'FS1_5_1_1L_NMPNJ', '0', '内蒙皮内径φ'),
    ...cell(2, 'FS1_5_1_1K_T', '1', '内蒙皮厚度'),
    ...cell(3, 'FS1_5_1_1K_E1', '1', '层合板纵向弹性模量E1'),
    ...cell(4, 'FS1_5_1_1K_E2', '1', '层合板横向弹性模量E2'),
    ...cell(5, 'FS1_5_1_1L_NMPNJ', '0', '外蒙皮外径φ'),
    ...cell(6, 'FS1_5_1_1K_T', '1', '外蒙皮厚度'),
    ...cell(7, 'FS1_5_1_1K_T', '1', '层合板纵向弹性模量E1'),
    ...cell(8, 'FS1_5_1_1K_E2', '1', '层合板横向弹性模量E2'),
    ...cell(9, 'FS1_5_1_1L_ZDWJM', '0', '简体所受最大弯矩M'),
    ...cell(10, 'FS1_5_1_1L_ZDJLQ', '0', '简体所受最大剪力Q'),
    ...cell(11, 'FS1_5_1_1L_KWGD', '1', '抗弯刚度(N-m2)'),
    ...cell(12, 'FS1_5_1_1L_WQWDX', '1', '设计载荷下整体弯曲稳定性剩余强度系数'),
    ...cell(13, 'FS1_5_1_1L_JQWDX', '1', '设计载荷下剪切稳定性剩余强度系数'),
    ...cell(14, 'FS1_5_1_1L_WMPWDX', '1', '设计载荷下外蒙皮局部稳定性剩余强度系数'),
    ...cell(15, 'FS1_5_1_1L_NMPWDX', '1', '设计载荷下内蒙皮局部稳定性剩余强度系数'),
    ...cell(16, 'FS1_5_1_1L_BJFXBX', '1', '内压下沿半径方向变形'),
    ...cell(17, 'FS1_5_1_1L_NBMHXYB', '1', '内压下内表面环向应变'),
    ...cell(18, 'FS1_5_1_1L_ZTDZYL', '1', '装退弹正应力'),
  };
}

export function applyOuterSkinToCheckRow(row: WallCheckRow, outer: Record<string, string | number | undefined>) {
  row.p6 = outer.p22 ?? '';
  row.p7 = outer.p23 ?? '';
  row.p8 = outer.p24 ?? '';
}

export function createDefaultFs151_1_1LParameterList(pageId = ''): Fs151_1_1LParameterItem[] {
  const displayData: WallCheckDisplayRow[] = [
    { p0: '筒段1', p1: '内蒙皮', ...cell(0, 'FS1_5_1_1K_TDXH', '1', '筒段序号') },
    { p0: '筒段1', p1: '外蒙皮', ...cell(0, 'FS1_5_1_1K_TDXH', '1', '筒段序号') },
  ];
  const checkData: WallCheckRow[] = [{ p0: '筒段1', ...cell(0, 'FS1_5_1_1K_TDXH', '1', '筒段序号') }];

  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '8',
        rowData: displayData,
        colStr: DISPLAY_COL_STR,
      },
      tableName: '筒壁层合板性能计算',
      inputName: '筒壁层合板性能计算',
      tableType: '1',
      tableNum: 'FS1-5-1-1L',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_3_FSTNZDYL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '发射内压q',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_3_25SPTZZDTL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '水平装填最大推力',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1_1HJQML',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '夹心层剪切模量',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1_1HTXML',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '夹心层弹性模量',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '19',
        rowData: checkData,
        colStr: CHECK_COL_STR,
      },
      tableName: '筒壁校核',
      inputName: '筒壁校核',
      tableType: '1',
      tableNum: 'FS1-5-1-1L1',
    },
  ];
}

export function getDisplayTableRows(list: Fs151_1_1LParameterItem[]): WallCheckDisplayRow[] {
  return (list[DISPLAY_TABLE_INDEX]?.tableMap?.rowData ?? []) as WallCheckDisplayRow[];
}

export function getCheckTableRows(list: Fs151_1_1LParameterItem[]): WallCheckRow[] {
  return (list[CHECK_TABLE_INDEX]?.tableMap?.rowData ?? []) as WallCheckRow[];
}

export function setDisplayTableRows(list: Fs151_1_1LParameterItem[], rows: WallCheckDisplayRow[]) {
  if (!list[DISPLAY_TABLE_INDEX]?.tableMap) return;
  list[DISPLAY_TABLE_INDEX].tableMap!.rowData = rows;
  list[DISPLAY_TABLE_INDEX].tableMap!.rowNums = rows.length;
}

export function setCheckTableRows(list: Fs151_1_1LParameterItem[], rows: WallCheckRow[]) {
  if (!list[CHECK_TABLE_INDEX]?.tableMap) return;
  list[CHECK_TABLE_INDEX].tableMap!.rowData = rows;
  list[CHECK_TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[CHECK_TABLE_INDEX].tableMap!.colStr = CHECK_COL_STR;
}

export const FORM_FIELDS = [
  { label: '发射内压q：', index: 1 },
  { label: '水平装填最大推力：', index: 2 },
  { label: '夹心层剪切模量：', index: 3 },
  { label: '夹心层弹性模量：', index: 4 },
];
