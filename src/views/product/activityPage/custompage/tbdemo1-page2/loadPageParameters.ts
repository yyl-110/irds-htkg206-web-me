import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultTbdemo1Page2ParameterList, type Tbdemo1Page2ParameterItem } from './parameterDefaults';

export type { Tbdemo1Page2ParameterItem };

async function applyActivityParameterIds(
  pageId: string,
  list: Tbdemo1Page2ParameterItem[],
): Promise<Tbdemo1Page2ParameterItem[]> {
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

export async function loadTbdemo1Page2Parameters(pageId: string): Promise<Tbdemo1Page2ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultTbdemo1Page2ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
