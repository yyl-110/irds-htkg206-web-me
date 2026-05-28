<template>
  <div class="module-library-approval">
    <CommonApprovalContent
      v-if="displayTitleList.length > 0"
      :title-list="displayTitleList"
      :data-list="displayDataList"
      :opinion="opinion"
      :link-fields="['para2']"
      @row-click="handleRowClick" />

    <el-card v-else style="margin: 10px; min-height: 100px; margin-right: 30px">
      <el-empty description="暂无模块库审批数据" />
    </el-card>

    <ModuleLibraryDetailDrawer ref="moduleDetailDrawerRef" :module-property-info="modulePropertyInfo" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CommonApprovalContent from './CommonApprovalContent.vue'
import ModuleLibraryDetailDrawer from './ModuleLibraryDetailDrawer.vue'
const props = defineProps<{
  processInstance: any
  titleList: any[]
  opinion: string
}>()

const moduleDetailDrawerRef = ref<InstanceType<typeof ModuleLibraryDetailDrawer> | null>(null)

function getFormVariables() {
  return props.processInstance?.formVariables ?? props.processInstance?.processVariables ?? {}
}

function getColumnKey(item: any) {
  return item.propertyName === '贡献者' ? 'para7Name' : item.dataProp
}

const modulePropertyInfo = computed<any[]>(() => {
  const list = getFormVariables().modulePropertyInfo

  return Array.isArray(list) ? list : []
})

/** 由 modulePropertyInfo 生成表格列（保持接口返回顺序，showFlag == 0 才展示） */

function buildColumnsFromPropertyInfo() {
  if (!modulePropertyInfo.value.length) {
    return []
  }
  return modulePropertyInfo.value
    .filter((item: any) => item.showFlag == 0 && getColumnKey(item))
    .map((item: any) => {
      const key = getColumnKey(item)
      return {
        key,
        value: item.propertyName,
        colWidth: item.colWidth == undefined ? 150 : item.colWidth,
      }
    })
}

const modelList = computed<any[]>(() => {
  const list = getFormVariables().ModelList
  return Array.isArray(list) ? list : []
})

const displayTitleList = computed(() => {
  if (props.titleList?.length) return props.titleList
  return buildColumnsFromPropertyInfo()
})

const displayDataList = computed(() => {
  return modelList.value
})

function handleRowClick(row: any, field: string) {
  if (field === 'para2') {
    moduleDetailDrawerRef.value?.openModuleDetail(row, field)
  }
}
</script>

<style lang="scss" scoped>
.module-library-approval {
  width: 100%;
}
</style>
