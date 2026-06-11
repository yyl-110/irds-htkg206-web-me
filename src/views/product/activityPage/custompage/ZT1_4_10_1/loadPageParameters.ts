import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultZt1_4101ParameterList,
  ZT1_4101_CABINET_TABLE_COMPONENT_ID,
  ZT1_4101_CABINET_TABLE_NUM,
  type Zt1_4101ParameterItem,
  type Zt1CabinetRow,
} from './parameterDefaults';

export type { Zt1_4101ParameterItem };

export type Zt1_4101TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapZt1_4101RowToCValueFormat(row: Zt1CabinetRow, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

function resolveZt1_4101TableComponentId(item: Zt1_4101ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === ZT1_4101_CABINET_TABLE_NUM) return ZT1_4101_CABINET_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的设备舱模型表（ZT1_4_10_1 专用 componentId=39） */
export function extractZt1_4101TableSavePayload(list: Zt1_4101ParameterItem[]): Zt1_4101TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveZt1_4101TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapZt1_4101RowToCValueFormat(row, colNums));
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
    .filter((row): row is Zt1_4101TableSaveRow => row != null);
}

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

export async function loadZt1_4101PageParameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Zt1_4101ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1_4101ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
