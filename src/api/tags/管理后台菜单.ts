// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "./http-client";

import { CommonResultBooleanModel } from "../models/CommonResultBooleanModel";
import { CommonResultListMenuResponseDTOModel } from "../models/CommonResultListMenuResponseDTOModel";
import { CommonResultListMenuSimpleResponseDTOModel } from "../models/CommonResultListMenuSimpleResponseDTOModel";
import { CommonResultLongModel } from "../models/CommonResultLongModel";
import { CommonResultMenuResponseDTOModel } from "../models/CommonResultMenuResponseDTOModel";
import { MenuCreateRequestDTOModel } from "../models/MenuCreateRequestDTOModel";
import { MenuListRequestDTOModel } from "../models/MenuListRequestDTOModel";
import { MenuResponseDTOModel } from "../models/MenuResponseDTOModel";
import { MenuSimpleResponseDTOModel } from "../models/MenuSimpleResponseDTOModel";
import { MenuUpdateRequestDTOModel } from "../models/MenuUpdateRequestDTOModel";

/**
 * 管理后台菜单
 */
export class AdminApiSystemMenu {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台菜单`;

  /**
   * 修改菜单
   *
   * @tags 管理后台 - 菜单
   * @name UpdateMenu
   * @summary 修改菜单
   * @request POST:/system/menu/update
   * @secure
   */
  static updateMenu = <
    Req extends MenuUpdateRequestDTOModel = MenuUpdateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/menu/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModel
    );
  /**
   * 创建菜单
   *
   * @tags 管理后台 - 菜单
   * @name CreateMenu
   * @summary 创建菜单
   * @request POST:/system/menu/create
   * @secure
   */
  static createMenu = <
    Req extends MenuCreateRequestDTOModel = MenuCreateRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultLongModel, any>(
      {
        path: `/system-service/system/menu/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultLongModel
    );
  /**
   * @description 用于【菜单管理】界面
   *
   * @tags 管理后台 - 菜单
   * @name GetMenuList
   * @summary 获取菜单列表
   * @request GET:/system/menu/list
   * @secure
   */
  static getMenuList = <
    Req extends MenuListRequestDTOModel = MenuListRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListMenuResponseDTOModel, any>(
      {
        path: `/system-service/system/menu/list`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListMenuResponseDTOModel
    );
  /**
   * @description 只包含被开启的菜单，用于【角色分配菜单】功能的选项。在多租户的场景下，会只返回租户所在套餐有的菜单
   *
   * @tags 管理后台 - 菜单
   * @name GetSimpleMenuList
   * @summary 获取菜单精简信息列表
   * @request GET:/system/menu/list-all-simple
   * @secure
   */
  static getSimpleMenuList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListMenuSimpleResponseDTOModel, any>(
      {
        path: `/system-service/system/menu/list-all-simple`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListMenuSimpleResponseDTOModel
    );
  /**
   * 获取菜单信息
   *
   * @tags 管理后台 - 菜单
   * @name GetMenu
   * @summary 获取菜单信息
   * @request GET:/system/menu/get
   * @secure
   */
  static getMenu = <
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
    httpClient.request<CommonResultMenuResponseDTOModel, any>(
      {
        path: `/system-service/system/menu/get`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultMenuResponseDTOModel
    );
  /**
   * 删除菜单
   *
   * @tags 管理后台 - 菜单
   * @name DeleteMenu
   * @summary 删除菜单
   * @request GET:/system/menu/delete
   * @secure
   */
  static deleteMenu = <
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
    httpClient.request<CommonResultBooleanModel, any>(
      {
        path: `/system-service/system/menu/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModel
    );
}
