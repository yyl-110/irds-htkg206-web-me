import { assembleModule } from '@/libs/webSocket';
import { TEMP_MODEL_FILE, type ConnectionTableRow } from './parameterDefaults';

export async function assembleConnectionModule(instance: unknown, row: ConnectionTableRow) {
  const newModuleNum = String(row.p10 ?? '').trim();
  if (!newModuleNum) return { ok: false, message: '请先输入模型号' };

  const parametersStr = [
    ['FS8_075_005_L1', row.p3],
    ['FS8_075_005_DEG', row.p4],
    ['FS8_075_005_W2', row.p6],
    ['FS8_075_005_L2', row.p7],
    ['FS8_075_005_D1', row.p8],
    ['FS8_075_005_D2', row.p9],
  ]
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');

  const tempNumS = TEMP_MODEL_FILE.split('.');
  if (tempNumS.length !== 2) return { ok: false, message: '模板文件名无效' };

  const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}
