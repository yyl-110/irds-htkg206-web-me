import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListLong } from '../tags/data-contracts';

export class CommonResultListLongModel extends BaseModel implements CommonResultListLong {
  /** @format int32 */
  code?: number = 0;
  data?: Array<number> = [];
  msg?: string = '';
}
