import type { RouteRecordRaw } from 'vue-router';

/** 定制流程自定义页面路由（挂载于 /internal 下） */
export const customPageRoutes: RouteRecordRaw[] = [
  {
    path: 'customized-process-ansys',
    name: 'CustomizedProcessAnsys',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-ansys.vue'),
    meta: {
      hidden: true,
      title: '弯板计算',
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
      title: '任务输入数据',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-1',
    name: 'CustomizedProcessPage0_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-1.vue'),
    meta: {
      hidden: true,
      title: '确认输入数据',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-2',
    name: 'CustomizedProcessPage0_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-2.vue'),
    meta: {
      hidden: true,
      title: '舵机设计输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-3',
    name: 'CustomizedProcessPage0_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-3.vue'),
    meta: {
      hidden: true,
      title: '舵机设计参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page0-4',
    name: 'CustomizedProcessPage0_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page0-4.vue'),
    meta: {
      hidden: true,
      title: '零位初始性能计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1',
    name: 'CustomizedProcessPage1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1.vue'),
    meta: {
      hidden: true,
      title: '初始性能计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-1',
    name: 'CustomizedProcessPage1_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-1.vue'),
    meta: {
      hidden: true,
      title: '校核咸速机构的齿轮强度',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-2',
    name: 'CustomizedProcessPage1_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-2.vue'),
    meta: {
      hidden: true,
      title: '末端减速器形式确定',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-3',
    name: 'CustomizedProcessPage1_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-3.vue'),
    meta: {
      hidden: true,
      title: '通讯形式确定',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page1-4',
    name: 'CustomizedProcessPage1_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page1-4.vue'),
    meta: {
      hidden: true,
      title: '确认设计输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page2',
    name: 'CustomizedProcessPage2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page2.vue'),
    meta: {
      hidden: true,
      title: '电机选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page2-1',
    name: 'CustomizedProcessPage2_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page2-1.vue'),
    meta: {
      hidden: true,
      title: '减速器选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page3',
    name: 'CustomizedProcessPage3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page3.vue'),
    meta: {
      hidden: true,
      title: '初始总减速比计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page3-1',
    name: 'CustomizedProcessPage3_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page3-1.vue'),
    meta: {
      hidden: true,
      title: '初始总减速比计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page4',
    name: 'CustomizedProcessPage4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page4.vue'),
    meta: {
      hidden: true,
      title: '电机减速器组合',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page5',
    name: 'CustomizedProcessPage5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page5.vue'),
    meta: {
      hidden: true,
      title: '齿轮减速比分配',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page6',
    name: 'CustomizedProcessPage6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page6.vue'),
    meta: {
      hidden: true,
      title: '齿数与总减速比确定',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page7',
    name: 'CustomizedProcessPage7',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page7.vue'),
    meta: {
      hidden: true,
      title: '性能校核计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page8',
    name: 'CustomizedProcessPage8',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page8.vue'),
    meta: {
      hidden: true,
      title: '组合方案初步筛选',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page9',
    name: 'CustomizedProcessPage9',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page9.vue'),
    meta: {
      hidden: true,
      title: '齿轮强度校核',
      noCache: true,
    },
  },
  {
    path: 'customized-process-page10',
    name: 'CustomizedProcessPage10',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-page10.vue'),
    meta: {
      hidden: true,
      title: '全角度性能校核',
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
      title: '调压参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process-tbdemo1-page2',
    name: 'CustomizedProcessTbdemo1Page2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess-tbdemo1-page2.vue'),
    meta: {
      hidden: true,
      title: '层级调压',
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
      title: '设备舱分段设计',
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
      title: '蒙皮加强段设计',
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
      title: '交流输入交流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'app-high-voltage-dcbus-calculation',
    name: 'AppHighVoltageDCbusCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppHighVoltageDCbusCalculation.vue'),
    meta: {
      hidden: true,
      title: '高压直流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'app-low-voltage-dcpower-calculation',
    name: 'AppLowVoltageDCPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppLowVoltageDCPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: '低压直流功率计算',
      noCache: true,
    },
  },
  {
    path: 'app-qsyg-tl-calculation',
    name: 'AppQsygTlCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppQsygTlCalculation.vue'),
    meta: {
      hidden: true,
      title: '起竖油缸推力计算',
      noCache: true,
    },
  },
  {
    path: 'app-qsyg-xc-calculation',
    name: 'AppQsygXcCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/AppQsygXcCalculation.vue'),
    meta: {
      hidden: true,
      title: '起竖油缸行程计算',
      noCache: true,
    },
  },
  {
    path: 'acbus-power-calculation',
    name: 'acbusPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/acbusPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: '交流输入交流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'high-voltage-dcbus-calculation',
    name: 'highVoltageDCbusCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/highVoltageDCbusCalculation.vue'),
    meta: {
      hidden: true,
      title: '高压直流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'low-voltage-dcpower-calculation',
    name: 'lowVoltageDCPowerCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/lowVoltageDCPowerCalculation.vue'),
    meta: {
      hidden: true,
      title: '低压直流功率计算',
      noCache: true,
    },
  },
  {
    path: 'qsyg-tl-calculation',
    name: 'qsygTlCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/qsygTlCalculation.vue'),
    meta: {
      hidden: true,
      title: '起竖油缸推力计算',
      noCache: true,
    },
  },
  {
    path: 'qsyg-xc-calculation',
    name: 'qsygXcCalculation',
    component: () => import('@/views/product/activityPage/custompage/calculation/qsygXcCalculation.vue'),
    meta: {
      hidden: true,
      title: '起竖油缸行程计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-b',
    name: 'customizedProcess3_FS1_12_1_2B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2B.vue'),
    meta: {
      hidden: true,
      title: '上适配器设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-c',
    name: 'customizedProcess3_FS1_12_1_2C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2C.vue'),
    meta: {
      hidden: true,
      title: '中适配器设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-12-1-2-d',
    name: 'customizedProcess3_FS1_12_1_2D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2D.vue'),
    meta: {
      hidden: true,
      title: '下适配器设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-g',
    name: 'customizedProcess3_FS1_5_1_1G',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1G.vue'),
    meta: {
      hidden: true,
      title: '材料设置',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-k',
    name: 'customizedProcess3_FS1_5_1_1K',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1K.vue'),
    meta: {
      hidden: true,
      title: '夹层筒壁校核计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-l',
    name: 'customizedProcess3_FS1_5_1_1L',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1L.vue'),
    meta: {
      hidden: true,
      title: '筒壁层合板性能计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-m',
    name: 'customizedProcess3_FS1_5_1_1M',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1M.vue'),
    meta: {
      hidden: true,
      title: '加强框内力计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-n',
    name: 'customizedProcess3_FS1_5_1_1N',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1N.vue'),
    meta: {
      hidden: true,
      title: '复合材料加强框校核',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-o',
    name: 'customizedProcess3_FS1_5_1_1O',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1O.vue'),
    meta: {
      hidden: true,
      title: '夹层筒壁校核计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-2',
    name: 'customizedProcess3_FS1_5_1_1_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_2.vue'),
    meta: {
      hidden: true,
      title: '外蒙皮加强段设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-4',
    name: 'customizedProcess3_FS1_5_1_1_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_4.vue'),
    meta: {
      hidden: true,
      title: '内蒙皮加强段设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-6',
    name: 'customizedProcess3_FS1_5_1_1_6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_6.vue'),
    meta: {
      hidden: true,
      title: '内外加强框设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-1-9',
    name: 'customizedProcess3_FS1_5_1_1_9',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_9.vue'),
    meta: {
      hidden: true,
      title: '口框与衬板设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-k',
    name: 'customizedProcess3_FS1_5_1K',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1K.vue'),
    meta: {
      hidden: true,
      title: '连接件选型与校核-1',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-1-l',
    name: 'customizedProcess3_FS1_5_1L',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1L.vue'),
    meta: {
      hidden: true,
      title: '密封件选型与校核',
      noCache: true,
    },
  },
  {
    path: 'customized-process3-fs1-5-g',
    name: 'customizedProcess3_FS1_5G',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5G.vue'),
    meta: {
      hidden: true,
      title: '连接件选型与校核-2',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page1',
    name: 'customizedProcess7_page1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page1.vue'),
    meta: {
      hidden: true,
      title: '交流输入交流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page2',
    name: 'customizedProcess7_page2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page2.vue'),
    meta: {
      hidden: true,
      title: '低压直流功率计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page3',
    name: 'customizedProcess7_page3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page3.vue'),
    meta: {
      hidden: true,
      title: '高压直流母线功率计算',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page4-1',
    name: 'customizedProcess7_page4_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page4-1.vue'),
    meta: {
      hidden: true,
      title: '供配电机制确定',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1',
    name: 'customizedProcess7_page5_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1.vue'),
    meta: {
      hidden: true,
      title: '机柜1组合插箱选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-b',
    name: 'customizedProcess7_page5_1B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1B.vue'),
    meta: {
      hidden: true,
      title: '机柜2组合插箱选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-c',
    name: 'customizedProcess7_page5_1C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1C.vue'),
    meta: {
      hidden: true,
      title: '机柜3组合插箱选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-1-d',
    name: 'customizedProcess7_page5_1D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1D.vue'),
    meta: {
      hidden: true,
      title: '机柜4组合插箱选型',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2',
    name: 'customizedProcess7_page5_2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2.vue'),
    meta: {
      hidden: true,
      title: '机柜1柜体尺寸设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-b',
    name: 'customizedProcess7_page5_2B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2B.vue'),
    meta: {
      hidden: true,
      title: '机柜2柜体尺寸设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-c',
    name: 'customizedProcess7_page5_2C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2C.vue'),
    meta: {
      hidden: true,
      title: '机柜3柜体尺寸设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-2-d',
    name: 'customizedProcess7_page5_2D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2D.vue'),
    meta: {
      hidden: true,
      title: '机柜4柜体尺寸设计',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3',
    name: 'customizedProcess7_page5_3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3.vue'),
    meta: {
      hidden: true,
      title: '机柜1装配组合',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-b',
    name: 'customizedProcess7_page5_3B',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3B.vue'),
    meta: {
      hidden: true,
      title: '机柜2装配组合',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-c',
    name: 'customizedProcess7_page5_3C',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3C.vue'),
    meta: {
      hidden: true,
      title: '机柜3装配组合',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-3-d',
    name: 'customizedProcess7_page5_3D',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3D.vue'),
    meta: {
      hidden: true,
      title: '机柜4装配组合',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-4',
    name: 'customizedProcess7_page5_4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-4.vue'),
    meta: {
      hidden: true,
      title: '交流输入参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-5',
    name: 'customizedProcess7_page5_5',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-5.vue'),
    meta: {
      hidden: true,
      title: '电源机柜输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-6',
    name: 'customizedProcess7_page5_6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-6.vue'),
    meta: {
      hidden: true,
      title: '电源机柜装配',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg1',
    name: 'customizedProcess7_page5_Dyjg1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg1.vue'),
    meta: {
      hidden: true,
      title: '电源机柜1参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg2',
    name: 'customizedProcess7_page5_Dyjg2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg2.vue'),
    meta: {
      hidden: true,
      title: '电源机柜2参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg3',
    name: 'customizedProcess7_page5_Dyjg3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg3.vue'),
    meta: {
      hidden: true,
      title: '电源机柜3参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-dyjg4',
    name: 'customizedProcess7_page5_Dyjg4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg4.vue'),
    meta: {
      hidden: true,
      title: '电源机柜4参数',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg1',
    name: 'customizedProcess7_page5_InputDyjg1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg1.vue'),
    meta: {
      hidden: true,
      title: '电源机柜1供配电输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg2',
    name: 'customizedProcess7_page5_InputDyjg2',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg2.vue'),
    meta: {
      hidden: true,
      title: '电源机柜2供配电输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg3',
    name: 'customizedProcess7_page5_InputDyjg3',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg3.vue'),
    meta: {
      hidden: true,
      title: '电源机柜3供配电输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page5-input-dyjg4',
    name: 'customizedProcess7_page5_InputDyjg4',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg4.vue'),
    meta: {
      hidden: true,
      title: '电源机柜4供配电输入',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page6-1',
    name: 'customizedProcess7_page6_1',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page6-1.vue'),
    meta: {
      hidden: true,
      title: '高压供电时序表',
      noCache: true,
    },
  },
  {
    path: 'customized-process7-page6',
    name: 'customizedProcess7_page6',
    component: () => import('@/views/product/activityPage/custompage/customizedProcess7-page6.vue'),
    meta: {
      hidden: true,
      title: '供电时序表',
      noCache: true,
    },
  },
  {
    path: 'customized-process-programme',
    name: 'customizedProcessProgramme',
    component: () => import('@/views/product/activityPage/custompage/customizedProcessProgramme.vue'),
    meta: {
      hidden: true,
      title: '组合方案确定',
      noCache: true,
    },
  },
  {
    path: 'zq-frame-design-page1',
    name: 'zq_frameDesign_page1',
    component: () => import('@/views/product/activityPage/custompage/zq-frameDesign-page1.vue'),
    meta: {
      hidden: true,
      title: '车架参数与选型',
      noCache: true,
    },
  },
  {
    path: 'zq-frame-design-page2',
    name: 'zq_frameDesign_page2',
    component: () => import('@/views/product/activityPage/custompage/zq-frameDesign-page2.vue'),
    meta: {
      hidden: true,
      title: '纵梁长度截面设计',
      noCache: true,
    },
  },
  {
    path: 'zq-transmission-shaft-page1',
    name: 'zq_transmissionShaft_page1',
    component: () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page1.vue'),
    meta: {
      hidden: true,
      title: '传动轴设计与校核',
      noCache: true,
    },
  },
  {
    path: 'zq-transmission-shaft-page2',
    name: 'zq_transmissionShaft_page2',
    component: () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page2.vue'),
    meta: {
      hidden: true,
      title: '新传动轴设计',
      noCache: true,
    },
  },
];
