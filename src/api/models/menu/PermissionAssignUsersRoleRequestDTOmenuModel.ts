import { BaseModel } from '@/utils/BaseModel';
import type { CollectPageRequestDTO } from '../../tags/data-contracts';

/** 管理后台 - 赋予用户角色 Request DTO */
export class PermissionAssignUsersRoleRequestDTOmenuModel extends BaseModel implements CollectPageRequestDTO {
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
   * 条件,示例值(订货号缺失)，模糊匹配
   * @example ""
   */
  condition?: string = '';
  type?: number;
  /**
   * 菜单名称，模糊匹配
   * @example ""
   */
  name?: string = '';
  /**
   * 展示状态，参见 CommonStatusEnum 枚举类
   * @format int32
   * @example 1
   */
  status?: number;
}
