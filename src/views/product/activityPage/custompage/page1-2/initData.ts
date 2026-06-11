import type { Page1_2ParameterItem } from './parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';

export interface Page1_2InitState {
  flag: boolean;
  djzdlj: string;
}

type TableSource = {
  tablenum?: string;
  componentId?: string | number;
  rowdata?: Array<Record<string, string | number | undefined>>;
  values?: Array<Record<string, string | number | undefined>>;
  rowData?: Array<Record<string, string | number | undefined>>;
};

/** 读取表格单元格（兼容 pN 与保存后的 cN+1 格式） */
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

function collectTableSources(savedTables?: Array<Record<string, unknown>> | null): TableSource[] {
  const sources: TableSource[] = [...getFlowTableList()];
  (Array.isArray(savedTables) ? savedTables : []).forEach(raw => {
    if (!raw || typeof raw !== 'object') return;
    sources.push(raw as TableSource);
  });
  return sources;
}

function readEqualArmFromSources(
  sources: TableSource[],
  matchers: Array<{ tableNum?: string; componentId?: string | number; pIndex: number }>,
): string {
  for (const matcher of matchers) {
    const wantTableNum = String(matcher.tableNum ?? '').trim();
    const wantComponentId = String(matcher.componentId ?? '').trim();
    for (const table of sources) {
      const tableNum = String(table.tablenum ?? '').trim();
      const componentId = String(table.componentId ?? '').trim();
      if (wantTableNum && tableNum !== wantTableNum) continue;
      if (!wantTableNum && wantComponentId && componentId !== wantComponentId) continue;
      const val = readTableCell(normalizeTableRows(table)[0], matcher.pIndex);
      if (val) return val;
    }
  }
  return '';
}

/** 从 page1-1 / page1 零位表读取等效力臂 */
function resolveEqualArmFromUpstreamTables(workMode: string, savedTables?: Array<Record<string, unknown>> | null): string {
  const sources = collectTableSources(savedTables);

  // page1-1「比及行程」零位表：等效力臂 L1 在 p8（截图箭头 41.94）
  const page11Matchers = [
    { componentId: 1, pIndex: 8 },
    { tableNum: 'DJ1-1_T_ZEROINITPOSITION', pIndex: 8 },
  ];

  if (workMode === '直线非喷管' || workMode === '直线喷管') {
    const fromPage11 = readEqualArmFromSources(sources, page11Matchers);
    if (fromPage11) return fromPage11;
  }

  if (workMode === '直线喷管') {
    return readEqualArmFromSources(sources, [
      { componentId: 3, pIndex: 6 },
      { tableNum: 'DJ1_T_ZEROINITPOSITION', pIndex: 6 },
    ]);
  }

  return '';
}

/** 从流程上下文初始化页面数据（原 initData + updateEl） */
export function applyPage1_2InitData(
  parameterTempList: Page1_2ParameterItem[],
  savedTables?: Array<Record<string, unknown>> | null,
): Page1_2InitState {
  const state: Page1_2InitState = { flag: false, djzdlj: '' };
  const paramsList = getFlowParameterList();

  const preservedWorkMode = parameterTempList[0]?.defaultValue ?? '';
  paramsList.forEach(item => {
    if (item.paramnum === 'DJ1_1_GZFS' && item.paramvalue !== '') {
      if (parameterTempList[0]) {
        parameterTempList[0].defaultValue = item.paramvalue ?? '';
      }
    }
  });
  if (parameterTempList[0] && !parameterTempList[0].defaultValue && preservedWorkMode) {
    parameterTempList[0].defaultValue = preservedWorkMode;
  }

  const djOutputStyle = parameterTempList[0]?.defaultValue ?? '';
  let endpointJSQStyle = '直线';
  if (djOutputStyle === '旋转非拨叉类') {
    endpointJSQStyle = '旋转';
  }
  if (parameterTempList[1]) {
    parameterTempList[1].defaultValue = endpointJSQStyle;
  }

  let maxPowerX = '';
  let maxPowerZ = '';
  let equalePowerX = parameterTempList[2]?.defaultValue ?? '';

  if (endpointJSQStyle !== '直线' && endpointJSQStyle !== '旋转') {
    return state;
  }

  getFlowParameterList().forEach(item => {
    if (item.paramnum === 'DJ1_1_SCLJ_MAX_X' && maxPowerX === '') {
      maxPowerX = item.paramvalue ?? '';
    }
    if (item.paramnum === 'DJ1_1_SCL_MAX_Z' && maxPowerZ === '') {
      maxPowerZ = item.paramvalue ?? '';
    }
    if (item.paramnum === 'DJ1_1_DXLB_X' && equalePowerX === '') {
      equalePowerX = item.paramvalue ?? '';
    }
  });

  if (!djOutputStyle) {
    return state;
  }

  const upstreamEqualArm = resolveEqualArmFromUpstreamTables(djOutputStyle, savedTables);

  if (djOutputStyle === '直线喷管' || djOutputStyle === '直线非喷管') {
    state.flag = true;
    state.djzdlj = maxPowerZ;
    if (parameterTempList[2]) {
      parameterTempList[2].defaultValue = upstreamEqualArm || equalePowerX;
    }
    if (parameterTempList[2]?.defaultValue === undefined) {
      parameterTempList[2].defaultValue = '';
    }
    if (parameterTempList[2]?.defaultValue !== '') {
      const val = (Number(maxPowerZ) * 1000) / Number(parameterTempList[2].defaultValue);
      if (parameterTempList[3]) {
        parameterTempList[3].defaultValue = val.toFixed(2);
      }
    }
    if (parameterTempList[4]) {
      parameterTempList[4].defaultValue = maxPowerZ;
    }
  } else if (djOutputStyle === '旋转拨叉类') {
    state.flag = false;
  } else if (djOutputStyle === '旋转非拨叉类') {
    state.flag = true;
    state.djzdlj = maxPowerX;
    if (parameterTempList[2]) parameterTempList[2].defaultValue = '';
    if (parameterTempList[3]) parameterTempList[3].defaultValue = '';
    if (parameterTempList[4]) parameterTempList[4].defaultValue = maxPowerX;
  }

  return state;
}

export type Page1_2TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

/** values：单行参数字段（本页无表格，全部写入 values） */
export function extractPage1_2SaveParamValues(list: Page1_2ParameterItem[]) {
  return list
    .filter(item => String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** tables：本页无数据表格，固定返回空数组 */
export function extractPage1_2TableSavePayload(_list: Page1_2ParameterItem[]): Page1_2TableSaveRow[] {
  return [];
}
