import type { Page6_1ParameterItem, SupplyTableRow } from './models';

export type { Page6_1ParameterItem } from './models';

const DEFAULT_TABLE_ROWS: SupplyTableRow[] = [
  { p0: '低压直流', p1: '第1支路', p2: '供电分支1', p3: 'P1-1', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '低压直流', p1: '第1支路', p2: '供电分支2', p3: 'P1-2', p4: '600', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '低压直流', p1: '第1支路', p2: '供电分支3', p3: 'P1-3', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '低压直流', p1: '第2支路', p2: '供电分支1', p3: 'P1-1', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '低压直流', p1: '第2支路', p2: '供电分支2', p3: 'P1-2', p4: '600', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '低压直流', p1: '第2支路', p2: '供电分支3', p3: 'P1-3', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '高压', p1: '第1支路', p2: '供电分支1', p3: 'P1-3', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '高压', p1: '第2支路', p2: '供电分支1', p3: 'P1-3', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '交流', p1: '第1支路', p2: '供电分支3', p3: 'P1-3', p4: '500', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
  { p0: '交流', p1: '第2支路', p2: '供电分支3', p3: 'P1-3', p4: '600', p5: '28', p6: '', p7: '28+-4', p8: '5', p9: '6' },
];

const TABLE_COL_DATA = [
  { colName: '供电种类', isShowCol: '1' },
  { colName: '供电支路', isShowCol: '1' },
  { colName: '功率（W）', isShowCol: '1' },
  { colName: '低压DC/DC组合效率', isShowCol: '1' },
  { colName: 'AC/DC组合效率', isShowCol: '1' },
  { colName: '额定输出电压（V）', isShowCol: '1' },
  { colName: '用电设备', isShowCol: '1' },
  { colName: '电压范围', isShowCol: '1' },
  { colName: '低压DC/DC组合效率', isShowCol: '1' },
];

export function initCustomizedProcessPage7Data6_1(pageid: string): Page6_1ParameterItem[] {
  const list: Page6_1ParameterItem[] = [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '1',
        colNums: '9',
        rowNums: '',
        rowData: DEFAULT_TABLE_ROWS.map(row => ({ ...row })),
        colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
      },
      tableName: '计算输入参数',
      inputName: '计算输入参数',
      tableType: '1',
      tableNum: 'DY1-1-9_T_SRCS',
      colData: TABLE_COL_DATA,
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_1_5_ZYDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总用电量(KWh)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_1_5_ZJLYDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总交流用电量(KWh)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_1_5_ZDYZLYDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总低压直流用电量(KWh)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_1_5_ZJLSRYDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总交流输入用电量(KWh)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DY1_1_5_ZGYZLMXDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总高压直流母线用电量(KWH)',
    },
  ];

  for (let i = 1; i < 11; i++) {
    list.push({
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: `DY1_1_5_${i}YDL`,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: `流程${i}用电量`,
    });
    list.push({
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: `DY1_1_5_${i}GLH`,
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: `流程${i}功率和`,
    });
  }

  return list;
}

export function cloneParameterList(source: Page6_1ParameterItem[]): Page6_1ParameterItem[] {
  return JSON.parse(JSON.stringify(source)) as Page6_1ParameterItem[];
}
