/**
 * 业务组件基础混入
 * 提供通用的属性和方法
 */

// 通用 Props 定义
export interface BaseBusinessProps {
  processInstance: any
  titleList: any[]
  approvalData: any[]
  errorTitleList?: any[]
  errorInsatnceList?: any[]
  opinion?: string
  todoTask?: any
}

// 通用 Emits 定义
export interface BaseBusinessEmits {
  (e: 'search', content: string): void
  (e: 'detail-click', row: any, field: string): void
}

// 工具函数：判断字段是否可点击
export const isClickableField = (field: string, clickableFields: string[] = ['name', 'orderNo', 'areaConfigName', 'designModel']) => {
  return clickableFields.includes(field)
}

// 工具函数：获取字段样式
export const getFieldStyle = (field: string, clickableFields?: string[]) => {
  const clickable = isClickableField(field, clickableFields)
  return {
    color: clickable ? '#409EFF' : '#222222',
    cursor: 'pointer',
    marginLeft: '10px',
    'text-decoration': clickable ? 'underline' : 'none'
  }
}

// 工具函数：渲染表格标签
export const renderTableTag = (status: any) => {
  if (!status) return null

  const iconList = {
    '审阅中': { icon: 'icon_examine', type: 'info' },
    '设计中': { icon: 'nav_cppz', type: 'info', color: { textColor: '#834BF4' } },
    '重新工作': { icon: 'icon_examine', type: 'info' },
    '已发布': { icon: 'yfb', type: 'success' },
    '已关闭': { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    '已停售': { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    '废弃': { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    '发布异常': { icon: 'ygb', type: '', color: { textColor: '#555D6D' } }
  }

  return {
    bordered: false,
    type: iconList[status]?.type,
    size: 'small',
    color: iconList[status]?.color || undefined,
    icon: iconList[status]?.icon
  }
}
