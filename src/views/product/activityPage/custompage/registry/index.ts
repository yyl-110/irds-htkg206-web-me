import type { Component } from 'vue';

export type CustomPageLoader = () => Promise<{ default: Component }>;

export const CUSTOM_PAGE_REGISTRY: Record<string, CustomPageLoader> = {
  'customized-process-ansys': () => import('@/views/product/activityPage/custompage/customizedProcess-ansys.vue'), //弯板计算页面
  'customized-process-jsinvoke': () => import('@/views/product/activityPage/custompage/customizedProcess-jsinvoke.vue'), //JS计算页面
  'customized-process-page0': () => import('@/views/product/activityPage/custompage/customizedProcess-page0.vue'), //定制流程页面-1
  'customized-process-page0-1': () => import('@/views/product/activityPage/custompage/customizedProcess-page0-1.vue'), //定制流程页面-2
  'customized-process-page0-2': () => import('@/views/product/activityPage/custompage/customizedProcess-page0-2.vue'), //定制流程页面-3
  'customized-process-page0-3': () => import('@/views/product/activityPage/custompage/customizedProcess-page0-3.vue'), //定制流程页面-4
  'customized-process-page0-4': () => import('@/views/product/activityPage/custompage/customizedProcess-page0-4.vue'), //定制流程页面-5
  'customized-process-page1': () => import('@/views/product/activityPage/custompage/customizedProcess-page1.vue'), //定制流程页面1-1
  'customized-process-page1-2': () => import('@/views/product/activityPage/custompage/customizedProcess-page1-2.vue'), //定制流程页面1-2
  'customized-process-page1-3': () => import('@/views/product/activityPage/custompage/customizedProcess-page1-3.vue'), //定制流程页面1-3
  'customized-process-page1-4': () => import('@/views/product/activityPage/custompage/customizedProcess-page1-4.vue'), //定制流程页面1-4
  'customized-process-page2': () => import('@/views/product/activityPage/custompage/customizedProcess-page2.vue'), //定制流程页面2
  'customized-process-page2-1': () => import('@/views/product/activityPage/custompage/customizedProcess-page2-1.vue'), //定制流程页面2-1
  'customized-process-page3': () => import('@/views/product/activityPage/custompage/customizedProcess-page3.vue'), //定制流程页面3-初始总减速比计算
  'customized-process-page3-1': () => import('@/views/product/activityPage/custompage/customizedProcess-page3-1.vue'), //定制流程页面3-1
  'customized-process-page4': () => import('@/views/product/activityPage/custompage/customizedProcess-page4.vue'), //定制流程页面4-组合方案确定
  'customized-process-page5': () => import('@/views/product/activityPage/custompage/customizedProcess-page5.vue'), //定制流程页面5-齿轮减速比分配
  'customized-process-page6': () => import('@/views/product/activityPage/custompage/customizedProcess-page6.vue'), //定制流程页面6-确定齿数和最终实际总减速比
  'customized-process-page7': () => import('@/views/product/activityPage/custompage/customizedProcess-page7.vue'), //定制流程页面7-性能校核计算
  'customized-process-page8': () => import('@/views/product/activityPage/custompage/customizedProcess-page8.vue'), //定制流程页面8-初步筛选若干组合方案
  'customized-process-page9': () => import('@/views/product/activityPage/custompage/customizedProcess-page9.vue'), //定制流程页面9-校核减速机构的齿轮强度
  'customized-process-page10': () => import('@/views/product/activityPage/custompage/customizedProcess-page10.vue'), //定制流程页面10-所有角度性能校核计算
  'customized-process-page11': () => import('@/views/product/activityPage/custompage/customizedProcess-page11.vue'), //定制流程页面11-确定最终方案
  'customized-process-tbdemo1-page1': () =>
    import('@/views/product/activityPage/custompage/customizedProcess-tbdemo1-page1.vue'), //TB Demo1 页面1-调压参数
  'customized-process-tbdemo1-page2': () =>
    import('@/views/product/activityPage/custompage/customizedProcess-tbdemo1-page2.vue'), //TB Demo1 页面2-层级调压
  'customized-process-zjzcjh1-1': () => import('@/views/product/activityPage/custompage/customizedProcess-zjzcjh1-1.vue'), //车架总成校核
  'customized-process-zlkwjc1-1': () => import('@/views/product/activityPage/custompage/customizedProcess-zlkwjc1-1.vue'), //纵梁孔位检查
  'customized-process1-zt1-1-12': () => import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_1_12.vue'), //元器件原材料选用
  'customized-process1-zt1-4-10-1': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_4_10_1.vue'), //设备舱设计
  'customized-process1-zt1-4-10-2': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_4_10_2.vue'), //各设备舱分段设置
  'customized-process1-zt1-5-3-2-a': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2A.vue'), //负载设备用电分析
  'customized-process1-zt1-5-3-2-b': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2B.vue'), //配电设计
  'customized-process1-zt1-5-3-2-c': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1_5_3_2C.vue'), //配电接口表
  'customized-process1-zt1-4-4': () =>
    import('@/views/product/activityPage/custompage/customizedProcess1-ZT1-4-4.vue'), //平衡桥轴荷计算
  'customized-process3-fs-1-5-1-j': () =>
    import('@/views/product/activityPage/custompage/customizedProcess3-FS-1-5-1J.vue'), //开口设计
  'customized-process3-fs1-5-1-4': () =>
    import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_4.vue'), //加强框布局
  'customized-process3-fs1-5-1-5': () =>
    import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_5.vue'), //蒙皮加强段
  'customized-process3-fs1-5-1-6': () =>
    import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1_6.vue'), //开口参数设计
  'app-acbus-power-calculation': () => import('@/views/product/activityPage/custompage/calculation/AppAcbusPowerCalculation.vue'),
  'app-high-voltage-dcbus-calculation': () => import('@/views/product/activityPage/custompage/calculation/AppHighVoltageDCbusCalculation.vue'),
  'app-low-voltage-dcpower-calculation': () => import('@/views/product/activityPage/custompage/calculation/AppLowVoltageDCPowerCalculation.vue'),
  'app-qsyg-tl-calculation': () => import('@/views/product/activityPage/custompage/calculation/AppQsygTlCalculation.vue'),
  'app-qsyg-xc-calculation': () => import('@/views/product/activityPage/custompage/calculation/AppQsygXcCalculation.vue'),
  'acbus-power-calculation': () => import('@/views/product/activityPage/custompage/calculation/acbusPowerCalculation.vue'),
  'high-voltage-dcbus-calculation': () => import('@/views/product/activityPage/custompage/calculation/highVoltageDCbusCalculation.vue'),
  'low-voltage-dcpower-calculation': () => import('@/views/product/activityPage/custompage/calculation/lowVoltageDCPowerCalculation.vue'),
  'qsyg-tl-calculation': () => import('@/views/product/activityPage/custompage/calculation/qsygTlCalculation.vue'),
  'qsyg-xc-calculation': () => import('@/views/product/activityPage/custompage/calculation/qsygXcCalculation.vue'),
  'customized-process3-fs1-12-1-2-b': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2B.vue'),
  'customized-process3-fs1-12-1-2-c': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2C.vue'),
  'customized-process3-fs1-12-1-2-d': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-12-1-2D.vue'),
  'customized-process3-fs1-5-1-1-g': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1G.vue'),
  'customized-process3-fs1-5-1-1-k': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1K.vue'),
  'customized-process3-fs1-5-1-1-l': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1L.vue'),
  'customized-process3-fs1-5-1-1-m': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1M.vue'),
  'customized-process3-fs1-5-1-1-n': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1N.vue'),
  'customized-process3-fs1-5-1-1-o': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1O.vue'),
  'customized-process3-fs1-5-1-1-2': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_2.vue'),
  'customized-process3-fs1-5-1-1-4': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_4.vue'),
  'customized-process3-fs1-5-1-1-6': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_6.vue'),
  'customized-process3-fs1-5-1-1-9': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1-1_9.vue'),
  'customized-process3-fs1-5-1-k': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1K.vue'),
  'customized-process3-fs1-5-1-l': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5-1L.vue'),
  'customized-process3-fs1-5-g': () => import('@/views/product/activityPage/custompage/customizedProcess3-FS1-5G.vue'),
  'customized-process7-page1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page1.vue'),
  'customized-process7-page2': () => import('@/views/product/activityPage/custompage/customizedProcess7-page2.vue'),
  'customized-process7-page3': () => import('@/views/product/activityPage/custompage/customizedProcess7-page3.vue'),
  'customized-process7-page4-1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page4-1.vue'),
  'customized-process7-page5-1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1.vue'),
  'customized-process7-page5-1-b': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1B.vue'),
  'customized-process7-page5-1-c': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1C.vue'),
  'customized-process7-page5-1-d': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-1D.vue'),
  'customized-process7-page5-2': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2.vue'),
  'customized-process7-page5-2-b': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2B.vue'),
  'customized-process7-page5-2-c': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2C.vue'),
  'customized-process7-page5-2-d': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-2D.vue'),
  'customized-process7-page5-3': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3.vue'),
  'customized-process7-page5-3-b': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3B.vue'),
  'customized-process7-page5-3-c': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3C.vue'),
  'customized-process7-page5-3-d': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-3D.vue'),
  'customized-process7-page5-4': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-4.vue'),
  'customized-process7-page5-5': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-5.vue'),
  'customized-process7-page5-6': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-6.vue'),
  'customized-process7-page5-dyjg1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg1.vue'),
  'customized-process7-page5-dyjg2': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg2.vue'),
  'customized-process7-page5-dyjg3': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg3.vue'),
  'customized-process7-page5-dyjg4': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-Dyjg4.vue'),
  'customized-process7-page5-input-dyjg1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg1.vue'),
  'customized-process7-page5-input-dyjg2': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg2.vue'),
  'customized-process7-page5-input-dyjg3': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg3.vue'),
  'customized-process7-page5-input-dyjg4': () => import('@/views/product/activityPage/custompage/customizedProcess7-page5-InputDyjg4.vue'),
  'customized-process7-page6-1': () => import('@/views/product/activityPage/custompage/customizedProcess7-page6-1.vue'),
  'customized-process7-page6': () => import('@/views/product/activityPage/custompage/customizedProcess7-page6.vue'),
  'customized-process-programme': () => import('@/views/product/activityPage/custompage/customizedProcessProgramme.vue'),
  'zq-frame-design-page1': () => import('@/views/product/activityPage/custompage/zq-frameDesign-page1.vue'),
  'zq-frame-design-page2': () => import('@/views/product/activityPage/custompage/zq-frameDesign-page2.vue'),
  'zq-transmission-shaft-page1': () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page1.vue'),
  'zq-transmission-shaft-page2': () => import('@/views/product/activityPage/custompage/zq-transmissionShaft-page2.vue'),
};

/** 自定义页 key → 前端路由 path */
export const CUSTOM_PAGE_ROUTE_MAP: Record<string, string> = {
  'customized-process-ansys': '/internal/customized-process-ansys',
  'customized-process-jsinvoke': '/internal/customized-process-jsinvoke',
  'customized-process-page0': '/internal/customized-process-page0',
  'customized-process-page0-1': '/internal/customized-process-page0-1',
  'customized-process-page0-2': '/internal/customized-process-page0-2',
  'customized-process-page0-3': '/internal/customized-process-page0-3',
  'customized-process-page0-4': '/internal/customized-process-page0-4',
  'customized-process-page1': '/internal/customized-process-page1',
  'customized-process-page1-2': '/internal/customized-process-page1-2',
  'customized-process-page1-3': '/internal/customized-process-page1-3',
  'customized-process-page1-4': '/internal/customized-process-page1-4',
  'customized-process-page2': '/internal/customized-process-page2',
  'customized-process-page2-1': '/internal/customized-process-page2-1',
  'customized-process-page3': '/internal/customized-process-page3',
  'customized-process-page3-1': '/internal/customized-process-page3-1',
  'customized-process-page4': '/internal/customized-process-page4',
  'customized-process-page5': '/internal/customized-process-page5',
  'customized-process-page6': '/internal/customized-process-page6',
  'customized-process-page7': '/internal/customized-process-page7',
  'customized-process-page8': '/internal/customized-process-page8',
  'customized-process-page9': '/internal/customized-process-page9',
  'customized-process-page10': '/internal/customized-process-page10',
  'customized-process-page11': '/internal/customized-process-page11',
  'customized-process-tbdemo1-page1': '/internal/customized-process-tbdemo1-page1',
  'customized-process-tbdemo1-page2': '/internal/customized-process-tbdemo1-page2',
  'customized-process-zjzcjh1-1': '/internal/customized-process-zjzcjh1-1',
  'customized-process-zlkwjc1-1': '/internal/customized-process-zlkwjc1-1',
  'customized-process1-zt1-1-12': '/internal/customized-process1-zt1-1-12',
  'customized-process1-zt1-4-10-1': '/internal/customized-process1-zt1-4-10-1',
  'customized-process1-zt1-4-10-2': '/internal/customized-process1-zt1-4-10-2',
  'customized-process1-zt1-5-3-2-a': '/internal/customized-process1-zt1-5-3-2-a',
  'customized-process1-zt1-5-3-2-b': '/internal/customized-process1-zt1-5-3-2-b',
  'customized-process1-zt1-5-3-2-c': '/internal/customized-process1-zt1-5-3-2-c',
  'customized-process1-zt1-4-4': '/internal/customized-process1-zt1-4-4',
  'customized-process3-fs-1-5-1-j': '/internal/customized-process3-fs-1-5-1-j',
  'customized-process3-fs1-5-1-4': '/internal/customized-process3-fs1-5-1-4',
  'customized-process3-fs1-5-1-5': '/internal/customized-process3-fs1-5-1-5',
  'customized-process3-fs1-5-1-6': '/internal/customized-process3-fs1-5-1-6',
  'app-acbus-power-calculation': '/internal/app-acbus-power-calculation',
  'app-high-voltage-dcbus-calculation': '/internal/app-high-voltage-dcbus-calculation',
  'app-low-voltage-dcpower-calculation': '/internal/app-low-voltage-dcpower-calculation',
  'app-qsyg-tl-calculation': '/internal/app-qsyg-tl-calculation',
  'app-qsyg-xc-calculation': '/internal/app-qsyg-xc-calculation',
  'acbus-power-calculation': '/internal/acbus-power-calculation',
  'high-voltage-dcbus-calculation': '/internal/high-voltage-dcbus-calculation',
  'low-voltage-dcpower-calculation': '/internal/low-voltage-dcpower-calculation',
  'qsyg-tl-calculation': '/internal/qsyg-tl-calculation',
  'qsyg-xc-calculation': '/internal/qsyg-xc-calculation',
  'customized-process3-fs1-12-1-2-b': '/internal/customized-process3-fs1-12-1-2-b',
  'customized-process3-fs1-12-1-2-c': '/internal/customized-process3-fs1-12-1-2-c',
  'customized-process3-fs1-12-1-2-d': '/internal/customized-process3-fs1-12-1-2-d',
  'customized-process3-fs1-5-1-1-g': '/internal/customized-process3-fs1-5-1-1-g',
  'customized-process3-fs1-5-1-1-k': '/internal/customized-process3-fs1-5-1-1-k',
  'customized-process3-fs1-5-1-1-l': '/internal/customized-process3-fs1-5-1-1-l',
  'customized-process3-fs1-5-1-1-m': '/internal/customized-process3-fs1-5-1-1-m',
  'customized-process3-fs1-5-1-1-n': '/internal/customized-process3-fs1-5-1-1-n',
  'customized-process3-fs1-5-1-1-o': '/internal/customized-process3-fs1-5-1-1-o',
  'customized-process3-fs1-5-1-1-2': '/internal/customized-process3-fs1-5-1-1-2',
  'customized-process3-fs1-5-1-1-4': '/internal/customized-process3-fs1-5-1-1-4',
  'customized-process3-fs1-5-1-1-6': '/internal/customized-process3-fs1-5-1-1-6',
  'customized-process3-fs1-5-1-1-9': '/internal/customized-process3-fs1-5-1-1-9',
  'customized-process3-fs1-5-1-k': '/internal/customized-process3-fs1-5-1-k',
  'customized-process3-fs1-5-1-l': '/internal/customized-process3-fs1-5-1-l',
  'customized-process3-fs1-5-g': '/internal/customized-process3-fs1-5-g',
  'customized-process7-page1': '/internal/customized-process7-page1',
  'customized-process7-page2': '/internal/customized-process7-page2',
  'customized-process7-page3': '/internal/customized-process7-page3',
  'customized-process7-page4-1': '/internal/customized-process7-page4-1',
  'customized-process7-page5-1': '/internal/customized-process7-page5-1',
  'customized-process7-page5-1-b': '/internal/customized-process7-page5-1-b',
  'customized-process7-page5-1-c': '/internal/customized-process7-page5-1-c',
  'customized-process7-page5-1-d': '/internal/customized-process7-page5-1-d',
  'customized-process7-page5-2': '/internal/customized-process7-page5-2',
  'customized-process7-page5-2-b': '/internal/customized-process7-page5-2-b',
  'customized-process7-page5-2-c': '/internal/customized-process7-page5-2-c',
  'customized-process7-page5-2-d': '/internal/customized-process7-page5-2-d',
  'customized-process7-page5-3': '/internal/customized-process7-page5-3',
  'customized-process7-page5-3-b': '/internal/customized-process7-page5-3-b',
  'customized-process7-page5-3-c': '/internal/customized-process7-page5-3-c',
  'customized-process7-page5-3-d': '/internal/customized-process7-page5-3-d',
  'customized-process7-page5-4': '/internal/customized-process7-page5-4',
  'customized-process7-page5-5': '/internal/customized-process7-page5-5',
  'customized-process7-page5-6': '/internal/customized-process7-page5-6',
  'customized-process7-page5-dyjg1': '/internal/customized-process7-page5-dyjg1',
  'customized-process7-page5-dyjg2': '/internal/customized-process7-page5-dyjg2',
  'customized-process7-page5-dyjg3': '/internal/customized-process7-page5-dyjg3',
  'customized-process7-page5-dyjg4': '/internal/customized-process7-page5-dyjg4',
  'customized-process7-page5-input-dyjg1': '/internal/customized-process7-page5-input-dyjg1',
  'customized-process7-page5-input-dyjg2': '/internal/customized-process7-page5-input-dyjg2',
  'customized-process7-page5-input-dyjg3': '/internal/customized-process7-page5-input-dyjg3',
  'customized-process7-page5-input-dyjg4': '/internal/customized-process7-page5-input-dyjg4',
  'customized-process7-page6-1': '/internal/customized-process7-page6-1',
  'customized-process7-page6': '/internal/customized-process7-page6',
  'customized-process-programme': '/internal/customized-process-programme',
  'zq-frame-design-page1': '/internal/zq-frame-design-page1',
  'zq-frame-design-page2': '/internal/zq-frame-design-page2',
  'zq-transmission-shaft-page1': '/internal/zq-transmission-shaft-page1',
  'zq-transmission-shaft-page2': '/internal/zq-transmission-shaft-page2',
};

export type CustomPagePreviewTarget =
  | { type: 'route'; path: string; query?: Record<string, string> }
  | { type: 'external'; href: string };

/** 将录入的 page key（如 customizedProcess-ansys）规范为 registry key */
export function normalizeCustomPageKey(raw?: string | null): string {
  return String(raw ?? '')
    .trim()
    .replace(/\.vue$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/_/g, '-');
}

export function resolveCustomPageKey(pageUrl?: string | null, pageName?: string | null): string | null {
  const normalized = normalizeCustomPageKey(pageUrl);
  if (normalized && CUSTOM_PAGE_REGISTRY[normalized]) {
    return normalized;
  }
  const url = String(pageUrl ?? '').toLowerCase();
  const name = String(pageName ?? '').toLowerCase();
  if (
    url.includes('customized-process-ansys') ||
    url.includes('customizedprocess-ansys') ||
    url.includes('ansys') ||
    name.includes('ansys')
  ) {
    return 'customized-process-ansys';
  }
  if (
    url.includes('customized-process-jsinvoke') ||
    url.includes('customizedprocess-jsinvoke') ||
    url.includes('jsinvoke') ||
    name.includes('js')
  ) {
    return 'customized-process-jsinvoke';
  }
  if (
    url.includes('customized-process-page0-1') ||
    url.includes('customizedprocess-page0-1') ||
    url.includes('page0-1') ||
    url.includes('page0_1')
  ) {
    return 'customized-process-page0-1';
  }
  if (
    url.includes('customized-process-page0') ||
    url.includes('customizedprocess-page0') ||
    /(?:^|[^0-9_-])page0(?:[^0-9_-]|$)/.test(url) ||
    url.includes('page0_0')
  ) {
    return 'customized-process-page0';
  }
  return null;
}

export async function loadCustomPageComponent(key: string): Promise<Component | null> {
  const loader = CUSTOM_PAGE_REGISTRY[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default ?? null;
}

function buildPageIdQuery(record: { id?: string | number | null; pageId?: string | number | null }) {
  const pageId = String(record?.id ?? record?.pageId ?? '').trim();
  return pageId ? { pageId } : {};
}

function appendPageIdToUrl(url: URL, pageId: string) {
  if (
    pageId &&
    !url.searchParams.has('pageId') &&
    !url.searchParams.has('activityPageId') &&
    !url.searchParams.has('pageid')
  ) {
    url.searchParams.set('pageId', pageId);
  }
}

/** 解析自定义页预览目标（供 router.resolve 或外链打开） */
export function resolveCustomPagePreviewTarget(record: {
  url?: string | null;
  id?: string | number | null;
  pageId?: string | number | null;
}): CustomPagePreviewTarget | null {
  const raw = String(record?.url ?? '').trim();
  if (!raw) return null;

  const pageId = String(record?.id ?? record?.pageId ?? '').trim();
  const query = buildPageIdQuery(record);

  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    appendPageIdToUrl(url, pageId);
    return { type: 'external', href: url.href };
  }

  if (raw.startsWith('/')) {
    const path = raw.split('?')[0];
    const search = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : '';
    const mergedQuery = { ...query };
    if (search) {
      new URLSearchParams(search).forEach((value, key) => {
        mergedQuery[key] = value;
      });
    }
    return { type: 'route', path, query: mergedQuery };
  }

  const pageKey = resolveCustomPageKey(raw) ?? normalizeCustomPageKey(raw);
  const routePath = CUSTOM_PAGE_ROUTE_MAP[pageKey];
  if (!routePath) return null;

  return { type: 'route', path: routePath, query };
}
