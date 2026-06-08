import type { TableColumnType } from 'ant-design-vue';
import { computeRowSpansByField } from '../Process7-page1/tableMerge';

type TableRow = Record<string, unknown>;

const TABLE2_SUMMARY_P0 = new Set([
  '高压直流用电设备总功率',
  '电源机柜总输入功率（高压DC/DC模块总输入功率）',
  '高压直流母线总输出功率',
  '总交流输入功率',
]);

function p0RowSpanCell(rows: TableRow[], rowIndex: number) {
  const rowSpan = computeRowSpansByField(rows, 'p0')[rowIndex] ?? 1;
  return rowSpan > 0 ? { rowSpan } : { rowSpan: 0 };
}

function summaryColSpanCell(p0: unknown, dataIndex: string) {
  if (!TABLE2_SUMMARY_P0.has(String(p0))) return {};
  if (dataIndex === 'p0') return { colSpan: 2 };
  if (dataIndex === 'p1') return { colSpan: 0 };
  return {};
}

/** merge="20"：p0 全合并；p4/p6 在「高压直流」行按 p0 合并 */
export function withMerge20Columns(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (dataIndex === 'p0') {
      return {
        ...col,
        customCell: (_record, rowIndex) => {
          if (rowIndex == null) return {};
          return p0RowSpanCell(getRows(), rowIndex);
        },
      };
    }
    if (dataIndex === 'p4' || dataIndex === 'p6') {
      return {
        ...col,
        customCell: (record, rowIndex) => {
          if (record.p0 !== '高压直流' || rowIndex == null) return {};
          return p0RowSpanCell(getRows(), rowIndex);
        },
      };
    }
    return { ...col };
  });
}

/** merge="21"：p0 合并 + 汇总行横向合并；p3 在「高压直流用电设备功率」行按 p0 合并 */
export function withMerge21Columns(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (dataIndex === 'p0') {
      return {
        ...col,
        customCell: (record, rowIndex) => {
          const colSpan = summaryColSpanCell(record.p0, dataIndex);
          if (Object.keys(colSpan).length) return colSpan;
          if (rowIndex == null) return {};
          return p0RowSpanCell(getRows(), rowIndex);
        },
      };
    }
    if (dataIndex === 'p1') {
      return {
        ...col,
        customCell: record => summaryColSpanCell(record.p0, dataIndex),
      };
    }
    if (dataIndex === 'p3') {
      return {
        ...col,
        customCell: (record, rowIndex) => {
          if (record.p0 !== '高压直流用电设备功率' || rowIndex == null) return {};
          return p0RowSpanCell(getRows(), rowIndex);
        },
      };
    }
    return { ...col };
  });
}
