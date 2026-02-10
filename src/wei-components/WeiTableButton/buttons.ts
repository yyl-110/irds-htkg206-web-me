import { CloseOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { RouteMeta } from 'vue-router'

/**
 * 各种类型(label)的按钮对应的 icon
 * @description 在此处统一所有类型按钮的 icon
 */
export const ButtonIcons: { [label: string]: RouteMeta['icon'] } = {
  添加: PlusOutlined,
  删除: CloseOutlined,
  导入: ImportOutlined,
  导出: ExportOutlined,
}
