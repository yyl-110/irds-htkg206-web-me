import defaultPlatformImage from '@/assets/images/hj.png';

export const PRODUCT_PLATFORM_DEFAULT_IMAGE = defaultPlatformImage;

export type ProductPlatformListItem = Record<string, unknown>;

function pickNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    if (value != null && String(value).trim() !== '')
      return String(value).trim();
  }
  return '';
}

/**
 * 从产品平台列表项解析示意图地址（兼容 fileUrl、fileInfo 等后端字段）。
 * 无有效图片时返回默认示意图。
 */
export function resolveProductPlatformImageUrl(
  item: ProductPlatformListItem | null | undefined,
): string {
  if (!item || typeof item !== 'object')
    return PRODUCT_PLATFORM_DEFAULT_IMAGE;

  const fileInfo = (item.fileInfo ?? item.fileinfo) as ProductPlatformListItem | undefined;

  const url = pickNonEmptyString(
    item.fileUrl,
    item.picUrl,
    fileInfo?.fileUrl,
    fileInfo?.filePath,
    fileInfo?.url,
    item.coverFileUrl,
  );

  return url || PRODUCT_PLATFORM_DEFAULT_IMAGE;
}
