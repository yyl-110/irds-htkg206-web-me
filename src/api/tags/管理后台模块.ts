// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";
import { CommonResultBooleanModulemanaGementModel } from "../models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { CommonResultListMenuResponseDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonResultListMenuResponseDTOModulemanaGementModel";
import { CommonResultListMenuSimpleResponseDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonResultListMenuSimpleResponseDTOModulemanaGementModel";
import { CommonResultLongModulemanaGementModel } from "../models/ModulemanaGement/CommonResultLongModulemanaGementModel";
import { CommonResultMenuResponseDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonResultMenuResponseDTOModulemanaGementModel";
import { CommonCreateRequestDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonCreateRequestDTOModulemanaGementModel";
import { CommonListRequestDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel";
import { CommonResponseDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonResponseDTOModulemanaGementModel";
import { CommonSimpleResponseDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonSimpleResponseDTOModulemanaGementModel";
import { CommonUpdateRequestDTOModulemanaGementModel } from "../models/ModulemanaGement/CommonUpdateRequestDTOModulemanaGementModel";

/**
 * 管理后台模块
 */
export class AdminApiSystemModular {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台模块`;

  /**
   * @description 用于【模块管理】界面
   *
   * @tags 功能模块 - 查看所有用户自定义一级节点
   * @name GetMenuList
   * @summary 获取所有用户自定义一级节点
   * @request GET:/business/info-doc-dir/list-parent-custom-dir
   * @secure
   */
  static getlistparentcustomdir = <
    Req extends
      CommonListRequestDTOModulemanaGementModel = CommonListRequestDTOModulemanaGementModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<
      CommonResultListMenuResponseDTOModulemanaGementModel,
      any
    >(
      {
        path: `/business/info-doc-dir/list-parent-custom-dir`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListMenuResponseDTOModulemanaGementModel
    );

  /**
   * 修改模块
   *
   * @tags 管理后台 - 模块
   * @name UpdateMenu
   * @summary 修改模块
   * @request POST:/system/func-menu/update
   * @secure
   */
  static updateModular = <
    Req extends
      CommonUpdateRequestDTOModulemanaGementModel = CommonUpdateRequestDTOModulemanaGementModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-auth-api/system/func-menu/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 创建模块
   *
   * @tags 管理后台 - 模块
   * @name CreateMenu
   * @summary 创建模块
   * @request POST:/system/func-menu/create
   * @secure
   */
  static createModular = <
    Req extends
      CommonCreateRequestDTOModulemanaGementModel = CommonCreateRequestDTOModulemanaGementModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultLongModulemanaGementModel, any>(
      {
        path: `/cirpoint-auth-api/system/func-menu/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModulemanaGementModel
    );
  /**
   * @description 用于【模块管理】界面
   *
   * @tags 管理后台 - 模块
   * @name GetMenuList
   * @summary 获取模块列表
   * @request GET:/system/func-menu/list
   * @secure
   */
  static getModularList = <
    Req extends
      CommonListRequestDTOModulemanaGementModel = CommonListRequestDTOModulemanaGementModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<
      CommonResultListMenuResponseDTOModulemanaGementModel,
      any
    >(
      {
        path: `/cirpoint-auth-api/system/func-menu/list`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListMenuResponseDTOModulemanaGementModel
    );
  /**
   * @description 只包含被开启的模块，用于【角色分配模块】功能的选项。在多租户的场景下，会只返回租户所在套餐有的模块
   *
   * @tags 管理后台 - 模块
   * @name GetSimpleMenuList
   * @summary 获取模块精简信息列表
   * @request GET:/system/menu/list-all-simple
   * @secure
   */
  static getSimpleModularList = (params: RequestParams = {}) =>
    httpClient.request<
      CommonResultListMenuSimpleResponseDTOModulemanaGementModel,
      any
    >(
      {
        path: `/cirpoint-auth-api/system/menu/list-all-simple`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListMenuSimpleResponseDTOModulemanaGementModel
    );
  /**
   * 获取模块信息
   *
   * @tags 管理后台 - 模块
   * @name GetMenu
   * @summary 获取模块信息
   * @request GET:/system/func-menu/get
   * @secure
   */
  static getModular = <
    Req extends {
      /** @format int64 */
      id: number;
    } = {
      /** @format int64 */
      id: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultMenuResponseDTOModulemanaGementModel, any>(
      {
        path: `/cirpoint-auth-api/system/func-menu/get`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultMenuResponseDTOModulemanaGementModel
    );
  /**
   * 删除模块
   *
   * @tags 管理后台 - 模块
   * @name DeleteMenu
   * @summary 删除模块
   * @request GET:/system/func-menu/delete
   * @secure
   */
  static deleteModular = <
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
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-auth-api/system/func-menu/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
