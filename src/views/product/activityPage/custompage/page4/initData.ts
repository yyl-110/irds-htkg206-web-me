import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { REDUCER_TABLE_NUM, PAGE2_1_REDUCER_TABLE_COMPONENT_ID } from '../page2-1/parameterDefaults';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { PAGE3_1_TABLE_COMPONENT_ID, PAGE3_1_TABLE_NUM } from '../page3-1/parameterDefaults';
import {
  collectTableSources,
  normalizeRowCells,
  normalizeTableRows,
  readTableCell,
  resolveTableRows,
  type FlowTableSource,
} from '../_shared/utils/flowTableSources';
import type { Page4ParameterItem, Page4TableRow } from './parameterDefaults';

/** 与 page3-1 初始性能计算表同义（旧名 DJ3_T_INITXN） */
export const INIT_XN_TABLE_NUM = PAGE3_1_TABLE_NUM;

function hasProductCode(row: Record<string, string | number | undefined>) {
  const code = row.p2;
  return code !== undefined && code !== '';
}

function buildCombinationRow(
  schemeIndex: number,
  motorRow: Record<string, string | number | undefined>,
  reducerRow: Record<string, string | number | undefined>,
  xnMetrics: { p1: string; p2: string; p3: string },
  totalReductionRatio: string,
): Page4TableRow {
  const data: Page4TableRow = {};
  data.p0 = `组合方案${schemeIndex + 1}`;
  data.cellInputOrOutput0 = '1';
  data.p1 = xnMetrics.p1;
  data.cellInputOrOutput1 = '1';
  data.p2 = xnMetrics.p2;
  data.cellInputOrOutput2 = '1';
  data.p3 = xnMetrics.p3;
  data.cellInputOrOutput3 = '1';
  data.p4 = String(motorRow.p2 ?? '');
  data.cellInputOrOutput4 = '1';
  data.p5 = String(motorRow.p3 ?? '');
  data.cellInputOrOutput5 = '1';
  data.p6 = String(motorRow.p4 ?? '');
  data.cellInputOrOutput6 = '1';
  data.p7 = String(motorRow.p5 ?? '');
  data.cellInputOrOutput7 = '1';
  data.p8 = String(motorRow.p6 ?? '');
  data.cellInputOrOutput8 = '1';
  data.p9 = String(motorRow.p7 ?? '');
  data.cellInputOrOutput9 = '1';
  data.p10 = readTableCell(reducerRow, 2);
  data.cellInputOrOutput10 = '1';
  data.p11 = readTableCell(reducerRow, 5);
  data.cellInputOrOutput11 = '1';
  data.p12 = readTableCell(reducerRow, 6);
  data.cellInputOrOutput12 = '1';
  data.p13 = readTableCell(reducerRow, 7);
  data.cellInputOrOutput13 = '1';
  data.p14 = readTableCell(reducerRow, 8);
  data.cellInputOrOutput14 = '1';
  const strokeHalf = Number(readTableCell(reducerRow, 9));
  data.p15 = Number.isFinite(strokeHalf) ? String(strokeHalf / 2) : '';
  data.cellInputOrOutput15 = '1';
  data.p16 = totalReductionRatio;
  data.cellInputOrOutput16 = '1';
  return data;
}

const PAGE3_1_MATCHERS = [
  { tableNum: PAGE3_1_TABLE_NUM, componentId: PAGE3_1_TABLE_COMPONENT_ID },
  { tableNum: PAGE3_1_TABLE_NUM },
];

function tableSourceMatches(table: FlowTableSource, matcher: { tableNum?: string; componentId?: string | number }): boolean {
  const tableNum = String(table.tablenum ?? table.tableNum ?? '').trim();
  const componentId = String(table.componentId ?? '').trim();
  const wantTableNum = String(matcher.tableNum ?? '').trim();
  const wantComponentId = String(matcher.componentId ?? '').trim();
  if (wantTableNum && tableNum === wantTableNum) return true;
  if (wantComponentId && componentId === wantComponentId) return true;
  return false;
}

/** 优先读取含 p13-p15 计算结果的 page3-1 表（flow 中可能是未计算的 init 快照） */
function resolvePage3_1PerformanceRows(
  savedTables?: Array<Record<string, unknown>> | null,
): Array<Record<string, string | number | undefined>> {
  const sources = collectTableSources(savedTables);
  let fallback: Array<Record<string, string | number | undefined>> = [];

  for (const table of sources) {
    if (!PAGE3_1_MATCHERS.some(matcher => tableSourceMatches(table, matcher))) continue;
    const rows = normalizeTableRows(table).map(row => normalizeRowCells(row, 16));
    if (!rows.length) continue;
    const hasCalculated = rows.some(
      row => readTableCell(row, 13) || readTableCell(row, 14) || readTableCell(row, 15),
    );
    if (hasCalculated) return rows;
    if (!fallback.length) fallback = rows;
  }

  return fallback.length ? fallback : resolveTableRows(sources, PAGE3_1_MATCHERS, 16);
}

function findPage3_1RowForMotor(
  motorIndex: number,
  motorRow: Record<string, string | number | undefined>,
  page3_1List: Array<Record<string, string | number | undefined>>,
): Record<string, string | number | undefined> | undefined {
  const motorId = readTableCell(motorRow, 1);
  if (motorId) {
    const matched = page3_1List.find(row => readTableCell(row, 0) === motorId);
    if (matched) return matched;
  }
  return page3_1List[motorIndex];
}

/** page3-1（初始性能计算）：p13/p14/p15；page3（初始总减速比）：p7/p6/p8 */
function resolveXnMetricsForMotor(
  motorIndex: number,
  motorRow: Record<string, string | number | undefined>,
  page3_1List: Array<Record<string, string | number | undefined>>,
  page3List: Array<Record<string, string | number | undefined>>,
): { p1: string; p2: string; p3: string } {
  const row31 = findPage3_1RowForMotor(motorIndex, motorRow, page3_1List);
  if (row31 && (readTableCell(row31, 13) || readTableCell(row31, 14) || readTableCell(row31, 15))) {
    return {
      p1: readTableCell(row31, 13),
      p2: readTableCell(row31, 14),
      p3: readTableCell(row31, 15),
    };
  }

  const row3 = page3List[motorIndex];
  if (row3) {
    return {
      p1: readTableCell(row3, 7),
      p2: readTableCell(row3, 6),
      p3: readTableCell(row3, 8),
    };
  }

  return { p1: '', p2: '', p3: '' };
}

function resolvePage3InitTotalJsbRows(
  savedTables?: Array<Record<string, unknown>> | null,
): Array<Record<string, string | number | undefined>> {
  const matchers = [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }];
  const fromFlow = resolveTableRows(collectTableSources(null), matchers, 18);
  if (fromFlow.length) return fromFlow;

  const savedOnly: FlowTableSource[] = (Array.isArray(savedTables) ? savedTables : [])
    .filter((raw): raw is Record<string, unknown> => !!raw && typeof raw === 'object')
    .map(raw => raw as FlowTableSource);
  return resolveTableRows(savedOnly, matchers, 18);
}

/** 总减速比固定读取 page3（初始总减速比计算）p18 文本框值 */
function resolveTotalReductionRatioFromPage3(
  motorIndex: number,
  page3List: Array<Record<string, string | number | undefined>>,
): string {
  const row = page3List[motorIndex] ?? page3List[0];
  return readTableCell(row, 18);
}

function buildMotorIndexByProductCode(
  motorList: Array<Record<string, string | number | undefined>>,
): Map<string, number> {
  const map = new Map<string, number>();
  let validMotorIndex = 0;
  motorList.forEach(motorRow => {
    if (!hasProductCode(motorRow)) return;
    const code = String(motorRow.p2 ?? '').trim();
    if (code) map.set(code, validMotorIndex);
    validMotorIndex += 1;
  });
  return map;
}

function findReducerRowByProductCode(
  reducerList: Array<Record<string, string | number | undefined>>,
  productCode: string,
): Record<string, string | number | undefined> | undefined {
  const code = String(productCode ?? '').trim();
  if (!code) return undefined;
  return reducerList.find(row => readTableCell(row, 2) === code);
}

/** 刷新初算指标、减速器传动比/最大输出、总减速比等上游字段，保留已有组合行 */
export function refreshPage4UpstreamFromFlow(
  list: Page4ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const sources = collectTableSources(savedTables);
  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );
  const reducerList = resolveTableRows(
    sources,
    [{ tableNum: REDUCER_TABLE_NUM, componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID }],
    13,
  );
  const xnListPage3_1 = resolvePage3_1PerformanceRows(savedTables);
  const xnListPage3 = resolvePage3InitTotalJsbRows(savedTables);
  const motorIndexByCode = buildMotorIndexByProductCode(motorList);

  const rows = list[0]?.tableMap?.rowData as Page4TableRow[] | undefined;
  if (!rows?.length) return false;

  rows.forEach(row => {
    const motorCode = String(row.p4 ?? '').trim();
    const motorIndex = motorIndexByCode.get(motorCode) ?? 0;
    const motorRow = motorList.filter(hasProductCode)[motorIndex] ?? motorList[motorIndex];
    const xnMetrics = resolveXnMetricsForMotor(motorIndex, motorRow ?? {}, xnListPage3_1, xnListPage3);
    row.p1 = xnMetrics.p1;
    row.p2 = xnMetrics.p2;
    row.p3 = xnMetrics.p3;
    row.p16 = resolveTotalReductionRatioFromPage3(motorIndex, xnListPage3);

    const reducerRow = findReducerRowByProductCode(reducerList, String(row.p10 ?? '').trim());
    if (reducerRow) {
      row.p11 = readTableCell(reducerRow, 5);
      row.p12 = readTableCell(reducerRow, 6);
    }
  });
  return true;
}

/** 从流程上下文生成电机×减速器组合方案（原 initData） */
export function applyPage4InitData(
  list: Page4ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const sources = collectTableSources(savedTables);

  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );
  const reducerList = resolveTableRows(
    sources,
    [{ tableNum: REDUCER_TABLE_NUM, componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID }],
    14,
  );
  const xnListPage3_1 = resolvePage3_1PerformanceRows(savedTables);
  const xnListPage3 = resolvePage3InitTotalJsbRows(savedTables);

  const dataList: Page4TableRow[] = [];
  let validMotorIndex = 0;

  motorList.forEach(motorRow => {
    if (!hasProductCode(motorRow)) return;
    const xnMetrics = resolveXnMetricsForMotor(validMotorIndex, motorRow, xnListPage3_1, xnListPage3);
    const totalReductionRatio = resolveTotalReductionRatioFromPage3(validMotorIndex, xnListPage3);
    reducerList.forEach(reducerRow => {
      if (!hasProductCode(reducerRow)) return;
      dataList.push(buildCombinationRow(dataList.length, motorRow, reducerRow, xnMetrics, totalReductionRatio));
    });
    validMotorIndex += 1;
  });

  if (!list[0]?.tableMap) {
    return false;
  }
  if (dataList.length === 0) {
    return false;
  }
  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;
  return true;
}
