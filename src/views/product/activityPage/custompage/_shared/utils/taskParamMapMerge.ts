import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { setFlowContext, type FlowParameterItem, type FlowTableItem } from '../../shared/flowContext';

export type CustomPageSavedParamRow = {
  paramCode?: string;
  paramKey?: string;
  paramValue?: string;
};

export type CustomPageParameterItem = {
  ifSingleLine?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  tableNum?: string;
  tableMap?: {
    colNums?: string | number;
    rowData?: Array<Record<string, string>>;
    colStr?: string[];
  };
};

export type CustomPageSavedTableRow = {
  tableNum?: string;
  tablenum?: string;
  componentId?: string;
  rowData?: Array<Record<string, string | number | undefined>>;
  rowdata?: Array<Record<string, string | number | undefined>>;
  values?: Array<Record<string, string | number | undefined>>;
  colStr?: string[];
};

export function buildSavedParamMap(saved?: CustomPageSavedParamRow[] | null): Map<string, string> {
  const savedMap = new Map<string, string>();
  (saved || []).forEach(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (code) savedMap.set(code, String(row?.paramValue ?? ''));
  });
  return savedMap;
}

function mergeTableRowSavedValues(
  row: Record<string, string>,
  colNums: number,
  savedMap: Map<string, string>,
): Record<string, string> {
  const nextRow = { ...row };
  for (let i = 0; i < colNums; i++) {
    const paramKey = String(row[`cellParentNum${i}`] ?? '').trim();
    if (!paramKey || !savedMap.has(paramKey)) continue;
    const savedVal = savedMap.get(paramKey);
    if (savedVal !== undefined && savedVal !== '') {
      nextRow[`p${i}`] = savedVal;
    }
  }
  return nextRow;
}

/** 按 parameterNum 合并 task-param-map 文本参数；表格单元格按 cellParentNum 合并 */
export function mergeSavedParamsIntoList<T extends CustomPageParameterItem>(
  list: T[],
  saved?: CustomPageSavedParamRow[] | null,
): T[] {
  const savedMap = buildSavedParamMap(saved);
  if (!savedMap.size) return list.map(item => ({ ...item }));

  return list.map(item => {
    let nextItem: T = { ...item };

    const num = String(item.parameterNum ?? '').trim();
    if (num && savedMap.has(num)) {
      const savedVal = savedMap.get(num);
      if (savedVal !== undefined && savedVal !== '') {
        nextItem = { ...nextItem, defaultValue: savedVal };
      }
    }

    if (item.ifSingleLine === 't' && item.tableMap?.rowData?.length) {
      const colNums = Number(item.tableMap.colNums ?? 0);
      const rowData = item.tableMap.rowData.map(row => mergeTableRowSavedValues(row, colNums, savedMap));
      nextItem = {
        ...nextItem,
        tableMap: {
          ...item.tableMap,
          rowData,
        },
      };
    }

    return nextItem;
  });
}

function normalizeSavedTableRows(table: CustomPageSavedTableRow): Array<Record<string, string | number | undefined>> {
  const rows = table.rowData ?? table.rowdata ?? table.values;
  return Array.isArray(rows) ? rows : [];
}

function resolveSavedTableNum(table: CustomPageSavedTableRow): string {
  return String(table.tableNum ?? table.tablenum ?? table.componentId ?? '').trim();
}

/** 按 tableNum 合并 task-param-map 表格快照到页面表格 */
export function mergeSavedTablesIntoList<T extends CustomPageParameterItem>(
  list: T[],
  savedTables?: CustomPageSavedTableRow[] | null,
): T[] {
  const tableList = Array.isArray(savedTables) ? savedTables : [];
  if (!tableList.length) return list;

  const byTableNum = new Map<string, CustomPageSavedTableRow>();
  tableList.forEach(table => {
    const num = resolveSavedTableNum(table);
    if (num) byTableNum.set(num, table);
  });
  if (!byTableNum.size) return list;

  return list.map(item => {
    if (item.ifSingleLine !== 't' || !item.tableMap) return item;
    const tableNum = String(item.tableNum ?? item.parameterNum ?? '').trim();
    if (!tableNum || !byTableNum.has(tableNum)) return item;

    const savedTable = byTableNum.get(tableNum)!;
    const savedRows = normalizeSavedTableRows(savedTable);
    if (!savedRows.length) return item;

    return {
      ...item,
      tableMap: {
        ...item.tableMap,
        rowData: savedRows.map(row => {
          const nextRow: Record<string, string> = {};
          Object.entries(row).forEach(([key, value]) => {
            nextRow[key] = String(value ?? '');
          });
          return nextRow;
        }),
      },
    };
  });
}

export async function applyActivityParameterIds<T extends CustomPageParameterItem>(
  pageId: string,
  list: T[],
): Promise<T[]> {
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

/** 将 task-param-map 快照写入 flowContext，供 initData / getFlowParameterList 使用 */
export function syncFlowContextFromTaskParamMap(
  saved?: CustomPageSavedParamRow[] | null,
  savedTables?: CustomPageSavedTableRow[] | null,
) {
  const flowParameterList: FlowParameterItem[] = (saved || [])
    .map(row => ({
      paramnum: String(row?.paramCode ?? row?.paramKey ?? '').trim(),
      paramvalue: String(row?.paramValue ?? ''),
    }))
    .filter(row => row.paramnum);

  const flowTableList: FlowTableItem[] = (Array.isArray(savedTables) ? savedTables : [])
    .map(table => ({
      tablenum: resolveSavedTableNum(table),
      rowdata: normalizeSavedTableRows(table),
    }))
    .filter(table => table.tablenum);

  if (!flowParameterList.length && !flowTableList.length) return;
  setFlowContext({
    flowParameterList: flowParameterList.length ? flowParameterList : undefined,
    flowTableList: flowTableList.length ? flowTableList : undefined,
  });
}

export function applyTaskParamMapToParameterList<T extends CustomPageParameterItem>(
  list: T[],
  saved?: CustomPageSavedParamRow[] | null,
  savedTables?: CustomPageSavedTableRow[] | null,
): T[] {
  let next = mergeSavedParamsIntoList(list, saved);
  next = mergeSavedTablesIntoList(next, savedTables);
  return next;
}

/** 解析 task-param-map 接口返回的文本参数与表格快照 */
export function parseTaskParamMapResponse(raw: unknown): {
  saved: CustomPageSavedParamRow[];
  savedTables: CustomPageSavedTableRow[];
} {
  if (!raw || typeof raw !== 'object') {
    return { saved: [], savedTables: [] };
  }
  const dataObj = raw as Record<string, unknown>;
  const paramsObj = dataObj?.params && typeof dataObj.params === 'object' ? dataObj.params : null;
  const savedTables = Array.isArray(dataObj?.tables) ? (dataObj.tables as CustomPageSavedTableRow[]) : [];
  const source = paramsObj ?? dataObj;
  const saved: CustomPageSavedParamRow[] = [];

  if (Array.isArray(source)) {
    source.forEach((row: Record<string, unknown>) => {
      const code = String(row?.paramCode ?? row?.paramKey ?? row?.code ?? '').trim();
      if (!code) return;
      saved.push({
        paramCode: code,
        paramValue: String(row?.paramValue ?? row?.value ?? row?.savedValue ?? ''),
      });
    });
  } else if (source && typeof source === 'object') {
    Object.entries(source as Record<string, unknown>).forEach(([k, v]) => {
      const code = String(k ?? '').trim();
      if (!code || code === 'params' || code === 'tables') return;
      if (v != null && typeof v === 'object' && !Array.isArray(v)) {
        const obj = v as Record<string, unknown>;
        saved.push({
          paramCode: code,
          paramValue: String(obj?.paramValue ?? obj?.value ?? obj?.savedValue ?? ''),
        });
        return;
      }
      saved.push({ paramCode: code, paramValue: String(v ?? '') });
    });
  }

  return { saved, savedTables };
}
