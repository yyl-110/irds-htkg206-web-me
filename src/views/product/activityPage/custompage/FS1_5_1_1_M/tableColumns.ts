export type FrameForceCellMode = 'text' | 'editable';

export interface FrameForceAntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: FrameForceCellMode;
  children?: FrameForceAntColumn[];
}

function leaf(title: string, dataIndex: string, width = 95, cellMode: FrameForceCellMode = 'editable'): FrameForceAntColumn {
  return { title, dataIndex, key: dataIndex, width, align: 'center', cellMode };
}

export const FRAME_FORCE_TABLE_COLUMNS: FrameForceAntColumn[] = [
  leaf('序号', 'p0', 95, 'text'),
  {
    title: '输入值',
    align: 'center',
    children: [
      leaf('加强框名称', 'p1'),
      leaf('加强框中性轴的曲率半径r(m)', 'p2'),
      leaf('加强框和筒壁的配合半径R(m)', 'p3'),
      leaf('环圈横截面弯曲刚度EJ(N-m2)', 'p4'),
      leaf('载荷数目n', 'p5'),
      leaf('角度', 'p6'),
      leaf('径向外力', 'p7'),
      leaf('切向外力', 'p8'),
      leaf('弯曲力矩', 'p9'),
      leaf('输出内力的角度间距', 'p10'),
      leaf('输出点的角坐标(°)', 'p11'),
    ],
  },
  {
    title: '计算结果',
    align: 'center',
    children: [
      leaf('法向力N(N)', 'p12'),
      leaf('剪力Q(m)', 'p13'),
      leaf('弯矩M(N M)', 'p14'),
      leaf('径向挠度(m)', 'p15'),
    ],
  },
];

export function flattenFrameForceLeafColumns(columns: FrameForceAntColumn[]): FrameForceAntColumn[] {
  const result: FrameForceAntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenFrameForceLeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const FRAME_FORCE_LEAF_COLUMNS = flattenFrameForceLeafColumns(FRAME_FORCE_TABLE_COLUMNS);
export const FRAME_FORCE_COLUMN_MAP = new Map(FRAME_FORCE_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));
