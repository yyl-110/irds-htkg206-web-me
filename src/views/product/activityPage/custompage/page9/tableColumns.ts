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

export type Page9CellMode = 'text' | 'editable';

export interface Page9AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  cellMode?: Page9CellMode;
  children?: Page9AntColumn[];
}

function leaf(
  title: string,
  dataIndex: string,
  width = SCHEME_LEAF_WIDTH,
  opts?: { fixed?: 'left' | 'right'; cellMode?: Page9CellMode },
): Page9AntColumn {
  return {
    ...schemeLeaf(title, dataIndex, width),
    fixed: opts?.fixed,
    cellMode: opts?.cellMode,
  };
}

function metricGroup(title: string, dataIndex: string, unit: string, width = SCHEME_METRIC_WIDTH): Page9AntColumn {
  return schemeMetricGroup(title, dataIndex, unit, width);
}

function unitGroup(title: string, dataIndex: string, unit: string, width = SCHEME_UNIT_WIDTH): Page9AntColumn {
  return schemeUnitGroup(title, dataIndex, unit, width);
}

/** 组合方案表（与 page8 类似，p2/p3 列顺序不同） */
export const PAGE9_SCHEME_COLUMNS: Page9AntColumn[] = [
  leaf('组合方案', 'p0', SCHEME_COMBO_WIDTH, { fixed: 'left' }),
  {
    title: '执行机构零位性能',
    align: 'center',
    children: [
      metricGroup('舵机最大输出力矩', 'p1', 'Nm'),
      metricGroup('舵机额定负载速度', 'p2', '°/S'),
      metricGroup('舵机最大空载速度', 'p3', '°/S'),
    ],
  },
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p4'), leaf('第一级从动齿轮数', 'p5', SCHEME_LONG_TITLE_WIDTH)],
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
    children: [leaf('总减速比', 'p10'), leaf('齿轮减速级数', 'p11', SCHEME_METRIC_WIDTH)],
  },
  {
    title: '电动机参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p12'),
      unitGroup('空载速度', 'p13', 'r/min'),
      unitGroup('额定转速', 'p14', 'r/min'),
      unitGroup('最大输出转矩', 'p15', 'Nm', SCHEME_METRIC_WIDTH),
      unitGroup('额定转矩', 'p16', 'Nm'),
    ],
  },
  {
    title: '减速器参数',
    align: 'center',
    children: [
      leaf('产品代号', 'p17'),
      leaf('产品名称', 'p18', SCHEME_PRODUCT_NAME_WIDTH),
      unitGroup('传动比（自动计算）', 'p19', 'N/Nm', SCHEME_RATIO_WIDTH),
      leaf('最大输出力', 'p20', SCHEME_UNIT_WIDTH),
    ],
  },
];

export const PAGE9_GEAR_COLUMNS: Page9AntColumn[] = [
  leaf('齿轮', 'p0', SCHEME_COMBO_WIDTH),
  leaf('齿轮扭矩（T）', 'p1', 145),
  leaf('齿轮模数（m）', 'p2', 150, { cellMode: 'editable' }),
  leaf('齿轮齿数（Z）', 'p3', 145),
  leaf('齿宽（b）', 'p4', 130, { cellMode: 'editable' }),
  leaf('齿形系数（YF）', 'p5', 140, { cellMode: 'editable' }),
  leaf('齿形修正系数（YS）', 'p6', 150, { cellMode: 'editable' }),
  leaf('切向力（Ft）N', 'p7', 145),
  leaf('载荷系数（1.2~1.4）', 'p8', 160),
  leaf('齿根弯曲应力（RF）MPa', 'p9', 165),
];

export function flattenPage9LeafColumns(columns: Page9AntColumn[]): Page9AntColumn[] {
  const result: Page9AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenPage9LeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const PAGE9_GEAR_LEAF_COLUMNS = flattenPage9LeafColumns(PAGE9_GEAR_COLUMNS);

export const PAGE9_SCHEME_TABLE_MIN_WIDTH = sumTableColumnWidths(PAGE9_SCHEME_COLUMNS, { extra: 48 });
export const PAGE9_GEAR_TABLE_MIN_WIDTH = sumTableColumnWidths(PAGE9_GEAR_COLUMNS);

export function isPage9GearCellDisabled(record: Record<string, string | number | undefined>, field: string): boolean {
  const idx = field.replace(/^p/, '');
  return record[`cellInputOrOutput${idx}`] === '1';
}

export const NUMERIC_INPUT_REG = /^(\-|\+)?\d+(\.\d+)?$/;

export function isNumericInput(val: string) {
  return !val || NUMERIC_INPUT_REG.test(val);
}
