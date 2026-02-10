import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultString } from '../tags/data-contracts';

export class CommonResultStringModel extends BaseModel implements CommonResultString {
  /** @format int32 */
  code?: number = 0;
  data?: string = '';
  msg?: string = '';
}
