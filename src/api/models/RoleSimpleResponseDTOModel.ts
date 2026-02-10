import { BaseModel } from '@/utils/BaseModel';
import type { RoleSimpleResponseDTO } from '../tags/data-contracts';
/** 管理后台 - 角色精简信息 Response DTO */
export class RoleSimpleResponseDTOModel extends BaseModel implements RoleSimpleResponseDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 角色名称
   * @example ""
   */
  name: string = '';
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number = 0;
  /**
   * 部门类别
   * @format int32
   * @example 1
   */
  depId?: number = 0;
  /**
   * 部门类别
   * @format int32
   * @example 1
   */
  key?: object = {};
}
