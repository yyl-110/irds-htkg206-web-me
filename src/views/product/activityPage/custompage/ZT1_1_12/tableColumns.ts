export type Zt1CellMode = 'editable' | 'readonly';

export interface Zt1AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: Zt1CellMode;
  children?: Zt1AntColumn[];
}

export const ZT1_1_12_TABLE_COLUMNS: Zt1AntColumn[] = [
  { title: '系统名称', dataIndex: 'p0', key: 'p0', width: 100, align: 'center', cellMode: 'editable' },
  { title: '种类', dataIndex: 'p1', key: 'p1', width: 90, align: 'center', cellMode: 'editable' },
  { title: '数量', dataIndex: 'p2', key: 'p2', width: 90, align: 'center', cellMode: 'editable' },
  {
    title: '国产元器件',
    children: [
      { title: '种类', dataIndex: 'p3', key: 'p3', width: 90, align: 'center', cellMode: 'editable' },
      { title: '比例', dataIndex: 'p4', key: 'p4', width: 90, align: 'center', cellMode: 'readonly' },
      { title: '数量', dataIndex: 'p5', key: 'p5', width: 90, align: 'center', cellMode: 'editable' },
      { title: '比例', dataIndex: 'p6', key: 'p6', width: 90, align: 'center', cellMode: 'readonly' },
    ],
  },
  {
    title: '进口元器件',
    children: [
      { title: '种类', dataIndex: 'p7', key: 'p7', width: 90, align: 'center', cellMode: 'editable' },
      { title: '比例', dataIndex: 'p8', key: 'p8', width: 90, align: 'center', cellMode: 'readonly' },
      { title: '数量', dataIndex: 'p9', key: 'p9', width: 90, align: 'center', cellMode: 'editable' },
      { title: '比例', dataIndex: 'p10', key: 'p10', width: 90, align: 'center', cellMode: 'readonly' },
    ],
  },
];

export const ZT1_1_12_LEAF_COLUMNS = flattenLeafColumns(ZT1_1_12_TABLE_COLUMNS);

export const ZT1_1_12_SUMMARY_KEYS = ZT1_1_12_LEAF_COLUMNS.map(col => String(col.dataIndex ?? ''));

function flattenLeafColumns(columns: Zt1AntColumn[]): Zt1AntColumn[] {
  const result: Zt1AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenLeafColumns(col.children));
    } else {
      result.push(col);
    }
  });
  return result;
}
