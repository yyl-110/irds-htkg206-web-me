import { BaseModel } from '@/utils/BaseModel';
import type { DeptRespDTO } from '../tags/data-contracts';

export class DeptRespDTOModel extends BaseModel implements DeptRespDTO {
  /** @format int64 */
  id?: number = 0;
  code?: string = '';
  name?: string = '';
  /** @format int64 */
  parentId?: number = 0;
  /** @uniqueItems true */
  leaderUserId?: Array<number> = [];
  /** @format int32 */
  status?: number = 0;
}
