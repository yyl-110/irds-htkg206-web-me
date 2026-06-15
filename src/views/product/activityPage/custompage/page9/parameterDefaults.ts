import type { Page8TableRow } from '../page8/parameterDefaults';

export type Page9SchemeRow = Page8TableRow;

export interface Page9GearRow extends Record<string, string | number | undefined> {
  p0?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
}

export interface Page9ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  tableNum?: string;
  componentId?: string | number;
  id?: string | number;
  userid?: string;
  userId?: string;
  addthis?: string;
  treeKey?: string | number;
  propertyType?: string;
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Page9SchemeRow[] | Page9GearRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE9_INPUT_TABLE_NUM = 'DJ9_T_INPUTPARAMS';
export const PAGE9_GEAR_TABLE_NUM = 'DJ9_T_GEARINTERFORCECAL';
export const PAGE9_LOAD_COEFF_PARAM = 'DJ2_10_ZHXS';

/** 计算输入参数表 componentId（customizedProcess-page9 专用） */
export const PAGE9_INPUT_TABLE_COMPONENT_ID = 24;
/** 齿轮应力展示表 componentId（customizedProcess-page9 专用） */
export const PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID = 25;
/** 按方案齿轮应力表 componentId 起始值（+ 方案索引） */
export const PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE = 26;

const SCHEME_COL_STR = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
  'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20',
];

const GEAR_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];

export function createDefaultGearStressRow(
  name: string,
  loadCoeff: string,
  overrides?: Partial<Page9GearRow>,
): Page9GearRow {
  return {
    p0: name,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: loadCoeff,
    p9: '',
    ...overrides,
  };
}

export function createDefaultGearStressRows(loadCoeff = '1.2'): Page9GearRow[] {
  const firstRowMeta: Partial<Page9GearRow> = {
    cellInputOrOutput0: '0',
    cellParameterId0: '',
    cellParentNum0: '',
    cellInputName0: '齿轮',
    cellInputOrOutput1: '0',
    cellParameterId1: '',
    cellParentNum1: 'DJ2_10_CLNJ',
    cellInputName1: '齿轮扭矩',
    cellInputOrOutput2: '0',
    cellParameterId2: '',
    cellParentNum2: 'DJ2_10_CLMS',
    cellInputName2: '齿轮模数',
    cellInputOrOutput3: '0',
    cellParameterId3: '',
    cellParentNum3: 'DJ2_10_CLCS',
    cellInputName3: '齿轮齿数',
    cellInputOrOutput4: '0',
    cellParameterId4: '',
    cellParentNum4: 'DJ2_10_CK',
    cellInputName4: '齿宽',
    cellInputOrOutput5: '0',
    cellParameterId5: '',
    cellParentNum5: 'DJ2_10_CXXS',
    cellInputName5: '齿形系数',
    cellInputOrOutput6: '0',
    cellParameterId6: '',
    cellParentNum6: 'DJ2_10_CXXZXS',
    cellInputName6: '齿形修正系数',
    cellInputOrOutput7: '0',
    cellParameterId7: '',
    cellParentNum7: 'DJ2_10_QXL',
    cellInputName7: '切向力',
    cellInputOrOutput8: '0',
    cellParameterId8: '',
    cellParentNum8: 'DJ2_10_ZHXS',
    cellInputName8: '载荷系数',
    cellInputOrOutput9: '0',
    cellParameterId9: '',
    cellParentNum9: 'DJ2_10_CGWQYL',
    cellInputName9: '齿根弯曲应力',
  };

  return [
    createDefaultGearStressRow('电机齿轮', loadCoeff, firstRowMeta),
    createDefaultGearStressRow('第一级从动轮', loadCoeff),
    createDefaultGearStressRow('第二级主动轮', loadCoeff),
    createDefaultGearStressRow('第二级从动轮', loadCoeff),
    createDefaultGearStressRow('第三级主动轮', loadCoeff),
    createDefaultGearStressRow('第三级从动轮', loadCoeff),
  ];
}

export function createDefaultSchemeRow(overrides?: Partial<Page9SchemeRow>): Page9SchemeRow {
  return {
    p0: '组合方案1',
    p1: '',
    p2: '',
    p3: '',
    p4: '21',
    p5: '54',
    p6: '18',
    p7: '40',
    p8: '18',
    p9: '40',
    p10: '98.63',
    p11: '2',
    p12: 'tab1002',
    p13: '20000',
    p14: '14000',
    p15: '1.4',
    p16: '0.5',
    p17: 'a1086',
    p18: '',
    p19: '',
    p20: '',
    ...overrides,
  };
}

export function ensurePage9TableComponentIds(list: Page9ParameterItem[]): Page9ParameterItem[] {
  return list.map(item => {
    if (item.ifSingleLine !== 't') return item;
    const rawId = String(item.componentId ?? '').trim();
    if (rawId) return item;

    const tableNum = String(item.tableNum ?? '').trim();
    if (tableNum === PAGE9_INPUT_TABLE_NUM) {
      return { ...item, componentId: PAGE9_INPUT_TABLE_COMPONENT_ID };
    }
    if (tableNum === PAGE9_GEAR_TABLE_NUM) {
      return { ...item, componentId: PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID };
    }
    const schemeMatch = tableNum.match(new RegExp(`^${PAGE9_GEAR_TABLE_NUM}(\\d+)$`));
    if (schemeMatch) {
      const idx = Number(schemeMatch[1]);
      if (!Number.isNaN(idx)) {
        return { ...item, componentId: PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE + idx };
      }
    }
    return item;
  });
}

export function createDefaultPage9ParameterList(pageId = ''): Page9ParameterItem[] {
  const loadCoeff = '1.2';
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '21',
        rowNums: 1,
        rowData: [createDefaultSchemeRow()],
        colStr: SCHEME_COL_STR,
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: PAGE9_INPUT_TABLE_NUM,
      componentId: PAGE9_INPUT_TABLE_COMPONENT_ID,
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: PAGE9_LOAD_COEFF_PARAM,
      parameterId: '',
      defaultValue: loadCoeff,
      propertyType: '1',
      pageId,
      inputName: '载荷系数',
    },
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '1',
        colNums: '9',
        rowNums: 6,
        rowData: createDefaultGearStressRows(loadCoeff),
        colStr: GEAR_COL_STR,
      },
      tableName: '齿轮应力计算',
      inputName: '齿轮应力计算',
      tableType: '1',
      tableNum: PAGE9_GEAR_TABLE_NUM,
      componentId: PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID,
    },
  ];
}

export function gearTableNumForIndex(index: number) {
  return `${PAGE9_GEAR_TABLE_NUM}${index}`;
}
