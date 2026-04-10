<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';

const props = defineProps({
  visible: { type: Boolean, default: false },
  categoryId: { type: [String, Number], default: '' },
  menuId: { type: [String, Number], default: '' },
  userId: { type: [String, Number], default: '' },
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [payload: { row: any; columns: any[] }];
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
});

const loading = ref(false);
const tableColumns = ref<any[]>([]);
const tableData = ref<any[]>([]);
const selectedRowKeys = ref<Array<string | number>>([]);
const selectedRow = ref<any>(null);

function closeModal() {
  innerVisible.value = false;
}

function normalizeColumnDefs(raw: any): any[] {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((item: any, idx: number) => ({
      title: String(item?.propertyName ?? item?.paramName ?? `列${idx + 1}`),
      dataIndex: String(item?.dataProp ?? item?.paramProp ?? item?.propName ?? ''),
      key: String(item?.id ?? item?.propertyName ?? idx),
      width: Number(item?.colWidth ?? 150),
      ellipsis: true,
      propertyType: Number(item?.propertyType ?? 1),
      parameterNum: String(item?.parameterNum ?? item?.paramNum ?? ''),
    }))
    .filter((c: any) => {
      if (!c.dataIndex) return false;
      const title = String(c.title ?? '').trim();
      return title !== '备注' && title !== '贡献者';
    });
}

function normalizeRows(raw: any): any[] {
  const list = Array.isArray(raw?.list) ? raw.list : Array.isArray(raw) ? raw : [];
  return list.map((row: any, idx: number) => ({
    ...row,
    _rowKey: String(row?.id ?? `${idx}-${row?.ROW_ID ?? ''}`),
  }));
}

async function loadData() {
  const categoryId = String(props.categoryId ?? '').trim();
  const menuId = String(props.menuId ?? '').trim();
  if (!categoryId || !menuId) {
    message.warning('请先选择基础资源库类型和分类');
    tableColumns.value = [];
    tableData.value = [];
    selectedRow.value = null;
    selectedRowKeys.value = [];
    return;
  }
  loading.value = true;
  try {
    const listQuery = {
      userId: props.userId,
      moduleParaList: [],
      categoryId,
      pageNo: 1,
      pageSize: 10000,
      menuId,
    };
    const columnQuery = { categoryId, menuId };
    const [res, libRes] = await Promise.all([AdminApiSystemModule.preciseQueryModuleLibrary(listQuery), AdminApiSystemModule.findCurrentModuleInfoByCategoryId(columnQuery)]);
    tableColumns.value = normalizeColumnDefs(libRes?.data?.data);
    tableData.value = normalizeRows(res?.data?.data);
    selectedRow.value = null;
    selectedRowKeys.value = [];
  } finally {
    loading.value = false;
  }
}

function onRowSelectChange(keys: Array<string | number>, rows: any[]) {
  selectedRowKeys.value = keys.slice(0, 1);
  selectedRow.value = rows?.[0] ?? null;
}
function onTableRowClick(record: any) {
  selectedRowKeys.value = [record?._rowKey];
  selectedRow.value = record ?? null;
}

function onConfirm() {
  if (!selectedRow.value) {
    message.warning('请选择一条模型库数据');
    return;
  }
  emit('confirm', { row: selectedRow.value, columns: tableColumns.value });
  closeModal();
}

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    void loadData();
  },
);
</script>

<template>
  <a-modal v-model:visible="innerVisible" title="选择模型库数据" :width="1200" :mask-closable="false" @cancel="closeModal">
    <a-table
      :loading="loading"
      :columns="tableColumns"
      :data-source="tableData"
      :row-key="(r: any) => r._rowKey"
      :pagination="false"
      size="middle"
      bordered
      :scroll="{ x: 1100, y: 460 }"
      :custom-row="(record: any) => ({ onClick: () => onTableRowClick(record) })"
      :row-selection="{
        type: 'radio',
        selectedRowKeys,
        onChange: onRowSelectChange,
      }">
    </a-table>
    <template #footer>
      <a-button type="primary" :loading="loading" @click="onConfirm">确定</a-button>
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>
</template>

<style scoped>
.module-picker-table {
  border-radius: 8px;
  overflow: hidden;
}

.module-picker-table :deep(.ant-table-thead > tr > th),
.module-picker-table :deep(.ant-table-tbody > tr > td) {
  background: #fff !important;
}

.module-picker-table :deep(.ant-table-thead > tr > th) {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  padding: 8px 10px !important;
  white-space: nowrap;
  line-height: 1.25;
}

.module-picker-table :deep(.ant-table-tbody > tr > td) {
  font-size: 14px;
  color: #374151;
  padding: 8px 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.module-picker-table :deep(.ant-table-tbody > tr > td .ant-btn-link) {
  font-size: 14px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-picker-table :deep(.ant-table-tbody > tr) {
  transition: box-shadow 0.15s ease;
}

.module-picker-table :deep(.ant-table-tbody > tr:hover) {
  box-shadow: inset 0 0 0 1px #dbeafe;
}

.module-picker-table :deep(.ant-table-tbody > tr.ant-table-row-selected > td),
.module-picker-table :deep(.ant-table-tbody > tr.ant-table-row:hover > td),
.module-picker-table :deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td) {
  background: #fff !important;
}

.module-picker-table :deep(.ant-radio-inner) {
  width: 16px;
  height: 16px;
}

.module-picker-table :deep(.ant-table-body::-webkit-scrollbar) {
  height: 8px;
  width: 8px;
}

.module-picker-table :deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background: #d1d5db;
  border-radius: 999px;
}
</style>
