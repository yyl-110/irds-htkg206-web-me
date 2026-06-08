import type { TableColumnType } from 'ant-design-vue';

export type MergeTableRow = Record<string, unknown>;

/** 相邻相同值行合并（对应 legacy flitterData / flitterData1） */
export function computeRowSpansByField(rows: MergeTableRow[], field: string): number[] {
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

function rowSpanAt(rows: MergeTableRow[], rowIndex: number, field: string) {
  const rowSpan = computeRowSpansByField(rows, field)[rowIndex] ?? 1;
  return rowSpan > 0 ? { rowSpan } : { rowSpan: 0 };
}

type AntColumn = TableColumnType & { dataIndex?: string | number };

function columnIndexOf(columns: AntColumn[], dataIndex: string): number {
  return columns.findIndex(col => String(col.dataIndex ?? '') === dataIndex);
}

function withColumnRowSpan(
  columns: AntColumn[],
  getRows: () => MergeTableRow[],
  dataIndex: string,
  field: string,
  rowFilter?: (row: MergeTableRow) => boolean,
): AntColumn[] {
  const colIdx = columnIndexOf(columns, dataIndex);
  if (colIdx < 0) return columns;

  return columns.map((col, index) => {
    if (index !== colIdx) return col;
    return {
      ...col,
      customCell: (record: MergeTableRow, rowIndex?: number) => {
        if (rowIndex == null) return {};
        if (rowFilter && !rowFilter(record)) return {};
        return rowSpanAt(getRows(), rowIndex, field);
      },
    };
  });
}

/**
 * legacy rx-table merge 规则（columnIndex 按 ant columns 顺序）
 * - 00/02: 第 0 列按 powerType
 * - 10: 第 0、3 列按 a1
 * - 20: 第 0 列按 a1；第 4 列在 a1=高压直流 时按 a1
 * - 21: 第 0 列按 a1
 * - 30: 第 0、3 列按 k1（方案表 assembleData 字段）
 */
export function applyLegacyMergeToColumns(
  columns: AntColumn[],
  getRows: () => MergeTableRow[],
  merge: string,
): AntColumn[] {
  if (!merge) return columns;

  let result = columns.map(col => ({ ...col }));

  if (merge === '00' || merge === '02') {
    result = withColumnRowSpan(result, getRows, String(result[0]?.dataIndex ?? 'p0'), 'powerType');
    return result;
  }

  if (merge === '10') {
    const col0 = String(result[0]?.dataIndex ?? 'p0');
    const col3 = String(result[3]?.dataIndex ?? 'p3');
    result = withColumnRowSpan(result, getRows, col0, 'a1');
    result = withColumnRowSpan(result, getRows, col3, 'a1');
    return result;
  }

  if (merge === '20' || merge === '21') {
    const col0 = String(result[0]?.dataIndex ?? 'p0');
    result = withColumnRowSpan(result, getRows, col0, 'a1');
    if (merge === '20' && result[4]) {
      const col4 = String(result[4]?.dataIndex ?? 'p4');
      result = withColumnRowSpan(result, getRows, col4, 'a1', row => row.a1 === '高压直流');
    }
    return result;
  }

  if (merge === '30') {
    const col0 = String(result[0]?.dataIndex ?? 'p0');
    const col3 = String(result[3]?.dataIndex ?? 'p3');
    result = withColumnRowSpan(result, getRows, col0, 'k1');
    result = withColumnRowSpan(result, getRows, col3, 'k1');
    return result;
  }

  // merge="XY"：按 pX、pY 字段值分别做行合并（如 page6 的 07、08）
  if (/^\d{2}$/.test(merge)) {
    const [x, y] = merge.split('');
    const fieldX = `p${x}`;
    const fieldY = `p${y}`;
    if (columnIndexOf(result, fieldX) >= 0) {
      result = withColumnRowSpan(result, getRows, fieldX, fieldX);
    }
    if (fieldY !== fieldX && columnIndexOf(result, fieldY) >= 0) {
      result = withColumnRowSpan(result, getRows, fieldY, fieldY);
    }
  }

  return result;
}
