/**
 * 独立应用 / 原「设计任务应用」流程的 API 聚合（与 WBS/计算 解耦）。
 * 业务页通过本模块访问接口，避免在组件里写死 path。
 */
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务'
import type { RequestParams } from '@/api/tags/http-client'

export function useStandaloneDesignApi() {
  return {
    appList: (query: { taskId: string | number }, params?: RequestParams) =>
      AdminApiSystemProcessTask.appList(query, params),
    projectPages: (query: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.projectPages(query, params),
    nodePageDetail: (query: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.nodePageDetail(query, params),
    taskParamMap: (query: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.taskParamMap(query, params),
    saveParams: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.saveParams(body, params),
    nextStep: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.nextStep(body, params),
    getXmlInfo: (query: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.getXmlInfo(query, params),
    exportReport: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.exportReport(body, params),
    evaluateImpact: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.evaluateImpact(body, params),
    reopenLastNodeForChange: (body: Record<string, unknown>, params?: RequestParams) =>
      AdminApiSystemProcessTask.reopenLastNodeForChange(body, params),
  }
}
