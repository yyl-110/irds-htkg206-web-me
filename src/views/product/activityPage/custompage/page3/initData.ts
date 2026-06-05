import type { Page3ParameterItem, Page3TableRow } from './parameterDefaults';
import { MOTOR_SELECT_TABLE_NUM } from '../page2/rowOperations';
import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';

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

/** 从流程上下文刷新表格（原 initData） */
export function applyPage3InitData(list: Page3ParameterItem[]): boolean {
  const paramList = getFlowParameterList();
  const tableList = getFlowTableList();

  let djList: Array<Record<string, string | number | undefined>> = [];
  tableList.forEach(item => {
    if (item.tablenum === MOTOR_SELECT_TABLE_NUM) {
      djList = item.rowdata ?? [];
    }
  });

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
