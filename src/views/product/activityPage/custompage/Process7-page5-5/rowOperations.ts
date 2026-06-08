import { message } from 'ant-design-vue';
import { POSITIVE_INT_REG } from './tableColumns';
import type { CabinetSectionConfig, OutputTableRow, Page5_5ParameterItem } from './types';

function createOutputRow(index: number): OutputTableRow {
  const row: OutputTableRow = {
    p0: `第${index + 1}路`,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
  };
  for (let i = 0; i <= 9; i += 1) {
    row[`cellParameterId${i}`] = '';
    row[`cellParentNum${i}`] = '';
    row[`cellInputOrOutput${i}`] = '1';
    row[`cellInputName${i}`] = '';
  }
  return row;
}

export function confirmOutputRows(
  parameterTempList: Page5_5ParameterItem[],
  section: CabinetSectionConfig,
) {
  const routeCount = String(parameterTempList[section.outputRouteIndex]?.defaultValue ?? '');
  const tableItem = parameterTempList[section.tableIndex];
  if (!tableItem?.tableMap) return;

  if (!POSITIVE_INT_REG.test(routeCount)) {
    message.error('路分支数量有误，请输入正确的数字');
    tableItem.tableMap.rowData = [];
    return;
  }

  const rows: OutputTableRow[] = [];
  for (let i = 0; i < Number(routeCount); i += 1) {
    rows.push(createOutputRow(i));
  }
  tableItem.tableMap.rowData = rows;
  tableItem.tableMap.rowNums = rows.length;
  tableItem.tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
}

export function setDyjgNum(parameterTempList: Page5_5ParameterItem[]) {
  const count = parameterTempList[1]?.defaultValue ?? '1';
  const flags = ['有', '无', '无', '无'];
  const num = Number(count);
  for (let i = 0; i < num && i < 4; i += 1) {
    flags[i] = '有';
  }
  parameterTempList[2].defaultValue = flags[0];
  parameterTempList[3].defaultValue = flags[1];
  parameterTempList[4].defaultValue = flags[2];
  parameterTempList[5].defaultValue = flags[3];
}

export function validateOutputRouteCount(value: string) {
  if (!value) return true;
  if (!POSITIVE_INT_REG.test(value)) {
    message.error('请输入整数');
    return false;
  }
  if (Number(value) > 15) {
    message.error('不能大于15');
    return false;
  }
  return true;
}

export function parseFileParam(value: string) {
  const hashIndex = value.indexOf('#');
  if (hashIndex < 0) {
    return { fileName: value, fileId: '' };
  }
  return {
    fileName: value.substring(0, hashIndex),
    fileId: value.slice(hashIndex + 1),
  };
}

export function buildFileParam(oldFileName: string, fileId: string) {
  return `${oldFileName}#${fileId}`;
}

export function applyUploadResult(
  parameterTempList: Page5_5ParameterItem[],
  paramIndex: number,
  oldFileName: string,
  fileId: string,
) {
  parameterTempList[paramIndex].defaultValue = buildFileParam(oldFileName, fileId);
  return parseFileParam(parameterTempList[paramIndex].defaultValue ?? '');
}

export function syncFileStatesFromParams(
  parameterTempList: Page5_5ParameterItem[],
  sections: CabinetSectionConfig[],
) {
  return sections.flatMap(section => [
    {
      key: `${section.id}-elect`,
      ...parseFileParam(String(parameterTempList[section.electFileParamIndex]?.defaultValue ?? '')),
    },
    {
      key: `${section.id}-env`,
      ...parseFileParam(String(parameterTempList[section.envFileParamIndex]?.defaultValue ?? '')),
    },
  ]);
}

export function getDownloadUrl(fileId: string, gateway: boolean, base: string) {
  const prefix = gateway ? `${base}/base-server` : base;
  return `${prefix}/fileManagerController/download.json?fileId=${fileId}`;
}
