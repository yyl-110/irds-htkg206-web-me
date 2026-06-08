import { getFlowParameterList, getFlowTableList } from '../shared/flowContext';
import type { AssemblyTableRow, Page5_3ExportParamKeys, Page5_3ParameterItem, Page5_3VariantConfig } from './types';

export function isBrowseType(p1: unknown) {
  return p1 === '浏览' || p1 === '1' || p1 === 1;
}

export function syncAssemblyDataFromFlow(
  parameterTempList: Page5_3ParameterItem[],
  config: Page5_3VariantConfig,
) {
  const list = getFlowTableList();
  let chassisRows: Array<Record<string, string | number | undefined>> = [];
  let assemblyRows: Array<Record<string, string | number | undefined>> = [];

  list.forEach(item => {
    if (item.tablenum === config.chassisSourceTableNum) {
      chassisRows = item.rowdata ?? [];
    }
    if (item.tablenum === config.assemblyTableNum) {
      assemblyRows = item.rowdata ?? [];
    }
  });

  let countInput = 0;
  let c = 0;
  const dataList: AssemblyTableRow[] = [];

  chassisRows.forEach(item => {
    let filename = '';
    if (item.p1 === 2 || item.p1 === '2' || item.p1 === '输入') {
      countInput += 1;
      const p8 = String(item.p8 ?? '');
      if (p8.length > 4) {
        filename = `${p8.substring(0, p8.length - 4)}_${countInput}${p8.substring(p8.length - 4)}`;
      }
    }

    const data: AssemblyTableRow = {
      p0: item.p0,
      p1: item.p1,
      p2: item.p2,
      p15: item.p12,
      p3: item.p3,
      p4: item.p4,
      p5: item.p5,
      p6: item.p6,
      p8: config.templateModel,
      p11: item.p7,
      p12: item.p8,
      p13: item.p9,
      p14: item.p10,
    };

    if (c <= assemblyRows.length - 1) {
      data.p9 = assemblyRows[c].p9;
      data.p10 = assemblyRows[c].p10;
      data.p7 = assemblyRows[c].p7;
    }

    void filename;
    dataList.push(data);
    c += 1;
  });

  if (parameterTempList[0]?.tableMap) {
    parameterTempList[0].tableMap.rowData = dataList;
  }
}

export function buildModelParametersStr(row: AssemblyTableRow, prefix: string) {
  const fields = [
    { name: `${prefix}_U`, value: row.p4 },
    { name: `${prefix}_W`, value: row.p5 },
    { name: `${prefix}_L`, value: row.p6 },
    { name: `${prefix}_BL`, value: row.p9 },
    { name: `${prefix}_J`, value: row.p10 },
  ];
  return fields
    .map(f => `{"Name":"${f.name}","Type":"double","Value":"${f.value ?? ''}","Description":""}`)
    .join(',');
}

function readFlowParamValue(paramList: ReturnType<typeof getFlowParameterList>, key: string) {
  const item = paramList.find(p => p.paramnum === key);
  return item?.paramvalue ?? '';
}

export function buildExportReportContent(
  rows: AssemblyTableRow[],
  exportKeys: Page5_3ExportParamKeys,
  paramList = getFlowParameterList(),
) {
  const mxwjm = readFlowParamValue(paramList, exportKeys.modelFileName);
  const jggd = readFlowParamValue(paramList, exportKeys.cabinetU);
  const jgkd = readFlowParamValue(paramList, exportKeys.cabinetW);
  const jgsd = readFlowParamValue(paramList, exportKeys.cabinetL);
  const jgcxfs = readFlowParamValue(paramList, exportKeys.exitWire);
  const gtg = readFlowParamValue(paramList, exportKeys.cabinetH);
  const jgbz = readFlowParamValue(paramList, exportKeys.remark);

  let str = `电源机柜代号,${mxwjm}\r\n`;
  str += `机柜高度（U数）,${jggd}\r\n`;
  str += `机柜宽度,${jgkd}\r\n`;
  str += `机柜深度,${jgsd}\r\n`;
  str += `机柜出线方式,${jgcxfs}\r\n`;
  str += `柜体高(设计),${gtg}\r\n`;
  str += `机柜备注,${jgbz}\r\n`;

  rows.forEach(item => {
    str += `插箱名称,${item.p3 ?? ''}\r\n`;
    if (isBrowseType(item.p1)) {
      str += `插箱图号,${item.p2 ?? ''}\r\n`;
    } else {
      str += `插箱图号,${item.p7 ?? ''}\r\n`;
    }
    str += `插箱高度（U）,${item.p4 ?? ''}\r\n`;
    str += `插箱深度,${item.p5 ?? ''}\r\n`;
    str += `插箱宽度,${item.p6 ?? ''}\r\n`;
    str += `备注，${item.p14 ?? ''}\r\n`;
  });

  return str;
}

export function clearBrowseInputFields(row: AssemblyTableRow, field: 'p9' | 'p10' | 'p7') {
  if (isBrowseType(row.p1)) {
    row[field] = '';
  }
}
