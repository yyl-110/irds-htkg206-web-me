<script setup lang="ts">
import { computed } from 'vue';
import { useActivityPageJsMethods } from '@/composables/useActivityPageJsMethods';

const props = withDefaults(
  defineProps<{
    record: Record<string, any>;
    modelValue?: string;
    placeholder?: string;
    allowClear?: boolean;
    disabled?: boolean;
  }>(),
  {
    record: () => ({}),
    modelValue: '',
    placeholder: '请选择JS方法',
    allowClear: true,
    disabled: false,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const recordRef = computed(() => props.record ?? {});
const { jsMethodOptions, jsMethodsLoading } = useActivityPageJsMethods(recordRef);

const innerValue = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v ?? ''),
});

const hasJsFile = computed(() => {
  const r = props.record || {};
  return Boolean(r.jsFileId || r.jsFilePath || r.jsFileInfo?.fileId);
});

const autoCompleteOptions = computed(() => jsMethodOptions.value);

const selectPlaceholder = computed(() => {
  if (jsMethodsLoading.value) return '正在加载JS方法...';
  if (autoCompleteOptions.value.length) return props.placeholder;
  return '未解析到方法，可直接输入方法名';
});
</script>

<template>
  <a-auto-complete
    v-if="hasJsFile"
    v-model:value="innerValue"
    :disabled="disabled"
    :options="autoCompleteOptions"
    :placeholder="selectPlaceholder"
    allow-clear
    style="width: 100%"
    :filter-option="(input: string, option: any) => String(option?.value ?? '').toLowerCase().includes(input.toLowerCase())" />
  <a-input
    v-else
    v-model:value="innerValue"
    :disabled="disabled"
    :placeholder="placeholder || '请先在创建活动时上传JS文件'"
    allow-clear />
</template>
