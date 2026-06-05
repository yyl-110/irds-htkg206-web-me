import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultZt1ParameterList, type Zt1ParameterItem } from './parameterDefaults';

export type { Zt1ParameterItem };

async function applyActivityParameterIds(pageId: string, list: Zt1ParameterItem[]): Promise<Zt1ParameterItem[]> {
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
      const num = String(item.parameterNum ?? item.tableNum ?? '').trim();
      const hit = num ? byNum.get(num) : null;
      if (!hit) return item;
      const pid = String(hit?.id ?? hit?.parameterId ?? '').trim();
      return pid ? { ...item, parameterId: pid } : item;
    });
  } catch {
    return list;
  }
}

export async function loadZt1PageParameters(pageId: string): Promise<Zt1ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
