import type { Page0ParameterItem } from '../config/page0ParameterDefaults';

export interface TddpKeyValue {
  k: string;
  v: string;
}

export function clearPage0TableData(parameterTempList: Page0ParameterItem[]) {
  for (let i = 1; i <= 4; i++) {
    const table = parameterTempList[i]?.tableMap;
    if (table) {
      table.rowData = [];
    }
  }
}

function buildKeyValueMap(tddpInputData: TddpKeyValue[], keys: string[]) {
  const result: Record<string, string> = {};
  keys.forEach(key => {
    const obj = tddpInputData.find(x => x.k === key);
    if (obj) {
      result[key] = obj.v;
    }
  });
  return result;
}

function splitKeysToRows(keys: string[], map: Record<string, string>) {
  const half = keys.length / 2;
  const row0: Record<string, string> = {};
  const row1: Record<string, string> = {};
  for (let i = 0; i < half; i++) {
    row0[`p${i}`] = map[keys[i]] ?? '';
  }
  let j = 0;
  for (let i = half; i < keys.length; i++) {
    row1[`p${j}`] = map[keys[i]] ?? '';
    j++;
  }
  return [row0, row1];
}

export function applyTddpInputToParameters(parameterTempList: Page0ParameterItem[], tddpInputData: TddpKeyValue[]) {
  const baseTable = parameterTempList[1]?.tableMap;
  const workTable = parameterTempList[2]?.tableMap;
  const commTable = parameterTempList[3]?.tableMap;
  const fuxiangTable = parameterTempList[4]?.tableMap;
  if (!baseTable || !workTable || !commTable || !fuxiangTable) return;

  const baseKeys =
    'r_outstyle, r_maxoutlj, r_standardoutlj, r_standardloadrate, r_maxnoloadrate, r_maxoutlj2, r_standardoutlj2, r_standardloadrate2, r_maxnoloadrate2, r_machlength, r_machlength2, l_outstyle, l_maxoutlj, l_standardoutlj, l_standardloadrate, l_maxnoloadrate, l_maxoutlj2, l_standardoutlj2, l_standardloadrate2, l_maxnoloadrate2, l_machlength, l_machlength2'.split(
      ', ',
    );
  const baseParam = buildKeyValueMap(tddpInputData, baseKeys);
  baseTable.rowData = [];
  const [baseRow0, baseRow1] = splitKeysToRows(baseKeys, baseParam);
  baseTable.rowData.push(baseRow0, baseRow1);

  const workKeys =
    'controller_standardworkvoltage, controller_supplyvoltagelow, controller_supplyvoltagehigh, controller_highcurrent, controller_averagecurrent, controller_maxcurrent, controller_maxoutcurrent, executemach_standardworkvoltage, executemach_supplyvoltagelow, executemach_supplyvoltagehigh, executemach_highcurrent, executemach_averagecurrent, executemach_maxcurrent, executemach_maxoutcurrent'.split(
      ', ',
    );
  const workParam = buildKeyValueMap(tddpInputData, workKeys);
  workTable.rowData = [];
  const workHalf = workKeys.length / 2;
  const workRow0: Record<string, string> = { p0: '控制器' };
  for (let i = 0; i < workHalf; i++) {
    workRow0[`p${i + 1}`] = workParam[workKeys[i]] ?? '';
  }
  const workRow1: Record<string, string> = { p0: '执行机构' };
  let j = 1;
  for (let i = workHalf; i < workKeys.length; i++) {
    workRow1[`p${j}`] = workParam[workKeys[i]] ?? '';
    j++;
  }
  workTable.rowData.push(workRow0, workRow1);

  const digitcommstyleObj = tddpInputData.find(x => x.k === 'digitcommstyle');
  const simulatecommstyleObj = tddpInputData.find(x => x.k === 'simulatecommstyle');
  commTable.rowData = [
    {
      p0: digitcommstyleObj?.v ?? '',
      p1: simulatecommstyleObj?.v ?? '',
    },
  ];

  const xpKeys =
    'noload_fupinwidth, noload_xiangpinwidth, noload_xiezhenmax, load_fupinwidth, load_xiangpinwidth, load_xiezhenmax'.split(', ');
  const xpParam = buildKeyValueMap(tddpInputData, xpKeys);
  fuxiangTable.rowData = [];
  const xpHalf = xpKeys.length / 2;
  const xpRow0: Record<string, string> = { p0: '空载' };
  for (let i = 0; i < xpHalf; i++) {
    xpRow0[`p${i + 1}`] = xpParam[xpKeys[i]] ?? '';
  }
  const xpRow1: Record<string, string> = { p0: '负载' };
  j = 1;
  for (let i = xpHalf; i < xpKeys.length; i++) {
    xpRow1[`p${j}`] = xpParam[xpKeys[i]] ?? '';
    j++;
  }
  fuxiangTable.rowData.push(xpRow0, xpRow1);
}
