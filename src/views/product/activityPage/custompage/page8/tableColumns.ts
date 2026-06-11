import { sumTableColumnWidths } from '../_shared/utils/tableScrollWidth';
import {
  SCHEME_COMBO_WIDTH,
  SCHEME_LEAF_WIDTH,
  SCHEME_LONG_TITLE_WIDTH,
  SCHEME_METRIC_WIDTH,
  SCHEME_MID_TITLE_WIDTH,
  SCHEME_PRODUCT_NAME_WIDTH,
  SCHEME_RATIO_WIDTH,
  SCHEME_UNIT_WIDTH,
  schemeLeaf,
  schemeMetricGroup,
  schemeUnitGroup,
} from '../_shared/utils/schemeTableColumns';

export interface Page8AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  children?: Page8AntColumn[];
}

function leaf(title: string, dataIndex: string, width = SCHEME_LEAF_WIDTH, fixed?: 'left' | 'right'): Page8AntColumn {
  return { ...schemeLeaf(title, dataIndex, width), fixed };
}

export const PAGE8_ANT_COLUMNS: Page8AntColumn[] = [
  leaf('组合方案', 'p0', SCHEME_COMBO_WIDTH, 'left'),
  {
    title: '执行机构零位性能',
    align: 'center',
    children: [
      schemeMetricGroup('舟它最大输出力矩', 'p1', 'Nm', SCHEME_METRIC_WIDTH),
      schemeMetricGroup('舟它最大空载速度', 'p2', '°/S', SCHEME_METRIC_WIDTH),
      schemeMetricGroup('舟它额定负载速度', 'p3', '°/S', SCHEME_METRIC_WIDTH),
    ],
  },
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p4', SCHEME_LEAF_WIDTH), leaf('第一级从动轮齿数', 'p5', SCHEME_LONG_TITLE_WIDTH)],
  },
  {
    title: '第二级减速',
    align: 'center',
    children: [leaf('第二级主动轮齿数', 'p6', SCHEME_MID_TITLE_WIDTH), leaf('第二级从动轮齿数', 'p7', SCHEME_MID_TITLE_WIDTH)],
  },
  {
    title: '第三级减速',
    align: 'center',
    children: [leaf('第三级主动轮齿数', 'p8', SCHEME_MID_TITLE_WIDTH), leaf('第三级从动轮齿数', 'p9', SCHEME_MID_TITLE_WIDTH)],
  },
  {
    title: '传动链参数',
    align: 'center',
    children: [leaf('总减速比', 'p10', SCHEME_LEAF_WIDTH), leaf('齿轮减速级数', 'p11', SCHEME_METRIC_WIDTH)],
  },
  {
    title: '电动机参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p12', SCHEME_LEAF_WIDTH),
      schemeUnitGroup('空载速度', 'p13', 'r/min', SCHEME_UNIT_WIDTH),
      schemeUnitGroup('额定转速', 'p14', 'r/min', SCHEME_UNIT_WIDTH),
      schemeUnitGroup('最大输出转矩', 'p15', 'Nm', SCHEME_METRIC_WIDTH),
      schemeUnitGroup('额定转矩', 'p16', 'Nm', SCHEME_UNIT_WIDTH),
    ],
  },
  {
    title: '减速器参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p17', SCHEME_LEAF_WIDTH),
      leaf('产品名称', 'p18', SCHEME_PRODUCT_NAME_WIDTH),
      schemeUnitGroup('传动比（自动计算）', 'p19', 'N/Nm', SCHEME_RATIO_WIDTH),
      leaf('最大输出力', 'p20', SCHEME_UNIT_WIDTH),
    ],
  },
];

export const PAGE8_TABLE_MIN_WIDTH = sumTableColumnWidths(PAGE8_ANT_COLUMNS, { extra: 48 });
