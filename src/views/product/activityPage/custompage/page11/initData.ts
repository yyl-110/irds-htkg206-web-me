import { PAGE10_INPUT_TABLE_NUM } from '../page10/parameterDefaults';
import { resolvePage9SchemeSourceRows } from '../page9/initData';
import type { Page9SchemeRow } from '../page9/parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import type { Page11ParameterItem, Page11SchemeRow } from './parameterDefaults';

function firstNonEmpty(...values: Array<string | number | undefined>): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

function findRowByScheme(
  list: Page9SchemeRow[],
  schemeIndex: number,
  schemeLabel: string,
): Page9SchemeRow | undefined {
  if (list[schemeIndex]) return list[schemeIndex];
  return list.find(row => String(row.p0 ?? '').trim() === schemeLabel);
}

function readMaxOutputTorqueFromFlow(
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): string {
  const paramList = getFlowParameterList();
  let val = '';
  (savedParamValues ?? []).forEach(row => {
    const key = String(row.paramKey ?? row.paramCode ?? '').trim();
    if (!val && key === 'DJ2_4_SCLJ_MAX') {
      val = String(row.paramValue ?? '').trim();
    }
  });
  if (!val) {
    paramList.forEach(item => {
      if (!val && item.paramnum === 'DJ2_4_SCLJ_MAX') {
        val = String(item.paramvalue ?? '').trim();
      }
    });
  }
  return val;
}

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

/** 从 page8 / page5-7 等上游刷新初算指标（含舟它最大输出力矩 p1） */
export function refreshPage11SchemePerformanceFields(
  list: Page11ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): boolean {
  const upstreamRows = resolvePage9SchemeSourceRows(savedTables);
  const flowMaxTorque = readMaxOutputTorqueFromFlow(savedParamValues);
  if (!list[0]?.tableMap?.rowData?.length) {
    return false;
  }

  const rows = list[0].tableMap.rowData as Page11SchemeRow[];
  rows.forEach((row, index) => {
    const schemeLabel = String(row.p0 ?? `组合方案${index + 1}`).trim();
    const upstream = findRowByScheme(upstreamRows, index, schemeLabel);
    const maxTorque = firstNonEmpty(upstream?.p1, flowMaxTorque);
    if (maxTorque) {
      row.p1 = maxTorque;
    }
    if (upstream?.p2) row.p2 = upstream.p2;
    if (upstream?.p3) row.p3 = upstream.p3;
  });
  return upstreamRows.length > 0 || !!flowMaxTorque;
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
