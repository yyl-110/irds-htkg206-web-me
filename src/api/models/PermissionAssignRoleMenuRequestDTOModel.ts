import { BaseModel } from '@/utils/BaseModel';
import type { PermissionAssignRoleMenuRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 赋予角色菜单 Request DTO */
export class PermissionAssignRoleMenuRequestDTOModel extends BaseModel implements PermissionAssignRoleMenuRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  roleId: number = 0;
  /**
   * 菜单编号列表
   * @uniqueItems true
   * @example "1,3,5"
   */
  menuIds?: Array<number> = [];
}
