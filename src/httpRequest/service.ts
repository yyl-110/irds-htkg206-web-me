import type { AxiosInstance } from 'axios'
import axios from 'axios'
import HttpRequestConfig from './config'

export const service: AxiosInstance = axios.create({
  baseURL: HttpRequestConfig.baseUrl,
  withCredentials: true,
  timeout: HttpRequestConfig.requestTimeout, // 请求超时时间
})
