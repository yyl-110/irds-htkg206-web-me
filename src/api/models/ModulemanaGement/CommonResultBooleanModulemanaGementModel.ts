import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultBoolean } from '../../tags/data-contracts';

export class CommonResultBooleanModulemanaGementModel extends BaseModel implements CommonResultBoolean {
  /** @format int32 */
  code?: number = 0;
  data?: Array<string>;
  msg?: string = '';
}
