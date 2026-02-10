import { BaseModel } from '@/utils/BaseModel';
import type { UserUpdatePasswordRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户更新密码 Request DTO */
export class UserUpdatePasswordRequestDTOModel extends BaseModel implements UserUpdatePasswordRequestDTO {
  /**
   * 用户编号
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 密码
   * @example "123456"
   */
  password: string = '';
}
