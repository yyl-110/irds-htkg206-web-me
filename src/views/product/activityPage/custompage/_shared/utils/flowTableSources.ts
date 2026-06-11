import { getFlowTableList } from '../../shared/flowContext';

export type FlowTableSource = {
  tablenum?: string;
  tableNum?: string;
  componentId?: string | number;
  rowdata?: Array<Record<string, string | number | undefined>>;
  rowData?: Array<Record<string, string | number | undefined>>;
  values?: Array<Record<string, string | number | undefined>>;
};

export type TableMatcher = {
  tableNum?: string;
  componentId?: string | number;
};

export function readTableCell(row: Record<string, string | number | undefined> | undefined, pIndex: number): string {
  if (!row) return '';
  const pVal = String(row[`p${pIndex}`] ?? '').trim();
  if (pVal) return pVal;
  return String(row[`c${pIndex + 1}`] ?? '').trim();
}

export function normalizeTableRows(table: FlowTableSource): Array<Record<string, string | number | undefined>> {
  const rows = table.rowdata ?? table.rowData ?? table.values;
  return Array.isArray(rows) ? rows : [];
}

export function normalizeRowCells(
  row: Record<string, string | number | undefined>,
  maxPIndex: number,
): Record<string, string | number | undefined> {
  const next: Record<string, string | number | undefined> = { ...row };
  for (let i = 0; i <= maxPIndex; i++) {
    const val = readTableCell(row, i);
    if (val) next[`p${i}`] = val;
  }
  return next;
}

export function collectTableSources(savedTables?: Array<Record<string, unknown>> | null): FlowTableSource[] {
  const sources: FlowTableSource[] = getFlowTableList().map(item => ({
    tablenum: item.tablenum,
    componentId: item.componentId,
    rowdata: item.rowdata,
  }));
  (Array.isArray(savedTables) ? savedTables : []).forEach(raw => {
    if (!raw || typeof raw !== 'object') return;
    sources.push(raw as FlowTableSource);
  });
  return sources;
}

function tableMatches(table: FlowTableSource, matcher: TableMatcher): boolean {
  const tableNum = String(table.tablenum ?? table.tableNum ?? '').trim();
  const componentId = String(table.componentId ?? '').trim();
  const wantTableNum = String(matcher.tableNum ?? '').trim();
  const wantComponentId = String(matcher.componentId ?? '').trim();
  if (!wantTableNum && !wantComponentId) return false;
  if (wantTableNum && tableNum === wantTableNum) return true;
  if (wantComponentId && componentId === wantComponentId) return true;
  return false;
}

/** 按 tableNum / componentId 从 flowContext + savedTables 读取上游表格行 */
export function resolveTableRows(
  sources: FlowTableSource[],
  matchers: TableMatcher[],
  maxPIndex = 30,
): Array<Record<string, string | number | undefined>> {
  for (const matcher of matchers) {
    for (const table of sources) {
      if (!tableMatches(table, matcher)) continue;
      const rows = normalizeTableRows(table).map(row => normalizeRowCells(row, maxPIndex));
      if (rows.length) return rows;
    }
  }
  return [];
}
