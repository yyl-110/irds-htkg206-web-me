import { WebStorage } from '@/utils/WebStorage';

type CacheType = 'localStorage' | 'sessionStorage';

export const CACHE_KEY = {
  IS_DARK: 'isDark',
  USER: 'user',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  ROLE_ROUTERS: 'roleRouters',
  DICT_CACHE: 'dictCache',
  NOTICE_CACHE: 'notice',
  AnID: 'AnnouncementID',
};

/**
 * 获取 {@link WebStorage} 实例
 * @param type storage type
 */
export function useCache(type: CacheType = 'localStorage') {
  const wsCache = new WebStorage({ storage: type });
  return {
    wsCache,
  };
}

/**
 * 获取 {@link WebStorage} 实例
 * @param type storage type
 */
export function useCacheid(type: CacheType = 'localStorage') {
  const wsCacheid = new WebStorage({ storage: type });
  return {
    wsCacheid,
  };
}
