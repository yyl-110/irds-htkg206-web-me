import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import {
  isValidParamValue,
  SCALAR_PARAM_COUNT,
  type AdapterDesignRow,
  type AdapterPageConfig,
  type AdapterParameterItem,
} from './parameterDefaults';

function buildScalarParametersStr(list: AdapterParameterItem[]) {
  let parametersStr = '';
  for (let i = 0; i < SCALAR_PARAM_COUNT; i++) {
    const item = list[i];
    const paramTempVal = item?.defaultValue;
    if (!isValidParamValue(paramTempVal) || !isValidParamValue(item?.parameterNum)) {
      continue;
    }
    parametersStr += `{"Name":"${item!.parameterNum}","Type":"double","Value":"${item!.defaultValue}","Description":""},`;
  }
  return parametersStr;
}

function buildTableParametersStr(config: AdapterPageConfig, row: AdapterDesignRow) {
  const { p2, p3, p4 } = config.tableDegParams;
  return [
    `{"Name":"${p2}","Type":"double","Value":"${row.p2 ?? ''}","Description":""}`,
    `{"Name":"${p3}","Type":"double","Value":"${row.p3 ?? ''}","Description":""}`,
    `{"Name":"${p4}","Type":"double","Value":"${row.p4 ?? ''}","Description":""}`,
  ].join(',');
}

function buildFullParametersStr(config: AdapterPageConfig, list: AdapterParameterItem[], row: AdapterDesignRow) {
  let parametersStr = buildScalarParametersStr(list);
  parametersStr += buildTableParametersStr(config, row);
  return parametersStr;
}

export async function assembleAdapterModule(
  instance: unknown,
  config: AdapterPageConfig,
  list: AdapterParameterItem[],
  row: AdapterDesignRow,
) {
  const newModuleNum = String(row.p5 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const tempNum = String(row.p6 ?? '').trim();
  const tempNumS = tempNum.split('.');
  if (tempNumS.length !== 2) return { ok: false, message: '模板文件名无效' };

  const parametersStr = buildFullParametersStr(config, list, row);
  const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function regenerateAdapterModel(
  config: AdapterPageConfig,
  list: AdapterParameterItem[],
  row: AdapterDesignRow,
) {
  const newModuleNum = String(row.p5 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildFullParametersStr(config, list, row);
  const response = await parameterInFirstCsys(newModuleNum, 'asm', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}
