export type CellMode = 'text' | 'editable' | 'number';

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

function inputLeaf(title: string, dataIndex: string, width: number): AntColumn {
  return leaf(title, dataIndex, width, 'number');
}

export const SELECT_TABLE_COLUMNS: AntColumn[] = [
  leaf('序号', 'p0', 70),
  leaf('模型名称', 'p1', 100, 'editable'),
  leaf('模型编号', 'p2', 160, 'editable'),
  leaf('螺纹公称直径d', 'p3', 160, 'number'),
  leaf('螺栓光杆或销直径D(取整)', 'p4', 100, 'number'),
];

export const CHECK_TABLE_COLUMNS: AntColumn[] = [
  leaf('序号', 'p0', 70),
  leaf('模型名称', 'p1', 70),
  {
    title: '计算输入',
    children: [
      inputLeaf('拉力F', 'p2', 100),
      inputLeaf('剪力N', 'p3', 90),
      inputLeaf('材料的屈服强度', 'p4', 90),
      inputLeaf('材料的抗拉强度', 'p5', 90),
      leaf('螺纹公称直径d', 'p6', 90),
      inputLeaf('螺纹小直径d1', 'p7', 90),
      leaf('螺栓光更或销直径D(取整)', 'p8', 90),
      inputLeaf('安全系数n', 'p9', 90),
      inputLeaf('牙根宽b', 'p10', 90),
      inputLeaf('旋合圈数z', 'p11', 90),
      inputLeaf('实际牙高H1', 'p12', 90),
      inputLeaf('拧紧力矩T', 'p13', 90),
    ],
  },
  {
    title: '计算结果',
    children: [
      leaf('剪切剩余强度系数η1', 'p14', 90),
      leaf('拉剪剩余强度系数η2', 'p15', 120),
      leaf('螺纹剩余强度系数η3', 'p16', 120),
      leaf('螺纹剩余强度系数η4', 'p17', 120),
      leaf('螺纹剩余强度系数η5', 'p18', 120),
      leaf('螺纹剪切剩余强度系数η6', 'p19', 90),
      leaf('螺牙剩余强度系数η7', 'p20', 90),
    ],
  },
];

function flattenColumns(columns: AntColumn[], map: Map<string, AntColumn>) {
  columns.forEach(col => {
    if (col.children?.length) {
      flattenColumns(col.children, map);
    } else if (col.dataIndex) {
      map.set(col.dataIndex, col);
    }
  });
}

export const SELECT_COLUMN_MAP = new Map<string, AntColumn>();
export const CHECK_COLUMN_MAP = new Map<string, AntColumn>();
flattenColumns(SELECT_TABLE_COLUMNS, SELECT_COLUMN_MAP);
flattenColumns(CHECK_TABLE_COLUMNS, CHECK_COLUMN_MAP);
