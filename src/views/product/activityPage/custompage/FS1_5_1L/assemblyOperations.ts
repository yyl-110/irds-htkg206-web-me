import { assembleModule } from '@/libs/webSocket';
import type { SealTableRow } from './parameterDefaults';

export async function assembleSealModule(instance: unknown, row: SealTableRow) {
  const tempNum = String(row.p2 ?? '').trim();
  const tempType = String(row.p7 ?? '').trim();

  const parametersStr = [
    ['FS_C017_D1', row.p4],
    ['FS_C017_D2', row.p5],
    ['FS_C017_D2GC', row.p6],
  ]
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');

  const response = await assembleModule(instance, tempNum, tempType, '', '', '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}
