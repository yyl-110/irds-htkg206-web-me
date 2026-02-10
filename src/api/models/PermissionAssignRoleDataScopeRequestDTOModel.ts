import { BaseModel } from '@/utils/BaseModel';
import type { PermissionAssignRoleDataScopeRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 赋予角色数据权限 Request DTO */
export class PermissionAssignRoleDataScopeRequestDTOModel extends BaseModel implements PermissionAssignRoleDataScopeRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1
   */
  roleId: number = 0;
  /**
   * 数据范围，参见 DataScopeEnum 枚举类
   * @format int32
   * @example 1
   */
  dataScope: number = 0;
  /**
   * 部门编号列表，只有范围类型为 DEPT_CUSTOM 时，该字段才需要
   * @uniqueItems true
   * @example "1,3,5"
   */
  dataScopeDeptIds?: Array<number> = [];
}
