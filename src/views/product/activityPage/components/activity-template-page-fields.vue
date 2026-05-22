<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { ProductTempPageRequestDTOModel } from '@/api/models/productTemp/ProductTempPageRequestDTOModel';
import { normalizeListSnowflakeIds } from '@/utils/snowflakeId';

const props = defineProps<{
  auditProcess: string;
  isSynergy: string;
  tempNum: string;
}>();

const emit = defineEmits<{
  (e: 'update:auditProcess', value: string): void;
  (e: 'update:isSynergy', value: string): void;
  (e: 'update:tempNum', value: string): void;
}>();

const collaborateOptions = [
  { label: '否', value: '0' },
  { label: '是', value: '1' },
];

type FlowPickerRow = {
  id?: string | number;
  processKey?: string;
  processName?: string;
};

type TempPickerRow = {
  id?: string | number;
  tempNum?: string;
  tempName?: string;
  remarks?: string;
};

const auditPickerVisible = ref(false);
const auditPickerLoading = ref(false);
const auditPickerList = ref<FlowPickerRow[]>([]);
const auditPickerSelectedKeys = ref<string[]>([]);
const auditPickerSelectedRow = ref<FlowPickerRow | null>(null);

const tempPickerVisible = ref(false);
const tempPickerLoading = ref(false);
const tempPickerList = ref<TempPickerRow[]>([]);
const tempPickerSelectedKeys = ref<string[]>([]);
const tempPickerSelectedRow = ref<TempPickerRow | null>(null);

const auditPickerColumns: TableColumnType<FlowPickerRow>[] = [
  { title: '流程标识', dataIndex: 'processKey', key: 'processKey', ellipsis: true, width: 200 },
  { title: '流程名称', dataIndex: 'processName', key: 'processName', ellipsis: true },
];

const tempPickerColumns: TableColumnType<TempPickerRow>[] = [
  { title: '模板编号', dataIndex: 'tempNum', key: 'tempNum', width: 160, ellipsis: true },
  { title: '模板名称', dataIndex: 'tempName', key: 'tempName', ellipsis: true },
  { title: '备注', dataIndex: 'remarks', key: 'remarks', ellipsis: true },
];

const auditPickerRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: auditPickerSelectedKeys.value,
  onChange: (keys: (string | number)[], rows: FlowPickerRow[]) => {
    auditPickerSelectedKeys.value = keys.map(String);
    auditPickerSelectedRow.value = rows[0] ?? null;
  },
}));

const tempPickerRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: tempPickerSelectedKeys.value,
  onChange: (keys: (string | number)[], rows: TempPickerRow[]) => {
    tempPickerSelectedKeys.value = keys.map(String);
    tempPickerSelectedRow.value = rows[0] ?? null;
  },
}));

function resetAuditPickerSelection() {
  auditPickerSelectedKeys.value = [];
  auditPickerSelectedRow.value = null;
}

function resetTempPickerSelection() {
  tempPickerSelectedKeys.value = [];
  tempPickerSelectedRow.value = null;
}

function auditPickerCustomRow(record: FlowPickerRow) {
  return {
    onClick: () => {
      const id = record.id;
      if (id == null || id === '') return;
      auditPickerSelectedKeys.value = [String(id)];
      auditPickerSelectedRow.value = record;
    },
  };
}

function tempPickerCustomRow(record: TempPickerRow) {
  return {
    onClick: () => {
      const id = record.id;
      if (id == null || id === '') return;
      tempPickerSelectedKeys.value = [String(id)];
      tempPickerSelectedRow.value = record;
    },
  };
}

async function openAuditPicker() {
  resetAuditPickerSelection();
  auditPickerVisible.value = true;
  auditPickerLoading.value = true;
  try {
    const params: any = { pageNo: 1, pageSize: 100, releaseType: 1 };
    const res = await AdminApiSystemProcessTask.taskBasicInfoPage(params);
    auditPickerList.value = normalizeListSnowflakeIds(Array.isArray(res?.data?.data?.list) ? res.data.data.list : []);
  } catch {
    auditPickerList.value = [];
    message.error('审核流程列表加载失败');
  } finally {
    auditPickerLoading.value = false;
  }
}

async function openTempPicker() {
  resetTempPickerSelection();
  tempPickerVisible.value = true;
  tempPickerLoading.value = true;
  try {
    const params = new ProductTempPageRequestDTOModel();
    params.pageNo = 1;
    params.pageSize = 100;
    const res = await AdminApiProductTemp.getProductTempPageList(params);
    const list = res?.data?.data?.list;
    tempPickerList.value = Array.isArray(list) ? list : [];
  } catch {
    tempPickerList.value = [];
    message.error('页面模板列表加载失败');
  } finally {
    tempPickerLoading.value = false;
  }
}

function confirmAuditPicker() {
  const row = auditPickerSelectedRow.value;
  const key = String(row?.processKey ?? '').trim();
  if (!key) {
    message.warning('请选择审核流程');
    return;
  }
  emit('update:auditProcess', key);
  auditPickerVisible.value = false;
}

function confirmTempPicker() {
  const row = tempPickerSelectedRow.value;
  const num = String(row?.tempNum ?? '').trim();
  if (!num) {
    message.warning('请选择页面模板');
    return;
  }
  emit('update:tempNum', num);
  tempPickerVisible.value = false;
}
</script>

<template>
  <div class="activity-template-page-fields">
    <a-form-item :label="$t('审核流程')" name="auditProcess">
      <a-input-group compact class="template-page-browse-group">
        <a-input
          :value="props.auditProcess"
          readonly
          allowClear
          placeholder="请浏览选择"
          @clear="emit('update:auditProcess', '')" />
        <a-button type="primary" @click="openAuditPicker">{{ $t('浏览') }}</a-button>
      </a-input-group>
    </a-form-item>
    <a-form-item :label="$t('是否协同')" name="isSynergy">
      <a-select
        :value="props.isSynergy"
        :options="collaborateOptions"
        placeholder="请选择"
        allowClear
        :get-popup-container="(node: HTMLElement) => node.parentElement ?? document.body"
        @update:value="(v: string) => emit('update:isSynergy', v)" />
    </a-form-item>
    <a-form-item :label="$t('页面模板')" name="tempNum">
      <a-input-group compact class="template-page-browse-group">
        <a-input
          :value="props.tempNum"
          readonly
          allowClear
          placeholder="请浏览选择"
          @clear="emit('update:tempNum', '')" />
        <a-button type="primary" @click="openTempPicker">{{ $t('浏览') }}</a-button>
      </a-input-group>
    </a-form-item>

    <a-modal v-model:visible="auditPickerVisible" title="选择审核流程" width="720px" :mask-closable="false" @ok="confirmAuditPicker">
      <a-table
        :columns="auditPickerColumns"
        :data-source="auditPickerList"
        :loading="auditPickerLoading"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ y: 360 }"
        :row-selection="auditPickerRowSelection"
        :custom-row="auditPickerCustomRow" />
    </a-modal>

    <a-modal v-model:visible="tempPickerVisible" title="选择页面模板" width="720px" :mask-closable="false" @ok="confirmTempPicker">
      <a-table
        :columns="tempPickerColumns"
        :data-source="tempPickerList"
        :loading="tempPickerLoading"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ y: 360 }"
        :row-selection="tempPickerRowSelection"
        :custom-row="tempPickerCustomRow" />
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.template-page-browse-group {
  display: flex;
  width: 100%;

  :deep(.ant-input) {
    flex: 1;
  }
}
</style>
