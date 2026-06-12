import type { CustomPageParameterItem } from '../_shared/utils/taskParamMapMerge';

export type Page3_1TableRow = Record<string, string>;

export interface Page3_1ParameterItem extends CustomPageParameterItem {
  inputOrOutput?: string;
  inputType?: string;
  pageId?: string;
  inputName?: string;
  tableName?: string;
  tableType?: string;
  id?: string | number;
  tableMap?: CustomPageParameterItem['tableMap'] & {
    tableType?: string;
    rowNums?: number;
    rowData?: Page3_1TableRow[];
  };
}

export const PAGE3_1_TABLE_NUM = 'DJ3_T_INITXN';

/** 初始性能计算表 componentId（customizedProcess-page3-1 专用） */
export const PAGE3_1_TABLE_COMPONENT_ID = 18;

const PAGE3_1_COL_STR = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15'];

const CELL_NAMES = [
  '电机编号（序号）',
  '电机空载转速',
  '电机额定转速',
  '电机额定转矩',
  '电机最大输出转矩',
  '传动效率',
  '总减速比',
  '舟它额定负载',
  '标准单位空载转速',
  '标准单位额定转速',
  '负载刚度',
  '舟它额定负载时电机转矩',
  '舟它额定负载时电机转速',
  '最大输出力矩',
  '最大空载转速',
  '额定转速',
];

const CELL_PARENTS = [
  'DJ1_1_DJXH',
  'DJ1_1_DJKZZS',
  'DJ1_1_DJEDZS',
  'DJ1_1_DJEDZJ',
  'DJ1_1_DJSRLJ_MAX',
  'DJ2_0_CDXL',
  'DJ2_3_CSZJSB',
  'DJ2_4_DJEDFZ',
  'DJ2_4_JSZ_01',
  'DJ2_4_JSZ_02',
  'DJ2_4_JSZ_03',
  'DJ2_4_JSZ_04',
  'DJ2_4_JSZ_05',
  'DJ2_4_SCLJ_MAX',
  'DJ2_4_KZZS_MAX',
  'DJ2_4_EDZS',
];

export function createDefaultPage3_1Row(): Page3_1TableRow {
  const row: Page3_1TableRow = {};
  for (let i = 0; i < 16; i++) {
    row[`p${i}`] = '';
    row[`cellParameterId${i}`] = '';
    row[`cellParentNum${i}`] = CELL_PARENTS[i];
    row[`cellInputOrOutput${i}`] = '1';
    row[`cellInputName${i}`] = CELL_NAMES[i];
  }
  return row;
}

export function createDefaultPage3_1ParameterList(pageId = ''): Page3_1ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '16',
        rowData: [createDefaultPage3_1Row()],
        colStr: PAGE3_1_COL_STR,
      },
      tableName: '初始性能计算',
      inputName: '初始性能计算',
      tableType: '2',
      tableNum: PAGE3_1_TABLE_NUM,
      componentId: PAGE3_1_TABLE_COMPONENT_ID,
    },
  ];
}

export function applyPage3_1TableComponentId(list: Page3_1ParameterItem[]): Page3_1ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (tableNum === PAGE3_1_TABLE_NUM) {
      return { ...item, componentId: PAGE3_1_TABLE_COMPONENT_ID };
    }
    return item;
  });
}
