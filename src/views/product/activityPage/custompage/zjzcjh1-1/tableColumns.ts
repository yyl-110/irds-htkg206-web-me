export type ZjzcjhCellMode = 'text' | 'editable' | 'actions';

export interface ZjzcjhAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: ZjzcjhCellMode;
}

export const ZJZCJH_TABLE_COLUMNS: ZjzcjhAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 50, align: 'center', cellMode: 'text' },
  { title: '检查内容', dataIndex: 'p1', key: 'p1', width: 300, align: 'left', cellMode: 'text' },
  { title: '检查结果', dataIndex: 'p2', key: 'p2', width: 100, align: 'center', cellMode: 'editable' },
  { title: '检查结论', dataIndex: 'p3', key: 'p3', width: 100, align: 'center', cellMode: 'editable' },
  { title: '检查方法', dataIndex: 'p4', key: 'p4', width: 250, align: 'center', cellMode: 'actions' },
];
