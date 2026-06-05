<template>
  <div class="pic-field">
    <div v-if="isEmptyPicField(modelValue)" class="pic-field__placeholder">待指定</div>
    <div v-else class="pic-field__value">
      <a class="pic-field__link" :title="displayName" @click="emit('preview', modelValue)">
        <u>{{ displayName }}</u>
      </a>
      <CloseOutlined class="pic-field__remove" title="移除" @click="emit('update:modelValue', '')" />
    </div>
    <a-button type="primary" size="small" @click="emit('browse')">
      <template #icon><FolderOpenOutlined /></template>
      浏览
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CloseOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';
import { isEmptyPicField, parsePicField } from './picFieldUtils';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  browse: [];
  preview: [value: string];
}>();

const displayName = computed(() => parsePicField(props.modelValue).fileName);
</script>

<style scoped>
.pic-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
}

.pic-field__placeholder {
  flex: 1;
  min-width: 120px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #f5f5f5;
  color: rgba(0, 0, 0, 0.45);
  line-height: 30px;
}

.pic-field__value {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #f5f5f5;
}

.pic-field__link {
  flex: 1;
  min-width: 0;
  color: #1677ff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pic-field__remove {
  color: #ff4d4f;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
