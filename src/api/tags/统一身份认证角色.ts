// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from './http-client';

import { SsoResultModel } from '../models/SsoResultModel';

/**
 * 统一身份认证角色
 */
export class AdminApiSsoRole {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `统一身份认证角色`;

  /**
   * @description 获取角色列表
   *
   * @tags 统一身份认证 - 角色
   * @name GetSsoRoleList
   * @summary 获取角色列表
   * @request GET:/admin-api/sso/role/list
   * @secure
   */
  static getSsoRoleList = (params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/role/list`,
        method: 'GET',
        secure: true,
        ...params,
      },
      SsoResultModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSsoRole> = {
//   api: {
//     getSsoRoleList: {
//       path: "/admin-api/sso/role/list",
//       method: "GET",
//       type: OpenApiActions.list,
//       paramModel: undefined,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//   },
// };
