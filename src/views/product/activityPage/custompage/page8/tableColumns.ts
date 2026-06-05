export interface Page8AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  children?: Page8AntColumn[];
}

function leaf(title: string, dataIndex: string, width = 95, fixed?: 'left' | 'right'): Page8AntColumn {
  return { title, dataIndex, key: dataIndex, align: 'center', width, fixed };
}

function metricGroup(title: string, dataIndex: string, unit: string): Page8AntColumn {
  return {
    title,
    align: 'center',
    width: 95,
    children: [leaf(unit, dataIndex, 95)],
  };
}

function unitGroup(title: string, dataIndex: string, unit: string): Page8AntColumn {
  return {
    title,
    align: 'center',
    children: [leaf(unit, dataIndex, 95)],
  };
}

export const PAGE8_ANT_COLUMNS: Page8AntColumn[] = [
  leaf('组合方案', 'p0', 100, 'left'),
  {
    title: '执行机构零位性能',
    align: 'center',
    children: [
      metricGroup('舵机最大输出力矩', 'p1', 'Nm'),
      metricGroup('舵机最大空载速度', 'p2', '°/S'),
      metricGroup('舵机额定负载速度', 'p3', '°/S'),
    ],
  },
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p4', 95), leaf('第一级从动轮齿数', 'p5', 95)],
  },
  {
    title: '第二级减速',
    align: 'center',
    children: [leaf('第二级主动轮齿数', 'p6', 95), leaf('第二级从动轮齿数', 'p7', 95)],
  },
  {
    title: '第三级减速',
    align: 'center',
    children: [leaf('第三级主动轮齿数', 'p8', 95), leaf('第三级从动轮齿数', 'p9', 95)],
  },
  {
    title: '传动链参数',
    align: 'center',
    children: [leaf('总减速比', 'p10', 95), leaf('齿轮减速级数', 'p11', 95)],
  },
  {
    title: '电动机参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p12', 95),
      unitGroup('空载速度', 'p13', 'r/min'),
      unitGroup('额定转速', 'p14', 'r/min'),
      unitGroup('最大输出转矩', 'p15', 'Nm'),
      unitGroup('额定转矩', 'p16', 'Nm'),
    ],
  },
  {
    title: '减速器参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p17', 95),
      leaf('产品名称', 'p18', 95),
      unitGroup('传动比（自动计算）', 'p19', 'N/Nm'),
      leaf('最大输出力', 'p20', 95),
    ],
  },
];
