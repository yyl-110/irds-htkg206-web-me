export type DesignCellMode = 'text' | 'editable' | 'number';

export interface DesignAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: DesignCellMode;
}

export const FRAME_TABLE_COLUMNS: DesignAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 70, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 160, align: 'left', cellMode: 'text' },
  { title: '功能描述', dataIndex: 'p2', key: 'p2', width: 180, align: 'left', cellMode: 'text' },
  { title: '与筒零点距离', dataIndex: 'p3', key: 'p3', width: 150, align: 'left', cellMode: 'text' },
  { title: '与象限的夹角', dataIndex: 'p4', key: 'p4', width: 100, align: 'left', cellMode: 'text' },
  { title: '开口规格(接口图)', dataIndex: 'p5', key: 'p5', width: 120, align: 'left', cellMode: 'text' },
  { title: '宽度(切向尺寸)', dataIndex: 'p6', key: 'p6', width: 100, align: 'left', cellMode: 'number' },
  { title: '长度(轴向尺寸)', dataIndex: 'p7', key: 'p7', width: 100, align: 'left', cellMode: 'number' },
  { title: '外径', dataIndex: 'p8', key: 'p8', width: 100, align: 'left', cellMode: 'number' },
  { title: '内径', dataIndex: 'p9', key: 'p9', width: 80, align: 'left', cellMode: 'number' },
  { title: '倒圆角', dataIndex: 'p12', key: 'p12', width: 80, align: 'left', cellMode: 'number' },
  { title: '新文件名', dataIndex: 'p10', key: 'p10', width: 120, align: 'left', cellMode: 'editable' },
  { title: '模型文件名', dataIndex: 'p11', key: 'p11', width: 170, align: 'left', cellMode: 'text' },
];

export const LINING_TABLE_COLUMNS: DesignAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 70, align: 'left', cellMode: 'text' },
  { title: '衬板名称', dataIndex: 'p1', key: 'p1', width: 160, align: 'left', cellMode: 'editable' },
  { title: '衬板功能', dataIndex: 'p2', key: 'p2', width: 180, align: 'left', cellMode: 'editable' },
  { title: '衬板中心到筒零点的距离', dataIndex: 'p3', key: 'p3', width: 150, align: 'left', cellMode: 'editable' },
  { title: '衬板中面与筒象限的夹角', dataIndex: 'p4', key: 'p4', width: 100, align: 'left', cellMode: 'editable' },
  { title: '衬板内径', dataIndex: 'p5', key: 'p5', width: 120, align: 'left', cellMode: 'number' },
  { title: '衬板外径', dataIndex: 'p6', key: 'p6', width: 100, align: 'left', cellMode: 'number' },
  { title: '衬板长度(轴向尺寸)', dataIndex: 'p7', key: 'p7', width: 100, align: 'left', cellMode: 'number' },
  { title: '衬板宽度(切向尺寸)', dataIndex: 'p8', key: 'p8', width: 100, align: 'left', cellMode: 'number' },
  { title: '倒圆角', dataIndex: 'p11', key: 'p11', width: 100, align: 'left', cellMode: 'number' },
  { title: '新模型名称', dataIndex: 'p9', key: 'p9', width: 120, align: 'left', cellMode: 'editable' },
  { title: '新模型文件名', dataIndex: 'p10', key: 'p10', width: 170, align: 'left', cellMode: 'text' },
];

export const FRAME_COLUMN_MAP = new Map(FRAME_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));
export const LINING_COLUMN_MAP = new Map(LINING_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]));

export const FORM_LEFT_FIELDS = [
  { label: '外蒙皮外径：', index: 0 },
  { label: '内蒙皮外径：', index: 2 },
];

export const FORM_RIGHT_FIELDS = [
  { label: '外蒙皮内径：', index: 1 },
  { label: '内蒙皮内径：', index: 3 },
];
