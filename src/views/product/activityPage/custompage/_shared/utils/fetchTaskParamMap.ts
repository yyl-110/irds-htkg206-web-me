import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import {
  parseTaskParamMapResponse,
  syncFlowContextFromTaskParamMap,
  type CustomPageSavedParamRow,
  type CustomPageSavedTableRow,
} from './taskParamMapMerge';

/** 从路由 query 调用 task-param-map，并同步 flowContext */
export async function fetchTaskParamMapFromRoute(
  route: RouteLocationNormalizedLoaded,
): Promise<{ saved: CustomPageSavedParamRow[]; savedTables: CustomPageSavedTableRow[] }> {
  const taskId = String(route.query.taskId ?? '').trim();
  const appId = String(route.query.appId ?? '').trim();
  const appCode = String(route.query.appCode ?? '').trim();

  if (!taskId || (!appId && !appCode)) {
    return { saved: [], savedTables: [] };
  }

  const paramQuery: Record<string, string> = { taskId };
  if (appId) paramQuery.appId = appId;
  else paramQuery.appCode = appCode;

  try {
    const mapRes = await AdminApiSystemProcessTask.taskParamMap(paramQuery);
    const parsed = parseTaskParamMapResponse(mapRes?.data?.data);
    syncFlowContextFromTaskParamMap(parsed.saved, parsed.savedTables);
    return parsed;
  } catch {
    return { saved: [], savedTables: [] };
  }
}
