import type { RouteRecordRaw } from 'vue-router';

/** 定制流程自定义页面路由（挂载于 /internal 下） */
export const customPageRoutes: RouteRecordRaw[] = [
  {
    path: 'customized-process-ansys',
    name: 'CustomizedProcessAnsys',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-ansys.vue'),
    meta: {
      hidden: true,
      title: '弯板ANSYS计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-jsinvoke',
    name: 'CustomizedProcessJsinvoke',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-jsinvoke.vue'),
    meta: {
      hidden: true,
      title: 'JS计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0',
    name: 'CustomizedProcessPage0',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-1',
    name: 'CustomizedProcessPage0_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-1.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-2',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-2',
    name: 'CustomizedProcessPage0_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-2.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-3',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-3',
    name: 'CustomizedProcessPage0_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-3.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-4',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-5',
    name: 'CustomizedProcessPage0_5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-5.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-5',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1',
    name: 'CustomizedProcessPage1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面1-6',
      noCache: true,
    },
  },
];
