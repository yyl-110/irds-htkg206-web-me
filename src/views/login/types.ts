import type { TokenType } from '@/api/login/types';
import { updateUserData } from '@/router/state';
import { setTenantId, setToken } from '@/utils/auth';
import { router } from '@/router';

export interface FormUserInfo {
  userName: string;
  password: string;
}

/** SSO 登录 GET 参数 */
export class SSOLoginParams {
  userId: string = '';
  accessToken: string = '';
  refreshToken: string = '';
  /** 重定向地址 */
  state: string = '';
  tenantId: string = '';
  /**
   * 从 params 中实例化参数
   * 📌 for debug:
   * ```typescript
   * console.log(location.origin + location.pathname + '#/sso-login' + '?accessToken=' + JSON.parse(localStorage.getItem('ACCESS_TOKEN')).v.replace(/"/g, '') + '&refreshToken=' + JSON.parse(localStorage.getItem('REFRESH_TOKEN')).v.replace(/"/g, '') + '&tenantId=' + JSON.parse(localStorage.getItem('TENANT_ID')).v.replace(/"/g, '') + '&userId=' + JSON.parse(JSON.parse(localStorage.getItem('user')).v).user.id + '&state=/user/profile')
   * // => `http://localhost:5173/#/sso-login?accessToken=xxx&refreshToken=xxx&tenantId=xxx&userId=252&state=/user/profile`
   * ```
   * @param params route params
   */
  static from(params: object) {
    const res = new SSOLoginParams();
    Object.assign(res, params);
    return res;
  }

  /** check params */
  check() {
    if (!this.userId) return 'Missing userId';
    if (!this.accessToken) return 'Missing accessToken';
    if (!this.refreshToken) return 'Missing refreshToken';
    if (!this.state) return 'Missing state';
    if (!this.tenantId) return 'Missing tenantId';
    return '';
  }

  /** save params */
  async save() {
    setTenantId(this.tenantId);
    setToken(this as unknown as TokenType);
    await updateUserData(router);
    this.redirect();
    router.replace({ path: this.state });
    // location.reload()
  }

  /** 重定向到指定地址({@link state}) */
  redirect() {
    if (location.hash.indexOf('#/') === 0) location.href = `${location.origin + location.pathname}#${this.state}`;
    else location.href = location.origin + this.state;
  }
}

/** 外部系统单点登录 */
export class OuterSSOLoginParams {
  flag: string = ''; // password | token
  sys: string = ''; // fuwu | xny | zq | sq | st | tlzg | lwzg
  username: string = '';
  password: string = '';
  token: string = '';
  /** 重定向地址 */
  state: string = '/project-part/PartComponent';
  tenantId: string = '1';

  static from(params: object) {
    const res = new OuterSSOLoginParams();
    Object.assign(res, params);
    return res;
  }

  // 参数校验
  check() {
    if (!this.flag) {
      return '非法操作,code: 400001';
    }
    return '';
  }

  async ssoLogin() {
    // 调用登录函数
    setTenantId('1');
    setToken(this as unknown as TokenType);
    await updateUserData(router);
    this.redirect();
    router.replace({ path: this.state });
  }

  /** 重定向到指定地址({@link state}) */
  redirect() {
    if (location.hash.indexOf('#/') === 0) location.href = `${location.origin + location.pathname}#${this.state}`;
    else location.href = location.origin + this.state;
  }
}
