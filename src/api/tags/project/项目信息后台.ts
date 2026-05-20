import { ContentType, httpClient, type RequestParams } from '../http-client';
import { CommonResultListDeptResponseDTOModel } from '../../models/CommonResultListDeptResponseDTOModel';
import { ProjectPageRequestDTOModel } from '@/api/models/project/ProjectPageRequestDTOModel';

/**
 * 公告管理
 */
export class AdminApiProjectTemp {
  /**
   * 获得项目信息列表信息
   *
   * @tags 管理后台 - 获得项目信息列表信息
   * @name getProjectPageList
   * @summary 获得项目信息列表信息
   * @request /business-service/business/product-info/page
   * @secure
   */
  static getProjectPageList = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/page`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 创建项目信息
   *
   * @tags 管理后台 - 创建项目信息
   * @name createProject
   * @summary 创建项目信息
   * @request /business-service/business/product-temp/create
   * @secure
   */
  static createProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/create`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 编辑项目信息
   *
   * @tags 管理后台 - 编辑项目信息
   * @name updateProject
   * @summary 编辑项目信息
   * @request /business-service/business/product-temp/update
   * @secure
   */
  static updateProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/update`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 删除项目信息
   *
   * @tags 管理后台 - 删除项目信息
   * @name deleteProject
   * @summary 删除项目信息
   * @request /business-service/business/product-temp/delete
   * @secure
   */
  static deleteProject = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/delete`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 获取项目信息编辑文件
   *
   * @tags 管理后台 - 获取项目信息编辑文件
   * @name getProjectInfoEditFile
   * @summary 获取项目信息编辑文件
   * @request /business-service/business/product-temp/getProjectInfoEditFile
   * @secure
   */
  static getProjectInfoEditFile = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-info/getProjectInfoEditFile`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目团队列表
   *
   * @tags 管理后台 - 项目团队列表
   * @name projectTeamList
   * @summary 项目团队列表
   * @request /business-service/business/project-team/list
   * @secure
   */
  static projectTeamList = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-team/list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 项目团队授权用户
   *
   * @tags 管理后台 - 项目团队授权用户
   * @name createProjectTeamUserAuth
   * @summary 项目团队授权用户
   * @request /business-service/business/project-team-user/createProjectTeamUserAuth
   * @secure
   */
  static createProjectTeamUserAuth = <Req extends ProjectPageRequestDTOModel = ProjectPageRequestDTOModel>(query: Req, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-team-user/createProjectTeamUserAuth`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /**
   * 按项目ID查询WBS树表
   */
  static projectWbsTreeList = <Req extends { projectId: string | number } = { projectId: string | number }>(
    query: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/tree-list`,
        method: 'POST',
        body: query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /** 产品设计看板：WBS 一级分类下协同任务与独立应用汇总 */
  static projectWbsProductBoardCollabStandalone = (
    body: { projectId: string | number; phaseId?: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/product-board-collab-standalone`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsAssignUser = (body: {
    id: string;
    assigneeUserId: string;
    planStartTime: string;
    planEndTime: string;
  }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/assign-user`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsPublishTask = (body: { id: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/publish-task`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsRevokePublish = (body: { id: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/revoke-publish`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsSuspendRow = (body: { id: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/suspend-row`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsRestoreRow = (body: { id: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/restore-row`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsMarkChange = (body: { id: string | number }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/mark-change`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static projectWbsReopenTask = (
    body: { id: string | number; applyLatestValue?: number },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/reopen-task`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsTaskParamList = (query: { projectId: string | number; taskId: string | number }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/list`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsTaskParamConfirmSync = (
    body: {
      projectId: string | number;
      consumerTaskId: string | number;
      consumerWbsId: string | number;
      paramKeys: string[];
    },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/confirm-sync-from-upstream`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /** 协同设计工作台：拉取 COLLAB 流程树（对齐独立应用 project-pages） */
  static wbsCollabProjectPages = (
    body: { projectId: string | number; taskId: string | number; bpmnElementId?: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/collab-project-pages`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsCollabNodePageDetail = (
    body: { projectId: string | number; taskId: string | number; bpmnElementId: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/collab-node-page-detail`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsTaskParamMap = (query: { projectId: string | number; taskId: string | number }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/param-map`,
        method: 'GET',
        query,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsTaskParamSave = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/save`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsCollabNextStep = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/collab-next-step`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static wbsTaskParamEvaluateImpact = (body: Record<string, unknown>, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/project-wbs/task-param/evaluate-impact`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /** 工作台首页顶部汇总（替代已下线的 ckProjectInfo/getTaskMessage 数字部分） */
  static workbenchTodoCardSummary = (body: { assigneeUserId: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/summary`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static workbenchTodoCardPage = (
    body: {
      pageNo: number;
      pageSize: number;
      assigneeUserId: string;
      status?: string;
      keyword?: string;
      /** 默认服务端按 WBS；显式传 WBS 亦可 */
      cardKind?: string;
      /** 与 status=TODO 联用：DUE_5D=截止日在[今,今+5]；DUE_15D=[今,今+15]；OVERDUE=截止早于今或 overdue_days>0 */
      timeBucket?: string;
    },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/page`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static workbenchTodoTransferOutPage = (
    body: { pageNo: number; pageSize: number; keyword?: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/transfer-out-page`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static workbenchTodoCardTransferCandidates = (body: { projectId: string }, params: RequestParams = {}) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/transfer-candidates`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  static workbenchTodoCardTransfer = (
    body: { cardId: string; toAssigneeUserId: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/transfer`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /** 协同任务：当前承办人驳回，退回发布人或首次转出人并写入驳回意见 */
  static workbenchTodoCardReject = (
    body: { cardId: string; opinion: string },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workbench-todo-card/reject`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );

  /** 设计任务应用工作台：操作日志列表（按 bizType 区分 WBS 协同 / 独立应用等） */
  static workspaceOperateLogList = (
    body: {
      bizType: string
      taskId: string | number
      projectId?: string | number
      appId?: string | number
      wbsId?: string | number
    },
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultListDeptResponseDTOModel, any>(
      {
        path: `/business-service/business/workspace-operate-log/list`,
        method: 'POST',
        type: ContentType.Json,
        body,
        secure: true,
        ...params,
      },
      CommonResultListDeptResponseDTOModel,
    );
}
