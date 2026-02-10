import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { ProdDemandplementationRequestDTOModel } from "@/api/models/demand/ProdDemandplementationRequestDTOModel";
/**
 * 管理后台需求
 */
export class AdminApiSystemplementation {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台需求`;
  /**
   * @description 用于【需求管理】界面
   *
   * @tags 管理后台 - 需求实现
   * @name getdemandtaskList
   * @summary 获取 需求实现列表
   * @request GET:/demand-task/page
   * @secure
   */
  static getdemandtaskList = <
    Req extends
      ProdDemandplementationRequestDTOModel = ProdDemandplementationRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求实现统计信息
   *
   * @tags 管理后台 - 需求实现统计信息
   * @name getplementationstatisticInfo
   * @summary 需求实现统计信息
   * @request GET:/cirpoint-demand-api/demand-task/statisticInfo
   * @secure
   */
  static getplementationstatisticInfo = <Req extends any = any>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/statisticInfo`,
        method: "GET",
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 获取 获取证明材料
   *
   * @tags 管理后台 - 获取 获取证明材料
   * @name getUploadProof
   * @summary 获取 获取证明材料
   * @request GET:/demand-task/getUploadProof
   * @secure
   */
  static getUploadProof = <
    Req extends {
      taskId: string;
    } = {
      taskId: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/getUploadProof`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 上传证明材料
   *
   * @tags 管理后台 - 上传证明材料
   * @name uploadProof
   * @summary 上传证明材料
   * @request POST:/demand-task/uploadProof
   * @secure
   */
  static uploadProof = <
    Req extends
      ProdDemandplementationRequestDTOModel = ProdDemandplementationRequestDTOModel,
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/uploadProof`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 任务接收确认
   *
   * @tags 管理后台 - 任务接收确认
   * @name taskConfirm
   * @summary 任务接收确认
   * @request POST:/demand-task/taskConfirm
   * @secure
   */
  static taskConfirm = <
    Req extends { taskId: string; implementPlan: string } = {
      taskId: string;
      implementPlan: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/taskConfirm`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * 更新任务状态
   *
   * @tags 管理后台 - 更新任务状态
   * @name taskConfirm
   * @summary 更新任务状态
   * @request POST:/demand-task/updateStatus
   * @secure
   */
  static updateStatus = <
    Req extends { taskId: string; status: string } = {
      taskId: string;
      status: string;
    },
  >(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/updateStatus`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * 发起任务变更
   *
   * @tags 管理后台 - 发起任务变更
   * @name taskConfirm
   * @summary 发起任务变更
   * @request POST:/demand-change/taskChange
   * @secure
   */
  static taskChange = <Req extends any = any>(
    data: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-change/taskChange`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );

  /**
   * @description 需求实现-撤回
   *
   * @tags 管理后台 - 需求实现-撤回
   * @name retract
   * @summary 需求实现-撤回
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

  /**
   * @description 用于【产品平台管理】界面
   *
   * @tags 管理后台 - 产品平台获取任务分页列表
   * @name productPlatformTaskPage
   * @summary 获取 产品平台获取任务分页列表
   * @request GET:/demand-task/productPlatformTaskPage
   * @secure
   */
  static productPlatformTaskPage = <
    Req extends
      ProdDemandplementationRequestDTOModel = ProdDemandplementationRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/productPlatformTaskPage`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 用于【设计查核管理】界面
   *
   * @tags 管理后台 - 用于【设计查核管理】界面获取任务分页列表
   * @name dfxTaskPage
   * @summary 获取 用于【设计查核管理】界面获取任务分页列表
   * @request GET:/demand-task/dfxTaskPage
   * @secure
   */
  static dfxTaskPage = <
    Req extends
      ProdDemandplementationRequestDTOModel = ProdDemandplementationRequestDTOModel,
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/demand-task/dfxTaskPage`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
