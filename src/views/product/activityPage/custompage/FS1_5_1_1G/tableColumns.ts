export type MaterialCellMode = 'text' | 'editable';

export interface MaterialAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: MaterialCellMode;
}

export const MATERIAL_TABLE_COLUMNS: MaterialAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 80, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 95, align: 'left', cellMode: 'text' },
  { title: '材料名称', dataIndex: 'p2', key: 'p2', width: 95, align: 'left', cellMode: 'editable' },
  { title: '沿纤维方向的弹性模量EL(GPa)', dataIndex: 'p3', key: 'p3', width: 95, align: 'left', cellMode: 'editable' },
  { title: '垂直于纤维方向的弹性模量ET(GPa)', dataIndex: 'p4', key: 'p4', width: 95, align: 'left', cellMode: 'editable' },
  { title: '单向板纵向泊松比VLT', dataIndex: 'p5', key: 'p5', width: 95, align: 'left', cellMode: 'editable' },
  { title: '单向板纵横剪切弹性模量GLT(GPa)', dataIndex: 'p6', key: 'p6', width: 95, align: 'left', cellMode: 'editable' },
  { title: '沿纤维方向的拉伸强度XL(MPa)', dataIndex: 'p7', key: 'p7', width: 95, align: 'left', cellMode: 'editable' },
  { title: '密度(g/cm3)', dataIndex: 'p8', key: 'p8', width: 95, align: 'left', cellMode: 'editable' },
  { title: '知识', dataIndex: 'p9', key: 'p9', width: 95, align: 'left', cellMode: 'editable' },
];

export const MATERIAL_COLUMN_MAP = new Map(MATERIAL_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));
