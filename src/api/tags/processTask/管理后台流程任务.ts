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
   * 获取应用端独立应用任务树
   *
   * @tags 管理后台 - 获取应用端独立应用任务树
   * @name getDesignTaskAppTreeList
   * @summary 获取应用端独立应用任务树
   * @request POST:/business-service/business/standalone-app-browse/category-tree
   * @secure
   */
  static getDesignTaskAppTreeList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app-browse/category-tree`,
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

  /**
   * 获取任务基础信息
   *
   * @tags 管理后台 - 获取任务基础信息
   * @name taskBasicInfoPage
   * @summary 获取任务基础信息
   * @request POST:/business-service/business/task-basic-info/page
   * @secure
   */
  static taskBasicInfoPage = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建taskBasicInfo
   *
   * @tags 管理后台 - 创建taskBasicInfo
   * @name createTaskBasicInfo
   * @summary 创建taskBasicInfo
   * @request POST:/business-service/business/task-basic-info/create
   * @secure
   */
  static createTaskBasicInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 更新taskBasicInfo
   *
   * @tags 管理后台 - 更新taskBasicInfo
   * @name updateTaskBasicInfo
   * @summary 更新taskBasicInfo
   * @request POST:/business-service/business/task-basic-info/update
   * @secure
   */
  static updateTaskBasicInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除
   *
   * @tags 管理后台 - 删除
   * @name deleteTaskBasicInfo
   * @summary 删除
   * @request POST:/business-service/business/task-basic-info/delete
   * @secure
   */
  static deleteTaskBasicInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计任务配置可视化流程功能
   *
   * @tags 管理后台 - 设计任务配置可视化流程功能
   * @name bpmnSaveXmlTree
   * @summary 设计任务配置可视化流程功能
   * @request POST:/business-service/business/task-basic-info/bpmn-node/save-tree
   * @secure
   */
  static bpmnSaveXmlTree = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/bpmn-node/save-tree`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计任务发布功能
   *
   * @tags 管理后台 - 设计任务发布功能
   * @name taskPublish
   * @summary 设计任务发布功能
   * @request POST:/business-service/business/task-basic-info/publish
   * @secure
   */
  static taskPublish = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/publish`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 设计任务撤销发布功能
   *
   * @tags 管理后台 - 设计任务撤销发布功能
   * @name taskRevokePublish
   * @summary 设计任务撤销发布功能
   * @request POST:/business-service/business/task-basic-info/revoke-publish
   * @secure
   */
  static taskRevokePublish = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/revoke-publish`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 配置可视化流程初始化功能
   *
   * @tags 管理后台 - 配置可视化流程初始化功能
   * @name getXmlInfo
   * @summary 配置可视化流程初始化功能
   * @request GET:/business-service/business/task-basic-info/get
   * @secure
   */
  static getXmlInfo = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/task-basic-info/get`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 申请独立应用编码
   *
   * @tags 管理后台 - 申请独立应用编码
   * @name nextAppCode
   * @summary 申请独立应用编码
   * @request GET:/business-service/business/standalone-app/next-app-code
   * @secure
   */
  static nextAppCode = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/next-app-code`,
        method: 'GET',
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建独立应用
   *
   * @tags 管理后台 - 创建独立应用
   * @name createApp
   * @summary 创建独立应用
   * @request POST:/business-service/business/standalone-app/create
   * @secure
   */
  static createApp = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询独立应用列表
   *
   * @tags 管理后台 - 查询独立应用列表
   * @name appList
   * @summary 查询独立应用列表
   * @request POST:/business-service/business/standalone-app/app-list
   * @secure
   */
  static appList = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/app-list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询流程节点树+节点状态（不含 componentsJson，数据量大请分步加载）
   *
   * @tags 管理后台 - 查询流程节点树+节点状态（不含 componentsJson，数据量大请分步加载）
   * @name projectPages
   * @summary 查询流程节点树+节点状态（不含 componentsJson，数据量大请分步加载）
   * @request POST:/business-service/business/standalone-app/project-pages
   * @secure
   */
  static projectPages = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/project-pages`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 按节点查询活动页面 componentsJson + 该页已保存参数（点击树节点后调用）
   *
   * @tags 管理后台 - 按节点查询活动页面 componentsJson + 该页已保存参数（点击树节点后调用）
   * @name nodePageDetail
   * @summary 按节点查询活动页面 componentsJson + 该页已保存参数（点击树节点后调用）
   * @request POST:/business-service/business/standalone-app/node-page-detail
   * @secure
   */
  static nodePageDetail = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/node-page-detail`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 保存指定流程节点参数值（同应用同任务同参数key全局唯一）
   *
   * @tags  保存指定流程节点参数值（同应用同任务同参数key全局唯一）
   * @name saveParams
   * @summary  保存指定流程节点参数值（同应用同任务同参数key全局唯一）
   * @request POST:/business-service/business/standalone-app/save-params
   * @secure
   */
  static saveParams = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/save-params`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 下一步（自动保存当前节点并推进到下一个未完成/待确认节点）
   *
   * @tags  下一步（自动保存当前节点并推进到下一个未完成/待确认节点）
   * @name nextStep
   * @summary  下一步（自动保存当前节点并推进到下一个未完成/待确认节点）
   * @request POST:/business-service/business/standalone-app/next-step
   * @secure
   */
  static nextStep = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/next-step`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 查询当前任务全节点参数集合（Map结构，便于前端按key读取）
   *
   * @tags  查询当前任务全节点参数集合（Map结构，便于前端按key读取）
   * @name saveParams
   * @summary  查询当前任务全节点参数集合（Map结构，便于前端按key读取）
   * @request POST:/business-service/business/standalone-app/task-param-map
   * @secure
   */
  static taskParamMap = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/task-param-map`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 独立应用导出报告
   *
   * @tags  独立应用导出报告
   * @name exportReport
   * @summary  独立应用导出报告
   * @request POST:/business-service/business/standalone-app/export-report
   * @secure
   */
  static exportReport = <Req extends any = any>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/standalone-app/export-report`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
