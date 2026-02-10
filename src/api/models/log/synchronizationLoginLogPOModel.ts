import { BaseModel } from '@/utils/BaseModel';

import { synchronizationLogPOModel } from './synchronizationLogPOModel';
import type { CommonResultPageResultLoginLogDTO } from '../../tags/data-contracts';

export class synchronizationLoginLogPOModel extends BaseModel implements CommonResultPageResultLoginLogDTO {
  /** @format int32 */
  data?: synchronizationLogPOModel = new synchronizationLogPOModel();
  msg?: string = '';
  code?: number = 0;
}
