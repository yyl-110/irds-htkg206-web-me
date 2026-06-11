import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultZjzcjhParameterList,
  ZJZCJH1_1_TABLE_COMPONENT_ID,
  ZJZCJH1_1_TABLE_NUM,
  type ZjzcjhCheckRow,
  type ZjzcjhParameterItem,
} from './parameterDefaults';

export type { ZjzcjhParameterItem };

export type ZjzcjhTableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapZjzcjhRowToCValueFormat(row: ZjzcjhCheckRow, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：本页无单行参数，返回空数组 */
export function extractZjzcjhSaveParamValues(_list: ZjzcjhParameterItem[]) {
  return [] as Array<{ paramKey: string; paramName: string; paramValue: string }>;
}

function resolveZjzcjhTableComponentId(item: ZjzcjhParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === ZJZCJH1_1_TABLE_NUM) return ZJZCJH1_1_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的车架总成校核表（zjzcjh1-1 专用 componentId=36） */
export function extractZjzcjhTableSavePayload(list: ZjzcjhParameterItem[]): ZjzcjhTableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveZjzcjhTableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapZjzcjhRowToCValueFormat(row, colNums));
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
    .filter((row): row is ZjzcjhTableSaveRow => row != null);
}

async function applyActivityParameterIds(pageId: string, list: ZjzcjhParameterItem[]): Promise<ZjzcjhParameterItem[]> {
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

export async function loadZjzcjhPageParameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<ZjzcjhParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZjzcjhParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
