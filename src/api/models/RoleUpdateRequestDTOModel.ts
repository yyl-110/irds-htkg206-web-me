import { BaseModel } from '@/utils/BaseModel';
import type { RoleUpdateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 角色更新 Request DTO */
export class RoleUpdateRequestDTOModel extends BaseModel implements RoleUpdateRequestDTO {
  /**
   * 角色名称
   * @minLength 0
   * @maxLength 30
   * @example "管理员"
   */
  name: string = '';
  /**
   * 角色编码
   * @minLength 0
   * @maxLength 100
   * @example "ADMIN"
   */
  code: string = '';
  /**
   * 显示顺序不能为空
   * @format int32
   * @example 1024
   */
  sort?: number = 0;
  /**
   * 备注
   * @example "我是一个角色"
   */
  remark?: string = '';
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number = 0;
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: string = '';
}
