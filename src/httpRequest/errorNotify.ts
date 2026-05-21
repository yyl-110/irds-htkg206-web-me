import axios, { type AxiosError } from 'axios';
import { WeiMessage } from '@/utils/WeiMessage';
import { WeiI18n } from '@/utils/WeiI18n';
import type { HttpRequestResponse } from './typings';
import { ResponseError } from './typings';

/** 响应拦截器已对业务错误码弹过 toast */
export function isRequestErrorNotified(error: unknown): boolean {
  return error instanceof ResponseError && error.notified === true;
}

/** 从 ResponseError / AxiosError / Error 中提取可展示文案 */
export function getRequestErrorMessage(error: unknown, fallback = '操作失败'): string {
  if (error instanceof ResponseError) {
    return error.message || error.data?.msg || fallback;
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as HttpRequestResponse | undefined;
    return data?.msg || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

/**
 * 在业务 catch 中兜底提示：若响应拦截器已提示过则不再重复弹出。
 * 网络异常等未走业务码分支时仍会提示 fallback。
 */
export function showRequestErrorIfNeeded(error: unknown, fallback?: string): void {
  if (isRequestErrorNotified(error)) {
    return;
  }
  const msg = getRequestErrorMessage(error, fallback);
  WeiMessage.error(WeiI18n.t(msg).value);
}
