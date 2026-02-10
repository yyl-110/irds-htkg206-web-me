import { BaseModel } from '@/utils/BaseModel';
import type { TenantResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 租户 Response DTO */
export class TenantResponseDTOModel extends BaseModel implements TenantResponseDTO {
  /**
   * 租户名
   * @example ""
   */
  name: string = '';
  /**
   * 联系人
   * @example ""
   */
  contactName: string = '';
  /**
   * 联系手机
   * @example "15601691300"
   */
  contactMobile?: string = '';
  /**
   * 租户状态
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 绑定域名
   * @example "https://www.iocoder.cn"
   */
  domain?: string = '';
  /**
   * 租户套餐编号
   * @format int64
   * @example 1024
   */
  packageId: number = 0;
  /**
   * 过期时间
   * @format date-time
   */
  expireTime: string = '';
  /**
   * 账号数量
   * @format int32
   * @example 1024
   */
  accountCount: number = 0;
  /**
   * 租户编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
}
