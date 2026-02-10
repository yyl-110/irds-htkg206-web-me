// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { UserDeleteRequestDTO } from './data-contracts';
import { ContentType, httpClient, type RequestParams } from './http-client';

import { SsoResultModel } from '../models/SsoResultModel';
import { UserCreateRequestDTOModel } from '../models/UserCreateRequestDTOModel';
import { UserDeleteRequestDTOModel } from '../models/UserDeleteRequestDTOModel';
import { UserUpdateRequestDTOModel } from '../models/UserUpdateRequestDTOModel';

/**
 * 统一身份认证用户
 */
export class AdminApiSsoUser {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `统一身份认证用户`;

  /**
   * 修改用户
   *
   * @tags 统一身份认证 - 用户
   * @name UpdateUser1
   * @summary 修改用户
   * @request POST:/admin-api/sso/user/update
   * @secure
   */
  static updateUser1 = <Req extends UserUpdateRequestDTOModel = UserUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 启用用户
   *
   * @tags 统一身份认证 - 用户
   * @name OpenUser
   * @summary 启用用户
   * @request POST:/admin-api/sso/user/open
   * @secure
   */
  static openUser = <Req extends UserDeleteRequestDTOModel = UserDeleteRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/open`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 删除用户
   *
   * @tags 统一身份认证 - 用户
   * @name DeleteUser
   * @summary 删除用户
   * @request POST:/admin-api/sso/user/delete
   * @secure
   */
  static deleteUser = <
    Req extends {
      /**
       * 编号
       * @example 1024
       */
      id: any;
    } = {
      /**
       * 编号
       * @example 1024
       */
      id: any;
    },
  >(
    query: Req,
    data: UserDeleteRequestDTO,
    params: RequestParams = {}
  ) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/delete`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 新增用户
   *
   * @tags 统一身份认证 - 用户
   * @name CreateUser1
   * @summary 新增用户
   * @request POST:/admin-api/sso/user/create
   * @secure
   */
  static createUser1 = <Req extends UserCreateRequestDTOModel = UserCreateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * 禁用用户
   *
   * @tags 统一身份认证 - 用户
   * @name CloseUser
   * @summary 禁用用户
   * @request POST:/admin-api/sso/user/close
   * @secure
   */
  static closeUser = <Req extends UserDeleteRequestDTOModel = UserDeleteRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/close`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      SsoResultModel
    );
  /**
   * @description 获取用户列表
   *
   * @tags 统一身份认证 - 用户
   * @name GetSimpleUsers1
   * @summary 获取用户列表
   * @request GET:/admin-api/sso/user/list
   * @secure
   */
  static getSimpleUsers1 = (params: RequestParams = {}) =>
    httpClient.request<SsoResultModel, any>(
      {
        path: `/admin-api/sso/user/list`,
        method: 'GET',
        secure: true,
        ...params,
      },
      SsoResultModel
    );
}
