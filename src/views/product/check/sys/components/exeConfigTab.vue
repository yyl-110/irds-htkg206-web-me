<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import ExeConfigAddModal from './exeConfigAddModal.vue';

type ExeConfigRecord = {
  id: string | number;
  calcName: string;
  calcType: string;
  treeName: string;
  levelName: string;
  status: string | number | boolean;
  createTime: string;
};

const props = defineProps<{
  datasource: any[];
  loading: boolean;
  pagination: any;
  currentNodeName?: string;
}>();

const emit = defineEmits<{
  search: [keyword: string];
  add: [];
  action: [action: string, record: ExeConfigRecord];
}>();

const keyword = ref('');
const exeConfigColumns = ref<TableColumnType<ExeConfigRecord>[]>([
  { title: '计算名称', dataIndex: 'calcName', key: 'calcName', align: 'left', width: 180 },
  { title: '计算类型', dataIndex: 'calcType', key: 'calcType', align: 'left', width: 120 },
  { title: '所属分类', dataIndex: 'treeName', key: 'treeName', align: 'left', width: 180 },
  { title: '密级', dataIndex: 'levelName', key: 'levelName', align: 'left', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center', width: 160 },
  { title: '操作', dataIndex: 'operation', key: 'operation', align: 'center', width: 180, fixed: 'right' },
]);

type SortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: SortOrder }>({ key: '', order: '' });
const filterValueMap = ref<Record<string, string>>({});
const filterOpenMap = ref<Record<string, boolean>>({});
const addModalVisible = ref(false);

const sourceList = computed<ExeConfigRecord[]>(() => {
  return (props.datasource || []).map((item: any, index: number) => ({
    id: item?.id ?? `${index}-${item?.parameterNum ?? ''}`,
    calcName: item?.parameterName ?? item?.calcName ?? '--',
    calcType: item?.parameterTypeName ?? item?.calcType ?? 'exe',
    treeName: item?.treeName ?? item?.categoryName ?? props.currentNodeName ?? '--',
    levelName: item?.levelName ?? item?.secretLevel ?? '--',
    status: item?.status ?? '1',
    createTime: item?.createTime ?? '--',
  }));
});

const exeConfigList = computed<ExeConfigRecord[]>(() => {
  let list = [...sourceList.value];

  Object.keys(filterValueMap.value).forEach((key: string) => {
    const filterValue = String(filterValueMap.value[key] ?? '').trim().toLowerCase();
    if (!filterValue) return;
    list = list.filter((item: any) => String(item?.[key] ?? '').toLowerCase().includes(filterValue));
  });

  if (!sortState.value.key || !sortState.value.order) return list;
  const sorted = [...list].sort((a: any, b: any) => {
    if (sortState.value.key === 'status') {
      return Number(isEnabled(a.status)) - Number(isEnabled(b.status));
    }
    return sortText(a?.[sortState.value.key], b?.[sortState.value.key]);
  });
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function isEnabled(status: string | number | boolean) {
  return status === true || status === 1 || status === '1';
}

function sortText(a: unknown, b: unknown) {
  return String(a ?? '').localeCompare(String(b ?? ''), 'zh-CN');
}

function isSortableColumn(column: any) {
  return column?.dataIndex && column.dataIndex !== 'operation';
}

function isFilterableColumn(column: any) {
  return column?.dataIndex && column.dataIndex !== 'operation';
}

function toggleColumnSort(column: any) {
  if (!isSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (sortState.value.key !== key) {
    sortState.value = { key, order: 'ascend' };
    return;
  }
  if (sortState.value.order === 'ascend') {
    sortState.value = { key, order: 'descend' };
    return;
  }
  if (sortState.value.order === 'descend') {
    sortState.value = { key: '', order: '' };
    return;
  }
  sortState.value = { key, order: 'ascend' };
}

function getSortOrder(key: string): SortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function setFilterOpen(key: string, open: boolean) {
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function handleFilterOpenChange(key: string, open: boolean) {
  setFilterOpen(key, open);
}

function getFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function applyColumnFilter(key: string) {
  setFilterOpen(key, false);
}

function resetColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  setFilterOpen(key, false);
}

function getRowKey(record: ExeConfigRecord) {
  return record.id;
}

function getRowClassName(_record: ExeConfigRecord, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function onSearch() {
  emit('search', keyword.value);
}

function onAdd() {
  addModalVisible.value = true;
}

function onAction(action: string, record: ExeConfigRecord) {
  emit('action', action, record);
}

function handleAddSuccess() {
  emit('add');
}
</script>

<template>
  <div class="calc-config-pane">
    <a-card class="calc-toolbar-card">
      <a-form layout="inline" class="calc-toolbar-form">
        <a-form-item label="">
          <a-input v-model:value="keyword" placeholder="请输入计算名称" allow-clear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSearch">
            <SearchOutlined />
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onAdd">
            <PlusOutlined />
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="calc-table-card">
      <a-table
        :columns="exeConfigColumns"
        :data-source="exeConfigList"
        :pagination="pagination"
        :loading="loading"
        bordered
        :row-key="getRowKey"
        :scroll="{ x: 980, y: 420 }"
        :row-class-name="getRowClassName">
        <template #headerCell="{ column }">
          <div class="header-cell-main">
            <span
              class="header-title-sort"
              :class="{ 'header-title-sort--disabled': !isSortableColumn(column) }"
              @click.stop="toggleColumnSort(column)">
              <span>{{ column.title }}</span>
              <span v-if="isSortableColumn(column)" class="header-sort-icon">
                <CaretUpOutlined v-if="getSortOrder(String(column.dataIndex)) === 'ascend'" />
                <CaretDownOutlined v-else-if="getSortOrder(String(column.dataIndex)) === 'descend'" />
                <CaretUpOutlined v-else class="header-sort-icon--muted" />
              </span>
            </span>
            <a-popover
              v-if="isFilterableColumn(column)"
              trigger="click"
              placement="bottomRight"
              :open="getFilterOpen(String(column.dataIndex))"
              @openChange="handleFilterOpenChange(String(column.dataIndex), $event)">
              <template #content>
                <div class="header-filter-pop">
                  <a-input
                    v-model:value="filterValueMap[String(column.dataIndex)]"
                    :placeholder="`搜索 ${column.title}`"
                    allow-clear />
                  <div class="header-filter-actions">
                    <a-button type="primary" size="small" @click="applyColumnFilter(String(column.dataIndex))">
                      <SearchOutlined />
                      确定
                    </a-button>
                    <a-button size="small" @click="resetColumnFilter(String(column.dataIndex))">重置</a-button>
                  </div>
                </div>
              </template>
              <FilterOutlined class="header-query-icon" />
            </a-popover>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-switch :checked="isEnabled(record.status)" />
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="calc-operation-links">
              <a @click.stop.prevent="onAction('编辑', record)">编辑</a>
              <a @click.stop.prevent="onAction('详情', record)">详情</a>
              <a @click.stop.prevent="onAction('删除', record)" style="color: #ff4d4f">删除</a>
              <a @click.stop.prevent="onAction('发布', record)">发布</a>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <ExeConfigAddModal
      v-model:visible="addModalVisible"
      :current-node-name="currentNodeName"
      @success="handleAddSuccess" />
  </div>
</template>

<style scoped lang="less">
.calc-config-pane {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calc-toolbar-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.calc-toolbar-form {
  gap: 4px;
}

.calc-table-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 0;
  }

  :deep(.ant-table-wrapper) {
    height: 100%;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead > tr > th:last-child) {
    border-right: none;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }
}

.calc-operation-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.header-cell-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-cell-main {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.header-filter-pop {
  width: 220px;
}

.header-filter-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
</style>
