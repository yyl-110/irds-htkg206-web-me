import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultJSONArray } from '../tags/data-contracts';

export class CommonResultJSONArrayModel extends BaseModel implements CommonResultJSONArray {
  /** @format int32 */
  code?: number = 0;
  data?: {
    relatedArray?: object;
    componentType?: {
      typeName?: string;
    };
    empty?: boolean;
  };
  msg?: string = '';
}
