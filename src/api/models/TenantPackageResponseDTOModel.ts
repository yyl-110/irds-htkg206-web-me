import { BaseModel } from '@/utils/BaseModel';
import type { TenantPackageResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 租户套餐 Response DTO */
export class TenantPackageResponseDTOModel extends BaseModel implements TenantPackageResponseDTO {
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
  /**
   * 创建时间
   * @format date-time
   */
  createTime: string = '';
}
