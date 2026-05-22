import type { LocationQuery, RouteLocationNormalizedLoaded } from 'vue-router'

/** 菜单防重复导航用的 query，不参与 Tab / keep-alive 实例区分 */
export const MENU_BYPASS_QUERY_KEY = 'parms'

/**
 * 生成稳定的路由缓存键（忽略菜单用 parms，保留业务 query / hash）
 */
export function getRouteCacheKey(route: RouteLocationNormalizedLoaded): string {
  const query = omitMenuBypassQuery(route.query)
  const queryPart = serializeQuery(query)
  const hash = route.hash || ''
  return `${route.path}${queryPart}${hash}`
}

/** 去掉菜单 bypass 字段后的 query */
export function omitMenuBypassQuery(query: LocationQuery): LocationQuery {
  if (!query || !Reflect.has(query, MENU_BYPASS_QUERY_KEY))
    return query
  const next: LocationQuery = { ...query }
  Reflect.deleteProperty(next, MENU_BYPASS_QUERY_KEY)
  return next
}

function serializeQuery(query: LocationQuery): string {
  const keys = Object.keys(query).sort()
  if (!keys.length)
    return ''
  const parts = keys.map((key) => {
    const raw = query[key]
    const value = Array.isArray(raw) ? raw.map(String).join(',') : raw == null ? '' : String(raw)
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  })
  return `?${parts.join('&')}`
}

/**
 * 侧栏点击目标 path 与当前路由是否为同一页面（仅比较 path，不含 parms）
 */
export function isSameMenuRoutePath(
  targetPath: string,
  current: RouteLocationNormalizedLoaded,
): boolean {
  return targetPath === current.path
}
