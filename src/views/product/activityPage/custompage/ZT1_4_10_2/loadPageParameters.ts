import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultZt1_4102ParameterList,
  ZT1_4102_CABIN_SEGMENT_TABLE_COMPONENT_ID_BASE,
  ZT1_4102_SEGMENT_COUNT_TABLE_COMPONENT_ID,
  ZT1_4102_SEGMENT_COUNT_TABLE_NUM,
  type Zt1_4102ParameterItem,
} from './parameterDefaults';

export type { Zt1_4102ParameterItem };

export type Zt1_4102TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getTableColNums(tableMap?: Zt1_4102ParameterItem['tableMap']): number {
  const colStrLen = tableMap?.colStr?.length ?? 0;
  const fromColNums = Number(tableMap?.colNums ?? 0);
  return colStrLen > 0 ? colStrLen : fromColNums;
}

function mapZt1_4102RowToCValueFormat(
  row: Record<string, string | number | undefined>,
  colNums: number,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

function resolveZt1_4102TableComponentId(item: Zt1_4102ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;

  const tableNum = String(item.tableNum ?? '').trim();
  if (tableNum === ZT1_4102_SEGMENT_COUNT_TABLE_NUM) return ZT1_4102_SEGMENT_COUNT_TABLE_COMPONENT_ID;

  const match = tableNum.match(/^ZT1_4_10_2_T_(\d+)FDDATA$/);
  if (match) {
    const cabinIndex = Number(match[1]);
    if (cabinIndex >= 1 && cabinIndex <= 10) {
      return ZT1_4102_CABIN_SEGMENT_TABLE_COMPONENT_ID_BASE + cabinIndex - 1;
    }
  }
  return undefined;
}

/** tables：各设备舱分段数 + 1~10 号舱分段数据（componentId=40~50） */
export function extractZt1_4102TableSavePayload(list: Zt1_4102ParameterItem[]): Zt1_4102TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveZt1_4102TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = getTableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapZt1_4102RowToCValueFormat(row, colNums));
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
    .filter((row): row is Zt1_4102TableSaveRow => row != null);
}

async function applyActivityParameterIds(pageId: string, list: Zt1_4102ParameterItem[]): Promise<Zt1_4102ParameterItem[]> {
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

export async function loadZt1_4102PageParameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Zt1_4102ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultZt1_4102ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
