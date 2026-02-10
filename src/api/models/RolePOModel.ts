import { BaseModel } from '@/utils/BaseModel';
import type { RolePO } from '../tags/data-contracts';

/** 数据 */
export class RolePOModel extends BaseModel implements RolePO {
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
  id?: string = '';
  name?: string = '';
  code?: string = '';
  /** @format int32 */
  sort?: number = 0;
  /** @format int32 */
  status?: number = 0;
  /** @format int32 */
  type?: number = 0;
  remark?: string = '';
  /** @format int32 */
  dataScope?: number = 0;
  /** @uniqueItems true */
  dataScopeDeptIds?: Array<number> = [];
  /** @format int32 */
  roleClass?: number = 0;
  deptId?: number = 0;
}
