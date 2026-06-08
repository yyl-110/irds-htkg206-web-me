export interface LaminateRow extends Record<string, string | number | undefined> {
  delIndex?: number;
  id?: string | number;
}

export interface Fs151_1_1KParameterItem {
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
    rowData?: LaminateRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const TABLE_INDEX = 8;
export const TABLE_COL_STR = Array.from({ length: 28 }, (_, i) => `p${i}`);

const THICKNESS_FIELDS = new Set(['p5', 'p7', 'p9', 'p11', 'p15', 'p17', 'p19', 'p21']);

export function isThicknessField(field: string) {
  return THICKNESS_FIELDS.has(field);
}

function cell(
  index: number,
  parentNum: string,
  inputOrOutput: string,
  inputName: string,
): Record<string, string> {
  return {
    [`cellParameterId${index}`]: '',
    [`cellParentNum${index}`]: parentNum,
    [`cellInputOrOutput${index}`]: inputOrOutput,
    [`cellInputName${index}`]: inputName,
  };
}

export function createDefaultLaminateRow(
  codeNum: number,
  description: string,
  outputMode = false,
): LaminateRow {
  const io = outputMode ? '1' : '0';
  const parent = outputMode ? '' : undefined;
  const pn = (suffix: string, out = io) => (outputMode ? '' : `FS1_5_1_1K_${suffix}`);
  return {
    p0: `筒段${codeNum}`,
    p1: description,
    p2: '',
    p3: '',
    p4: '',
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
    p19: '',
    p20: '',
    p21: '',
    p22: '',
    p23: '',
    p24: '',
    p25: '',
    p26: '',
    p27: '',
    ...cell(0, pn('TDXH'), io, '筒段序号'),
    ...cell(1, pn('TDMS'), io, '筒段描述'),
    ...cell(2, pn('C1D1'), io, '铺层角度θ1'),
    ...cell(3, pn('C1T1'), io, '铺层厚度1'),
    ...cell(4, pn('C1D2'), io, '铺层角度θ2'),
    ...cell(5, pn('C1T2'), io, '铺层厚度2'),
    ...cell(6, pn('C1D3'), io, '铺层角度θ3'),
    ...cell(7, pn('C1T3'), io, '铺层厚度3'),
    ...cell(8, pn('C1D4'), io, '铺层角度θ4'),
    ...cell(9, pn('C1T4'), io, '铺层厚度04'),
    ...cell(10, pn('C1D5'), io, '铺层角度θ5'),
    ...cell(11, pn('C1T5'), io, '铺层厚度05'),
    ...cell(12, pn('C2D1'), io, '铺层角度θ1'),
    ...cell(13, pn('C2T1'), io, '铺层厚度01'),
    ...cell(14, pn('C2D2'), io, '铺层角度θ2'),
    ...cell(15, pn('C2T2'), io, '铺层厚度02'),
    ...cell(16, pn('C2T2'), io, '铺层角度θ3'),
    ...cell(17, pn('C2T3'), io, '铺层厚度03'),
    ...cell(18, pn('C2T3'), io, '铺层角度θ4'),
    ...cell(19, pn('C2T4'), io, '铺层厚度04'),
    ...cell(20, pn('C2D5'), io, '铺层角度θ5'),
    ...cell(21, pn('C2T5'), io, '铺层厚度05'),
    ...cell(22, pn('T', '1'), '1', '层合板总厚度'),
    ...cell(23, pn('E1', '1'), '1', '层合板纵向弹性模型E1'),
    ...cell(24, pn('E2', '1'), '1', '层合板纵向弹性模型E2'),
    ...cell(25, pn('V1', '1'), '1', '层合板纵向泊松比V1'),
    ...cell(26, pn('V2', '1'), '1', '层合板纵向泊松比V2'),
    ...cell(27, pn('G12', '1'), '1', '层合板纵横切模量G12'),
  };
}

export function createDefaultFs151_1_1KParameterList(pageId = ''): Fs151_1_1KParameterItem[] {
  const materialFields = [
    ['FS1_5_1_1K_C1YE', '沿纤维方向的弹性模量EL1(GPa)'],
    ['FS1_5_1_1K_C1TE', '垂直于纤维方向的弹性模量ET1(GPa)'],
    ['FS1_5_1_1K_C1V1', '单向板纵向柏松比vLT'],
    ['FS1_5_1_1K_C1V2', '单向板纵横剪切弹性模量GLT(GPa)'],
    ['FS1_5_1_1K_C2YE', '沿纤维方向的弹性模量EL1(GPa)'],
    ['FS1_5_1_1K_C2TE', '垂直于纤维方向的弹性模量ET1(GPa)'],
    ['FS1_5_1_1K_C2V1', '单向板纵向柏松比vLT'],
    ['FS1_5_1_1K_C2V2', '单向板纵横剪切弹性模量GLT(GPa)'],
  ] as const;

  const formItems: Fs151_1_1KParameterItem[] = materialFields.map(([parameterNum, inputName]) => ({
    inputOrOutput: '0',
    ifSingleLine: '1',
    inputType: '0',
    parameterNum,
    parameterId: '',
    defaultValue: '',
    propertyType: '1',
    pageId,
    inputName,
  }));

  return [
    ...formItems,
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '28',
        rowData: [createDefaultLaminateRow(1, '内蒙皮'), createDefaultLaminateRow(1, '外蒙皮')],
        colStr: TABLE_COL_STR,
        colData: TABLE_COL_STR.map((_, i) => ({ colName: `col${i}`, isShowCol: '1' })),
      },
      tableName: '筒壁层合板性能计算',
      inputName: '筒壁层合板性能计算',
      tableType: '1',
      tableNum: 'FS1-5-1-1K',
    },
  ];
}

export function getLaminateTableRows(list: Fs151_1_1KParameterItem[]): LaminateRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as LaminateRow[];
}

export function setLaminateTableRows(list: Fs151_1_1KParameterItem[], rows: LaminateRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function createAddRows(codeNum: number, startIndex: number): LaminateRow[] {
  return [
    { ...createDefaultLaminateRow(codeNum, '内蒙皮', true), delIndex: startIndex },
    { ...createDefaultLaminateRow(codeNum, '外蒙皮', true), delIndex: startIndex + 1 },
  ];
}
