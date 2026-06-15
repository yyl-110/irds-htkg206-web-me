import { sumTableColumnWidths } from '../_shared/utils/tableScrollWidth';
import {
  SCHEME_COMBO_WIDTH,
  SCHEME_LEAF_WIDTH,
  SCHEME_LONG_TITLE_WIDTH,
  SCHEME_METRIC_WIDTH,
  SCHEME_MID_TITLE_WIDTH,
  schemeLeaf,
  schemeMetricGroup,
} from '../_shared/utils/schemeTableColumns';

export type Page6CellMode = 'text' | 'editable';

export interface Page6AntColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  cellMode?: Page6CellMode;
  children?: Page6AntColumn[];
}

function leaf(title: string, dataIndex: string, width = SCHEME_LEAF_WIDTH, cellMode: Page6CellMode = 'text'): Page6AntColumn {
  return { ...schemeLeaf(title, dataIndex, width), cellMode };
}

function metricGroup(title: string, dataIndex: string, unit: string, width = SCHEME_METRIC_WIDTH): Page6AntColumn {
  return schemeMetricGroup(title, dataIndex, unit, width);
}

export const PAGE6_EDITABLE_FIELDS = new Set(['p10', 'p11', 'p12', 'p13', 'p14']);

/** 可编辑列对应的 p 字段索引（如 p10 -> 10） */
export function getPage6EditableFieldIndexes(): number[] {
  return [...PAGE6_EDITABLE_FIELDS].map(field => Number(field.slice(1)));
}

export const PAGE6_ANT_COLUMNS: Page6AntColumn[] = [
  { ...leaf('组合方案', 'p0', SCHEME_COMBO_WIDTH), fixed: 'left' as const },
  {
    title: '初算指标',
    align: 'center',
    children: [metricGroup('舟它最大输出力矩', 'p1', 'Nm'), metricGroup('舟它最大空载速度', 'p2', '°/S'), metricGroup('舟它额定负载速度', 'p3', '°/S')],
  },
  leaf('理论总减速比', 'p4', 145),
  leaf('理论齿轮减速比', 'p5', 150),
  {
    title: '齿轮减速比允许的范围',
    align: 'center',
    children: [leaf('最小值', 'p6', 130), leaf('最大值', 'p7', 130)],
  },
  leaf('齿轮减速级数', 'p8', 150),
  {
    title: '第一级减速',
    align: 'center',
    children: [leaf('电机齿数', 'p9'), leaf('第一级从动轮齿数', 'p10', SCHEME_LONG_TITLE_WIDTH, 'editable')],
  },
  {
    title: '第二级减速',
    align: 'center',
    children: [leaf('第二级主动轮齿数', 'p11', SCHEME_MID_TITLE_WIDTH, 'editable'), leaf('第二级从动轮齿数', 'p12', SCHEME_MID_TITLE_WIDTH, 'editable')],
  },
  {
    title: '第三级减速',
    align: 'center',
    children: [leaf('第三级主动轮齿数', 'p13', SCHEME_MID_TITLE_WIDTH, 'editable'), leaf('第三级从动轮齿数', 'p14', SCHEME_MID_TITLE_WIDTH, 'editable')],
  },
  leaf('实际齿轮减速比', 'p15', 150),
  leaf('实际零位总减速比', 'p16', 155),
];

export function flattenPage6LeafColumns(columns: Page6AntColumn[]): Page6AntColumn[] {
  const result: Page6AntColumn[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenPage6LeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export const PAGE6_LEAF_COLUMNS = flattenPage6LeafColumns(PAGE6_ANT_COLUMNS);
export const PAGE6_TABLE_MIN_WIDTH = sumTableColumnWidths(PAGE6_ANT_COLUMNS, { extra: 48 });

export function isPage6CellDisabled(record: Record<string, string | number | undefined>, field: string): boolean {
  const idx = field.replace(/^p/, '');
  return record[`cellInputOrOutput${idx}`] === '1';
}
