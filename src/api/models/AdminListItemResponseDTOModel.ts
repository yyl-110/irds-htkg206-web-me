import { BaseModel } from '@/utils/BaseModel';
import type { AdminListItemResponseDTO } from '../tags/data-contracts';

import { DeptModel } from './DeptModel';

/** 管理后台 - 用户分页时的信息 Response DTO，相比用户基本信息来说，会多部门信息 */
export class AdminListItemResponseDTOModel extends BaseModel implements AdminListItemResponseDTO {
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
  username?: string = '';
  password?: string = '';
  nickname?: string = '';
  nicknamePinyin?: string = '';
  remark?: string = '';
  deptId?: string = '';
  deptCode?: string = '';
  dept2Code?: string = '';
  email?: string = '';
  mobile?: string = '';
  /** @format int32 */
  sex?: number = 0;
  avatar?: string = '';
  /** @format int32 */
  status?: number = 0;
  loginIp?: string = '';
  /** @format date-time */
  loginDate?: string = '';
  isAd?: string = '';
  workCard?: string = '';
  roleIds?: Array<string> = [];
  /** 部门 */
  dept?: DeptModel = new DeptModel();
  depts?: Array<DeptModel> = [];
  /** @format int64 */
  roleId?: number = 0;
  py?: string = '';
}
