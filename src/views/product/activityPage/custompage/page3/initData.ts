import type { Page3ParameterItem, Page3TableRow } from './parameterDefaults';
import { PAGE2_MOTOR_TABLE_COMPONENT_ID } from '../page2/parameterDefaults';
import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';

type TableSource = {
  tablenum?: string;
  tableNum?: string;
  componentId?: string | number;
  rowdata?: Array<Record<string, string | number | undefined>>;
  rowData?: Array<Record<string, string | number | undefined>>;
  values?: Array<Record<string, string | number | undefined>>;
};

function readTableCell(row: Record<string, string | number | undefined> | undefined, pIndex: number): string {
  if (!row) return '';
  const pVal = String(row[`p${pIndex}`] ?? '').trim();
  if (pVal) return pVal;
  return String(row[`c${pIndex + 1}`] ?? '').trim();
}

function normalizeTableRows(table: TableSource): Array<Record<string, string | number | undefined>> {
  const rows = table.rowdata ?? table.rowData ?? table.values;
  return Array.isArray(rows) ? rows : [];
}

function normalizeMotorRow(row: Record<string, string | number | undefined>): Record<string, string | number | undefined> {
  const next: Record<string, string | number | undefined> = { ...row };
  for (let i = 0; i <= 20; i++) {
    const val = readTableCell(row, i);
    if (val) next[`p${i}`] = val;
  }
  return next;
}

function collectTableSources(savedTables?: Array<Record<string, unknown>> | null): TableSource[] {
  const sources: TableSource[] = getFlowTableList().map(item => ({
    tablenum: item.tablenum,
    componentId: item.componentId,
    rowdata: item.rowdata,
  }));
  (Array.isArray(savedTables) ? savedTables : []).forEach(raw => {
    if (!raw || typeof raw !== 'object') return;
    sources.push(raw as TableSource);
  });
  return sources;
}

function resolveMotorRowsFromSources(sources: TableSource[]): Array<Record<string, string | number | undefined>> {
  const wantTableNum = MOTOR_SELECT_TABLE_NUM;
  const wantComponentId = String(PAGE2_MOTOR_TABLE_COMPONENT_ID);

  for (const table of sources) {
    const tableNum = String(table.tablenum ?? table.tableNum ?? '').trim();
    const componentId = String(table.componentId ?? '').trim();
    const matchTableNum = tableNum === wantTableNum;
    const matchComponentId = componentId === wantComponentId;
    if (!matchTableNum && !matchComponentId) continue;

    const rows = normalizeTableRows(table).map(normalizeMotorRow);
    if (rows.length) return rows;
  }
  return [];
}

function buildPage3RowFromMotor(
  motorRow: Record<string, string | number | undefined>,
  motionEffic: string,
  maxZeroLoadRotationRate: string,
  maxPower: string,
  standardPower: string,
): Page3TableRow {
  const data: Page3TableRow = {};
  data.p0 = String(motorRow.p1 ?? '');
  data.cellInputOrOutput0 = '1';
  data.p1 = String(motorRow.p3 ?? '');
  data.cellInputOrOutput1 = '1';
  data.p2 = String(motorRow.p4 ?? '');
  data.cellInputOrOutput2 = '1';
  data.p3 = String(motorRow.p5 ?? '');
  data.cellInputOrOutput3 = '1';
  data.p4 = String(motorRow.p11 ?? '');
  data.cellInputOrOutput4 = '1';
  data.p5 = motionEffic;
  data.cellInputOrOutput5 = '1';
  data.p6 = maxZeroLoadRotationRate;
  data.cellInputOrOutput6 = '1';
  data.p7 = maxPower;
  data.cellInputOrOutput7 = '1';
  data.p8 = standardPower;
  data.cellInputOrOutput8 = '1';
  for (let i = 9; i <= 18; i++) {
    data[`p${i}`] = '';
    data[`cellParameterId${i}`] = '';
    data[`cellInputOrOutput${i}`] = '1';
  }
  return data;
}

/** 从流程上下文 / 已保存表格刷新表格（原 initData） */
export function applyPage3InitData(
  list: Page3ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): boolean {
  const paramList = getFlowParameterList();
  const djList = resolveMotorRowsFromSources(collectTableSources(savedTables));

  let motionEffic = '';
  let djOutputStyle = '';
  let maxZeroLoadRotationRateX = '';
  let maxZeroLoadRotationRateZ = '';
  let maxPowerX = '';
  let maxPowerZ = '';
  let standardPowerX = '';
  let standardPowerZ = '';

  paramList.forEach(item => {
    if (motionEffic === '' && item.paramnum === 'DJ2_0_CDXL') {
      motionEffic = item.paramvalue ?? '';
    }
    if (djOutputStyle === '' && item.paramnum === 'DJ1_1_GZFS') {
      djOutputStyle = item.paramvalue ?? '';
    }
    if (maxZeroLoadRotationRateX === '' && item.paramnum === 'DJ1_1_KZZS_MAX_X') {
      maxZeroLoadRotationRateX = item.paramvalue ?? '';
    }
    if (maxZeroLoadRotationRateZ === '' && item.paramnum === 'DJ1_1_KZZS_MAX_Z') {
      maxZeroLoadRotationRateZ = item.paramvalue ?? '';
    }
    if (maxPowerX === '' && item.paramnum === 'DJ1_1_SCLJ_MAX_X') {
      maxPowerX = item.paramvalue ?? '';
    }
    if (maxPowerZ === '' && item.paramnum === 'DJ1_1_SCL_MAX_Z') {
      maxPowerZ = item.paramvalue ?? '';
    }
    if (standardPowerX === '' && item.paramnum === 'DJ1_1_SCLJ_ED_X') {
      standardPowerX = item.paramvalue ?? '';
    }
    if (standardPowerZ === '' && item.paramnum === 'DJ1_1_SCL_ED_Z') {
      standardPowerZ = item.paramvalue ?? '';
    }
  });

  let maxZeroLoadRotationRate = maxZeroLoadRotationRateX;
  let maxPower = maxPowerX;
  let standardPower = standardPowerX;
  if (djOutputStyle.substring(0, 2) === '直线') {
    maxZeroLoadRotationRate = maxZeroLoadRotationRateZ;
    maxPower = maxPowerZ;
    standardPower = standardPowerZ;
  }

  const dataList = djList.map(item =>
    buildPage3RowFromMotor(item, motionEffic, maxZeroLoadRotationRate, maxPower, standardPower),
  );

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
