import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultConditionColumns,
  createDefaultZt1_532AParameterList,
  parseConditionColumnsFromHeader,
  type ConditionColumnDef,
  type Zt1_532AParameterItem,
} from './parameterDefaults';

export type { Zt1_532AParameterItem };

async function applyActivityParameterIds(pageId: string, list: Zt1_532AParameterItem[]): Promise<Zt1_532AParameterItem[]> {
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

export async function loadZt1_532APageParameters(pageId: string): Promise<Zt1_532AParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1_532AParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}

export function resolveConditionColumns(list: Zt1_532AParameterItem[]): ConditionColumnDef[] {
  return parseConditionColumnsFromHeader(list[0]?.tableheader) ?? createDefaultConditionColumns();
}
