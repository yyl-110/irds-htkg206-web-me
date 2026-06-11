import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { mergeSavedParamsIntoList as mergePage0_5SavedParamsIntoList } from '../page0-5/loadPageParameters';
import {
  applyPage0_4TableComponentIds,
  createDefaultPage0_4ParameterList,
  type Page0_4ParameterItem,
} from './parameterDefaults';

export type { Page0_4ParameterItem };

async function applyActivityParameterIds(
  pageId: string,
  list: Page0_4ParameterItem[],
): Promise<Page0_4ParameterItem[]> {
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

export async function loadPage0_4PageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Page0_4ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultPage0_4ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  list = mergePage0_5SavedParamsIntoList(list, saved);
  return applyPage0_4TableComponentIds(list);
}
