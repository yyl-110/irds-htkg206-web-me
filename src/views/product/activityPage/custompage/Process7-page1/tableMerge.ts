import type { TableColumnType } from 'ant-design-vue';

type TableRow = Record<string, unknown>;

/** 对应 rx-table7 flitterData1：按字段值合并相邻行 */
export function computeRowSpansByField(rows: TableRow[], field: string): number[] {
  const spans: number[] = [];
  let anchor = 0;
  rows.forEach((row, index) => {
    if (index === 0) {
      spans.push(1);
      return;
    }
    if (row[field] === rows[index - 1][field]) {
      spans[anchor] += 1;
      spans.push(0);
    } else {
      spans.push(1);
      anchor = index;
    }
  });
  return spans;
}

const TABLE2_SUMMARY_P0 = '低压直流母线总输出功率';

const TABLE3_SUMMARY_P0 = new Set([
  '低压直流母线总输出功率',
  '电源机柜总输入功率（AD/DC组合总输入功率）',
  '总交流输入功率',
]);

function p0RowSpanCell(rows: TableRow[], rowIndex: number) {
  const rowSpan = computeRowSpansByField(rows, 'p0')[rowIndex] ?? 1;
  return rowSpan > 0 ? { rowSpan } : { rowSpan: 0 };
}

function summaryColSpanCell(p0: unknown, dataIndex: string, summarySet: Set<string> | string) {
  const isSummary =
    typeof summarySet === 'string' ? p0 === summarySet : summarySet.has(String(p0));
  if (!isSummary) return {};
  if (dataIndex === 'p0') return { colSpan: 2 };
  if (dataIndex === 'p1') return { colSpan: 0 };
  return {};
}

/** merge="00" / merge="02"：第一列按 p0 合并 */
export function withP0RowSpanMerge(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  return columns.map(col => {
    if (col.dataIndex !== 'p0') return { ...col };
    return {
      ...col,
      customCell: (_record, rowIndex) => {
        if (rowIndex == null) return {};
        return p0RowSpanCell(getRows(), rowIndex);
      },
    };
  });
}

/** merge="01"：第一列按 p0 合并，汇总行 p0/p1 横向合并 */
export function withMerge01Columns(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (dataIndex !== 'p0' && dataIndex !== 'p1') return { ...col };
    return {
      ...col,
      customCell: (record, rowIndex) => {
        const colSpan = summaryColSpanCell(record.p0, dataIndex, TABLE2_SUMMARY_P0);
        if (Object.keys(colSpan).length) return colSpan;
        if (dataIndex !== 'p0' || rowIndex == null) return {};
        return p0RowSpanCell(getRows(), rowIndex);
      },
    };
  });
}

/** merge="02"：第一列按 p0 合并，汇总行 p0/p1 横向合并 */
export function withMerge02Columns(columns: TableColumnType[], getRows: () => TableRow[]): TableColumnType[] {
  return columns.map(col => {
    const dataIndex = String(col.dataIndex ?? '');
    if (dataIndex !== 'p0' && dataIndex !== 'p1') return { ...col };
    return {
      ...col,
      customCell: (record, rowIndex) => {
        const colSpan = summaryColSpanCell(record.p0, dataIndex, TABLE3_SUMMARY_P0);
        if (Object.keys(colSpan).length) return colSpan;
        if (dataIndex !== 'p0' || rowIndex == null) return {};
        return p0RowSpanCell(getRows(), rowIndex);
      },
    };
  });
}
