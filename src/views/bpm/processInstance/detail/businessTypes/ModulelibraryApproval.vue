<template>
  <div class="technical-feature">
    <CommonApprovalContent
      v-if="titleList.length > 0"
      :title-list="titleList"
      :data-list="approvalData"
      :opinion="opinion"
      :clickable-fields="['name', 'orderNo', 'areaConfigName', 'designModel']"
      @search="handleSearch"
      @row-click="handleRowClick" />
  </div>
</template>

<script lang="ts" setup>
import CommonApprovalContent from './CommonApprovalContent.vue'

const props = defineProps<{
  processInstance: any
  titleList: any[]
  approvalData: any[]
  opinion: string
}>()

const emit = defineEmits<{
  (e: 'search', content: string): void
  (e: 'show-customize-feature', row: any): void
}>()

const handleSearch = (content: string) => {
  emit('search', content)
}

const handleRowClick = (row: any, field: string) => {
  if (!['name', 'orderNo', 'areaConfigName', 'designModel'].includes(field)) {
    return
  }

  emit('show-customize-feature', row)
}
</script>

<style lang="scss" scoped>
.technical-feature {
  width: 100%;
}
</style>
