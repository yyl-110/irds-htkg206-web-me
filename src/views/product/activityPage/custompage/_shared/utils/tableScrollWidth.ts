export interface TableColumnLike {
  width?: number;
  dataIndex?: string;
  children?: TableColumnLike[];
}

export function flattenTableLeafColumns<T extends TableColumnLike>(columns: T[]): T[] {
  const result: T[] = [];
  columns.forEach(col => {
    if (col.children?.length) {
      result.push(...flattenTableLeafColumns(col.children));
    } else if (col.dataIndex) {
      result.push(col);
    }
  });
  return result;
}

export function sumTableColumnWidths(
  columns: TableColumnLike[],
  options?: { defaultWidth?: number; extra?: number },
): number {
  const defaultWidth = options?.defaultWidth ?? 140;
  const extra = options?.extra ?? 0;
  return flattenTableLeafColumns(columns).reduce((sum, col) => sum + (col.width ?? defaultWidth), 0) + extra;
}
