import type { AdminUserRespDTO } from '../tags/data-contracts';
import { BaseModel } from '@/utils/BaseModel';
export class AdminUserRespDTOModel extends BaseModel implements AdminUserRespDTO {
  /** @format int64 */
  id?: number = 0;
  username?: string = '';
  nickname?: string = '';
  /** @format int32 */
  status?: number = 0;
  /** @format int64 */
  deptId?: number = 0;
  mobile?: string = '';
  roleIds?: Array<number> = [];
}
