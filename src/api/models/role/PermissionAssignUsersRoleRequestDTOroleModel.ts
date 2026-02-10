import { BaseModel } from '@/utils/BaseModel';
import type { PermissionAssignUsersRoleRequestDTOrole } from '../../tags/data-contracts';

/** 管理后台 - 赋予用户角色 Request DTO */
export class PermissionAssignUsersRoleRequestDTOroleModel extends BaseModel implements PermissionAssignUsersRoleRequestDTOrole {
  /**
   * 角色编号
   * @uniqueItems true
   * @example "1,3,5"
   */
  funcIds?: Array<number>;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleId?: string;
  /**
   * 部门ID
   * @uniqueItems true
   * @example "1,3,5"
   */
  type?: number;
}
