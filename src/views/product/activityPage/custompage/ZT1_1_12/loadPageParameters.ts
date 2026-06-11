import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultZt1ParameterList,
  ZT1_1_12_STATS_TABLE_COMPONENT_ID,
  ZT1_1_12_STATS_TABLE_NUM,
  type Zt1ParameterItem,
  type Zt1TableRow,
} from './parameterDefaults';

export type { Zt1ParameterItem };

export type Zt1TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapZt1RowToCValueFormat(row: Zt1TableRow, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

function resolveZt1TableComponentId(item: Zt1ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === ZT1_1_12_STATS_TABLE_NUM) return ZT1_1_12_STATS_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的系统元器件统计表（ZT1_1_12 专用 componentId=38） */
export function extractZt1TableSavePayload(list: Zt1ParameterItem[]): Zt1TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveZt1TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapZt1RowToCValueFormat(row, colNums));
      const rawId = String(resolvedId).trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : resolvedId;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    })
    .filter((row): row is Zt1TableSaveRow => row != null);
}

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

export async function loadZt1PageParameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Zt1ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
