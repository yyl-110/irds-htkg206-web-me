// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdTechnicaldRequestDTOModel } from "@/api/models/technicaldisciplines/ProdTechnicaldRequestDTOModel";

/**
 * 管理后台技术学科
 */
export class AdminApiSystemTechnicaldisciplines {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台技术学科`;
  /**
   * @description 用于【技术学科管理】界面
   *
   * @tags 管理后台 - 技术学科
   * @name gettechnicaldisciplinesList
   * @summary 获取技术学科列表
   * @request GET:/cirpoint-demand-api/demand-technical-discipline/getTree
   * @secure
   */
  static gettechnicaldisciplinesList = <
    Req extends ProdTechnicaldRequestDTOModel = ProdTechnicaldRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-technical-discipline/getTree`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 创建技术学科
   *
   * @tags 管理后台 - 技术学科
   * @name createtechnicaldisciplines
   * @summary 创建技术学科
   * @request POST:/cirpoint-demand-api/demand-technical-discipline/create
   * @secure
   */
  static createtechnicaldisciplines = <
    Req extends ProdTechnicaldRequestDTOModel = ProdTechnicaldRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-technical-discipline/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 修改技术学科
   *
   * @tags 管理后台 - 技术学科
   * @name updatetechnicaldisciplines
   * @summary 修改技术学科
   * @request POST:/cirpoint-demand-api/demand-technical-discipline/update
   * @secure
   */
  static updatetechnicaldisciplines = <
    Req extends ProdTechnicaldRequestDTOModel = ProdTechnicaldRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-technical-discipline/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 上移技术学科
   *
   * @tags 管理后台 - 上移技术学科
   * @name sortdiscipline
   * @summary 上移技术学科
   * @request GET:/cirpoint-demand-api/demand-technical-discipline/sort
   * @secure
   */
  static sortdiscipline = <
    Req extends {
      id: string;
      type: number;
    } = {
      id: string;
      type: number;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-technical-discipline/sort`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 删除技术学科
   *
   * @tags 管理后台 - 技术学科
   * @name deletetechnicaldisciplines
   * @summary 删除技术学科
   * @request GET:/cirpoint-demand-api/demand-technical-discipline/delete
   * @secure
   */
  static deletetechnicaldisciplines = <
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
        path: `/cirpoint-demand-api/demand-technical-discipline/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 用于【技术学科管理】界面
   *
   * @tags 管理后台 - 技术学科
   * @name getLevel2Node
   * @summary 获取技术学科列表
   * @request GET:/cirpoint-demand-api/demand-technical-discipline/getLevel2Node
   * @secure
   */
  static getLevel2Node = <
    Req extends ProdTechnicaldRequestDTOModel = ProdTechnicaldRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-technical-discipline/getLevel2Node`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
