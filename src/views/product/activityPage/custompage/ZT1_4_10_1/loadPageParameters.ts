import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultZt1_4101ParameterList, type Zt1_4101ParameterItem } from './parameterDefaults';

export type { Zt1_4101ParameterItem };

async function applyActivityParameterIds(pageId: string, list: Zt1_4101ParameterItem[]): Promise<Zt1_4101ParameterItem[]> {
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

export async function loadZt1_4101PageParameters(pageId: string): Promise<Zt1_4101ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1_4101ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
