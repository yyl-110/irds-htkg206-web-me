// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { AuthLoginResponseDTOModel } from '../models/AuthLoginResponseDTOModel';
import { CommonResultAuthLoginResponseDTOModel } from '../models/CommonResultAuthLoginResponseDTOModel';
import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultLongModel } from '../models/CommonResultLongModel';
import { CommonResultStringModel } from '../models/CommonResultStringModel';
import { EmailCreateDTOModel } from '../models/EmailCreateDTOModel';
import { SmsCreateDTOModel } from '../models/SmsCreateDTOModel';
import { UpdateEmailRequestDTOModel } from '../models/UpdateEmailRequestDTOModel';
import { UpdateMobileRequestDTOModel } from '../models/UpdateMobileRequestDTOModel';
import { UserForgetPasswordRequestDTOModel } from '../models/UserForgetPasswordRequestDTOModel';
import { UserLoginDTOModel } from '../models/UserLoginDTOModel';
import { UserLoginMobileDTOModel } from '../models/UserLoginMobileDTOModel';
import { UserRegisterRequestDTOModel } from '../models/UserRegisterRequestDTOModel';
import { UserUpdatePasswordRequestDTOModel } from '../models/UserUpdatePasswordRequestDTOModel';

/**
 * 管理后台验证码登录模块
 */
export class AdminApiSystemCode {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台验证码登录模块`;

  /**
   * 重置开放实验课题用户密码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name UpdateUserPassword1
   * @summary 重置开放实验课题用户密码
   * @request POST:/admin-api/system/code/update-password
   * @secure
   */
  static updateUserPassword1 = <Req extends UserUpdatePasswordRequestDTOModel = UserUpdatePasswordRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/update-password`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 换绑用户手机号
   *
   * @tags 管理后台 - 验证码登录模块
   * @name UpdateUserMobile
   * @summary 换绑用户手机号
   * @request POST:/admin-api/system/code/update-mobile
   * @secure
   */
  static updateUserMobile = <Req extends UpdateMobileRequestDTOModel = UpdateMobileRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/update-mobile`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 换绑用户邮箱
   *
   * @tags 管理后台 - 验证码登录模块
   * @name UpdateUserEmail
   * @summary 换绑用户邮箱
   * @request POST:/admin-api/system/code/update-email
   * @secure
   */
  static updateUserEmail = <Req extends UpdateEmailRequestDTOModel = UpdateEmailRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/update-email`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 注册用户
   *
   * @tags 管理后台 - 验证码登录模块
   * @name RegisterUser
   * @summary 注册用户
   * @request POST:/admin-api/system/code/register
   * @secure
   */
  static registerUser = <Req extends UserRegisterRequestDTOModel = UserRegisterRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/admin-api/system/code/register`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * 用户登录
   *
   * @tags 管理后台 - 验证码登录模块
   * @name Login
   * @summary 用户登录
   * @request POST:/admin-api/system/code/login
   * @secure
   */
  static login = <Req extends UserLoginDTOModel = UserLoginDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/code/login`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
  /**
   * 通过手机号登录
   *
   * @tags 管理后台 - 验证码登录模块
   * @name LoginByMobile
   * @summary 通过手机号登录
   * @request POST:/admin-api/system/code/loginByMobile
   * @secure
   */
  static loginByMobile = <Req extends UserLoginMobileDTOModel = UserLoginMobileDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/code/loginByMobile`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
  /**
   * 获取手机号的验证码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name GetSms
   * @summary 获取手机号的验证码
   * @request POST:/admin-api/system/code/getSms
   * @secure
   */
  static getSms = <Req extends SmsCreateDTOModel = SmsCreateDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/getSms`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获取登录手机号的验证码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name GetLoginSms
   * @summary 获取登录手机号的验证码
   * @request POST:/admin-api/system/code/getLoginSms
   * @secure
   */
  static getLoginSms = <Req extends SmsCreateDTOModel = SmsCreateDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/getLoginSms`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获取邮箱的验证码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name GetEmail
   * @summary 获取邮箱的验证码
   * @request POST:/admin-api/system/code/getEmailCode
   * @secure
   */
  static getEmail = <Req extends EmailCreateDTOModel = EmailCreateDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/getEmailCode`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 忘记开放实验课题用户密码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name ForgetUserPassword
   * @summary 忘记开放实验课题用户密码
   * @request POST:/admin-api/system/code/forget-password
   * @secure
   */
  static forgetUserPassword = <Req extends UserForgetPasswordRequestDTOModel = UserForgetPasswordRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/forget-password`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 校验手机号的验证码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name CheckSms
   * @summary 校验手机号的验证码
   * @request POST:/admin-api/system/code/checkSms
   * @secure
   */
  static checkSms = <Req extends SmsCreateDTOModel = SmsCreateDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/checkSms`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 校验邮箱的验证码
   *
   * @tags 管理后台 - 验证码登录模块
   * @name CheckEmail
   * @summary 校验邮箱的验证码
   * @request POST:/admin-api/system/code/checkEmailCode
   * @secure
   */
  static checkEmail = <Req extends EmailCreateDTOModel = EmailCreateDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/checkEmailCode`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 登出
   *
   * @tags 管理后台 - 验证码登录模块
   * @name Logout1
   * @summary 登出
   * @request GET:/admin-api/system/code/logout
   * @secure
   */
  static logout1 = (params: RequestParams = {}) =>
    httpClient.request<CommonResultStringModel, any>(
      {
        path: `/admin-api/system/code/logout`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultStringModel
    );
  /**
   * 校验密码是否符合
   *
   * @tags 管理后台 - 验证码登录模块
   * @name UpdateUserStatus1
   * @summary 校验密码是否符合
   * @request GET:/admin-api/system/code/check-password
   * @secure
   */
  static updateUserStatus1 = <
    Req extends {
      password: string;
      /**
       * 过滤词
       * @example "admin,zq"
       */
      words: Array<string>;
    } = {
      password: string;
      /**
       * 过滤词
       * @example "admin,zq"
       */
      words: Array<string>;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/check-password`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 检查手机号是否已被注册
   *
   * @tags 管理后台 - 验证码登录模块
   * @name UpdateUserStatus2
   * @summary 检查手机号是否已被注册
   * @request GET:/admin-api/system/code/check-mobile-register
   * @secure
   */
  static updateUserStatus2 = <
    Req extends {
      /**
       * 手机号
       * @example 15029383746
       */
      mobile: string;
    } = {
      /**
       * 手机号
       * @example 15029383746
       */
      mobile: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/code/check-mobile-register`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemCode> = {
//   api: {
//     updateUserPassword1: {
//       path: "/admin-api/system/code/update-password",
//       method: "POST",
//       type: undefined,
//       paramModel: UserUpdatePasswordRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UserUpdatePasswordRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateUserMobile: {
//       path: "/admin-api/system/code/update-mobile",
//       method: "POST",
//       type: undefined,
//       paramModel: UpdateMobileRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UpdateMobileRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateUserEmail: {
//       path: "/admin-api/system/code/update-email",
//       method: "POST",
//       type: undefined,
//       paramModel: UpdateEmailRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UpdateEmailRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     registerUser: {
//       path: "/admin-api/system/code/register",
//       method: "POST",
//       type: undefined,
//       paramModel: UserRegisterRequestDTOModel,
//       responseModel: CommonResultLongModel,
//       responseDataModel: undefined,
//       // paramSchema: $UserRegisterRequestDTO,
//       // responseSchema: $CommonResultLong,
//       // responseDataSchema: undefined,
//     },
//     login: {
//       path: "/admin-api/system/code/login",
//       method: "POST",
//       type: undefined,
//       paramModel: UserLoginDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $UserLoginDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },
//     loginByMobile: {
//       path: "/admin-api/system/code/loginByMobile",
//       method: "POST",
//       type: undefined,
//       paramModel: UserLoginMobileDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $UserLoginMobileDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },
//     getSms: {
//       path: "/admin-api/system/code/getSms",
//       method: "POST",
//       type: undefined,
//       paramModel: SmsCreateDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $SmsCreateDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     getLoginSms: {
//       path: "/admin-api/system/code/getLoginSms",
//       method: "POST",
//       type: undefined,
//       paramModel: SmsCreateDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $SmsCreateDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     getEmail: {
//       path: "/admin-api/system/code/getEmailCode",
//       method: "POST",
//       type: undefined,
//       paramModel: EmailCreateDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $EmailCreateDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     forgetUserPassword: {
//       path: "/admin-api/system/code/forget-password",
//       method: "POST",
//       type: undefined,
//       paramModel: UserForgetPasswordRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UserForgetPasswordRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     checkSms: {
//       path: "/admin-api/system/code/checkSms",
//       method: "POST",
//       type: undefined,
//       paramModel: SmsCreateDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $SmsCreateDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     checkEmail: {
//       path: "/admin-api/system/code/checkEmailCode",
//       method: "POST",
//       type: undefined,
//       paramModel: EmailCreateDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $EmailCreateDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     logout1: {
//       path: "/admin-api/system/code/logout",
//       method: "GET",
//       type: undefined,
//       paramModel: undefined,
//       responseModel: CommonResultStringModel,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultString,
//       // responseDataSchema: undefined,
//     },
//     updateUserStatus1: {
//       path: "/admin-api/system/code/check-password",
//       method: "GET",
//       type: undefined,
//       paramModel: undefined,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateUserStatus2: {
//       path: "/admin-api/system/code/check-mobile-register",
//       method: "GET",
//       type: undefined,
//       paramModel: undefined,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//   },
// };
