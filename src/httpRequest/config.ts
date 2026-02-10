export type HttpRequestAxiosHeaders = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';

/** 请求相关配置 */
export default class HttpRequestConfig {
  /** api 请求基础路径 */
  static baseUrl: string = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL;

  /** 接口成功返回状态码 */
  static resultCode: number | string = 200;

  /** 接口请求超时时间 */
  static requestTimeout: number = 50000;

  /** 默认接口请求类型 */
  static defaultHeaders: HttpRequestAxiosHeaders = 'application/json';

  /** 请求头中的 token 值前缀 */
  static tokenHeaderPrefix: string = import.meta.env.VITE_TOKEN_HEADER_PREFIX;
}
