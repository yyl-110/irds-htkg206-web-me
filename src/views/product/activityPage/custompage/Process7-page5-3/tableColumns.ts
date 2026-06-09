import type { TableColumnType } from 'ant-design-vue';

export const ASSEMBLY_TABLE_COLUMNS: TableColumnType[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', align: 'center', width: 60 },
  { title: '类别', dataIndex: 'p1', key: 'p1', align: 'center', width: 80 },
  { title: '模型文件名', dataIndex: 'p2', key: 'p2', align: 'center', width: 140 },
  { title: '模型类型', dataIndex: 'p15', key: 'p15', align: 'center', width: 140 },
  { title: '插箱名称', dataIndex: 'p3', key: 'p3', align: 'center', width: 130 },
  { title: '高度（U）', dataIndex: 'p4', key: 'p4', align: 'center', width: 80 },
  { title: '深度', dataIndex: 'p5', key: 'p5', align: 'center', width: 80 },
  { title: '宽度', dataIndex: 'p6', key: 'p6', align: 'center', width: 80 },
  { title: '把手长', dataIndex: 'p9', key: 'p9', align: 'center', width: 80 },
  { title: '定位套间距', dataIndex: 'p10', key: 'p10', align: 'center', width: 100 },
  { title: '输入电压V', dataIndex: 'p11', key: 'p11', align: 'center', width: 90 },
  { title: '输出电压V', dataIndex: 'p12', key: 'p12', align: 'center', width: 90 },
  { title: '输出电流A', dataIndex: 'p13', key: 'p13', align: 'center', width: 90 },
  { title: '新模型文件名', dataIndex: 'p7', key: 'p7', align: 'center', width: 150 },
  { title: '参数化模型', dataIndex: 'p8', key: 'p8', align: 'center', width: 120 },
  { title: '备注', dataIndex: 'p14', key: 'p14', align: 'center', width: 80 },
];

export const ASSEMBLY_TABLE_MIN_WIDTH = ASSEMBLY_TABLE_COLUMNS.reduce((sum, column) => sum + Number(column.width ?? 0), 0);

export const INPUT_EDITABLE_FIELDS = ['p9', 'p10', 'p7'] as const;

export function formatCategoryLabel(p1: unknown) {
  if (p1 === '1' || p1 === 1 || p1 === '浏览') return '浏览';
  return '输入';
}

export function isInputEditableField(dataIndex: unknown) {
  return INPUT_EDITABLE_FIELDS.includes(String(dataIndex) as (typeof INPUT_EDITABLE_FIELDS)[number]);
}
