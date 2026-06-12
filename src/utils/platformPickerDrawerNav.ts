import type { RouteLocationNormalizedLoaded, RouteRecordNameGeneric } from 'vue-router'
import type { ProductPlatformListItem } from '@/utils/productPlatformImage'

/** 顶部 Tab 切回带平台选择抽屉的页面时跳过弹窗 */
export const PLATFORM_PICKER_SKIP_DRAWER_ON_TAB = 'platform-picker-skip-drawer-on-tab'

/** @deprecated 使用 PLATFORM_PICKER_SKIP_DRAWER_ON_TAB */
export const MODULE_LIB_SKIP_DRAWER_ON_TAB = PLATFORM_PICKER_SKIP_DRAWER_ON_TAB

/** 动态路由 name 中的 component 片段（与 routerHelper.getRouteNameByRoute 一致） */
/** 较长路径须排在前面，避免 designTaskApplication 被 designTask 误匹配 */
const PLATFORM_PICKER_COMPONENT_MARKERS = [
  'product/module/application',
  'product/designTaskApplication',
  'product/module/index',
  'product/activityPage',
  'product/parameter',
  'product/productTemp',
  'product/designTask',
  'product/project',
  'product/check/sys',
  'product/check/use',
] as const

type PlatformPickerRouteLike = {
  name?: RouteRecordNameGeneric | null
  path?: string
  matched?: RouteLocationNormalizedLoaded['matched']
}

function routeNameHasPlatformPickerMarker(name: string): boolean {
  return PLATFORM_PICKER_COMPONENT_MARKERS.some(marker => name.includes(marker))
}

/** 是否为带平台/分类选择抽屉的页面 */
export function isPlatformPickerDrawerRoute(route: PlatformPickerRouteLike): boolean {
  const name = String(route.name ?? '')
  if (routeNameHasPlatformPickerMarker(name))
    return true

  return route.matched?.some(record => routeNameHasPlatformPickerMarker(String(record.name ?? ''))) ?? false
}

/** @deprecated 使用 isPlatformPickerDrawerRoute */
export const isModuleLibraryRoute = isPlatformPickerDrawerRoute

/** 顶部 Tab 切换至上述页面前调用 */
export function markSkipPlatformPickerDrawerOnTab(): void {
  sessionStorage.setItem(PLATFORM_PICKER_SKIP_DRAWER_ON_TAB, '1')
}

/** @deprecated 使用 markSkipPlatformPickerDrawerOnTab */
export const markSkipModuleLibDrawerOnTab = markSkipPlatformPickerDrawerOnTab

/** 消费 Tab 跳过标记；存在时返回 true 并清除 */
export function consumeSkipPlatformPickerDrawerOnTab(): boolean {
  const skip = sessionStorage.getItem(PLATFORM_PICKER_SKIP_DRAWER_ON_TAB) === '1'
  if (skip)
    sessionStorage.removeItem(PLATFORM_PICKER_SKIP_DRAWER_ON_TAB)
  return skip
}

/** 产品平台选择抽屉定位（须避开左侧侧栏，与模型库 drawerStyle 一致） */
export function createPlatformPickerDrawerStyle(asideWidthStyle: string) {
  return {
    marginLeft: asideWidthStyle || '201px',
    marginTop: '0px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh)',
  }
}

/** @deprecated 使用 consumeSkipPlatformPickerDrawerOnTab */
export const consumeSkipModuleLibDrawerOnTab = consumeSkipPlatformPickerDrawerOnTab

/** 将接口返回的平台列表规范为数组 */
export function normalizePlatformPickerList(data: unknown): ProductPlatformListItem[] {
  if (data == null)
    return []
  return (Array.isArray(data) ? data : [data]) as ProductPlatformListItem[]
}

/** 列表仅一项时跳过平台选择抽屉，直接走选中逻辑 */
export function shouldAutoSelectSinglePlatform(list: ProductPlatformListItem[]): boolean {
  return list.length === 1
}

/** 模型库抽屉：扁平化所有可点击的平台项（一级无子节点或二级子项） */
export function flattenModuleDrawerSelectablePlatforms(list: unknown[]): ProductPlatformListItem[] {
  const items: ProductPlatformListItem[] = []
  for (const raw of list || []) {
    const item = raw as ProductPlatformListItem & { children?: unknown[] }
    const children = Array.isArray(item?.children) ? item.children : []
    if (children.length === 0)
      items.push(item)
    else
      children.forEach(child => items.push(child as ProductPlatformListItem))
  }
  return items
}
