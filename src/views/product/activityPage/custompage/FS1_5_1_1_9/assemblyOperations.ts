import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import {
  FRAME_TEMP_MODEL,
  LINING_TEMP_MODEL,
  type FrameDesignRow,
  type LiningDesignRow,
} from './parameterDefaults';

function buildFrameAssembleParamsStr(row: FrameDesignRow) {
  const pairs: Array<[string, string | number | undefined]> = [
    ['FS8_075_005_L1', row.p3],
    ['FS8_075_005_DEG', row.p4],
    ['FS8_075_005_W2', row.p6],
    ['FS8_075_005_L2', row.p7],
    ['FS8_075_005_D1', row.p8],
    ['FS8_075_005_D2', row.p9],
  ];
  return pairs
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');
}

function buildFrameRegenParamsStr(row: FrameDesignRow) {
  const pairs: Array<[string, string | number | undefined]> = [
    ['FS8_075_003_L1', row.p3],
    ['FS8_075_003_W1', row.p4],
    ['FS8_075_003_H', row.p5],
    ['FS8_075_003_W2', row.p6],
    ['FS8_075_003_D1', row.p7],
    ['FS8_075_003_D2', row.p8],
    ['FS8_075_003_R', row.p9],
  ];
  return pairs
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');
}

function buildLiningParamsStr(row: LiningDesignRow) {
  const pairs: Array<[string, string | number | undefined]> = [
    ['FS8_075_006_L1', row.p3],
    ['FS8_075_006_DEG', row.p4],
    ['FS8_075_006_D2', row.p5],
    ['FS8_075_006_D1', row.p6],
    ['FS8_075_006_L2', row.p7],
    ['FS8_075_006_W2', row.p8],
  ];
  return pairs
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');
}

async function assembleFromTemplate(instance: unknown, tempModel: string, newModuleNum: string, parametersStr: string) {
  const tempNumS = tempModel.split('.');
  if (tempNumS.length !== 2) return { ok: false, message: '模板文件名无效' };

  const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function assembleFrameModule(instance: unknown, row: FrameDesignRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };
  return assembleFromTemplate(instance, FRAME_TEMP_MODEL, newModuleNum, buildFrameAssembleParamsStr(row));
}

export async function regenerateFrameModel(row: FrameDesignRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildFrameRegenParamsStr(row);
  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function assembleLiningModule(instance: unknown, row: LiningDesignRow) {
  const newModuleNum = String(row.p9 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };
  return assembleFromTemplate(instance, LINING_TEMP_MODEL, newModuleNum, buildLiningParamsStr(row));
}

export async function regenerateLiningModel(row: LiningDesignRow) {
  const newModuleNum = String(row.p9 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildLiningParamsStr(row);
  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}
