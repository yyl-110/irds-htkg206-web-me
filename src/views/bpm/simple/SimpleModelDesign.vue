<script setup lang="ts">
import { SimpleProcessDesigner } from '@/components/SimpleProcessDesignerV2/src/'

defineOptions({
  name: 'SimpleModelDesign',
})

defineProps<{
  modelId?: string
  modelKey?: string
  modelName?: string
  startUserIds?: number[]
  startDeptIds?: number[]
}>()

const emit = defineEmits(['success'])
const designerRef = ref()

// 修改成功回调
function handleSuccess(data?: any) {
  console.info('handleSuccess', data)
  if (data) {
    emit('success', data)
  }
}
</script>

<template>
  <ContentWrap :body-style="{ padding: '20px 16px' }">
    <SimpleProcessDesigner
      ref="designerRef"
      :model-id="modelId"
      :model-key="modelKey"
      :model-name="modelName"
      :start-user-ids="startUserIds"
      :start-dept-ids="startDeptIds"
      @success="handleSuccess"
    />
  </ContentWrap>
</template>
