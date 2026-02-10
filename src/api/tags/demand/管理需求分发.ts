import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandibutionRequestDTOModel } from "@/api/models/demand/ProdDemandibutionRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemistribution {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 需求分发
   * @name getdemandList
   * @summary 获取需求分发列表
   * @request GET:/demand-allocate/page
   * @secure
   */
  static getdemandallocateList = <
    Req extends
      ProdDemandibutionRequestDTOModel = ProdDemandibutionRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-allocate/page`,
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
   * @name saveAllocate
   * @summary 创建需求
   * @request POST:/demand-allocate/saveAllocate
   * @secure
   */
  static saveAllocate = <
    Req extends
      ProdDemandibutionRequestDTOModel = ProdDemandibutionRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-allocate/saveAllocate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求分发统计信息
   *
   * @tags 管理后台 - 需求分发统计信息
   * @name statisticInfo
   * @summary 需求分发统计信息
   * @request GET:/cirpoint-demand-api/demand-allocate/statisticInfo
   * @secure
   */
  static getibutionstatisticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-allocate/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 获取需求分发详情
   *
   * @tags 管理后台 - 获取需求分发详情
   * @name getdemanddetail
   * @summary 获取需求分发详情
   * @request GET:/demand-allocate/getAllocateDetail
   * @secure
   */
  static getAllocateDetail = <
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
        path: `/cirpoint-demand-api/demand-allocate/getAllocateDetail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求分发-撤回
   *
   * @tags 管理后台 - 需求分发-撤回
   * @name retract
   * @summary 需求分发-撤回
   * @request GET:/cirpoint-demand-api/demand-master/retract
   * @secure
   */
  static retract = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/retract`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
