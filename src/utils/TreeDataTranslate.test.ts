import { describe, expect, it } from 'vitest'
import type { DataItem } from './TreeDataTranslate'
import { treeDataTranslate } from './TreeDataTranslate' // 确保这里的路径正确

// 定义测试数据的类型，与 DataItem 接口一致
type TestDataItem = DataItem

describe('树形数据转换函数', () => {
  it<TestDataItem>('应将平面数据转换为树形结构，根节点 parentId 为 null', () => {
    const data: TestDataItem[] = [
      { id: 1, parentId: null },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 1 },
      { id: 4, parentId: 2 },
    ]

    const expectedResult: TestDataItem[] = [
      {
        id: 1,
        parentId: null,
        _level: 1,
        children: [
          {
            id: 2,
            parentId: 1,
            _level: 2,
            children: [
              {
                id: 4,
                parentId: 2,
                _level: 3,
              },
            ],
          },
          {
            id: 3,
            parentId: 1,
            _level: 2,
          },
        ],
      },
    ]

    expect(treeDataTranslate(data)).toEqual(expectedResult)
  })

  it<TestDataItem>('应处理所有项 parentId 都为 null 的情况', () => {
    const data: TestDataItem[] = [
      { id: 1, parentId: null },
      { id: 2, parentId: null },
    ]

    const expectedResult: TestDataItem[] = [
      { id: 1, parentId: null, _level: 1 },
      { id: 2, parentId: null, _level: 1 },
    ]

    expect(treeDataTranslate(data)).toEqual(expectedResult)
  })

  it<TestDataItem>('应忽略不存在的 parentId', () => {
    const data: TestDataItem[] = [
      { id: 1, parentId: null },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 'not-existing' },
    ]

    const expectedResult: TestDataItem[] = [
      {
        id: 1,
        parentId: null,
        _level: 1,
        children: [
          {
            id: 2,
            parentId: 1,
            _level: 2,
          },
        ],
      },
      {
        id: 3,
        parentId: 'not-existing',
        _level: 1,
      },
    ]

    expect(treeDataTranslate(data)).toEqual(expectedResult)
  })

  // 可以继续添加更多的测试用例来覆盖不同的场景
})
