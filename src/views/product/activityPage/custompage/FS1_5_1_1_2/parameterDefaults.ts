export interface OuterSkinDesignRow extends Record<string, string | number | undefined> {
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
  p13?: string;
  p14?: string;
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
  cellParameterId12?: string;
  cellParentNum12?: string;
  cellInputOrOutput12?: string;
  cellInputName12?: string;
  cellParameterId13?: string;
  cellParentNum13?: string;
  cellInputOrOutput13?: string;
  cellInputName13?: string;
  cellParameterId14?: string;
  cellParentNum14?: string;
  cellInputOrOutput14?: string;
  cellInputName14?: string;
}

export interface Fs151_1_2ParameterItem {
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
    rowData?: OuterSkinDesignRow[];
    colStr?: string[];
    colData?: Array<{ colName?: string; isShowCol?: string }>;
  };
}

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const SOURCE_TABLE_NUM = 'FS1-5-1_5';
export const DESIGN_TABLE_NUM = 'FS1-5-1-1B';
export const TEMP_MODEL_FILE = 'TEMP_FS8_075_001.prt';

export const TABLE_INDEX = 5;
export const INNER_RADIUS_INDEX = 6;

const TABLE_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14'];

export function createDefaultDesignRow(index = 1): OuterSkinDesignRow {
  return {
    p0: index,
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: '测试名称1',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: '轴向辅层材料测试名称1',
    cellParameterId2: '',
    cellParentNum2: 'FS1_5_1_1B_ZXNAME',
    cellInputOrOutput2: '1',
    cellInputName2: '轴向辅层材料名称',
    p3: '11',
    cellParameterId3: '',
    cellParentNum3: 'FS1_5_1_1B_ZXMD',
    cellInputOrOutput3: '1',
    cellInputName3: '轴向辅层材料密度(Kg/mm3)',
    p4: '环向辅层材料名称1',
    cellParameterId4: '',
    cellParentNum4: 'FS1_5_1_1B_HXNAME',
    cellInputOrOutput4: '1',
    cellInputName4: '环向辅层材料名称',
    p5: '22',
    cellParameterId5: '',
    cellParentNum5: 'FS1_5_1_1B_HXMD',
    cellInputOrOutput5: '1',
    cellInputName5: '环向辅层材料密度(Kg/mm3)',
    p6: '33',
    cellParameterId6: '',
    cellParentNum6: 'FS1_5_1_1B_ZXT',
    cellInputOrOutput6: '1',
    cellInputName6: '轴向辅层厚度',
    p7: '50',
    cellParameterId7: '',
    cellParentNum7: 'FS1_5_1_1B_HXT',
    cellInputOrOutput7: '1',
    cellInputName7: '环向辅层厚度',
    p8: '55',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_001_L1',
    cellInputOrOutput8: '1',
    cellInputName8: '与简零点距离',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_001_T',
    cellInputOrOutput9: '1',
    cellInputName9: '总厚度',
    p10: '200',
    cellParameterId10: '',
    cellParentNum10: 'FS8_075_001_L2',
    cellInputOrOutput10: '1',
    cellInputName10: '长度',
    p11: '60',
    cellParameterId11: '',
    cellParentNum11: 'FS8_075_001_D1',
    cellInputOrOutput11: '1',
    cellInputName11: '外径',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'FS1_5_1_1B_DXMD',
    cellInputOrOutput12: '1',
    cellInputName12: '等效密度(g/mm3)',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '新模型文件名',
    p14: TEMP_MODEL_FILE,
    cellParameterId14: '',
    cellParentNum14: '',
    cellInputOrOutput14: '1',
    cellInputName14: '模型文件名',
    delIndex: index - 1,
  };
}

export function createRowFromSourceRow(source: Record<string, string | number | undefined>): OuterSkinDesignRow {
  return {
    p0: source.p0 ?? '',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputOrOutput0: '1',
    cellInputName0: '序号',
    p1: source.p1 ?? '',
    cellParameterId1: '',
    cellParentNum1: '',
    cellInputOrOutput1: '1',
    cellInputName1: '名称',
    p2: '',
    cellParameterId2: '',
    cellParentNum2: 'FS1_5_1_1B_ZXNAME',
    cellInputOrOutput2: '1',
    cellInputName2: '轴向辅层材料名称',
    p3: '',
    cellParameterId3: '',
    cellParentNum3: 'FS1_5_1_1B_ZXMD',
    cellInputOrOutput3: '1',
    cellInputName3: '轴向辅层材料密度(Kg/mm3)',
    p4: '',
    cellParameterId4: '',
    cellParentNum4: 'FS1_5_1_1B_HXNAME',
    cellInputOrOutput4: '1',
    cellInputName4: '环向辅层材料名称',
    p5: '',
    cellParameterId5: '',
    cellParentNum5: 'FS1_5_1_1B_HXMD',
    cellInputOrOutput5: '1',
    cellInputName5: '环向辅层材料密度(Kg/mm3)',
    p6: '',
    cellParameterId6: '',
    cellParentNum6: 'FS1_5_1_1B_ZXT',
    cellInputOrOutput6: '1',
    cellInputName6: '轴向辅层厚度',
    p7: '',
    cellParameterId7: '',
    cellParentNum7: 'FS1_5_1_1B_HXT',
    cellInputOrOutput7: '1',
    cellInputName7: '环向辅层厚度',
    p8: source.p2 ?? '',
    cellParameterId8: '',
    cellParentNum8: 'FS8_075_001_L1',
    cellInputOrOutput8: '1',
    cellInputName8: '与简零点距离',
    p9: '',
    cellParameterId9: '',
    cellParentNum9: 'FS8_075_001_T',
    cellInputOrOutput9: '1',
    cellInputName9: '总厚度',
    p10: source.p3 ?? '',
    cellParameterId10: '',
    cellParentNum10: 'FS8_075_001_L2',
    cellInputOrOutput10: '1',
    cellInputName10: '长度',
    p11: '',
    cellParameterId11: '',
    cellParentNum11: 'FS8_075_001_D1',
    cellInputOrOutput11: '1',
    cellInputName11: '外径',
    p12: '',
    cellParameterId12: '',
    cellParentNum12: 'FS1_5_1_1B_DXMD',
    cellInputOrOutput12: '1',
    cellInputName12: '等效密度(g/mm3)',
    p13: '',
    cellParameterId13: '',
    cellParentNum13: '',
    cellInputOrOutput13: '1',
    cellInputName13: '新模型文件名',
    p14: TEMP_MODEL_FILE,
    cellParameterId14: '',
    cellParentNum14: '',
    cellInputOrOutput14: '1',
    cellInputName14: '模型文件名',
  };
}

export function createDefaultFs151_1_2ParameterList(pageId = ''): Fs151_1_2ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1G_BWCCL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '保温层材质',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1G_BWCH',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '保温层厚度',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1G_JRMWZ',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '加热膜铺放位置',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1G_JRMCC',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '加热膜材料',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'FS1_5_1G_JRMH',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '加热膜厚度',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '15',
        rowData: [createDefaultDesignRow(1)],
        colStr: TABLE_COL_STR,
        colData: [
          { colName: '序号', isShowCol: '1' },
          { colName: '名称', isShowCol: '1' },
          { colName: '轴向辅层材料名称', isShowCol: '1' },
          { colName: '轴向辅层材料密度(Kg/mm3)', isShowCol: '1' },
          { colName: '环向辅层材料名称', isShowCol: '1' },
          { colName: '环向辅层材料密度(Kg/mm3)', isShowCol: '1' },
          { colName: '轴向辅层厚度', isShowCol: '1' },
          { colName: '环向辅层厚度', isShowCol: '1' },
          { colName: '与简零点距离', isShowCol: '1' },
          { colName: '总厚度', isShowCol: '1' },
          { colName: '长度', isShowCol: '1' },
          { colName: '外径', isShowCol: '1' },
          { colName: '等效密度(g/mm3)', isShowCol: '1' },
          { colName: '新模型文件名', isShowCol: '1' },
          { colName: '模型文件名', isShowCol: '1' },
        ],
      },
      tableName: '外蒙皮加强段设计',
      inputName: '外蒙皮加强段设计',
      tableType: '1',
      tableNum: DESIGN_TABLE_NUM,
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
      inputName: '外蒙皮内径(mm)',
    },
  ];
}

export function getDesignTableRows(list: Fs151_1_2ParameterItem[]): OuterSkinDesignRow[] {
  return (list[TABLE_INDEX]?.tableMap?.rowData ?? []) as OuterSkinDesignRow[];
}

export function setDesignTableRows(list: Fs151_1_2ParameterItem[], rows: OuterSkinDesignRow[]) {
  if (!list[TABLE_INDEX]?.tableMap) return;
  list[TABLE_INDEX].tableMap!.rowData = rows;
  list[TABLE_INDEX].tableMap!.rowNums = rows.length;
  list[TABLE_INDEX].tableMap!.colStr = TABLE_COL_STR;
}
