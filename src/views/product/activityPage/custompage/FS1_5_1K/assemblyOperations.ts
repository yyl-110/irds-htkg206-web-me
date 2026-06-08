import { assembleModule } from '@/libs/webSocket';
import type { ConnectionTableRow } from './parameterDefaults';

export async function assembleConnectionModule(instance: unknown, row: ConnectionTableRow) {
  const tempNum = String(row.p2 ?? '').trim();
  const tempType = String(row.p9 ?? '').trim();

  const parametersStr = [
    ['FS_C018_QFQD', row.p4],
    ['FS_C018_LSQD', row.p5],
    ['FS_C018_MD', row.p6],
    ['FS_C018_MD1', row.p7],
    ['FS_C018_GGDZJ', row.p8],
  ]
    .map(([name, value]) => `{"Name":"${name}","Type":"double","Value":"${value ?? ''}","Description":""}`)
    .join(',');

  const response = await assembleModule(instance, tempNum, tempType, '', '', '', parametersStr);
  if (response === undefined) return { ok: false, message: '通讯异常' };
  if (response.ReturnStatus !== 0) return { ok: false, message: `装配失败:${response.ReturnStatus}` };
  return { ok: true };
}
