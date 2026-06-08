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
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 130, align: 'left', cellMode: 'text' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 130, align: 'left', cellMode: 'text' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 100, align: 'left', cellMode: 'text' },
  { title: '外加强框宽', dataIndex: 'p4', key: 'p4', width: 90, align: 'left', cellMode: 'editable' },
  { title: '两侧过度区高度', dataIndex: 'p5', key: 'p5', width: 100, align: 'left', cellMode: 'number' },
  { title: '两侧过度区宽度', dataIndex: 'p6', key: 'p6', width: 100, align: 'left', cellMode: 'number' },
  { title: '外加强框外径', dataIndex: 'p7', key: 'p7', width: 100, align: 'left', cellMode: 'number' },
  { title: '外加强框内径', dataIndex: 'p8', key: 'p8', width: 100, align: 'left', cellMode: 'number' },
  { title: '两侧过度区倒圈角', dataIndex: 'p9', key: 'p9', width: 100, align: 'left', cellMode: 'number' },
  { title: '新文件名', dataIndex: 'p10', key: 'p10', width: 120, align: 'left', cellMode: 'editable' },
  { title: '模型文件名', dataIndex: 'p11', key: 'p11', width: 150, align: 'left', cellMode: 'text' },
];

export const INNER_FRAME_TABLE_COLUMNS: FrameAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 130, align: 'left', cellMode: 'text' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 130, align: 'left', cellMode: 'text' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 100, align: 'left', cellMode: 'text' },
  { title: '内加强框宽', dataIndex: 'p4', key: 'p4', width: 90, align: 'left', cellMode: 'editable' },
  { title: '两侧过度区高度', dataIndex: 'p5', key: 'p5', width: 100, align: 'left', cellMode: 'number' },
  { title: '两侧过度区宽度', dataIndex: 'p6', key: 'p6', width: 100, align: 'left', cellMode: 'number' },
  { title: '内加强框外径', dataIndex: 'p7', key: 'p7', width: 100, align: 'left', cellMode: 'number' },
  { title: '内加强框内径', dataIndex: 'p8', key: 'p8', width: 100, align: 'left', cellMode: 'number' },
  { title: '两侧过度区倒圈角', dataIndex: 'p9', key: 'p9', width: 100, align: 'left', cellMode: 'number' },
  { title: '新文件名', dataIndex: 'p10', key: 'p10', width: 120, align: 'left', cellMode: 'editable' },
  { title: '模型文件名', dataIndex: 'p11', key: 'p11', width: 150, align: 'left', cellMode: 'text' },
];

export const OUTER_FRAME_COLUMN_MAP = new Map(
  OUTER_FRAME_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);

export const INNER_FRAME_COLUMN_MAP = new Map(
  INNER_FRAME_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);

export const FORM_LEFT_FIELDS = [
  { label: '外蒙皮外径：', index: 0 },
  { label: '内蒙皮外径：', index: 2 },
];

export const FORM_RIGHT_FIELDS = [
  { label: '外蒙皮内径：', index: 1 },
  { label: '内蒙皮内径：', index: 3 },
];
