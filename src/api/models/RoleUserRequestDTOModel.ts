import { BaseModel } from '@/utils/BaseModel';
import type { RoleUserRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 角色用户DTO */
export class RoleUserRequestDTOModel extends BaseModel implements RoleUserRequestDTO {
  /**
   * 角色id
   * @format int64
   */
  id?: number = 0;
  /**
   * 角色名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 用户ID
   * @format int64
   * @example 1
   */
  userId?: number = 0;
  /**
   * 用户名称，模糊匹配
   * @example ""
   */
  userName?: string = '';
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  code?: string = '';
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number = 0;
}
