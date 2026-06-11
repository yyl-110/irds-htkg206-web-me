export interface Page4AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  children?: Page4AntColumn[];
}

function leaf(title: string, dataIndex: string, width = 95): Page4AntColumn {
  return { title, dataIndex, key: dataIndex, align: 'center', width };
}

function unitGroup(title: string, dataIndex: string, unit: string): Page4AntColumn {
  return {
    title,
    align: 'center',
    children: [leaf(unit, dataIndex, 95)],
  };
}

function metricGroup(title: string, dataIndex: string, unit: string): Page4AntColumn {
  return {
    title,
    align: 'center',
    width: 95,
    children: [leaf(unit, dataIndex, 95)],
  };
}

export const PAGE4_ANT_COLUMNS: Page4AntColumn[] = [
  leaf('组合方案', 'p0', 100),
  {
    title: '初算指标',
    align: 'center',
    children: [
      metricGroup('舟它最大输出力矩', 'p1', 'Nm'),
      metricGroup('舟它最大空载转速', 'p2', '°/S'),
      metricGroup('舟它额定负载转速', 'p3', '°/S'),
    ],
  },
  {
    title: '电机参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p4', 95),
      unitGroup('空载转速', 'p5', 'r/min'),
      unitGroup('额定转速', 'p6', 'r/min'),
      unitGroup('额定转矩', 'p7', 'Nm'),
      unitGroup('额定电压', 'p8', 'V'),
      unitGroup('额定电流', 'p9', 'A'),
    ],
  },
  {
    title: '末端减速器参数',
    align: 'center',
    children: [
      unitGroup('产品代号', 'p10', 'Nm'),
      unitGroup('传动比（自动计算）', 'p11', 'N/Nm'),
      unitGroup('最大输出力', 'p12', 'N'),
      unitGroup('导程', 'p13', 'mm'),
      unitGroup('中径', 'p14', 'mm'),
      unitGroup('机械行程（一半）', 'p15', 'mm'),
    ],
  },
  leaf('总减速比', 'p16', 95),
];
