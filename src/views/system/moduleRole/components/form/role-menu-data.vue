<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import { defineComponent, inject, reactive, ref, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { getRoleMenuData, getRoleMenuListData, getRoleUpdateMenuData } from '@/api/system/role/index'
import type { MenuSimpleResponseDTO } from '@/api/tags/data-contracts'
const visible = ref(false)
const halfCheckedKeys = ref<Array<number>>()
/** 菜单树数据结构 */
type MenuSimpleResponseTree = MenuSimpleResponseDTO & { children?: Array<MenuSimpleResponseDTO> }
interface MenuSimpleResponseTreeMap { [id: number]: MenuSimpleResponseTree }
const menuCheckDataMap = ref<MenuSimpleResponseTreeMap>({})
const expandedKeys = ref<Array<number>>([])
const menuTreeData = ref<any>([])
const menuCheckData = ref<any>([])
const checkedAll = ref<any>(false)
const checkedOpen = ref<any>(true)
const expandAll = ref<any>(true)
const checkedResult = ref<any>([])

const treeDataTranslate: any = inject('treeDataTranslate')
// /** 包含全选和半选状态的已选项 id */
interface AllCheckedKeys{
  checkedKeys: Array<number>
  halfCheckedKeys: Array<number>
}

/** 数据 定义 */
const formData = ref<any>(
  {
    id: 0,
    name: '',
    code: '',
    checkedKeys: [],
  },
)

 /**
 * handleMenuListData
 * @param val record
 */
 async function handleMenuListData(val: any){
  visible.value = true
  formData.value.name = val.name
  formData.value.code = val.code
  formData.value.id = val.id
  halfCheckedKeys.value = []
  await getMenuData()
  getRoleMenuData({ roleId: formData.value.id }).then((res: any) => {
    const data = res.data
    checkedResult.value = getCheckedKeys(data.data)
    formData.value.checkedKeys = checkedResult.value.checkedKeys
    halfCheckedKeys.value = checkedResult.value.halfCheckedKeys
  })
} 

function getMenuData (){
  return getRoleMenuListData({}).then((res: any) => {
    const data = res.data
    menuTreeData.value = treeDataTranslate(data.data, 'id')
    menuCheckData.value = data.data
    for (const item of data.data)
      menuCheckDataMap.value[item.id] = item
  }).finally(() => expandAllItem(true))
}

function expandAllItem (expand: boolean){
  const ids: Array<number> = []
  if (expand) {
    for (const menu of menuCheckData.value as Array<any>) {
      if (menu.children)
        ids.push(menu.id)
    }
  }
  return expandedKeys.value = ids
}

    /**
     * 根据给定的全选和半选节点ID，确定部门树中所有节点的选中状态。
     * @param selection - 包含全选和半选节点ID的数组。
     * @param departmentsMap - 以部门ID为键的部门数据映射。
     * @returns 包含全选节点和半选节点ID的对象。
     */
    function getCheckedKeys(selection: number[], departmentsMap: MenuSimpleResponseTreeMap = menuCheckDataMap.value): AllCheckedKeys {
      // 初始化存储每个节点选中状态的映射
      const checkedStatus: { [id: number]: boolean } = {}
      // 根据selection初始化选中状态
      selection.forEach((id) => {
        if (departmentsMap[id])
          checkedStatus[id] = true
        else
          return console.error('Menu not found, ID: ', id)
      })

      /**
       * 辅助函数，用于递归确定节点的选中状态
       * @param node menu node
       */
      function determineCheckedStatus(node: MenuSimpleResponseTree) {
        // 如果当前节点被选中，则检查其子节点
        if (checkedStatus[node.id]) {
          // 假设当前节点所有子孙都选中
          let allDescendantsChecked = true

          // 遍历子节点
          for (const child of node.children || []) {
            if (!determineCheckedStatus(child))
              allDescendantsChecked = false
          }

          // 如果所有子孙都被选中，则当前节点为全选
          if (allDescendantsChecked)
            return true
        }
        // 如果当前节点未被选中，则返回false
        return false
      }

      // 遍历departmentsMap中的所有节点，确定选中状态
      const allMenus: Array<MenuSimpleResponseTree> = Object.values(departmentsMap)
      const checkedKeys: number[] = []
      const halfCheckedKeys: number[] = []

      for (const menu of allMenus) {
        if (determineCheckedStatus(menu))
          checkedKeys.push(menu.id)
      }

      // 确定半选节点，即选中状态为真但不是全选的节点
      for (const id in checkedStatus) {
        if (checkedStatus[id] && !checkedKeys.includes(+id))
          halfCheckedKeys.push(+id)
      }
      return {
        checkedKeys,
        halfCheckedKeys,
      }
    }

/**
//      * 菜单权限 check
//      * @param checkedKeys checkedKeys
//      * @param event event
//      */
function onCheck(checkedKeys: Array<number>, event: any){
  formData.value.checkedKeys = checkedKeys || []
  halfCheckedKeys.value = event.halfCheckedKeys || []
}

//     /** 全选/全不选 */
function handleSwitchCheckAll(){
    if (checkedAll.value === true) {
      menuCheckData.value.forEach((item: any) => {
        formData.value.checkedKeys.push(item.id)
      })
    }
    else {
      formData.value.checkedKeys = []
    }
  }
//     /** 展开/折叠 */
function handleSwitchCheckOpen(){
  expandAll.value = !expandAll.value
  expandedKeys.value = expandAllItem(expandAll.value)
}

function findTreeNodeAuth() {
  if (halfCheckedKeys.value?.length > 0) {
    return formData.value.checkedKeys.concat(halfCheckedKeys.value)
  } else {
    return formData.value.checkedKeys
  }
 
}


defineExpose({ handleMenuListData,findTreeNodeAuth})

    
</script>

<template>
    <div>
      <a-form model="formData" style="margin-top: 20px;">
      <a-form-item>
        <a-card>
          <template #title>
            <span style="font-size: 14px">
              <a-switch
                v-model:checked="checkedAll" :checked-children="$t('全不选')"
                :un-checked-children="$t('全选')" @change="handleSwitchCheckAll"
              />
            </span>
            <span style="font-size: 14px;margin-left: 30px;">
              <a-switch
                v-model:checked="checkedOpen" :checked-children="$t('折叠')"
                :un-checked-children="$t('展开')" @change="handleSwitchCheckOpen"
              />
            </span>
          </template>
          <a-directory-tree
            v-if="menuTreeData.length"
            v-model:expanded-keys="expandedKeys"
            v-model:checked-keys="formData.checkedKeys"
            :default-expand-all="expandAll"
            checkable :show-icon="false"
            :field-names="{ key: 'id', title: 'name' }"
            style="width: 100%"
            :tree-data="menuTreeData"
            :height="300"
            @check="onCheck"
          >
            <template #title="{ name }">
              {{ name }}
            </template>
          </a-directory-tree>
        </a-card>
      </a-form-item>

    </a-form>

    </div>
    
</template>

<style scoped>
  :deep(.ant-modal-body){
    height:300px;
    padding: 0px;
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 0px;
  }

  :deep(.ant-modal-footer){
    background: #fff;
  }
  :deep(.ant-form-item){
    margin : 0;
  }
  
  
</style>