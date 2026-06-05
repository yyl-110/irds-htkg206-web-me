export type OpeningCellMode = 'text' | 'select';

export interface OpeningAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: OpeningCellMode;
}

export const FS_1_5_1J_TABLE_COLUMNS: OpeningAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 65, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 300, align: 'left', cellMode: 'text' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 100, align: 'left', cellMode: 'text' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 120, align: 'left', cellMode: 'text' },
  { title: '与象限的夹角', dataIndex: 'p4', key: 'p4', width: 120, align: 'left', cellMode: 'text' },
  { title: '开口规格(直径)', dataIndex: 'p5', key: 'p5', width: 120, align: 'left', cellMode: 'text' },
  { title: '开口规格(接口)', dataIndex: 'p6', key: 'p6', width: 160, align: 'left', cellMode: 'text' },
  { title: '复核', dataIndex: 'p7', key: 'p7', width: 160, align: 'left', cellMode: 'select' },
];

export const FS_1_5_1J_COLUMN_MAP = new Map(
  FS_1_5_1J_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
