<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">初始总减速比计算：</div>

      <div class="section-toolbar">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
        <a-button type="primary" style="margin-left: 20px" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </div>

      <div class="selectBox">
        <a-table
          :columns="page3TableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: tabHeight }"
          :row-key="page3TableRowKey"
          class="page3-table">
          <template #bodyCell="{ column, record, index }">
            <template v-if="resolveLeafColumn(column)?.cellMode === 'readonly-input'">
              <a-input
                v-if="resolveLeafColumn(column)?.inputType !== 'number'"
                v-model:value="record[String(column.dataIndex)]"
                type="text"
                class="table-cell-input"
                disabled />
              <a-input-number v-else v-model:value="record[String(column.dataIndex)]" class="table-cell-input" disabled />
            </template>
            <template v-else-if="resolveLeafColumn(column)?.cellMode === 'editable'">
              <a-input-number
                v-model:value="record[String(column.dataIndex)]"
                type="number"
                class="table-cell-input"
                @blur="onEditableBlur(record, index, String(column.dataIndex), $event)"
                @input="onCellInput(record, index, String(column.dataIndex))" />
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import {
  calculateAllPage3Rows,
  extractPage3SaveParamValues,
  extractPage3TableSavePayload,
} from './page3/calculations';
import { applyPage3InitData } from './page3/initData';
import { loadPage3PageParameters } from './page3/loadPageParameters';
import { createDefaultPage3ParameterList, type Page3ParameterItem, type Page3TableRow } from './page3/parameterDefaults';
import { getPage3TableRows, setPage3TableRows } from './page3/rowOperations';
import { PAGE3_ANT_COLUMNS, PAGE3_LEAF_COLUMNS, type Page3AntColumn } from './page3/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page3' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page3ParameterItem[];
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

const route = useRoute();

const tabHeight = 610;
const page3TableColumns = PAGE3_ANT_COLUMNS;
const leafColumnMap = new Map(PAGE3_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));

const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

function createInitialParameterList(): Page3ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage3ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: item.tableMap.rowData?.map(row => ({ ...row })),
        }
      : item.tableMap,
  }));
}

const parameterTempList = ref<Page3ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage3PageParameters,
  });

const tableRowData = computed(() => getPage3TableRows(parameterTempList.value));

function resolveLeafColumn(column: { dataIndex?: string | number }): Page3AntColumn | undefined {
  return leafColumnMap.get(String(column.dataIndex ?? ''));
}

function page3TableRowKey(record: Page3TableRow, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') {
    return;
  }
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) {
    return;
  }
  if (parameterValue === undefined || parameterValue === null) {
    return;
  }
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

function onCellInput(record: Page3TableRow, index: number, field: string) {
  const rows = getPage3TableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index][field] = record[field];
  }
  setSaveBtnEnable();
}

function onEditableBlur(record: Page3TableRow, index: number, field: string, event: FocusEvent) {
  const target = event.target as HTMLInputElement | null;
  const value = target?.value ?? '';
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  record[field] = value;
  onCellInput(record, index, field);
}

function handleInitData() {
  const ok = applyPage3InitData(parameterTempList.value);
  if (!ok) {
    message.warning('未能更新表格：请先在「电机选型」等前置页面保存数据，且流程上下文已注入后再试');
    return;
  }
  setPage3TableRows(parameterTempList.value, [...getPage3TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function handleCalculation() {
  const rows = [...getPage3TableRows(parameterTempList.value)];
  calculateAllPage3Rows(rows);
  setPage3TableRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage3SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage3TableSavePayload(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.layout-wrapper {
  padding: 0 10px;
  min-height: 680px;
  background-color: #ffffff;
}

.layout-header {
  background: #ffffff;
  min-height: 680px;
  line-height: 40px;
  padding: 0;
  margin-bottom: 10px;
}

.layout-header__title {
  width: 100%;
  font-size: 15px;
  padding-left: 10px;
}

.section-toolbar {
  padding: 10px 0 10px 10px;
}

.selectBox {
  width: 100%;
  padding: 0 10px;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input),
.table-cell-input :deep(.ant-input-number-input) {
  text-align: center;
}

.table-cell-input :deep(.ant-input-number) {
  width: 100%;
}

.page3-table {
  width: 100%;
}

.page3-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.page3-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.page3-table :deep(.ant-table-thead > tr > th) {
  white-space: normal;
  word-break: break-all;
  line-height: 1.35;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: normal;
}

.selectBox :deep(.ant-table-cell) {
  padding: 4px 6px;
  text-align: center;
  font-size: 12px;
}

.selectBox :deep(.ant-input[disabled]) {
  color: rgba(0, 0, 0, 0.88);
  cursor: default;
}
</style>
