import type { Page9GearRow, Page9ParameterItem, Page9SchemeRow } from './parameterDefaults';
import { getGearDisplayRows, setGearDisplayRows } from './initData';

export function getSchemeTableRows(list: Page9ParameterItem[]): Page9SchemeRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as Page9SchemeRow[];
}

export function setSchemeTableRows(list: Page9ParameterItem[], rows: Page9SchemeRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function getLoadCoefficient(list: Page9ParameterItem[]): string {
  return String(list[1]?.defaultValue ?? '1.2');
}

export function setLoadCoefficient(list: Page9ParameterItem[], value: string) {
  if (list[1]) {
    list[1].defaultValue = value;
  }
}

export function applyLoadCoefficientToGearRows(list: Page9ParameterItem[], value: string) {
  const rows = getGearDisplayRows(list);
  if (!rows.length) return;
  rows.forEach(row => {
    row.p8 = value;
  });
  setGearDisplayRows(list, rows);
}

export { getGearDisplayRows, setGearDisplayRows };

export function updateGearRowField(
  rows: Page9GearRow[],
  index: number,
  field: keyof Page9GearRow,
  value: string,
) {
  if (!rows[index]) return;
  rows[index][field] = value;
  if (field === 'p2' && (index === 2 || index === 4) && rows[index + 1]) {
    rows[index + 1].p2 = value;
  }
  if (field === 'p4' && (index === 2 || index === 4) && rows[index + 1]) {
    rows[index + 1].p4 = value;
  }
}
