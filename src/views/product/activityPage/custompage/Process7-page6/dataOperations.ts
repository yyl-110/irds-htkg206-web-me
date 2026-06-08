import { getFlowTableList } from '../shared/flowContext';
import type {
  DeletableProcessColumn,
  Page6ParameterItem,
  ProcessListItem,
  SupplyTableRow,
} from './models';
import { PAGE6_BASE_COL_STR, PAGE6_VARIANT } from './models';

export function syncSupplyTableFromFlow(parameterTempList: Page6ParameterItem[]) {
  const dyzlList: SupplyTableRow[] = [];
  const jlList: SupplyTableRow[] = [];
  const dataList: SupplyTableRow[] = [];

  getFlowTableList().forEach(item => {
    if (item.tablenum === 'DY1-1-3_1_T_SRCS') {
      dyzlList.push(...((item.rowdata ?? []) as SupplyTableRow[]));
    }
    if (item.tablenum === 'DY1-1-2_1_T_SRCS') {
      jlList.push(...((item.rowdata ?? []) as SupplyTableRow[]));
    }
  });

  dyzlList.forEach(item => {
    dataList.push({
      p0: '低压直流',
      p1: item.p0,
      p2: item.p1,
      p3: item.p2,
      p4: item.p4,
      p5: item.p3,
      p6: item.p5,
      p7: item.p6,
    });
  });

  jlList.forEach(item => {
    dataList.forEach(item2 => {
      if (item.p0 == item2.p0 && item.p1 == item2.p1) {
        item2.p8 = item.p3;
        item2.p9 = item.p4;
      }
    });
  });

  jlList.forEach(item => {
    if (item.p0 == '交流') {
      dataList.push({
        p0: '交流',
        p1: item.p1,
        p2: '—— ——',
        p3: '—— ——',
        p4: item.p2,
        p5: item.p5,
        p6: item.p6,
        p7: item.p7,
        p8: '—— ——',
        p9: '—— ——',
      });
    }
  });

  const table = parameterTempList[0]?.tableMap;
  if (table) {
    table.rowData = dataList;
  }
  parameterTempList[1].defaultValue = '';
}

function createEmptyProcessItem(
  transitNum: number,
  leg: number,
  parameterTempList?: Page6ParameterItem[],
): ProcessListItem {
  const paramValue = parameterTempList?.[transitNum + 1]?.defaultValue ?? '';
  const item: ProcessListItem = {
    id: transitNum,
    name: 'rxLabel',
    labelName: `流程${transitNum}`,
    typeKey: `param${transitNum + 2}`,
    key: `p${leg + 1}`,
    modeTypeVal0: '',
    modeTypeVal1: '',
    modeTypeVal2: '',
    modeTypeVal3: '',
    modeTypeVal4: '',
    modeTypeVal5: '',
    modeTypeVal6: '',
    modeTypeVal7: '',
    modeTypeVal8: '',
    modeTypeVal9: '',
  };

  if (parameterTempList) {
    for (let i = 0; i < 10; i++) {
      (item as Record<string, string>)[`newModeTypeVal${i}`] = String(paramValue);
    }
  }

  return item;
}

export function appendProcessColumns(
  parameterTempList: Page6ParameterItem[],
  processList: ProcessListItem[],
  deletableList: DeletableProcessColumn[],
  transitNum: number,
  columnsNum: number,
  silent = false,
) {
  const table = parameterTempList[0]?.tableMap;
  if (!table) return { transitNum, columnsNum };

  const leg = Number(table.colStr?.length ?? PAGE6_VARIANT.resetColNums) - 1;
  const deviceKey = `p${leg + 1}`;
  const timeKey = `p${leg + 2}`;

  deletableList.push({
    id: silent ? '5' : columnsNum,
    title: `流程${transitNum}用电设备`,
    key: deviceKey,
  });

  processList.push(createEmptyProcessItem(transitNum, leg, silent ? parameterTempList : undefined));

  table.colNums = Number(table.colNums ?? PAGE6_VARIANT.resetColNums) + 2;
  table.colStr = [...(table.colStr ?? []), deviceKey, timeKey];
  table.rowData.forEach(row => {
    row[deviceKey] = '';
    row[timeKey] = '';
  });

  return {
    transitNum: transitNum + 1,
    columnsNum: silent ? columnsNum : columnsNum + 1,
  };
}

export function resetProcessTable(parameterTempList: Page6ParameterItem[]) {
  const table = parameterTempList[0]?.tableMap;
  if (!table) return;

  const newColNums = Number(table.colNums ?? PAGE6_VARIANT.resetColNums);
  table.colData?.splice(8);
  table.colNums = PAGE6_VARIANT.resetColNums;
  table.colStr = [...PAGE6_BASE_COL_STR];
  table.rowData.forEach(row => {
    for (let i = PAGE6_VARIANT.baseColCount; i < newColNums; i++) {
      delete row[`p${i}`];
    }
  });
  parameterTempList[1].defaultValue = '';
}

export function restoreProcessColumnsFromTable(
  parameterTempList: Page6ParameterItem[],
  processList: ProcessListItem[],
  deletableList: DeletableProcessColumn[],
) {
  processList.splice(0, processList.length);
  deletableList.splice(0, deletableList.length);

  let transitNum = 1;
  let columnsNum = 9;
  const addcolNum = Number(parameterTempList[0]?.tableMap?.colNums ?? PAGE6_VARIANT.resetColNums) - 6;
  for (let i = 0; i < addcolNum; i++) {
    const result = appendProcessColumns(
      parameterTempList,
      processList,
      deletableList,
      transitNum,
      columnsNum,
      true,
    );
    transitNum = result.transitNum;
    columnsNum = result.columnsNum;
    i++;
  }
  return { transitNum, columnsNum };
}

export function removeProcessColumns(
  parameterTempList: Page6ParameterItem[],
  processList: ProcessListItem[],
  deletableList: DeletableProcessColumn[],
  deleteIds: Array<string | number>,
) {
  deleteIds.forEach(delId => {
    const delItem = deletableList.find(item => item.id === delId);
    if (!delItem) return;

    const deviceKey = delItem.key;
    const timeKey = `p${Number(deviceKey.slice(1)) + 1}`;

    deletableList.splice(
      deletableList.findIndex(item => item.id === delId),
      1,
    );
    processList.splice(
      processList.findIndex(item => item.key === deviceKey),
      1,
    );

    const table = parameterTempList[0]?.tableMap;
    if (table) {
      table.colStr = (table.colStr ?? []).filter(key => key !== deviceKey && key !== timeKey);
      table.colNums = Math.max(PAGE6_VARIANT.resetColNums, Number(table.colNums ?? PAGE6_VARIANT.resetColNums) - 2);
      table.rowData.forEach(row => {
        delete row[deviceKey];
        delete row[timeKey];
      });
    }
  });
}
