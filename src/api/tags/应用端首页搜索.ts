// import {
//   OpenApiActions,
//   type OpenApiTag,
// } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';

import {
  CommonAllResultPOModel,
  CommonApplyResultPOModel,
  CommonReplaceResultPOModel,
  CommonResultPOModel,
  CommonResultPOModel2,
} from '../models/searchCategory/belt/CommonResultPOModel';
import { BeltPOModel } from '../models/searchCategory/belt/BeltPOModel';
import {
  RequestDTOModel,
  SeniorRequestDTOModel,
  searchPartRequestDTOModel,
  HotSearchTermRequestDTOModel,
  RequestSearchDTOModel,
  AllRequestDTOModel,
  ApplyRequestDTOModel,
  ReplaceRequestDTOModel,
  tipsRequestDTOModel,
} from '../models/searchCategory/belt/RequestDTOModel';
import qs from 'qs';

/**
 * 应用端 首页搜索
 */
export class AdminApiAppHomeSearch {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `应用端首页搜索`;

  /**
   * 首页 常用-皮带 搜索
   *
   * @tags 前端 - 常用-皮带
   * @name getBeltSearchList
   * @summary 常用-皮带  查询搜索列表
   * @request GET:/business-api/business/pdm-belt/list
   * @secure
   */
  static getBeltSearchList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/pdm-belt/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页 常用-节温器 搜索
   *
   * @tags 前端 - 常用-节温器
   * @name getThermostatSearchList
   * @summary 常用-节温器  查询搜索列表
   * @request GET:/business-api/business/pdm-thermostat/list
   * @secure
   */
  static getThermostatSearchList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/pdm-thermostat/list`,
        method: 'GET',
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
        // 对象序列化
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      },
      CommonResultPOModel
    );

  /**
   * 首页 常用-空气滤清器 搜索
   *
   * @tags 前端 - 常用-空气滤清器
   * @name getFilterSearchList
   * @summary 常用-空气滤清器  查询搜索列表
   * @request GET:/business-api/business/pdm-airfilter/list
   * @secure
   */
  static getFilterSearchList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/pdm-airfilter/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  搜索历史记录
   *
   * @tags 前端 - 搜索历史记录
   * @name getSearchHistoryList
   * @summary 常用-搜索历史记录  查询搜索列表
   * @request GET:/business-api/business/pdm-airfilter/list
   * @secure
   */
  static getSearchHistoryList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-history/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  创建历史记录
   *
   * @tags 前端 - 搜索历史记录
   * @name createSearchHistory
   * @summary 常用-搜索历史记录  查询搜索列表
   * @request GET:/business-api/business/pdm-airfilter/list
   * @secure
   */
  static createSearchHistory = <Req extends RequestSearchDTOModel = RequestSearchDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-history/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  删除历史记录
   *
   * @tags 前端 - 删除历史记录
   * @name deleteSearchHistory
   * @summary 常用-删除历史记录  查询搜索列表
   * @request GET:/business-api/business/search-history/delete
   * @secure
   */
  static deleteSearchHistory = <
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
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-history/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  使用保养说明书
   *
   * @tags 前端 - 使用保养说明书
   * @name searchUseMaintenanceManualPage
   * @summary 常用-使用保养说明书
   * @request POST:/business-api/business/search/searchUseMaintenanceManualPage
   * @secure
   */
  static searchUseMaintenanceManualPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchUseMaintenanceManualPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  专用工具
   *
   * @tags 前端 - 专用工具
   * @name searchSpecialToolsPage
   * @summary 常用-专用工具
   * @request POST:/business-api/business/search/searchSpecialToolsPage
   * @secure
   */
  static searchSpecialToolsPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchSpecialToolsPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  维修手册
   *
   * @tags 前端 - 维修手册
   * @name searchServiceManualPage
   * @summary 常用-维修手册
   * @request POST:/business-api/business/search/searchServiceManualPage
   * @secure
   */
  static searchServiceManualPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchServiceManualPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  修理包
   *
   * @tags 前端 - 修理包
   * @name searchRepairKitPage
   * @summary 常用-修理包
   * @request POST:/business-api/business/search/searchRepairKitPage
   * @secure
   */
  static searchRepairKitPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchRepairKitPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  保养套餐
   *
   * @tags 前端 - 保养套餐
   * @name searchMaintenancePackagePage
   * @summary 常用-保养套餐
   * @request POST:/business-api/business/search/searchMaintenancePackagePage
   * @secure
   */
  static searchMaintenancePackagePage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchMaintenancePackagePage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  整机
   *
   * @tags 前端 - 整机
   * @name searchOrderNumberPage
   * @summary 常用-整机
   * @request POST:/business/search/searchMachinePage
   * @secure
   */
  static searchOrderNumberPage = <Req extends SeniorRequestDTOModel = SeniorRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business/search/searchMachinePage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  机型
   *
   * @tags 前端  机型
   * @name searchOrderNumberPage
   * @summary 常用-机型
   * @request POST:/business/search/searchModelPage
   * @secure
   */
  static searchModelPage = <Req extends SeniorRequestDTOModel = SeniorRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business/search/searchModelPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );
  /**
   * 首页  零件信息
   *
   * @tags 前端 - 零件信息
   * @name searchOrderNumberPage
   * @summary 常用-零件信息
   * @request POST:/part/searchPartList
   * @secure
   */
  static searchPartList = <Req extends searchPartRequestDTOModel = searchPartRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/part/searchPartList`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  心组件
   *
   * @tags 前端 - 心组件
   * @name searchHeartComponentPage
   * @summary 常用-心组件
   * @request POST:/business-api/business/search/searchHeartComponentPage
   * @secure
   */
  static searchHeartComponentPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchHeartComponentPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  ECU针脚图
   *
   * @tags 前端 - ECU针脚图
   * @name searchEcuPinDiagramPage
   * @summary 常用-ECU针脚图
   * @request POST:/business-api/business/search/searchEcuPinDiagramPage
   * @secure
   */
  static searchEcuPinDiagramPage = <Req extends RequestDTOModel = RequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search/searchEcuPinDiagramPage`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  关键字检索
   *
   * @tags 前端 - 关键字检索
   * @name searchAll
   * @summary 常用-关键字检索
   * @request POST:/business-api/business/search/searchAll
   * @secure
   */
  static searchAll = <Req extends AllRequestDTOModel = AllRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonAllResultPOModel, any>(
      {
        path: `/business-api/business/search/searchAll`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonAllResultPOModel
    );

  /**
   * 首页  检索提示列表
   *
   * @tags 前端 - 检索提示列表
   * @name searchTipsList
   * @summary 常用-检索提示列表
   * @request POST:/business/search/indexSearch
   * @secure
   */
  static searchTipsList = <Req extends RequestDTOModel = RequestDTOModel>(Req: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business/search/indexSearch`,
        method: 'GET',
        query: Req,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  搜索条件保存
   *
   * @tags 前端 - 搜索条件保存
   * @name createCondition
   * @summary 常用-搜索条件保存
   * @request GET:/business-api/business/search-saved/create
   * @secure
   */
  static createCondition = <Req extends RequestSearchDTOModel = RequestSearchDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-saved/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  搜索条件列表
   *
   * @tags 前端 - 搜索条件列表
   * @name getConditionList
   * @summary 常用-搜索条件列表   查询搜索列表
   * @request GET:/business-api/business/pdm-airfilter/list
   * @secure
   */
  static getConditionList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-saved/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  搜索范围列表
   *
   * @tags 前端 - 搜索范围列表
   * @name getSearchRange
   * @summary 常用-搜索范围列表
   * @request GET:/business-api/business/search/getSearchRange
   * @secure
   */
  static getSearchRange = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel2, any>(
      {
        path: `/business-api/business/search/getSearchRange`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel2
    );

  /**
   * 首页  删除保存条件
   *
   * @tags 前端 - 删除保存条件
   * @name deleteCondition
   * @summary 常用-删除保存条件
   * @request GET:/business/search-saved/delete
   * @secure
   */
  static deleteCondition = <
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
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/search-saved/delete`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  热搜词列表
   *
   * @tags 前端 - 热搜词列表
   * @name getSearchRange
   * @summary 常用-热搜词列表
   * @request GET:/business/hot-word/list
   * @secure
   */
  static getHotWordList = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business/hot-word/list`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  热搜词添加
   *
   * @tags 前端 - 热搜词添加
   * @name createHotSearchTerm
   * @summary 常用-热搜词添加
   * @request POST:/business-api/business/hot-word/create
   * @secure
   */
  static createHotSearchTerm = <Req extends HotSearchTermRequestDTOModel = HotSearchTermRequestDTOModel>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/hot-word/create`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  替换关系
   *
   * @tags 前端 - 替换关系
   * @name getSearchRange
   * @summary 常用-替换关系
   * @request GET:/spare-replace-group/allReplacePage
   * @secure
   */
  static getSearchReplace = <Req extends RequestDTOModel = RequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/spare-replace-group/allReplacePage`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  适用订货号查询
   *
   * @tags 前端 - 适用订货号查询
   * @name getSearchRange
   * @summary 常用-适用订货号查询
   * @request GET:/part/getPartNodePage
   * @secure
   */
  static getFindRootNode = <Req extends ApplyRequestDTOModel = ApplyRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonApplyResultPOModel, any>(
      {
        path: `/part/getPartNodePage`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonApplyResultPOModel
    );

  /**
   * 首页  替换关系详情查询
   *
   * @tags 前端 - 替换关系详情查询
   * @name getSearchRange
   * @summary 常用-替换关系详情查询
   * @request GET:/spare-replace-group/getDetail
   * @secure
   */
  static getReplaceDetail = <Req extends ReplaceRequestDTOModel = ReplaceRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonReplaceResultPOModel, any>(
      {
        path: `/spare-replace-group/getDetail`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonReplaceResultPOModel
    );

  /**
   * 首页  主页检索历史记录
   *
   * @tags 前端 - 主页检索历史记录
   * @name searchTipsList
   * @summary 常用-主页检索历史记录
   * @request /business/search/indexSearchRecordList
   * @secure
   */
  static searchTipsRecordList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business/search/indexSearchRecordList`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );

  /**
   * 首页  根据partid查询零件信息
   *
   * @tags 前端 - 根据partid查询零件信息
   * @name getPartDetailById
   * @summary 常用-
   * @request POST:/business-api/business/part/getPartDetailById
   * @secure
   */
  static getPartDetailById = <Req extends { partId: string } = { partId: string }>(data: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultPOModel, any>(
      {
        path: `/business-api/business/part/getPartDetailById`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      CommonResultPOModel
    );
}

/**
 * 记录当前 `tag` 下所有接口的请求参数和返回值的 `JSON Schema` / `UI Schema` / `Model Class` 等信息
 * @description 用于代码生成
 */
// export const $tag: OpenApiTag<typeof AdminApiAppHomeSearch> = {
//   api: {
//     getBeltSearchList: {
//       path: '/business-api/business/pdm-belt/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getThermostatSearchList: {
//       path: '/business-api/business/pdm-thermostat/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getFilterSearchList: {
//       path: '/business-api/business/pdm-airfilter/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getSearchHistoryList: {
//       path: '/business-api/business/search-history/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     createSearchHistory: {
//       path: '/business-api/business/search-history/create',
//       method: 'POST',
//       type: OpenApiActions.create,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     deleteSearchHistory: {
//       path: '/business-api/business/search-history/delete',
//       method: 'DELETE',
//       type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     searchUseMaintenanceManualPage: {
//       path: '/business-api/business/search/searchUseMaintenanceManualPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchSpecialToolsPage: {
//       path: '/business-api//business/search/searchSpecialToolsPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchServiceManualPage: {
//       path: '/business-api//business/search/searchServiceManualPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchRepairKitPage: {
//       path: '/business-api//business/search/searchRepairKitPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchOrderNumberPage: {
//       path: '/business-api//business/search/searchOrderNumberPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: SeniorRequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchMaintenancePackagePage: {
//       path: '/business-api//business/search/searchMaintenancePackagePage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchHeartComponentPage: {
//       path: '/business-api//business/search/searchHeartComponentPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchEcuPinDiagramPage: {
//       path: '/business-api//business/search/searchEcuPinDiagramPage',
//       method: 'POST',
//       type: OpenApiActions.page,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchAll: {
//       path: '/business-api//business/search/searchAll',
//       method: 'POST',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchTipsList: {
//       path: '/business/search/indexSearch',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     createCondition: {
//       path: '/business-api/business/search-saved/create',
//       method: 'POST',
//       type: OpenApiActions.create,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getConditionList: {
//       path: '/business-api/business-api/business/search-saved/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getSearchRange: {
//       path: '/business-api/business/search/getSearchRange',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel2,
//       responseDataModel: BeltPOModel,
//     },

//     deleteCondition: {
//       path: '/business-api/business/search-saved/delete',
//       method: 'DELETE',
//       type: OpenApiActions.delete,
//       paramModel: undefined,
//       responseModel: undefined,
//       responseDataModel: undefined,
//     },

//     getHotWordList: {
//       path: '/business/hot-word/list',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel2,
//       responseDataModel: BeltPOModel,
//     },

//     createHotSearchTerm: {
//       path: '/business-api/business-api/business/hot-word/create',
//       method: 'POST',
//       type: OpenApiActions.create,
//       paramModel: HotSearchTermRequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },
//     getSearchReplace: {
//       path: '/spare-replace-group/allReplacePage',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getFindRootNode: {
//       path: '/part/getPartNodePage',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: ApplyRequestDTOModel,
//       responseModel: CommonApplyResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getReplaceDetail: {
//       path: '/spare-replace-group/getDetail',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: ReplaceRequestDTOModel,
//       responseModel: CommonReplaceResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     searchTipsRecordList: {
//       path: '/business/search/indexSearchRecordList',
//       method: 'GET',
//       type: OpenApiActions.list,
//       paramModel: ReplaceRequestDTOModel,
//       responseModel: CommonReplaceResultPOModel,
//       responseDataModel: BeltPOModel,
//     },

//     getPartDetailById: {
//       path: '/business-api/business/part/getPartDetailById',
//       method: 'GET',
//       type: OpenApiActions.create,
//       paramModel: RequestDTOModel,
//       responseModel: CommonResultPOModel,
//       responseDataModel: BeltPOModel,
//     },
//   },
// };
