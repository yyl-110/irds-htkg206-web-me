import { BaseModel } from '@/utils/BaseModel';
import type { TenantPackageUpdateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 租户套餐更新 Request DTO */
export class TenantPackageUpdateRequestDTOModel extends BaseModel implements TenantPackageUpdateRequestDTO {
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string = '';
  /**
   * 状态，参见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number = 0;
  /**
   * 备注
   * @example "好"
   */
  remark?: string = '';
  /**
   * 关联的菜单编号
   * @uniqueItems true
   */
  menuIds: Array<number> = [];
  /**
   * 套餐编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
