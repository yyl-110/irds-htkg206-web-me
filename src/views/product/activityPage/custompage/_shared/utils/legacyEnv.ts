import HttpRequestConfig from '@/httpRequest/config';

/** 兼容旧定制页 @/config/env 引用 */
export const baseUrl = HttpRequestConfig.baseUrl;
export const accessUrl = String(import.meta.env.VITE_MINIO_PREVIEW_URL ?? import.meta.env.VITE_BASE_URL ?? '');
export const ifGateway = String(import.meta.env.VITE_IF_GATEWAY ?? 'false') === 'true';

export default { baseUrl, accessUrl, ifGateway };
