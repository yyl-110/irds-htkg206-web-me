import type { OutputTableRow, Page5_5ParameterItem } from './types';

export type { CabinetSectionConfig, OutputTableRow, Page5_5ParameterItem } from './types';
export { CABINET_SECTIONS, HIGH_VOLTAGE_SUPPLY_TYPES, LOW_VOLTAGE_AC_SUPPLY_TYPE } from './cabinetConfig';

const CABINET_FIELD_DEFS = [
  { key: 'H', name: '柜体最大高' },
  { key: 'SRDY', name: '额定输入电压' },
  { key: 'W', name: '柜体最大宽' },
  { key: 'SRDYFW', name: '输入电压范围' },
  { key: 'S', name: '柜体最大深' },
  { key: 'EDSRHZ', name: '额定输入频率(Hz)' },
  { key: 'WEIGHT', name: '最大质量' },
  { key: 'EDSRHZFW', name: '额定输入频率范围(Hz)' },
  { key: 'GYZLMXDYFW', name: '高压直流母线电压范围(V)' },
  { key: 'DYZLMXDYFW', name: '低压直流母线电压范围(V)' },
  { key: 'DQJK', name: '电气接口' },
  { key: 'DQJKWJ', name: '电气接口文件' },
  { key: 'HJSYXYQ', name: '环境适应性要求' },
  { key: 'HJSYXYQWJ', name: '环境适应性要求文件' },
  { key: 'SCLS', name: '输出路数' },
] as const;

const OUTPUT_TABLE_COL_DATA = [
  { colName: '输出路数', isShowCol: '1' },
  { colName: '输出功率(W)', isShowCol: '1' },
  { colName: '额定输出电压(V)', isShowCol: '1' },
  { colName: '输出电压范围(V)', isShowCol: '1' },
  { colName: '纹波电压范围(mV)', isShowCol: '1' },
  { colName: '电压稳定度', isShowCol: '1' },
  { colName: '负载稳定度', isShowCol: '1' },
  { colName: '暂稳态回复时间(mS)', isShowCol: '1' },
  { colName: '阶跃过冲电压(V)', isShowCol: '1' },
  { colName: '调压控制方式:', isShowCol: '1' },
];

function createCabinetParams(pageid: string, suffix: string): Page5_5ParameterItem[] {
  return CABINET_FIELD_DEFS.map(field => ({
    inputOrOutput: '0',
    ifSingleLine: '1',
    inputType: '0',
    parameterNum: `DY1_1_10_${field.key}${suffix}`,
    parameterId: '',
    defaultValue: '',
    propertyType: '1',
    pageId: pageid,
    inputName: field.name,
  }));
}

function createOutputTable(pageid: string, tableNum: string, rowData: OutputTableRow[]): Page5_5ParameterItem {
  return {
    inputType: 'table',
    ifSingleLine: 't',
    pageId: pageid,
    tableMap: {
      tableType: '1',
      colNums: '5',
      rowNums: '',
      rowData,
      colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
    },
    tableName: '计算输入参数',
    inputName: '计算输入参数',
    tableType: '1',
    tableNum,
    colData: OUTPUT_TABLE_COL_DATA,
  };
}

export function initCustomizedProcessPage7Data5_5(pageid: string): Page5_5ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_GPDTZ',
      parameterId: '',
      defaultValue: '交流输入、交流母线',
      propertyType: '1',
      pageId: pageid,
      inputName: '供配电体质确定',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_10_NUM',
      parameterId: '',
      defaultValue: '1',
      propertyType: '1',
      selectStr: [{ label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }],
      selectStrVal: [{ label: '1' }, { label: '2' }, { label: '3' }, { label: '4' }],
      pageId: pageid,
      inputName: '电源机柜数量',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_10_DYJG_1',
      parameterId: '',
      defaultValue: '有',
      propertyType: '1',
      pageId: pageid,
      inputName: '电源机柜1',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_10_DYJG_2',
      parameterId: '',
      defaultValue: '无',
      propertyType: '1',
      pageId: pageid,
      inputName: '电源机柜2',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_10_DYJG_3',
      parameterId: '',
      defaultValue: '无',
      propertyType: '1',
      pageId: pageid,
      inputName: '电源机柜3',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_10_DYJG_4',
      parameterId: '',
      defaultValue: '无',
      propertyType: '1',
      pageId: pageid,
      inputName: '电源机柜4',
    },
    ...createCabinetParams(pageid, ''),
    ...createCabinetParams(pageid, '_2'),
    ...createCabinetParams(pageid, '_3'),
    ...createCabinetParams(pageid, '_4'),
    createOutputTable(pageid, 'DY1_1_10_SRTABLE_Dyjg1', []),
    createOutputTable(pageid, 'DY1_1_10_SRTABLE_Dyjg2', []),
    createOutputTable(pageid, 'DY1_1_10_SRTABLE_Dyjg3', []),
    createOutputTable(pageid, 'DY1_1_10_SRTABLE_Dyjg4', []),
  ];
}

export function cloneParameterList(source: Page5_5ParameterItem[]): Page5_5ParameterItem[] {
  return JSON.parse(JSON.stringify(source)) as Page5_5ParameterItem[];
}
