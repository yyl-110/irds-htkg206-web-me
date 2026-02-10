# 路由
> 因后端使用的芋道的菜单管理, 前端的路由部分与 [芋道项目](https://doc.iocoder.cn/vue3/route/#_1-%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE) 基本一致

## 路由配置规范
项目中使用的路由分为两部分:

类型 | 说明 | 初始化
--- |--- |---
静态路由 | 对于所有人都可以访问的页面 | 在项目初始化路由时直接添加
动态路由 | 当前用户有权访问的页面 | 在路由钩子函数(`beforeEach`) 中初始化请求当前用户有权限的路由页面

## 路由与菜单
页面左侧的菜单是使用当前的路由配置(`router.getRoutes()`)渲染的

## 创建一个静态路由页面
在 `src/router/routes.ts` 中增加一个路由页面对象:

```typescript
const routes = [
  {
    name: '/newPage',
    path: '/newPage',
    component: Main, // 一级菜单 component 为布局组件 Main
    meta: {
      icon: BarChartOutlined, // 一级菜单的图标
      title: 'New page', // 一级菜单的标题
    },
    children: [
      {
        name: '/newPage/index',
        path: '/newPage/index',
        component: ComponentDemos, // 新页面 component
        meta: {
          icon: BarChartOutlined,
          title: 'Index page',
          keepAlive: true, // 当前页面是否启用缓存(切换标签页时的缓存)
        }
      },
    ],
  }
]
```

```bash
📂 New Page
├──  Index page
```

以上路由配置包含了一个一级路由 `New page` 和二级路由 `Index page`, 这两级路由将会在页面左侧的菜单中显示

## 创建一个静态路由页面(首页)
1. 在 `src/router/routes.ts` 中增加一个 **首页** 一级页面:

```typescript
export const routes: RouteRecordRaw[] = [
  // ...
  {
    name: '/home',
    path: '/home',
    redirect: '/home/workplace',
    /** component */
    component: () => import('@/views/Main.vue'),
    meta: {
      title: '首页',
      alwaysShow: false,
    },
    children: [
      {
        name: '/home/workplace',
        path: '/home/workplace',
        /** component */
        component: () => import('@/views/home/workplace.vue'),
        meta: {
          title: '首页',
          icon: UserOutlined,
          keepAlive: true,
        },
      },
    ]
  },
]
```

创建 **首页** 时需要声明两级结构(`/home` / `/home/workplace`), 并将 `/home` 的 `meta.alwaysShow` 声明为 `false`

2. 创建页面文件 `src/views/home/workplace.vue`

```vue
<script setup lang="ts">
</script>

<template>
  <a-card>
    <code>/home</code>
  </a-card>
</template>
```

3. 修改登录后默认跳转的路由

`src/router/state.ts`:
```typescript
/** 主页地址 */
export const HOME_PAGE_ROUTE_NAME: string = '/home'
```

## 增加一个动态路由页面
在 **菜单管理** 中添加菜单:

- 路由地址: 对应路由的 `path`
- 组件地址: 对应路由文件的路径, *例如当前路由文件为 `src/views/test/Test.vue`, 组件地址可以填写为 `src/views/test/Test.vue`*
- 组件名称: 与芋道不同的是, 组件名称可重复, 无需在页面中单独声明 `name`

## meta
在项目中定义了 `meta` 字段的数据类型, 参考 `types/router.d.ts`:

<<< @/../types/router.d.ts

## 隐藏路由页面
> 在 `routes` 中定义了 `meta` 字段, 并且有 `meta.title` 且 `meta.hidden !== true` 的页面会显示在左侧菜单中

通过增加 `meta.hidden` 隐藏此页面

```typescript{6}
const hiddenRoute = {
  name: '/hiddenRoute',
  path: '/hiddenRoute',
  component: HiddenRoute,
  meta: {
    hidden: true,
  }
}
```

## tab 标签页
> 框架提供了 `useWeiTab` 来管理所有的标签页, 更多 `API` 见源码:  `src/hooks/useWeiTab.ts`

```typescript
const { onClickMenu, tabChangeRecord } = useWeiTab({
  onTabsRemoved(tabs) {
    // 监听最近移除的 tabs
    console.log('最近移除的 Tabs: ', tabs)
  },
})
```

```html
<a-card title="tabs">
  <div class="flex space-x-4 mb-4">
    <a-button @click="onClickMenu(WeiPageTabMenus.closeOther)">
      关闭其他标签页
    </a-button>
    <a-button @click="onClickMenu(WeiPageTabMenus.close)">
      关闭当前标签页
    </a-button>
  </div>
</a-card>
```

## Demo 路由
框架自带了一些用于展示的 `Demo` 页面, 这些 `Demo` 页面只在 `development` 和 `demo` [构建模式](./start.md#构建模式) 下显示

## 源码
- `src/wei-components/WeiLayoutSiderMenu/index.vue`: 渲染左侧菜单
- `src/router/routes.ts`: 定义所有路由
- `types/router.d.ts`: 定义 `meta` 的数据类型
