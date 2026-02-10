import { BaseModel } from '@/utils/BaseModel';
import type { TenantPackageSimpleResponseDTO } from '../tags/data-contracts';

/** 管理后台 - 租户套餐精简 Response DTO */
export class TenantPackageSimpleResponseDTOModel extends BaseModel implements TenantPackageSimpleResponseDTO {
  /**
   * 套餐编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 套餐名
   * @example "VIP"
   */
  name: string = '';
}
