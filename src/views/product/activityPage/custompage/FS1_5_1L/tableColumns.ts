export type CellMode = 'text' | 'editable' | 'number' | 'select';

export interface AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: CellMode;
  children?: AntColumn[];
}

function leaf(title: string, dataIndex: string, width: number, cellMode: CellMode = 'text'): AntColumn {
  return { title, dataIndex, key: dataIndex, width, align: 'center', cellMode };
}

function inputLeaf(title: string, dataIndex: string, width: number, cellMode: CellMode = 'number'): AntColumn {
  return leaf(title, dataIndex, width, cellMode);
}

export const SELECT_TABLE_COLUMNS: AntColumn[] = [
  leaf('序号', 'p0', 70),
  leaf('模型名称', 'p1', 100),
  leaf('模型编号', 'p2', 160),
  leaf('用途描述', 'p3', 300, 'editable'),
  leaf('O形圈内径d1', 'p4', 160),
  leaf('O形圈截面直径d2', 'p5', 100),
  leaf('O形圈截面直径公差', 'p6', 100),
];

export const CHECK_TABLE_COLUMNS: AntColumn[] = [
  leaf('序号', 'p0', 70),
  leaf('用途描述', 'p1', 300),
  leaf('模型名称', 'p2', 70),
  leaf('模型编号', 'p3', 70),
  {
    title: '计算输入',
    children: [
      leaf('O形圈内径d1', 'p4', 100),
      leaf('O形圈截面直径d2', 'p5', 90),
      inputLeaf('O形圈截面直径公差', 'p6', 90),
      inputLeaf('压力方向', 'p7', 90, 'select'),
    ],
  },
  {
    title: '计算结果',
    children: [
      leaf('密封槽深度h', 'p8', 90),
      leaf('密封槽深度h公差', 'p9', 120),
      leaf('密封槽宽度B', 'p10', 120),
      leaf('密封槽宽度B公差', 'p11', 120),
      leaf('密封槽外径(或内径)', 'p12', 120),
      leaf('压缩率Z', 'p13', 90),
    ],
  },
];

function flattenColumns(columns: AntColumn[], map: Map<string, AntColumn>) {
  columns.forEach(col => {
    if (col.children?.length) flattenColumns(col.children, map);
    else if (col.dataIndex) map.set(col.dataIndex, col);
  });
}

export const SELECT_COLUMN_MAP = new Map<string, AntColumn>();
export const CHECK_COLUMN_MAP = new Map<string, AntColumn>();
flattenColumns(SELECT_TABLE_COLUMNS, SELECT_COLUMN_MAP);
flattenColumns(CHECK_TABLE_COLUMNS, CHECK_COLUMN_MAP);
