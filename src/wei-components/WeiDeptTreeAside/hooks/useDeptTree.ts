import type { DataNode } from 'ant-design-vue/es/tree'
import { type Ref, computed, ref } from 'vue'
import type { DeptSimpleResponseDTOModel } from '@/api/models/DeptSimpleResponseDTOModel'
import { AdminApiSystemDept } from '@/api/tags/管理后台部门'

/** `a-tree` 组件使用的 部门 treeNode 数据类型 */
export type DeptTreeNode = DeptSimpleResponseDTOModel &
  Omit<DataNode, 'children'> &
  {
    children?: Array<DeptTreeNode> // 重写 children 类型
    /** 所有上级部门的 name list */
    $superiorDepartmentNames: Array<string>
    /** 是否是顶级的部门 */
    $isTopLevelNode: boolean
  }

/**
 * 初始化部门数据, 将接口返回的部门数据转换为 DeptTreeNode 类型数据
 * @param depts 原始的部门数据
 * @param deptList deptList 变量
 * @param deptMap deptMap 变量
 */
function initDeptTree(depts: Array<DeptSimpleResponseDTOModel>, deptList: Ref<Array<DeptTreeNode>>, deptMap: Ref<Record<DeptTreeNode['id'], DeptTreeNode>>) {
  const _deptList: Array<DeptTreeNode> = []
  for (const dept of depts) {
    const existsDept = deptMap.value[dept.id]
    if (existsDept)
      Object.assign(deptMap.value[dept.id], dept)
    else
      deptMap.value[dept.id] = deptResponseToDeptTreeNode(dept)
  }
  for (const dept of depts) {
    const deptNode = deptMap.value[dept.id]
    initDeptTreeNode(deptNode, deptMap.value)
    const parentNode = deptMap.value[dept.parentId]
    if (parentNode)
      parentNode.children?.push(deptNode)
    else
      deptNode.$isTopLevelNode = true

    _deptList.push(deptNode)
  }
  for (const dept of _deptList) {
    if (!dept.children || dept.children?.length === 0)
      dept.isLeaf = true
  }
  deptList.value = _deptList
}

/**
 * 将接口返回的部门数据转换为 `a-tree` 使用的 `treeData` 数据
 * @param dept 接口返回的部门数据
 */
function deptResponseToDeptTreeNode(dept: DeptSimpleResponseDTOModel): DeptTreeNode {
  return {
    ...dept,
    title: dept.name,
    key: dept.id,
    $superiorDepartmentNames: [],
    $isTopLevelNode: false,
    children: [],
  }
}

/**
 * 初始化部门树节点数据
 * @param dept 部门
 * @param deptMap 部门数据 Map
 */
function initDeptTreeNode(dept: DeptTreeNode, deptMap: Record<DeptTreeNode['id'], DeptTreeNode>) {
  const superiorDepts = getDeptTreeNodeSuperiorDepts(dept, deptMap)
  dept.$superiorDepartmentNames = superiorDepts.map(d => d.name)
}
/**
 * 初始化上级部门信息
 * @param dept 部门节点
 * @param deptMap 部门 map
 */
function getDeptTreeNodeSuperiorDepts(dept: DeptTreeNode, deptMap: Record<DeptTreeNode['id'], DeptTreeNode>) {
  const superiorDepts: Array<DeptTreeNode> = []
  let parent: DeptTreeNode | undefined = dept
  while (parent) {
    if (parent.parentId === parent.id) {
      console.error('Invalid dept data', parent)
      continue
    }
    parent = typeof parent.parentId === 'number' ? deptMap[parent.parentId] : undefined
    if (parent)
      superiorDepts.unshift(parent)
    else
      break
  }
  return superiorDepts
}

/**
 * 初始化部门树数据
 * @param loading loading ref
 * @param loaded loaded
 * @param deptList dept list dat
 * @param deptMap dept map data
 * @param getSimpleDepts 获取部门信息的接口
 */
async function fetchDepts(loading: Ref<boolean>, loaded: Ref<boolean>, deptList: Ref<Array<DeptTreeNode>>, deptMap: Ref<Record<DeptTreeNode['id'], DeptTreeNode>>, getSimpleDepts: typeof AdminApiSystemDept.getSimpleDepts = AdminApiSystemDept.getSimpleDepts) {
  try {
    loading.value = true
    loaded.value = false
    try {
      const res = await getSimpleDepts()
      if (!res.data.data)
        throw new Error('The obtained department data is empty')
      await initDeptTree(res.data.data, deptList, deptMap)
    }
    catch (error) {
      console.log(error)
      throw new Error('initDeptTree failed')
    }
    loaded.value = true
  }
  finally {
    loading.value = false
  }
}

/**
 * 根据搜索内容筛选搜索结果
 * @param query 搜索内容
 * @param treeData treeData 数据
 */
function filterDeptTree(query: string, treeData: Array<DeptTreeNode>) {
  const result: Array<DeptTreeNode> = []
  const queue: Array<DeptTreeNode> = [...treeData]
  while (queue.length > 0) {
    const node = queue.shift()
    if (!node)
      break
    if (node?.name.indexOf(query) !== -1) {
      result.push(node)
      continue
    }
    if (node.children && node.children.length)
      node.children.forEach(child => queue.push(child))
  }
  return result
}

/**
 * 处理部门树数据, 可用于 `a-tree`
 * @param getSimpleDepts 获取部门信息的接口
 */
export function useDeptTree(getSimpleDepts?: typeof AdminApiSystemDept.getSimpleDepts) {
  /** 部门树是否处于加载中状态 */
  const deptTreeLoading = ref(false)
  /** 部门树是否加载完毕 */
  const deptTreeLoaded = ref(false)
  /** 原始部门 list */
  const deptList = ref<Array<DeptTreeNode>>([])
  /** 搜索内容 */
  const query = ref('')

  /** `a-tree` 使用的部门 tree list 数据 */
  const deptTreeData = computed(() => {
    let treeData: Array<DeptTreeNode> = []
    for (const dept of deptList.value) {
      if (dept.$isTopLevelNode)
        treeData.push(dept)
    }

    if (query.value)
      treeData = filterDeptTree(query.value, treeData)
    return treeData
  })

  /** 部门 map */
  const deptMap = ref<Record<DeptTreeNode['id'], DeptTreeNode>>({})

  fetchDepts(deptTreeLoading, deptTreeLoaded, deptList, deptMap, getSimpleDepts)

  return {
    /** 搜索内容 */
    query,
    /** 部门树是否处于加载中状态 */
    deptTreeLoading,
    /** 部门树是否加载完毕 */
    deptTreeLoaded,
    /** 原始部门 list */
    deptList,
    /** `a-tree` 使用的部门 tree list 数据 */
    deptTreeData,
  }
}
