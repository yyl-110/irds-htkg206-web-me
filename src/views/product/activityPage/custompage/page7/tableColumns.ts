export interface Page7AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  children?: Page7AntColumn[];
}

function leaf(title: string, dataIndex: string, width = 95, fixed?: 'left' | 'right'): Page7AntColumn {
  return { title, dataIndex, key: dataIndex, align: 'center', width, fixed };
}

function metricGroup(title: string, dataIndex: string, unit: string): Page7AntColumn {
  return {
    title,
    align: 'center',
    width: 95,
    children: [leaf(unit, dataIndex, 95)],
  };
}

function unitGroup(title: string, dataIndex: string, unit: string): Page7AntColumn {
  return {
    title,
    align: 'center',
    children: [leaf(unit, dataIndex, 95)],
  };
}

export const PAGE7_ANT_COLUMNS: Page7AntColumn[] = [
  leaf('组合方案', 'p0', 100, 'left'),
  {
    title: '初算指标',
    align: 'center',
    children: [
      metricGroup('舵机最大输出力矩', 'p1', 'Nm'),
      metricGroup('舵机最大空载速度', 'p2', '°/S'),
      metricGroup('舵机额定负载速度', 'p3', '°/S'),
    ],
  },
  leaf('理论总减速比', 'p4', 95),
  leaf('理论齿轮减速比', 'p5', 95),
  leaf('齿轮减速级数', 'p8', 95),
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p9', 95), leaf('第一级从动齿数', 'p10', 95)],
  },
  {
    title: '第二级减速',
    align: 'center',
    children: [leaf('第二级主动轮齿数', 'p11', 95), leaf('第二级从动轮齿数', 'p12', 95)],
  },
  {
    title: '第三级减速',
    align: 'center',
    children: [leaf('第三级主动轮齿数', 'p13', 95), leaf('第三级从动轮齿数', 'p14', 95)],
  },
  unitGroup('电机空载转速', 'p15', 'r/min'),
  unitGroup('电机额定转速', 'p16', 'r/min'),
  unitGroup('电机额定转矩', 'p17', 'Nm'),
  unitGroup('电机最大输出转矩', 'p18', 'Nm'),
  leaf('传动效率', 'p19', 95),
  leaf('舵机额定负载时电机转速', 'p21', 110),
  leaf('实际齿轮减速比', 'p22', 95),
  leaf('实际零位总减速比', 'p23', 95),
  unitGroup('最大输出力矩', 'p24', 'Nm'),
  unitGroup('负载速度', 'p25', '°/S'),
  unitGroup('最大空载速度', 'p26', '°/S'),
  leaf('电机代号', 'p27', 95),
  leaf('减速器代号', 'p28', 95),
];
