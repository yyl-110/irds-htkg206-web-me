// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from "../http-client";
import { WorkBenchPageRequestDTOModel } from "@/api/models/workbench/WorkBenchPageRequestDTOModel";
import { CommonResultListDeptResponseDTOModel } from "../../models/CommonResultListDeptResponseDTOModel";
import { WorkBenchTaskPageRequestDTOModel } from "@/api/models/workbench/WorkBenchTaskPageRequestDTOModel";

/**
 * 工作台
 */
export class AdminApiWorkbench {
  /**
   * 获取用户信息
   *
   * @tags 获取用户信息
   * @name queryUserInfoByUserIdOrName
   * @summary 获取用户信息
   * @request /cirpoint-base-api/sysuser/getUserInfoByUserIdOrName.json
   * @secure
   */
  static queryUserInfoByUserIdOrName = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/sysuser/getUserInfoByUserIdOrName.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取项目信息
   *
   * @tags 获取项目信息
   * @name getCkProjectEstimatorApi
   * @summary 获取项目信息
   * @request /cirpoint-module-api/ckProjectInfo/ckProjectEstimator
   * @secure
   */
  static getCkProjectEstimatorApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/ckProjectEstimator`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取项目信息
   *
   * @tags 获取项目信息
   * @name getCkProjectEstimatorApi
   * @summary 获取项目信息
   * @request /cirpoint-module-api/ckProjectInfo/ckProjectEstimator
   * @secure
   */
  static getCkProjectEstimatorApiV1 = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/ckProjectEstimatorV1`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取待办信息
   *
   * @tags 获取待办信息
   * @name getTaskPageApi
   * @summary 获取待办信息
   * @request /cirpoint-module-api/ckProjectInfo/getTaskPage
   * @secure
   */
  static getTaskPageApi = <
    Req extends
      WorkBenchTaskPageRequestDTOModel = WorkBenchTaskPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getTaskPage`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取待办信息
   *
   * @tags 获取待办信息
   * @name getProjectDetailApi
   * @summary 获取待办信息
   * @request /cirpoint-module-api/ckProjectInfo/getProjectDetail
   * @secure
   */
  static getProjectDetailApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getProjectDetail`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 启动任务
   *
   * @tags 启动任务
   * @name startTaskApi
   * @summary 启动任务
   * @request /cirpoint-module-api/ckProjectInfo/startTask
   * @secure
   */
  static startTaskApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/startTask`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 驳回任务
   *
   * @tags 驳回任务
   * @name rejectTaskApi
   * @summary 驳回任务
   * @request /cirpoint-module-api/ckProjectInfo/rejectTask
   * @secure
   */
  static rejectTaskApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/rejectTask`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 转办
   *
   * @tags转办
   * @name sycnProjectUserApi
   * @summary 转办
   * @request /cirpoint-module-api/pdmSystem/sycnProjectUser
   * @secure
   */
  static sycnProjectUserApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/pdmSystem/sycnProjectUser`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
  /**
   * 下载
   *
   * @tags转办
   * @name getExportAllTaskApi
   * @summary 转办
   * @request /cirpoint-module-api/projectFile/exportAllTask
   * @secure
   */
  static getExportAllTaskApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/projectFile/exportAllTask`,
        method: "POST",
        body: query,
        secure: true,
        format: "blob",
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 流程回滚
   *
   * @tags转办
   * @name rollBackTaskApi
   * @summary 流程回滚
   * @request /cirpoint-module-api/ckProjectInfo/rollBackTask
   * @secure
   */
  static rollBackTaskApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/rollBackTask`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 获取快速访问链接
   *
   * @tags转办
   * @name getFastPointInfoById
   * @summary 获取快速访问链接
   * @request /cirpoint-base-api/fastpoint/getFastPointInfoById.json
   * @secure
   */
  static getFastPointInfoById = <Req>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-base-api/fastpoint/getFastPointInfoById.json`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 任务转办
   *
   * @tags转办
   * @name transferTaskApi
   * @summary 任务转办
   * @request /cirpoint-module-api/ckProjectInfo/transferTask
   * @secure
   */
  static transferTaskApi = <
    Req extends WorkBenchPageRequestDTOModel = WorkBenchPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/transferTask`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );

  /**
   * 我发起的任务
   *
   * @tags转办
   * @name getMyCreatTaskApi
   * @summary 我发起的任务
   * @request /cirpoint-module-api/ckProjectInfo/getMyCreatTask
   * @secure
   */
  static getMyCreatTaskApi = <
    Req extends
      WorkBenchTaskPageRequestDTOModel = WorkBenchTaskPageRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/cirpoint-module-api/ckProjectInfo/getMyCreatTask`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel
    );
}
