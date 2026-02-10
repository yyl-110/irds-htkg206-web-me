import { BaseModel } from '@/utils/BaseModel';
import type { AuthLoginRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 账号密码登录 Request DTO,如果登录并绑定社交用户，需要传递 social 开头的参数 */
export class AuthLoginRequestDTOModel extends BaseModel implements AuthLoginRequestDTO {
  /**
   * 账号
   * @example "admin"
   */
  username: string = '';
  /**
   * 密码
   * @example "admin123"
   */
  password: string = '';
  /**
   * 验证码,验证码开启时，需要传递
   * @example "PfcH6mgr8tpXuMWFjvW6YVaqrswIuwmWI5dsVZSg7sGpWtDCUbHuDEXl3cFB1+VvCC/rAkSwK8Fad52FSuncVg=="
   */
  captchaVerification: string = '';
  /**
   * AD域
   * @format int32
   * @example 0
   */
  isAd: number = 0;

  isAppUser?: boolean = false;
}

/** 管理后台 短信发送 */
export class AuthLoginSMSRequestDTOModel extends BaseModel {
  /**
   * 用户名称
   * @example "admin"
   */
  userName: string = '';
  /**
   * 手机号
   * @example "admin123"
   */
  mobile: string = '';

  /**
   * 验证码
   * @example "55996"
   */
  code?: string = '';
}

/** 管理后台 短信发送 */
export class AuthSMSRequestDTOModel extends BaseModel {
  /**
   * 手机号
   * @example "admin123"
   */
  mobile?: string = '';

  /**
   * 邮箱地址
   * @example "admin123"
   */
  email?: string = '';

  /**
   * 验证码
   * @example "55996"
   */
  code?: string = '';
}
