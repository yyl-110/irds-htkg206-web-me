import { BaseModel } from '@/utils/BaseModel';
import type { UserForgetPasswordRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 手机号更新密码 Request DTO */
export class UserForgetPasswordRequestDTOModel extends BaseModel implements UserForgetPasswordRequestDTO {
  /**
   * 用户ID
   * @format int64
   * @example 1024
   */
  id: number = 0;
  /**
   * 密码
   * @example "123456"
   */
  password: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile: string = '';
  /**
   * 手机验证码
   * @example "123456"
   */
  code: string = '';
}
