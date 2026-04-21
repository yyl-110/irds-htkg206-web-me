// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
/**
 * 产品规划
 */
export class AdminApiSystemCheckInfoApi {
  
  
   /**
   * exe计算列表信息
   *
   * @tags exe计算列表信息
   * @name checkPageParamExeList
   * @request business-service/business/check-exe-info/page
   * @secure
   */
  static checkPageParamExeList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-exe-info/page`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  
  
  
   /**
   * exe计算添加
   *
   * @tags exe计算添加
   * @name addCheckExeInfo
   * @request business-service//business/check-exe-info/create
   * @secure
   */
  static addCheckExeInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-exe-info/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * exe计算更新
   *
   * @tags exe计算更新
   * @name updateCheckExeInfo
   * @request business-service/business/check-exe-info/update
   * @secure
   */
  static updateCheckExeInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-exe-info/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * exe计算删除
   *
   * @tags exe计算删除
   * @name deleteCheckExeInfo
   * @request business-service/business/check-exe-info/delete
   * @secure
   */
  static deleteCheckExeInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-exe-info/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  
  /**
   * 根据ID获取对象
   *
   * @tags 根据ID获取对象
   * @name getCheckExeInfoById
   * @request business-service/business/check-exe-info/delete
   * @secure
   */
   static getCheckExeInfoById = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-exe-info/getCheckExeInfoById`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  
     /**
   * 发布exe计算到计算清单表
   *
   * @tags exe计算添加
   * @name saveCheckSummar
   * @request business-service/business/check-summar-list/create
   * @secure
   */
  static saveCheckSummar = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-summar-list/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  
  /**
   * 根据TreeID获取计算清单信息
   *
   * @tags exe计算添加
   * @name getCheckSummarListByTreeId
   * @request business-service/business/check-summar-list/applist
   * @secure
   */
  static getCheckSummarListByTreeId = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `business-service/business/check-summar-list/applist`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  
}





