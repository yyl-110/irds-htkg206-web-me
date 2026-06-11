import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import {
  createDefaultTbdemo1ParameterList,
  TB_DEMO1_PARAM,
  TB_DEMO1_TABLE_COMPONENT_ID,
  type Tbdemo1ParameterItem,
  type Tbdemo1TerminalRow,
} from './parameterDefaults';

export type { Tbdemo1ParameterItem };

export type Tbdemo1TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapTbdemo1RowToCValueFormat(row: Tbdemo1TerminalRow, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：单行调压参数（不含端子定义表） */
export function extractTbdemo1SaveParamValues(list: Tbdemo1ParameterItem[]) {
  return list
    .filter(item => item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

function resolveTbdemo1TableComponentId(item: Tbdemo1ParameterItem): string | number | undefined {
  const rawId = String(item.componentId ?? '').trim();
  if (rawId) return item.componentId!;
  if (String(item.tableNum ?? '').trim() === TB_DEMO1_PARAM.TABLE) return TB_DEMO1_TABLE_COMPONENT_ID;
  return undefined;
}

/** tables：带 componentId 的端子定义表（tbdemo1-page1 专用 componentId=34） */
export function extractTbdemo1TableSavePayload(list: Tbdemo1ParameterItem[]): Tbdemo1TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap)
    .map(item => {
      const resolvedId = resolveTbdemo1TableComponentId(item);
      if (resolvedId == null || resolvedId === '') return null;
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapTbdemo1RowToCValueFormat(row, colNums));
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
    .filter((row): row is Tbdemo1TableSaveRow => row != null);
}

async function applyActivityParameterIds(pageId: string, list: Tbdemo1ParameterItem[]): Promise<Tbdemo1ParameterItem[]> {
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
      const num = String(item.parameterNum ?? '').trim();
      const hit = num ? byNum.get(num) : null;
      if (!hit) return item;
      const pid = String(hit?.id ?? hit?.parameterId ?? '').trim();
      return pid ? { ...item, parameterId: pid } : item;
    });
  } catch {
    return list;
  }
}

export async function loadTbdemo1PageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<Tbdemo1ParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultTbdemo1ParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  if (saved?.length) {
    const savedMap = new Map<string, string>();
    saved.forEach(row => {
      const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
      if (code) savedMap.set(code, String(row?.paramValue ?? ''));
    });
    list = list.map(item => {
      const num = String(item.parameterNum ?? '').trim();
      if (num && savedMap.has(num)) {
        return { ...item, defaultValue: savedMap.get(num) };
      }
      return item;
    });
  }
  return list;
}
