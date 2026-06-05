import { PAGE8_SEL_INDEX_PARAM, PAGE8_TABLE_NUM } from '../page8/parameterDefaults';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import {
  createDefaultGearStressRow,
  gearTableNumForIndex,
  type Page9GearRow,
  type Page9ParameterItem,
  type Page9SchemeRow,
} from './parameterDefaults';
import { calculateGearTorqueChain, extractGearNumbers } from './torqueCalculations';

export interface Page9InitResult {
  ok: boolean;
  cleared?: boolean;
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

/** 从 page8 筛选方案刷新（原 initData） */
export function applyPage9InitData(list: Page9ParameterItem[]): Page9InitResult {
  const paramList = getFlowParameterList();
  const tableList = getFlowTableList();

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

  let combinList: Page9SchemeRow[] = [];
  tableList.forEach(item => {
    if (item.tablenum === PAGE8_TABLE_NUM) {
      combinList = (item.rowdata ?? []) as Page9SchemeRow[];
    }
  });

  const indexArr = selIndexs.split(',').filter(Boolean);
  const dataList = indexArr
    .map(idx => combinList[Number(idx)])
    .filter((row): row is Page9SchemeRow => !!row);

  if (!list[0]?.tableMap || dataList.length === 0) {
    return { ok: false };
  }

  const loadCoeff = String(list[1]?.defaultValue ?? '1.2');
  const pageId = String(list[0].pageId ?? '');
  const userId = String(list[0].userid ?? '');

  list[0].tableMap.rowData = dataList;
  list[0].tableMap.rowNums = dataList.length;

  trimExtraGearTables(list, 3);

  dataList.forEach((scheme, index) => {
    list.push(buildPerSchemeGearTable(scheme, index, loadCoeff, cdxl, pageId, userId));
  });

  if (list[2]?.tableMap) {
    list[2].tableMap.rowData = [];
  }

  return { ok: true };
}
