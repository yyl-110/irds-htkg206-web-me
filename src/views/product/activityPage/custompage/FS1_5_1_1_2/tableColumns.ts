export type DesignCellMode = 'text' | 'editable' | 'number';

export interface DesignAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: DesignCellMode;
}

export const OUTER_SKIN_DESIGN_TABLE_COLUMNS: DesignAntColumn[] = [
  { title: '序号', dataIndex: 'p0', key: 'p0', width: 60, align: 'left', cellMode: 'text' },
  { title: '名称', dataIndex: 'p1', key: 'p1', width: 130, align: 'left', cellMode: 'text' },
  { title: '轴向辅层材料名称', dataIndex: 'p2', key: 'p2', width: 130, align: 'left', cellMode: 'editable' },
  { title: '轴向辅层材料密度(Kg/mm3)', dataIndex: 'p3', key: 'p3', width: 90, align: 'left', cellMode: 'number' },
  { title: '环向辅层材料名称', dataIndex: 'p4', key: 'p4', width: 130, align: 'left', cellMode: 'editable' },
  { title: '环向辅层材料密度(Kg/mm3)', dataIndex: 'p5', key: 'p5', width: 90, align: 'left', cellMode: 'number' },
  { title: '轴向辅层厚度', dataIndex: 'p6', key: 'p6', width: 80, align: 'left', cellMode: 'number' },
  { title: '环向辅层厚度', dataIndex: 'p7', key: 'p7', width: 80, align: 'left', cellMode: 'number' },
  { title: '与简零点距离', dataIndex: 'p8', key: 'p8', width: 80, align: 'left', cellMode: 'text' },
  { title: '总厚度', dataIndex: 'p9', key: 'p9', width: 80, align: 'left', cellMode: 'text' },
  { title: '长度', dataIndex: 'p10', key: 'p10', width: 80, align: 'left', cellMode: 'text' },
  { title: '外径', dataIndex: 'p11', key: 'p11', width: 80, align: 'left', cellMode: 'number' },
  { title: '等效密度(g/mm3)', dataIndex: 'p12', key: 'p12', width: 120, align: 'left', cellMode: 'text' },
  { title: '新模型文件名', dataIndex: 'p13', key: 'p13', width: 120, align: 'left', cellMode: 'editable' },
  { title: '模型文件名', dataIndex: 'p14', key: 'p14', width: 130, align: 'left', cellMode: 'text' },
];

export const OUTER_SKIN_DESIGN_COLUMN_MAP = new Map(
  OUTER_SKIN_DESIGN_TABLE_COLUMNS.map(col => [String(col.dataIndex), col]),
);

export const FORM_LEFT_FIELDS = [
  { label: '保温层材质：', index: 0 },
  { label: '保温层厚度：', index: 1 },
  { label: '外蒙皮内径(mm)：', index: 6 },
];

export const FORM_RIGHT_FIELDS = [
  { label: '加热膜材料：', index: 3 },
  { label: '加热膜厚度：', index: 4 },
  { label: '加热膜铺放位置：', index: 2 },
];
