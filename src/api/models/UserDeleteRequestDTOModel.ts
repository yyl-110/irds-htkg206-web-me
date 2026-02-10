import { BaseModel } from '@/utils/BaseModel';
import type { UserDeleteRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户删除 Request DTO */
export class UserDeleteRequestDTOModel extends BaseModel implements UserDeleteRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
}
