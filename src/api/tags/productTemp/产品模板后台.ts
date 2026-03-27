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
}
