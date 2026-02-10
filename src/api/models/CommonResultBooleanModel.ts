import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultBoolean } from '../tags/data-contracts';

export class CommonResultBooleanModel extends BaseModel implements CommonResultBoolean {
  /** @format int32 */
  code?: number = 0;
  data?: Array<string>;
  msg?: string = '';
}
