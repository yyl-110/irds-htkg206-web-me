import { BaseModel } from '@/utils/BaseModel';
import type { PointVO } from '../tags/data-contracts';

export class PointVOModel extends BaseModel implements PointVO {
  secretKey?: string = '';
  /** @format int32 */
  x?: number = 0;
  /** @format int32 */
  y?: number = 0;
}
