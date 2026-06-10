import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultPage0_5ParameterList, type Page0_5ParameterItem } from './parameterDefaults';

export type { Page0_5ParameterItem };

function mergeTableRowSavedValues(
  row: Record<string, string>,
  colNums: number,
  savedMap: Map<string, string>,
): Record<string, string> {
  const nextRow = { ...row };
  for (let i = 0; i < colNums; i++) {
    const paramKey = String(row[`cellParentNum${i}`] ?? '').trim();
    if (!paramKey || !savedMap.has(paramKey)) continue;
    const savedVal = savedMap.get(paramKey);
    if (savedVal !== undefined && savedVal !== '') {
      nextRow[`p${i}`] = savedVal;
    }
  }
  return nextRow;
}

export function mergeSavedParamsIntoList(
  list: Page0_5ParameterItem[],
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Page0_5ParameterItem[] {
  const savedMap = new Map<string, string>();
  (saved || []).forEach(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (code) savedMap.set(code, String(row?.paramValue ?? ''));
  });
  return list.map(item => {
    let nextItem: Page0_5ParameterItem = { ...item };

    const num = String(item.parameterNum ?? '').trim();
    if (num && savedMap.has(num)) {
      const savedVal = savedMap.get(num);
      if (savedVal !== undefined && savedVal !== '') {
        nextItem = { ...nextItem, defaultValue: savedVal };
      }
    }

    if (item.ifSingleLine === 't' && item.tableMap?.rowData?.length) {
      const colNums = Number(item.tableMap.colNums ?? 0);
      const rowData = item.tableMap.rowData.map(row => mergeTableRowSavedValues(row, colNums, savedMap));
      nextItem = {
        ...nextItem,
        tableMap: {
          ...item.tableMap,
          rowData,
        },
      };
    }

    return nextItem;
  });
}

async function applyActivityParameterIds(pageId: string, list: Page0_5ParameterItem[]): Promise<Page0_5ParameterItem[]> {
  if (!pageId) return list;
  try {
    const res = await AdminApiSystemParameter.getParameterActList({ businessId: pageId, type: '2' });
    const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
    const byNum = new Map<string, Record<string, unknown>>();
    rows.forEach((row: Record<string, unknown>) => {
      const num = String(row?.parameterNum ?? row?.paramNum ?? row?.paramCode ?? '').trim();
      if (num) byNum.set(num, row);
    });
    return list.map(item => {
      const num = String(item.parameterNum ?? '').trim();
      const hit = num ? byNum.get(num) : null;
      if (!hit) return item;
      const pid = String(hit?.id ?? hit?.parameterId ?? '').trim();
      return pid ? { ...item, parameterId: pid } : item;
    });
  } catch {
    return list;
  }
}

export async function loadPage0_5PageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Page0_5ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultPage0_5ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return mergeSavedParamsIntoList(list, saved);
}
