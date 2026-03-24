// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';
import { CommonResultBooleanModel } from '../models/CommonResultBooleanModel';
import { CommonResultListRoleSimpleResponseDTOModel } from '../models/CommonResultListRoleSimpleResponseDTOModel';
import { CommonResultListRoleUserPoModel } from '../models/CommonResultListRoleUserPoModel';
import { CommonResultLongModel } from '../models/CommonResultLongModel';
import { CommonResultPageResultRolePOModel } from '../models/CommonResultPageResultRolePOModel';
import { CommonResultRoleResponseDTOModel } from '../models/CommonResultRoleResponseDTOModel';
import { RoleBaseDTOModel } from '../models/RoleBaseDTOModel';
import { RolePOModel } from '../models/RolePOModel';
import { RolePageRequestDTOModel } from '../models/RolePageRequestDTOModel';
import { RoleResponseDTOModel } from '../models/RoleResponseDTOModel';
import { RoleSimpleResponseDTOModel } from '../models/RoleSimpleResponseDTOModel';
import { RoleUpdateRequestDTOModel } from '../models/RoleUpdateRequestDTOModel';
import { RoleUpdateStatusRequestDTOModel } from '../models/RoleUpdateStatusRequestDTOModel';
import { RoleUserPoModel } from '../models/RoleUserPoModel';
import { RoleUserRequestDTOModel } from '../models/RoleUserRequestDTOModel';
/**
 * 管理后台角色
 */
export class AdminApiSystemRole {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台角色`;

  /**
   * 修改角色
   *
   * @tags 管理后台 - 角色
   * @name UpdateRole
   * @summary 修改角色
   * @request POST:/system/role/update
   * @secure
   */
  static updateRole = <Req extends RoleUpdateRequestDTOModel = RoleUpdateRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/role/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel,
    );
  /**
   * 修改角色状态
   *
   * @tags 管理后台 - 角色
   * @name UpdateRoleStatus
   * @summary 修改角色状态
   * @request POST:/admin-api/system/role/update-status
   * @secure
   */
  static updateRoleStatus = <Req extends RoleUpdateStatusRequestDTOModel = RoleUpdateStatusRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/role/update-status`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel,
    );
  /**
   * 创建角色
   *
   * @tags 管理后台 - 角色
   * @name CreateRole
   * @summary 创建角色
   * @request POST:/system/role/create
   * @secure
   */
  static createRole = <Req extends RoleBaseDTOModel = RoleBaseDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/system-service/system/role/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel,
    );
  /**
   * 获得角色分页
   *
   * @tags 管理后台 - 角色
   * @name GetRolePage
   * @summary 获得角色分页
   * @request GET:/system/role/page
   * @secure
   */
  static getRolePage = <Req extends RolePageRequestDTOModel = RolePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultRolePOModel, any>(
      {
        path: `/system-service/system/role/page`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultRolePOModel,
    );

  /**
   * 获得模型库角色分页
   *
   * @tags 管理后台 - 模型库角色
   * @name GetRolePage
   * @summary 获得模型库角色分页
   * @request GET:/system/role/moduleRolePage
   * @secure
   */
  static getModuleRolePage = <Req extends RolePageRequestDTOModel = RolePageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPageResultRolePOModel, any>(
      {
        path: `/system-service/system/role/moduleRolePage`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultRolePOModel,
    );

  /**
   * @description 只包含被开启的角色，主要用于前端的下拉选项
   *
   * @tags 管理后台 - 角色
   * @name GetSimpleRoleList
   * @summary 获取角色精简信息列表
   * @request GET:/admin-api/system/role/list-all-simple
   * @secure
   */
  static getSimpleRoleList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListRoleSimpleResponseDTOModel, any>(
      {
        path: `/system-service/system/role/list-all-simple`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListRoleSimpleResponseDTOModel,
    );
  /**
   * 获得角色信息
   *
   * @tags 管理后台 - 角色
   * @name GetRole
   * @summary 获得角色信息
   * @request GET:/admin-api/system/role/get
   * @secure
   */
  static getRole = <
    Req extends {
      /** @format int64 */
      id: number;
    } = {
      /** @format int64 */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultRoleResponseDTOModel, any>(
      {
        path: `/admin-api/system/role/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultRoleResponseDTOModel,
    );
  /**
   * 获得用户角色信息
   *
   * @tags 管理后台 - 角色
   * @name GetUserRole
   * @summary 获得用户角色信息
   * @request GET:/admin-api/system/role/getUserRole
   * @secure
   */
  static getUserRole = <Req extends RoleUserRequestDTOModel = RoleUserRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListRoleUserPoModel, any>(
      {
        path: `/admin-api/system/role/getUserRole`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListRoleUserPoModel,
    );
  /**
   * 删除角色
   *
   * @tags 管理后台 - 角色
   * @name DeleteRole
   * @summary 删除角色
   * @request GET:/system/role/delete
   * @secure
   */
  static deleteRole = <
    Req extends {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    } = {
      /**
       * 角色编号
       * @format int64
       * @example 1024
       */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/role/delete`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel,
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiSystemRole> = {
//   api: {
//     updateRole: {
//       path: "/system/role/update",
//       method: "POST",
//       type: OpenApiActions.update,
//       paramModel: RoleUpdateRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $RoleUpdateRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     updateRoleStatus: {
//       path: "/system/role/update-status",
//       method: "POST",
//       type: undefined,
//       paramModel: RoleUpdateStatusRequestDTOModel,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: $RoleUpdateStatusRequestDTO,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//     createRole: {
//       path: "/admin-api/system/role/create",
//       method: "POST",
//       type: OpenApiActions.create,
//       paramModel: RoleBaseDTOModel,
//       responseModel: CommonResultLongModel,
//       responseDataModel: undefined,
//       // paramSchema: $RoleBaseDTO,
//       // responseSchema: $CommonResultLong,
//       // responseDataSchema: undefined,
//     },
//     getRolePage: {
//       path: "/system/role/page",
//       method: "GET",
//       type: OpenApiActions.page,
//       paramModel: RolePageRequestDTOModel,
//       responseModel: CommonResultPageResultRolePOModel,
//       responseDataModel: RolePOModel,
//       // paramSchema: $RolePageRequestDTO,
//       // responseSchema: $CommonResultPageResultRolePO,
//       // responseDataSchema: $RolePO,
//     },
//     getSimpleRoleList: {
//       path: "/admin-api/system/role/list-all-simple",
//       method: "GET",
//       type: OpenApiActions["list-all-simple"],
//       paramModel: undefined,
//       responseModel: CommonResultListRoleSimpleResponseDTOModel,
//       responseDataModel: RoleSimpleResponseDTOModel,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultListRoleSimpleResponseDTO,
//       // responseDataSchema: $RoleSimpleResponseDTO,
//     },
//     getRole: {
//       path: "/admin-api/system/role/get",
//       method: "GET",
//       type: OpenApiActions.get,
//       paramModel: undefined,
//       responseModel: CommonResultRoleResponseDTOModel,
//       responseDataModel: RoleResponseDTOModel,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultRoleResponseDTO,
//       // responseDataSchema: $RoleResponseDTO,
//     },
//     getUserRole: {
//       path: "/admin-api/system/role/getUserRole",
//       method: "GET",
//       type: undefined,
//       paramModel: RoleUserRequestDTOModel,
//       responseModel: CommonResultListRoleUserPoModel,
//       responseDataModel: RoleUserPoModel,
//       // paramSchema: $RoleUserRequestDTO,
//       // responseSchema: $CommonResultListRoleUserPo,
//       // responseDataSchema: $RoleUserPo,
//     },
//     deleteRole: {
//       path: "/system/role/delete",
//       method: "GET",
//       type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: CommonResultBooleanModel,
//       responseDataModel: undefined,
//       // paramSchema: undefined,
//       // responseSchema: $CommonResultBoolean,
//       // responseDataSchema: undefined,
//     },
//   },
// };
