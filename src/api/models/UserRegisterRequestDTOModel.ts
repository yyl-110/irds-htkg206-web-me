import { BaseModel } from '@/utils/BaseModel';
import type { UserRegisterRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户自注册 Request DTO */
export class UserRegisterRequestDTOModel extends BaseModel implements UserRegisterRequestDTO {
  /**
   * 用户账号
   * @minLength 2
   * @maxLength 30
   * @example ""
   */
  username?: string = '';
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname?: string = '';
  /**
   * 备注
   * @example "我是一个用户"
   */
  remark?: string = '';
  /**
   * 用户性别，参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number = 0;
  /**
   * 用户头像
   * @example "https://www.iocoder.cn/xxx.png"
   */
  avatar?: string = '';
  /**
   * 是否AD域验证
   * @example "0"
   */
  isAd?: string = '';
  /**
   * 租户ID
   * @format int64
   * @example 2
   */
  tenantId?: number = 0;
  /**
   * 密码
   * @example "123456"
   */
  password: string = '';
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example ""
   */
  email?: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string = '';
  /**
   * 手机验证码
   * @example "123456"
   */
  code?: string = '';
}
