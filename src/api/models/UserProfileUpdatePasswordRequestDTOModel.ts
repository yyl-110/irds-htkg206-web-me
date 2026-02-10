import { BaseModel } from '@/utils/BaseModel';
import type { UserProfileUpdatePasswordRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户个人中心更新密码 Request DTO */
export class UserProfileUpdatePasswordRequestDTOModel extends BaseModel implements UserProfileUpdatePasswordRequestDTO {
  /**
   * 旧密码
   * @example "123456"
   */
  oldPassword: string = '';
  /**
   * 新密码
   * @example "654321"
   */
  newPassword: string = '';
}
