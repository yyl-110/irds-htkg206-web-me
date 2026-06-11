import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultTbdemo1Page2ParameterList,
  TB_DEMO1_LAYER_VOLTAGE_TABLE,
  TB_DEMO1_PAGE2_TABLE_COMPONENT_ID,
  type Tbdemo1Page2ParameterItem,
  type Tbdemo1Page2Row,
} from './parameterDefaults';

export type { Tbdemo1Page2ParameterItem };

export type Tbdemo1Page2TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapTbdemo1Page2RowToCValueFormat(row: Tbdemo1Page2Row, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：本页无单行参数，返回空数组 */
export function extractTbdemo1Page2SaveParamValues(_list: Tbdemo1Page2ParameterItem[]) {
  return [] as Array<{ paramKey: string; paramName: string; paramValue: string }>;
}

function resolveTbdemo1Page2TableComponentId(item: Tbdemo1Page2ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === TB_DEMO1_LAYER_VOLTAGE_TABLE) return TB_DEMO1_PAGE2_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的层级电压计算表（tbdemo1-page2 专用 componentId=35） */
export function extractTbdemo1Page2TableSavePayload(list: Tbdemo1Page2ParameterItem[]): Tbdemo1Page2TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveTbdemo1Page2TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapTbdemo1Page2RowToCValueFormat(row, colNums));
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
    .filter((row): row is Tbdemo1Page2TableSaveRow => row != null);
}

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

export async function loadTbdemo1Page2Parameters(
  pageId: string,
  _saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Tbdemo1Page2ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultTbdemo1Page2ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return list;
}
