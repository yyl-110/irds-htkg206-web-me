import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultPage11ParameterList, type Page11ParameterItem } from './parameterDefaults';

export type { Page11ParameterItem };

async function applyActivityParameterIds(pageId: string, list: Page11ParameterItem[]): Promise<Page11ParameterItem[]> {
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

export async function loadPage11PageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Page11ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultPage11ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  if (saved?.length) {
    const savedMap = new Map<string, string>();
    saved.forEach(row => {
      const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
      if (code) savedMap.set(code, String(row?.paramValue ?? ''));
    });
    list = list.map(item => {
      const num = String(item.parameterNum ?? '').trim();
      if (num && savedMap.has(num)) {
        return { ...item, defaultValue: savedMap.get(num) };
      }
      return item;
    });
  }
  return list;
}
