import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultFs151_6ParameterList, type Fs151_6ParameterItem } from './parameterDefaults';

export type { Fs151_6ParameterItem };

async function applyActivityParameterIds(pageId: string, list: Fs151_6ParameterItem[]): Promise<Fs151_6ParameterItem[]> {
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

export async function loadFs151_6PageParameters(pageId: string): Promise<Fs151_6ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultFs151_6ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
