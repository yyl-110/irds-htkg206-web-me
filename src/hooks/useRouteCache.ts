import { nextTick, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute } from 'vue-router'
import { getRouteCacheKey } from '@/utils/routeCacheKey'

const caches = ref<string[]>([])
let collect = false

const WRAPPER_COMPONENT_NAME_PREFIX = 'Tab'
let tabsIncrementKey = 0
/**
 * 路由缓存键 => keep-alive wrapper 名称（Tab1 / Tab2 …）
 */
let tabsNameMap: Record<string, string> = {}
/** 所有的 wrapper 组件 */
let wrapperMap: Record<string, object> = {}

/** getTabName */
const getTabName = () => WRAPPER_COMPONENT_NAME_PREFIX + ++tabsIncrementKey

/**
 * 根据路由获取 wrapper component name（同页重复点击菜单不新建实例）
 */
function getTabNameByRoute(route: RouteLocationNormalizedLoaded) {
  const cacheKey = getRouteCacheKey(route)
  return tabsNameMap[cacheKey] || (tabsNameMap[cacheKey] = getTabName())
}

/** @deprecated 请使用 getTabNameByRoute；保留别名避免外部引用断裂 */
const getTabNameByFullPath = getTabNameByRoute

function clearTabsNameMapByComponentName(componentName: string) {
  for (const key of Object.keys(tabsNameMap)) {
    if (tabsNameMap[key] === componentName)
      Reflect.deleteProperty(tabsNameMap, key)
  }
}

/**
 * useRouteCache
 */
export default function useRouteCache() {
  const route = useRoute()

  /**
   * 收集当前路由相关的缓存
   */
  function collectRouteCaches() {
    const componentName = getTabNameByRoute(route)
    if (route.meta.keepAlive) {
      if (!componentName) {
        console.warn(`${route.path} 路由的组件名称name为空`)
        return
      }
      addCache(componentName)
    }
    else {
      removeCache(componentName)
    }
  }

  /**
   * 收集缓存（通过监听）
   */
  function collectCaches() {
    if (collect) {
      console.warn('useRouteCache：不需要重复收集缓存')
      return
    }
    collect = true
    watch(() => getRouteCacheKey(route), collectRouteCaches, {
      immediate: true,
    })
  }

  /**
   * 添加缓存的路由组件
   * @param componentName
   */
  function addCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(addCache)
      return
    }

    if (!componentName || caches.value.includes(componentName))
      return
    caches.value.push(componentName)
  }

  /**
   * 移除缓存的路由组件
   * @param componentName
   */
  async function removeCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      for (const name of componentName)
        await removeCache(name)
      return
    }

    const index = caches.value.indexOf(componentName)
    let removeItem: Array<string> | null = null
    if (index > -1) {
      clearTabsNameMapByComponentName(componentName)
      removeItem = caches.value.splice(index, 1)
    }
    else {
      clearTabsNameMapByComponentName(componentName)
    }
    await nextTick()
    Reflect.deleteProperty(wrapperMap, componentName)
    return removeItem
  }

  /**
   * 移除缓存的路由组件的实例
   * @param componentName
   */
  async function removeCacheEntry(componentName: string) {
    if (await removeCache(componentName))
      await nextTick()
  }

  /**
   * 清除缓存的路由组件的实例
   */
  async function clearEntry() {
    await Promise.all(caches.value.slice().map(key => removeCacheEntry(key)))
  }

  /** 清除所有路由页面缓存 */
  async function clearAll() {
    await clearEntry()
    tabsNameMap = {}
    wrapperMap = {}
    tabsIncrementKey = 0
  }

  return {
    collectCaches,
    caches,
    addCache,
    removeCache,
    removeCacheEntry,
    clearEntry,
    getTabNameByRoute,
    getTabNameByFullPath,
    wrapperMap,
    clearAll,
  }
}
