<template>
  <a-card v-if="visible" class="process-opinion-card" :bordered="false" :title="$t('处理意见')">
    <a-textarea
      class="process-opinion-textarea"
      :value="modelValue"
      :disabled="disabled"
      :rows="4"
      :placeholder="$t('请输入处理意见')"
      @update:value="handleUpdate" />
  </a-card>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string
  disabled?: boolean
  visible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleUpdate = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.process-opinion-card {
  margin: 10px 10px 10px 0;
  min-height: 100px;

  :deep(.ant-card-head) {
    min-height: 48px;
    padding: 0 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.ant-card-head-title) {
    padding: 12px 0;
    font-size: 15px;
    font-weight: 700;
    color: #313133;
  }

  :deep(.ant-card-body) {
    padding: 16px;
  }

  :deep(textarea.process-opinion-textarea) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: calc(1.5715 * 14px * 4 + 8px);
    resize: vertical;
    overflow: auto;
  }
}
</style>
