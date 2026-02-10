import { BaseModel } from '@/utils/BaseModel';
import type { UserUpdatePasswordRequestDTOModel } from '../tags/data-contracts';

/** 管理后台 - 用户更新密码 Request DTO */
export class UserUpdatePasswordEpcRequestDTOModel extends BaseModel implements UserUpdatePasswordRequestDTOModel {
  /**
   * 旧密码
   * @example "123456"
   */
  oldPassword: any;
  /**
   * 新密码
   * @example "654321"
   */
  newPassword: any;

  /**
   * 用户id
   * @example "654321"
   */
  userId?: Number = 0;
}
