import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandacceptanceRequestDTOModel } from "@/api/models/demand/ProdDemandacceptanceRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemacceptance {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 需求验收
   * @name getdemandacceptList
   * @summary 获取 需求验收列表
   * @request GET:/demand-accept/page
   * @secure
   */
  static getdemandacceptList = <
    Req extends
      ProdDemandacceptanceRequestDTOModel = ProdDemandacceptanceRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-accept/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求验收统计信息
   *
   * @tags 管理后台 - 需求验收统计信息
   * @name getacceptsticInfo
   * @summary 需求验收统计信息
   * @request GET:/cirpoint-demand-api/demand-accept/statisticInfo
   * @secure
   */
  static getacceptsticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-accept/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 获取 获取验收任务列表
   *
   * @tags 管理后台 - 获取 获取验收任务列表
   * @name getTaskList
   * @summary 获取 获取验收任务列表
   * @request GET:/demand-accept/getTaskList
   * @secure
   */
  static getTaskList = <
    Req extends {
      basicId: string;
    } = {
      basicId: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-accept/getTaskList`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 保存验收结果
   *
   * @tags 管理后台 - 保存验收结果
   * @name saveTask
   * @summary 保存验收结果
   * @request POST:/demand-accept/saveTask
   * @secure
   */
  static saveTask = <
    Req extends
      ProdDemandacceptanceRequestDTOModel = ProdDemandacceptanceRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-accept/saveTask`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
