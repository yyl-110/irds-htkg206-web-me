import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultLong } from '../../tags/data-contracts';

export class CommonResultMenuResponseDTOModulemanaGementModel extends BaseModel implements CommonResultLong {
  /** @format int32 */
  code?: number = 0;
  /** @format int64 */
  data?: number = 0;
  msg?: string = '';
}
