// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CaptchaVOModel } from "../models/CaptchaVOModel";
import { ResponseModelModel } from "../models/ResponseModelModel";

/**
 * 管理后台验证码
 */
export class AdminApiSystemCaptcha {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台验证码`;

  /**
   * 获得验证码
   *
   * @tags 管理后台 - 验证码
   * @name Get
   * @summary 获得验证码
   * @request GET:/system/captcha/getCaptcha
   * @secure
   */
  static get = <Req extends CaptchaVOModel = CaptchaVOModel>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<ResponseModelModel, any>(
      {
        path: `/cirpoint-auth-api/system/captcha/getCaptcha`,
        method: "GET",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      ResponseModelModel
    );
  /**
   * 校验验证码
   *
   * @tags 管理后台 - 验证码
   * @name Check1
   * @summary 校验验证码
   * @request POST:/system/captcha/check
   * @secure
   */
  static check1 = <Req extends CaptchaVOModel = CaptchaVOModel>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<ResponseModelModel, any>(
      {
        path: `/cirpoint-auth-api/system/captcha/check`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      ResponseModelModel
    );
}
