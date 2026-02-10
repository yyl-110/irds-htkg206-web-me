import { nextTick, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute } from 'vue-router'

const caches = ref<string[]>([])
let collect = false

const WRAPPER_COMPONENT_NAME_PREFIX = 'Tab'
let tabsIncrementKey = 0
/**
 * 路由页面组件 => keep-alive 使用的 fullPath => tab name 映射 map
 * @description 值为自增的 string, 例如 'Tab1' / 'Tab2', 数值为当前的 `tabsIncrementKey`
 */
let tabsNameMap: { [fullPath: string]: string } = {}
/** 所有的 wrapper 组件 */
let wrapperMap: { [wrapperComponentName: string]: object } = {}

/** getTabName */
const getTabName = () => WRAPPER_COMPONENT_NAME_PREFIX + ++tabsIncrementKey
/**
 * 根据路由组件获取 wrapper component name, 若不存在则创建
 * @param component route-view 的路由页面组件
 * @param route
 * @returns 对应的 wrapper component name
 */
function getTabNameByFullPath(route: RouteLocationNormalizedLoaded) {
  return tabsNameMap[route.fullPath] || (tabsNameMap[route.fullPath] = getTabName())
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
    // 改为只缓存当前页面对应的页面组件, 防止多级路由的页面组件被意外销毁
    const componentName = getTabNameByFullPath(route)
    // 配置了meta.keepAlive的路由组件添加到缓存
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
    // route.matched.forEach((routeMatch) => {
    //   const componentDef: any = routeMatch.components?.default
    //   if (!componentDef)
    //     return
    //   const componentName = getTabNameByFullPath(route)

    //   // 配置了meta.keepAlive的路由组件添加到缓存
    //   if (routeMatch.meta.keepAlive) {
    //     if (!componentName) {
    //       console.warn(`${routeMatch.path} 路由的组件名称name为空`)
    //       return
    //     }
    //     addCache(componentName)
    //   }
    //   else {
    //     console.log(2, routeMatch, componentName)
    //     removeCache(componentName)
    //   }
    // })
  }

  // // 检测路由组件名称是否重复（组件重名会缓存到不该缓存的组件，而且不容易排查问题，所以开发环境时检测重名）
  // function checkRouteComponentName(name: string, file: string) {
  //   if (cmpNames[name]) {
  //     if (cmpNames[name] !== file) {
  //       console.warn(`${file} 与${cmpNames[name]} 组件名称重复： ${name}`)
  //     }
  //   } else {
  //     cmpNames[name] = file
  //   }
  // }

  /**
   * 收集缓存（通过监听）
   */
  function collectCaches() {
    if (collect) {
      console.warn('useRouteCache：不需要重复收集缓存')
      return
    }
    collect = true
    watch(() => route.path, collectRouteCaches, {
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
    // console.log('缓存路由组件：', componentName)
  }

  /**
   * 移除缓存的路由组件
   * @param componentName
   */
  async function removeCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(removeCache)
      return
    }

    const index = caches.value.indexOf(componentName)
    let removeItem: Array<string> | null = null
    if (index > -1) {
      // console.log('清除缓存的路由组件：', componentName)
      Reflect.deleteProperty(tabsNameMap, componentName)
      removeItem = caches.value.splice(index, 1)
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
      // addCache(componentName)
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
    // caches.value = []
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
    getTabNameByFullPath,
    wrapperMap,
    clearAll,
  }
}
