import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { PAGE5_TABLE_COMPONENT_ID, PAGE5_TABLE_NUM } from '../page5/parameterDefaults';
import { collectTableSources, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getPage6EditableFieldIndexes } from './tableColumns';
import type { Page6ParameterItem, Page6TableRow } from './parameterDefaults';

export interface Page6InitResult {
  ok: boolean;
}

function applyGearLevelCellFlags(row: Page6TableRow) {
  const level = Number(row.p8);
  if (level === 2) {
    row.cellInputOrOutput13 = '1';
    row.cellInputOrOutput14 = '1';
  }
  if (level === 1) {
    row.cellInputOrOutput11 = '1';
    row.cellInputOrOutput12 = '1';
    row.cellInputOrOutput13 = '1';
    row.cellInputOrOutput14 = '1';
  }
}

function buildRowFromDispatch(
  schemeIndex: number,
  dispatchRow: Record<string, string | number | undefined>,
  motorRows: Array<Record<string, string | number | undefined>>,
): Page6TableRow {
  const data: Page6TableRow = {};
  data.p0 = `组合方案${schemeIndex + 1}`;
  data.p1 = String(dispatchRow.p1 ?? '');
  data.p2 = String(dispatchRow.p2 ?? '');
  data.p3 = String(dispatchRow.p3 ?? '');
  data.p4 = String(dispatchRow.p11 ?? '');
  data.p5 = String(dispatchRow.p13 ?? '');
  const gearRatio = Number(dispatchRow.p13);
  data.p6 = Number.isFinite(gearRatio) ? (gearRatio * 0.9).toFixed(3) : '';
  data.p7 = Number.isFinite(gearRatio) ? (gearRatio * 1.1).toFixed(3) : '';
  data.p8 = String(dispatchRow.p14 ?? '');

  motorRows.forEach(motor => {
    if (dispatchRow.p4 === motor.p2) {
      data.p9 = String(motor.p18 ?? '');
    }
  });

  data.p10 = '';
  data.p11 = '';
  data.p12 = '';
  data.p13 = '';
  data.p14 = '';
  data.p15 = '';
  data.p16 = '';

  applyGearLevelCellFlags(data);
  return data;
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

export function restoreEditableInputValues(rows: Page6TableRow[], saved: Map<string, Partial<Page6TableRow>>) {
  const editableIndexes = getPage6EditableFieldIndexes();
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
      const overrideField = `cellUserOverride${index}`;
      if (overrideField in patch) {
        row[overrideField] = patch[overrideField];
      }
    });
  });
}

/** 从齿轮减速比分配表、电机选型表刷新（原 initData） */
export function applyPage6InitData(
  list: Page6ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page6InitResult {
  const sources = collectTableSources(savedTables);

  const dispatchList = resolveTableRows(
    sources,
    [{ tableNum: PAGE5_TABLE_NUM, componentId: PAGE5_TABLE_COMPONENT_ID }],
    14,
  );
  const motorList = resolveTableRows(
    sources,
    [{ tableNum: MOTOR_SELECT_TABLE_NUM, componentId: PAGE2_MOTOR_TABLE_COMPONENT_ID }],
    20,
  );

  const dataList = dispatchList.map((item, index) => buildRowFromDispatch(index, item, motorList));

  if (!list[0]?.tableMap) {
    return { ok: false };
  }
  if (dataList.length === 0) {
    return { ok: false };
  }

  const existingRows = (list[0].tableMap.rowData ?? []) as Page6TableRow[];
  const editableValues = captureEditableInputValues(existingRows);

  list[0].tableMap.rowData = dataList;
  restoreEditableInputValues(dataList, editableValues);
  list[0].tableMap.rowNums = dataList.length;
  return { ok: true };
}
