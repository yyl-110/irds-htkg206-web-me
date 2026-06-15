import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import type { GearRatioEntry } from './gearRatio';
import { lookupGearFactors } from './gearRatio';
import {
  gearTableNumForIndex,
  type Page9GearRow,
  type Page9ParameterItem,
  type Page9SchemeRow,
} from './parameterDefaults';
import {
  captureGearEditableValues,
  restoreGearEditableValues,
  supplementGearRowsFromDisplay,
} from './initData';
import { calculateGearTorqueChain, extractGearNumbers } from './torqueCalculations';

function applyLevel2DisabledRows(rows: Page9GearRow[]) {
  if (rows.length < 6) return;
  const row4 = rows[4];
  const row5 = rows[5];
  row4.p1 = '--';
  row5.p1 = '--';
  row4.cellInputOrOutput2 = '1';
  row5.cellInputOrOutput2 = '1';
  row4.p3 = '--';
  row5.p3 = '--';
  row4.cellInputOrOutput4 = '1';
  row5.cellInputOrOutput4 = '1';
  row4.cellInputOrOutput5 = '1';
  row5.cellInputOrOutput5 = '1';
  row4.cellInputOrOutput6 = '1';
  row5.cellInputOrOutput6 = '1';
  row4.p7 = '--';
  row5.p7 = '--';
  row4.p8 = '--';
  row5.p8 = '--';
  row4.p9 = '--';
  row5.p9 = '--';
}

/** 单选方案后加载对应齿轮应力表（原 selectModelListCheck） */
export function applyPage9SchemeSelection(
  list: Page9ParameterItem[],
  selected: Page9SchemeRow[],
  gearRatioTable: GearRatioEntry[],
): Page9GearRow[] {
  if (!selected.length) return [];
  if (selected.length > 1) {
    return [];
  }

  const schemeRows = (list[0]?.tableMap?.rowData ?? []) as Page9SchemeRow[];
  let selIndex = -1;
  schemeRows.forEach((item, index) => {
    if (item.p0 === selected[0].p0) selIndex = index;
  });
  if (selIndex < 0) return [];

  let gearRows: Page9GearRow[] = [];
  list.forEach(item => {
    if (item.tableNum === gearTableNumForIndex(selIndex) && item.tableMap?.rowData) {
      gearRows = (item.tableMap.rowData as Page9GearRow[]).map(row => ({ ...row }));
    }
  });
  if (!gearRows.length) return [];

  supplementGearRowsFromDisplay(list, gearRows);
  const editableSnapshot = captureGearEditableValues(gearRows);

  const selection = selected[0];
  const gearNums = extractGearNumbers(selection);
  for (let i = 0; i < 6; i++) {
    if (gearRows[i]) {
      gearRows[i].p3 = gearNums[i] ?? '';
    }
  }

  const motorCode = String(selection.p12 ?? '');
  const tableList = getFlowTableList();
  let motorModule = '';
  let motorWidth = '';
  tableList.forEach(item => {
    if (item.tablenum === MOTOR_SELECT_TABLE_NUM) {
      (item.rowdata ?? []).forEach(row => {
        if (row.p2 === motorCode) {
          motorModule = String(row.p16 ?? '');
          motorWidth = String(row.p17 ?? '');
        }
      });
    }
  });

  if (gearRows[0]) gearRows[0].p2 = motorModule;
  if (gearRows[1]) gearRows[1].p2 = motorModule;
  if (gearRows[0]) gearRows[0].p4 = motorWidth;
  if (gearRows[1]) gearRows[1].p4 = motorWidth;

  let cdxl = '';
  getFlowParameterList().forEach(item => {
    if (cdxl === '' && item.paramnum === 'DJ2_0_CDXL') {
      cdxl = String(item.paramvalue ?? '');
    }
  });

  const torques = calculateGearTorqueChain(selection, cdxl, 3);
  const torqueList = [torques.dj, torques.level1, torques.level2Drive, torques.level2Driven, torques.level3Drive, torques.level3Driven];
  torqueList.forEach((val, idx) => {
    if (gearRows[idx]?.p3 !== '' && gearRows[idx]?.p3 !== '--') {
      gearRows[idx].p1 = String(val ?? '');
    }
  });

  if (gearRows[0]) {
    for (let i = 0; i < 10; i++) {
      gearRows[0][`cellInputOrOutput${i}`] = '0';
    }
  }

  if (Number(selection.p11) === 2) {
    applyLevel2DisabledRows(gearRows);
  }

  gearRows.forEach((row, index) => {
    const factors = lookupGearFactors(String(row.p3 ?? ''), gearRatioTable);
    if (factors.YF) row.p5 = factors.YF;
    if (factors.YS) row.p6 = factors.YS;
    void index;
  });

  restoreGearEditableValues(gearRows, editableSnapshot, { preserveOnlySavedOrManual: true });

  return gearRows;
}

export function syncCalculatedGearRowsToSource(
  list: Page9ParameterItem[],
  selectedSchemeKey: string,
  rows: Page9GearRow[],
) {
  const schemeRows = (list[0]?.tableMap?.rowData ?? []) as Page9SchemeRow[];
  let selIndex = -1;
  schemeRows.forEach((item, index) => {
    if (item.p0 === selectedSchemeKey) selIndex = index;
  });
  if (selIndex < 0) return;

  const target = list.find(item => item.tableNum === gearTableNumForIndex(selIndex));
  if (target?.tableMap) {
    target.tableMap.rowData = rows.map(row => ({ ...row }));
  }
}
