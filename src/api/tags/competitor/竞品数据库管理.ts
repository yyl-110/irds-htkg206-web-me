// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CompetitorTreeRequestDTOModel } from "@/api/models/competitor/CompetitorTreeRequestDTOModel";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { CompetitorInfoRequestDTOModel } from "@/api/models/competitor/CompetitorInfoRequestDTOModel";
import { CompetitorDataRequestDTOModel } from "@/api/models/competitor/CompetitorDataRequestDTOModel";

/**
 * 竞品数据库
 */
export class AdminApiCompetitor {
  /**
   * 获取竞品数据库表头信息和数据信息
   *
   * @tags 管理后台 -竞品数据库
   * @name getCompetitorList
   * @request /cirpoint-demand-api/competitor-product-info/getCompetitorList
   * @secure
   */
  static getCompetitorList = <
    Req extends { treeId: number } = { treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/getCompetitorList`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取竞品数据库表头信息和数据信息
   *
   * @tags 管理后台 -竞品数据库
   * @name getCompetitorCompList
   * @request /cirpoint-demand-api/competitor-product-info/getCompetitorCompList
   * @secure
   */
  static getCompetitorCompList = <
    Req extends { treeId: number } = { treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/getCompetitorCompList`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取竞品数据分类树结构
   *
   * @tags 管理后台 -获取竞品数据分类树结构
   * @name getCompetitorTree
   * @request /cirpoint-demand-api/competitor-product-category/getCompetitorTree
   * @secure
   */
  static getCompetitorTree = <
    Req extends { treeId: number } = { treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/getCompetitorTree`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取竞品数据库信息
   *
   * @tags 获取竞品数据库信息
   * @name getCompetitorTreeInfoList
   * @request /cirpoint-demand-api/competitor-product-category/getCompetitorTreeList
   * @secure
   */
  static getCompetitorTreeInfoList = <
    Req extends { treeId: number } = { treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/getCompetitorTreeList`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据ID获取竞品数据信息
   *
   * @tags 根据ID获取竞品数据信息
   * @name getCompetitorTreeById
   * @request /cirpoint-demand-api/competitor-product-category/getCompetitorTreeById
   * @secure
   */
  static getCompetitorTreeById = <
    Req extends { id: number; treeId: number } = { id: number; treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/getCompetitorTreeById`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据ID和类型获取附件信息
   *
   * @tags 根据ID和类型获取附件信息
   * @name getCompetitorFileList
   * @request /cirpoint-demand-api/competitor-file-info/getCompetitorFileList
   * @secure
   */
  static getCompetitorFileList = <
    Req extends { id: number; type: string } = { id: number; type: string },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-file-info/getCompetitorFileList`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据ID获取结构树ID详情
   *
   * @tags 根据ID获取结构树ID详情
   * @name getTreeDetailData
   * @request /cirpoint-demand-api/competitor-product-category/getTreeDetailData
   * @secure
   */
  static getTreeDetailData = <Req extends { id: number } = { id: number }>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/getTreeDetailData`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 根据ID获取结构树ID详情
   *
   * @tags 根据ID获取结构树ID详情
   * @name getTreeDetailData
   * @request /cirpoint-demand-api/competitor-product-category/create
   * @secure
   */
  static competitorTreeAdd = <
    Req extends CompetitorTreeRequestDTOModel = CompetitorTreeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/create`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 产品模块管理树结构移动
   *
   * @tags 管理后台 - 产品模块管理树结构移动
   * @name upDownSaveTreeKey
   * @summary 产品模块管理树结构移动
   * @request /cirpoint-demand-api/competitor-product-category/updTreeKey
   * @secure
   */
  static upDownSaveTreeKey = <
    Req extends { id: number; type: number } = { id: number; type: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/updTreeKey`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除树节点
   *
   * @tags 删除树节点
   * @name delTreeNode
   * @request /cirpoint-demand-api/competitor-product-category/delete
   * @secure
   */
  static delTreeNode = <Req extends { id: number } = { id: number }>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-category/delete`,
        method: "DELETE",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加竞争对手
   *
   * @tags 添加竞争对手
   * @name competitorInfoAdd
   * @request /cirpoint-demand-api/competitor-info/create
   * @secure
   */
  static competitorInfoAdd = <
    Req extends CompetitorInfoRequestDTOModel = CompetitorInfoRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-info/update`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取竞品数据库清单
   *
   * @tags 获取竞品数据库清单
   * @name getCompetitorInfoList
   * @request /cirpoint-demand-api/competitor-info/list
   * @secure
   */
  static getCompetitorInfoList = (params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-info/list`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除竞争对手
   *
   * @tags 删除竞争对手
   * @name deleteCompetitorInfo
   * @request /cirpoint-demand-api/competitor-info/delete
   * @secure
   */
  static deleteCompetitorInfo = <Req extends { id: number } = { id: number }>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-info/delete`,
        method: "DELETE",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加竞品数据信息
   *
   * @tags 添加竞品数据信息
   * @name competitorInfoDataAdd
   * @request /cirpoint-demand-api/competitor-product-info/create
   * @secure
   */
  static competitorInfoDataAdd = <
    Req extends CompetitorDataRequestDTOModel = CompetitorDataRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/create`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 删除竞品信息
   *
   * @tags 删除竞品信息
   * @name deleteCompetitorData
   * @request /cirpoint-demand-api/competitor-product-info/delete
   * @secure
   */
  static deleteCompetitorData = <Req extends { id: number } = { id: number }>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/delete`,
        method: "DELETE",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 添加竞品数据信息
   *
   * @tags 添加竞品数据信息
   * @name competitorInfoDataUpdate
   * @request /cirpoint-demand-api/competitor-product-info/update
   * @secure
   */
  static competitorInfoDataUpdate = <
    Req extends CompetitorDataRequestDTOModel = CompetitorDataRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/update`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查询车型
   *
   * @tags 添加竞品数据信息
   * @name getCompetitorTreeListByType
   * @request /cirpoint-demand-api/competitor-product-info/getCompetitorTreeListByType
   * @secure
   */
  static getCompetitorTreeListByType = <
    Req extends CompetitorTreeRequestDTOModel = CompetitorTreeRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/getCompetitorTreeListByType`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 查询车型
   *
   * @tags 添加竞品数据信息
   * @name getComparisonLevelList
   * @request /cirpoint-demand-api/competitor-product-info/getComparisonLevelList
   * @secure
   */
  static getComparisonLevelList = <
    Req extends { treeId: number } = { treeId: number },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-demand-api/competitor-product-info/getComparisonLevelList`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
