import type { Page6ParameterItem, SupplyTableRow } from './models';
import { PAGE6_BASE_COL_STR } from './models';

export type { Page6ParameterItem } from './models';

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

export function initCustomizedProcessPage7Data6(pageid: string): Page6ParameterItem[] {
  const list: Page6ParameterItem[] = [
    {
      inputType: 'table',
      ifSingleLine: 't',
      pageId: pageid,
      tableMap: {
        tableType: '1',
        colNums: '10',
        rowNums: '',
        rowData: DEFAULT_TABLE_ROWS.map(row => ({ ...row })),
        colStr: [...PAGE6_BASE_COL_STR],
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
      parameterNum: 'DY1_1_5_ZDYZLMXYDL',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId: pageid,
      inputName: '总低压直流母线用电量(KWh)',
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

export function cloneParameterList(source: Page6ParameterItem[]): Page6ParameterItem[] {
  return JSON.parse(JSON.stringify(source)) as Page6ParameterItem[];
}
