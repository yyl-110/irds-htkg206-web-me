import { BaseModel } from '@/utils/BaseModel';
import type { UserProfileUpdateRequestDTO } from '../tags/data-contracts';

/** 管理后台 - 用户个人信息更新 Request DTO */
export class UserProfileUpdateRequestDTOModel extends BaseModel implements UserProfileUpdateRequestDTO {
  /**
   * 用户昵称
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  nickname: string = '';
  /**
   * 用户邮箱
   * @minLength 0
   * @maxLength 50
   * @example "wc@iocoder.cn"
   */
  email?: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string = '';
  /**
   * 用户性别,参见 SexEnum 枚举类
   * @format int32
   * @example 1
   */
  sex?: number = 0;
}

/** 管理后台 - 用户手机码号、邮箱修改 Request DTO */
export class UserPhoneOrEmailUpdateRequestDTOModel extends BaseModel {
  /**
   * "1:修改手机号 2：修改邮箱  3：修改子手机号  4：修改发动机编号",
   * @minLength 0
   * @maxLength 30
   * @example ""
   */
  type?: string = '';

  /**
   * 修改手机号和发动机编号：1:insert 2：delete
   * @minLength 0
   * @maxLength 50
   * @example "wc@iocoder.cn"
   */
  operationType?: string = '';
  /**
   * 手机号码
   * @example "15601691300"
   */
  mobile?: string = '';

  /**
   * 邮箱
   * @example "15601691300"
   */
  email?: string = '';

  /**
   * 子手机号码
   * @format int32
   * @example 1
   */
  mobiles?: Array<string> = [];

  /**
   * 发动机号
   * @example "15601691300"
   */
  bindVinSerial?: string = '';
}

/** 管理后台 - 用户手机码号 Request DTO */
// export class UserPhoneUpdateRequestDTOModel extends BaseModel {

//   /**
//    * "1:修改手机号 2：修改邮箱  3：修改子手机号  4：修改发动机编号",
//    * @minLength 0
//    * @maxLength 30
//    * @example ""
//    */
//   type: string = '';

//   /**
//    * 修改手机号和发动机编号：1:insert 2：delete
//    * @minLength 0
//    * @maxLength 50
//    * @example "wc@iocoder.cn"
//    */
//   operationType?: string = '';
//   /**
//    * 手机号码
//    * @example "15601691300"
//    */
//   mobile?: string = '';
// }

// /** 管理后台 - 用户邮箱 Request DTO */
// export class UserEmailUpdateRequestDTOModel extends BaseModel {

//   /**
//    * "1:修改手机号 2：修改邮箱  3：修改子手机号  4：修改发动机编号",
//    * @minLength 0
//    * @maxLength 30
//    * @example ""
//    */
//   type: string = '';

//   /**
//    * 修改手机号和发动机编号：1:insert 2：delete
//    * @minLength 0
//    * @maxLength 50
//    * @example "wc@iocoder.cn"
//    */
//   operationType?: string = '';

//   /**
//   * 邮箱
//   * @example "15601691300"
//   */
//   email?: string = '';

//   /**
//    * 子手机号码
//    * @format int32
//    * @example 1
//    */
//   mobiles?: Array<string> = [];

// }
