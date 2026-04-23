import { shallowRef } from 'vue';
import type { Router } from 'vue-router';
import { router } from '.';
import appStore from '@/store';
import { useProjectUiStore } from '@/store/modules/layout/projectUi';

/** 主页地址 */
export const HOME_PAGE_ROUTE_NAME: string = '/home/workbench';

export const H5HOME_PAGE_ROUTE_NAME: string = '/H5home-main';

/** 路由不重定向白名单 */
export const whiteList: Array<string> = ['/login', '/404', '/checkPassWord'];

// 单点登录白名单  other
export const singleWhiteList1: Array<string> = ['/outer-sso', '/404', '/EngineMatching'];

// 单点登录白名单  outEpc
export const singleWhiteList2: Array<string> = ['/outer-sso', '/404', '/project-part/PartComponent'];

/** 退出登录时不清空的路由 name */
export const resetWhiteNameList = ['login'];

// 是否显示重新登录
export const isRelogin = { show: false };

/** 当前是否已更新用户数据, 用于实现在每次刷新页面时更新用户信息 */
export const updatedUserData = shallowRef(false);

/**
 * 更新 用户信息 / 权限 / 路由
 * @param 在本地已有缓存时是否也更新用户信息
 * @param router
 * @param forceUpdate
 */
export async function updateUserData(router: Router, forceUpdate: boolean = !updatedUserData.value) {
  updatedUserData.value = true;
  const userStore = appStore.useUser;
  const permissionStore = appStore.usePermissionStore;
  // isRelogin.show = true
  await userStore.setUserInfoAction(forceUpdate);
  const projectUi = useProjectUiStore();
  await projectUi.hydratePageStyleFromServer(Number(userStore.user?.id) || 0);
  // isRelogin.show = false
  // 后端过滤菜单
  await permissionStore.generateRoutes(forceUpdate);
  permissionStore.getAddRouters.forEach(route => {
    router.addRoute(route as unknown as any); // 动态添加可访问路由表
  });
}

/** 清空路由(退出登录时) */
export function resetRouter(): void {
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && !resetWhiteNameList.includes(name as string) && meta.id !== undefined) {
      // if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
