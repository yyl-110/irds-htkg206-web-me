import type { Page5ParameterItem, Page5TableRow } from './parameterDefaults';

export function getPage5TableRows(list: Page5ParameterItem[]): Page5TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage5TableRows(list: Page5ParameterItem[], rows: Page5TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

