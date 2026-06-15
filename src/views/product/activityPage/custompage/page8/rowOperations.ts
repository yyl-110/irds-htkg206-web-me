import {
  createSelectionParamItem,
  PAGE8_SEL_INDEX_PARAM,
  PAGE8_TABLE_COMPONENT_ID,
  PAGE8_TABLE_NUM,
  type Page8ParameterItem,
  type Page8TableRow,
} from './parameterDefaults';

type Page8SavedParamRow = { paramCode?: string; paramKey?: string; paramValue?: string };
type Page8SavedTableRow = {
  tableNum?: string;
  tablenum?: string;
  componentId?: string | number;
  rowData?: unknown[];
  rowdata?: unknown[];
  values?: unknown[];
};

export function page8TableRowKey(record: Page8TableRow, index?: number): string {
  const idx = index ?? 0;
  const scheme = String(record.p0 ?? '').trim();
  return scheme ? `${idx}::${scheme}` : String(idx);
}

export function getPage8TableRows(list: Page8ParameterItem[]): Page8TableRow[] {
  return list[0]?.tableMap?.rowData ?? [];
}

export function setPage8TableRows(list: Page8ParameterItem[], rows: Page8TableRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

function resolveSavedTableNum(table: Page8SavedTableRow): string {
  const direct = String(table.tableNum ?? table.tablenum ?? '').trim();
  if (direct) return direct;
  const componentId = String(table.componentId ?? '').trim();
  if (componentId === String(PAGE8_TABLE_COMPONENT_ID)) return PAGE8_TABLE_NUM;
  return '';
}

function savedTableHasRowData(table: Page8SavedTableRow): boolean {
  const rows = table.rowData ?? table.rowdata ?? table.values;
  return Array.isArray(rows) && rows.length > 0;
}

/** 判断 page8 是否已有本页保存快照（组合方案表或勾选索引） */
export function hasPage8SavedData(
  savedTables?: Page8SavedTableRow[] | null,
  savedParamValues?: Page8SavedParamRow[] | null,
): boolean {
  const tables = Array.isArray(savedTables) ? savedTables : [];
  for (const table of tables) {
    if (resolveSavedTableNum(table) !== PAGE8_TABLE_NUM) continue;
    if (savedTableHasRowData(table)) return true;
  }

  const params = Array.isArray(savedParamValues) ? savedParamValues : [];
  return params.some(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    return code === PAGE8_SEL_INDEX_PARAM && String(row?.paramValue ?? '').trim() !== '';
  });
}

export function parsePage8SelectionIndexes(selIndexs: string): number[] {
  const raw = String(selIndexs ?? '').trim();
  if (!raw || raw === ',') return [];
  return raw
    .split(',')
    .map(part => Number(part.trim()))
    .filter(index => !Number.isNaN(index) && index >= 0);
}

export function getPage8SelectionParamValue(
  list: Page8ParameterItem[],
  saved?: Page8SavedParamRow[] | null,
): string {
  const fromList = list.find(item => item.parameterNum === PAGE8_SEL_INDEX_PARAM)?.defaultValue;
  if (fromList !== undefined && String(fromList).trim() !== '') {
    return String(fromList);
  }
  const hit = (saved ?? []).find(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    return code === PAGE8_SEL_INDEX_PARAM;
  });
  return String(hit?.paramValue ?? '');
}

export function clearPage8SelectionParam(list: Page8ParameterItem[]) {
  const selItem = list.find(item => item.parameterNum === PAGE8_SEL_INDEX_PARAM);
  if (selItem) {
    selItem.defaultValue = '';
  }
}

export function resolvePage8SelectedRowKeys(
  list: Page8ParameterItem[],
  saved?: Page8SavedParamRow[] | null,
): string[] {
  const rows = getPage8TableRows(list);
  const indexes = parsePage8SelectionIndexes(getPage8SelectionParamValue(list, saved));
  const index = indexes.find(i => i < rows.length);
  if (index === undefined) return [];
  return [page8TableRowKey(rows[index], index)];
}

/** 无选中项时默认选中第一行，并同步勾选索引参数 */
export function ensurePage8Selection(
  list: Page8ParameterItem[],
  selectedKeys: Array<string | number>,
): { keys: string[]; rows: Page8TableRow[] } {
  const rows = getPage8TableRows(list);
  if (!rows.length) {
    return { keys: [], rows: [] };
  }

  let index = -1;
  for (const key of selectedKeys) {
    const keyStr = String(key);
    const hit = rows.findIndex((row, rowIndex) => page8TableRowKey(row, rowIndex) === keyStr);
    if (hit >= 0) {
      index = hit;
      break;
    }
  }

  if (index < 0) {
    index = 0;
  }

  const selectedRows = [rows[index]];
  syncPage8SelectionIndexes(list, selectedRows);
  return { keys: [page8TableRowKey(rows[index], index)], rows: selectedRows };
}

/** 同步勾选行索引到 parameterTempList（原 selectModelListCheck） */
export function syncPage8SelectionIndexes(list: Page8ParameterItem[], selectedRows: Page8TableRow[]) {
  const rows = getPage8TableRows(list);
  let selIndexs = '';

  selectedRows.forEach(selected => {
    const index = rows.indexOf(selected);
    if (index >= 0) {
      selIndexs += `${index},`;
    }
  });

  if (list.length < 2) {
    const pageId = String(list[0]?.pageId ?? '');
    const userid = String(list[0]?.userid ?? '');
    list.push(createSelectionParamItem(pageId, userid));
  }

  const selItem = list.find(item => item.parameterNum === PAGE8_SEL_INDEX_PARAM) ?? list[1];
  if (selItem) {
    selItem.defaultValue = selIndexs;
    if (!selItem.parameterNum) {
      selItem.parameterNum = PAGE8_SEL_INDEX_PARAM;
    }
  }
}

