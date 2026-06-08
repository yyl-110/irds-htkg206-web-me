import type { TableColumnType } from 'ant-design-vue';
import { computeRowSpansByField } from '../Process7-page1/tableMerge';

type TableRow = Record<string, unknown>;

const TABLE2_SUMMARY_P0 = '总低压直流输出功率';

function p0RowSpanCell(rows: TableRow[], rowIndex: number) {
  const rowSpan = computeRowSpansByField(rows, 'p0')[rowIndex] ?? 1;
  return rowSpan > 0 ? { rowSpan } : { rowSpan: 0 };
}

/** merge="10"：p0 / p3 / p6 列按供电支路 p0 纵向合并 */
export function withMerge10Columns(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  const mergeFields = new Set(['p0', 'p3', 'p6']);
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (!mergeFields.has(dataIndex)) return { ...col };
    return {
      ...col,
      customCell: (_record, rowIndex) => {
        if (rowIndex == null) return {};
        return p0RowSpanCell(getRows(), rowIndex);
      },
    };
  });
}

/** merge="11"：汇总行 p0/p1 横向合并 */
export function withMerge11Columns(columns: TableColumnType[]): TableColumnType[] {
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (dataIndex !== 'p0' && dataIndex !== 'p1') return { ...col };
    return {
      ...col,
      customCell: record => {
        if (record.p0 !== TABLE2_SUMMARY_P0) return {};
        if (dataIndex === 'p0') return { colSpan: 2 };
        return { colSpan: 0 };
      },
    };
  });
}
