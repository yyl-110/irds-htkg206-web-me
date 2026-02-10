import { useCache } from '@/hooks/web/useCache';
import type { TokenType } from '@/api/login/types';
import { decrypt, encrypt } from '@/utils/jsencrypt';
import HttpRequestConfig from '@/httpRequest/config';

const { wsCache } = useCache();

const AccessTokenKey = 'ACCESS_TOKEN';
const RefreshTokenKey = 'REFRESH_TOKEN';

/** 获取token */
export function getAccessToken() {
  return wsCache.get<string>(AccessTokenKey);
}

/** 刷新token */
export function getRefreshToken() {
  return wsCache.get(RefreshTokenKey);
}

/**
 * 设置token
 * @param token
 */
export function setToken(token: TokenType) {
  // { exp: token.expiresTime }
  wsCache.set(RefreshTokenKey, token.refreshToken);
  wsCache.set(AccessTokenKey, token.accessToken);
}

/**
 * 删除token
 */
export function removeToken() {
  wsCache.delete(AccessTokenKey);
  wsCache.delete(RefreshTokenKey);
}

/**
 * 格式化token（jwt格式）
 * @param token
 */
export function formatToken(token: string): string {
  return HttpRequestConfig.tokenHeaderPrefix + token;
}
// ========== 账号相关 ==========

const LoginFormKey = 'LOGINFORM';

export interface LoginFormType {
  tenantName: string;
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * getLoginForm
 */
export function getLoginForm() {
  const loginForm = wsCache.get<LoginFormType>(LoginFormKey);
  if (loginForm) loginForm.password = decrypt(loginForm.password) as string;

  return loginForm;
}

/**
 * set login form
 * @param loginForm
 */
export function setLoginForm(loginForm: LoginFormType) {
  loginForm.password = encrypt(loginForm.password) as string;
  wsCache.set(LoginFormKey, loginForm, { exp: 30 * 24 * 60 * 60 });
}

/** remove login form */
export function removeLoginForm() {
  wsCache.delete(LoginFormKey);
}

// ========== 租户相关 ==========

const TenantIdKey = 'TENANT_ID';
const TenantNameKey = 'TENANT_NAME';

/**
 * getTenantName
 */
export function getTenantName() {
  return wsCache.get(TenantNameKey);
}

/**
 * setTenantName
 * @param username
 */
export function setTenantName(username: string) {
  wsCache.set(TenantNameKey, username, { exp: 30 * 24 * 60 * 60 });
}

/** removeTenantName */
export function removeTenantName() {
  wsCache.delete(TenantNameKey);
}

/** getTenantId */
export function getTenantId() {
  return wsCache.get(TenantIdKey);
}

/**
 * setTenantId
 * @param username
 */
export function setTenantId(username: string) {
  wsCache.set(TenantIdKey, username);
}

/** removeTenantId */
export function removeTenantId() {
  wsCache.delete(TenantIdKey);
}
