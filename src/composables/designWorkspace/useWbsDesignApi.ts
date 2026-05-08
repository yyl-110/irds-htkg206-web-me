/**
 * WBS 协同设计 API（project-wbs/task-param*），与独立应用 standalone-app 完全分离。
 */
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台'
import type { RequestParams } from '@/api/tags/http-client'

export function useWbsDesignApi() {
  return {
    /**
     * 项目 WBS 树（节点进度/状态等来自行字段，非参数表）
     * @param query
     * @param query.projectId
     * @param params
     */
    treeList: (query: { projectId: string | number }, params?: RequestParams) =>
      AdminApiProjectTemp.projectWbsTreeList(query, params),

    collabProjectPages: (
      body: { projectId: string | number; taskId: string | number; bpmnElementId?: string },
      params?: RequestParams,
    ) => AdminApiProjectTemp.wbsCollabProjectPages(body, params),

    collabNodePageDetail: (
      body: { projectId: string | number; taskId: string | number; bpmnElementId: string },
      params?: RequestParams,
    ) => AdminApiProjectTemp.wbsCollabNodePageDetail(body, params),

    listTaskParams: (
      query: { projectId: string | number, taskId: string | number },
      params?: RequestParams,
    ) => AdminApiProjectTemp.wbsTaskParamList(query, params),

    getParamMap: (
      query: { projectId: string | number, taskId: string | number },
      params?: RequestParams,
    ) => AdminApiProjectTemp.wbsTaskParamMap(query, params),

    saveParams: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiProjectTemp.wbsTaskParamSave(body, params),

    confirmSyncFromUpstream: (
      body: Parameters<typeof AdminApiProjectTemp.wbsTaskParamConfirmSync>[0],
      params?: RequestParams,
    ) => AdminApiProjectTemp.wbsTaskParamConfirmSync(body, params),

    evaluateImpact: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiProjectTemp.wbsTaskParamEvaluateImpact(body, params),
  }
}
