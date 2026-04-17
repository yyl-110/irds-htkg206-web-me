import type { RouteLocationNormalized, RouteRecordNormalized, RouteRecordRaw, Router } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { cloneDeep, get, omit } from 'lodash-es';
import { isUrl } from '@/utils/is';

const modules = import.meta.glob('../views/**/*.{vue,tsx}');
/**
 * 注册一个异步组件
 * @param componentPath 例:/bpm/oa/leave/detail
 */
export function registerComponent(componentPath: string) {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      // 使用异步组件的方式来动态加载组件
      // @ts-expect-error glob files
      return defineAsyncComponent(modules[item]);
    }
  }
}
/** Layout */
export const Layout = () => import('@/views/Main.vue');

/** getParentLayout */
export function getParentLayout() {
  return () =>
    new Promise(resolve => {
      resolve({
        name: 'ParentLayout',
      });
    });
}

/**
 * 按照路由中meta下的rank等级升序来排序路由
 * @param arr
 */
export function ascending(arr: any[]) {
  arr.forEach(v => {
    if (v?.meta?.rank === null) v.meta.rank = undefined;
    if (v?.meta?.rank === 0) {
      if (v.name !== 'home' && v.path !== '/') console.warn('rank only the home page can be 0');
    }
  });
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
}

/**
 * get raw route
 * @param route
 */
export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}
/**
 * 获取当前路由的 name, 可以唯一标识此路由
 * @param route 后端返回的路由信息
 * @param isParent 当前节点是否需要指定为父级节点(用于顶级非目录路由)
 * @returns 当前路由的 name
 */
export function getRouteNameByRoute(route: AppCustomRouteRecordRaw, isParent: boolean = false) {
  const id = get(route, 'id');
  return `[${id}]${route.component}${isParent ? '[Parent]' : ''}`;
}
/**
 * 从后端获取的菜单数据中获取本地文件的路径
 * @param route
 */
export const getComponentPathByRoute = (route: AppCustomRouteRecordRaw) => (route.component ? route.component : route.path);
/**
 * 从后端获取的菜单数据中获取对应的本地 vue 文件(vue-router 中使用的 component)
 * @param route
 */
export function getComponentByRoute(route: AppCustomRouteRecordRaw) {
  const routePath = getComponentPathByRoute(route);
  for (const path in modules) {
    if (path.indexOf(routePath) > 0) return modules[path];
  }
}
/**
 * 后端控制路由生成
 * @param routes
 */
export function generateRoute(routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = [];
  // const modulesRoutesKeys = Object.keys(modules)
  for (const route of routes) {
    const meta = {
      title: route.name,
      icon: route.icon,
      hidden: !route.visible,
      noCache: !route.keepAlive,
      keepAlive: route.keepAlive,
      id: route.id,
      parentId: route.parentId,
      alwaysShow: route.children && route.children.length === 1 && (route.alwaysShow !== undefined ? route.alwaysShow : true),
    };
    // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
    let data: AppRouteRecordRaw = {
      path: route.path,
      name: getRouteNameByRoute(route),
      // name:
      //   route.componentName && route.componentName.length > 0
      //     ? route.componentName
      //     : toCamelCase(route.path, true),
      redirect: route.redirect,
      meta,
    };
    if (!route.path || !route.name) {
      // 没有填写路由 path 或 name 的菜单
      console.error('generateRoute(): ', 'Invalid menu', route);
      continue;
    }
    // 处理顶级非目录路由
    if (!route.children && route.parentId == 0 && route.component) {
      data.component = Layout;
      // data.meta = {}
      data.name = getRouteNameByRoute(route, true);
      // data.name = toCamelCase(route.path, true) + 'Parent'
      data.redirect = '';
      meta.alwaysShow = false; // 将 alwaysShow 改为 false, 会在渲染时判断为只包含一个子路由的路由
      const childrenData: AppRouteRecordRaw = {
        path: '',
        // name: toCamelCase(route.path, true),
        name: getRouteNameByRoute(route),
        redirect: route.redirect,
        meta,
      };
      // const index = route?.component
      //   ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
      //   : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
      childrenData.component = getComponentByRoute(route);
      data.children = [childrenData];
    } else {
      // 目录, 有子路由时当做目录处理（包括所有子路由都隐藏的情况）
      if (route.children && route.children.length > 0) {
        // if (route.children && !route.component) {
        // data.component = Layout
        data.component = route.parentId == 0 ? Layout : null;
        data.redirect = getRedirect(route.path, route.children);
        // 外链
      } else if (isUrl(route.path)) {
        data = {
          path: '/external-link',
          component: Layout,
          meta: {
            name: route.name,
          },
          children: [data],
        } as AppRouteRecordRaw;
        // 菜单
      } else {
        // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
        // const index = route?.component
        //   ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
        //   : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
        // const index = modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
        // console.log(index, route.component)
        data.component = getComponentByRoute(route);
        data.name = getRouteNameByRoute(route);
        // console.log(route, data)
      }
      if (route.children) {
        data.children = generateRoute(route.children);
        // 所有子路由都隐藏时, 给隐藏的子路由设置 activeMenu 以高亮父级菜单
        if (route.children.every(item => !item.visible)) {
          data.children.forEach(child => {
            if (child.meta) child.meta.activeMenu = route.path;
          });
        }
      }
    }
    res.push(data as AppRouteRecordRaw);
  }
  return res;
}
/**
 * getRedirect
 * @param parentPath
 * @param children
 */
export function getRedirect(parentPath: string, children: AppCustomRouteRecordRaw[]): string | undefined {
  if (!children || children.length === 0) return undefined;

  const normalizePath = (p: string) => p.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  const normalizedParent = normalizePath(parentPath);

  for (const child of children) {
    const currentPath = generateRoutePath(parentPath, child.path || '');
    const normalizedCurrent = normalizePath(currentPath);

    // 防止 redirect 指向自己导致 pushWithRedirect 递归
    if (normalizedCurrent === normalizedParent) {
      if (child.children?.length) {
        const nested = getRedirect(currentPath, child.children);
        if (nested && normalizePath(nested) !== normalizedParent) return nested;
      }
      continue;
    }

    // 递归优先拿到真正可落地的子路由
    if (child.children?.length) {
      const nested = getRedirect(currentPath, child.children);
      if (nested && normalizePath(nested) !== normalizedParent) return nested;
    }

    return currentPath;
  }

  // 找不到有效子路由时，不设置 redirect，避免死循环
  return undefined;
}
/**
 * generateRoutePath
 * @param parentPath
 * @param path
 */
function generateRoutePath(parentPath: string, path: string) {
  if (parentPath.endsWith('/')) parentPath = parentPath.slice(0, -1); // 移除默认的 /

  if (!path.startsWith('/')) path = `/${path}`;

  return parentPath + path;
}
/**
 * pathResolve
 * @param parentPath
 * @param path
 */
export function pathResolve(parentPath: string, path: string) {
  if (isUrl(path)) return path;
  const childPath = path.startsWith('/') || !path ? path : `/${path}`;
  return `${parentPath}${childPath}`.replace(/\/\//g, '/');
}

/**
 * 路由降级
 * @param routes
 */
export function flatMultiLevelRoutes(routes: AppRouteRecordRaw[]) {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes);
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index];
    if (!isMultipleRoute(route)) continue;

    promoteRouteLevel(route);
  }
  return modules;
}

/**
 * 层级是否大于2
 * @param route
 */
function isMultipleRoute(route: AppRouteRecordRaw) {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) return false;

  const children = route.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 生成二级路由
 * @param route
 */
function promoteRouteLevel(route: AppRouteRecordRaw) {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, route.children || [], route);
  router = null;

  route.children = route.children?.map(item => omit(item, 'children'));
}

/**
 * 添加所有子菜单
 * @param routes
 * @param children
 * @param routeModule
 */
function addToChildren(routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteRecordRaw) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find(item => item.name === child.name);
    if (!route) continue;

    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find(item => item.name === route.name)) routeModule.children?.push(route as unknown as AppRouteRecordRaw);

    if (child.children?.length) addToChildren(routes, child.children, routeModule);
  }
}
