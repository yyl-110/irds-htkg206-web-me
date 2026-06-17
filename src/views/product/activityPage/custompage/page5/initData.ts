import { PAGE2_1_REDUCER_TABLE_COMPONENT_ID, REDUCER_TABLE_NUM } from '../page2-1/parameterDefaults';
import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { PAGE3_TABLE_COMPONENT_ID, PAGE3_TABLE_NUM } from '../page3/parameterDefaults';
import { PAGE4_TABLE_COMPONENT_ID, PAGE4_TABLE_NUM } from '../page4/parameterDefaults';
import { PAGE6_TABLE_COMPONENT_ID, PAGE6_TABLE_NUM } from '../page6/parameterDefaults';
import { PAGE7_TABLE_COMPONENT_ID, PAGE7_TABLE_NUM } from '../page7/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import { getPage5EditableFieldIndexes } from './tableColumns';
import type { Page5ParameterItem, Page5TableRow } from './parameterDefaults';

export interface Page5InitResult {
  ok: boolean;
  equivalent: number;
}

function firstNonEmpty(...values: Array<string | number | undefined>): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

function findRowByScheme(
  list: Array<Record<string, string | number | undefined>>,
  schemeIndex: number,
  schemeLabel: string,
): Record<string, string | number | undefined> | undefined {
  if (list[schemeIndex]) return list[schemeIndex];
  return list.find(row => String(row.p0 ?? '').trim() === schemeLabel);
}

/** 总减速比优先读取 page3（初始总减速比计算）p18 文本框，按电机产品代号匹配行 */
function resolveTotalReductionRatioFromPage3(
  motorCode: string | number | undefined,
  motorList: Array<Record<string, string | number | undefined>>,
  page3List: Array<Record<string, string | number | undefined>>,
): string {
  const targetCode = String(motorCode ?? '').trim();
  let validMotorIndex = 0;

  for (const motorRow of motorList) {
    const code = String(motorRow.p2 ?? '').trim();
    if (!code) continue;
    if (targetCode && code === targetCode) {
      return readTableCell(page3List[validMotorIndex], 18);
    }
    validMotorIndex += 1;
  }

  return readTableCell(page3List[0], 18);
}

function readParamFromFlowOrSaved(
  paramList: Array<{ paramnum?: string; paramvalue?: string }>,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
  num: string,
): string {
  let val = '';
  (savedParamValues ?? []).forEach(row => {
    const key = String(row.paramKey ?? row.paramCode ?? '').trim();
    if (!val && key === num) {
      val = String(row.paramValue ?? '').trim();
    }
  });
  if (!val) {
    paramList.forEach(item => {
      if (!val && item.paramnum === num) {
        val = String(item.paramvalue ?? '').trim();
      }
    });
  }
  return val;
}

function findReducerRowByProductCode(
  reducerList: Array<Record<string, string | number | undefined>>,
  productCode: string,
): Record<string, string | number | undefined> | undefined {
  const code = String(productCode ?? '').trim();
  if (!code) return undefined;
  return reducerList.find(row => readTableCell(row, 2) === code);
}

function buildRowFromCombin(
  schemeIndex: number,
  combinRow: Record<string, string | number | undefined>,
  jsqStyle: string,
  page3TotalReductionRatio: string,
  page7Row?: Record<string, string | number | undefined>,
  page6Row?: Record<string, string | number | undefined>,
  flowMetrics?: { p1: string; p2: string; p3: string },
  reducerRow?: Record<string, string | number | undefined>,
): Page5TableRow {
  const data: Page5TableRow = {};
  const schemeLabel = `组合方案${schemeIndex + 1}`;
  data.p0 = schemeLabel;
  data.cellInputOrOutput0 = '1';

  // 初算指标：优先 page4 组合方案（来自 page3-1/page3）；其次 page7/page6 回写
  data.p1 = firstNonEmpty(
    readTableCell(combinRow, 1),
    readTableCell(page7Row, 1),
    readTableCell(page6Row, 1),
    flowMetrics?.p1,
  );
  data.cellInputOrOutput1 = '1';
  data.p2 = firstNonEmpty(
    readTableCell(combinRow, 2),
    readTableCell(page7Row, 2),
    readTableCell(page6Row, 2),
    flowMetrics?.p2,
  );
  data.cellInputOrOutput2 = '1';
  data.p3 = firstNonEmpty(
    readTableCell(combinRow, 3),
    readTableCell(page7Row, 3),
    readTableCell(page6Row, 3),
    flowMetrics?.p3,
  );
  data.cellInputOrOutput3 = '1';

  data.p4 = firstNonEmpty(combinRow.p4);
  data.cellInputOrOutput4 = '1';
  data.p5 = firstNonEmpty(combinRow.p5);
  data.cellInputOrOutput5 = '1';
  data.p6 = firstNonEmpty(combinRow.p6);
  data.cellInputOrOutput6 = '1';
  data.p7 = firstNonEmpty(readTableCell(reducerRow, 2), readTableCell(combinRow, 10));
  data.cellInputOrOutput7 = '1';
  data.p8 = firstNonEmpty(jsqStyle);
  data.cellInputOrOutput8 = '1';
  data.p9 = firstNonEmpty(readTableCell(reducerRow, 5), readTableCell(combinRow, 11));
  data.cellInputOrOutput9 = '1';
  data.p10 = firstNonEmpty(readTableCell(reducerRow, 6), readTableCell(combinRow, 12));
  data.cellInputOrOutput10 = '1';

  // 总减速比：优先 page3 p18 文本框；其次 page6/page7 实际零位总减速比、page4 combin p16
  data.p11 = firstNonEmpty(
    page3TotalReductionRatio,
    readTableCell(page7Row, 23),
    readTableCell(page6Row, 16),
    readTableCell(combinRow, 16),
  );
  data.cellInputOrOutput11 = '1';

  data.p12 = '';
  data.cellInputOrOutput12 = '1';
  data.p13 = '';
  data.cellInputOrOutput13 = '1';
  data.p14 = '';
  data.cellInputOrOutput14 = '1';

  return data;
}

export function captureEditableInputValues(rows: Page5TableRow[]): Map<string, Partial<Page5TableRow>> {
  const editableIndexes = getPage5EditableFieldIndexes();
  const saved = new Map<string, Partial<Page5TableRow>>();

  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    if (!key) return;

    const patch: Partial<Page5TableRow> = {};
    editableIndexes.forEach(index => {
      const isManual = row[`cellInputOrOutput${index}`] === '0';
      if (!isManual) return;

      patch[`p${index}`] = row[`p${index}`];
      const flag = row[`cellInputOrOutput${index}`];
      if (flag !== undefined && flag !== '') {
        patch[`cellInputOrOutput${index}`] = flag;
      }
    });
    saved.set(key, patch);
  });
  return saved;
}

export function restoreEditableInputValues(rows: Page5TableRow[], saved: Map<string, Partial<Page5TableRow>>) {
  const editableIndexes = getPage5EditableFieldIndexes();
  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    const patch = saved.get(key);
    if (!patch) return;

    editableIndexes.forEach(index => {
      const field = `p${index}`;
      if (field in patch) {
        row[field] = patch[field];
      }
      const flagField = `cellInputOrOutput${index}`;
      if (flagField in patch) {
        row[flagField] = patch[flagField];
      }
    });
  });
}

/** 从组合方案表刷新（原 initData） */
export function applyPage5InitData(
  list: Page5ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Page5InitResult {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);

  const combinList = resolveTableRows(sources, [{ tableNum: PAGE4_TABLE_NUM, componentId: PAGE4_TABLE_COMPONENT_ID }], 16);
  const page3List = resolveTableRows(
    sources,
    [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }],
    18,
  );
  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );
  const page7List = resolveTableRows(sources, [{ tableNum: PAGE7_TABLE_NUM, componentId: PAGE7_TABLE_COMPONENT_ID }], 28);
  const page6List = resolveTableRows(sources, [{ tableNum: PAGE6_TABLE_NUM, componentId: PAGE6_TABLE_COMPONENT_ID }], 16);
  const reducerList = resolveTableRows(
    sources,
    [{ tableNum: REDUCER_TABLE_NUM, componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID }],
    13,
  );

  const jsqStyle = readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ1_5_MDJSQXS');
  const dxlbStr = readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ1_5_DXLB');
  const equivalent = dxlbStr ? Number(dxlbStr) : 0;
  const flowMetrics = {
    p1: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_SCLJ_MAX'),
    p2: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_KZZS_MAX'),
    p3: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_EDZS'),
  };

  const existingRows = (list[0]?.tableMap?.rowData ?? []) as Page5TableRow[];
  const editableValues = captureEditableInputValues(existingRows);

  const dataList = combinList.map((item, index) => {
    const schemeLabel = `组合方案${index + 1}`;
    const page7Row = findRowByScheme(page7List, index, schemeLabel);
    const page6Row = findRowByScheme(page6List, index, schemeLabel);
    const page3TotalReductionRatio = resolveTotalReductionRatioFromPage3(item.p4, motorList, page3List);
    const reducerRow = findReducerRowByProductCode(reducerList, readTableCell(item, 10));
    return buildRowFromCombin(
      index,
      item,
      jsqStyle,
      page3TotalReductionRatio,
      page7Row,
      page6Row,
      flowMetrics,
      reducerRow,
    );
  });

  if (!list[0]?.tableMap) {
    return { ok: false, equivalent };
  }
  if (dataList.length === 0) {
    return { ok: false, equivalent };
  }

  list[0].tableMap.rowData = dataList;
  restoreEditableInputValues(dataList, editableValues);
  list[0].tableMap.rowNums = dataList.length;
  return { ok: true, equivalent };
}

/** 刷新上游继承字段（含减速器传动比 p9、最大输出力 p10），保留齿轮减速级数等用户输入 */
export function refreshPage5UpstreamFromFlow(
  list: Page5ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): boolean {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);

  const combinList = resolveTableRows(sources, [{ tableNum: PAGE4_TABLE_NUM, componentId: PAGE4_TABLE_COMPONENT_ID }], 16);
  const page3List = resolveTableRows(
    sources,
    [{ tableNum: PAGE3_TABLE_NUM, componentId: PAGE3_TABLE_COMPONENT_ID }],
    18,
  );
  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );
  const page7List = resolveTableRows(sources, [{ tableNum: PAGE7_TABLE_NUM, componentId: PAGE7_TABLE_COMPONENT_ID }], 28);
  const page6List = resolveTableRows(sources, [{ tableNum: PAGE6_TABLE_NUM, componentId: PAGE6_TABLE_COMPONENT_ID }], 16);
  const reducerList = resolveTableRows(
    sources,
    [{ tableNum: REDUCER_TABLE_NUM, componentId: PAGE2_1_REDUCER_TABLE_COMPONENT_ID }],
    13,
  );

  const jsqStyle = readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ1_5_MDJSQXS');
  const flowMetrics = {
    p1: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_SCLJ_MAX'),
    p2: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_KZZS_MAX'),
    p3: readParamFromFlowOrSaved(paramList, savedParamValues, 'DJ2_4_EDZS'),
  };

  const rows = list[0]?.tableMap?.rowData as Page5TableRow[] | undefined;
  if (!rows?.length) return false;

  rows.forEach((row, index) => {
    const schemeLabel = String(row.p0 ?? `组合方案${index + 1}`).trim();
    const combinRow = findRowByScheme(combinList, index, schemeLabel) ?? {};
    const page7Row = findRowByScheme(page7List, index, schemeLabel);
    const page6Row = findRowByScheme(page6List, index, schemeLabel);
    const page3TotalReductionRatio = resolveTotalReductionRatioFromPage3(
      firstNonEmpty(readTableCell(combinRow, 4), row.p4),
      motorList,
      page3List,
    );
    const reducerCode = firstNonEmpty(readTableCell(combinRow, 10), row.p7);
    const reducerRow = findReducerRowByProductCode(reducerList, reducerCode);
    const refreshed = buildRowFromCombin(
      index,
      combinRow,
      jsqStyle,
      page3TotalReductionRatio,
      page7Row,
      page6Row,
      flowMetrics,
      reducerRow,
    );
    for (let i = 1; i <= 11; i++) {
      row[`p${i}`] = refreshed[`p${i}`];
    }
  });
  return true;
}
