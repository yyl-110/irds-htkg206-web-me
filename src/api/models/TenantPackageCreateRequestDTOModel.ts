import { BaseModel } from '@/utils/BaseModel';
import type { TenantPackageCreateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 租户套餐创建 Request DTO */
export class TenantPackageCreateRequestDTOModel extends BaseModel implements TenantPackageCreateRequestDTO {
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
}
