import { ContentType, httpClient, type RequestParams } from "../http-client";
import { CommonResultBooleanModulemanaGementModel } from "@/api/models/ModulemanaGement/CommonResultBooleanModulemanaGementModel";
import { processTaskPage } from "@/api/models/processTask/processTaskPage";
/**
 * 管理后台流程任务
 */
export class AdminApiSystemProcessTask {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台流程任务`;
  /**
   * @description 用于【流程任务管理】界面
   *
   * @tags 管理后台 - 流程任务
   * @name getpackageList
   * @summary 获取流程任务列表
   * @request GET:/cirpoint-demand-api/process-task/page
   * @secure
   */
  static getProcessTaskList = <Req extends processTaskPage = processTaskPage>(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/process-task/page`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
  /**
   * @description 更新流程状态
   *
   * @tags 管理后台 - 更新流程状态
   * @name updateStatus
   * @summary 更新流程状态
   * @request GET:/cirpoint-demand-api/process-task/updateStatus
   * @secure
   */
  static updateStatus = <
    Req extends { id: string; processStatus: string } = {
      id: string;
      processStatus: string;
    },
  >(
    query: Req,
    params: RequestParams = {}
  ) =>
    httpClient.request<CommonResultBooleanModulemanaGementModel, any>(
      {
        path: `/cirpoint-demand-api/process-task/updateStatus`,
        method: "POST",
        body: query,
        secure: true,
        ...params,
      },
      CommonResultBooleanModulemanaGementModel
    );
}
