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
