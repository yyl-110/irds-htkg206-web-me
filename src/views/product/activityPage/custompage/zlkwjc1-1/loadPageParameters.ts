import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultZlkwjcParameterList,
  ZLKWJC1_1_TABLE_COMPONENT_ID,
  ZLKWJC1_1_TABLE_NUM,
  type ZlkwjcCheckRow,
  type ZlkwjcParameterItem,
} from './parameterDefaults';

export type { ZlkwjcParameterItem };

export type ZlkwjcTableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapZlkwjcRowToCValueFormat(row: ZlkwjcCheckRow, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：本页无单行参数，返回空数组 */
export function extractZlkwjcSaveParamValues(_list: ZlkwjcParameterItem[]) {
  return [] as Array<{ paramKey: string; paramName: string; paramValue: string }>;
}

function resolveZlkwjcTableComponentId(item: ZlkwjcParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === ZLKWJC1_1_TABLE_NUM) return ZLKWJC1_1_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的纵梁孔位检查表（zlkwjc1-1 专用 componentId=37） */
export function extractZlkwjcTableSavePayload(list: ZlkwjcParameterItem[]): ZlkwjcTableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveZlkwjcTableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapZlkwjcRowToCValueFormat(row, colNums));
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
    .filter((row): row is ZlkwjcTableSaveRow => row != null);
}

async function applyActivityParameterIds(pageId: string, list: ZlkwjcParameterItem[]): Promise<ZlkwjcParameterItem[]> {
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

export async function loadZlkwjcPageParameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<ZlkwjcParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZlkwjcParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
