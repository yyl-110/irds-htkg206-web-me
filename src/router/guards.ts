import type { Router } from 'vue-router';
import Cookies from 'js-cookie';
import { HOME_PAGE_ROUTE_NAME, singleWhiteList1, singleWhiteList2, updateUserData, updatedUserData, whiteList } from './state';
import { getAccessToken } from '@/utils/auth';
import appStore from '@/store';
import { AdminApiSystemStatisticsLog } from '@/api/tags/StatisticsLogController';
import { useLayoutStore } from '@/store/modules/layout/layout';
import { detectDevice } from '@/utils/tools';
/**
 * 绑定路由守卫函数
 * @param router router
 */
export function initRouteGrauds(router: Router) {
  const layoutStore = useLayoutStore();
  // 路由加载前
  router.beforeEach(async (to, from, next) => {
    // 状态
    const isUpdatePassCheck = Cookies.get('IsUpdatePassCheck');
    // start()
    // loadStart()
    if (getAccessToken() && isUpdatePassCheck !== '1' && (localStorage.getItem('isMobile') === '1' || localStorage.getItem('isMobile') === null)) {
      // 如果是单点登录系统，没有其他页面权限 则直接跳转到首页或者404页面
      if (layoutStore.systemType === 'other' || layoutStore.systemType === 'outEpc') {
        const routerList = layoutStore.systemType === 'other' ? singleWhiteList1 : singleWhiteList2;
        if (routerList.includes(to.path)) {
          const userStore = appStore.useUser;
          if (!updatedUserData.value || !userStore.getIsSetUser) {
            await updateUserData(router);
            next(to);
          } else {
            next();
          }
        } else {
          next({ name: '/404' });
        }
      } else if (to.path === '/login') {
        next({ name: HOME_PAGE_ROUTE_NAME }); // 跳转到首页
      } else if (whiteList.includes(to.path)) {
        // 白名单页面直接访问
        next();
      } else {
        // 获取所有字典
        // const dictStore = appStore.useDictStore
        const userStore = appStore.useUser;
        // const permissionStore = appStore.usePermissionStore
        // if (!dictStore.getIsSetDict) {
        //   await dictStore.setDictMap()
        // }
        if (!updatedUserData.value || !userStore.getIsSetUser) {
          await updateUserData(router);
          // const redirectPath = from.query.redirect || to.path
          // const redirect = decodeURIComponent(redirectPath as string)
          // const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
          // next(nextData)
          // console.log(router.getRoutes())
          // next()
          if (to.path.includes('H5')) {
            next(HOME_PAGE_ROUTE_NAME);
            return;
          }
          next(to);
        } else {
          if (to.path.includes('H5')) {
            next(HOME_PAGE_ROUTE_NAME);
            return;
          }
          next();
        }
      }
    } else {
      // 获取当前设备类型;
      detectDevice();
      // 手机端登录
      if (localStorage.getItem('isMobile') === '0') {
        if (['/login'].includes(to.path)) {
          next(`/H5login`); // 否则全部重定向到登录页
        } else if (!to.path.includes('H5')) {
          next('/H5home-main');
        } else if (getAccessToken()) {
          // 获取所有字典
          // const dictStore = appStore.useDictStore
          const userStore = appStore.useUser;
          // const permissionStore = appStore.usePermissionStore
          // if (!dictStore.getIsSetDict) {
          //   await dictStore.setDictMap()
          // }
          if (!updatedUserData.value || !userStore.getIsSetUser) {
            await updateUserData(router);
            // const redirectPath = from.query.redirect || to.path
            // const redirect = decodeURIComponent(redirectPath as string)
            // const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
            // next(nextData)
            // console.log(router.getRoutes())
            // next()
            next(to);
          } else {
            next();
          }
        } else {
          next();
        }
      } else {
        // PC端登录
        if (['/H5login'].includes(to.path)) {
          next(`/login`); // 否则全部重定向到登录页
        } else if (whiteList.includes(to.path)) {
          next();
        } else {
          next(`/login?redirect=${to.fullPath}`);
        } // 否则全部重定向到登录页
      }
    }
  });

  router.afterEach(_to => {
    // useTitle(to?.meta?.title as string)
    // done() // 结束Progress
    // loadDone()
  });

  router.afterEach(to => {
    if (!Reflect.has(to.meta, 'id')) return; // 忽略不是接口返回的路由页面
    // 在页面跳转后请求统计日志接口传入当前页面信息
    const fullTitles = to.matched.map(r => r.meta.title).join('-');
    AdminApiSystemStatisticsLog.statisticsLogInsert({ moduleName: fullTitles, logType: '访问页面' });
  });
}
