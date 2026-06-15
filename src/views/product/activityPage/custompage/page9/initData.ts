import { PAGE8_SEL_INDEX_PARAM, PAGE8_TABLE_COMPONENT_ID, PAGE8_TABLE_NUM } from '../page8/parameterDefaults';
import { resolvePage8SchemeRowsFromSources } from '../page8/initData';
import { collectTableSources, readTableCell, resolveTableRows } from '../_shared/utils/flowTableSources';
import { getFlowParameterList } from '../shared/flowContext';
import {
  createDefaultGearStressRow,
  gearTableNumForIndex,
  PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE,
  PAGE9_GEAR_TABLE_NUM,
  type Page9GearRow,
  type Page9ParameterItem,
  type Page9SchemeRow,
} from './parameterDefaults';
import { getPage9EditableFieldIndexes } from './tableColumns';
import { calculateGearTorqueChain, extractGearNumbers } from './torqueCalculations';

export interface Page9InitResult {
  ok: boolean;
  cleared?: boolean;
}

type GearEditableSnapshot = Map<string, Partial<Page9GearRow>>;

function firstNonEmpty(...values: Array<string | number | undefined>): string {
  for (const v of values) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

function findRowByScheme(
  list: Page9SchemeRow[],
  schemeIndex: number,
  schemeLabel: string,
): Page9SchemeRow | undefined {
  if (list[schemeIndex]) return list[schemeIndex];
  return list.find(row => String(row.p0 ?? '').trim() === schemeLabel);
}

/** page9 列顺序与 page5/page8 不同：p2=额定负载速度，p3=最大空载速度 */
function mapPage8RowToPage9Scheme(row: Record<string, string | number | undefined>): Page9SchemeRow {
  const data: Page9SchemeRow = {};
  for (let i = 0; i <= 20; i++) {
    const val = readTableCell(row, i);
    if (val) data[`p${i}`] = val;
  }
  data.p1 = firstNonEmpty(readTableCell(row, 1));
  data.p2 = firstNonEmpty(readTableCell(row, 3));
  data.p3 = firstNonEmpty(readTableCell(row, 2));
  return data;
}

/** 优先 page8 流程表，否则从 page5/6/7 构建 */
export function resolvePage9SchemeSourceRows(
  savedTables?: Array<Record<string, unknown>> | null,
): Page9SchemeRow[] {
  const sources = collectTableSources(savedTables);
  const page8List = resolveTableRows(
    sources,
    [{ tableNum: PAGE8_TABLE_NUM, componentId: PAGE8_TABLE_COMPONENT_ID }],
    20,
  );
  if (page8List.length) {
    return page8List.map(mapPage8RowToPage9Scheme);
  }
  return resolvePage8SchemeRowsFromSources(savedTables).map(mapPage8RowToPage9Scheme);
}

/** 刷新方案表初算指标等上游字段，保留当前行集合与勾选 */
export function refreshPage9SchemePerformanceFields(
  list: Page9ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const upstreamRows = resolvePage9SchemeSourceRows(savedTables);
  if (!upstreamRows.length || !list[0]?.tableMap?.rowData?.length) {
    return false;
  }

  const rows = list[0].tableMap.rowData as Page9SchemeRow[];
  rows.forEach((row, index) => {
    const schemeLabel = String(row.p0 ?? `组合方案${index + 1}`).trim();
    const upstream = findRowByScheme(upstreamRows, index, schemeLabel);
    if (!upstream) return;
    row.p1 = upstream.p1 ?? row.p1;
    row.p2 = upstream.p2 ?? row.p2;
    row.p3 = upstream.p3 ?? row.p3;
    for (let i = 4; i <= 20; i++) {
      const field = `p${i}`;
      const val = String(upstream[field] ?? '').trim();
      if (val && val !== '--') {
        row[field] = upstream[field];
      }
    }
  });
  return true;
}

function isPage9GearStressTable(item: Page9ParameterItem): boolean {
  const tableNum = String(item.tableNum ?? '');
  return tableNum === PAGE9_GEAR_TABLE_NUM || tableNum.startsWith(`${PAGE9_GEAR_TABLE_NUM}`);
}

export function captureGearEditableValues(rows: Page9GearRow[]): GearEditableSnapshot {
  const editableIndexes = getPage9EditableFieldIndexes();
  const saved = new Map<string, Partial<Page9GearRow>>();

  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    if (!key) return;

    const patch: Partial<Page9GearRow> = {};
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

export function restoreGearEditableValues(
  rows: Page9GearRow[],
  saved: GearEditableSnapshot,
  options?: { preserveOnlySavedOrManual?: boolean },
) {
  const editableIndexes = getPage9EditableFieldIndexes();
  const preserveOnlySavedOrManual = options?.preserveOnlySavedOrManual ?? false;

  rows.forEach(row => {
    const key = String(row.p0 ?? '').trim();
    const patch = saved.get(key);
    if (!patch) return;

    editableIndexes.forEach(index => {
      const field = `p${index}`;
      if (!(field in patch)) return;

      const overrideField = `cellUserOverride${index}`;
      const hasOverride = patch[overrideField] === '1';
      const hasValue = String(patch[field] ?? '') !== '' && String(patch[field] ?? '') !== '--';
      if (preserveOnlySavedOrManual && !hasOverride && !hasValue) return;

      row[field] = patch[field];

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

export function captureAllPage9GearTablesEditable(
  list: Page9ParameterItem[],
): Map<string, GearEditableSnapshot> {
  const result = new Map<string, GearEditableSnapshot>();
  list.forEach(item => {
    if (!isPage9GearStressTable(item)) return;
    const tableNum = String(item.tableNum ?? '');
    const rows = (item.tableMap?.rowData ?? []) as Page9GearRow[];
    result.set(tableNum, captureGearEditableValues(rows));
  });
  return result;
}

export function restoreAllPage9GearTablesEditable(
  list: Page9ParameterItem[],
  saved: Map<string, GearEditableSnapshot>,
) {
  list.forEach(item => {
    if (!isPage9GearStressTable(item)) return;
    const tableNum = String(item.tableNum ?? '');
    const snapshot = saved.get(tableNum);
    if (!snapshot) return;
    const rows = (item.tableMap?.rowData ?? []) as Page9GearRow[];
    restoreGearEditableValues(rows, snapshot);
  });
}

export function markPage9GearManualEdit(row: Page9GearRow, field: string) {
  const fieldIndex = Number(String(field).replace(/^p/, ''));
  if (!getPage9EditableFieldIndexes().includes(fieldIndex)) return;
  row[`cellUserOverride${fieldIndex}`] = '1';
}

/** 方案表无数据时，用展示表（componentId=25）已合并的后端值补全 */
export function supplementGearRowsFromDisplay(list: Page9ParameterItem[], gearRows: Page9GearRow[]) {
  const displayRows = getGearDisplayRows(list);
  if (!displayRows.length) return;

  gearRows.forEach((row, index) => {
    const displayRow = displayRows.find(item => item.p0 === row.p0) ?? displayRows[index];
    if (!displayRow) return;

    getPage9EditableFieldIndexes().forEach(fieldIndex => {
      const field = `p${fieldIndex}`;
      const current = String(row[field] ?? '');
      const fallback = String(displayRow[field] ?? '');
      if ((!current || current === '--') && fallback && fallback !== '--') {
        row[field] = displayRow[field];
      }
    });
  });
}

function cloneGearRowsTemplate(loadCoeff: string, torques: ReturnType<typeof calculateGearTorqueChain>, gearNums: string[]) {
  const names = ['电机齿轮', '第一级从动轮', '第二级主动轮', '第二级从动轮', '第三级主动轮', '第三级从动轮'];
  const torqueValues = [torques.dj, torques.level1, torques.level2Drive, torques.level2Driven, torques.level3Drive, torques.level3Driven];

  return names.map((name, idx) =>
    createDefaultGearStressRow(name, loadCoeff, {
      p1: String(torqueValues[idx] ?? ''),
      p3: gearNums[idx] ?? '',
      p8: loadCoeff,
      ...(idx === 0
        ? {
            cellInputOrOutput0: '0',
            cellParameterId0: '',
            cellParentNum0: '',
            cellInputName0: '齿轮',
            cellInputOrOutput1: '0',
            cellParameterId1: '',
            cellParentNum1: 'DJ2_10_CLNJ',
            cellInputName1: '齿轮扭矩',
            cellInputOrOutput2: '0',
            cellParameterId2: '',
            cellParentNum2: 'DJ2_10_CLMS',
            cellInputName2: '齿轮模数',
            cellInputOrOutput3: '0',
            cellParameterId3: '',
            cellParentNum3: 'DJ2_10_CLCS',
            cellInputName3: '齿轮齿数',
            cellInputOrOutput4: '0',
            cellParameterId4: '',
            cellParentNum4: 'DJ2_10_CK',
            cellInputName4: '齿宽',
            cellInputOrOutput5: '0',
            cellParameterId5: '',
            cellParentNum5: 'DJ2_10_CXXS',
            cellInputName5: '齿形系数',
            cellInputOrOutput6: '0',
            cellParameterId6: '',
            cellParentNum6: 'DJ2_10_CXXZXS',
            cellInputName6: '齿形修正系数',
            cellInputOrOutput7: '0',
            cellParameterId7: '',
            cellParentNum7: 'DJ2_10_QXL',
            cellInputName7: '切向力',
            cellInputOrOutput8: '0',
            cellParameterId8: '',
            cellParentNum8: 'DJ2_10_ZHXS',
            cellInputName8: '载荷系数',
            cellInputOrOutput9: '0',
            cellParameterId9: '',
            cellParentNum9: 'DJ2_10_CGWQYL',
            cellInputName9: '齿根弯曲应力',
          }
        : {}),
    }),
  );
}

function buildPerSchemeGearTable(
  schemeRow: Page9SchemeRow,
  index: number,
  loadCoeff: string,
  cdxl: string,
  pageId: string,
  userId: string,
): Page9ParameterItem {
  const torques = calculateGearTorqueChain(schemeRow, cdxl, 0);
  const gearNums = extractGearNumbers(schemeRow);
  const rowData = cloneGearRowsTemplate(loadCoeff, torques, gearNums);

  return {
    inputType: 'table',
    ifSingleLine: 't',
    pageId,
    tableMap: {
      tableType: '1',
      colNums: '9',
      rowNums: 6,
      rowData,
      colStr: ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'],
    },
    tableName: '齿轮应力计算',
    inputName: '齿轮应力计算',
    tableType: '1',
    tableNum: gearTableNumForIndex(index),
    componentId: PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE + index,
    addthis: '1',
    treeKey: 4 + index,
    userId,
  };
}

export function trimExtraGearTables(list: Page9ParameterItem[], keepCount: number) {
  if (list.length > keepCount) {
    list.splice(keepCount);
  }
}

export function setGearDisplayRows(list: Page9ParameterItem[], rows: Page9GearRow[]) {
  if (!list[2]?.tableMap) return;
  list[2].tableMap.rowData = rows;
  list[2].tableMap.rowNums = rows.length;
}

export function getGearDisplayRows(list: Page9ParameterItem[]): Page9GearRow[] {
  return (list[2]?.tableMap?.rowData ?? []) as Page9GearRow[];
}

/** 从 page8 / page5-7 筛选方案刷新（原 initData） */
export function applyPage9InitData(
  list: Page9ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page9InitResult {
  const paramList = getFlowParameterList();

  let selIndexs = '';
  let cdxl = '';
  paramList.forEach(item => {
    if (item.paramnum === PAGE8_SEL_INDEX_PARAM) {
      selIndexs = String(item.paramvalue ?? '');
    }
    if (cdxl === '' && item.paramnum === 'DJ2_0_CDXL') {
      cdxl = String(item.paramvalue ?? '');
    }
  });

  if (!selIndexs || selIndexs === ',') {
    if (list[0]?.tableMap) {
      list[0].tableMap.rowData = [];
    }
    if (list[2]?.tableMap) {
      list[2].tableMap.rowData = [];
    }
    trimExtraGearTables(list, 3);
    return { ok: false, cleared: true };
  }

  if (selIndexs.endsWith(',')) {
    selIndexs = selIndexs.slice(0, -1);
  }

  const combinList = resolvePage9SchemeSourceRows(savedTables);

  const indexArr = selIndexs.split(',').filter(Boolean);
  const dataList = indexArr
    .map(idx => combinList[Number(idx)])
    .filter((row): row is Page9SchemeRow => !!row);

  if (!list[0]?.tableMap || dataList.length === 0) {
    return { ok: false };
  }

  const gearEditableSnapshot = captureAllPage9GearTablesEditable(list);

  const loadCoeff = String(list[1]?.defaultValue ?? '1.2');
  const pageId = String(list[0].pageId ?? '');
  const userId = String(list[0].userid ?? '');

  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;

  trimExtraGearTables(list, 3);

  dataList.forEach((scheme, index) => {
    list.push(buildPerSchemeGearTable(scheme, index, loadCoeff, cdxl, pageId, userId));
  });

  restoreAllPage9GearTablesEditable(list, gearEditableSnapshot);

  return { ok: true };
}
