// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandcollectRequestDTOModel } from "@/api/models/demand/ProdDemandcollectRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemDemandcollect {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 需求
   * @name getdemandcollectList
   * @summary 获取需求列表
   * @request GET:/cirpoint-demand-api/demand-collect/page
   * @secure
   */
  static getdemandcollectList = <
    Req extends
      ProdDemandcollectRequestDTOModel = ProdDemandcollectRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-collect/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 保存初始需求
   *
   * @tags 管理后台 - 保存初始需求
   * @name saveMaster
   * @summary 保存初始需求
   * @request POST:/cirpoint-demand-api/demand-collect/saveMaster
   * @secure
   */
  static saveMaster = <Req extends any = any>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-collect/saveMaster`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 获取预分析结论
   *
   * @tags 管理后台 - 获取预分析结论
   * @name statisticInfo
   * @summary 获取预分析结论
   * @request GET:/cirpoint-demand-api/demand-collect/getPreAnalysisConclusion
   * @secure
   */
  static getPreAnalysisConclusion = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-collect/getPreAnalysisConclusion`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 需求收集统计信息
   *
   * @tags 管理后台 - 需求收集统计信息
   * @name statisticInfo
   * @summary 需求收集统计信息
   * @request GET:/cirpoint-demand-api/demand-collect/statisticInfo
   * @secure
   */
  static statisticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-collect/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 获取初始需求详细信息
   *
   * @tags 管理后台 - 获取初始需求详细信息
   * @name statisticInfo
   * @summary 获取初始需求详细信息
   * @request GET:/cirpoint-demand-api/demand-master/getInitDemandDetail
   * @secure
   */
  static getInitDemandDetail = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/getInitDemandDetail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 更新需求状态
   *
   * @tags 管理后台 - 更新需求状态
   * @name statisticInfo
   * @summary 更新需求状态
   * @request GET:/cirpoint-demand-api/demand-master/updateStatus
   * @secure
   */
  static updateStatus = <
    Req extends { basicId: string; status: string } = {
      basicId: string;
      status: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/updateStatus`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
