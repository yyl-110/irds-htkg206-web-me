import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { REDUCER_TABLE_NUM, PAGE2_1_REDUCER_TABLE_COMPONENT_ID } from '../page2-1/parameterDefaults';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { PAGE3_1_TABLE_COMPONENT_ID, PAGE3_1_TABLE_NUM } from '../page3-1/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows, type FlowTableSource } from '../_shared/utils/flowTableSources';
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
  data.p10 = String(reducerRow.p2 ?? '');
  data.cellInputOrOutput10 = '1';
  data.p11 = String(reducerRow.p5 ?? '');
  data.cellInputOrOutput11 = '1';
  data.p12 = String(reducerRow.p6 ?? '');
  data.cellInputOrOutput12 = '1';
  data.p13 = String(reducerRow.p7 ?? '');
  data.cellInputOrOutput13 = '1';
  data.p14 = String(reducerRow.p8 ?? '');
  data.cellInputOrOutput14 = '1';
  const strokeHalf = Number(reducerRow.p9);
  data.p15 = Number.isFinite(strokeHalf) ? String(strokeHalf / 2) : '';
  data.cellInputOrOutput15 = '1';
  data.p16 = totalReductionRatio;
  data.cellInputOrOutput16 = '1';
  return data;
}

function cellText(row: Record<string, string | number | undefined> | undefined, field: string): string {
  return String(row?.[field] ?? '').trim();
}

/** page3-1（初始性能计算）：p13/p14/p15；page3（初始总减速比）：p7/p6/p8 */
function resolveXnMetricsForMotor(
  motorIndex: number,
  page3_1List: Array<Record<string, string | number | undefined>>,
  page3List: Array<Record<string, string | number | undefined>>,
): { p1: string; p2: string; p3: string } {
  const row31 = page3_1List[motorIndex];
  if (row31 && (cellText(row31, 'p13') || cellText(row31, 'p14') || cellText(row31, 'p15'))) {
    return {
      p1: cellText(row31, 'p13'),
      p2: cellText(row31, 'p14'),
      p3: cellText(row31, 'p15'),
    };
  }

  const row3 = page3List[motorIndex];
  if (row3) {
    return {
      p1: cellText(row3, 'p7'),
      p2: cellText(row3, 'p6'),
      p3: cellText(row3, 'p8'),
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
  const xnListPage3_1 = resolveTableRows(
    sources,
    [
      { tableNum: PAGE3_1_TABLE_NUM, componentId: PAGE3_1_TABLE_COMPONENT_ID },
      { tableNum: PAGE3_1_TABLE_NUM },
    ],
    16,
  );
  const xnListPage3 = resolvePage3InitTotalJsbRows(savedTables);

  const dataList: Page4TableRow[] = [];
  let validMotorIndex = 0;

  motorList.forEach(motorRow => {
    if (!hasProductCode(motorRow)) return;
    const xnMetrics = resolveXnMetricsForMotor(validMotorIndex, xnListPage3_1, xnListPage3);
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
