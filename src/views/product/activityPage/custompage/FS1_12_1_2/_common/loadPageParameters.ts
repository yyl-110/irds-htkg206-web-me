import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultAdapterParameterList, type AdapterPageConfig, type AdapterParameterItem } from './parameterDefaults';

export type { AdapterParameterItem };

async function applyActivityParameterIds(pageId: string, list: AdapterParameterItem[]): Promise<AdapterParameterItem[]> {
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

export async function loadAdapterPageParameters(
  config: AdapterPageConfig,
  pageId: string,
): Promise<AdapterParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultAdapterParameterList(config, pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}

export function extractAdapterSaveParamValues(list: AdapterParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap?.rowData) return;
    const key = String(item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
