export type OpeningCellMode = 'text' | 'editable' | 'required' | 'link';

export interface OpeningAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: OpeningCellMode;
  requiredMessage?: string;
}

export const OPENING_PARAM_TABLE_COLUMNS: OpeningAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 65, align: 'left', cellMode: 'text' },
  {
    title: '名称',
    dataIndex: 'p1',
    key: 'p1',
    width: 300,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入名称',
  },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 100, align: 'left', cellMode: 'editable' },
  {
    title: '与筒零点距离',
    dataIndex: 'p3',
    key: 'p3',
    width: 120,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入备注',
  },
  {
    title: '与象限的夹角',
    dataIndex: 'p4',
    key: 'p4',
    width: 120,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入备注',
  },
  {
    title: '开口规格(直径)',
    dataIndex: 'p5',
    key: 'p5',
    width: 120,
    align: 'left',
    cellMode: 'required',
    requiredMessage: '请输入备注',
  },
  { title: '开口规格(接口)', dataIndex: 'p6', key: 'p6', width: 160, align: 'left', cellMode: 'link' },
];

export const OPENING_PARAM_COLUMN_MAP = new Map(
  OPENING_PARAM_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
