export interface MaterialSettingRow extends Record<string, string | number | undefined> {
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
  delIndex?: number;
  id?: string | number;
  [key: `cellParameterId${number}`]: string | undefined;
  [key: `cellParentNum${number}`]: string | undefined;
  [key: `cellInputOrOutput${number}`]: string | undefined;
  [key: `cellInputName${number}`]: string | undefined;
}

export interface Fs151_1GParameterItem {
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
    rowData?: MaterialSettingRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const TABLE_INDEX = 0;
export const TABLE_NUM = 'FS1-5-1-1G';
export const SOURCE_TABLE_NUMS = ['FS1-5-1-1F', 'FS1-5-1-1F1'];
export const MATERIAL_CATEGORY_ID = '462';

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'];

export function createDefaultMaterialRow(index = 1): MaterialSettingRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '0',
    cellInputName0: '序号',
    p1: '',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '0',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: '',
    cellInputOrOutput2: '0',
    cellInputName2: '材料名称',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: '',
    cellInputOrOutput3: '0',
    cellInputName3: '沿纤维方向的弹性模量EL(GPa)',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: '',
    cellInputOrOutput4: '0',
    cellInputName4: '垂直于纤维方向的弹性模量ET(GPa)',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: '',
    cellInputOrOutput5: '0',
    cellInputName5: '单向板纵向泊松比VLT',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: '',
    cellInputOrOutput6: '0',
    cellInputName6: '单向板纵横剪切弹性模量GLT(GPa)',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: '',
    cellInputOrOutput7: '0',
    cellInputName7: '沿纤维方向的拉伸强度XL(MPa)',
    p8: '',
    cellParameterId8: '',
    cellParentNum8: '',
    cellInputOrOutput8: '0',
    cellInputName8: '密度(g/cm3)',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: '',
    cellInputOrOutput9: '0',
    cellInputName9: '知识',
    delIndex: index - 1,
  };
}

export function createMaterialRowFromSource(
  item: Record<string, string | number | undefined>,
  index: number,
): MaterialSettingRow {
  return {
    ...createDefaultMaterialRow(index),
    p0: index,
    p1: String(item.p1 ?? ''),
  };
}

export function createDefaultFs151_1GParameterList(pageId = ''): Fs151_1GParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '12',
        rowData: [createDefaultMaterialRow(1)],
        colStr: TABLE_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '材料名称', isShowCol: '1' },
          { colName: '沿纤维方向的弹性模量EL(GPa)', isShowCol: '1' },
          { colName: '垂直于纤维方向的弹性模量ET(GPa)', isShowCol: '1' },
          { colName: '单向板纵向泊松比VLT', isShowCol: '1' },
          { colName: '单向板纵横剪切弹性模量GLT(GPa)', isShowCol: '1' },
          { colName: '沿纤维方向的拉伸强度XL(MPa)', isShowCol: '1' },
          { colName: '密度(g/cm3)', isShowCol: '1' },
          { colName: '知识', isShowCol: '1' },
        ],
      },
      tableName: '加强框材料设置',
      inputName: '',
      tableType: '2',
      tableNum: TABLE_NUM,
    },
  ];
}

export function getMaterialTableRows(list: Fs151_1GParameterItem[]): MaterialSettingRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as MaterialSettingRow[];
}

export function setMaterialTableRows(list: Fs151_1GParameterItem[], rows: MaterialSettingRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}

export function deleteSelectedMaterialRows(rows: MaterialSettingRow[], selected: MaterialSettingRow[]): MaterialSettingRow[] {
  const remaining = rows.filter(row => !selected.some(sel => sel.p0 === row.p0));
  return remaining.map((row, i) => ({ ...row, p0: i + 1 }));
}

export interface MaterialPropertyItem {
  name?: string;
  val?: string;
}

const MATERIAL_FIELD_MAP: Record<string, keyof MaterialSettingRow> = {
  材料名称: 'p2',
  '沿纤维方向的弹性模量EL(GPa)': 'p3',
  '垂直于纤维方向的弹性模量ET(GPa)': 'p4',
  '单向板纵向泊松比VLT': 'p5',
  '单向板纵向泊松比vLT': 'p5',
  '单向板纵横剪切弹性模量GLT(GPa)': 'p6',
  '沿纤维方向的拉伸强度XL(MPa)': 'p7',
  '密度(g/cm3)': 'p8',
  知识: 'p9',
};

export function applyMaterialProperties(list: Fs151_1GParameterItem[], properties: MaterialPropertyItem[]) {
  const rows = getMaterialTableRows(list);
  rows.forEach(row => {
    properties.forEach(prop => {
      const field = MATERIAL_FIELD_MAP[String(prop.name ?? '')];
      if (field) {
        row[field] = String(prop.val ?? '');
      }
    });
  });
  setMaterialTableRows(list, rows);
}
