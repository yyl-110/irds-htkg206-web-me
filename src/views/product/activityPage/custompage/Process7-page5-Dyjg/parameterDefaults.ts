import type { DyjgParameterItem, DyjgVariantConfig } from './types';
import { TABLE_INDEX } from './types';

export type { DyjgParameterItem, DyjgVariantConfig };

const FIELD_DEFS = [
  { key: 'H', name: '柜体最大高' },
  { key: 'SRDY', name: '额定输入电压(V)' },
  { key: 'W', name: '柜体最大宽' },
  { key: 'SRDYFW', name: '输入电压范围(V)' },
  { key: 'S', name: '柜体最大深' },
  { key: 'EDSRHZ', name: '额定输入频率(Hz)' },
  { key: 'WEIGHT', name: '最大质量' },
  { key: 'EDSRHZFW', name: '输入频率范围(Hz)' },
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

export function initCustomizedProcessPage7DataDyjg(pageid: string, config: DyjgVariantConfig): DyjgParameterItem[] {
  const fields: DyjgParameterItem[] = FIELD_DEFS.map(field => ({
    inputOrOutput: '1',
    ifSingleLine: '1',
    inputType: '0',
    parameterNum: `DY1_1_10_${field.key}${config.suffix}`,
    parameterId: '',
    defaultValue: '',
    propertyType: '1',
    pageId: pageid,
    inputName: field.name,
  }));

  fields.push({
    inputType: 'table',
    ifSingleLine: 't',
    pageId: pageid,
    tableMap: {
      tableType: '1',
      colNums: '5',
      rowNums: '',
      rowData: [],
      colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
    },
    tableName: '计算输入参数',
    inputName: '计算输入参数',
    tableType: '1',
    tableNum: config.tableNum,
    colData: OUTPUT_TABLE_COL_DATA,
  });

  return fields;
}

export function cloneParameterList(source: DyjgParameterItem[]): DyjgParameterItem[] {
  return JSON.parse(JSON.stringify(source)) as DyjgParameterItem[];
}

export { TABLE_INDEX };
