import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultSetLong } from '../tags/data-contracts';

export class CommonResultSetLongModel extends BaseModel implements CommonResultSetLong {
  /** @format int32 */
  code?: number = 0;
  /** @uniqueItems true */
  data?: Array<number> = [];
  msg?: string = '';
}
