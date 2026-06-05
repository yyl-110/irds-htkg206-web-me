import { PAGE10_INPUT_TABLE_NUM } from '../page10/parameterDefaults';
import { getFlowTableList } from '../shared/flowContext';
import type { Page11ParameterItem, Page11SchemeRow } from './parameterDefaults';

export interface Page11InitResult {
  ok: boolean;
}

export function getSchemeTableRows(list: Page11ParameterItem[]): Page11SchemeRow[] {
  return (list[0]?.tableMap?.rowData ?? []) as Page11SchemeRow[];
}

export function setSchemeTableRows(list: Page11ParameterItem[], rows: Page11SchemeRow[]) {
  if (!list[0]?.tableMap) return;
  list[0].tableMap.rowData = rows;
  list[0].tableMap.rowNums = rows.length;
}

export function getSelectedRowIndex(list: Page11ParameterItem[]): number {
  return Number(list[1]?.defaultValue ?? -1);
}

export function setSelectedRowIndex(list: Page11ParameterItem[], index: number) {
  if (list[1]) list[1].defaultValue = String(index);
}

export function normalizeSelectedRowIndex(list: Page11ParameterItem[]): number {
  const rows = getSchemeTableRows(list);
  let index = getSelectedRowIndex(list);
  if (Number.isNaN(index) || index < -1 || index >= rows.length) {
    index = -1;
    setSelectedRowIndex(list, index);
  }
  return index;
}

/** 从 page10 组合方案表刷新（原 initData） */
export function applyPage11InitData(list: Page11ParameterItem[]): Page11InitResult {
  const tableList = getFlowTableList();
  let sourceRows: Page11SchemeRow[] = [];

  tableList.forEach(item => {
    if (item.tablenum === PAGE10_INPUT_TABLE_NUM) {
      sourceRows = (item.rowdata ?? []) as Page11SchemeRow[];
    }
  });

  if (!list[0]?.tableMap || sourceRows.length === 0) {
    return { ok: false };
  }

  setSchemeTableRows(list, sourceRows.map(row => ({ ...row })));
  setSelectedRowIndex(list, -1);
  return { ok: true };
}

export function findSchemeRowIndex(list: Page11ParameterItem[], schemeKey: string): number {
  const rows = getSchemeTableRows(list);
  return rows.findIndex(row => row.p0 === schemeKey);
}

export function applySchemeSelection(list: Page11ParameterItem[], selected: Page11SchemeRow[]) {
  if (!selected.length) {
    setSelectedRowIndex(list, -1);
    return;
  }
  const index = findSchemeRowIndex(list, String(selected[0].p0 ?? ''));
  setSelectedRowIndex(list, index >= 0 ? index : -1);
}
