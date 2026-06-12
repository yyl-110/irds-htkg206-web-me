import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { REDUCER_TABLE_NUM, PAGE2_1_REDUCER_TABLE_COMPONENT_ID } from '../page2-1/parameterDefaults';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { PAGE3_1_TABLE_COMPONENT_ID, PAGE3_1_TABLE_NUM } from '../page3-1/parameterDefaults';
import { collectTableSources, resolveTableRows } from '../_shared/utils/flowTableSources';
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
  xnMetrics: { p1: string; p2: string; p3: string; p16: string },
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
  data.p16 = xnMetrics.p16;
  data.cellInputOrOutput16 = '1';
  return data;
}

function cellText(row: Record<string, string | number | undefined> | undefined, field: string): string {
  return String(row?.[field] ?? '').trim();
}

/** page3-1（初始性能计算）：p13/p14/p15 + p6；page3（初始总减速比）：p7/p6/p8 + p18 */
function resolveXnMetricsForMotor(
  motorIndex: number,
  page3_1List: Array<Record<string, string | number | undefined>>,
  page3List: Array<Record<string, string | number | undefined>>,
): { p1: string; p2: string; p3: string; p16: string } {
  const row31 = page3_1List[motorIndex];
  if (row31 && (cellText(row31, 'p13') || cellText(row31, 'p14') || cellText(row31, 'p15'))) {
    return {
      p1: cellText(row31, 'p13'),
      p2: cellText(row31, 'p14'),
      p3: cellText(row31, 'p15'),
      p16: cellText(row31, 'p6'),
    };
  }

  const row3 = page3List[motorIndex];
  if (row3) {
    return {
      p1: cellText(row3, 'p7'),
      p2: cellText(row3, 'p6'),
      p3: cellText(row3, 'p8'),
      p16: cellText(row3, 'p18'),
    };
  }

  return { p1: '', p2: '', p3: '', p16: '' };
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
  const xnListPage3 = resolveTableRows(
    sources,
    [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }],
    18,
  );

  const dataList: Page4TableRow[] = [];
  let validMotorIndex = 0;

  motorList.forEach(motorRow => {
    if (!hasProductCode(motorRow)) return;
    const xnMetrics = resolveXnMetricsForMotor(validMotorIndex, xnListPage3_1, xnListPage3);
    reducerList.forEach(reducerRow => {
      if (!hasProductCode(reducerRow)) return;
      dataList.push(buildCombinationRow(dataList.length, motorRow, reducerRow, xnMetrics));
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
