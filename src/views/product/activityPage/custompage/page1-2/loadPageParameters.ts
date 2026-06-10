import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  mergeSavedParamsIntoList,
  type CustomPageSavedParamRow,
} from '../_shared/utils/taskParamMapMerge';
export { fetchTaskParamMapFromRoute } from '../_shared/utils/fetchTaskParamMap';
import { createDefaultPage1_2ParameterList, type Page1_2ParameterItem } from './parameterDefaults';

export type { Page1_2ParameterItem };

export { mergeSavedParamsIntoList };

async function applyActivityParameterIds(
  pageId: string,
  list: Page1_2ParameterItem[],
): Promise<Page1_2ParameterItem[]> {
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

export async function loadPage1_2PageParameters(
  pageId: string,
  saved?: CustomPageSavedParamRow[] | null,
): Promise<Page1_2ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultPage1_2ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return mergeSavedParamsIntoList(list, saved);
}
