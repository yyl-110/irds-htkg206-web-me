export {}
declare global {
  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  /** Exclude undefined */
  type NonUndefined<T> = T extends undefined ? never : T

  /**
   * 分页参数字段
   * ```typescript
   * import type { BasePaginationParamsType } from '@wei/openapi-codegen/es/src/BaseUISchemaPagination'
   * ```
   * @deprecated 应使用 {@link BasePaginationParamsType}
   */
  interface PageParam {
    pageSize?: number
    pageNo?: number
  }
}
