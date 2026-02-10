import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultJSONObject } from '../tags/data-contracts';

export class CommonResultJSONObjectModel extends BaseModel implements CommonResultJSONObject {
  /** @format int32 */
  code?: number = 0;
  data?: {
    empty?: boolean;
    innerMap?: Record<string, object>;
    [key: string]: any;
  };

  msg?: string = '';
}
