// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

/**
 * 管理后台新统一权限认证平台
 */
export class AdminApiSystemNewoa {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台新统一权限认证平台`;

  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name Signature
   * @request POST:/admin-api/system/newoa/signature
   * @secure
   */
  static signature = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/signature`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name Encode
   * @request POST:/admin-api/system/newoa/encode
   * @secure
   */
  static encode = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/encode`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name Decode
   * @request POST:/admin-api/system/newoa/decode
   * @secure
   */
  static decode = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/decode`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name Check
   * @request POST:/admin-api/system/newoa/check
   * @secure
   */
  static check = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/newoa/check`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name UserUpdateService
   * @request POST:/admin-api/system/newoa/UserUpdateService
   * @secure
   */
  static userUpdateService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/UserUpdateService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name UserDeleteService
   * @request POST:/admin-api/system/newoa/UserDeleteService
   * @secure
   */
  static userDeleteService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/UserDeleteService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name UserCreateService
   * @request POST:/admin-api/system/newoa/UserCreateService
   * @secure
   */
  static userCreateService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/UserCreateService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name SchemaService
   * @request POST:/admin-api/system/newoa/SchemaService
   * @secure
   */
  static schemaService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/SchemaService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryUserByIdService
   * @request POST:/admin-api/system/newoa/QueryUserByIdService
   * @secure
   */
  static queryUserByIdService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryUserByIdService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryRoleByIdService
   * @request POST:/admin-api/system/newoa/QueryRoleByIdService
   * @secure
   */
  static queryRoleByIdService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryRoleByIdService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryOrgByIdService
   * @request POST:/admin-api/system/newoa/QueryOrgByIdService
   * @secure
   */
  static queryOrgByIdService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryOrgByIdService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryAllUserIdsService
   * @request POST:/admin-api/system/newoa/QueryAllUserIdsService
   * @secure
   */
  static queryAllUserIdsService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryAllUserIdsService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryAllRoleIdsService
   * @request POST:/admin-api/system/newoa/QueryAllRoleIdsService
   * @secure
   */
  static queryAllRoleIdsService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryAllRoleIdsService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name QueryAllOrgIdsService
   * @request POST:/admin-api/system/newoa/QueryAllOrgIdsService
   * @secure
   */
  static queryAllOrgIdsService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/QueryAllOrgIdsService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name OrgUpdateService
   * @request POST:/admin-api/system/newoa/OrgUpdateService
   * @secure
   */
  static orgUpdateService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/OrgUpdateService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name OrgDeleteService
   * @request POST:/admin-api/system/newoa/OrgDeleteService
   * @secure
   */
  static orgDeleteService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/OrgDeleteService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
  /**
   * No description
   *
   * @tags 管理后台 - 新统一权限认证平台
   * @name OrgCreateService
   * @request POST:/admin-api/system/newoa/OrgCreateService
   * @secure
   */
  static orgCreateService = <Req extends string = string>(data: Req, params: RequestParams = {}) =>
    httpClient.request<string, any>(
      {
        path: `/admin-api/system/newoa/OrgCreateService`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      undefined
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemNewoa> = {
//   api: {
//     signature: {
//       path: '/admin-api/system/newoa/signature',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     encode: {
//       path: '/admin-api/system/newoa/encode',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     decode: {
//       path: '/admin-api/system/newoa/decode',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     check: {
//       path: '/admin-api/system/newoa/check',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     userUpdateService: {
//       path: '/admin-api/system/newoa/UserUpdateService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     userDeleteService: {
//       path: '/admin-api/system/newoa/UserDeleteService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     userCreateService: {
//       path: '/admin-api/system/newoa/UserCreateService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     schemaService: {
//       path: '/admin-api/system/newoa/SchemaService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryUserByIdService: {
//       path: '/admin-api/system/newoa/QueryUserByIdService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryRoleByIdService: {
//       path: '/admin-api/system/newoa/QueryRoleByIdService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryOrgByIdService: {
//       path: '/admin-api/system/newoa/QueryOrgByIdService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryAllUserIdsService: {
//       path: '/admin-api/system/newoa/QueryAllUserIdsService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryAllRoleIdsService: {
//       path: '/admin-api/system/newoa/QueryAllRoleIdsService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     queryAllOrgIdsService: {
//       path: '/admin-api/system/newoa/QueryAllOrgIdsService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     orgUpdateService: {
//       path: '/admin-api/system/newoa/OrgUpdateService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     orgDeleteService: {
//       path: '/admin-api/system/newoa/OrgDeleteService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     orgCreateService: {
//       path: '/admin-api/system/newoa/OrgCreateService',
//       method: 'POST',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//   },
// };
