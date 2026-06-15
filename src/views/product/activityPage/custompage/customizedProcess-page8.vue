<template>
  <div class="page8">
    <div class="page8-header">
      <div class="page8-title">初步筛选若干组合方案：</div>
      <!-- <a-space :size="12" class="page8-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </a-space> -->
    </div>

    <div class="page8-table-wrap">
      <a-table
        :columns="page8TableColumns"
        :data-source="tableRowData"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: tableScrollX }"
        :row-key="page8TableRowKey"
        :row-selection="rowSelection"
        class="page8-table" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { extractPage8SaveParamValues, extractPage8TableSavePayload } from './page8/calculations';
import { applyPage8InitData } from './page8/initData';
import { loadPage8PageParameters } from './page8/loadPageParameters';
import {
  createDefaultPage8ParameterList,
  ensurePage8TableComponentIds,
  type Page8ParameterItem,
  type Page8TableRow,
} from './page8/parameterDefaults';
import {
  clearPage8SelectionParam,
  ensurePage8Selection,
  getPage8TableRows,
  hasPage8SavedData,
  page8TableRowKey,
  resolvePage8SelectedRowKeys,
  setPage8TableRows,
  syncPage8SelectionIndexes,
} from './page8/rowOperations';
import { PAGE8_ANT_COLUMNS, PAGE8_TABLE_MIN_WIDTH } from './page8/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page8' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page8ParameterItem[];
    savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null;
    savedTables?: Array<Record<string, unknown>> | null;
  }>(),
  {
    width: 1000,
    modalFlag: false,
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();

const hasAutoRefreshed = ref(false);
const suppressSelectionChange = ref(false);

const tabHeight = 580;
const tableScrollX = PAGE8_TABLE_MIN_WIDTH;
const page8TableColumns = PAGE8_ANT_COLUMNS;
const selectedRowKeys = ref<Key[]>([]);

function clonePage8ParameterList(list: Page8ParameterItem[]): Page8ParameterItem[] {
  return ensurePage8TableComponentIds(
    list.map(item => ({
      ...item,
      tableMap: item.tableMap
        ? {
            ...item.tableMap,
            rowData: item.tableMap.rowData?.map(row => ({ ...row })),
          }
        : item.tableMap,
    })),
  );
}

function createInitialParameterList(): Page8ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage8ParameterList(createDefaultPage8ParameterList(props.pageid));
  }
  return clonePage8ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page8ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, getTaskParamSavedSnapshot, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage8PageParameters,
    cloneItem: clonePage8ParameterList,
  });

const tableRowData = computed(() => getPage8TableRows(parameterTempList.value));

function hasPageSavedData() {
  if (hasPage8SavedData(props.savedTables, props.savedParamValues)) {
    return true;
  }
  const snapshot = getTaskParamSavedSnapshot();
  return hasPage8SavedData(snapshot.savedTables, snapshot.saved);
}

function resolveSavedParamSnapshot() {
  if (Array.isArray(props.savedParamValues) && props.savedParamValues.length) {
    return props.savedParamValues;
  }
  return getTaskParamSavedSnapshot().saved;
}

async function applySelectionState(restoreFromSaved: boolean) {
  suppressSelectionChange.value = true;
  if (restoreFromSaved) {
    selectedRowKeys.value = resolvePage8SelectedRowKeys(parameterTempList.value, resolveSavedParamSnapshot());
  } else {
    selectedRowKeys.value = [];
    clearPage8SelectionParam(parameterTempList.value);
  }
  const { keys } = ensurePage8Selection(parameterTempList.value, selectedRowKeys.value);
  selectedRowKeys.value = keys;
  await nextTick();
  suppressSelectionChange.value = false;
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else {
      const colNums = Number(item.tableMap?.colNums ?? 0);
      if (colNums > 0) {
        item.tableMap?.rowData?.forEach(row => {
          for (let i = 0; i < colNums; i++) {
            if (row[`cellParameterId${i}`] === parameterId) {
              row[`p${i}`] = parameterValue;
            }
          }
        });
      }
    }
  });
}

function handleSelectionChange(keys: Key[], rows: Page8TableRow[]) {
  if (suppressSelectionChange.value) return;
  const selectedRows = rows.slice(0, 1);
  selectedRowKeys.value = keys.slice(0, 1);
  if (selectedRows.length) {
    syncPage8SelectionIndexes(parameterTempList.value, selectedRows);
  }
  setSaveBtnEnable();
}

const rowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedRowKeys.value,
  onChange: handleSelectionChange,
}));

async function handleInitData(): Promise<boolean> {
  suppressSelectionChange.value = true;
  const result = applyPage8InitData(parameterTempList.value);
  if (!result.ok) {
    suppressSelectionChange.value = false;
    message.warning(
      '未能更新表格：请先在「齿轮减速比分配」「确定齿数」「性能校核」等前置页面生成数据并注入流程上下文后再试',
    );
    return false;
  }
  setPage8TableRows(parameterTempList.value, [...getPage8TableRows(parameterTempList.value)]);
  await applySelectionState(hasPageSavedData());
  setSaveBtnEnable();
  return true;
}

function updateEl(): Promise<void> {
  return nextTick(async () => {
    applyTaskParamMapToList();
    parameterTempList.value = clonePage8ParameterList(parameterTempList.value);
    await applySelectionState(hasPageSavedData());
  });
}

async function runAutoInitOnce() {
  if (hasAutoRefreshed.value) return;
  hasAutoRefreshed.value = true;
  await updateEl();
  await handleInitData();
}

function onMountReady() {
  void runAutoInitOnce();
}

setupParameterWatch(updateEl);

function syncSelectionBeforeSave() {
  const { keys } = ensurePage8Selection(parameterTempList.value, selectedRowKeys.value);
  selectedRowKeys.value = keys;
}

function getCurrentSaveParamValues() {
  syncSelectionBeforeSave();
  return extractPage8SaveParamValues(ensurePage8TableComponentIds(parameterTempList.value));
}

function getCurrentTableSavePayload() {
  return extractPage8TableSavePayload(ensurePage8TableComponentIds(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(onMountReady);
</script>

<style scoped>
.page8 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page8-header {
  width: 100%;
  margin-bottom: 12px;
}

.page8-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page8-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.page8-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.page8-table :deep(.ant-table) {
  font-size: 12px;
}

.page8-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page8-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page8-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page8-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}
</style>
