import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ProductTempPageRequestDTOModel } from '@/api/models/productTemp/ProductTempPageRequestDTOModel';

/**
 * 公告管理
 */
export class AdminApiProductTemp {
  /**
   * 获得产品模板列表信息
   *
   * @tags 管理后台 - 获得产品模板列表信息
   * @name getProductTempPageList
   * @summary 获得产品模板列表信息
   * @request /business-service/business/product-temp/page
   * @secure
   */
  static getProductTempPageList = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获得产品模板列表信息
   *
   * @tags 管理后台 - 获得产品模板列表信息
   * @name getProductTempList
   * @summary 获得产品模板列表信息
   * @request /business-service/business/product-temp/list
   * @secure
   */
  static getProductTempList = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建产品模板
   *
   * @tags 管理后台 - 创建产品模板
   * @name productTempCreate
   * @summary 创建产品模板
   * @request /business-service/business/product-temp/create
   * @secure
   */
  static productTempCreate = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑产品模板
   *
   * @tags 管理后台 - 编辑产品模板
   * @name productTempUpdate
   * @summary 编辑产品模板
   * @request /business-service/business/product-temp/update
   * @secure
   */
  static productTempUpdate = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除产品模板
   *
   * @tags 管理后台 - 删除产品模板
   * @name productTempDelete
   * @summary 删除产品模板
   * @request /business-service/business/product-temp/delete
   * @secure
   */
  static productTempDelete = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 产品模板撤销以及发布接口
   *
   * @tags 管理后台 - 产品模板撤销以及发布接口
   * @name goBackPushFun
   * @summary 产品模板撤销以及发布接口
   * @request /business-service/business/product-temp/goBackPushFun
   * @secure
   */
  static goBackPushFun = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp/goBackPushFun`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获得产品模板列表历史版本信息
   *
   * @tags 管理后台 - 获得产品模板列表历史版本信息
   * @name getHistoryList
   * @summary 获得产品模板列表历史版本信息
   * @request /business-service/business/product-temp-history/list
   * @secure
   */
  static getHistoryList = <Req extends ProductTempPageRequestDTOModel = ProductTempPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/product-temp-history/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

    /**
   * 查询树（浏览/编辑回显共用）
   * @summary 返回模板 WBS 树、节点选中状态、节点必选项、节点任务候选列表 [cite: 28]
   * @request POST /business-service/business/product-temp/wbs-tree-list [cite: 27]
   */
  static getWbsTreeList = (
    query: {
      tempId: number | string;
      menuId?: number | string;
      parentId?: number | string | null;
    },
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>({
      path: `/business-service/business/product-temp/wbs-tree-list`,
      method: "POST",
      body: query,
      secure: true,
      ...params,
    });

  /**
   * 保存模板 WBS 快照
   * @summary 保存节点选择 + 任务单选 + 节点必选项，并回传最新树 [cite: 91]
   * @request POST /business-service/business/product-temp/wbs-snapshot/save [cite: 90]
   */
  static saveWbsSnapshot = (
    query: {
      tempId: number | string;
      menuId: number | string;
      tree: any[];
      nodeTaskSelections: Array<{
        nodeId: string | number;
        taskId: string | number;
        requiredFlag: 0 | 1;
      }>;
    },
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>({
      path: `/business-service/business/product-temp/wbs-snapshot/save`,
      method: "POST",
      body: query,
      secure: true,
      ...params,
    });

  /**
   * 节点上移
   * @request POST /business-service/business/product-temp/wbs-snapshot/move-up [cite: 127]
   */
  static moveUpNode = (
    query: { tempId: number | string; nodeId: number | string },
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>({
      path: `/business-service/business/product-temp/wbs-snapshot/move-up`,
      method: "POST",
      body: query,
      secure: true,
      ...params,
    });

  /**
   * 节点下移
   * @request POST /business-service/business/product-temp/wbs-snapshot/move-down [cite: 133]
   */
  static moveDownNode = (
    query: { tempId: number | string; nodeId: number | string },
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>({
      path: `/business-service/business/product-temp/wbs-snapshot/move-down`,
      method: "POST",
      body: query,
      secure: true,
      ...params,
    });

  /**
   * 删除节点（有子节点禁止删）
   * @request POST /business-service/business/product-temp/wbs-snapshot/delete-node [cite: 139]
   */
  static deleteWbsNode = (
    query: { tempId: number | string; nodeId: number | string },
    params: RequestParams = {},
  ) =>
    httpClient.request<any, any>({
      path: `/business-service/business/product-temp/wbs-snapshot/delete-node`,
      method: "POST",
      body: query,
      secure: true,
      ...params,
    });
}
