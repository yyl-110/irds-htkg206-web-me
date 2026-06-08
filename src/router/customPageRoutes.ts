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
  {
    path: 'app-acbus-power-calculation',
    name: 'AppAcbusPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppAcbusPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: 'AppAcbusPowerCalculation',
      noCache: true,
    },
  },
  {
    path: 'app-high-voltage-dcbus-calculation',
    name: 'AppHighVoltageDCbusCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppHighVoltageDCbusCalculation.vue'),
    meta: {
      hidden: true,
      title: 'AppHighVoltageDCbusCalculation',
      noCache: true,
    },
  },
  {
    path: 'app-low-voltage-dcpower-calculation',
    name: 'AppLowVoltageDCPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppLowVoltageDCPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: 'AppLowVoltageDCPowerCalculation',
      noCache: true,
    },
  },
  {
    path: 'app-qsyg-tl-calculation',
    name: 'AppQsygTlCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppQsygTlCalculation.vue'),
    meta: {
      hidden: true,
      title: 'AppQsygTlCalculation',
      noCache: true,
    },
  },
  {
    path: 'app-qsyg-xc-calculation',
    name: 'AppQsygXcCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppQsygXcCalculation.vue'),
    meta: {
      hidden: true,
      title: 'AppQsygXcCalculation',
      noCache: true,
    },
  },
  {
    path: 'acbus-power-calculation',
    name: 'acbusPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/acbusPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: 'acbusPowerCalculation',
      noCache: true,
    },
  },
  {
    path: 'high-voltage-dcbus-calculation',
    name: 'highVoltageDCbusCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/highVoltageDCbusCalculation.vue'),
    meta: {
      hidden: true,
      title: 'highVoltageDCbusCalculation',
      noCache: true,
    },
  },
  {
    path: 'low-voltage-dcpower-calculation',
    name: 'lowVoltageDCPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/lowVoltageDCPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: 'lowVoltageDCPowerCalculation',
      noCache: true,
    },
  },
  {
    path: 'qsyg-tl-calculation',
    name: 'qsygTlCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/qsygTlCalculation.vue'),
    meta: {
      hidden: true,
      title: 'qsygTlCalculation',
      noCache: true,
    },
  },
  {
    path: 'qsyg-xc-calculation',
    name: 'qsygXcCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/qsygXcCalculation.vue'),
    meta: {
      hidden: true,
      title: 'qsygXcCalculation',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-b',
    name: 'customizedProcess3_FS1_12_1_2B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2B.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-12-1-2B',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-c',
    name: 'customizedProcess3_FS1_12_1_2C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2C.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-12-1-2C',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-d',
    name: 'customizedProcess3_FS1_12_1_2D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2D.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-12-1-2D',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-g',
    name: 'customizedProcess3_FS1_5_1_1G',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1G.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1G',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-k',
    name: 'customizedProcess3_FS1_5_1_1K',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1K.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1K',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-l',
    name: 'customizedProcess3_FS1_5_1_1L',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1L.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1L',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-m',
    name: 'customizedProcess3_FS1_5_1_1M',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1M.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1M',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-n',
    name: 'customizedProcess3_FS1_5_1_1N',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1N.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1N',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-o',
    name: 'customizedProcess3_FS1_5_1_1O',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1O.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1O',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-2',
    name: 'customizedProcess3_FS1_5_1_1_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_2.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1_2',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-4',
    name: 'customizedProcess3_FS1_5_1_1_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_4.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1_4',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-6',
    name: 'customizedProcess3_FS1_5_1_1_6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_6.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1_6',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-9',
    name: 'customizedProcess3_FS1_5_1_1_9',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_9.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1-1_9',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-k',
    name: 'customizedProcess3_FS1_5_1K',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1K.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1K',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-l',
    name: 'customizedProcess3_FS1_5_1L',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1L.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5-1L',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-g',
    name: 'customizedProcess3_FS1_5G',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5G.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess3-FS1-5G',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page1',
    name: 'customizedProcess7_page1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page2',
    name: 'customizedProcess7_page2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page2.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page2',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page3',
    name: 'customizedProcess7_page3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page3.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page3',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page4-1',
    name: 'customizedProcess7_page4_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page4-1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page4-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1',
    name: 'customizedProcess7_page5_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-b',
    name: 'customizedProcess7_page5_1B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1B.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-1B',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-c',
    name: 'customizedProcess7_page5_1C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1C.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-1C',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-d',
    name: 'customizedProcess7_page5_1D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1D.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-1D',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2',
    name: 'customizedProcess7_page5_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-2',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-b',
    name: 'customizedProcess7_page5_2B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2B.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-2B',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-c',
    name: 'customizedProcess7_page5_2C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2C.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-2C',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-d',
    name: 'customizedProcess7_page5_2D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2D.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-2D',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3',
    name: 'customizedProcess7_page5_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-3',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-b',
    name: 'customizedProcess7_page5_3B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3B.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-3B',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-c',
    name: 'customizedProcess7_page5_3C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3C.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-3C',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-d',
    name: 'customizedProcess7_page5_3D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3D.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-3D',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-4',
    name: 'customizedProcess7_page5_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-4.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-4',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-5',
    name: 'customizedProcess7_page5_5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-5.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-5',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-6',
    name: 'customizedProcess7_page5_6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-6.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-6',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg1',
    name: 'customizedProcess7_page5_Dyjg1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-Dyjg1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg2',
    name: 'customizedProcess7_page5_Dyjg2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg2.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-Dyjg2',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg3',
    name: 'customizedProcess7_page5_Dyjg3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg3.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-Dyjg3',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg4',
    name: 'customizedProcess7_page5_Dyjg4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg4.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-Dyjg4',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg1',
    name: 'customizedProcess7_page5_InputDyjg1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-InputDyjg1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg2',
    name: 'customizedProcess7_page5_InputDyjg2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg2.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-InputDyjg2',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg3',
    name: 'customizedProcess7_page5_InputDyjg3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg3.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-InputDyjg3',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg4',
    name: 'customizedProcess7_page5_InputDyjg4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg4.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page5-InputDyjg4',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page6-1',
    name: 'customizedProcess7_page6_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page6-1.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page6-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page6',
    name: 'customizedProcess7_page6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page6.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcess7-page6',
      noCache: true,
    },
  },
  {
    path: 'customized-process-programme',
    name: 'customizedProcessProgramme',
    component: () => import('@/views/product/activityPage/custompage/customizedProcessProgramme.vue'),
    meta: {
      hidden: true,
      title: 'customizedProcessProgramme',
      noCache: true,
    },
  },
  {
    path: 'zq-frame-design-page1',
    name: 'zq_frameDesign_page1',
    component: () => import('@/views/product/activityPage/custompage/zq-frameDesign-page1.vue'),
    meta: {
      hidden: true,
      title: 'zq-frameDesign-page1',
      noCache: true,
    },
  },
  {
    path: 'zq-frame-design-page2',
    name: 'zq_frameDesign_page2',
    component: () => import('@/views/product/activityPage/custompage/zq-frameDesign-page2.vue'),
    meta: {
      hidden: true,
      title: 'zq-frameDesign-page2',
      noCache: true,
    },
  },
  {
    path: 'zq-transmission-shaft-page1',
    name: 'zq_transmissionShaft_page1',
    component: () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page1.vue'),
    meta: {
      hidden: true,
      title: 'zq-transmissionShaft-page1',
      noCache: true,
    },
  },
  {
    path: 'zq-transmission-shaft-page2',
    name: 'zq_transmissionShaft_page2',
    component: () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page2.vue'),
    meta: {
      hidden: true,
      title: 'zq-transmissionShaft-page2',
      noCache: true,
    },
  },
];