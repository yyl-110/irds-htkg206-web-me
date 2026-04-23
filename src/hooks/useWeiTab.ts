import { computed, ref } from 'vue';
import type { RouteLocationMatched, RouteLocationNormalizedLoaded } from 'vue-router';
import { useEventBus } from '@vueuse/core';
import useRouteCache from './useRouteCache';
// import type { any } from '@/wei-components/WeiPageTabs/typings';
import { WeiPageTabMenus } from '@/wei-components/WeiPageTabs/typings';
import { router } from '@/router';
import { CloseLayoutTabEventKey, SetTabTitleEventKey } from '@/utils/EventBus';

// const route = useRoute()
// const router = useRouter()
const tabs = ref<any[]>([]);

/** tabs 改动记录 */
interface TabChangeRecord {
  /** 新增的 tabs */
  addedTabs: Array<any>;
  /** 移除的 tabs */
  removedTabs: Array<any>;
}

/** 当前最新的 tabs 改动记录 */
const tabChangeRecord = ref<TabChangeRecord>({ addedTabs: [], removedTabs: [] });
/** 改动前 tabs 的状态 */
let oldTabs: any[] = [];

/**
 * findDifference
 * @description 辅助函数，用于查找第一个数组中不在第二个数组中的项
 * @param firstArray - 要检查的数组
 * @param secondArray - 用于对比的数组
 * @returns 仅在第一个数组中找到的项的数组
 */
function findDifference(firstArray: Array<any>, secondArray: Array<any>) {
  return firstArray.filter(item => !secondArray.some(tab => tab.tabKey === item.tabKey));
}
/**
 * diffTabs
 * @description 对比 newTabs 和 oldTabs 数组，根据 tabKey 找出新增和被删除的项
 * @param newTabs - 新的标签数组
 * @param oldTabs - 旧的标签数组
 * @returns 包含新增项和被删除项的对象
 */
function diffTabs(newTabs: Array<any>, oldTabs: Array<any>): TabChangeRecord {
  const addedTabs = findDifference(newTabs, oldTabs);
  const removedTabs = findDifference(oldTabs, newTabs);

  return { addedTabs, removedTabs };
}

watch(
  () => tabs.value,
  () => {
    const diffRecords = diffTabs(tabs.value, oldTabs);
    // 监听路由变化, 将新增和移除的路由保存至 tabChangeRecord 中
    if (diffRecords.addedTabs.length > 0 || diffRecords.removedTabs.length > 0) {
      tabChangeRecord.value = diffRecords;
      oldTabs = [...tabs.value];
    }
  },
  {
    deep: true,
  }
);

const curTabKey = ref('');
/** 当前标签页 */
const currentTab = computed(() => tabs.value.find(t => t.tabKey === curTabKey.value) || tabs.value[0]);
const { getTabNameByFullPath, removeCache, clearAll } = useRouteCache();

/**
 * 点击tab
 * @param activeKey
 */
function clickTab(activeKey: string | number) {
  const tabIndex = tabs.value.findIndex(tab => tab.path === activeKey);

  const tab = tabs.value[tabIndex];
  if (tab.tabKey !== curTabKey.value) gotoTab(tab);

  // if (!pane.index) return

  // const tab = tabs.value[Number(pane.index)]
  // if (tab.tabKey !== curTabKey.value) {
  //   gotoTab(tab)
  // }
}

/**
 * onClickMenu
 * @param item
 * @param tab
 */
function onClickMenu(item: WeiPageTabMenus, tab: any = currentTab.value) {
  const key = tab ? tab.tabKey : curTabKey.value;
  switch (item) {
    case WeiPageTabMenus.refresh:
      refreshPage(tab?.componentName);
      break;
    case WeiPageTabMenus.close:
      removeTab(key);
      break;
    case WeiPageTabMenus.closeLeft:
      closeLeftOrRightTabs(tab);
      break;
    case WeiPageTabMenus.closeRight:
      closeLeftOrRightTabs(tab, true);
      break;
    case WeiPageTabMenus.closeOther:
      closeOtherTabs(tab ? tab.tabKey : curTabKey.value);
      break;
    case WeiPageTabMenus.closeAll:
      closeOtherTabs(tab ? tab.tabKey : curTabKey.value);
      break;
  }
}

/**
 * 移除tab
 * @param key
 */
async function removeTab(key: string = '') {
  // 剩下一个时不能删
  if (tabs.value.length === 1) return;

  const index = tabs.value.findIndex(tab => tab.tabKey === key);
  if (index < 0) return;

  const tab = tabs.value[index];
  tabs.value.splice(index, 1);

  // 当移除的是当前tab，则自动切换到最后一个tab（根据项目设置）
  if (tab.tabKey === curTabKey.value) {
    const lastTab = tabs.value[tabs.value.length - 1];
    lastTab && gotoTab(lastTab);
  }
  // 同时移除tab缓存
  await removeCache(tab.componentName || '');
}

/**
 * 跳转tab页面
 * @param tab
 */
async function gotoTab(tab: any) {
  await router.push({
    path: tab.path,
    query: tab.query,
    hash: tab.hash,
  });
}

/**
 * 刷新tab页面
 * @param event
 * @param tab
 */
async function refreshTab(event: MouseEvent, tab: any) {
  event.stopPropagation();
  // 先跳转到空白页面，然后清除tab页缓存，接着返回到tab页【最后useRouteCache的collectCaches 方法会重新收集缓存】
  await refreshPage(tab.componentName || '');

  // TODO: 通过layoutStore.isRenderTab 来刷新tab页面会报错，该方案不行（Vue3的bug，详见https://github.com/vuejs/core/issues/5590）
  // layoutStore.setIsRenderTab(false)
  // await removeCacheEntry(tab.componentName || '')
  // layoutStore.setIsRenderTab(true)
}

/**
 * refreshPage
 * @param componentName
 */
async function refreshPage(componentName: string = '') {
  await router.push('/_empty');
  await removeCache(componentName || '');
  router.go(-1);
}

/** refreshCurrentTab */
function refreshCurrentTab() {
  if (!curTabKey.value) return;
  const tab = tabs.value.find(tab => tab.tabKey === curTabKey.value);
  refreshPage(tab?.componentName || '');
}

/**
 * 关闭非当前页的所有tab页签
 * @param key
 */
async function closeOtherTabs(key: string) {
  tabs.value
    .filter(tab => tab.tabKey !== key)
    .forEach(async tab => {
      if (tab.tabKey === curTabKey.value) {
        const _tab = tabs.value.find(t => t.tabKey === key);
        _tab && gotoTab(_tab);
      } else {
        await removeCache(tab.componentName);
      }
    });
  tabs.value = tabs.value.filter(tab => tab.tabKey === key);
}

/**
 * 关闭左侧或右侧所有标签页
 * @param key 当前页面 Key
 * @param tab
 * @param isRight 是否关闭右侧标签页, 默认左侧
 */
async function closeLeftOrRightTabs(tab: any, isRight?: boolean) {
  const key = tab.tabKey;
  let findTabIndex = -1;
  for (const [index, _tab] of tabs.value.entries()) {
    if (_tab.tabKey === key) findTabIndex = index;
    if (_tab.tabKey !== tab.tabKey && ((isRight && findTabIndex !== -1) || (!isRight && findTabIndex === -1))) {
      // 若删除当前页面, 则跳转至当前点击的页面
      if (_tab.tabKey === curTabKey.value) await gotoTab(tab);
      else await removeCache(_tab.componentName);
    }
  }
  const start = isRight ? findTabIndex + 1 : 0;
  const deleteCount = isRight ? tabs.value.length - start : findTabIndex;
  tabs.value.splice(start, deleteCount);
}

/**
 * 默认关闭当前tab
 * @param tabKey
 */
async function closeLayoutTab(tabKey: string = curTabKey.value) {
  const index = tabs.value.findIndex(tab => tab.tabKey === tabKey);
  if (index > -1) {
    await removeCache(tabs.value[index].componentName || '');
    tabs.value.splice(index, 1);
  }
}

/**
 * setCurTabTitle
 * @param title
 */
function setCurTabTitle(title: string) {
  const curTab = tabs.value.find(tab => tab.tabKey === curTabKey.value);
  if (curTab) curTab.title = title;
}

const closeEventBus = useEventBus(CloseLayoutTabEventKey);
const setTabTitleEventBus = useEventBus(SetTabTitleEventKey);

closeEventBus.on(event => closeLayoutTab(event));
setTabTitleEventBus.on(event => setCurTabTitle(event));

interface UseWeiTabOptions {
  tabRouteViewDepth?: number;
  /**
   * tab 被移除时的事件监听函数
   * @since 3.0.5
   */
  onTabsRemoved?: (tabs: Array<any>) => void;
}

/**
 * 管理 tabs
 * @param tabRouteViewDepthOrOptions
 * @param getTabKey
 * @param tabTitleKey
 * @param options 配置项
 */
export function useWeiTab(
  tabRouteViewDepthOrOptions?: number | UseWeiTabOptions,
  getTabKey: (routeMatch: RouteLocationMatched, route: RouteLocationNormalizedLoaded) => string = (routeMatch: RouteLocationMatched, _route: RouteLocationNormalizedLoaded) =>
    routeMatch.path,
  tabTitleKey: string = 'title'
) {
  const options = typeof tabRouteViewDepthOrOptions === 'number' ? undefined : tabRouteViewDepthOrOptions;
  const tabRouteViewDepth =
    typeof tabRouteViewDepthOrOptions === 'number' ? tabRouteViewDepthOrOptions : tabRouteViewDepthOrOptions ? tabRouteViewDepthOrOptions.tabRouteViewDepth : undefined;
  /** 切换tab页签 */
  async function changeCurTab() {
    const route = router.currentRoute.value;
    // 当前路由信息
    const { path, query, params, hash, matched, fullPath } = route;
    // tab标签页路由信息：meta、componentName
    const routeMatch = matched[tabRouteViewDepth ? tabRouteViewDepth - 1 : matched.length - 1];
    const meta = routeMatch.meta;
    // const componentDef: any = routeMatch.components?.default
    // const componentName = componentDef?.name || componentDef?.__name
    const componentName = getTabNameByFullPath(route);
    // 获取tab标签页信息：tabKey标签页key值；title-标签页标题；tab-存在的标签页
    const tabKey = getTabKey(routeMatch, route);
    const title = String(meta[tabTitleKey] || '');
    let tab = tabs.value.find(tab => tab.tabKey === tabKey);

    if (path === '/_empty') return; // '/_empty'为tab刷新用来中转页面，不需要加tab页签
    if (!tabKey) {
      // tabKey默认为路由的name值
      console.warn(`LayoutTabs组件：${path} 路由没有匹配的tab标签页，如有需要请配置tab标签页的key值`);
      return;
    }

    // 同一个路由，但是新旧路径不同时，需要清除路由缓存。例如route.path配置为 '/detail/:id'时路径会不同
    if (tab && tab.fullPath !== fullPath) {
      await removeCache(tab.componentName || '');
      tabs.value = tabs.value.filter(t => t.fullPath !== tab?.fullPath);
      tab = undefined;
    }

    const newTab = {
      tabKey,
      title: tab?.title || title,
      path,
      params,
      query,
      hash,
      fullPath,
      componentName,
    };
    tab ? Object.assign(tab, newTab) : tabs.value.push(newTab);
    curTabKey.value = tabKey;
  }
  /**
   * 清空标签页及路由缓存
   * @param clearTabs 是否清空 tabs
   */
  const clear = async (clearTabs?: boolean) => {
    await clearAll();
    if (clearTabs) tabs.value = [];
    curTabKey.value = '';
  };
  if (options && options.onTabsRemoved) {
    watch(
      () => tabChangeRecord.value,
      () => {
        if (options.onTabsRemoved && tabChangeRecord.value.removedTabs.length) options.onTabsRemoved([...tabChangeRecord.value.removedTabs]);
      }
    );
  }
  return {
    tabs,
    clear,
    curTabKey,
    currentTab,
    changeCurTab,
    clickTab,
    onClickMenu,
    removeTab,
    gotoTab,
    refreshTab,
    refreshPage,
    refreshCurrentTab,
    closeOtherTabs,
    closeLeftOrRightTabs,
    closeLayoutTab,
    setCurTabTitle,
    /** 当前最新的 tabs 改动记录 */
    tabChangeRecord,
  };
}
