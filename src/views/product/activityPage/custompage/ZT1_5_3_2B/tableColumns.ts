export type PowerBranchCellMode = 'text' | 'editable' | 'select';

export interface PowerBranchAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: PowerBranchCellMode;
}

export const ZT1_5_3_2B_TABLE_COLUMNS: PowerBranchAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'center', cellMode: 'text' },
  { title: '供电类型', dataIndex: 'p1', key: 'p1', width: 120, align: 'center', cellMode: 'select' },
  { title: '供电支路', dataIndex: 'p2', key: 'p2', width: 120, align: 'center', cellMode: 'text' },
  { title: '用电设备', dataIndex: 'p3', key: 'p3', width: 120, align: 'center', cellMode: 'editable' },
  { title: '功率', dataIndex: 'p4', key: 'p4', width: 120, align: 'center', cellMode: 'editable' },
  { title: '供电接口', dataIndex: 'p5', key: 'p5', width: 120, align: 'center', cellMode: 'editable' },
  { title: '备注', dataIndex: 'p6', key: 'p6', align: 'center', cellMode: 'editable' },
];

export const ZT1_5_3_2B_COLUMN_MAP = new Map(
  ZT1_5_3_2B_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
