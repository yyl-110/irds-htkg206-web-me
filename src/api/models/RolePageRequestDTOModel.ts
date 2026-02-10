import { BaseModel } from '@/utils/BaseModel';
import type { RolePageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 角色分页 Request DTO */
export class RolePageRequestDTOModel extends BaseModel implements RolePageRequestDTO {
  /**
   * 页码，从 1 开始
   * @format int32
   * @min 1
   * @example 1
   */
  pageNo: number = 0;
  /**
   * 每页条数，最大值为 100
   * @format int32
   * @min 1
   * @max 100
   * @example 10
   */
  pageSize: number = 0;
  /**
   * 角色名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 角色标识，模糊匹配
   * @example ""
   */
  code?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /**
   * 开始时间
   * @example "[2022-07-01 00:00:00,2022-07-01 23:59:59]"
   */
  createTime?: Array<string> = [];
  /**
   * 角色类别
   * @format int32
   * @example 1
   */
  roleClass?: number = 0;
}
