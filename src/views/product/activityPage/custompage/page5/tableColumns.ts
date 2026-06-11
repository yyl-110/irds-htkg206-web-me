export type Page5CellMode = 'text' | 'editable';

export interface Page5AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  cellMode?: Page5CellMode;
  children?: Page5AntColumn[];
}

function leaf(title: string, dataIndex: string, width = 95, cellMode: Page5CellMode = 'text'): Page5AntColumn {
  return { title, dataIndex, key: dataIndex, align: 'center', width, cellMode };
}

function unitGroup(title: string, dataIndex: string, unit: string): Page5AntColumn {
  return {
    title,
    align: 'center',
    children: [leaf(unit, dataIndex, 95)],
  };
}

function metricGroup(title: string, dataIndex: string, unit: string): Page5AntColumn {
  return {
    title,
    align: 'center',
    width: 95,
    children: [leaf(unit, dataIndex, 95)],
  };
}

export const PAGE5_ANT_COLUMNS: Page5AntColumn[] = [
  leaf('组合方案', 'p0', 95),
  {
    title: '初算指标',
    align: 'center',
    children: [
      metricGroup('舟它最大输出力矩', 'p1', 'Nm'),
      metricGroup('舟它最大空载速度', 'p2', '°/S'),
      metricGroup('舟它额定负载速度', 'p3', '°/S'),
    ],
  },
  {
    title: '电机参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p4', 95),
      unitGroup('空载转速', 'p5', 'r/min'),
      unitGroup('额定转速', 'p6', 'r/min'),
    ],
  },
  {
    title: '末端减速器参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p7', 95),
      leaf('输出形式', 'p8', 95),
      unitGroup('传动比（自动计算）', 'p9', 'N/Nm'),
      unitGroup('最大输出力', 'p10', 'N'),
    ],
  },
  leaf('总减速比', 'p11', 95),
  leaf('末端减速比', 'p12', 95),
  leaf('齿轮减速比', 'p13', 95),
  leaf('齿轮减速级数', 'p14', 95, 'editable'),
];

export function flattenPage5LeafColumns(columns: Page5AntColumn[]): Page5AntColumn[] {
  const result: Page5AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenPage5LeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const PAGE5_LEAF_COLUMNS = flattenPage5LeafColumns(PAGE5_ANT_COLUMNS);
