// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import {
  ProdDemandRequestDTOModel,
  AddDemandRequestDTOModel,
} from "@/api/models/demand/ProdDemandRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemDemand {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 需求
   * @name getdemandList
   * @summary 获取需求列表
   * @request GET:/demand-original/page
   * @secure
   */
  static getdemandList = <
    Req extends ProdDemandRequestDTOModel = ProdDemandRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-original/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 创建需求
   *
   * @tags 管理后台 - 需求
   * @name createdemand
   * @summary 创建需求
   * @request POST:/demand-original/create
   * @secure
   */
  static createdemand = <
    Req extends AddDemandRequestDTOModel = AddDemandRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-original/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 修改需求
   *
   * @tags 管理后台 - 需求
   * @name updatedemand
   * @summary 修改需求
   * @request POST:/demand-original/update
   * @secure
   */
  static updatedemand = <
    Req extends AddDemandRequestDTOModel = AddDemandRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-original/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 另存原始需求
   *
   * @tags 管理后台 - 另存原始需求
   * @name copyOriginalDemand
   * @summary 另存原始需求
   * @request POST:/demand-original/copyOriginalDemand
   * @secure
   */
  static copyOriginalDemand = <
    Req extends { originalId: string } = { originalId: string },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-original/copyOriginalDemand`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 获取原始需求详情
   *
   * @tags 管理后台 - 获取原始需求详情
   * @name getdemanddetail
   * @summary 获取原始需求详情
   * @request GET:/demand-original/detail
   * @secure
   */
  static getdemanddetail = <
    Req extends {
      /** @format int64 */
      id: string;
    } = {
      /** @format int64 */
      id: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-original/detail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 删除需求
   *
   * @tags 管理后台 - 需求
   * @name Deletedemand
   * @summary 删除需求
   * @request GET:
   * @secure
   */
  static Deletedemand = <
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
        path: `/cirpoint-demand-api/demand-original/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求撤回
   *
   * @tags 管理后台 - 需求撤回
   * @name revokeDemand
   * @summary 需求撤回
   * @request GET:/demand-master/retract
   * @secure
   */
  static revokeDemand = <
    Req extends {
      /** @format int64 */
      basicId: string;
      taskId?: string;
    } = {
      /** @format int64 */
      basicId: string;
      taskId?: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/retract`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 获取需求菜单列表
   * @name getDemandMenuList
   * @summary 获取需求菜单列表
   * @request GET:/demand-master/getDemandMenuList
   * @secure
   */
  static getDemandMenuList = <Req extends {} = {}>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/getDemandMenuList`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 获取需求菜单列表
   * @name getDemandTodoList
   * @summary 获取需求菜单列表
   * @request GET:/demand-master/getDemandTodoList
   * @secure
   */
  static getDemandTodoList = <Req extends {} = {}>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/getDemandTodoList`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 获取当前用户岗位信息
   * @name getCurrentPositionRoleList
   * @summary 获取当前用户岗位信息
   * @request GET:/position-role/getCurrentPositionRoleList
   * @secure
   */
  static getCurrentPositionRoleList = <Req extends {} = {}>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/position-role/getCurrentPositionRoleList`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
