// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { CommonResultUserProfileResponseDTOModel } from "../models/CommonResultUserProfileResponseDTOModel";
import { UserProfileResponseDTOModel } from "../models/UserProfileResponseDTOModel";
import { UserProfileUpdatePasswordRequestDTOModel } from "../models/UserProfileUpdatePasswordRequestDTOModel";
import {
  UserProfileUpdateRequestDTOModel,
  UserPhoneOrEmailUpdateRequestDTOModel,
} from "../models/UserProfileUpdateRequestDTOModel";
import { CommonResultAuthLoginResponseDTOModel } from "../models/CommonResultAuthLoginResponseDTOModel";
import {
  AuthLoginSMSRequestDTOModel,
  AuthSMSRequestDTOModel,
} from "../models/AuthLoginRequestDTOModel";
import { AuthLoginResponseDTOModel } from "../models/AuthLoginResponseDTOModel";
import {
  UserUpdatePassWordPassWordRequestDTOModel,
  UserUpdateRequestDTOModel,
} from "../models/UserUpdateRequestDTOModel";

/**
 * 管理后台用户个人中心
 */
export class AdminApiSystemUserProfile {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台用户个人中心`;

  /**
   * 修改用户个人信息
   *
   * @tags 管理后台 - 用户个人中心
   * @name UpdateUserProfile
   * @summary 修改用户个人信息
   * @request POST:/admin-api/system/user/profile/update
   * @secure
   */
  static updateUserProfile = <
    Req extends
      UserProfileUpdateRequestDTOModel = UserProfileUpdateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/user/profile/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );

  /**
   * 修改用户个人密码
   *
   * @tags 管理后台 - 用户个人中心
   * @name UpdateUserProfilePassword
   * @summary 修改用户个人密码
   * @request POST:/admin-api/system/user/profile/update-password
   * @secure
   */
  static updateUserProfilePassword = <
    Req extends
      UserProfileUpdatePasswordRequestDTOModel = UserProfileUpdatePasswordRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/user/profile/update-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获得登录用户信息
   *
   * @tags 管理后台 - 用户个人中心
   * @name Profile
   * @summary 获得登录用户信息
   * @request GET:/admin-api/system/user/profile/get
   * @secure
   */
  static profile = <
    Req extends {
      /** @format binary */
      id?: String;
    } = {
      /** @format binary */
      id?: String;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultUserProfileResponseDTOModel, any>(
      {
        path: `/system-service/system/epc-user/get`,
        method: "GET",
        query: data,
        secure: true,
        ...params,
      },
      CommonResultUserProfileResponseDTOModel
    );

  /**
   * 共通 发送短信验证码
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送短信验证码
   * @request POST:/system/auth/send-phone-code-utils
   * @secure
   */
  static commonSendingMessage = <
    Req extends AuthSMSRequestDTOModel = AuthSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/system-service/system/auth/send-phone-code-utils`,
        method: "POST",
        // body: data,
        query: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 共通 发送邮箱验证码
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送邮箱验证码
   * @request POST:/admin-api/system/epc-auth/send-email-code
   * @secure
   */
  static commonSendingEmail = <
    Req extends AuthSMSRequestDTOModel = AuthSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/epc-auth/send-email-code`,
        method: "POST",
        body: data,
        // query: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 共通 短信验证
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送短信验证码
   * @request POST:/system/epc-auth/send-phone-code
   * @secure
   */
  static commonCheckMessageCode = <
    Req extends AuthSMSRequestDTOModel = AuthSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/system-service/system/auth/check-phone-code-utils`,
        method: "POST",
        query: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 共同 邮箱验证
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 邮箱验证
   * @request POST:/admin-api/system/epc-auth/check-email-code
   * @secure
   */
  static commonCheckEmailCode = <
    Req extends AuthSMSRequestDTOModel = AuthSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/epc-auth/check-email-code`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 修改邮箱或手机号
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 邮箱验证
   * @request POST:/admin-api/system/epc-auth/check-email-code
   * @secure
   */
  static updatePhoneOrEmailOrEngine = <
    Req extends
      UserPhoneOrEmailUpdateRequestDTOModel = UserPhoneOrEmailUpdateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/epc-user/profile/updateUserProfile`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 忘记密码发送验证码

   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送短信验证码
   * @request POST:/system/auth/send-phone-code-utils
   * @secure
   */
  static sendingTextMessage = <
    Req extends AuthLoginSMSRequestDTOModel = AuthLoginSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/epc-auth/retrieve-password-before`,
        method: "GET",
        // body: data,
        query: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );

  /**
   * 找回密码验
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 邮箱验证
   * @request POST:/admin-api/system/epc-auth/retrieve-password-check-mobile
   * @secure
   */
  static retrievePasswordCheckMobile = <
    Req extends
      UserUpdatePassWordPassWordRequestDTOModel = UserUpdatePassWordPassWordRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/epc-auth/retrieve-password-check-mobile`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemUserProfile> = {
//   api: {
//     updateUserProfile: {
//       path: "/admin-api/system/user/profile/update",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: UserProfileUpdateRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UserProfileUpdateRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateUserProfilePassword: {
//       path: "/admin-api/system/user/profile/update-password",
//       method: "POST",
//       type: undefined,
//       paramModel: UserProfileUpdatePasswordRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $UserProfileUpdatePasswordRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     profile: {
//       path: "/admin-api/system/user/profile/get",
//       method: "GET",
//       type: OpenApiActions.get,
//       paramModel: undefined,
//       responseModel: CommonResultUserProfileResponseDTOModel,
//       responseDataModel: UserProfileResponseDTOModel,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultUserProfileResponseDTO,
//       // responseDataSchema: $UserProfileResponseDTO,
//     },

//     commonSendingEmail: {
//       path: "/admin-api/system/epc-auth/send-email-code",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     commonSendingMessage: {
//       path: "/system/auth/send-phone-code-utils",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     commonCheckMessageCode: {
//       path: "/system/auth/check-phone-code-utils",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     commonCheckEmailCode: {
//       path: "/admin-api/system/epc-auth/check-email-code",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     updatePhoneOrEmailOrEngine: {
//       path: "/admin-api/system/epc-user/profile/updateUserProfile",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     sendingTextMessage: {
//       path: "/admin-api/system/epc-auth/retrieve-password-check-mobile",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//     retrievePasswordCheckMobile: {
//       path: "/admin-api/system/epc-auth/retrieve-password-check-mobile",
//       method: "POST",
//       type: undefined,
//       paramModel: AuthSMSRequestDTOModel,
//       responseModel: CommonResultAuthLoginResponseDTOModel,
//       responseDataModel: AuthLoginResponseDTOModel,
//       // paramSchema: $AuthLoginRequestDTO,
//       // responseSchema: $CommonResultAuthLoginResponseDTO,
//       // responseDataSchema: $AuthLoginResponseDTO,
//     },

//   },
// };
