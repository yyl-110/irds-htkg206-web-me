import { BaseModel } from '@/utils/BaseModel';
import type { TenantPageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 租户分页 Request DTO */
export class TenantPageRequestDTOModel extends BaseModel implements TenantPageRequestDTO {
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
   * 租户名
   * @example ""
   */
  name?: string = '';
  /**
   * 联系人
   * @example ""
   */
  contactName?: string = '';
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string = '';
  /**
   * 租户状态（0正常 1停用）
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /** 创建时间 */
  createTime?: Array<string> = [];
}
