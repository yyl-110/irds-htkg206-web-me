export type FrameCellMode = 'text' | 'editable' | 'number';

export interface FrameAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: FrameCellMode;
}

export const OUTER_FRAME_TABLE_COLUMNS: FrameAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 300, align: 'left', cellMode: 'editable' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 220, align: 'left', cellMode: 'editable' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 100, align: 'left', cellMode: 'number' },
  { title: '外加强框外径', dataIndex: 'p4', key: 'p4', width: 100, align: 'left', cellMode: 'editable' },
];

export const INNER_FRAME_TABLE_COLUMNS: FrameAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 300, align: 'left', cellMode: 'editable' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 220, align: 'left', cellMode: 'editable' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 100, align: 'left', cellMode: 'number' },
];

export const OUTER_FRAME_COLUMN_MAP = new Map(
  OUTER_FRAME_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);

export const INNER_FRAME_COLUMN_MAP = new Map(
  INNER_FRAME_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
