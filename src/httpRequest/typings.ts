import type { AxiosResponse, AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'

/** 接口返回值数据类型 */
export interface HttpRequestResponse<T = any> {
  code: number | string
  data: T
  msg: string
}

/**
 * 请求错误时的异常类
 * @description 详见 [错误处理](../../docs/framework/request.md)
 */
export class ResponseError<D = any, R = any> extends Error implements AxiosResponse<HttpRequestResponse> {
  config!: InternalAxiosRequestConfig<R>
  request?: any
  data!: HttpRequestResponse<D>
  status!: number
  statusText!: string
  headers!: RawAxiosResponseHeaders | AxiosResponseHeaders
  /** 为 true 表示 axios 响应拦截器已弹出 msg，业务 catch 请使用 showRequestErrorIfNeeded */
  notified?: boolean
}
