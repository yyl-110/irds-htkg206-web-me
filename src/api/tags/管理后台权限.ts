// import { type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { AdminListItemResponseDTOModel } from "../models/AdminListItemResponseDTOModel";
import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { CommonResultListAdminListItemResponseDTOModel } from "../models/CommonResultListAdminListItemResponseDTOModel";
import { CommonResultSetLongModel } from "../models/CommonResultSetLongModel";
import { PermissionAssignRoleDataScopeRequestDTOModel } from "../models/PermissionAssignRoleDataScopeRequestDTOModel";
import { PermissionAssignRoleMenuRequestDTOModel } from "../models/PermissionAssignRoleMenuRequestDTOModel";
import { PermissionAssignUserRoleRequestDTOModel } from "../models/PermissionAssignUserRoleRequestDTOModel";
import { PermissionAssignUsersRoleRequestDTOModel } from "../models/PermissionAssignUsersRoleRequestDTOModel";
import { PermissionAssignUsersRoleRequestDTOroleModel } from "../models/role/PermissionAssignUsersRoleRequestDTOroleModel";
import { PermissionAssignUsersRoleRequestDTOserviceDataModel } from "../models/serviceData/PermissionAssignUsersserviceDataRequestDTOModel";
/**
 * 管理后台权限
 */
export class AdminApiSystemPermission {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台权限`;
  /**
   * 保存服务资料权限
   *
   * @tags 管理务资料 - 权限
   * @name AssignUsersRole
   * @summary 保存服务资料权限
   * @request POST:/admin-api/system/permission/assign-role-doc
   * @secure
   */
  static saveservicedoc = <
    Req extends
      PermissionAssignUsersRoleRequestDTOserviceDataModel = PermissionAssignUsersRoleRequestDTOserviceDataModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/assign-role-doc`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获取角色下服务资料树所有权限
   *
   * @tags 管理后台 - 服务资料
   * @name AssignUsersRole
   * @summary 务资料树所有权限
   * @request POST:/system/permission/list-role-dir
   * @secure
   */
  static getservicelistroledir = <
    // Req extends PermissionAssignUsersserviceDataRequestDTOModel = PermissionAssignUsersserviceDataRequestDTOModel,
    Req extends {},
  >(
    // data: Req,
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/list-role-dir`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 模块服务资料树
   *
   * @tags 管理后台 - 服务资料
   * @name AssignUsersRole
   * @summary 服务资料权限
   * @request POST:/system/permission/assign-users-role
   * @secure
   */
  static getserviceparentList = <
    // Req extends PermissionAssignUsersserviceDataRequestDTOModel = PermissionAssignUsersserviceDataRequestDTOModel,
    Req extends {},
  >(
    // data: Req,
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/business/info-doc-dir/list-parent-dir`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 保存模块权限
   *
   * @tags 管理后台 - 权限
   * @name AssignUsersRole
   * @summary 保存模块权限
   * @request POST:/system/permission/assign-users-role
   * @secure
   */
  static savepermissionLogin = <
    Req extends
      PermissionAssignUsersRoleRequestDTOroleModel = PermissionAssignUsersRoleRequestDTOroleModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/assign-role-func`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 模块权限详情
   *
   * @tags 管理后台 - 权限
   * @name AssignUsersRole
   * @summary 模块权限详情
   * @request POST:/system/permission/assign-users-role
   * @secure
   */
  static savepermissionlistrolefunc = <
    Req extends
      PermissionAssignUsersRoleRequestDTOroleModel = PermissionAssignUsersRoleRequestDTOroleModel,
  >(
    // data: Req,
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/list-role-func`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );

  /**
   * 赋予多个用户角色
   *
   * @tags 管理后台 - 权限
   * @name AssignUsersRole
   * @summary 赋予多个用户角色
   * @request POST:/system/permission/assign-users-role
   * @secure
   */
  static assignUsersRole = <
    Req extends
      PermissionAssignUsersRoleRequestDTOModel = PermissionAssignUsersRoleRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/assign-users-role`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 赋予用户角色
   *
   * @tags 管理后台 - 权限
   * @name AssignUserRole
   * @summary 赋予用户角色
   * @request POST:/admin-api/system/permission/assign-user-role
   * @secure
   */
  static assignUserRole = <
    Req extends
      PermissionAssignUserRoleRequestDTOModel = PermissionAssignUserRoleRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/permission/assign-user-role`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 赋予角色菜单
   *
   * @tags 管理后台 - 权限
   * @name AssignRoleMenu
   * @summary 赋予角色菜单
   * @request POST:/system/permission/assign-role-menu
   * @secure
   */
  static assignRoleMenu = <
    Req extends
      PermissionAssignRoleMenuRequestDTOModel = PermissionAssignRoleMenuRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/assign-role-menu`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 赋予角色数据权限
   *
   * @tags 管理后台 - 权限
   * @name AssignRoleDataScope
   * @summary 赋予角色数据权限
   * @request POST:/admin-api/system/permission/assign-role-data-scope
   * @secure
   */
  static assignRoleDataScope = <
    Req extends
      PermissionAssignRoleDataScopeRequestDTOModel = PermissionAssignRoleDataScopeRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/admin-api/system/permission/assign-role-data-scope`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 获得管理员拥有的角色编号列表
   *
   * @tags 管理后台 - 权限
   * @name ListAdminRoles
   * @summary 获得管理员拥有的角色编号列表
   * @request GET:/admin-api/system/permission/list-user-roles
   * @secure
   */
  static listAdminRoles = <
    Req extends {
      /**
       * 用户编号
       * @format int64
       */
      userId: number;
    } = {
      /**
       * 用户编号
       * @format int64
       */
      userId: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultSetLongModel, any>(
      {
        path: `/admin-api/system/permission/list-user-roles`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultSetLongModel
    );
  /**
   * 获得角色拥有的菜单编号
   *
   * @tags 管理后台 - 权限
   * @name ListRoleMenus
   * @summary 获得角色拥有的菜单编号
   * @request GET:/system/permission/list-role-resources
   * @secure
   */
  static listRoleMenus = <
    Req extends {
      /**
       * 角色编号
       * @format int64
       */
      roleId: number;
    } = {
      /**
       * 角色编号
       * @format int64
       */
      roleId: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultSetLongModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/list-role-resources`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultSetLongModel
    );
  /**
   * 获取角色下的用户
   *
   * @tags 管理后台 - 权限
   * @name GetUsersByRole
   * @summary 获取角色下的用户
   * @request GET:/system/permission/getUsersByRole
   * @secure
   */
  static getUsersByRole = <
    Req extends {
      /** @format int64 */
      roleId: number;
    } = {
      /** @format int64 */
      roleId: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListAdminListItemResponseDTOModel, any>(
      {
        path: `/cirpoint-auth-api/system/permission/getUsersByRole`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListAdminListItemResponseDTOModel
    );
}
