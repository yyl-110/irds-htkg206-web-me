import { h, type CSSProperties } from 'vue'
import { Empty } from 'ant-design-vue'
import emptyImage from '@/assets/images/empty.png'

/** 系统统一空状态插图 */
export const EMPTY_IMAGE = emptyImage

/** 系统统一空状态插图宽度 */
export const EMPTY_IMAGE_WIDTH = '120px'

/** 空状态插图容器样式（宽度需配合 createEmptyImageNode 或全局 empty.less） */
export const EMPTY_IMAGE_STYLE: CSSProperties = {
  width: EMPTY_IMAGE_WIDTH,
  height: 'auto',
  margin: '0 auto',
}

/** 渲染带尺寸约束的空状态插图（imageStyle 只作用于容器，需直接约束 img） */
export function createEmptyImageNode(alt = '暂无数据') {
  return h('img', {
    src: emptyImage,
    alt,
    style: {
      width: EMPTY_IMAGE_WIDTH,
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
    },
  })
}

/**
 * 初始化 Ant Design Vue 空状态插图（供显式传入 :image 或 PRESENTED_IMAGE_* 的场景）。
 * 注意：<a-empty> 未传 image 时不会读取该值，需配合 main.ts 中 AEmpty 全局组件覆盖。
 */
export function initGlobalEmptyImage(): void {
  const imageNode = createEmptyImageNode()
  Empty.PRESENTED_IMAGE_DEFAULT = imageNode
  Empty.PRESENTED_IMAGE_SIMPLE = imageNode
}

/** 表格 locale.emptyText 等场景：渲染带统一插图的空状态 */
export function renderTableEmptyText(
  description = '暂无数据',
  style: CSSProperties = { paddingBottom: '50px' },
) {
  return h(Empty, {
    image: createEmptyImageNode(description),
    imageStyle: EMPTY_IMAGE_STYLE,
    description,
    style,
  })
}

/** ConfigProvider.renderEmpty */
export function renderGlobalEmpty(_componentName?: string) {
  return h(Empty, {
    image: createEmptyImageNode(),
    imageStyle: EMPTY_IMAGE_STYLE,
    description: '暂无数据',
    style: { padding: '16px 0' },
  })
}
