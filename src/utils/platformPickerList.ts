import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台'
import { normalizePlatformPickerList } from '@/utils/platformPickerDrawerNav'
import type { ProductPlatformListItem } from '@/utils/productPlatformImage'

let inflight: Promise<ProductPlatformListItem[]> | null = null

/**
 * 获取产品平台列表（仅合并并发请求，不做 TTL 缓存，保证新增/授权后立即可见）
 */
export async function fetchPlatformPickerList(options?: { force?: boolean }): Promise<ProductPlatformListItem[]> {
  if (options?.force) {
    inflight = null
  }
  if (inflight) {
    return inflight
  }
  inflight = AdminApiSystemProduct.getProjectTreeList({ forPicker: true })
    .then(res => normalizePlatformPickerList(res?.data?.data))
    .finally(() => {
      inflight = null
    })
  return inflight
}

/** 平台 CRUD/授权成功后调用，避免进行中的请求结果被其它页面复用 */
export function invalidatePlatformPickerListCache(): void {
  inflight = null
}
