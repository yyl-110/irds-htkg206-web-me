// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import { DeptCreateRequestDTOModel } from '../models/DeptCreateRequestDTOModel';
import { DeptDeleteRequestDTOModel } from '../models/DeptDeleteRequestDTOModel';
import { DeptUpdateRequestDTOModel } from '../models/DeptUpdateRequestDTOModel';
import { SsoResultModel } from '../models/SsoResultModel';

/**
 * 统一身份认证部门
 */
export class AdminApiSsoDept {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `统一身份认证部门`;

  /**
   * 更新部门
   *
   * @tags 统一身份认证 - 部门
   * @name UpdateDept1
   * @summary 更新部门
   * @request POST:/admin-api/sso/dept/update
   * @secure
   */
  static updateDept1 = <Req extends DeptUpdateRequestDTOModel = DeptUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 启用部门
   *
   * @tags 统一身份认证 - 部门
   * @name OpenUser1
   * @summary 启用部门
   * @request POST:/admin-api/sso/dept/open
   * @secure
   */
  static openUser1 = <Req extends DeptDeleteRequestDTOModel = DeptDeleteRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/open`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 删除部门
   *
   * @tags 统一身份认证 - 部门
   * @name DeleteDept
   * @summary 删除部门
   * @request POST:/admin-api/sso/dept/delete
   * @secure
   */
  static deleteDept = <Req extends DeptDeleteRequestDTOModel = DeptDeleteRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/delete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 创建部门
   *
   * @tags 统一身份认证 - 部门
   * @name CreateDept1
   * @summary 创建部门
   * @request POST:/admin-api/sso/dept/create
   * @secure
   */
  static createDept1 = <Req extends DeptCreateRequestDTOModel = DeptCreateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 禁用部门
   *
   * @tags 统一身份认证 - 部门
   * @name CloseUser1
   * @summary 禁用部门
   * @request POST:/admin-api/sso/dept/close
   * @secure
   */
  static closeUser1 = <Req extends DeptDeleteRequestDTOModel = DeptDeleteRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/close`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 获取部门列表
   *
   * @tags 统一身份认证 - 部门
   * @name ListDepts1
   * @summary 获取部门列表
   * @request GET:/admin-api/sso/dept/list
   * @secure
   */
  static listDepts1 = (params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/dept/list`,
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
// export const $tag: OpenApiTag<typeof AdminApiSsoDept> = {
//   api: {
//     updateDept1: {
//       path: "/admin-api/sso/dept/update",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: DeptUpdateRequestDTOModel,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: $DeptUpdateRequestDTO,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//     openUser1: {
//       path: "/admin-api/sso/dept/open",
//       method: "POST",
//       type: undefined,
//       paramModel: DeptDeleteRequestDTOModel,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: $DeptDeleteRequestDTO,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//     deleteDept: {
//       path: "/admin-api/sso/dept/delete",
//       method: "POST",
//       type: OpenApiActions.delete,
//       paramModel: DeptDeleteRequestDTOModel,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: $DeptDeleteRequestDTO,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//     createDept1: {
//       path: "/admin-api/sso/dept/create",
//       method: "POST",
//       type: OpenApiActions.create,
//       paramModel: DeptCreateRequestDTOModel,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: $DeptCreateRequestDTO,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//     closeUser1: {
//       path: "/admin-api/sso/dept/close",
//       method: "POST",
//       type: undefined,
//       paramModel: DeptDeleteRequestDTOModel,
//       responseModel: SsoResultModel,
//       responseDataModel: undefined,
//       // paramSchema: $DeptDeleteRequestDTO,
//       // responseSchema: $SsoResult,
//       // responseDataSchema: undefined,
//     },
//     listDepts1: {
//       path: "/admin-api/sso/dept/list",
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
