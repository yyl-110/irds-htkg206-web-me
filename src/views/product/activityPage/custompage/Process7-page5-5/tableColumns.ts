import type { TableColumnType } from 'ant-design-vue';

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;
export const POSITIVE_INT_REG = /^[1-9]\d*$/;

export const VOLTAGE_CONTROL_OPTIONS = [
  { value: 1, label: '远端电阻调压' },
  { value: 2, label: '远端电压调压' },
  { value: 3, label: 'CAN通信调压' },
  { value: 4, label: '无调压' },
];

export const OUTPUT_TABLE_COLUMNS: TableColumnType[] = [
  { title: '输出路数', dataIndex: 'p0', key: 'p0', align: 'center', width: 80 },
  { title: '输出功率(W)', dataIndex: 'p1', key: 'p1', align: 'center', width: 90 },
  { title: '额定输出电压(V)', dataIndex: 'p2', key: 'p2', align: 'center', width: 100 },
  { title: '输出电压范围(V)', dataIndex: 'p3', key: 'p3', align: 'center', width: 100 },
  { title: '纹波电压范围(mV)', dataIndex: 'p4', key: 'p4', align: 'center', width: 100 },
  { title: '电压稳定度', dataIndex: 'p5', key: 'p5', align: 'center', width: 100 },
  { title: '负载稳定度', dataIndex: 'p6', key: 'p6', align: 'center', width: 100 },
  { title: '暂稳态回复时间(mS)', dataIndex: 'p7', key: 'p7', align: 'center', width: 120 },
  { title: '阶跃过冲电压(V)', dataIndex: 'p8', key: 'p8', align: 'center', width: 110 },
  { title: '调压控制方式', dataIndex: 'p9', key: 'p9', align: 'center', width: 150 },
];

export const NUMERIC_TABLE_FIELDS = ['p1', 'p2', 'p3', 'p4'] as const;
export const TEXT_TABLE_FIELDS = ['p5', 'p6', 'p7', 'p8'] as const;

export function isNumericTableField(dataIndex: unknown) {
  return NUMERIC_TABLE_FIELDS.includes(String(dataIndex) as (typeof NUMERIC_TABLE_FIELDS)[number]);
}

export function isTextTableField(dataIndex: unknown) {
  return TEXT_TABLE_FIELDS.includes(String(dataIndex) as (typeof TEXT_TABLE_FIELDS)[number]);
}

export function isSelectTableField(dataIndex: unknown) {
  return String(dataIndex) === 'p9';
}
