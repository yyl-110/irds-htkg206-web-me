import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
/**
 * 管理后台流程任务
 */
export class AdminApiSystemProcessTask {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `管理后台流程任务`;

  /**
   * 获取设计任务树
   *
   * @tags 管理后台 - 获取设计任务树
   * @name getDesignTaskTreeList
   * @summary 获取设计任务树
   * @request POST:/business-service/business/task-category-tree/task-tree-list
   * @secure
   */
  static getDesignTaskTreeList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/task-tree-list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建设计任务树
   *
   * @tags 管理后台 - 创建设计任务树
   * @name createDesignTaskTree
   * @summary 创建设计任务树
   * @request POST:/business-service/business/task-category-tree/create
   * @secure
   */
  static createDesignTaskTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 修改设计任务树
   *
   * @tags 管理后台 - 修改设计任务树
   * @name updateDesignTaskTree
   * @summary 修改设计任务树
   * @request POST:/business-service/business/task-category-tree/update
   * @secure
   */
  static updateDesignTaskTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除设计任务树
   *
   * @tags 管理后台 - 删除设计任务树
   * @name deleteDesignTaskTree
   * @summary 删除设计任务树
   * @request POST:/business-service/business/task-category-tree/delete
   * @secure
   */
  static deleteDesignTaskTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 上移设计任务树
   *
   * @tags 管理后台 - 上移设计任务树
   * @name sortUpDesignTaskTree
   * @summary 上移设计任务树
   * @request POST:/business-service/business/task-category-tree/sort/up
   * @secure
   */
  static sortUpDesignTaskTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/sort/up`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 下移设计任务树
   *
   * @tags 管理后台 - 下移设计任务树
   * @name sortDownDesignTaskTree
   * @summary 下移设计任务树
   * @request POST:/business-service/business/task-category-tree/sort/down
   * @secure
   */
  static sortDownDesignTaskTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-category-tree/sort/down`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
