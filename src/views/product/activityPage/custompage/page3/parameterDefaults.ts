export interface Page3TableRow extends Record<string, string | number | undefined> {
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
  p10?: string;
  p11?: string;
  p12?: string;
  p13?: string;
  p14?: string;
  p15?: string;
  p16?: string;
  p17?: string;
  p18?: string;
}

export interface Page3ParameterItem {
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
  tableMap?: {
    tableType?: string;
    colNums?: string | number;
    rowData?: Page3TableRow[];
    colStr?: string[];
    rowNums?: number;
  };
}

export const PAGE3_TABLE_NUM = 'DJ3_T_INITTOTALJSB';

/** 初始总减速比表 componentId（customizedProcess-page3 专用） */
export const PAGE3_TABLE_COMPONENT_ID = 17;
/** 初始总减速比表 componentId（customizedProcess-page3-1 专用） */
export const PAGE3_1_TABLE_COMPONENT_ID = 18;

const PAGE3_COL_STR = [
  'p0',
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
  'p9',
  'p10',
  'p11',
  'p12',
  'p13',
  'p14',
  'p15',
  'p16',
  'p17',
  'p18',
];

export function createDefaultPage3Row(): Page3TableRow {
  const row: Page3TableRow = { p0: '' };
  for (let i = 0; i < 19; i++) {
    row[`p${i}`] = '';
    row[`cellParameterId${i}`] = '';
    row[`cellInputOrOutput${i}`] = '1';
  }
  const names = [
    '电机编号(序号)',
    '电机空载转速',
    '电机额定转速',
    '电机额定转矩',
    '电机最大输出转矩',
    '传动效率',
    '舟它最大空载转速',
    '舟它最大输出力矩',
    '舟它额定输出力矩',
    '标准单位空载转速',
    '标准单位额定转速',
    '负载刚度',
    '电机最大功率时转矩',
    '电机最大功率时转速',
    '电机理论最大功率',
    '最大力矩要求最小减速比',
    '额定工况减速比',
    '最大速度要求最大减速比',
    '总减速比',
  ];
  const parents = [
    'DJ1_1_DJXH',
    'DJ1_1_DJKZZS',
    'DJ1_1_DJEDZS',
    'DJ1_1_DJEDZJ',
    'DJ1_1_DJSRLJ_MAX',
    'DJ2_3_CDXL',
    'DJ2_3_ZDKZZS',
    'DJ2_3_ZDSCLJ',
    'DJ2_3_EDSCLJ',
    'DJ2_3_JSZ_01',
    'DJ2_3_JSZ_02',
    'DJ2_3_JSZ_03',
    'DJ2_3_JSZ_04',
    'DJ2_3_JSZ_05',
    'DJ2_3_JSZ_06',
    'DJ2_3_JSZ_07',
    'DJ2_3_JSZ_08',
    'DJ2_3_JSZ_09',
    'DJ2_3_CSZJSB',
  ];
  names.forEach((name, i) => {
    row[`cellInputName${i}`] = name;
    row[`cellParentNum${i}`] = parents[i];
  });
  return row;
}

export function createDefaultPage3ParameterList(pageId = ''): Page3ParameterItem[] {
  return [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId,
      tableMap: {
        tableType: '2',
        colNums: '19',
        rowData: [createDefaultPage3Row()],
        colStr: PAGE3_COL_STR,
      },
      tableName: '初始总减速比计算',
      inputName: '',
      tableType: '2',
      tableNum: PAGE3_TABLE_NUM,
      componentId: PAGE3_TABLE_COMPONENT_ID,
    },
  ];
}

export function applyPage3_1TableComponentId(list: Page3ParameterItem[]): Page3ParameterItem[] {
  return list.map(item => {
    const tableNum = String(item.tableNum ?? '').trim();
    if (tableNum === PAGE3_TABLE_NUM) {
      return { ...item, componentId: PAGE3_1_TABLE_COMPONENT_ID };
    }
    return item;
  });
}
