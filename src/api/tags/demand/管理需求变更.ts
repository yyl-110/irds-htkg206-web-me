import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandchangeRequestDTOModel } from "@/api/models/demand/ProdDemandchangeRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemchange {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 获得需求变更列表
   * @name getdemandchangeList
   * @summary 获取 获得需求变更列表
   * @request GET:/demand-change/page
   * @secure
   */
  static getdemandchangeList = <
    Req extends
      ProdDemandchangeRequestDTOModel = ProdDemandchangeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-change/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求变更统计信息
   *
   * @tags 管理后台 - 需求变更统计信息
   * @name getchangesticInfo
   * @summary 需求变更统计信息
   * @request GET:/cirpoint-demand-api/demand-change/statisticInfo
   * @secure
   */
  static getchangesticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-change/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 获取 获取结论变更详细
   *
   * @tags 管理后台 - 获取 获取结论变更详细
   * @name getChangeDetail
   * @summary 获取 获取结论变更详细
   * @request GET:/demand-change/getChangeDetail
   * @secure
   */
  static getChangeDetail = <
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
        path: `/cirpoint-demand-api/demand-change/getChangeDetail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 保存变更分析结论
   *
   * @tags 管理后台 - 保存变更分析结论
   * @name saveChangeConclusion
   * @summary 保存变更分析结论
   * @request POST:/demand-change/saveChangeConclusion
   * @secure
   */
  static saveChangeConclusion = <
    Req extends
      ProdDemandchangeRequestDTOModel = ProdDemandchangeRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-change/saveChangeConclusion`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 原始需求变更
   *
   * @tags 管理后台 - 原始需求变更
   * @name saveChangeConclusion
   * @summary 原始需求变更
   * @request POST:/demand-change/originalChange
   * @secure
   */
  static originalChange = <
    Req extends
      ProdDemandchangeRequestDTOModel = ProdDemandchangeRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-change/originalChange`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 获取需求版本列表
   *
   * @tags 管理后台 - 获取需求版本列表
   * @name getchangesticInfo
   * @summary 获取需求版本列表
   * @request GET:/cirpoint-demand-api/demand-master/getVersionList
   * @secure
   */
  static getVersionList = <
    Req extends { demandNum: string } = { demandNum: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/getVersionList`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
