<template>
  <a-modal
    v-model:open="visible"
    title="数据选取"
    width="1200px"
    :mask-closable="false"
    class="module-data-select"
    @cancel="handleCancel">
    <ModuleInfoList ref="moduleListRef" picker-mode @picker-confirm="handlePickerConfirm" />

    <template #footer>
      <a-space>
        <a-button type="primary" :loading="initializing" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import ModuleInfoList from '@/views/product/module/application/components/ModuleInfoList.vue';

defineOptions({ name: 'ModuleDataSelect' });

export interface ModuleOkItem {
  id?: string;
  val?: string;
  name?: string;
}

export interface ModuleOkPayload {
  para1?: string;
  para3?: string;
  para4?: string;
  para5?: string;
  arr?: ModuleOkItem[];
}

interface ModuleListExpose {
  initData: (
    categoryId: string,
    menuId?: string | null,
    permissionType?: number,
    queryPrefill?: Record<string, string> | null,
  ) => Promise<void>;
  getPickerConfirmPayload: () => {
    row: Record<string, unknown> | null;
    columns: Array<{ title?: string; dataIndex?: string; key?: string; parameterNum?: string }>;
  };
}

type SelectPageStrItem = { id?: string; val?: string };

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
const initializing = ref(false);
const moduleListRef = ref<ModuleListExpose | null>(null);
const initParams = ref<{
  categoryId: string;
  menuId: string;
  queryPrefill: Record<string, string>;
} | null>(null);

function parseSelectPageStr(selectPageStr: string | SelectPageStrItem[] | undefined): Record<string, string> {
  if (!selectPageStr || typeof selectPageStr === 'string') return {};
  const prefill: Record<string, string> = {};
  selectPageStr.forEach(item => {
    const key = String(item?.id ?? '').trim();
    if (!key) return;
    prefill[key] = String(item?.val ?? '');
  });
  return prefill;
}

function buildLegacyPayload(): ModuleOkPayload {
  const payload = moduleListRef.value?.getPickerConfirmPayload();
  const row = payload?.row;
  if (!row) {
    return {
      para1: '',
      para3: '',
      para4: '',
      para5: '',
      arr: [{ id: '', val: '', name: '' }],
    };
  }

  const arr: ModuleOkItem[] = (payload?.columns ?? []).map(col => ({
    id: String(col.dataIndex ?? ''),
    val: String(row[String(col.dataIndex ?? '')] ?? ''),
    name: String(col.parameterNum ?? ''),
  }));

  return {
    para1: String(row.para1 ?? ''),
    para3: String(row.para3 ?? ''),
    para4: String(row.para4 ?? ''),
    para5: String(row.para5 ?? ''),
    arr,
  };
}

async function openPicker() {
  const categoryId = initParams.value?.categoryId || props.mcategoryid;
  if (!categoryId) {
    message.warning('模型库分类未配置');
    return;
  }

  initializing.value = true;
  try {
    await nextTick();
    await moduleListRef.value?.initData(
      categoryId,
      initParams.value?.menuId || categoryId,
      1,
      initParams.value?.queryPrefill ?? null,
    );
  } finally {
    initializing.value = false;
  }
}

function initData(
  categoryId: string,
  selectPageStr: string | SelectPageStrItem[] = '',
  _matchingModuelPara?: string,
  _matchingRelation?: string,
  _matchingParaVal?: string,
) {
  initParams.value = {
    categoryId,
    menuId: categoryId,
    queryPrefill: parseSelectPageStr(selectPageStr),
  };
}

function handleOk() {
  const payload = buildLegacyPayload();
  if (!payload.para1 && !payload.para3) {
    message.warning('请选择一条数据');
    return;
  }
  emit('moduleOk', payload);
}

function handleCancel() {
  emit('moduleCancel');
}

function handlePickerConfirm(payload: { row: Record<string, unknown> | null }) {
  if (!payload?.row) {
    message.warning('请选择一条数据');
    return;
  }
  emit('moduleOk', buildLegacyPayload());
}

watch(
  () => props.moduleDataSelect,
  async val => {
    visible.value = val;
    if (!val) return;
    await openPicker();
  },
);

defineExpose({
  initData,
});
</script>

<style scoped>
.module-data-select :deep(.module-body--picker) {
  min-height: 560px;
}

.module-data-select :deep(.module-body--picker .query-item) {
  margin-bottom: 0;
}
</style>
