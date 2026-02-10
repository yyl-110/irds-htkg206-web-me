import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import { Modal } from 'ant-design-vue';
import type { ModalFunc } from 'ant-design-vue/es/modal/Modal';
import { get, set } from 'lodash-es';
import { BaseModel } from '@/utils/BaseModel';
import HttpRequestConfig from './config';
import errorCode from './errorCode';
import { service } from './service';
import { type HttpRequestResponse, ResponseError } from './typings';
import { getConfigByAxiosConfig, pendingRequests } from './pending';
import { getAccessToken, getRefreshToken, getTenantId, removeToken, setToken } from '@/utils/auth';
import { WeiMessage } from '@/utils/WeiMessage';
import { useCache } from '@/hooks/web/useCache';
import { router } from '@/router';
import { isRelogin, resetRouter, updatedUserData } from '@/router/state';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
import { useWeiTab } from '@/hooks/useWeiTab';
import type { TokenType } from '@/api/login/types';
import { WeiI18n } from '@/utils/WeiI18n';
import appStore from '@/store';
import { useUserStore } from '@/store/modules/user';
/** 获取用户对象 */
/** 需要忽略的提示。忽略后，自动 Promise.reject('error') */
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期', // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
];

// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
/** 请求队列 */
let requestList: any[] = [];
/** 是否正在刷新中 */
let isRefreshToken = false;
/** 请求白名单，无须token的接口 */
const whiteList: string[] = ['/login', '/sso-login', '/refresh-token', '/outer-sso'];

/** response 中的 code 值枚举 */
export enum ResponseCode {
  /** 请求成功 */
  Successfully = 200,
  /** 认证失败，无法访问系统资源 */
  Unauthorized = 401,
  /** 当前操作没有权限 */
  Forbidden = 403,
  /** 访问资源不存在 */
  NotFound = 404,
  itong,
}

/**
 * 在请求头中加入 `access token`
 * @description 若当前 url 存在于白名单中, 或请求头中存在 `noToken`, 则不会添加 `access token`
 * @param url request URL
 * @param headers request headers
 */
function setHeaderToken(url: string | undefined, headers: AxiosRequestHeaders) {
  if (!url || get(headers, 'noToken') === true || whiteList.includes(url)) {
    return false;
  }
  const headerToken = getAccessToken();
  set(headers, 'Authorization', HttpRequestConfig.tokenHeaderPrefix + headerToken);
  return true;
}

/**
 * 生成 请求错误或失败时的异常类 实例
 * @param response 接口返回值
 * @param message 错误信息
 */
function toResponseError(response: AxiosResponse<HttpRequestResponse>, message?: string) {
  const res = BaseModel.toModel(ResponseError, response);
  if (message) res.message = message;
  return res;
}

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<HttpRequestResponse>) => {
    // 1. 在请求头中增加 access token
    setHeaderToken(config.url, config.headers);

    // 2. 在请求头中增加 tenant id
    const tenantId = getTenantId();
    if (tenantId) config.headers['tenant-id'] = tenantId;
    const userStore = useUserStore();
    config.headers.language = localStorage.getItem('wei-language');
    config.headers['login-user-id'] = userStore.getUser.id;
    // 3. 在 header 中加入当前菜单
    const route = router.currentRoute;
    if (route.value) {
      const moduleName = (route.value.matched || []).map(r => r.meta.title).join('-');
      config.headers['module-name'] = encodeURIComponent(moduleName);
    }

    // 4. 处理 form 表单请求, 从芋道迁移, 参考 https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/src/config/axios/service.ts#L64
    const data = config.data || false;
    if (config.method?.toUpperCase() === 'POST' && (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded') {
      (config.data as unknown as string) = qs.stringify(data);
    }

    // 5. 处理 GET 请求参数编码, 从芋道迁移, 参考 https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/src/config/axios/service.ts#L72
    const params = config.params || {};
    if (config.method?.toUpperCase() === 'GET' && params && !config.paramsSerializer) {
      let url = `${config.url}?`;
      for (const propName in params) {
        const value = params[propName];
        if (value !== undefined && value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const val of Object.keys(value)) {
              const params = `${propName}[${val}]`;
              const subPart = `${encodeURIComponent(params)}=`;
              url += `${subPart + encodeURIComponent(value[val])}&`;
            }
          } else {
            url += `${propName}=${encodeURIComponent(value)}&`;
          }
        }
      }
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据
      // const now = new Date().getTime()
      // params = params.substring(0, url.length - 1) + `?_t=${now}`
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    // 6. 加入 pendingRequests
    if (config.url) pendingRequests.value[config.url] = getConfigByAxiosConfig(config);
    return config;
  },
  (error: AxiosError) => {
    Promise.reject(error);
  }
);

/**
 * 将 Blob 或 ArrayBuffer 数据转换为 JSON 对象
 * @param data Blob 或 ArrayBuffer 数据
 * @returns Promise 包含解析后的 JSON 对象
 * @throws {Error} 如果转换失败或数据类型不支持
 */
function blobOrArrayBufferToJson(data: Blob | ArrayBuffer): Promise<object> {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();

    /** onload */
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const json = JSON.parse(text);
        resolve(json);
      } catch (error) {
        reject(new Error('Failed to parse data as JSON.'));
      }
    };

    /** onerror */
    reader.onerror = () => {
      reject(new Error('Failed to read data.'));
    };

    if (data instanceof Blob) {
      reader.readAsText(data);
    } else if (data instanceof ArrayBuffer) {
      const blob = new Blob([data]);
      reader.readAsText(blob);
    } else {
      reject(new Error('Unsupported data type.'));
    }
  });
}

service.interceptors.response.use(
  async (response: AxiosResponse<HttpRequestResponse>) => {
    let { data } = response;
    const config = response.config;
    // 0. 将其从 pendingRequests 中移除
    if (config && config.url) Reflect.deleteProperty(pendingRequests.value, config.url);
    // 1. 若返回值为空, 则直接抛出异常(后端接口返回值应该保持 `AxiosResponse` 结构, 不应该返回空)
    if (!data) throw new Error('返回“[HTTP]请求没有返回值”');

    // 2. 处理二进制数据, 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      // 此时虽然返回的是 Blob / ArrayBuffer, 但是实际返回的是 json, 可能是接口报错, 需要将 Blob / ArrayBuffer 转为 json 并执行错误处理逻辑
      if (response.headers['content-type'].indexOf('application/json') === 0) {
        data = (await blobOrArrayBufferToJson(data as any)) as any;
      } else {
        // 返回的是正常的 Blob / ArrayBuffer
        return data;
      }
    }
    /**
     * response 状态码
     * @description 未设置状态码则默认成功状态
     */
    const code = Number(data.code || HttpRequestConfig.resultCode);
    /**
     * 错误提示信息
     * @description 优先使用 `msg`, 或者从 {@link errorCode} 中根据 `code` 匹配, 否则使用 {@link errorCode}.default
     */
    const msg = data.msg || get(errorCode, code) || errorCode.default;
    // 3. 如果是忽略的错误码, 则直接返回 `response`
    if (ignoreMsgs.includes(msg)) {
      return Promise.reject(toResponseError(response));
    }
    // 4. 处理 token 过期
    else if (code === -8) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true;
        // 4.1. 如果获取不到刷新令牌，则只能执行登出操作
        if (!getRefreshToken()) return handleAuthorized();
        // 4.2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await refreshToken();
          // 4.2.1 刷新成功，则回放队列的请求 + 当前请求
          setToken(refreshTokenRes.data.data as unknown as TokenType);
          config.headers!.Authorization = HttpRequestConfig.tokenHeaderPrefix + getAccessToken();
          requestList.forEach(cb => cb());
          requestList = [];
          return service(config);
        } catch (e) {
          console.error('refresh token failed', e);
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 4.2.2 刷新失败，只回放队列的请求
          requestList.forEach(cb => cb());
          // 提示是否要登出。即不回放当前请求！不然会形成递归
          return handleAuthorized();
        } finally {
          requestList = [];
          isRefreshToken = false;
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise(resolve => {
          requestList.push(() => {
            config.headers!.Authorization = HttpRequestConfig.tokenHeaderPrefix + getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(service(config));
          });
        }) as any;
      }
    }
    // 5. 处理 500
    else if (code === 500) {
      WeiMessage.error(WeiI18n.t('服务器错误,请联系管理员!').value);
      // return Promise.reject(response)
      return Promise.reject(toResponseError(response, WeiI18n.t('服务器错误,请联系管理员!').value));
    } else if (code === 901) {
      // return Promise.reject(response)
      return Promise.reject(toResponseError(response));
      // 处理IAM跳转逻辑
    } else if (code === 1002000013) {
      return Promise.reject(response);
    }
    // 6. 处理其他错误码
    else if (Number(code) !== ResponseCode.Successfully && Number(code) !== ResponseCode.Unauthorized && Number(code) !== 0) {
      WeiMessage.error(WeiI18n.t(msg).value);
      // return Promise.reject(response)
      return Promise.reject(toResponseError(response, msg));
    }
    // 7. 无错误
    else {
      return response;
    }
  },
  // 处理请求失败
  async (error: AxiosError) => {
    console.log(error, 'error');
    if (error.response && error.response.status === -8) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true;
        if (!getRefreshToken()) {
          handleAuthorized();
          return;
        }
        // 4.2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await refreshToken();
          // 4.2.1 刷新成功，则回放队列的请求 + 当前请求
          setToken(refreshTokenRes.data.data as unknown as TokenType);
          error.response.config.headers!.Authorization = HttpRequestConfig.tokenHeaderPrefix + getAccessToken();
          requestList.forEach(cb => cb());
          requestList = [];
          return service(error.response.config);
        } catch (e) {
          console.error('refresh token failed', e);
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 4.2.2 刷新失败，只回放队列的请求
          requestList.forEach(cb => cb());
          // 提示是否要登出。即不回放当前请求！不然会形成递归;
          handleAuthorized();
          return;
        } finally {
          requestList = [];
          isRefreshToken = false;
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise(resolve => {
          requestList.push(() => {
            error.response.config.headers!.Authorization = HttpRequestConfig.tokenHeaderPrefix + getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(service(error.response.config));
          });
        }) as any;
      }
    } else {
      let message = error.message;
      if (message === 'Network Error') message = '操作失败,系统异常!';
      else if (message.includes('timeout')) message = '接口请求超时,请刷新页面重试!';
      else if (message.includes('Request failed with status code')) message = `请求出错,请稍候重试${message.substr(message.length - 3)}`;
      console.error('[axios interceptors]: error', message, isRefreshToken);
      if (error.response.status !== 401) {
        // WeiMessage.error(message);
      }
      // return Promise.reject(error)
      if (error && error.config && error.config.url) Reflect.deleteProperty(pendingRequests.value, error.config.url);
      return Promise.reject(error);
    }
  }
);

/** 使用 refresh token 刷新 access token */
async function refreshToken() {
  axios.defaults.headers.common['tenant-id'] = getTenantId();
  return await AdminApiSystemAuth.refreshToken({
    refreshToken: getRefreshToken(),
  });
}

/** 登录超时, 退出登录弹窗 */
let logoutModal: ReturnType<ModalFunc> | null = null;

/** 清空缓存并跳转到登录页 */
export async function toLogin() {
  try {
    const { clear } = useWeiTab();
    const { wsCache } = useCache();
    resetRouter(); // 重置静态路由表
    wsCache.clear();
    removeToken();
    await clear();
    isRelogin.show = false;
    updatedUserData.value = false;
    router.push('/login');
    if (logoutModal) logoutModal.destroy();
  } catch (error) {
    console.log(error, 'error');
  }
}
/** 提示重新登录 */
function handleAuthorized() {
  if (!isRelogin.show) {
    isRelogin.show = true;
    if (logoutModal) logoutModal.destroy();
    if (router.currentRoute.value.path === '/login') return; // 忽略已经跳转到登录页的情况
    logoutModal = Modal.confirm({
      title: '系统提示',
      content: '登录超时,请重新登录!',
      okText: WeiI18n.t('确认').value,
      cancelText: WeiI18n.t('取消').value,
      closable: false,
      onOk() {
        toLogin();
      },
      onCancel() {
        toLogin();
      },
    });
  }
  return Promise.reject(new Error('登录超时,请重新登录!'));
}

export default service;
export { service } from './service';
export type { AxiosInstance, AxiosResponse, AxiosRequestConfig };
