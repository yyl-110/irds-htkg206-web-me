import { PAGE6_TABLE_COMPONENT_ID, PAGE6_TABLE_NUM, type Page6ParameterItem, type Page6TableRow } from './parameterDefaults';

type Page6SavedTableRow = {
  tableNum?: string;
  tablenum?: string;
  componentId?: string | number;
  rowData?: Array<Record<string, string | number | undefined>>;
  rowdata?: Array<Record<string, string | number | undefined>>;
  values?: Array<Record<string, string | number | undefined>>;
};

/** 齿数输入列 p10-p14 与计算输出列 p15-p16 */
const PAGE6_SAVED_VALUE_COLUMN_INDEXES = [10, 11, 12, 13, 14, 15, 16];

function resolveSavedTableNum(table: Page6SavedTableRow): string {
  const direct = String(table.tableNum ?? table.tablenum ?? '').trim();
  if (direct) return direct;
  const componentId = String(table.componentId ?? '').trim();
  if (componentId === String(PAGE6_TABLE_COMPONENT_ID)) return PAGE6_TABLE_NUM;
  return '';
}

function savedRowHasPage6UserData(row: Record<string, string | number | undefined>): boolean {
  for (const index of PAGE6_SAVED_VALUE_COLUMN_INDEXES) {
    const pKey = `p${index}`;
    const cKey = `c${index + 1}`;
    if (String(row[pKey] ?? '').trim() !== '') return true;
    if (String(row[cKey] ?? '').trim() !== '') return true;
  }
  return false;
}

function savedTableHasPage6UserData(table: Page6SavedTableRow): boolean {
  const rows = table.rowData ?? table.rowdata ?? table.values;
  if (!Array.isArray(rows) || rows.length === 0) return false;
  return rows.some(row => savedRowHasPage6UserData(row ?? {}));
}

/** 判断 page6 是否已有本页保存快照（齿数或计算结果） */
export function hasPage6SavedData(savedTables?: Page6SavedTableRow[] | null): boolean {
  const tables = Array.isArray(savedTables) ? savedTables : [];
  for (const table of tables) {
    if (resolveSavedTableNum(table) !== PAGE6_TABLE_NUM) continue;
    if (savedTableHasPage6UserData(table)) return true;
  }
  return false;
}

export function getPage6TableRows(list: Page6ParameterItem[]): Page6TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage6TableRows(list: Page6ParameterItem[], rows: Page6TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

