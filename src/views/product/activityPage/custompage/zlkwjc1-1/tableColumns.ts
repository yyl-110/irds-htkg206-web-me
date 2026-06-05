export type ZlkwjcCellMode = 'text' | 'result' | 'action';

export interface ZlkwjcAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: ZlkwjcCellMode;
}

export const ZLKWJC_TABLE_COLUMNS: ZlkwjcAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 50, align: 'center', cellMode: 'text' },
  { title: '检查内容', dataIndex: 'p1', key: 'p1', width: 220, align: 'left', cellMode: 'text' },
  { title: '检查结果', dataIndex: 'p2', key: 'p2', width: 150, align: 'center', cellMode: 'result' },
  { title: '检查方法', dataIndex: 'p3', key: 'p3', width: 150, align: 'center', cellMode: 'action' },
];
