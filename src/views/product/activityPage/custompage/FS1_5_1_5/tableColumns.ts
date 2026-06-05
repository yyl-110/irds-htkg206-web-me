export type SkinCellMode = 'text' | 'editable' | 'number' | 'required';

export interface SkinAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: SkinCellMode;
  requiredMessage?: string;
}

export const SKIN_SEGMENT_TABLE_COLUMNS: SkinAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'left', cellMode: 'text' },
  {
    title: '名称',
    dataIndex: 'p1',
    key: 'p1',
    width: 300,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入名称',
  },
  { title: '与筒零点距离', dataIndex: 'p2', key: 'p2', width: 100, align: 'left', cellMode: 'number' },
  {
    title: '长度',
    dataIndex: 'p3',
    key: 'p3',
    width: 100,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入长度',
  },
];

export const SKIN_SEGMENT_COLUMN_MAP = new Map(
  SKIN_SEGMENT_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
