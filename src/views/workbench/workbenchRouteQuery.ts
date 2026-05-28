import {
  WORKBENCH_AUDIT_SECONDARY_TABS,
  WORKBENCH_SECONDARY_TABS,
  WORKBENCH_TABS,
} from './data'

export type WorkbenchTopTab = (typeof WORKBENCH_TABS)[number]['name']
export type WorkbenchAuditSecondaryTab = (typeof WORKBENCH_AUDIT_SECONDARY_TABS)[number]['value']
export type WorkbenchTodoSecondaryTab = (typeof WORKBENCH_SECONDARY_TABS)[number]['value']

const TOP_TAB_SET = new Set<string>(WORKBENCH_TABS.map(tab => tab.name))
const AUDIT_SECONDARY_SET = new Set<string>(WORKBENCH_AUDIT_SECONDARY_TABS.map(tab => tab.value))
const TODO_SECONDARY_SET = new Set<string>(WORKBENCH_SECONDARY_TABS.map(tab => tab.value))

/** 跳转流程详情时携带，供关闭后回到工作台原 Tab */
export function buildWorkbenchReturnQuery(input: {
  activeName: WorkbenchTopTab
  auditSecondaryFilter?: WorkbenchAuditSecondaryTab
  secondaryFilter?: WorkbenchTodoSecondaryTab
}) {
  const query: Record<string, string> = {
    activeName: input.activeName,
  }
  if (input.activeName === 'process' && input.auditSecondaryFilter) {
    query.auditSecondaryFilter = input.auditSecondaryFilter
  }
  if (input.activeName === 'todo' && input.secondaryFilter) {
    query.secondaryFilter = input.secondaryFilter
  }
  return query
}

/** 从流程详情路由 query 提取工作台返回参数 */
export function pickWorkbenchReturnQueryFromRoute(routeQuery: Record<string, unknown>) {
  const query: Record<string, string> = {}

  const activeName = routeQuery.activeName
  if (typeof activeName === 'string' && TOP_TAB_SET.has(activeName)) {
    query.activeName = activeName
  }

  const auditSecondaryFilter = routeQuery.auditSecondaryFilter
  if (typeof auditSecondaryFilter === 'string' && AUDIT_SECONDARY_SET.has(auditSecondaryFilter)) {
    query.auditSecondaryFilter = auditSecondaryFilter
  }

  const secondaryFilter = routeQuery.secondaryFilter
  if (typeof secondaryFilter === 'string' && TODO_SECONDARY_SET.has(secondaryFilter)) {
    query.secondaryFilter = secondaryFilter
  }

  return query
}

export function isWorkbenchReturnRouteQuery(routeQuery: Record<string, unknown>) {
  const activeName = routeQuery.activeName
  return typeof activeName === 'string' && TOP_TAB_SET.has(activeName)
}

type ProcessDetailRouteContext = {
  name?: string | symbol | null
  meta?: Record<string, unknown>
  query: Record<string, unknown>
}

export type ProcessDetailBackRouteLocation = {
  name?: string
  path?: string
  query?: Record<string, string>
}

/** 流程详情页关闭/返回：工作台 / 流程实例 / 流程任务 */
export function resolveProcessInstanceDetailBackRoute(
  route: ProcessDetailRouteContext,
): ProcessDetailBackRouteLocation {
  if (isWorkbenchReturnRouteQuery(route.query)) {
    const query = pickWorkbenchReturnQueryFromRoute(route.query)
    return {
      name: '/home/workbench',
      query: Object.keys(query).length ? query : { activeName: 'process' },
    }
  }

  if (route.name === 'BpmProcessInstanceDetailA' || route.meta?.activeMenu === '/bpm/task') {
    return { path: '/bpm/task' }
  }

  if (route.name === 'BpmProcessInstanceDetail' || route.meta?.activeMenu === '/bpm/processInstance') {
    return { path: '/bpm/processInstance' }
  }

  return {
    name: '/home/workbench',
    query: { activeName: 'process' },
  }
}

export function parseWorkbenchRouteQuery(routeQuery: Record<string, unknown>) {
  const result: {
    activeName?: WorkbenchTopTab
    auditSecondaryFilter?: WorkbenchAuditSecondaryTab
    secondaryFilter?: WorkbenchTodoSecondaryTab
  } = {}

  const activeName = routeQuery.activeName
  if (typeof activeName === 'string' && TOP_TAB_SET.has(activeName)) {
    result.activeName = activeName as WorkbenchTopTab
  }

  const auditSecondaryFilter = routeQuery.auditSecondaryFilter
  if (typeof auditSecondaryFilter === 'string' && AUDIT_SECONDARY_SET.has(auditSecondaryFilter)) {
    result.auditSecondaryFilter = auditSecondaryFilter as WorkbenchAuditSecondaryTab
  }

  const secondaryFilter = routeQuery.secondaryFilter
  if (typeof secondaryFilter === 'string' && TODO_SECONDARY_SET.has(secondaryFilter)) {
    result.secondaryFilter = secondaryFilter as WorkbenchTodoSecondaryTab
  }

  return result
}
