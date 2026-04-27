import axios from 'axios';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
import type { TokenType } from '@/api/login/types';
import { getAccessTokenExpiresTimeMs, getRefreshToken, getTenantId, setToken } from '@/utils/auth';

/** 在 access 过期前多久（ms）主动用 refresh 续期，避免仅依赖 401 / code -8 的被动刷新 */
const LEAD_BEFORE_EXPIRE_MS = 4 * 60 * 1000;
/** 无过期时间时，兜底定时续期间隔 */
const FALLBACK_INTERVAL_MS = 8 * 60 * 1000;

let proactiveTimer: ReturnType<typeof setTimeout> | null = null;

export function clearProactiveTokenRefresh() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

/**
 * 登录/刷新后调用：在 access 将过期前主动续期，使「持续使用且间隔有请求」时不易因 access 过短而掉线。
 * 若后端未回传 expiresTime，则按固定间隔用 refresh 续期（仍依赖 refresh 未过期）。
 */
export function scheduleProactiveTokenRefresh() {
  clearProactiveTokenRefresh();
  if (!getRefreshToken()) return;

  const exp = getAccessTokenExpiresTimeMs();
  let delay: number;
  if (exp != null) {
    delay = exp - Date.now() - LEAD_BEFORE_EXPIRE_MS;
    delay = Math.max(15_000, delay);
  } else {
    delay = FALLBACK_INTERVAL_MS;
  }

  proactiveTimer = setTimeout(async () => {
    proactiveTimer = null;
    const rt = getRefreshToken();
    if (!rt) return;
    try {
      axios.defaults.headers.common['tenant-id'] = getTenantId();
      const res = await AdminApiSystemAuth.refreshToken({ refreshToken: rt });
      setToken(res.data.data as unknown as TokenType);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('[auth] proactive refresh failed', e);
      }
      if (getRefreshToken()) {
        setTimeout(() => {
          scheduleProactiveTokenRefresh();
        }, 60_000);
      }
    }
  }, delay);
}

/** 应用启动、已存在本地 token 时补一次定时续期 */
export function initAccessTokenRefreshSchedule() {
  if (getRefreshToken()) {
    scheduleProactiveTokenRefresh();
  }
}
