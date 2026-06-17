import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { PAGE4_TABLE_COMPONENT_ID, PAGE4_TABLE_NUM } from '../page4/parameterDefaults';
import { PAGE5_TABLE_COMPONENT_ID, PAGE5_TABLE_NUM } from '../page5/parameterDefaults';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import { getPage6EditableFieldIndexes } from './tableColumns';
import type { Page6ParameterItem, Page6TableRow } from './parameterDefaults';

export interface Page6InitResult {
  ok: boolean;
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

function readParamFromFlow(paramList: Array<{ paramnum?: string; paramvalue?: string }>, num: string): string {
  let val = '';
  paramList.forEach(item => {
    if (!val && item.paramnum === num) {
      val = String(item.paramvalue ?? '').trim();
    }
  });
  return val;
}

/** 按齿轮减速级数设置各级齿数输入框可编辑/只读：cellInputOrOutput=0 可输入，=1 只读；只读单元格置空 */
export function applyGearLevelCellFlags(row: Page6TableRow) {
  const level = Number(row.p8);
  const editableByLevel: Record<number, boolean> = {
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
  };

  if (level === 1) {
    editableByLevel[11] = false;
    editableByLevel[12] = false;
    editableByLevel[13] = false;
    editableByLevel[14] = false;
  } else if (level === 2) {
    editableByLevel[13] = false;
    editableByLevel[14] = false;
  }

  for (let i = 10; i <= 14; i++) {
    const editable = editableByLevel[i];
    row[`cellInputOrOutput${i}`] = editable ? '0' : '1';
    if (!editable) {
      row[`p${i}`] = '';
      row[`cellUserOverride${i}`] = '';
    }
  }
}

export function applyGearLevelCellFlagsToRows(rows: Page6TableRow[]) {
  rows.forEach(row => applyGearLevelCellFlags(row));
}

function resolvePage6FlowSources(savedTables?: Array<Record<string, unknown>> | null) {
  const paramList = getFlowParameterList();
  const sources = collectTableSources(savedTables);
  const dispatchList = resolveTableRows(
    sources,
    [{ tableNum: PAGE5_TABLE_NUM, componentId: PAGE5_TABLE_COMPONENT_ID }],
    14,
  );
  const combinList = resolveTableRows(
    sources,
    [{ tableNum: PAGE4_TABLE_NUM, componentId: PAGE4_TABLE_COMPONENT_ID }],
    16,
  );
  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );
  const flowMetrics = {
    p1: readParamFromFlow(paramList, 'DJ2_4_SCLJ_MAX'),
    p2: readParamFromFlow(paramList, 'DJ2_4_KZZS_MAX'),
    p3: readParamFromFlow(paramList, 'DJ2_4_EDZS'),
  };
  return { dispatchList, combinList, motorList, flowMetrics };
}

/** 从 page5 分配表同步上游字段（含齿轮减速级数 p8），不清空齿数输入 */
function applyUpstreamFieldsToRow(
  row: Page6TableRow,
  dispatchRow: Record<string, string | number | undefined>,
  motorRows: Array<Record<string, string | number | undefined>>,
  combinRow?: Record<string, string | number | undefined>,
  flowMetrics?: { p1: string; p2: string; p3: string },
) {
  row.p1 = firstNonEmpty(readTableCell(dispatchRow, 1), readTableCell(combinRow, 1), flowMetrics?.p1);
  row.p2 = firstNonEmpty(readTableCell(dispatchRow, 2), readTableCell(combinRow, 2), flowMetrics?.p2);
  row.p3 = firstNonEmpty(readTableCell(dispatchRow, 3), readTableCell(combinRow, 3), flowMetrics?.p3);
  row.p4 = firstNonEmpty(readTableCell(dispatchRow, 11));
  row.p5 = firstNonEmpty(readTableCell(dispatchRow, 13));
  const gearRatio = Number(row.p5);
  row.p6 = Number.isFinite(gearRatio) ? (gearRatio * 0.9).toFixed(3) : '';
  row.p7 = Number.isFinite(gearRatio) ? (gearRatio * 1.1).toFixed(3) : '';
  row.p8 = firstNonEmpty(readTableCell(dispatchRow, 14));

  const motorCode = firstNonEmpty(readTableCell(dispatchRow, 4));
  motorRows.forEach(motor => {
    if (motorCode && motorCode === readTableCell(motor, 2)) {
      row.p9 = firstNonEmpty(readTableCell(motor, 18));
    }
  });

  applyGearLevelCellFlags(row);
}

function buildRowFromDispatch(
  schemeIndex: number,
  dispatchRow: Record<string, string | number | undefined>,
  motorRows: Array<Record<string, string | number | undefined>>,
  combinRow?: Record<string, string | number | undefined>,
  flowMetrics?: { p1: string; p2: string; p3: string },
): Page6TableRow {
  const data: Page6TableRow = {};
  data.p0 = `组合方案${schemeIndex + 1}`;
  applyUpstreamFieldsToRow(data, dispatchRow, motorRows, combinRow, flowMetrics);
  data.p10 = '';
  data.p11 = '';
  data.p12 = '';
  data.p13 = '';
  data.p14 = '';
  data.p15 = '';
  data.p16 = '';
  return data;
}

/** 仅刷新上游继承字段（page5 修改齿轮减速级数后同步到 page6，保留已填齿数） */
export function refreshPage6UpstreamFromFlow(
  list: Page6ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const { dispatchList, combinList, motorList, flowMetrics } = resolvePage6FlowSources(savedTables);
  if (!dispatchList.length || !list[0]?.tableMap?.rowData?.length) {
    return false;
  }

  const rows = list[0].tableMap.rowData as Page6TableRow[];
  rows.forEach((row, index) => {
    const schemeLabel = String(row.p0 ?? `组合方案${index + 1}`).trim();
    const dispatchRow = findRowByScheme(dispatchList, index, schemeLabel);
    if (!dispatchRow) return;
    const combinRow = findRowByScheme(combinList, index, schemeLabel);
    applyUpstreamFieldsToRow(row, dispatchRow, motorList, combinRow, flowMetrics);
  });
  return true;
}

export function captureEditableInputValues(rows: Page6TableRow[]): Map<string, Partial<Page6TableRow>> {
  const editableIndexes = getPage6EditableFieldIndexes();
  const saved = new Map<string, Partial<Page6TableRow>>();

  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    if (!key) return;

    const patch: Partial<Page6TableRow> = {};
    editableIndexes.forEach(index => {
      patch[`p${index}`] = row[`p${index}`];
      const flag = row[`cellInputOrOutput${index}`];
      if (flag !== undefined && flag !== '') {
        patch[`cellInputOrOutput${index}`] = flag;
      }
      const override = row[`cellUserOverride${index}`];
      if (override !== undefined && override !== '') {
        patch[`cellUserOverride${index}`] = override;
      }
    });
    saved.set(key, patch);
  });
  return saved;
}

export function restoreEditableInputValues(
  rows: Page6TableRow[],
  saved: Map<string, Partial<Page6TableRow>>,
  options?: { preserveOnlyUserOverride?: boolean },
) {
  const editableIndexes = getPage6EditableFieldIndexes();
  const preserveOnlyUserOverride = options?.preserveOnlyUserOverride ?? false;
  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    const patch = saved.get(key);
    if (!patch) return;

    editableIndexes.forEach(index => {
      const overrideField = `cellUserOverride${index}`;
      if (preserveOnlyUserOverride && patch[overrideField] !== '1') return;

      const field = `p${index}`;
      if (field in patch) {
        row[field] = patch[field];
      }
      const flagField = `cellInputOrOutput${index}`;
      if (flagField in patch) {
        row[flagField] = patch[flagField];
      }
      if (overrideField in patch) {
        row[overrideField] = patch[overrideField];
      }
    });
  });
}

/** 从齿轮减速比分配表、电机选型表、组合方案表刷新（原 initData） */
export function applyPage6InitData(
  list: Page6ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page6InitResult {
  const { dispatchList, combinList, motorList, flowMetrics } = resolvePage6FlowSources(savedTables);

  const dataList = dispatchList.map((item, index) => {
    const schemeLabel = `组合方案${index + 1}`;
    const combinRow = findRowByScheme(combinList, index, schemeLabel);
    return buildRowFromDispatch(index, item, motorList, combinRow, flowMetrics);
  });

  if (!list[0]?.tableMap) {
    return { ok: false };
  }
  if (dataList.length === 0) {
    return { ok: false };
  }

  const existingRows = (list[0].tableMap.rowData ?? []) as Page6TableRow[];
  const editableValues = captureEditableInputValues(existingRows);

  list[0].tableMap.rowData = dataList;
  restoreEditableInputValues(dataList, editableValues, { preserveOnlyUserOverride: true });
  applyGearLevelCellFlagsToRows(dataList);
  list[0].tableMap.rowNums = dataList.length;
  return { ok: true };
}
