import { defineStore } from 'pinia';
// import { store } from '../index'
import { cloneDeep } from 'lodash-es';
// import remainingRouter from '@/router/modules/remaining'
import { routes as remainingRouter } from '@/router/routes';
import { generateRoute } from '@/utils/routerHelper';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
// import { swaggerApi } from '@/httpRequest'
const { wsCache } = useCache();
export interface PermissionState {
  routers: AppRouteRecordRaw[];
  addRouters: AppRouteRecordRaw[];
  menuTabRouters: AppRouteRecordRaw[];
}
export const usePermissionStore = defineStore('permission', {
  /** state */
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    menuTabRouters: [],
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers;
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return cloneDeep(this.addRouters);
      // return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters;
    },
  },
  actions: {
    async generateRoutes(forceUpdate: boolean = false): Promise<unknown> {
      // return new Promise<>
      let res: AppCustomRouteRecordRaw[];
      return new Promise<void>(resolve => {
        if (!forceUpdate && wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
          res = wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[];
          resolve();
        } else {
          // const response = await swaggerApi.adminApi.getMenus()
          // const response = await AdminApiSystemAuth.getMenus()
          AdminApiSystemAuth.getMenus().then(response => {
            res = (response.data.data || []) as unknown as Array<AppCustomRouteRecordRaw>;
            // 顶级路由的 path 必须以 / 开头, 当填写的 path 不以 / 开头时会报错: Route paths should start with a "/"
            for (const route of res) {
              if (route.parentId == '0' && route.path[0] !== '/') {
                route.path = `/${route.path}`;
              }
            }
            // res = await getAsyncRoutes()
            wsCache.set(CACHE_KEY.ROLE_ROUTERS, res);
            resolve();
          });
        }
      }).then(() => {
        const routerMap: AppRouteRecordRaw[] = generateRoute(res as AppCustomRouteRecordRaw[]);
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false,
            },
          },
        ]);
        // 渲染菜单的所有路由
        this.routers = cloneDeep(remainingRouter).concat(routerMap as any) as any;
      });
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers;
    },
  },
});
