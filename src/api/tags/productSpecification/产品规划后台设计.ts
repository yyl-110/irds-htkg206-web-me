import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { productPlanTaskDetail } from '@/api/models/productSpecification/productPlanTaskDetail';
import { ProdPositionInfoRequestDTOModel } from '@/api/models/position/ProdPositionInfoRequestDTOModel';

/**
 * 产品规划
 */
export class AdminApiProductPlanTaskDesign {
  /**
   * 产品规划设计-战略分解
   *
   * @tags 管理后台 - 战略分解页面信息查询
   * @name getProductPlanTaskStrategicInfo
   * @summary 战略分解页面信息查询
   * @request POST:/cirpoint-demand-api/product-plan-task-detail/getProductPlanTaskStrategicInfo
   * @secure
   */
  static getProductPlanTaskStrategicInfo = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task-detail/getProductPlanTaskStrategicInfo`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 产品规划设计-战略分解
   *
   * @tags 管理后台 - 产品规划设计详细信息修改
   * @name productPlanTaskDetailUpdate
   * @summary 产品规划设计详细信息修改
   * @request POST:/cirpoint-demand-api/product-plan-task-detail/create
   * @secure
   */
  static productPlanTaskDetailUpdate = <Req extends productPlanTaskDetail = productPlanTaskDetail>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task-detail/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取平台战略目标分解列表
   *
   * @tags 获取平台战略目标分解列表
   * @name getProductPlanScoreWeightList
   * @request /cirpoint-demand-api/product-plan-goal-breakdowns/getProductPlanScoreWeightList
   * @secure
   */
  static getProductPlanScoreWeightList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-goal-breakdowns/getProductPlanScoreWeightList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 战略分解数据详情修改
   *
   * @tags 战略分解数据详情修改
   * @name productPlanTaskBreakdownsUpdate
   * @request /cirpoint-demand-api/product-plan-goal-breakdowns/productPlanTaskBreakdownsUpdate
   * @secure
   */
  static productPlanTaskBreakdownsUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-goal-breakdowns/productPlanTaskBreakdownsUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-市场趋势分析-市场数据查询
   *
   * @tags 市场趋势分析-市场数据查询
   * @name productTaskMarketTrendList
   * @request POST:/cirpoint-demand-api/product-plan-market-trend/list
   * @secure
   */
  static productTaskMarketTrendList = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-市场趋势分析-竞争格局数据查询
   *
   * @tags 市场趋势分析-竞争格局数据查询
   * @name productTaskMarketPatternList
   * @request POST:/cirpoint-demand-api/product-plan-marke-pattern/list
   * @secure
   */
  static productTaskMarketPatternList = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-marke-pattern/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 市场趋势分析-竞争格局数据添加修改
   *
   * @tags 市场趋势分析-竞争格局数据添加修改
   * @name productTaskMarketTrendAndPatternAddOrUpdate
   * @request /cirpoint-demand-api/product-plan-market-trend/productTaskMarketTrendAndPatternAddOrUpdate
   * @secure
   */
  static productTaskMarketTrendAndPatternAddOrUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/productTaskMarketTrendAndPatternAddOrUpdate`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-市场趋势分析图表数据
   *
   * @tags 市场趋势分析-市场趋势分析图表数据
   * @name getTaskMarketTrendChartData
   * @request POST:/cirpoint-demand-api/product-plan-market-trend/getTaskMarketTrendChartData
   * @secure
   */
  static getTaskMarketTrendChartData = <Req extends { taskId: number } = { taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/getTaskMarketTrendChartData`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-公司高层调研
   *
   * @tags 管理后台 - 公司高层调研添加随笔记录
   * @name productPlanTaskDetailUpdate
   * @summary 公司高层调研添加随笔记录
   * @request POST:/cirpoint-demand-api/product-plan-essay/create
   * @secure
   */
  static productPlanEssayCreate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-公司高层调研获取随手笔录
   *
   * @tags 管理后台 - 公司高层调研获取随手笔录
   * @name getPlanEssayByTaskId
   * @summary 公司高层调研获取随手笔录
   * @request POST:/cirpoint-demand-api/product-plan-essay/getPlanEssayByTaskId
   * @secure
   */
  static getPlanEssayByTaskId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/getPlanEssayByTaskId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除随笔记录信息
   *
   * @tags 产品规划-删除随笔记录信息
   * @name deletePlanEssay
   * @request /cirpoint-demand-api/product-plan-essay/delete
   * @secure
   */
  static deletePlanEssay = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-公司高层调研保存附件信息接口
   *
   * @tags 管理后台 - 公司高层调研保存附件信息接口
   * @name keepTaskInfo
   * @summary 公司高层调研保存附件信息接口
   * @request POST:/cirpoint-demand-api/product-plan-essay/keepTaskInfo
   * @secure
   */
  static keepTaskInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/keepTaskInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-获取过程文件通用接口
   *
   * @tags 管理后台 - 获取过程文件通用接口
   * @name getTaskGcFileInfo
   * @summary 获取过程文件通用接口
   * @request POST:/cirpoint-demand-api/product-plan-essay/getTaskGcFileInfo
   * @secure
   */
  static getTaskGcFileInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/getTaskGcFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-获取最终交付物文件通用接口
   *
   * @tags 管理后台 - 获取最终交付物文件通用接口
   * @name getTaskDeliverablesFileInfo
   * @summary 获取最终交付物文件通用接口
   * @request POST:/cirpoint-demand-api/product-plan-essay/getTaskDeliverablesFileInfo
   * @secure
   */
  static getTaskDeliverablesFileInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/getTaskDeliverablesFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-获取产品规划文件信息
   *
   * @tags 管理后台 - 获取产品规划文件信息
   * @name getProductPlanFileInfo
   * @summary 获取产品规划文件信息
   * @request POST:/cirpoint-demand-api/product-plan-essay/getProductPlanFileInfo
   * @secure
   */
  static getProductPlanFileInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/getProductPlanFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-获取历史版本信息文件
   *
   * @tags 管理后台 - 获取历史版本信息文件
   * @name getDeliverablesAffFileInfo
   * @summary 获取历史版本信息文件
   * @request POST:/cirpoint-demand-api/product-plan-essay/getDeliverablesAffFileInfo
   * @secure
   */
  static getDeliverablesAffFileInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/getDeliverablesAffFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-保存规划回顾分析文件信息
   *
   * @tags 管理后台 - 保存规划回顾分析文件信息
   * @name keepTaskFileInfo
   * @summary 保存规划回顾分析文件信息
   * @request POST:/cirpoint-demand-api/product-plan-essay/keepTaskFileInfo
   * @secure
   */
  static keepTaskFileInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-essay/keepTaskFileInfo`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-用户痛点分析列表
   *
   * @tags 管理后台 - 用户痛点分析列表
   * @name painPointList
   * @summary 用户痛点分析列表
   * @request POST:/cirpoint-demand-api/product-plan-pain-point/list
   * @secure
   */
  static painPointList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-创建用户痛点分析
   *
   * @tags 管理后台 - 创建用户痛点分析
   * @name painPointcreate
   * @summary 创建用户痛点分析
   * @request POST:/cirpoint-demand-api/product-plan-pain-point/create
   * @secure
   */
  static painPointCreate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品规划设计-创建用户痛点分析
   *
   * @tags 管理后台 - 创建用户痛点分析
   * @name painPointUpdate
   * @summary 创建用户痛点分析
   * @request POST:/cirpoint-demand-api/product-plan-pain-point/update
   * @secure
   */
  static painPointUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除用户痛点分析
   *
   * @tags 产品规划-删除用户痛点分析
   * @name painPointDelete
   * @request /cirpoint-demand-api/product-plan-pain-point/delete
   * @secure
   */
  static painPointDelete = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 规划法律法规接口
   *
   * @tags 产品规划-规划法律法规列表初始化
   * @name planLawList
   * @request /cirpoint-demand-api/product-plan-law/list
   * @secure
   */
  static planLawList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 规划法律法规接口
   *
   * @tags 产品规划-规划法律法规添加
   * @name planLawCreate
   * @request /cirpoint-demand-api/product-plan-law/create
   * @secure
   */
  static planLawCreate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 规划法律法规接口
   *
   * @tags 产品规划-规划法律法规修改
   * @name planLawCreate
   * @request /cirpoint-demand-api/product-plan-law/update
   * @secure
   */
  static planLawUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 规划法律法规接口
   *
   * @tags 产品规划-删除规划法律法规接口
   * @name painLawDelete
   * @request /cirpoint-demand-api/product-plan-pain-law/delete
   * @secure
   */
  static painLawDelete = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 外购部件接口
   *
   * @tags 产品规划-外购部件接口添加
   * @name purChasedCreate
   * @request /cirpoint-demand-api/product-plan-purchased-parts/create
   * @secure
   */
  static purChasedCreate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 外购部件接口
   *
   * @tags 产品规划-外购部件接口编辑
   * @name purChasedUpdate
   * @request /cirpoint-demand-api/product-plan-purchased-parts/update
   * @secure
   */
  static purChasedUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 外购部件接口
   *
   * @tags 产品规划-外购部件接口删除接口
   * @name purachasedDelete
   * @request /cirpoint-demand-api/product-plan-purchased-parts/delete
   * @secure
   */
  static purachasedDelete = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 外部件接口信息
   *
   * @tags 产品规划-外部件接口信息列表初始化
   * @name purchasedList
   * @request /cirpoint-demand-api/product-plan-purchased-parts/list
   * @secure
   */
  static purchasedList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口添加
   * @name purChasedCreate
   * @request /cirpoint-demand-api/product-plan-combination/create
   * @secure
   */
  static combinationCreate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口编辑
   * @name combinationUpdate
   * @request /cirpoint-demand-api/product-plan-combination/update
   * @secure
   */
  static combinationUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口删除接口
   * @name combinationDelete
   * @request /cirpoint-demand-api/product-plan-purchased-parts/delete
   * @secure
   */
  static combinationDelete = <Req extends { id: number } = { id: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口列表初始化
   * @name combinationList
   * @request /cirpoint-demand-api/product-plan-combination/list
   * @secure
   */
  static combinationList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口提交审核接口
   * @name combinationSubmitExamine
   * @request /cirpoint-demand-api/product-plan-combination/submitExamine
   * @secure
   */
  static combinationSubmitExamine = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/submitExamine`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单接口
   *
   * @tags 产品规划-产品组合清单接口获取审核状态接口
   * @name combinationgetExamineStatus
   * @request /cirpoint-demand-api/product-plan-combination/getExamineStatus
   * @secure
   */
  static combinationgetExamineStatus = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/getExamineStatus`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品组合清单评审详细数据接口
   *
   * @tags 产品规划-获取产品组合清单评审详细数据接口
   * @name getproductPlanCombinationRequestDTO
   * @request /cirpoint-demand-api/product-plan-combination/getproductPlanCombinationRequestDTO
   * @secure
   */
  static getproductPlanCombinationRequestDTO = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/getproductPlanCombinationRequestDTO`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取更改产品组合清单的团队成员接口
   *
   * @tags 产品规划-获取更改产品组合清单的团队成员接口
   * @name updatePlanTeamUserId
   * @request /cirpoint-demand-api/product-plan-combination/updatePlanTeamUserId
   * @secure
   */
  static updatePlanTeamUserId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/updatePlanTeamUserId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品组合清单评审详细数据接口
   *
   * @tags 产品规划-获取产品组合清单评审详细数据接口
   * @name getpriviewDTO
   * @request /cirpoint-demand-api/product-plan-combination/getpriviewDTO
   * @secure
   */
  static getpriviewDTO = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/getpriviewDTO`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合清单评审保存/提交功能
   *
   * @tags 产品规划-产品组合清单评审保存/提交功能
   * @name updateProvePlanTeamUserId
   * @request /cirpoint-demand-api/product-plan-combination/updateProvePlanTeamUserId
   * @secure
   */
  static updateProvePlanTeamUserId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/updateProvePlanTeamUserId`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品规划列表
   *
   * @tags 获取产品规划列表
   * @name getProductPlanDemandList
   * @request /cirpoint-demand-api/demand-master/getProductPlanDemandList
   * @secure
   */
  static getProductPlanDemandList = <Req extends { planId: number } = { planId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/getProductPlanDemandList`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存产品规划需求列表关联
   *
   * @tags 保存产品规划需求列表关联
   * @name saveProductPlanDemandLink
   * @request /cirpoint-demand-api/product-plan-combination/saveProductPlanDemandLink
   * @secure
   */
  static saveProductPlanDemandLink = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/demand-master/saveProductPlanDemandLink`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品组合策略列表
   *
   * @tags 获取产品组合策略列表
   * @name combinationStrategyList
   * @request /cirpoint-demand-api/product-plan-combination-strategy/list
   * @secure
   */
  static combinationStrategyList = <
    Req extends { taskId: number; planId: number; type: string } = {
      taskId: number;
      planId: number;
      type: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/list`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据平台名称获取产品列表
   *
   * @tags 根据平台名称获取产品列表
   * @name getProductByPlatformName
   * @request /cirpoint-demand-api/product-plan-combination-strategy/getProductByPlatformName
   * @secure
   */
  static getProductByPlatformName = <Req extends { platformNames: string } = { platformNames: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/getProductByPlatformName`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 更新产品组合策略
   *
   * @tags 更新产品组合策略
   * @name strategyUpdate
   * @request /cirpoint-demand-api/product-plan-combination-strategy/update
   * @secure
   */
  static strategyUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据平台名称获取产品列表
   *
   * @tags 根据平台名称获取产品列表
   * @name getAllStrategyDetail
   * @request /cirpoint-demand-api/product-plan-combination-strategy/getAllStrategyDetail
   * @secure
   */
  static getAllStrategyDetail = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/getAllStrategyDetail`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 整体投资策略更新
   *
   * @tags 整体投资策略更新
   * @name updateAllStrategy
   * @request /cirpoint-demand-api/product-plan-combination-strategy/updateAllStrategy
   * @secure
   */
  static updateAllStrategy = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/updateAllStrategy`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品组合策略评审结论详细
   *
   * @tags 产品组合策略评审结论详细
   * @name getStrategyConclusion
   * @request /cirpoint-demand-api/product-plan-combination-strategy/getStrategyConclusion
   * @secure
   */
  static getStrategyConclusion = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/getStrategyConclusion`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存产品组合策略评审结论
   *
   * @tags 保存产品组合策略评审结论
   * @name saveStrategyConclusion
   * @request /cirpoint-demand-api/product-plan-combination-strategy/saveStrategyConclusion
   * @secure
   */
  static saveStrategyConclusion = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/saveStrategyConclusion`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name excelExport
   * @summary Excel导出功能
   * @request POST:/cirpoint-demand-api/product-plan-combination-strategy/export
   * @secure
   */
  static excelExport = <
    Req extends { planId: number; type: String } = {
      planId: number;
      type: String;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination-strategy/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品规划报告编制文件信息
   *
   * @tags 获取产品规划报告编制文件信息
   * @name getPlanReportFileInfo
   * @request /cirpoint-demand-api/product-plan-conclusion/getPlanReportFileInfo
   * @secure
   */
  static getPlanReportFileInfo = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-conclusion/getPlanReportFileInfo`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 规划报告评审详细
   *
   * @tags 规划报告评审详细
   * @name getPlanReportConclusion
   * @request /cirpoint-demand-api/product-plan-conclusion/getPlanReportConclusion
   * @secure
   */
  static getPlanReportConclusion = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-conclusion/getPlanReportConclusion`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存规划报告评审
   *
   * @tags 保存规划报告评审
   * @name savePlanReportConclusion
   * @request /cirpoint-demand-api/product-plan-conclusion/savePlanReportConclusion
   * @secure
   */
  static savePlanReportConclusion = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-conclusion/savePlanReportConclusion`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存规划报告编制文件信息
   *
   * @tags 保存规划报告编制文件信息
   * @name savePlanReportFileInfoS
   * @request /cirpoint-demand-api/product-plan-conclusion/savePlanReportFileInfoS
   * @secure
   */
  static savePlanReportFileInfoS = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-conclusion/savePlanReportFileInfoS`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取路标规划列表
   *
   * @tags 获取路标规划列表
   * @name signList
   * @request /cirpoint-demand-api/product-plan-road-sign/list
   * @secure
   */
  static signList = <Req extends { planId: string } = { planId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/list`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取路标规划主题详情
   *
   * @tags 获取路标规划主题详情
   * @name getRoadSignThemeDetail
   * @request /cirpoint-demand-api/product-plan-road-sign/list
   * @secure
   */
  static getRoadSignThemeDetail = <Req extends { combinationId: string } = { combinationId: string }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/getRoadSignThemeDetail`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存路标规划主题
   *
   * @tags 保存路标规划主题
   * @name saveRoadSignTheme
   * @request /cirpoint-demand-api/product-plan-road-sign/saveRoadSignTheme
   * @secure
   */
  static saveRoadSignTheme = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/saveRoadSignTheme`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 设置路标时间
   *
   * @tags 设置路标时间
   * @name saveRoadSignRange
   * @request /cirpoint-demand-api/product-plan-road-sign/saveRoadSignRange
   * @secure
   */
  static saveRoadSignRange = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/saveRoadSignRange`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取路标规划主题详情
   *
   * @tags 获取路标规划主题详情
   * @name roadSignThemeCarList
   * @request /cirpoint-demand-api/product-plan-road-sign/roadSignThemeCarList
   * @secure
   */
  static roadSignThemeCarList = <
    Req extends {
      planId: number;
      productPlatformId: number;
      productName: String;
      year: number;
    } = {
      planId: number;
      productPlatformId: number;
      productName: String;
      year: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/roadSignThemeCarList`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * Excel导出功能
   *
   * @tags 管理后台 - Excel导出功能
   * @name signExcelExport
   * @summary Excel导出功能
   * @request POST:/cirpoint-demand-api/product-plan-road-sign/signExcelExport
   * @secure
   */
  static signExcelExport = <
    Req extends { planId: number; type: String } = {
      planId: number;
      type: String;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-road-sign/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取产品计划列表
   *
   * @tags 获取产品计划列表
   * @name customizationList
   * @request /cirpoint-demand-api/product-plan-customization/list
   * @secure
   */
  static customizationList = <
    Req extends { planId: number; taskId: number } = {
      planId: number;
      taskId: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/list`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 更新产品计划
   *
   * @tags 更新产品计划
   * @name customizationUpdate
   * @request /cirpoint-demand-api/product-plan-customization/update
   * @secure
   */
  static customizationUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 获取研发投资预算列表
   *
   * @tags 获取研发投资预算列表
   * @name budgetList
   * @request /cirpoint-demand-api/product-plan-investmen-budget/list
   * @secure
   */
  static budgetList = <
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
        path: `/cirpoint-demand-api/product-plan-investmen-budget/list`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 更新研发投资预算
   *
   * @tags 更新研发投资预算
   * @name budgetUpdate
   * @request /cirpoint-demand-api/product-plan-investmen-budget/update
   * @secure
   */
  static budgetUpdate = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-investmen-budget/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 下载模板
   *
   * @tags 管理后台 - 下载模板
   * @name budgetExcelTemplate
   * @summary 下载模板
   * @request POST:/cirpoint-demand-api/product-plan-investmen-budget/download
   * @secure
   */
  static budgetExcelTemplate = <
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
        path: `/cirpoint-demand-api/product-plan-investmen-budget/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出
   *
   * @tags 管理后台 - 导出
   * @name budgetExcelExport
   * @summary 导出
   * @request POST:/cirpoint-demand-api/product-plan-investmen-budget/export
   * @secure
   */
  static budgetExcelExport = <
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
        path: `/cirpoint-demand-api/product-plan-investmen-budget/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-investmen-budget/import?planId=${data.data.planId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 获取通用模板文件
   *
   * @tags 获取研发投资预算列表
   * @name getTemplateFile
   * @request /cirpoint-demand-api/product-plan-file/list
   * @secure
   */
  static getTemplateFile = <Req extends { fileType: number } = { fileType: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/getTemplateFile`,
        method: 'GET',
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 下载模板
   *
   * @tags 管理后台 - 下载模板
   * @name tableExcelTemplate
   * @summary 下载模板
   * @request POST:/cirpoint-demand-api/product-plan-dynamic-table/download
   * @secure
   */
  static tableExcelTemplate = <
    Req extends {
      taskId: number;
      type: String;
      fileName: String;
      template: boolean;
    } = { taskId: number; type: String; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-dynamic-table/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 技术趋势导出
   *
   * @tags 管理后台 - 技术趋势导出
   * @name tableExcelExport
   * @summary 技术趋势导出
   * @request POST:/cirpoint-demand-api/product-plan-dynamic-table/export
   * @secure
   */
  static tableExcelExport = <
    Req extends {
      taskId: number;
      type: String;
      fileName: String;
      template: boolean;
    } = { taskId: number; type: String; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-dynamic-table/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  static tableExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-dynamic-table/import?taskId=${data.data.taskId}&type=${data.data.type}&`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 市场趋势下载模板
   *
   * @tags 管理后台 - 市场趋势下载模板
   * @name trendExcelTemplate
   * @summary 下载模板
   * @request POST:/cirpoint-demand-api/product-plan-market-trend/download
   * @secure
   */
  static trendExcelTemplate = <
    Req extends {
      id: number;
      taskId: number;
      planId: number;
      planName: String;
      fileName: String;
      template: boolean;
    } = {
      id: number;
      taskId: number;
      planId: number;
      planName: String;
      fileName: String;
      template: boolean;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 市场趋势导出功能
   *
   * @tags 管理后台 - 市场趋势导出功能
   * @name trendExcelExport
   * @summary 下载模板
   * @request POST:/cirpoint-demand-api/product-plan-market-trend/export
   * @secure
   */
  static trendExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      planId: number;
      planName: String;
      fileName: String;
      template: boolean;
    } = {
      id: number;
      taskId: number;
      planId: number;
      planName: String;
      fileName: String;
      template: boolean;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入市场趋势
  static trendExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/import?taskId=${data.data.taskId}&planId=${data.data.planId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 竞争格局模板下载
   *
   * @tags 管理后台 - 竞争格局模板下载
   * @name patternExcelTemplate
   * @summary 竞争格局模板下载
   * @request POST:/cirpoint-demand-api/product-plan-marke-pattern/download
   * @secure
   */
  static patternExcelTemplate = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-marke-pattern/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 市场根据导出功能
   *
   * @tags 管理后台 - 市场根据导出功能
   * @name patternExcelExport
   * @summary 市场根据导出功能
   * @request POST:/cirpoint-demand-api/product-plan-market-pattern/export
   * @secure
   */
  static patternExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-marke-pattern/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入市场格局
  static patternExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-marke-pattern/import?taskId=${data.data.taskId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 用户痛点分析模板下载
   *
   * @tags 管理后台 - 用户痛点分析模板下载
   * @name pointExcelTemplate
   * @summary 用户痛点分析模板下载
   * @request POST:/cirpoint-demand-api/product-plan-pain-point/download
   * @secure
   */
  static pointExcelTemplate = <Req extends { id: number; taskId: number } = { id: number; taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 用户痛点分析导出
   *
   * @tags 管理后台 - 用户痛点分析导出
   * @name pointExcelExport
   * @summary 用户痛点分析导出
   * @request POST:/cirpoint-demand-api/product-plan-pain-point/export
   * @secure
   */
  static pointExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入(痛点分析)
  static pointExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-pain-point/import?taskId=${data.data.taskId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 下载模板(规划法律法规)
   *
   * @tags 管理后台 - 下载模板(规划法律法规)
   * @name lawExcelTemplate
   * @summary 下载模板(规划法律法规)
   * @request POST:/cirpoint-demand-api/product-plan-law/download
   * @secure
   */
  static lawExcelTemplate = <Req extends { id: number; taskId: number } = { id: number; taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 导出(规划法律法规)
   *
   * @tags 管理后台 - 导出(规划法律法规)
   * @name lawExcelExport
   * @summary 导出(规划法律法规)
   * @request POST:/cirpoint-demand-api/product-plan-pain-law/export
   * @secure
   */
  static lawExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入(规划法律法规)
  static lawExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-law/import?taskId=${data.data.taskId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 下载模板(外购件分析)
   *
   * @tags 管理后台 - 下载模板(外购件分析)
   * @name partsExcelTemplate
   * @summary 下载模板(外购件分析)
   * @request POST:/cirpoint-demand-api/product-plan-parts/download
   * @secure
   */
  static partsExcelTemplate = <Req extends { id: number; taskId: number } = { id: number; taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 导出(外购件分析)
   *
   * @tags 管理后台 - 导出(外购件分析)
   * @name partsExcelExport
   * @summary 导出(外购件分析)
   * @request POST:/cirpoint-demand-api/product-plan-pain-parts/export
   * @secure
   */
  static partsExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入(外购件分析)
  static partsExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-purchased-parts/import?taskId=${data.data.taskId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 下载模板(产品组合清单)
   *
   * @tags 管理后台 - 下载模板(产品组合清单)
   * @name combinationExcelTemplate
   * @summary 下载模板(产品组合清单)
   * @request POST:/cirpoint-demand-api/product-plan-combination/download
   * @secure
   */
  static combinationExcelTemplate = <Req extends { id: number; taskId: number } = { id: number; taskId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 导出(产品组合清单)
   *
   * @tags 管理后台 - 导出(产品组合清单)
   * @name combinationExcelExport
   * @summary 导出(产品组合清单)
   * @request POST:/cirpoint-demand-api/product-plan-combination/export
   * @secure
   */
  static combinationExcelExport = <
    Req extends {
      id: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { id: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入(产品组合清单)
  static combinationExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-combination/import?taskId=${data.data.taskId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 下载模板(产品开发计划)
   *
   * @tags 管理后台 - 下载模板(产品开发计划)
   * @name customizationExcelTemplate
   * @summary 下载模板(产品开发计划)
   * @request POST:/cirpoint-demand-api/product-plan-customization/download
   * @secure
   */
  static customizationExcelTemplate = <
    Req extends { planId: number; taskId: number } = {
      planId: number;
      taskId: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/download`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 导出(产品开发计划)
   *
   * @tags 管理后台 - 导出(产品开发计划)
   * @name customizationExcelExport
   * @summary 导出(产品开发计划)
   * @request POST:/cirpoint-demand-api/product-plan-combination/export
   * @secure
   */
  static customizationExcelExport = <
    Req extends {
      planId: number;
      taskId: number;
      fileName: String;
      template: boolean;
    } = { planId: number; taskId: number; fileName: String; template: boolean },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  //导入(产品开发计划)
  static customizationExcelImport = <
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
    httpClient.request<ProdPositionInfoRequestDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/import?taskId=${data.data.taskId}&planId=${data.data.planId}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      ProdPositionInfoRequestDTOModel
    );

  /**
   * 导出战略目标分解列表
   *
   * @tags 管理后台 - 导出战略目标分解列表
   * @name bre导出战略目标分解列表
   * @request POST:/cirpoint-demand-api/product-plan-goal-breakdowns/export
   * @secure
   */
  static breakdownsExcelExport = <
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
        path: `/cirpoint-demand-api/product-plan-goal-breakdowns/export`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 导出产品规划-需求分发列表
   *
   * @tags 管理后台 - 导出产品规划-需求分发列表
   * @name productPlanDemandExport
   * @request POST:/cirpoint-demand-api/demand-master/productPlanDemandExport
   * @secure
   */
  static productPlanDemandExport = <
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
        path: `/cirpoint-demand-api/demand-master/productPlanDemandExport`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存导出文件
   *
   * @tags 保存导出文件
   * @name fileSaveExportFile
   * @request /cirpoint-demand-api/product-plan-file/saveExportFile
   * @secure
   */
  static fileSaveExportFile = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/saveExportFile`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据类型和任务id获取模板文件
   *
   * @tags 根据类型和任务id获取模板文件
   * @name getTemplateFileByTaskId
   * @request POST:/cirpoint-demand-api/product-plan-file/getTemplateFileByTaskId
   * @secure
   */
  static getTemplateFileByTaskId = <
    Req extends { taskId: number; fileType: number } = {
      taskId: number;
      fileType: number;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/getTemplateFileByTaskId`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 生成产品规划报告
   *
   * @tags  生成产品规划报告
   * @name generateReport
   * @summary 生成产品规划报告
   * @request POST:/cirpoint-demand-api/product-plan/generateReport
   * @secure
   */
  static generateReport = <Req extends { planId: number } = { planId: number }>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan/generateReport`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步市场趋势列表
   *
   * @tags 同步市场趋势列表
   * @name syncList
   * @request /product-plan-market-trend/syncList
   * @secure
   */
  static syncList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-market-trend/syncList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 同步产品开发列表
   *
   * @tags 同步产品开发列表
   * @name productDevelopmentsyncList
   * @request /product-plan-customization/syncList
   * @secure
   */
  static productDevelopmentsyncList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-customization/syncList`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 保存产品规划文件（非版本文件）
   *
   * @tags 保存产品规划文件（非版本文件）
   * @name saveProductPlanFileBatch
   * @request /product-plan-file/saveProductPlanFileBatch
   * @secure
   */
  static saveProductPlanFileBatch = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-file/saveProductPlanFileBatch`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * AI集成分析
   *
   * @tags AI集成分析
   * @name aiAnalytics
   * @request /product-plan-task/aiAnalytics
   * @secure
   */
  static aiAnalytics = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/product-plan-task/aiAnalytics`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
