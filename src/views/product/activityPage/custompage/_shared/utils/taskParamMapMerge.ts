import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { mergeFlowTableList, setFlowContext, type FlowParameterItem, type FlowTableItem } from '../../shared/flowContext';

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
  componentId?: string | number;
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
  componentId?: string | number;
  tableName?: string;
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

/** save-params / task-param-map 中仅有 componentId 时，反查 tableNum 供 flowContext 使用 */
const COMPONENT_ID_TO_TABLE_NUM: Record<string, string> = {
  '1': 'DJ1-1_T_ZEROINITPOSITION',
  '2': 'DJ1-1_T_RESULTDATA',
  '3': 'DJ1_T_ZEROINITPOSITION',
  '4': 'DJ1_T_RESULTDATA',
  '5': 'DJ0_1_BASEPARAMS',
  '6': 'DJ0_1_WORKPARAMS',
  '7': 'DJ0_1_COMMSTYLE',
  '8': 'DJ0_1_XIANGPINPARAM',
  '9': 'DJ1-1_T_ZEROINITPOSITION',
  '10': 'DJ1-1_T_RESULTDATA',
  '11': 'DJ0_BASEPARAMS',
  '12': 'DJ0_WORKPARAMS',
  '13': 'DJ0_COMMSTYLE',
  '14': 'DJ0_XIANGPINPARAM',
  '15': 'DJ2_T_MOTORSELECT',
  '16': 'DJ2-1_T_JSQSELECT',
  '17': 'DJ3_T_INITTOTALJSB',
  '18': 'DJ3_T_INITXN',
  '19': 'DJ4_T_COMBINSCHEME',
  '20': 'DJ5_T_GEARJSBDISPATCH',
  '21': 'DJ6_T_FINALTOTALJSB',
  '22': 'DJ7_T_XNCHECK',
  '23': 'DJ8_T_INITCOMBINSCHEME',
  '24': 'DJ9_T_INPUTPARAMS',
  '25': 'DJ9_T_GEARINTERFORCECAL',
  '30': 'DJ10_T_INPUTPARAMS',
  '31': 'DJ10_T_DEGREERESET',
  '33': 'DJ11_T_INPUTPARAMS',
  '34': 'TB_DEMO1_T_DUANZIDEF',
  '35': 'TB_DEMO1_T_LAYERVOLTAGE',
  '36': 'ZJZCJH1_1_T_FRAMECHECK',
  '37': 'ZLKWJC1_1_T_HOLECHECK',
  '38': 'ZT1_1_12_T_YQJTJ',
  '39': 'ZT1_4_10_1_T_SBCMODEL',
  '40': 'ZT1_4_10_2_T_FDS',
};

function resolvePage9GearRowMergeSkipIndexes(row: Record<string, string>): number[] {
  const skip: number[] = [];
  [2, 4, 5, 6].forEach(index => {
    if (row[`cellUserOverride${index}`] === '1') {
      skip.push(index);
    }
  });
  return skip;
}

function isPage9GearTableComponentId(componentId: string): boolean {
  if (componentId === '25') return true;
  const id = Number(componentId);
  return Number.isFinite(id) && id >= 26;
}

function resolvePage10DegreeRowMergeSkipIndexes(row: Record<string, string>): number[] {
  const skip: number[] = [];
  [0, 1].forEach(index => {
    if (row[`cellUserOverride${index}`] === '1') {
      skip.push(index);
    }
  });
  return skip;
}

function isPage10DegreeTableComponentId(componentId: string): boolean {
  if (componentId === '31') return true;
  const id = Number(componentId);
  if (!Number.isFinite(id)) return false;
  return (id >= 32 && id < 100) || id >= 132;
}

function resolveSavedMergeSkipColumnIndexes(
  itemComponentId: string,
  templateRows: Array<Record<string, string>>,
): number[] {
  if (isPage10DegreeTableComponentId(itemComponentId)) {
    return [];
  }
  if (isPage9GearTableComponentId(itemComponentId)) {
    return [];
  }
  if (itemComponentId === '21') {
    const templateRow = templateRows[0] ?? {};
    const skip: number[] = [];
    for (let i = 10; i <= 14; i++) {
      if (templateRow[`cellUserOverride${i}`] === '1') {
        skip.push(i);
      }
    }
    return skip;
  }
  if (itemComponentId === '17') {
    const templateRow = templateRows[0] ?? {};
    if (templateRow.cellUserOverride18 === '1') return [18];
    if (templateRow.cellInputOrOutput18 === '0') return [18];
    return [];
  }
  if (itemComponentId === '19') {
    return [16];
  }
  if (itemComponentId !== '20') return [];
  const templateRow = templateRows[0] ?? {};
  if (templateRow.cellInputOrOutput14 === '0') return [14];
  return [];
}

function resolveSavedTableNum(table: CustomPageSavedTableRow): string {
  const direct = String(table.tableNum ?? table.tablenum ?? '').trim();
  if (direct) return direct;
  const componentId = String(table.componentId ?? '').trim();
  if (componentId && COMPONENT_ID_TO_TABLE_NUM[componentId]) {
    return COMPONENT_ID_TO_TABLE_NUM[componentId];
  }
  return '';
}

/** 将 tables 接口中的 c1/c2 列格式转换为页面内部的 p0/p1 格式 */
function normalizeSavedTableRowToPFormat(row: Record<string, string | number | undefined>): Record<string, string> {
  const nextRow: Record<string, string> = {};
  Object.entries(row).forEach(([key, value]) => {
    const cMatch = /^c(\d+)$/i.exec(String(key).trim());
    if (cMatch) {
      const pIndex = Number(cMatch[1]) - 1;
      if (pIndex >= 0) nextRow[`p${pIndex}`] = String(value ?? '');
      return;
    }
    nextRow[key] = String(value ?? '');
  });
  return nextRow;
}

function mergeSavedRowsIntoTableRowData(
  savedRows: Array<Record<string, string | number | undefined>>,
  templateRows: Array<Record<string, string>>,
  colNums: number,
  skipColumnIndexes: number[] = [],
  resolveRowSkipColumnIndexes?: (rowTemplate: Record<string, string>) => number[],
): Array<Record<string, string>> {
  const tableSkipSet = new Set(skipColumnIndexes);
  const template = templateRows.length ? templateRows : [{}];
  return savedRows.map((savedRow, rowIndex) => {
    const rowTemplate = templateRows[rowIndex] ?? templateRows[0] ?? {};
    const rowSkipSet = new Set([
      ...tableSkipSet,
      ...(resolveRowSkipColumnIndexes ? resolveRowSkipColumnIndexes(rowTemplate) : []),
    ]);
    const pRow = normalizeSavedTableRowToPFormat(savedRow);
    const nextRow: Record<string, string> = { ...rowTemplate, delIndex: String(rowIndex) };
    for (let i = 0; i < colNums; i++) {
      if (rowSkipSet.has(i)) continue;
      const val = pRow[`p${i}`];
      if (val !== undefined && val !== '') {
        nextRow[`p${i}`] = val;
      }
    }
    return nextRow;
  });
}

/** 按 tableNum / componentId 合并 task-param-map 表格快照到页面表格 */
export function mergeSavedTablesIntoList<T extends CustomPageParameterItem>(
  list: T[],
  savedTables?: CustomPageSavedTableRow[] | null,
): T[] {
  const tableList = Array.isArray(savedTables) ? savedTables : [];
  if (!tableList.length) return list;

  const byTableNum = new Map<string, CustomPageSavedTableRow>();
  const byComponentId = new Map<string, CustomPageSavedTableRow>();
  tableList.forEach(table => {
    const num = resolveSavedTableNum(table);
    if (num) byTableNum.set(num, table);
    const componentId = String(table.componentId ?? '').trim();
    if (componentId) byComponentId.set(componentId, table);
  });
  if (!byTableNum.size && !byComponentId.size) return list;

  return list.map(item => {
    if (item.ifSingleLine !== 't' || !item.tableMap) return item;
    const tableNum = String(item.tableNum ?? item.parameterNum ?? '').trim();
    const itemComponentId = String(item.componentId ?? '').trim();
    let savedTable = tableNum ? byTableNum.get(tableNum) : undefined;
    if (!savedTable && itemComponentId) savedTable = byComponentId.get(itemComponentId);
    if (!savedTable) return item;

    const savedRows = normalizeSavedTableRows(savedTable);
    if (!savedRows.length) return item;

    const colNums = Number(item.tableMap.colNums ?? 0);
    const templateRows = item.tableMap.rowData ?? [];
    const skipColumnIndexes = resolveSavedMergeSkipColumnIndexes(itemComponentId, templateRows);
    const resolveRowSkip = isPage9GearTableComponentId(itemComponentId)
      ? resolvePage9GearRowMergeSkipIndexes
      : isPage10DegreeTableComponentId(itemComponentId)
        ? resolvePage10DegreeRowMergeSkipIndexes
        : undefined;
    const rowData = mergeSavedRowsIntoTableRowData(
      savedRows,
      templateRows,
      colNums,
      skipColumnIndexes,
      resolveRowSkip,
    );
    const savedComponentId = String(savedTable.componentId ?? item.componentId ?? '').trim();

    return {
      ...item,
      componentId: savedComponentId || item.componentId,
      tableMap: {
        ...item.tableMap,
        rowData,
        rowNums: String(rowData.length),
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
    .map(table => {
      const componentIdRaw = table.componentId;
      const componentId = componentIdRaw != null && componentIdRaw !== '' ? componentIdRaw : undefined;
      const tablenum = resolveSavedTableNum(table);
      const rowdata = normalizeSavedTableRows(table).map(row => normalizeSavedTableRowToPFormat(row));
      return { tablenum: tablenum || undefined, componentId, rowdata };
    })
    .filter(table => table.tablenum || table.componentId != null);

  if (!flowParameterList.length && !flowTableList.length) return;
  setFlowContext({
    flowParameterList: flowParameterList.length ? flowParameterList : undefined,
  });
  mergeFlowTableList(flowTableList);
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
