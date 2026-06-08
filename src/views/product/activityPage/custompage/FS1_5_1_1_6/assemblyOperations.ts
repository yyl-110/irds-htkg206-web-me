import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import type { ReinforcedFrameRow } from './parameterDefaults';

function buildOuterModelParametersStr(row: ReinforcedFrameRow) {
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

function buildInnerModelParametersStr(row: ReinforcedFrameRow) {
  const pairs: Array<[string, string | number | undefined]> = [
    ['FS8_075_004_L1', row.p3],
    ['FS8_075_004_W1', row.p4],
    ['FS8_075_004_H', row.p5],
    ['FS8_075_004_W2', row.p6],
    ['FS8_075_004_D1', row.p7],
    ['FS8_075_004_D2', row.p8],
    ['FS8_075_004_R', row.p9],
  ];
  return pairs
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');
}

function splitTemplateFile(row: ReinforcedFrameRow) {
  const tempNum = String(row.p11 ?? '').trim();
  const tempNumS = tempNum.split('.');
  if (tempNumS.length !== 2) return null;
  return { name: tempNumS[0], ext: tempNumS[1] };
}

export async function assembleOuterFrameModule(instance: unknown, row: ReinforcedFrameRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const template = splitTemplateFile(row);
  if (!template) return { ok: false, message: '模板文件名无效' };

  const parametersStr = buildOuterModelParametersStr(row);
  const response = await assembleModule(instance, template.name, template.ext, '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function regenerateOuterFrameModel(row: ReinforcedFrameRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildOuterModelParametersStr(row);
  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function assembleInnerFrameModule(instance: unknown, row: ReinforcedFrameRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const template = splitTemplateFile(row);
  if (!template) return { ok: false, message: '模板文件名无效' };

  const parametersStr = buildInnerModelParametersStr(row);
  const response = await assembleModule(instance, template.name, template.ext, '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}

export async function regenerateInnerFrameModel(row: ReinforcedFrameRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = buildInnerModelParametersStr(row);
  const response = await parameterInFirstCsys(newModuleNum, 'prt', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `重生失败:${response.ReturnStatus}` };
  return { ok: true };
}
