<template>
  <a-modal
    v-model:open="visible"
    title="材料选取"
    width="1200px"
    :mask-closable="false"
    class="module-data-cl-select"
    @cancel="handleCancel">
    <MaterialInfoList ref="materialListRef" picker-mode />

    <template #footer>
      <a-space>
        <a-button type="primary" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import MaterialInfoList from './MaterialInfoList.vue';

defineOptions({ name: 'ModuleDataClSelect' });

export interface ModuleOkItem {
  id?: string;
  val?: string;
  name?: string;
}

export interface ModuleOkPayload {
  arr: ModuleOkItem[];
}

interface MaterialListExpose {
  initData: (categoryId: string, menuId?: string | null) => Promise<void>;
  getPickerConfirmPayload: () => {
    row: Record<string, unknown> | null;
    columns: Array<{ title?: string; dataIndex?: string; key?: string }>;
  };
}

const props = withDefaults(
  defineProps<{
    mcategoryid?: string;
    moduleDataSelect?: boolean;
  }>(),
  {
    mcategoryid: '',
    moduleDataSelect: false,
  },
);

const emit = defineEmits<{
  moduleOk: [payload: ModuleOkPayload];
  moduleCancel: [];
}>();

const visible = ref(false);
const materialListRef = ref<MaterialListExpose | null>(null);
const initParams = ref<{ categoryId: string; menuId: string } | null>(null);

watch(
  () => props.moduleDataSelect,
  async val => {
    visible.value = val;
    if (!val) return;

    const categoryId = initParams.value?.categoryId || props.mcategoryid;
    if (!categoryId) return;

    await nextTick();
    await materialListRef.value?.initData(categoryId, initParams.value?.menuId ?? '');
  },
);

function initData(
  categoryId: string,
  selectPageStr = '',
  _matchingModuelPara?: string,
  _matchingRelation?: string,
  _matchingPara?: string,
) {
  initParams.value = {
    categoryId,
    menuId: selectPageStr ?? '',
  };
}

function buildModuleOkPayload(): ModuleOkPayload {
  const payload = materialListRef.value?.getPickerConfirmPayload();
  const row = payload?.row;

  if (!row) {
    return { arr: [{ id: '', val: '', name: '' }] };
  }

  const arr: ModuleOkItem[] = (payload?.columns ?? []).map(col => ({
    id: String(col.dataIndex ?? ''),
    val: String(row[String(col.dataIndex ?? '')] ?? ''),
    name: String(col.title ?? ''),
  }));

  return { arr };
}

function handleOk() {
  emit('moduleOk', buildModuleOkPayload());
}

function handleCancel() {
  emit('moduleCancel');
}

defineExpose({
  initData,
});
</script>

<style scoped>
.module-data-cl-select :deep(.module-body--picker) {
  min-height: 560px;
}

.module-data-cl-select :deep(.module-body--picker .query-item) {
  margin-bottom: 0;
}
</style>
