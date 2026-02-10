// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import {
  AuthLoginRequestDTOModel,
  AuthLoginSMSRequestDTOModel,
} from "../models/AuthLoginRequestDTOModel";
import { AuthLoginResponseDTOModel } from "../models/AuthLoginResponseDTOModel";
import { AuthMenuResponseDTOModel } from "../models/AuthMenuResponseDTOModel";
import { AuthPermissionInfoResponseDTOModel } from "../models/AuthPermissionInfoResponseDTOModel";
import { CommonResultAuthLoginResponseDTOModel } from "../models/CommonResultAuthLoginResponseDTOModel";
import { CommonResultAuthPermissionInfoResponseDTOModel } from "../models/CommonResultAuthPermissionInfoResponseDTOModel";
import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { CommonResultListAuthMenuResponseDTOModel } from "../models/CommonResultListAuthMenuResponseDTOModel";
import { CommonResultStringModel } from "../models/CommonResultStringModel";

/**
 * 管理后台认证
 */
export class AdminApiSystemAuth {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台认证`;

  /**
   * sso使用账号密码登录
   *
   * @tags 管理后台 - 认证
   * @name SsoLogin
   * @summary sso使用账号密码登录
   * @request POST:/admin-api/system/auth/ssoLogin
   * @secure
   */
  static ssoLogin = <
    Req extends AuthLoginRequestDTOModel = AuthLoginRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/admin-api/system/auth/ssoLogin`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
  /**
   * 刷新令牌
   *
   * @tags 管理后台 - 认证
   * @name RefreshToken
   * @summary 刷新令牌
   * @request POST://system/auth/refresh-toke
   * @secure
   */
  static refreshToken = <
    Req extends {
      /** 刷新令牌 */
      refreshToken: string;
    } = {
      /** 刷新令牌 */
      refreshToken: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/refresh-token`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
  /**
   * 登出系统
   *
   * @tags 管理后台 - 认证
   * @name Logout
   * @summary 登出系统
   * @request POST:/admin-api/system/auth/logout
   * @secure
   */
  static logout = (params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );

  /**
   * 使用账号密码登录
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 使用账号密码登录
   * @request POST:/admin-api/system/auth/login
   * @secure
   */
  static login1 = <
    Req extends AuthLoginRequestDTOModel = AuthLoginRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
  /**
   * 导航单点登录
   *
   * @tags 管理后台 - 认证
   * @name DaohangLogin
   * @summary 导航单点登录
   * @request POST:/admin-api/system/auth/daohangLogin
   * @secure
   */
  static daohangLogin = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/auth/daohangLogin`,
        method: "POST",
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * OAuth单点回调
   *
   * @tags 管理后台 - 认证
   * @name OauthCallback
   * @summary OAuth单点回调
   * @request GET:/admin-api/system/auth/oauthCallback
   * @secure
   */
  static oauthCallback = <
    Req extends {
      code: string;
      state: string;
    } = {
      code: string;
      state: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/auth/oauthCallback`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * OA单点登录
   *
   * @tags 管理后台 - 认证
   * @name OaLogin
   * @summary OA单点登录
   * @request GET:/admin-api/system/auth/oaLogin
   * @secure
   */
  static oaLogin = <
    Req extends {
      ticket: string;
    } = {
      ticket: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/auth/oaLogin`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * OAuth单点登录
   *
   * @tags 管理后台 - 认证
   * @name LoginNew
   * @summary OAuth单点登录
   * @request GET:/admin-api/system/auth/loginNew
   * @secure
   */
  static loginNew = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/auth/loginNew`,
        method: "GET",
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 获得登录用户的菜单列表
   *
   * @tags 管理后台 - 认证
   * @name GetMenus
   * @summary 获得登录用户的菜单列表
   * @request GET:/admin-api/system/auth/list-menus
   * @secure
   */
  static getMenus = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListAuthMenuResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/list-menus`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListAuthMenuResponseDTOModel
    );
  /**
   * 是否需要验证码
   *
   * @tags 管理后台 - 认证
   * @name IsCode
   * @summary 是否需要验证码
   * @request GET:/system/auth/isCode
   * @secure
   */
  static isCode = <
    Req extends {
      userName: string;
    } = {
      userName: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/isCode`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获取加密密码
   *
   * @tags 管理后台 - 认证
   * @name GetEncryptPassword
   * @summary 获取加密密码
   * @request GET:/admin-api/system/auth/getEncryptPassword
   * @secure
   */
  static getEncryptPassword = <
    Req extends {
      password: string;
    } = {
      password: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultStringModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/getEncryptPassword`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultStringModel
    );
  /**
   * 获取登录用户的权限信息
   *
   * @tags 管理后台 - 认证
   * @name GetPermissionInfo
   * @summary 获取登录用户的权限信息
   * @request GET:/admin-api/system/auth/get-permission-info
   * @secure
   */
  static getPermissionInfo = (params: RequestParams = {}) =>
    httpClient.request<CommonResultAuthPermissionInfoResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/get-permission-info`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultAuthPermissionInfoResponseDTOModel
    );

  /**
   * 发送短信验证码
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送短信验证码
   * @request POST:/system/auth/send-phone-code
   * @secure
   */
  static sendingMessage = <
    Req extends AuthLoginSMSRequestDTOModel = AuthLoginSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/send-phone-code`,
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
   * 短信验证
   *
   * @tags 管理后台 - 认证
   * @name Login1
   * @summary 发送短信验证码
   * @request POST:/system/auth/send-phone-code
   * @secure
   */
  static checkMessageCode = <
    Req extends AuthLoginSMSRequestDTOModel = AuthLoginSMSRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/auth/check-phone-code`,
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
   * 单点登录
   *
   * @tags 管理后台 - 认证
   * @name checkJumpParams
   * @summary 单点登录
   * @request GET:/integration-api/integration/externalepc/checkJumpParams
   * @secure
   */
  static epcLogin = <
    Req extends {
      jumpParams: string;
    } = {
      jumpParams: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultAuthLoginResponseDTOModel, any>(
      {
        path: `/integration-api/integration/externalepc/checkJumpParams`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultAuthLoginResponseDTOModel
    );
}
