import type { TableColumnType } from 'ant-design-vue';

export const STANDARD_CABINET_COLUMNS: TableColumnType[] = [
  { title: '模型文件名', dataIndex: 'p0', key: 'p0', align: 'center', width: 95 },
  { title: '模型名称', dataIndex: 'p1', key: 'p1', align: 'center', width: 95 },
  { title: '机柜类型', dataIndex: 'p2', key: 'p2', align: 'center', width: 95 },
  { title: '柜体高h', dataIndex: 'p3', key: 'p3', align: 'center', width: 90 },
  { title: '柜体高度(U)', dataIndex: 'p4', key: 'p4', align: 'center', width: 90 },
  { title: '下框高h1', dataIndex: 'p5', key: 'p5', align: 'center', width: 90 },
  { title: '上框高h2', dataIndex: 'p6', key: 'p6', align: 'center', width: 90 },
  { title: '柜体深', dataIndex: 'p7', key: 'p7', align: 'center', width: 90 },
  { title: '柜体宽', dataIndex: 'p8', key: 'p8', align: 'center', width: 90 },
  { title: '内腔高', dataIndex: 'p9', key: 'p9', align: 'center', width: 90 },
];

export const COMPOSITE_SIZE_COLUMNS: TableColumnType[] = [
  { title: '机柜类型', dataIndex: 'p0', key: 'p0', align: 'center', width: 95 },
  { title: '柜体高h', dataIndex: 'p1', key: 'p1', align: 'center', width: 120 },
  { title: '柜体高度(U)', dataIndex: 'p2', key: 'p2', align: 'center', width: 120 },
  { title: '下框高h1', dataIndex: 'p3', key: 'p3', align: 'center', width: 120 },
  { title: '上框高h2', dataIndex: 'p4', key: 'p4', align: 'center', width: 120 },
  { title: '柜体深', dataIndex: 'p5', key: 'p5', align: 'center', width: 120 },
  { title: '柜体宽', dataIndex: 'p6', key: 'p6', align: 'center', width: 120 },
];

export const COMPOSITE_COMPARE_FIELDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

export const STANDARD_CABINET_MIN_WIDTH = STANDARD_CABINET_COLUMNS.reduce(
  (sum, column) => sum + Number(column.width ?? 0),
  0,
);

export const COMPOSITE_SIZE_MIN_WIDTH = COMPOSITE_SIZE_COLUMNS.reduce(
  (sum, column) => sum + Number(column.width ?? 0),
  0,
);
