import { BaseModel } from '@/utils/BaseModel';
import type { PermissionAssignUserRoleRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 赋予用户角色 Request DTO */
export class PermissionAssignUserRoleRequestDTOModel extends BaseModel implements PermissionAssignUserRoleRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  userId: number = 0;
  /**
   * 角色编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  roleIds?: Array<number> = [];
}
