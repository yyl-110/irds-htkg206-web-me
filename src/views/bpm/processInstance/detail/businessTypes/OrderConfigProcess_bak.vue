<template>
  <div class="order-config-process">
    <CommonApprovalContent
      v-if="titleList.length > 0"
      :title-list="titleList"
      :data-list="approvalData"
      :opinion="opinion"
      :clickable-fields="['name', 'orderNo', 'areaConfigName', 'designModel']"
      @search="handleSearch"
      @row-click="handleRowClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommonApprovalContent from './CommonApprovalContent.vue'
import { getSingleCarEbomListParamFromOrder } from '@/api/productConfig'

const props = defineProps<{
  processInstance: any
  titleList: any[]
  approvalData: any[]
  opinion: string
  todoTask: any
}>()

const emit = defineEmits<{
  (e: 'search', content: string): void
  (e: 'show-super-bom', row: any): void
  (e: 'show-ep-compare', row: any): void
}>()

const handleSearch = (content: string) => {
  emit('search', content)
}

const handleRowClick = async (row: any, field: string) => {
  if (!['name', 'orderNo', 'areaConfigName', 'designModel'].includes(field)) {
    return
  }

  // 根据任务名称进行判断
  if (props.todoTask?.name.includes('研发审核')) {
    // 显示单车BOM抽屉
    emit('show-super-bom', row)
  } else if (props.todoTask?.name.includes('工艺审核')) {
    // 显示EP对比抽屉
    emit('show-ep-compare', row)
  }
}
</script>

<style lang="scss" scoped>
.order-config-process {
  width: 100%;
}
</style>
