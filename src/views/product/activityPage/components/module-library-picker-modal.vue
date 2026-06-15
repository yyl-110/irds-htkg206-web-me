<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import ModuleInfoList from '@/views/product/module/application/components/ModuleInfoList.vue';
import { resolveLibraryDataQueryType } from './config/module-data-select.utils';

const props = defineProps({
  visible: { type: Boolean, default: false },
  categoryId: { type: [String, Number], default: '' },
  menuId: { type: [String, Number], default: '' },
  userId: { type: [String, Number], default: '' },
  /** 参数代号 -> 参数值，用于打开时预填默认查询条件并自动过滤 */
  queryPrefill: { type: Object as () => Record<string, string>, default: () => ({}) },
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [payload: { row: any; columns: any[] }];
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
});

const listRef = ref<InstanceType<typeof ModuleInfoList> | null>(null);
const initializing = ref(false);
const pickerModalTitle = computed(() => {
  const menuId = String(props.menuId ?? '').trim();
  return menuId === '9' ? '选择模型库数据' : '选择资源库数据';
});

function closeModal() {
  innerVisible.value = false;
}

async function initPickerList() {
  const categoryId = String(props.categoryId ?? '').trim();
  const menuId = String(props.menuId ?? '').trim();
  if (!categoryId || !menuId) {
    message.warning('请先选择基础资源库类型和分类');
    return;
  }
  initializing.value = true;
  try {
    await nextTick();
    const libraryQueryType = resolveLibraryDataQueryType(menuId);
    await listRef.value?.initData(categoryId, menuId, 1, props.queryPrefill, libraryQueryType);
  } finally {
    initializing.value = false;
  }
}

function emitPickerConfirm(payload: { row: any; columns: any[] }) {
  if (!payload?.row) {
    message.warning('请选择一条模型库数据');
    return;
  }
  emit('confirm', { row: payload.row, columns: payload.columns ?? [] });
  closeModal();
}

function onConfirm() {
  const payload = listRef.value?.getPickerConfirmPayload?.();
  emitPickerConfirm(payload ?? { row: null, columns: [] });
}

function onPickerGlobalConfirm(payload: { row: any; columns: any[] }) {
  emitPickerConfirm(payload);
}

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    void initPickerList();
  },
);
</script>

<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="pickerModalTitle"
    :width="1400"
    :mask-closable="false"
    class="module-library-picker-modal"
    @cancel="closeModal">
    <div class="module-library-picker-body">
      <ModuleInfoList ref="listRef" picker-mode @picker-confirm="onPickerGlobalConfirm" />
    </div>
    <template #footer>
      <a-button type="primary" :loading="initializing" @click="onConfirm">确定</a-button>
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>
</template>

<style scoped>
.module-library-picker-body {
  min-height: 520px;
}

.module-library-picker-body :deep(.module-body--picker) {
  padding: 0;
}

.module-library-picker-body :deep(.btn-box) {
  margin-bottom: 8px;
}

.module-library-picker-body :deep(.calc-table-card) {
  border: none;
  box-shadow: none;
}

.module-library-picker-body :deep(.calc-table-card .ant-card-body) {
  padding: 0;
}

.module-library-picker-modal :deep(.ant-modal-body) {
  padding-top: 12px;
  padding-bottom: 8px;
}
</style>
