<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">齿轮减速比分配：</div>

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
          :columns="page5TableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: tabHeight }"
          :row-key="page5TableRowKey"
          class="page5-table">
          <template #bodyCell="{ column, record, index }">
            <template v-if="resolveLeafColumn(column)?.cellMode === 'editable'">
              <a-input-number
                v-model:value="record[String(column.dataIndex)]"
                type="number"
                class="table-cell-input table-cell-input--highlight"
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
  calculateAllPage5Rows,
  extractPage5SaveParamValues,
  extractPage5TableSavePayload,
} from './page5/calculations';
import { applyPage5InitData } from './page5/initData';
import { loadPage5PageParameters } from './page5/loadPageParameters';
import {
  createDefaultPage5ParameterList,
  ensurePage5TableComponentIds,
  type Page5ParameterItem,
  type Page5TableRow,
} from './page5/parameterDefaults';
import { getPage5TableRows, setPage5TableRows } from './page5/rowOperations';
import { PAGE5_ANT_COLUMNS, PAGE5_LEAF_COLUMNS, type Page5AntColumn } from './page5/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page5' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page5ParameterItem[];
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

const tabHeight = 580;
const page5TableColumns = PAGE5_ANT_COLUMNS;
const leafColumnMap = new Map(PAGE5_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));
const equivalent = ref(0);

function createInitialParameterList(): Page5ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage5ParameterList(createDefaultPage5ParameterList(props.pageid));
  }
  return clonePage5ParameterList(props.parameterTempList);
}

function clonePage5ParameterList(list: Page5ParameterItem[]): Page5ParameterItem[] {
  return ensurePage5TableComponentIds(
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

const parameterTempList = ref<Page5ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage5PageParameters,
    cloneItem: clonePage5ParameterList,
  });

const tableRowData = computed(() => getPage5TableRows(parameterTempList.value));

function resolveLeafColumn(column: { dataIndex?: string | number }): Page5AntColumn | undefined {
  return leafColumnMap.get(String(column.dataIndex ?? ''));
}

function page5TableRowKey(record: Page5TableRow, index?: number) {
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

function onCellInput(record: Page5TableRow, index: number, field: string) {
  const rows = getPage5TableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index][field] = record[field];
  }
  setSaveBtnEnable();
}

function handleInitData() {
  const result = applyPage5InitData(parameterTempList.value, props.savedTables);
  if (!result.ok) {
    message.warning('未能更新表格：请先在「组合方案确定」页面生成数据并注入流程上下文后再试');
    return;
  }
  equivalent.value = result.equivalent;
  setPage5TableRows(parameterTempList.value, [...getPage5TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function handleCalculation() {
  const rows = [...getPage5TableRows(parameterTempList.value)];
  if (!rows.length) {
    message.warning('暂无数据可计算');
    return;
  }
  calculateAllPage5Rows(rows, equivalent.value);
  setPage5TableRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage5SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage5TableSavePayload(ensurePage5TableComponentIds(parameterTempList.value));
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
  text-align: center;
}

.table-cell-input--highlight :deep(.ant-input) {
  color: #f00;
}

.page5-table {
  width: 100%;
}

.page5-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.page5-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.page5-table :deep(.ant-table-thead > tr > th) {
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
</style>
