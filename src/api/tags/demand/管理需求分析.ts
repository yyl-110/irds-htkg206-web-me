// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandcollectRequestDTOModel } from "@/api/models/demand/ProdDemandcollectRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemDemandanalyze {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 获取需求分析列表
   * @name getdemandanalyzeList
   * @summary 获取需求分析列表
   * @request GET:/cirpoint-demand-api/demand-collect/page
   * @secure
   */
  static getdemandanalyzeList = <
    Req extends
      ProdDemandcollectRequestDTOModel = ProdDemandcollectRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 需求分析统计信息
   *
   * @tags 管理后台 - 需求分析统计信息
   * @name getanalyzestatisticInfo
   * @summary 需求分析统计信息
   * @request GET:/cirpoint-demand-api/demand-analyze/statisticInfo
   * @secure
   */
  static getanalyzestatisticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求分析页面产品包属性
   *
   * @tags 管理后台 - 需求分析页面产品包属性
   * @name getPackageType
   * @summary 需求分析页面产品包属性
   * @request GET:/cirpoint-demand-api/demand-analyze/getPackageType
   * @secure
   */
  static getPackageType = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/getPackageType`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 保存产品包属性
   *
   * @tags 管理后台 - 保存产品包属性
   * @name savePackageType
   * @summary 保存产品包属性
   * @request POST:/cirpoint-demand-api/demand-analyze/savePackageType
   * @secure
   */
  static savePackageType = <Req extends any = any>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/savePackageType`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 发起决策分析
   *
   * @tags 管理后台 - 发起决策分析
   * @name initiateDecisionAnalyze
   * @summary 发起决策分析
   * @request POST:/cirpoint-demand-api/demand-analyze/initiateDecisionAnalyze
   * @secure
   */
  static initiateDecisionAnalyze = <Req extends any = any>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/initiateDecisionAnalyze`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 获取初始需求详细信息
   *
   * @tags 管理后台 - 获取初始需求详细信息
   * @name getInitDemandDetail
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
   * @name updateStatus
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
  /**
   * @description 发起决策分析-流程人员选取详细
   *
   * @tags 管理后台 - 发起决策分析-流程人员选取详细
   * @name getChooseProcessUser
   * @summary 发起决策分析-流程人员选取详细
   * @request GET:/cirpoint-demand-api/demand-analyze/getChooseProcessUser
   * @secure
   */
  static getChooseProcessUser = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/getChooseProcessUser`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 发起决策分析-流程人员选取
   *
   * @tags 管理后台 - 发起决策分析-流程人员选取
   * @name chooseProcessUser
   * @summary 发起决策分析-流程人员选取
   * @request GET:/cirpoint-demand-api/demand-analyze/chooseProcessUser
   * @secure
   */
  static chooseProcessUser = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/chooseProcessUser`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策分析-RAT结论详细
   *
   * @tags 管理后台 - 决策分析-RAT结论详细
   * @name getRatGradeInfo
   * @summary 决策分析-RAT结论详细
   * @request GET:/cirpoint-demand-api/demand-analyze/getRatGradeInfo
   * @secure
   */
  static getRatGradeInfo = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/getRatGradeInfo`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 决策分析-RAT结论保存
   *
   * @tags 管理后台 - 决策分析-RAT结论保存
   * @name saveRatGradeInfo
   * @summary 决策分析-RAT结论保存
   * @request GET:/cirpoint-demand-api/demand-analyze/saveRatGradeInfo
   * @secure
   */
  static saveRatGradeInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/saveRatGradeInfo`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策分析-RAT上报升级详细
   *
   * @tags 管理后台 - 决策分析-RAT上报升级详细
   * @name getRatGradeUpDetail
   * @summary 决决策分析-RAT上报升级详细
   * @request GET:/cirpoint-demand-api/demand-analyze/getRatGradeUpDetail
   * @secure
   */
  static getRatGradeUpDetail = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/getRatGradeUpDetail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策分析-RAT上报
   *
   * @tags 管理后台 - 决策分析-RAT上报
   * @name ratGradeUp
   * @summary 决策分析-RAT上报
   * @request GET:/cirpoint-demand-api/demand-analyze/ratGradeUp
   * @secure
   */
  static ratGradeUp = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/ratGradeUp`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策处理-IPMT处理详细
   *
   * @tags 管理后台 - 决决策处理-IPMT处理详细
   * @name ipmtDecisionDetail
   * @summary 决策处理-IPMT处理详细
   * @request GET:/cirpoint-demand-api/demand-analyze/ipmtDecisionDetail
   * @secure
   */
  static ipmtDecisionDetail = <
    Req extends { basicId: string } = { basicId: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/ipmtDecisionDetail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 决策处理-IPMT保存提交
   *
   * @tags 管理后台 - 决策处理-IPMT保存提交
   * @name ipmtDecisionSave
   * @summary 决策处理-IPMT保存提交
   * @request GET:/cirpoint-demand-api/demand-analyze/ipmtDecisionSave
   * @secure
   */
  static ipmtDecisionSave = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/ipmtDecisionSave`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策处理-REM决策结论列表
   *
   * @tags 管理后台 - 决策处理-REM决策结论列表
   * @name remDecisionList
   * @summary 决策处理-REM决策结论列表
   * @request GET:/cirpoint-demand-api/demand-analyze/remDecisionList
   * @secure
   */
  static remDecisionList = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/remDecisionList`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 决策处理-REM决策结论批量决策保存
   *
   * @tags 管理后台 - 决策处理-REM决策结论批量决策保存
   * @name remDecisionConclusionSaveBach
   * @summary 决决策处理-REM决策结论批量决策保存
   * @request GET:/cirpoint-demand-api/demand-analyze/remDecisionConclusionSaveBach
   * @secure
   */
  static remDecisionConclusionSaveBach = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-analyze/remDecisionConclusionSaveBach`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 决策分析-撤回
   *
   * @tags 管理后台 - 决策分析-撤回
   * @name retract
   * @summary 决策分析-撤回
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
