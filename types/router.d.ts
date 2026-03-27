/**
 * @file 定义 vue-router 中路由的 meta
 * @see 参考自: https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
 * @description `AppRouteRecordRaw` / `AppCustomRouteRecordRaw` 复制自芋道项目
 */
import 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { FunctionalComponent, VNode, defineComponent } from 'vue';
import type { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon';

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title: string;
    /** menu id */
    menuId?: string;
    /** 是否在渲染左侧菜单时不显示此路由 */
    hidden?: boolean;
    /**
     * 页面 icon
     * @description 可以直接使用 {@link https://www.npmjs.com/package/@ant-design/icons | @ant-design/icons} 组件或通过 `h()` 创建
     *
     * 图标包含以下几类:
     * - ant-design-vue 的 icon
     * - 通过 `h()` 创建的组件
     * - string 类型的图标名称(将通过 `wei-icon` 渲染, 参考图标文档或 `src/wei-component/WeiIcon/src/Icon.vue`)
     * 1. 本地 svg 文件
     * 2. `@iconify/iconify` 图标
     *
     */
    icon?: FunctionalComponent<AntdIconProps> | VNode | string;
    /** 当前页面是否允许被缓存 */
    keepAlive?: boolean;
    /** 从接口获取到的当前路由 ID */
    id?: number | string;
    /** 从接口获取到的当前路由 parent ID */
    parentId?: number | string;
    /**
     * 当前目录菜单是否总是显示
     * @description 默认为 `true`; 值为 `false` 时, 当该菜单只有一个子菜单时, 不展示自己, 直接展示子菜单
     */
    alwaysShow?: boolean;
    /** 指定当前路由激活时，侧边栏高亮的菜单路径（用于隐藏子路由时高亮父级） */
    activeMenu?: string;
  }
}

type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>);

declare global {
  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string;
    meta: RouteMeta;
    component?: Component | string;
    children?: AppRouteRecordRaw[];
    props?: Recordable;
    fullPath?: string;
    keepAlive?: boolean;
  }

  interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    icon: any;
    name: string;
    meta: RouteMeta;
    component: string;
    componentName?: string;
    path: string;
    redirect: string;
    children?: AppCustomRouteRecordRaw[];
    keepAlive?: boolean;
    visible?: boolean;
    id?: string;
    parentId?: string;
    alwaysShow?: boolean;
  }
}
