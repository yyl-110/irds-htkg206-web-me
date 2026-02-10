// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { productSpecificationAdd } from '@/api/models/productSpecification/productSpecificationAdd';
/**
 * 产品组合策略
 */
export class AdminApiSystemProductPlanningscoring {
  /**
   * 获取资源分配列表
   *
   * @tags 管理后台 - 获取资源分配列表
   * @name allocationList
   * @summary 获取资源分配列表
   * @request POST:/product-plan-resource-allocation/allocationList
   * @secure
   */
  static allocationList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-resource-allocation/allocationList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 资源分配统计
   *
   * @tags 管理后台 - 资源分配统计
   * @name allocationStatistics
   * @summary 资源分配统计
   * @request POST:/product-plan-resource-allocation/allocationStatistics
   * @secure
   */
  static allocationStatistics = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-resource-allocation/allocationStatistics`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取资源分配详细
   *
   * @tags 管理后台 - 获取资源分配详细
   * @name allocationDetail
   * @summary 获取资源分配详细
   * @request POST:/product-plan-resource-allocation/allocationDetail
   * @secure
   */
  static allocationDetail = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-resource-allocation/allocationDetail`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品组合清单详细
   *
   * @tags 管理后台 - 获取产品组合清单详细
   * @name combinationGetDetail
   * @summary 获取产品组合清单详细
   * @request POST:/product-plan-combination/getDetail
   * @secure
   */
  static combinationGetDetail = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/getDetail`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新资源分配
   *
   * @tags 更新资源分配
   * @name updateallocation
   * @request /cirpoint-demand-api/product-plan-resource-allocation/update
   * @secure
   */
  static updateallocation = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-resource-allocation/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步组合排序列表
   *
   * @tags 同步组合排序列表
   * @name syncAllocationList
   * @request /cirpoint-demand-api/product-plan-resource-allocation/syncAllocationList
   * @secure
   */
  static syncAllocationList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-resource-allocation/syncAllocationList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取生命周期列表
   *
   * @tags 管理后台 - 获取生命周期列表
   * @name allocationList
   * @summary 获取生命周期列表
   * @request POST:/product-plan-life-cycle/cycleList
   * @secure
   */
  static getcycleList = <
    Req extends { planId: string; productPlatformIds: any } = {
      planId: string;
      productPlatformIds: any;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-life-cycle/cycleList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新生命周期列表
   *
   * @tags 更新生命周期列表
   * @name updatecycleList
   * @request /cirpoint-demand-api/product-plan-life-cycle/update
   * @secure
   */
  static updatecycleList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-life-cycle/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 生命周期-获取平台下拉框
   *
   * @tags 管理后台 - 获取平台下拉框
   * @name getLifeCyclePlatformList
   * @summary 获取平台下拉框
   * @request POST:/product-plan-life-cycle/getLifeCyclePlatformList
   * @secure
   */
  static getLifeCyclePlatformList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-life-cycle/getLifeCyclePlatformList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 生命周期-同步资源分配列表
   *
   * @tags 生命周期-同步资源分配列表
   * @name syncLifeCycleList
   * @request /cirpoint-demand-api/product-plan-life-cycle/syncLifeCycleList
   * @secure
   */
  static syncLifeCycleList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-life-cycle/syncLifeCycleList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取销量预测/收入利润列表
   *
   * @tags 管理后台 - 获取销量预测/收入利润
   * @name getproductforecastList
   * @summary 获取销量预测/收入利润
   * @request POST:/product-plan-sales-forecast/list
   * @secure
   */
  static getproductforecastList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新销量预测/收入利润列表
   *
   * @tags 更新销量预测/收入利润列表
   * @name updatecycleList
   * @request /cirpoint-demand-api/product-plan-sales-forecast/update
   * @secure
   */
  static updateproductforecastList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 销量预测/收入利润下载模板
   *
   * @tags 管理后台 - 销量预测/收入利润下载模板
   * @name excelTemplate
   * @summary 销量预测/收入利润下载模板
   * @request POST:/cirpoint-demand-api/product-plan-sales-forecast/download
   * @secure
   */
  static excelTemplate = <
    Req extends { planId: number; fileName: String; template: boolean } = {
      planId: number;
      fileName: String;
      template: boolean;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 销量预测/收入利润导出
   *
   * @tags 管理后台 - 销量预测/收入利润导出
   * @name excelExport
   * @summary 销量预测/收入利润导出
   * @request POST:/cirpoint-demand-api/product-plan-sales-forecast/export
   * @secure
   */
  static excelExport = <
    Req extends { planId: number; fileName: String; template: boolean } = {
      planId: number;
      fileName: String;
      template: boolean;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 销量预测/收入利润导入
   *
   * @tags 管理后台 - 销量预测/收入利润导入
   * @name excelExport
   * @summary 销量预测/收入利润导入
   * @request POST:/cirpoint-demand-api/product-plan-sales-forecast/import
   * @secure
   */
  static excelImport = <
    Req extends {
      /** @format binary */
      file?: File;
    } = {
      /** @format binary */
      file?: File;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/import?planId=${data.data.planId}&forecastType=${data.data.forecastType}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-获取产品组合排序列表
   *
   * @tags 管理后台 - 获取产品组合排序列表
   * @name getProductGroupSortList
   * @summary 打分-获取产品组合排序列表
   * @request POST:/product-plan-score/getProductGroupSortList
   * @secure
   */
  static getProductGroupSortList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/getProductGroupSortList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 打分-同步组合排序列表
   *
   * @tags  打分-同步组合排序列表
   * @name syncProductSortList
   * @request /cirpoint-demand-api/product-plan-score/syncProductSortList
   * @secure
   */
  static syncProductSortList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/syncProductSortList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取打分流程人员选取详细
   *
   * @tags 管理后台 - 获取打分流程人员选取详细
   * @name getScoreProcessUser
   * @summary 获取打分流程人员选取详细
   * @request POST:/product-plan-score/getScoreProcessUser
   * @secure
   */
  static getScoreProcessUser = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/getScoreProcessUser`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品分组权重
   *
   * @tags 管理后台 - 获取产品分组权重
   * @name getProductGroupWeight
   * @summary 获取产品分组权重
   * @request POST:/product-plan-score/getProductGroupWeight
   * @secure
   */
  static getProductGroupWeight = <Req extends { taskId: string } = { taskId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/getProductGroupWeight`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取打分权重
   *
   * @tags 管理后台 - 获取打分权重
   * @name getProductScoreWeight
   * @summary 获取打分权重
   * @request POST:/product-plan-score/getProductScoreWeight
   * @secure
   */
  static getProductScoreWeight = <Req extends { taskId: string } = { taskId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/getProductScoreWeight`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取分数列表
   *
   * @tags 管理后台 - 获取分数列表
   * @name scoreList
   * @summary 获取分数列表
   * @request POST:/product-plan-score/scoreList
   * @secure
   */
  static scoreList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/scoreList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查看打分结果
   *
   * @tags 管理后台 - 查看打分结果
   * @name getScoreResultList
   * @summary 查看打分结果
   * @request POST:/product-plan-score/getScoreResultList
   * @secure
   */
  static getScoreResultList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/getScoreResultList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-设置打分流程人员选取详细
   *
   * @tags  打分-设置打分流程人员选取详细
   * @name setScoreProcessUser
   * @request /cirpoint-demand-api/product-plan-score/setScoreProcessUser
   * @secure
   */
  static setScoreProcessUser = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/setScoreProcessUser`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-设置产品分组
   *
   * @tags  打分-设置产品分组
   * @name syncProductSortList
   * @request /cirpoint-demand-api/product-plan-score/saveProductGroup
   * @secure
   */
  static saveProductGroup = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/saveProductGroup`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-设置产品分组权重
   *
   * @tags  打分-设置产品分组权重
   * @name saveProductGroupWeight
   * @request /cirpoint-demand-api/product-plan-score/saveProductGroupWeight
   * @secure
   */
  static saveProductGroupWeight = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/saveProductGroupWeight`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-设置打分权重
   *
   * @tags  打分-设置打分权重
   * @name saveProductScoreWeight
   * @request /cirpoint-demand-api/product-plan-score/saveProductScoreWeight
   * @secure
   */
  static saveProductScoreWeight = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/saveProductScoreWeight`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-发起打分流程
   *
   * @tags  打分-发起打分流程
   * @name initScoreProcess
   * @request /cirpoint-demand-api/product-plan-score/initScoreProcess
   * @secure
   */
  static initScoreProcess = <Req extends { taskId: string } = { taskId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/initScoreProcess`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 打分-更新计算分数
   *
   * @tags  打分-更新计算分数
   * @name updateScoreList
   * @request /cirpoint-demand-api/product-plan-score/updateScoreList
   * @secure
   */
  static updateScoreList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/updateScoreList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 打分-提交保存分数入库
   *
   * @tags  打分-提交保存分数入库
   * @name submitSaveScore
   * @request /cirpoint-demand-api/product-plan-score/submitSaveScore
   * @secure
   */
  static submitSaveScore = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/submitSaveScore`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 导出打分结果
   *
   * @tags 管理后台 - 导出打分结果
   * @name scoreResultExport
   * @summary 导出打分结果
   * @request GET:/cirpoint-base-api/product-plan-score/scoreResultExport
   * @secure
   */
  static scoreResultExport = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-score/scoreResultExport`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新预测
   *
   * @tags 更新预测
   * @name forecastUpdate
   * @request /cirpoint-demand-api/product-plan-sales-forecast/update
   * @secure
   */
  static forecastUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步销量预测列表
   *
   * @tags 同步销量预测列表
   * @name syncForecastList
   * @request /product-plan-sales-forecast/syncForecastList
   * @secure
   */
  static syncForecastList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-sales-forecast/syncForecastList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
