import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultMapObjectObject } from '../tags/data-contracts';

export class CommonResultMapObjectObjectModel extends BaseModel implements CommonResultMapObjectObject {
  /** @format int32 */
  code?: number = 0;
  data?: Record<string, object> = {};
  msg?: string = '';
}
