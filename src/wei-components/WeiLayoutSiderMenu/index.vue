<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { RouteRecord, RouteRecordRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface';
import type { MenuProps } from 'ant-design-vue';
import WeiLayoutSiderMenuItem from './components/WeiLayoutSiderMenuItem/index.vue';
import WeiLayoutSiderSubMenu from './components/WeiLayoutSiderSubMenu/index.vue';
import appStore from '@/store';
import { encryptValue } from '@/utils';
import { generateRandomNumberByTime } from '@/utils/tools';
type MenuRoute = RouteRecord | RouteRecordRaw;
withDefaults(defineProps<{ collapsed: boolean; mode?: MenuProps['mode'] }>(), { mode: 'inline' });

const route = useRoute();
const router = useRouter();

const vueRoutes = router.getRoutes();
const routes = appStore.usePermissionStore.routers as Array<RouteRecord>;
/**
 * 当前路由是否需要显示在菜单中
 * @param route route
 */
const isMenuRoute = (route: MenuRoute): boolean => !!route.meta && !!route.meta.title && !route.meta.hidden;
/** 获取顶层的所有路由 name map */
function getTopLevelRoutesNameMap() {
  const routesMap: { [routeName: string | symbol]: RouteRecord } = {};
  for (const route of vueRoutes) {
    if (route.name) routesMap[route.name] = route;
  }

  return routesMap;
}
/** 获取所有子路由并将子路由的 path 改为绝对路径 */
function getAllChildRoute() {
  const topLevelRoutesNameMap = getTopLevelRoutesNameMap();
  const routesMap: { [routePath: string]: RouteRecordRaw } = {};
  const queue: Array<RouteRecordRaw> = [...routes];
  while (queue.length) {
    const node = queue.shift();
    if (!node) break;
    const children = node.children;
    if (children) {
      queue.push(...children);
      for (const childRoute of children) {
        if (childRoute.meta && childRoute.name && topLevelRoutesNameMap[childRoute.name] && topLevelRoutesNameMap[childRoute.name].path.indexOf(childRoute.path) > 0) {
          // 将 path 改为顶层的 (full) path
          // children 中的路由的 path 可能是相对路径, 需要使用绝对路径
          childRoute.path = topLevelRoutesNameMap[childRoute.name].path;
          // console.log(childRoute.path, ' -> ', topLevelRoutesNameMap[childRoute.name].path)
        }
        routesMap[childRoute.path] = childRoute;
      }
    }
  }
  return routesMap;
}

/**
 * 过滤路由树, 移除不应该显示的路由
 * @param treeData treeData
 * @param predicate predicate
 */
function filterMenuRoute(treeData: MenuRoute[], predicate: (data: MenuRoute) => boolean): Array<MenuRoute> {
  /**
   * filter tree data
   * @param treeData tree data
   */
  function filter(treeData: MenuRoute[] | undefined): MenuRoute[] | undefined {
    if (!treeData?.length) return treeData;
    return treeData.filter(data => {
      if (!predicate(data)) return false;
      if (data.children) data.children = filter(data.children);
      return true;
    });
  }
  return filter(treeData) || [];
}

/** 获取菜单路由 */
function getMenuRoutes() {
  const childRoutesMap = getAllChildRoute();
  const _menuRoutes = [];
  for (const r of routes) {
    // 过滤掉所有非顶级路由

    // 2024年12月12日 去掉一层节点的路由 判断
    //  childRoutesMap[r.path]
    if (!isMenuRoute(r)) continue;
    let _route: RouteRecordRaw;
    if (r.meta.alwaysShow === false && Array.isArray(r.children) && r.children.length === 1 && (!Array.isArray(r.children[0].children) || r.children[0].children.length === 0)) {
      if (r.children[0].path === '') r.children[0].path = r.path; // path 为空时填充为父路由的 path
      // 处理 alwaysShow 配置, 值为 false 时若 children 只有一个子路由且子路由无下级路由, 则显示这个子菜单(目前只针对顶级路由)
      _route = r.children[0];
    } else {
      _route = r;
    }
    _menuRoutes.push(_route);
  }
  return filterMenuRoute(_menuRoutes, r => isMenuRoute(r)) as Array<RouteRecord>;
}

const menuRoutes = ref(getMenuRoutes());

// watch(routes, () => menuRoutes.value = getMenuRoutes())

const selectedKeys = ref<string[]>([route.path]);

/** 菜单栏是否显示在顶部(默认显示在左侧) */
const menuPosition: 'top' | 'left' = import.meta.env.VITE_APP_MENU_POSITION || 'left';
const openKeys = ref<string[]>(['10']);

/** 在菜单树中查找目标 path，返回需展开的父级 path（不含叶子自身） */
function findMenuAncestorKeys(targetPath: string): string[] {
  const tree = menuRoutes.value;
  const result: string[] = [];

  function dfs(nodes: MenuRoute[] | undefined, ancestorPaths: string[]): boolean {
    if (!nodes?.length) return false;
    for (const node of nodes) {
      if (node.meta?.hidden) continue;
      const p = node.path;
      if (p === targetPath) {
        result.push(...ancestorPaths);
        return true;
      }
      const children = node.children?.filter(c => !c.meta?.hidden) as MenuRoute[] | undefined;
      if (children?.length && dfs(children, [...ancestorPaths, p])) return true;
    }
    return false;
  }

  dfs(tree, []);
  return result;
}

/** init menu state */
function initMenuState() {
  const r = route;
  let selectedPath = r.matched[r.matched.length - 1]?.path ?? r.path;

  const metaActiveMenu = r.meta?.activeMenu as string | undefined;
  if (metaActiveMenu) {
    selectedPath = metaActiveMenu;
  } else if (r.name === 'ProductProjectEditor') {
    const q = r.query.activeMenu;
    if (typeof q === 'string' && q.length) {
      try {
        selectedPath = decodeURIComponent(q);
      } catch {
        /* keep selectedPath */
      }
    }
  }

  if (menuPosition === 'left') {
    const useMenuHighlight =
      !!metaActiveMenu || (r.name === 'ProductProjectEditor' && typeof r.query.activeMenu === 'string' && r.query.activeMenu.length > 0);
    if (useMenuHighlight) {
      openKeys.value = findMenuAncestorKeys(selectedPath);
    } else {
      openKeys.value = r.matched.map(m => m.path);
    }
  }

  selectedKeys.value = [selectedPath];
}

initMenuState();

watch(
  () => [route.path, route.fullPath, route.name, route.query.activeMenu, route.meta?.activeMenu] as const,
  () => initMenuState(),
);

/**
 * menu 点击事件函数
 * @param event event
 */
const onClickMenuItem: MenuClickEventHandler = event => {
  if (event.key.toString() === '/sysReport') {
    window.open(import.meta.env.VITE_KANBAN_SERVE, '_blank');
    return;
  } else {
    router.push({
      path: event.key.toString(),
      query: { parms: encryptValue(JSON.stringify(generateRandomNumberByTime())) },
    });
  }
};
</script>

<template>
  <a-menu
    v-model:open-keys="openKeys"
    v-model:selected-keys="selectedKeys"
    :mode="mode"
    :inline-collapsed="mode === 'inline' && collapsed"
    @click="onClickMenuItem">
    <template v-for="(item, key) in menuRoutes" :key="key">
      <template v-if="isMenuRoute(item)">
        <WeiLayoutSiderSubMenu v-if="item.children && item.children.length && item.children.some(subItem => !subItem.meta?.hidden)" :route="item" />
        <WeiLayoutSiderMenuItem v-else :route="item" />
      </template>
    </template>
  </a-menu>
</template>
