import { BaseModel } from '@/utils/BaseModel';
import type { DeptPO } from '../tags/data-contracts';

export class DeptPOModel extends BaseModel implements DeptPO {
  /** @format date-time */
  createTime?: string = '';
  /** @format date-time */
  updateTime?: string = '';
  creator?: string = '';
  updater?: string = '';
  deleted?: boolean = false;
  /** @format int64 */
  tenantId?: number = 0;
  /** @format int64 */
  id?: number = 0;
  code?: string = '';
  parentCode?: string = '';
  name?: string = '';
  /** @format int64 */
  parentId?: number = 0;
  /** @format int32 */
  sort?: number = 0;
  /** @uniqueItems true */
  leaderUserId?: Array<number> = [];
  /** @uniqueItems true */
  managerLeader?: Array<number> = [];
  /** @uniqueItems true */
  chargeLeader?: Array<number> = [];
  phone?: string = '';
  email?: string = '';
  /** @format int32 */
  status?: number = 0;
  /** @format int32 */
  deptTypeCode?: number = 0;
}
