import { BaseModel } from '@/utils/BaseModel';
import type { TenantPackagePageRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 租户套餐分页 Request DTO */
export class TenantPackagePageRequestDTOModel extends BaseModel implements TenantPackagePageRequestDTO {
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
   * 套餐名
   * @example "VIP"
   */
  name?: string = '';
  /**
   * 状态
   * @format int32
   * @example 1
   */
  status?: number = 0;
  /**
   * 备注
   * @example "好"
   */
  remark?: string = '';
  /** 创建时间 */
  createTime?: Array<string> = [];
}
