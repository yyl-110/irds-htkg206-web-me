import { set } from 'lodash-es'

/**
 * 数据项类型
 */
export interface DataItem {
  id: string | number
  parentId: string | number | null | undefined
  children?: DataItem[]
  _level?: number
}

/**
 * 树形数据转换
 * @template T 数据项类型
 * @param data 列表数据
 * @param idKey 主键ID的键，默认为 'id'
 * @param parentIdKey 上级ID的键，默认为 'parentId'
 * @param childrenKey 子列表数据的键，默认为 'children'
 * @returns 转换后的树形数据
 */
export function treeDataTranslate<T extends DataItem>(
  data: T[],
  idKey: keyof T = 'id',
  parentIdKey: keyof T = 'parentId',
  childrenKey: keyof T = 'children',
): T[] {
  /**
   * 结果数组，用于存储树形结构数据
   */
  const result: T[] = []

  /**
   * 临时对象，用于存储数据项的映射
   */
  const itemMap: Record<string | number, T> = {}

  /**
   * 构建以主键ID为键的数据项映射
   */
  for (const item of data) {
    const id = item[idKey] as DataItem['id']
    if (typeof id === 'string' || typeof id === 'number')
      itemMap[id] = item
  }

  /**
   * 构建树形结构
   */
  for (const item of data) {
    const parentId = item[parentIdKey]
    if (
      typeof parentId === 'string'
      || typeof parentId === 'number'
      || parentId === null
      || parentId === undefined
    ) {
      const parentItem = parentId === undefined || parentId === null ? undefined : itemMap[parentId as number]
      if (parentItem && item[idKey] !== item[parentIdKey]) {
        if (!parentItem[childrenKey])
          set(parentItem, childrenKey, [])

        if (!parentItem._level)
          parentItem._level = 1

        item._level = parentItem._level + 1

        if (Array.isArray(parentItem[childrenKey]))
          parentItem[childrenKey].push(item)
      }
      else {
        item._level = 1
        result.push(item)
      }
    }
  }

  /**
   * 返回转换后的树形数据
   */
  return result
}
