import type { TableColumnType } from 'ant-design-vue';

export const TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 60 },
  { title: '类别', dataIndex: 'p1', key: 'p1', align: 'center', width: 95 },
  { title: '模型文件名', dataIndex: 'p2', key: 'p2', align: 'center', width: 160 },
  { title: '模型类型', dataIndex: 'p12', key: 'p12', align: 'center', width: 160 },
  { title: '插箱名称', dataIndex: 'p3', key: 'p3', align: 'center', width: 180 },
  { title: '高度（U）', dataIndex: 'p4', key: 'p4', align: 'center', width: 120 },
  { title: '深度', dataIndex: 'p5', key: 'p5', align: 'center', width: 120 },
  { title: '宽度', dataIndex: 'p6', key: 'p6', align: 'center', width: 120 },
  { title: '输入电压V', dataIndex: 'p7', key: 'p7', align: 'center', width: 120 },
  { title: '输出电压V', dataIndex: 'p8', key: 'p8', align: 'center', width: 120 },
  { title: '输出电流A', dataIndex: 'p9', key: 'p9', align: 'center', width: 120 },
  { title: '备注', dataIndex: 'p10', key: 'p10', align: 'center', width: 180 },
];

export const TABLE_MIN_WIDTH = TABLE_COLUMNS.reduce(
  (sum, col) => sum + (typeof col.width === 'number' ? col.width : 100),
  0,
);

export const TYPE_OPTIONS = [
  { value: 1, label: '浏览' },
  { value: 2, label: '输入' },
];
