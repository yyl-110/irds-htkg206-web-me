import { BaseModel } from '@/utils/BaseModel';
import type { RoleBaseDTO } from '../tags/data-contracts';

export class RoleBaseDTOModel extends BaseModel implements RoleBaseDTO {
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
}
