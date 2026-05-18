import { h, type CSSProperties } from 'vue'
import { Empty } from 'ant-design-vue'
import emptyImage from '@/assets/images/empty.png'

/** 系统统一空状态插图 */
export const EMPTY_IMAGE = emptyImage

/** 初始化 Ant Design Vue 默认空状态插图（影响 a-empty、Table/Select/List 等） */
export function initGlobalEmptyImage(): void {
  Empty.PRESENTED_IMAGE_DEFAULT = emptyImage
  Empty.PRESENTED_IMAGE_SIMPLE = emptyImage
}

/** 表格 locale.emptyText 等场景：渲染带统一插图的空状态 */
export function renderTableEmptyText(
  description = '暂无数据',
  style: CSSProperties = { paddingBottom: '50px' },
) {
  return h(Empty, {
    image: emptyImage,
    description,
    style,
  })
}

/** ConfigProvider.renderEmpty */
export function renderGlobalEmpty(_componentName?: string) {
  return h(Empty, {
    image: emptyImage,
    description: '暂无数据',
    style: { padding: '16px 0' },
  })
}
