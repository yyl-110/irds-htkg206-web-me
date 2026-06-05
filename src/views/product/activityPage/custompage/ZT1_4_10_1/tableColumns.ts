export type Zt1CabinetCellMode = 'text' | 'editable' | 'number' | 'select' | 'readonly';

export interface Zt1CabinetAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: Zt1CabinetCellMode;
}

export const ZT1_4_10_1_TABLE_COLUMNS: Zt1CabinetAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 50, align: 'center', cellMode: 'text' },
  { title: '设备舱名称', dataIndex: 'p1', key: 'p1', width: 100, align: 'center', cellMode: 'editable' },
  { title: '设备舱位置', dataIndex: 'p2', key: 'p2', width: 100, align: 'center', cellMode: 'select' },
  { title: '安装基准面X', dataIndex: 'p3', key: 'p3', width: 110, align: 'center', cellMode: 'editable' },
  { title: '安装基准面Y', dataIndex: 'p4', key: 'p4', width: 110, align: 'center', cellMode: 'editable' },
  { title: '安装基准面Z', dataIndex: 'p5', key: 'p5', width: 110, align: 'center', cellMode: 'editable' },
  { title: '舱体高(mm)', dataIndex: 'p6', key: 'p6', width: 100, align: 'center', cellMode: 'number' },
  { title: '舱体底部宽(mm)', dataIndex: 'p7', key: 'p7', width: 120, align: 'center', cellMode: 'number' },
  { title: '外侧面与底部夹角(°)', dataIndex: 'p8', key: 'p8', width: 150, align: 'center', cellMode: 'number' },
  { title: '内侧面下部高度(mm)', dataIndex: 'p9', key: 'p9', width: 150, align: 'center', cellMode: 'number' },
  { title: '内侧面上部与下部夹角(°)', dataIndex: 'p10', key: 'p10', width: 180, align: 'center', cellMode: 'number' },
  { title: '舱体长(mm)', dataIndex: 'p11', key: 'p11', width: 100, align: 'center', cellMode: 'number' },
  { title: '新模型文件名', dataIndex: 'p12', key: 'p12', width: 180, align: 'center', cellMode: 'editable' },
  { title: '模板文件名', dataIndex: 'p13', key: 'p13', width: 190, align: 'center', cellMode: 'readonly' },
];

export const ZT1_4_10_1_COLUMN_MAP = new Map(
  ZT1_4_10_1_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);
