import type { Page3_1ParameterItem, Page3_1TableRow } from './parameterDefaults';

export function getPage3_1TableRows(list: Page3_1ParameterItem[]): Page3_1TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage3_1TableRows(list: Page3_1ParameterItem[], rows: Page3_1TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}
