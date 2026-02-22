// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from "./http-client";

import { CommonResultPageResultLoginLogResponseDTOModel } from "../models/CommonResultPageResultLoginLogResponseDTOModel";
import { LoginLogPageRequestDTOModel } from "../models/LoginLogPageRequestDTOModel";
import { LoginLogResponseDTOModel } from "../models/LoginLogResponseDTOModel";

/**
 * 管理后台登录日志
 */
export class AdminApiSystemLoginLog {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台登录日志`;

  /**
   * 获得登录日志分页列表
   *
   * @tags 管理后台 - 登录日志
   * @name GetLoginLogPage
   * @summary 获得登录日志分页列表
   * @request GET:/system/login-log/page
   * @secure
   */
  static getLoginLogPage = <
    Req extends LoginLogPageRequestDTOModel = LoginLogPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultLoginLogResponseDTOModel, any>(
      {
        path: `/system-service/system/login-log/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultLoginLogResponseDTOModel
    );
}
