import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultListRoleUserPo } from '../tags/data-contracts';

import { RoleUserPoModel } from './RoleUserPoModel';

export class CommonResultListRoleUserPoModel extends BaseModel implements CommonResultListRoleUserPo {
  /** @format int32 */
  code?: number = 0;
  data?: Array<RoleUserPoModel> = [];
  msg?: string = '';
}
