import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'
import HttpRequestConfig from './config'
import { quoteLongIntegerFieldsInJsonText } from './jsonLongInt'

/**
 * 在默认 JSON.parse 之前改写超长整数字段，避免雪花 ID 等在进入 JS 前被舍入。
 * 单独挂在实例上会覆盖 axios 默认的 transformResponse，因此保留与原默认一致的解析分支。
 * @param data
 */
function transformResponsePreserveLongInt(
  this: InternalAxiosRequestConfig,
  data: unknown,
): unknown {
  const transitional = this.transitional ?? { silentJSONParsing: true, forcedJSONParsing: true }
  const forcedJSONParsing = transitional.forcedJSONParsing
  const JSONRequested = this.responseType === 'json'

  if (
    typeof data === 'string'
    && data
    && ((forcedJSONParsing && !this.responseType) || JSONRequested)
  ) {
    const strictJSONParsing = !transitional.silentJSONParsing && JSONRequested
    try {
      return JSON.parse(quoteLongIntegerFieldsInJsonText(data), this.parseReviver)
    }
    catch (e: any) {
      if (strictJSONParsing) {
        if (e?.name === 'SyntaxError') {
          throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response)
        }
        throw e
      }
    }
  }
  return data
}

export const service: AxiosInstance = axios.create({
  baseURL: HttpRequestConfig.baseUrl,
  withCredentials: true,
  timeout: HttpRequestConfig.requestTimeout, // 请求超时时间
  transformResponse: [transformResponsePreserveLongInt],
})
