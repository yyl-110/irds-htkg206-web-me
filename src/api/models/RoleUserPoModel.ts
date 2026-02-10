import { BaseModel } from '@/utils/BaseModel';
import type { RoleUserPo } from '../tags/data-contracts';

export class RoleUserPoModel extends BaseModel implements RoleUserPo {
  /** @format int64 */
  id?: number = 0;
  name?: string = '';
  code?: string = '';
  /** @format int32 */
  roleClass?: number = 0;
  /** @format int64 */
  userId?: number = 0;
  userName?: string = '';
}
