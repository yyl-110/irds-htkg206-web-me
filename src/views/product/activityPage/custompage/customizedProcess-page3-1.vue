<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">初始性能计算：</div>

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
          :columns="page3_1TableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: tabHeight }"
          :row-key="page3_1TableRowKey"
          class="page3-1-table">
          <template #bodyCell="{ column, record }">
            <template v-if="resolveLeafColumn(column)?.cellMode === 'readonly-input'">
              <a-input-number v-model:value="record[String(column.dataIndex)]" class="table-cell-input" disabled />
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import {
  calculateAllPage3_1Rows,
  extractPage3_1SaveParamValues,
  extractPage3_1TableSavePayload,
} from './page3-1/calculations';
import { applyPage3_1InitData } from './page3-1/initData';
import { loadPage3_1PageParameters } from './page3-1/loadPageParameters';
import {
  applyPage3_1TableComponentId,
  createDefaultPage3_1ParameterList,
  type Page3_1ParameterItem,
  type Page3_1TableRow,
} from './page3-1/parameterDefaults';
import { getPage3_1TableRows, setPage3_1TableRows } from './page3-1/rowOperations';
import { PAGE3_1_ANT_COLUMNS, PAGE3_1_LEAF_COLUMNS, type Page3_1AntColumn } from './page3-1/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page3-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page3_1ParameterItem[];
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

const tabHeight = 610;
const page3_1TableColumns = PAGE3_1_ANT_COLUMNS;
const leafColumnMap = new Map(PAGE3_1_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));

function clonePage3_1ParameterList(list: Page3_1ParameterItem[]): Page3_1ParameterItem[] {
  return applyPage3_1TableComponentId(
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

function createInitialParameterList(): Page3_1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage3_1ParameterList(createDefaultPage3_1ParameterList(props.pageid));
  }
  return clonePage3_1ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page3_1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap<Page3_1ParameterItem>({
    props,
    parameterTempList,
    loadPageParameters: loadPage3_1PageParameters,
    cloneItem: clonePage3_1ParameterList,
  });

const tableRowData = computed(() => getPage3_1TableRows(parameterTempList.value));

function resolveLeafColumn(column: { dataIndex?: string | number }): Page3_1AntColumn | undefined {
  return leafColumnMap.get(String(column.dataIndex ?? ''));
}

function page3_1TableRowKey(record: Page3_1TableRow, index?: number) {
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

function handleInitData(): boolean {
  const ok = applyPage3_1InitData(parameterTempList.value, props.savedTables);
  if (!ok) {
    message.warning('未能更新表格：请先在「初始总减速比计算」等前置页面保存数据，且流程上下文已注入后再试');
    return false;
  }
  parameterTempList.value = clonePage3_1ParameterList(parameterTempList.value);
  setPage3_1TableRows(parameterTempList.value, [...getPage3_1TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
  return true;
}

function handleCalculation() {
  const rows = [...getPage3_1TableRows(parameterTempList.value)];
  calculateAllPage3_1Rows(rows);
  setPage3_1TableRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function updateEl(): Promise<void> {
  return nextTick(() => {
    applyTaskParamMapToList();
    parameterTempList.value = clonePage3_1ParameterList(parameterTempList.value);
  });
}

async function runAutoInitAndCalculateOnce() {
  if (hasAutoRefreshed.value) return;
  hasAutoRefreshed.value = true;
  await updateEl();
  if (handleInitData()) {
    handleCalculation();
  }
}

function onMountReady() {
  void runAutoInitAndCalculateOnce();
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage3_1SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage3_1TableSavePayload(clonePage3_1ParameterList(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(onMountReady);
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
  font-weight: 600;
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

.page3-1-table {
  width: 100%;
}

.page3-1-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.page3-1-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.page3-1-table :deep(.ant-table-thead > tr > th) {
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

.selectBox :deep(.ant-input[disabled]),
.selectBox :deep(.ant-input-number-disabled) {
  color: rgba(0, 0, 0, 0.88);
  cursor: default;
}
</style>
