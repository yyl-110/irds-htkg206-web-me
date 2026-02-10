// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { httpClient, type RequestParams } from './http-client';

/**
 * 管理后台缓存刷新接口
 */
export class AdminApiSystemCache {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台缓存刷新接口`;

  /**
   * 主动刷新角色缓存
   *
   * @tags 管理后台 - 缓存刷新接口
   * @name CacheRole
   * @summary 主动刷新角色缓存
   * @request GET:/admin-api/system/cache/cacheRole
   * @secure
   */
  static cacheRole = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/cache/cacheRole`,
        method: 'GET',
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 主动刷新角色菜单、角色用户缓存
   *
   * @tags 管理后台 - 缓存刷新接口
   * @name CacheRoleAndMenu
   * @summary 主动刷新角色菜单、角色用户缓存
   * @request GET:/admin-api/system/cache/cacheRoleAndMenu
   * @secure
   */
  static cacheRoleAndMenu = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/cache/cacheRoleAndMenu`,
        method: 'GET',
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 主动刷新菜单缓存
   *
   * @tags 管理后台 - 缓存刷新接口
   * @name CacheMenu
   * @summary 主动刷新菜单缓存
   * @request GET:/admin-api/system/cache/cacheMenu
   * @secure
   */
  static cacheMenu = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/cache/cacheMenu`,
        method: 'GET',
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 主动刷新部门缓存
   *
   * @tags 管理后台 - 缓存刷新接口
   * @name CacheDept
   * @summary 主动刷新部门缓存
   * @request GET:/admin-api/system/cache/cacheDept
   * @secure
   */
  static cacheDept = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/cache/cacheDept`,
        method: 'GET',
        secure: true,
        ...params,
      },
      undefined
    );
  /**
   * 主动刷新全部缓存
   *
   * @tags 管理后台 - 缓存刷新接口
   * @name CacheAll
   * @summary 主动刷新全部缓存
   * @request GET:/admin-api/system/cache/cacheAll
   * @secure
   */
  static cacheAll = (params: RequestParams = {}) =>
    httpClient.request<void, any>(
      {
        path: `/admin-api/system/cache/cacheAll`,
        method: 'GET',
        secure: true,
        ...params,
      },
      undefined
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemCache> = {
//   api: {
//     cacheRole: {
//       path: '/admin-api/system/cache/cacheRole',
//       method: 'GET',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     cacheRoleAndMenu: {
//       path: '/admin-api/system/cache/cacheRoleAndMenu',
//       method: 'GET',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     cacheMenu: {
//       path: '/admin-api/system/cache/cacheMenu',
//       method: 'GET',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     cacheDept: {
//       path: '/admin-api/system/cache/cacheDept',
//       method: 'GET',
//       type: undefined,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: undefined,
//       // responseDataSchema: undefined,
//     },
//     cacheAll: {
//       path: '/admin-api/system/cache/cacheAll',
//       method: 'GET',
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
