<template>
  <div class="regional-sales-config">
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
import { useRouter } from 'vue-router'
import CommonApprovalContent from './CommonApprovalContent.vue'

const props = defineProps<{
  processInstance: any
  titleList: any[]
  approvalData: any[]
  opinion: string
}>()

const emit = defineEmits<{
  (e: 'search', content: string): void
}>()

const router = useRouter()

const handleSearch = (content: string) => {
  emit('search', content)
}

const handleRowClick = (row: any, field: string) => {
  if (!['name', 'orderNo', 'areaConfigName', 'designModel'].includes(field)) {
    return
  }

  router.push({
    path: '/salesconfig/salestabledetail',
    query: {
      modalType: 'detail',
      areaConfigId: row?.areaConfigId
    }
  })
}
</script>

<style lang="scss" scoped>
.regional-sales-config {
  width: 100%;
}
</style>
