import type { InternalAxiosRequestConfig } from 'axios'

/** pending 状态需要的请求参数 config */
type RequestConfig = Pick<InternalAxiosRequestConfig, 'params' | 'data'>

/** 正在请求中的接口集合 */
export const pendingRequests = ref<Record<string, RequestConfig>>({})

/** pending 判断 options */
export interface PendingRequestOptions {
  /** 是否使用 `===` 判断, 默认使用 `includes` */
  equals?: boolean
  /** 请求参数 includes 匹配 */
  paramsIncludes?: string
}

/**
 * 获取 pending 状态需要的请求参数 config
 * @param axiosConfig axios config
 */
export function getConfigByAxiosConfig(axiosConfig: InternalAxiosRequestConfig): RequestConfig {
  return {
    params: axiosConfig.params,
    data: axiosConfig.data,
  }
}

/**
 * 判断请求参数中是否包含指定的 paramsIncludes
 * @param paramsIncludes 请求参数匹配字符串
 * @param config 接口请求参数
 */
function checkParams(paramsIncludes: string, config: RequestConfig) {
  if (config.params && JSON.stringify(config.params).includes(paramsIncludes))
    return true

  if (config.data && JSON.stringify(config.data).includes(paramsIncludes))
    return true

  return false
}

/**
 * 判断指定请求是否处于 pending 状态
 *
 * ## Example
 * - `$isPending()`: 当前是否有接口处于 `Pending` 状态
 * - `$isPending('/page')`: 当前是否有 `url` 中 **包含** `/page` 的接口处于 `Pending` 状态
 * - `$isPending('/page', '001')`: 当前是否有 `url` **包含** `/page`, 且请求参数中的 `params` / `data` 中包含 `001` 的接口处于 `Pending` 状态
 * - `$isPending('/page', true)`: 当前是否有 `url` **等于** `/page` 的接口处于 `Pending` 状态
 *
 * ## 关于 url
 * 对于 `GET` 请求, `params` 请求参数已经包含在 `url` 中了, 可以直接通过第一个参数判断
 *
 * @param urlIncludes url - 遍历所有接口的 url, 通过 includes 匹配; 若为空, 则判断当前是否有任意接口正在 pending
 * @param equalsOrParamsIncludesOrOptions 是否使用全等判断 | 请求参数 includes 匹配 | 或传入配置参数
 */
export function isPending(urlIncludes?: string, equalsOrParamsIncludesOrOptions?: boolean | string | number | PendingRequestOptions) {
  if (!urlIncludes)
    return Object.keys(pendingRequests.value).length > 0
  let equals = false
  let paramsIncludes = ''
  if (typeof equalsOrParamsIncludesOrOptions === 'boolean') {
    equals = true
  }
  else if (typeof equalsOrParamsIncludesOrOptions === 'string' || typeof equalsOrParamsIncludesOrOptions === 'number') {
    paramsIncludes = equalsOrParamsIncludesOrOptions.toString()
  }
  else {
    equals = !!equalsOrParamsIncludesOrOptions?.equals
    paramsIncludes = equalsOrParamsIncludesOrOptions?.paramsIncludes || ''
  }
  for (const url in pendingRequests.value) {
    const config = pendingRequests.value[url]
    if (equals ? url === urlIncludes : url.includes(urlIncludes)) { // 匹配 url
      if (paramsIncludes) { // 匹配请求参数
        if (checkParams(paramsIncludes, config))
          return true
      }
      else {
        return true
      }
    }
  }

  return false
}
