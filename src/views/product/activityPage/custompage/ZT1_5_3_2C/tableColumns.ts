export type InterfaceCellMode = 'text' | 'editable';

export interface InterfaceAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: InterfaceCellMode;
}

export const SUMMARY_TABLE_COLUMNS: InterfaceAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 95, align: 'left', cellMode: 'text' },
  { title: '供电接口表名称', dataIndex: 'p1', key: 'p1', width: 150, align: 'left', cellMode: 'text' },
  { title: '接口', dataIndex: 'p2', key: 'p2', align: 'left', cellMode: 'text' },
  { title: '备注', dataIndex: 'p3', key: 'p3', width: 400, align: 'left', cellMode: 'editable' },
];

export const POINT_TABLE_COLUMNS: InterfaceAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 96, align: 'left', cellMode: 'text' },
  { title: '点号', dataIndex: 'p1', key: 'p1', width: 120, align: 'left', cellMode: 'editable' },
  { title: '点号定义', dataIndex: 'p2', key: 'p2', align: 'left', cellMode: 'editable' },
  { title: '备注', dataIndex: 'p3', key: 'p3', width: 300, align: 'left', cellMode: 'editable' },
];

export const SUMMARY_COLUMN_MAP = new Map(SUMMARY_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));
export const POINT_COLUMN_MAP = new Map(POINT_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));
