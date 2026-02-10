import { BaseModel } from '@/utils/BaseModel';
import type { RoleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 角色信息 Response DTO */
export class RoleResponseDTOModel extends BaseModel implements RoleResponseDTO {
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
   * @example 1
   */
  id: number = 0;
  /**
   * 数据范围，参见 DataScopeEnum 枚举类
   * @format int32
   * @example 1
   */
  dataScope: number = 0;
  /**
   * 数据范围(指定部门数组)
   * @uniqueItems true
   * @example 1
   */
  dataScopeDeptIds?: Array<number> = [];
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 角色类型，参见 RoleTypeEnum 枚举类
   * @format int32
   * @example 1
   */
  type: number = 0;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
}
