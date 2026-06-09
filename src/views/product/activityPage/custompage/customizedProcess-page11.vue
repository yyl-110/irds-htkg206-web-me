<template>
  <div class="page11">
    <div class="page11-header">
      <div class="page11-title">确定最终方案</div>
      <a-space :size="12" class="page11-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </a-space>
    </div>

    <div class="page11-table-wrap">
      <a-table
        :columns="schemeTableColumns"
        :data-source="schemeTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: tableScrollX }"
        :row-key="schemeRowKey"
        :row-selection="schemeRowSelection"
        class="page11-table" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import {
  applyPage11InitData,
  applySchemeSelection,
  getSchemeTableRows,
  getSelectedRowIndex,
  normalizeSelectedRowIndex,
} from './page11/initData';
import { extractPage11SaveParamValues, loadPage11PageParameters } from './page11/loadPageParameters';
import {
  createDefaultPage11ParameterList,
  type Page11ParameterItem,
  type Page11SchemeRow,
} from './page11/parameterDefaults';
import { PAGE11_SCHEME_COLUMNS, PAGE11_TABLE_MIN_WIDTH } from './page11/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page11' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page11ParameterItem[];
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

const route = useRoute();
const tabHeight = 500;
const tableScrollX = PAGE11_TABLE_MIN_WIDTH;
const schemeTableColumns = PAGE11_SCHEME_COLUMNS;

const selectedRowKeys = ref<Key[]>([]);
const selectedSchemeRows = ref<Page11SchemeRow[]>([]);

function cloneParameterList(source: Page11ParameterItem[]): Page11ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}

function createInitialParameterList(): Page11ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage11ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page11ParameterItem[]>(createInitialParameterList());
const schemeTableRows = computed(() => getSchemeTableRows(parameterTempList.value));

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      restoreSelectionFromParam();
    }
  },
  { deep: true },
);

function schemeRowKey(record: Page11SchemeRow, index?: number) {
  return String(record.p0 ?? index ?? '');
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

function restoreSelectionFromParam() {
  const selIndex = normalizeSelectedRowIndex(parameterTempList.value);
  const rows = getSchemeTableRows(parameterTempList.value);
  if (selIndex >= 0 && selIndex < rows.length) {
    const row = rows[selIndex];
    selectedSchemeRows.value = [row];
    selectedRowKeys.value = [schemeRowKey(row, selIndex)];
  } else {
    selectedSchemeRows.value = [];
    selectedRowKeys.value = [];
  }
}

function handleSchemeSelection(_keys: Key[], rows: Page11SchemeRow[]) {
  if (rows.length > 1) {
    message.info('请只选一个方案');
    selectedSchemeRows.value = rows.slice(0, 1);
    selectedRowKeys.value = selectedSchemeRows.value.map(row => schemeRowKey(row));
    applySchemeSelection(parameterTempList.value, selectedSchemeRows.value);
    setSaveBtnEnable();
    return;
  }

  selectedSchemeRows.value = rows;
  selectedRowKeys.value = rows.map(row => schemeRowKey(row));
  applySchemeSelection(parameterTempList.value, rows);
  setSaveBtnEnable();
}

const schemeRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedRowKeys.value,
  onChange: handleSchemeSelection,
}));

function handleInitData() {
  const result = applyPage11InitData(parameterTempList.value);
  if (!result.ok) {
    message.warning('未能更新表格：请先在 page10「所有角度性能校核计算」页面生成数据并注入流程上下文后再试');
    return;
  }
  selectedRowKeys.value = [];
  selectedSchemeRows.value = [];
  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadPage11PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {
    const selIndex = getSelectedRowIndex(parameterTempList.value);
    if (selIndex === undefined || selIndex === null || String(selIndex) === '') {
      normalizeSelectedRowIndex(parameterTempList.value);
    }
    restoreSelectionFromParam();
  });
}

function getCurrentSaveParamValues() {
  return extractPage11SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  restoreSelectionFromParam();
});
</script>

<style scoped>
.page11 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page11-header {
  margin-bottom: 12px;
}

.page11-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page11-actions {
  display: flex;
  justify-content: flex-start;
}

.page11-table-wrap {
  overflow-x: auto;
}

.page11-table :deep(.ant-table) {
  font-size: 12px;
}

.page11-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page11-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page11-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page11-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}
</style>
