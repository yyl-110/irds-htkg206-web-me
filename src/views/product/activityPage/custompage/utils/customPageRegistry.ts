import type { Component } from 'vue';

export type CustomPageLoader = () => Promise<{ default: Component }>;

export const CUSTOM_PAGE_REGISTRY: Record<string, CustomPageLoader> = {
  'customized-process-ansys': () => import('@/views/product/activityPage/custompage/customizedProcess-ansys.vue'),
  'customized-process-jsinvoke': () => import('@/views/product/activityPage/custompage/customizedProcess-jsinvoke.vue'),
};

/** 自定义页 key → 前端路由 path */
export const CUSTOM_PAGE_ROUTE_MAP: Record<string, string> = {
  'customized-process-ansys': '/internal/customized-process-ansys',
  'customized-process-jsinvoke': '/internal/customized-process-jsinvoke',
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
