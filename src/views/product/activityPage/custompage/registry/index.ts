import type { Component } from 'vue';
import {
  syncFlowContextFromTaskParamMap,
  type CustomPageSavedParamRow,
  type CustomPageSavedTableRow,
} from '../_shared/utils/taskParamMapMerge';
import { CUSTOM_PAGE_PARAMETER_LOADERS } from './parameterLoaders';

export type { CustomPageSavedParamRow };

export type CustomPageLoader = () => Promise<{ default: Component }>;

type CustomPageEntry = readonly [key: string, loader: CustomPageLoader];

const CUSTOM_PAGE_ROUTE_PREFIX = '/internal';

/** 自定义页注册表（key → 组件懒加载） */
const CUSTOM_PAGE_ENTRIES: CustomPageEntry[] = [
  // 通用计算
  ['customized-process-ansys', () => import('../customizedProcess-ansys.vue')],
  ['customized-process-jsinvoke', () => import('../customizedProcess-jsinvoke.vue')],

  // 定制流程 page0 ~ page11
  ['customized-process-page0', () => import('../customizedProcess-page0.vue')],
  ['customized-process-page0-1', () => import('../customizedProcess-page0-1.vue')],
  ['customized-process-page0-2', () => import('../customizedProcess-page0-2.vue')],
  ['customized-process-page0-3', () => import('../customizedProcess-page0-3.vue')],
  ['customized-process-page0-4', () => import('../customizedProcess-page0-4.vue')],
  ['customized-process-page1', () => import('../customizedProcess-page1.vue')],
  ['customized-process-page1-1', () => import('../customizedProcess-page1-1.vue')],
  ['customized-process-page1-2', () => import('../customizedProcess-page1-2.vue')],
  ['customized-process-page1-3', () => import('../customizedProcess-page1-3.vue')],
  ['customized-process-page1-4', () => import('../customizedProcess-page1-4.vue')],
  ['customized-process-page2', () => import('../customizedProcess-page2.vue')],
  ['customized-process-page2-1', () => import('../customizedProcess-page2-1.vue')],
  ['customized-process-page3', () => import('../customizedProcess-page3.vue')],
  ['customized-process-page3-1', () => import('../customizedProcess-page3-1.vue')],
  ['customized-process-page4', () => import('../customizedProcess-page4.vue')],
  ['customized-process-page5', () => import('../customizedProcess-page5.vue')],
  ['customized-process-page6', () => import('../customizedProcess-page6.vue')],
  ['customized-process-page7', () => import('../customizedProcess-page7.vue')],
  ['customized-process-page8', () => import('../customizedProcess-page8.vue')],
  ['customized-process-page9', () => import('../customizedProcess-page9.vue')],
  ['customized-process-page10', () => import('../customizedProcess-page10.vue')],
  ['customized-process-page11', () => import('../customizedProcess-page11.vue')],

  // TB Demo
  ['customized-process-tbdemo1-page1', () => import('../customizedProcess-tbdemo1-page1.vue')],
  ['customized-process-tbdemo1-page2', () => import('../customizedProcess-tbdemo1-page2.vue')],

  // 车架 / 纵梁校核
  ['customized-process-zjzcjh1-1', () => import('../customizedProcess-zjzcjh1-1.vue')],
  ['customized-process-zlkwjc1-1', () => import('../customizedProcess-zlkwjc1-1.vue')],

  // ZT1 系列
  ['customized-process1-zt1-1-12', () => import('../customizedProcess1-ZT1_1_12.vue')],
  ['customized-process1-zt1-4-10-1', () => import('../customizedProcess1-ZT1_4_10_1.vue')],
  ['customized-process1-zt1-4-10-2', () => import('../customizedProcess1-ZT1_4_10_2.vue')],
  ['customized-process1-zt1-5-3-2-a', () => import('../customizedProcess1-ZT1_5_3_2A.vue')],
  ['customized-process1-zt1-5-3-2-b', () => import('../customizedProcess1-ZT1_5_3_2B.vue')],
  ['customized-process1-zt1-5-3-2-c', () => import('../customizedProcess1-ZT1_5_3_2C.vue')],
  ['customized-process1-zt1-4-4', () => import('../customizedProcess1-ZT1-4-4.vue')],

  // FS3 开口设计
  ['customized-process3-fs-1-5-1-j', () => import('../customizedProcess3-FS-1-5-1J.vue')],
  ['customized-process3-fs1-5-1-4', () => import('../customizedProcess3-FS1-5-1_4.vue')],
  ['customized-process3-fs1-5-1-5', () => import('../customizedProcess3-FS1-5-1_5.vue')],
  ['customized-process3-fs1-5-1-6', () => import('../customizedProcess3-FS1-5-1_6.vue')],

  // 配电计算
  ['app-acbus-power-calculation', () => import('../calculation/AppAcbusPowerCalculation.vue')],
  ['app-high-voltage-dcbus-calculation', () => import('../calculation/AppHighVoltageDCbusCalculation.vue')],
  ['app-low-voltage-dcpower-calculation', () => import('../calculation/AppLowVoltageDCPowerCalculation.vue')],
  ['app-qsyg-tl-calculation', () => import('../calculation/AppQsygTlCalculation.vue')],
  ['app-qsyg-xc-calculation', () => import('../calculation/AppQsygXcCalculation.vue')],
  ['acbus-power-calculation', () => import('../calculation/acbusPowerCalculation.vue')],
  ['high-voltage-dcbus-calculation', () => import('../calculation/highVoltageDCbusCalculation.vue')],
  ['low-voltage-dcpower-calculation', () => import('../calculation/lowVoltageDCPowerCalculation.vue')],
  ['qsyg-tl-calculation', () => import('../calculation/qsygTlCalculation.vue')],
  ['qsyg-xc-calculation', () => import('../calculation/qsygXcCalculation.vue')],

  // FS3 扩展页面
  ['customized-process3-fs1-12-1-2-b', () => import('../customizedProcess3-FS1-12-1-2B.vue')],
  ['customized-process3-fs1-12-1-2-c', () => import('../customizedProcess3-FS1-12-1-2C.vue')],
  ['customized-process3-fs1-12-1-2-d', () => import('../customizedProcess3-FS1-12-1-2D.vue')],
  ['customized-process3-fs1-5-1-1-g', () => import('../customizedProcess3-FS1-5-1-1G.vue')],
  ['customized-process3-fs1-5-1-1-k', () => import('../customizedProcess3-FS1-5-1-1K.vue')],
  ['customized-process3-fs1-5-1-1-l', () => import('../customizedProcess3-FS1-5-1-1L.vue')],
  ['customized-process3-fs1-5-1-1-m', () => import('../customizedProcess3-FS1-5-1-1M.vue')],
  ['customized-process3-fs1-5-1-1-n', () => import('../customizedProcess3-FS1-5-1-1N.vue')],
  ['customized-process3-fs1-5-1-1-o', () => import('../customizedProcess3-FS1-5-1-1O.vue')],
  ['customized-process3-fs1-5-1-1-2', () => import('../customizedProcess3-FS1-5-1-1_2.vue')],
  ['customized-process3-fs1-5-1-1-4', () => import('../customizedProcess3-FS1-5-1-1_4.vue')],
  ['customized-process3-fs1-5-1-1-6', () => import('../customizedProcess3-FS1-5-1-1_6.vue')],
  ['customized-process3-fs1-5-1-1-9', () => import('../customizedProcess3-FS1-5-1-1_9.vue')],
  ['customized-process3-fs1-5-1-k', () => import('../customizedProcess3-FS1-5-1K.vue')],
  ['customized-process3-fs1-5-1-l', () => import('../customizedProcess3-FS1-5-1L.vue')],
  ['customized-process3-fs1-5-g', () => import('../customizedProcess3-FS1-5G.vue')],

  // Process7 系列
  ['customized-process7-page1', () => import('../customizedProcess7-page1.vue')],
  ['customized-process7-page2', () => import('../customizedProcess7-page2.vue')],
  ['customized-process7-page3', () => import('../customizedProcess7-page3.vue')],
  ['customized-process7-page4-1', () => import('../customizedProcess7-page4-1.vue')],
  ['customized-process7-page5-1', () => import('../customizedProcess7-page5-1.vue')],
  ['customized-process7-page5-1-b', () => import('../customizedProcess7-page5-1B.vue')],
  ['customized-process7-page5-1-c', () => import('../customizedProcess7-page5-1C.vue')],
  ['customized-process7-page5-1-d', () => import('../customizedProcess7-page5-1D.vue')],
  ['customized-process7-page5-2', () => import('../customizedProcess7-page5-2.vue')],
  ['customized-process7-page5-2-b', () => import('../customizedProcess7-page5-2B.vue')],
  ['customized-process7-page5-2-c', () => import('../customizedProcess7-page5-2C.vue')],
  ['customized-process7-page5-2-d', () => import('../customizedProcess7-page5-2D.vue')],
  ['customized-process7-page5-3', () => import('../customizedProcess7-page5-3.vue')],
  ['customized-process7-page5-3-b', () => import('../customizedProcess7-page5-3B.vue')],
  ['customized-process7-page5-3-c', () => import('../customizedProcess7-page5-3C.vue')],
  ['customized-process7-page5-3-d', () => import('../customizedProcess7-page5-3D.vue')],
  ['customized-process7-page5-4', () => import('../customizedProcess7-page5-4.vue')],
  ['customized-process7-page5-5', () => import('../customizedProcess7-page5-5.vue')],
  ['customized-process7-page5-6', () => import('../customizedProcess7-page5-6.vue')],
  ['customized-process7-page5-dyjg1', () => import('../customizedProcess7-page5-Dyjg1.vue')],
  ['customized-process7-page5-dyjg2', () => import('../customizedProcess7-page5-Dyjg2.vue')],
  ['customized-process7-page5-dyjg3', () => import('../customizedProcess7-page5-Dyjg3.vue')],
  ['customized-process7-page5-dyjg4', () => import('../customizedProcess7-page5-Dyjg4.vue')],
  ['customized-process7-page5-input-dyjg1', () => import('../customizedProcess7-page5-InputDyjg1.vue')],
  ['customized-process7-page5-input-dyjg2', () => import('../customizedProcess7-page5-InputDyjg2.vue')],
  ['customized-process7-page5-input-dyjg3', () => import('../customizedProcess7-page5-InputDyjg3.vue')],
  ['customized-process7-page5-input-dyjg4', () => import('../customizedProcess7-page5-InputDyjg4.vue')],
  ['customized-process7-page6-1', () => import('../customizedProcess7-page6-1.vue')],
  ['customized-process7-page6', () => import('../customizedProcess7-page6.vue')],

  // 方案 / 车架 / 传动轴
  ['customized-process-programme', () => import('../customizedProcessProgramme.vue')],
  ['zq-frame-design-page1', () => import('../zq-frameDesign-page1.vue')],
  ['zq-frame-design-page2', () => import('../zq-frameDesign-page2.vue')],
  ['zq-transmission-shaft-page1', () => import('../zq-transmissionShaft-page1.vue')],
  ['zq-transmission-shaft-page2', () => import('../zq-transmissionShaft-page2.vue')],
];

export const CUSTOM_PAGE_REGISTRY: Record<string, CustomPageLoader> = Object.fromEntries(
  CUSTOM_PAGE_ENTRIES.map(([key, loader]) => [key, loader]),
);

/** 自定义页 key → 前端路由 path */
export const CUSTOM_PAGE_ROUTE_MAP: Record<string, string> = Object.fromEntries(
  CUSTOM_PAGE_ENTRIES.map(([key]) => [key, `${CUSTOM_PAGE_ROUTE_PREFIX}/${key}`]),
);

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
  if (url.includes('customized-process-ansys') || url.includes('customizedprocess-ansys')) {
    return 'customized-process-ansys';
  }
  if (url.includes('customized-process-jsinvoke') || url.includes('customizedprocess-jsinvoke')) {
    return 'customized-process-jsinvoke';
  }
  if (url.includes('customized-process-page0-1') || url.includes('customizedprocess-page0-1')) {
    return 'customized-process-page0-1';
  }
  if (url.includes('customized-process-page0') || url.includes('customizedprocess-page0')) {
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

export async function loadCustomPageParameters(
  key: string,
  pageId: string,
  saved?: CustomPageSavedParamRow[] | null,
  savedTables?: CustomPageSavedTableRow[] | null,
): Promise<unknown[]> {
  syncFlowContextFromTaskParamMap(saved, savedTables);
  const loader = CUSTOM_PAGE_PARAMETER_LOADERS[key];
  if (!loader) return [];
  return loader(String(pageId ?? '').trim(), saved, savedTables);
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
