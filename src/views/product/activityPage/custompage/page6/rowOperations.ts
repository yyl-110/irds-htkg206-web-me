import type { Page6ParameterItem, Page6TableRow } from './parameterDefaults';

export function getPage6TableRows(list: Page6ParameterItem[]): Page6TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage6TableRows(list: Page6ParameterItem[], rows: Page6TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

