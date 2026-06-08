import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultFs151_1_1MParameterList, type Fs151_1_1MParameterItem } from './parameterDefaults';

export type { Fs151_1_1MParameterItem };

async function applyActivityParameterIds(pageId: string, list: Fs151_1_1MParameterItem[]): Promise<Fs151_1_1MParameterItem[]> {
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

export async function loadFs151_1_1MPageParameters(pageId: string): Promise<Fs151_1_1MParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultFs151_1_1MParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}

export function extractFs151_1_1MSaveParamValues(list: Fs151_1_1MParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap?.rowData) return;
    const key = String(item.parameterNum ?? item.tableNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
