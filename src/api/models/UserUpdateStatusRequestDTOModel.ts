import { BaseModel } from '@/utils/BaseModel';
import type { UserUpdateStatusRequestDTO, UserUDeactivateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户更新状态 Request DTO */
export class UserUpdateStatusRequestDTOModel extends BaseModel implements UserUpdateStatusRequestDTO {
  /**
   * 用户编号
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
/** 管理后台 - 用户更新停用状态 Request DTO */
export class UserUDeactivateRequestDTOModel extends BaseModel implements UserUDeactivateRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  userId: number = 0;
  /**
   * 停用状态
   * @format int32
   * @example 1
   */
  isDeactivate: Boolean = false;
}
