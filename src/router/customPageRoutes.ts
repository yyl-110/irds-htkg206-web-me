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
    path: 'customized-process-page0-4',
    name: 'CustomizedProcessPage0_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-4.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面-4',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1',
    name: 'CustomizedProcessPage1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面1-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-2',
    name: 'CustomizedProcessPage1_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-2.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面1-2',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-3',
    name: 'CustomizedProcessPage1_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-3.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面1-3',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-4',
    name: 'CustomizedProcessPage1_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-4.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面1-4',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page2',
    name: 'CustomizedProcessPage2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page2.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面2',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page2-1',
    name: 'CustomizedProcessPage2_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page2-1.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面2-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page3',
    name: 'CustomizedProcessPage3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page3.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面3',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page3-1',
    name: 'CustomizedProcessPage3_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page3-1.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面3-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page4',
    name: 'CustomizedProcessPage4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page4.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面4',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page5',
    name: 'CustomizedProcessPage5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page5.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面5',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page6',
    name: 'CustomizedProcessPage6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page6.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面6',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page7',
    name: 'CustomizedProcessPage7',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page7.vue'),
    meta: {
      hidden: true,
      title: '定制流程页面7',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page8',
    name: 'CustomizedProcessPage8',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page8.vue'),
    meta: {
      hidden: true,
      title: '初步筛选若干组合方案',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page9',
    name: 'CustomizedProcessPage9',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page9.vue'),
    meta: {
      hidden: true,
      title: '校核减速机构的齿轮强度',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page10',
    name: 'CustomizedProcessPage10',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page10.vue'),
    meta: {
      hidden: true,
      title: '所有角度性能校核计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page11',
    name: 'CustomizedProcessPage11',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page11.vue'),
    meta: {
      hidden: true,
      title: '确定最终方案',
      noCache: true,
    },
  },
  {
    path: 'customized-process-tbdemo1-page1',
    name: 'CustomizedProcessTbdemo1Page1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-tbdemo1-page1.vue'),
    meta: {
      hidden: true,
      title: '调压参数（TB Demo1）',
      noCache: true,
    },
  },
  {
    path: 'customized-process-tbdemo1-page2',
    name: 'CustomizedProcessTbdemo1Page2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-tbdemo1-page2.vue'),
    meta: {
      hidden: true,
      title: '层级调压（TB Demo1）',
      noCache: true,
    },
  },
  {
    path: 'customized-process-zjzcjh1-1',
    name: 'CustomizedProcessZjzcjh1_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-zjzcjh1-1.vue'),
    meta: {
      hidden: true,
      title: '车架总成校核',
      noCache: true,
    },
  },
  {
    path: 'customized-process-zlkwjc1-1',
    name: 'CustomizedProcessZlkwjc1_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-zlkwjc1-1.vue'),
    meta: {
      hidden: true,
      title: '纵梁孔位检查',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-1-12',
    name: 'CustomizedProcess1Zt1_1_12',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_1_12.vue'),
    meta: {
      hidden: true,
      title: '元器件原材料选用',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-4-10-1',
    name: 'CustomizedProcess1Zt1_4_10_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_4_10_1.vue'),
    meta: {
      hidden: true,
      title: '设备舱设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-4-10-2',
    name: 'CustomizedProcess1Zt1_4_10_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_4_10_2.vue'),
    meta: {
      hidden: true,
      title: '各设备舱分段设置',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-5-3-2-a',
    name: 'CustomizedProcess1Zt1_5_3_2A',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2A.vue'),
    meta: {
      hidden: true,
      title: '负载设备用电分析',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-5-3-2-b',
    name: 'CustomizedProcess1Zt1_5_3_2B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2B.vue'),
    meta: {
      hidden: true,
      title: '配电设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-5-3-2-c',
    name: 'CustomizedProcess1Zt1_5_3_2C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2C.vue'),
    meta: {
      hidden: true,
      title: '配电接口表',
      noCache: true,
    },
  },
  {
    path: 'customized-process1-zt1-4-4',
    name: 'CustomizedProcess1Zt1_4_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1-4-4.vue'),
    meta: {
      hidden: true,
      title: '平衡桥轴荷计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs-1-5-1-j',
    name: 'CustomizedProcess3Fs_1_5_1J',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS-1-5-1J.vue'),
    meta: {
      hidden: true,
      title: '开口设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-4',
    name: 'CustomizedProcess3Fs1_5_1_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_4.vue'),
    meta: {
      hidden: true,
      title: '加强框布局',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-5',
    name: 'CustomizedProcess3Fs1_5_1_5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_5.vue'),
    meta: {
      hidden: true,
      title: '蒙皮加强段',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-6',
    name: 'CustomizedProcess3Fs1_5_1_6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_6.vue'),
    meta: {
      hidden: true,
      title: '开口参数设计',
      noCache: true,
    },
  },
];
