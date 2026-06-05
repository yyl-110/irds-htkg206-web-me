import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultZt1_532BParameterList, type Zt1_532BParameterItem } from './parameterDefaults';

export type { Zt1_532BParameterItem };

async function applyActivityParameterIds(pageId: string, list: Zt1_532BParameterItem[]): Promise<Zt1_532BParameterItem[]> {
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
      const num = String(item.tableNum ?? '').trim();
      const hit = num ? byNum.get(num) : null;
      if (!hit) return item;
      const pid = String(hit?.id ?? hit?.parameterId ?? '').trim();
      return pid ? { ...item, parameterId: pid } : item;
    });
  } catch {
    return list;
  }
}

export async function loadZt1_532BPageParameters(pageId: string): Promise<Zt1_532BParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1_532BParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
