import { httpClient, type RequestParams } from "./http-client";
import { ContentType } from "./http-client";
import { CommonResultPageResultLoginLogPOModel } from "../models/log/CommonResultPageResultLoginLogPOModel";
import { synchronizationLoginLogPOModel } from "../models/log/synchronizationLoginLogPOModel";
import { CommonResultPageResultOperateLogPOModel } from "../models/log/CommonResultPageResultOperateLogPOModel";
import { LoginLogResponseDTOModel } from "../models/log/LoginLogResponseDTOModel";
import { OperateLogSearchDTOModel } from "../models/log/OperateLogSearchDTOModel";
import { PartsReplaceRequestByIDDTOModel } from "../models/backendData/partsReplace/PartsReplacePageRequestDTOModel";

/**
 * 管理后台日志管理
 */
export class AdminApiLog {
  /**
   * @description 数据详情
   *
   * @tags 系统日志 - 数据详情
   * @name getLoginLogPageList
   * @summary 数据详情
   * @request GET:/external-api-log/detail
   * @secure
   */
  static getexternaldetail = <
    Req extends
      PartsReplaceRequestByIDDTOModel = PartsReplaceRequestByIDDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<synchronizationLoginLogPOModel, any>(
      {
        path: `/external-api-log/detail`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      synchronizationLoginLogPOModel
    );

  /**
   * @description 数据同步异常-同步
   * @tags 数据同步异常-同步
   * @name getOperateLogPageList
   * @summary 用数据同步异常-同步
   * @request GET:/external-api-log/reExecute
   * @secure
   */
  static externalreExecute = <
    Req extends
      PartsReplaceRequestByIDDTOModel = PartsReplaceRequestByIDDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultOperateLogPOModel, any>(
      {
        path: `/external-api-log/reExecute?id=${query?.id}`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultOperateLogPOModel
    );
  /**
   *  数据同步异常-删除
   *
   * @tags 数据同步异常-删除
   * @name getFeedbackDetail
   * @summary 数据同步异常-删除
   * @request DELETE:/external-api-log/delete
   * @secure
   */
  static deleteexternalData = <
    Req extends
      PartsReplaceRequestByIDDTOModel = PartsReplaceRequestByIDDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultLoginLogPOModel, any>(
      {
        path: `/external-api-log/delete`,
        method: "DELETE",
        query: query,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultPageResultLoginLogPOModel
    );
  /**
   * @description 数据同步异常
   *
   * @tags 系统日志 - 数据同步异常
   * @name getLoginLogPageList
   * @summary 数据同步异常
   * @request GET:/external-api-log/page
   * @secure
   */
  static getexternalPageList = <
    Req extends LoginLogResponseDTOModel = LoginLogResponseDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultLoginLogPOModel, any>(
      {
        path: `/external-api-log/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultLoginLogPOModel
    );
  /**
   * @description 用户登录日志记录
   *
   * @tags 系统日志 - 用户登录日志记录
   * @name getLoginLogPageList
   * @summary 用户登录日志记录
   * @request GET:/system/login-log/page
   * @secure
   */
  static getLoginLogPageList = <
    Req extends LoginLogResponseDTOModel = LoginLogResponseDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultLoginLogPOModel, any>(
      {
        path: `/system-service/system/login-log/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultLoginLogPOModel
    );

  /**
   * @description 用户操作日志记录
   * @tags 系统日志 - 用户操作日志记录
   * @name getOperateLogPageList
   * @summary 用户操作日志记录
   * @request GET:/system/statistics-log/operation-log-list
   * @secure
   */
  static getOperateLogPageList = <
    Req extends OperateLogSearchDTOModel = OperateLogSearchDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultPageResultOperateLogPOModel, any>(
      {
        path: `/system-service/system/statistics-log/operation-log-list`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultPageResultOperateLogPOModel
    );
}
