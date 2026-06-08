import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import { TEMP_MODEL_FILE, type OuterSkinDesignRow } from './parameterDefaults';

function buildModelParametersStr(row: OuterSkinDesignRow) {
  const pairs: Array<[string, string | number | undefined]> = [
    ['FS1_5_1_1B_ZXMD', row.p3],
    ['FS1_5_1_1B_HXMD', row.p5],
    ['FS1_5_1_1B_ZXT', row.p6],
    ['FS1_5_1_1B_HXT', row.p7],
    ['FS8_075_001_L1', row.p8],
    ['FS8_075_001_T', row.p9],
    ['FS8_075_001_L2', row.p10],
    ['FS8_075_001_D1', row.p11],
    ['FS1_5_1_1B_DXMD', row.p12],
  ];
  return pairs
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');
}

export async function assembleOuterSkinModule(instance: unknown, row: OuterSkinDesignRow) {
  const newModuleNum = String(row.p13 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const tempNumS = TEMP_MODEL_FILE.split('.');
  if (tempNumS.length !== 2) return { ok: false, message: '模板文件名无效' };

  const parametersStr = buildModelParametersStr(row);
  const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function regenerateOuterSkinModel(row: OuterSkinDesignRow) {
  const newModuleNum = String(row.p13 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildModelParametersStr(row);
  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}
