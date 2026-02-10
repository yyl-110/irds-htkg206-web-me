import { BaseModel } from '@/utils/BaseModel';
import type { UserLoginDTO } from '../tags/data-contracts';

export class UserLoginDTOModel extends BaseModel implements UserLoginDTO {
  /**
   * 密码
   * @example "123456"
   */
  password: string = '';
  /**
   * 用户名
   * @example ""
   */
  username: string = '';
  /**
   * 验证码,验证码开启时，需要传递
   * @example "PfcH6mgr8tpXuMWFjvW6YVaqrswIuwmWI5dsVZSg7sGpWtDCUbHuDEXl3cFB1+VvCC/rAkSwK8Fad52FSuncVg=="
   */
  captchaVerification: string = '';
}
