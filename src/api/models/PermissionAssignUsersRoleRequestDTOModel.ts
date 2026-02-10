import { BaseModel } from '@/utils/BaseModel';
import type { PermissionAssignUsersRoleRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 赋予用户角色 Request DTO */
export class PermissionAssignUsersRoleRequestDTOModel extends BaseModel implements PermissionAssignUsersRoleRequestDTO {
  /**
   * 角色编号
   * @uniqueItems true
   * @example "1,3,5"
   */
  userIds: Array<number> = [];
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleIds?: Array<number> = [];
  /**
   * 部门ID
   * @uniqueItems true
   * @example "1,3,5"
   */
  deptIds?: Array<number> = [];
}
