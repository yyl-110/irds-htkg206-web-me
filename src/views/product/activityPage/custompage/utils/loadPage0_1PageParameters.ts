import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultPage0_1ParameterList,
  type Page0_1ParameterItem,
} from '../config/page0_1ParameterDefaults';

export type { Page0_1ParameterItem };

export function mergeSavedParamsIntoList(
  list: Page0_1ParameterItem[],
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Page0_1ParameterItem[] {
  const savedMap = new Map<string, string>();
  (saved || []).forEach(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (code) savedMap.set(code, String(row?.paramValue ?? ''));
  });
  return list.map(item => {
    const num = String(item.parameterNum ?? '').trim();
    if (num && savedMap.has(num)) {
      const savedVal = savedMap.get(num);
      if (savedVal !== undefined && savedVal !== '') {
        return { ...item, defaultValue: savedVal };
      }
    }
    return { ...item };
  });
}

async function applyActivityParameterIds(pageId: string, list: Page0_1ParameterItem[]): Promise<Page0_1ParameterItem[]> {
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

export async function loadPage0_1PageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Page0_1ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultPage0_1ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return mergeSavedParamsIntoList(list, saved);
}
