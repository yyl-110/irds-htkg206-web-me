import { BaseModel } from '@/utils/BaseModel';
import type { RoleUpdateStatusRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 角色更新状态 Request DTO */
export class RoleUpdateStatusRequestDTOModel extends BaseModel implements RoleUpdateStatusRequestDTO {
  /**
   * 角色编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 状态，见 CommonStatusEnum 枚举
   * @format int32
   * @example 1
   */
  status: number = 0;
}
