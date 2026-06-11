import { sumTableColumnWidths } from '../_shared/utils/tableScrollWidth';
import {
  SCHEME_COMBO_WIDTH,
  SCHEME_LEAF_WIDTH,
  SCHEME_METRIC_WIDTH,
  SCHEME_MID_TITLE_WIDTH,
  SCHEME_UNIT_WIDTH,
  schemeLeaf,
  schemeMetricGroup,
  schemeUnitGroup,
} from '../_shared/utils/schemeTableColumns';

export interface Page7AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  children?: Page7AntColumn[];
}

function leaf(title: string, dataIndex: string, width = SCHEME_LEAF_WIDTH, fixed?: 'left' | 'right'): Page7AntColumn {
  return { ...schemeLeaf(title, dataIndex, width), fixed };
}

function metricGroup(title: string, dataIndex: string, unit: string, width = SCHEME_METRIC_WIDTH): Page7AntColumn {
  return schemeMetricGroup(title, dataIndex, unit, width);
}

function unitGroup(title: string, dataIndex: string, unit: string, width = SCHEME_UNIT_WIDTH): Page7AntColumn {
  return schemeUnitGroup(title, dataIndex, unit, width);
}

export const PAGE7_ANT_COLUMNS: Page7AntColumn[] = [
  leaf('组合方案', 'p0', SCHEME_COMBO_WIDTH, 'left'),
  {
    title: '初算指标',
    align: 'center',
    children: [
      metricGroup('舟它最大输出力矩', 'p1', 'Nm'),
      metricGroup('舟它最大空载速度', 'p2', '°/S'),
      metricGroup('舟它额定负载速度', 'p3', '°/S'),
    ],
  },
  leaf('理论总减速比', 'p4', 145),
  leaf('理论齿轮减速比', 'p5', 150),
  leaf('齿轮减速级数', 'p8', 150),
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p9'), leaf('第一级从动齿数', 'p10', 155)],
  },
  {
    title: '第二级减速',
    align: 'center',
    children: [leaf('第二级主动轮齿数', 'p11', SCHEME_MID_TITLE_WIDTH), leaf('第二级从动轮齿数', 'p12', SCHEME_MID_TITLE_WIDTH)],
  },
  {
    title: '第三级减速',
    align: 'center',
    children: [leaf('第三级主动轮齿数', 'p13', SCHEME_MID_TITLE_WIDTH), leaf('第三级从动轮齿数', 'p14', SCHEME_MID_TITLE_WIDTH)],
  },
  unitGroup('电机空载转速', 'p15', 'r/min'),
  unitGroup('电机额定转速', 'p16', 'r/min'),
  unitGroup('电机额定转矩', 'p17', 'Nm'),
  unitGroup('电机最大输出转矩', 'p18', 'Nm', SCHEME_METRIC_WIDTH),
  leaf('传动效率', 'p19', 130),
  leaf('舟它额定负载时电机转速', 'p21', 175),
  leaf('实际齿轮减速比', 'p22', 150),
  leaf('实际零位总减速比', 'p23', 155),
  unitGroup('最大输出力矩', 'p24', 'Nm'),
  unitGroup('负载速度', 'p25', '°/S'),
  unitGroup('最大空载速度', 'p26', '°/S'),
  leaf('电机代号', 'p27', 130),
  leaf('减速器代号', 'p28', 140),
];

export const PAGE7_TABLE_MIN_WIDTH = sumTableColumnWidths(PAGE7_ANT_COLUMNS, { extra: 48 });
