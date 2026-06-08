import type { TableColumnType } from 'ant-design-vue';

export const PRODUCT_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 95 },
  { title: '名称', dataIndex: 'p1', key: 'p1', align: 'center', width: 350 },
  { title: '备注', dataIndex: 'p2', key: 'p2', align: 'center', width: 200 },
];
