export type FrameCheckCellMode = 'text' | 'number';

export interface FrameCheckAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: FrameCheckCellMode;
  children?: FrameCheckAntColumn[];
}

function leaf(title: string, dataIndex: string, width: number, cellMode: FrameCheckCellMode = 'text'): FrameCheckAntColumn {
  return { title, dataIndex, key: dataIndex, width, align: 'center', cellMode };
}

export const FRAME_CHECK_TABLE_COLUMNS: FrameCheckAntColumn[] = [
  leaf('序号', 'p0', 80),
  {
    title: '输入值',
    align: 'center',
    children: [
      leaf('加强框名称', 'p1', 95),
      leaf('法向力N(N)', 'p2', 95),
      leaf('剪力Q(N)', 'p3', 95),
      leaf('弯矩M(N.M)', 'p4', 95),
      leaf('加强框所用材料层合板轴向抗拉压强度o_u', 'p5', 150, 'number'),
      leaf('加强框所用材料单向板剪切强度t_ck', 'p6', 150, 'number'),
      leaf('加强框宽度b', 'p7', 95, 'number'),
      leaf('加强框高度h', 'p8', 95, 'number'),
      leaf('安全系数', 'p9', 95, 'number'),
    ],
  },
  {
    title: '计算结果',
    align: 'center',
    children: [leaf('剩余拉伸强度系数nu', 'p10', 120), leaf('剩余剪切强度系数nt', 'p11', 120)],
  },
];

export function flattenFrameCheckLeafColumns(columns: FrameCheckAntColumn[]): FrameCheckAntColumn[] {
  const result: FrameCheckAntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenFrameCheckLeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const FRAME_CHECK_LEAF_COLUMNS = flattenFrameCheckLeafColumns(FRAME_CHECK_TABLE_COLUMNS);
export const FRAME_CHECK_COLUMN_MAP = new Map(FRAME_CHECK_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));
