<template>
  <div class="page7">
    <div class="page7-header">
      <div class="page7-title">性能校核计算</div>
      <a-space :size="12" class="page7-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
        <a-button type="primary" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </a-space>
    </div>

    <div class="page7-table-wrap">
      <a-table
        :columns="page7TableColumns"
        :data-source="tableRowData"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: tableScrollX }"
        :row-key="page7TableRowKey"
        class="page7-table" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import {
  calculateAllPage7Rows,
  extractPage7SaveParamValues,
  extractPage7TableSavePayload,
} from './page7/calculations';
import { applyPage7InitData } from './page7/initData';
import { loadPage7PageParameters } from './page7/loadPageParameters';
import {
  createDefaultPage7ParameterList,
  ensurePage7TableComponentIds,
  type Page7ParameterItem,
  type Page7TableRow,
} from './page7/parameterDefaults';
import { getPage7TableRows, setPage7TableRows } from './page7/rowOperations';
import { PAGE7_ANT_COLUMNS, PAGE7_TABLE_MIN_WIDTH } from './page7/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page7' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page7ParameterItem[];
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

const tabHeight = 580;
const tableScrollX = PAGE7_TABLE_MIN_WIDTH;
const page7TableColumns = PAGE7_ANT_COLUMNS;

function clonePage7ParameterList(list: Page7ParameterItem[]): Page7ParameterItem[] {
  return ensurePage7TableComponentIds(
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

function createInitialParameterList(): Page7ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage7ParameterList(createDefaultPage7ParameterList(props.pageid));
  }
  return clonePage7ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page7ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage7PageParameters,
  cloneItem: clonePage7ParameterList,
});

const tableRowData = computed(() => getPage7TableRows(parameterTempList.value));

function page7TableRowKey(record: Page7TableRow, index?: number) {
  return `${record.p0 ?? ''}-${record.p28 ?? index ?? ''}`;
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

function handleInitData() {
  const result = applyPage7InitData(parameterTempList.value, props.savedTables);
  if (!result.ok) {
    message.warning(
      '未能更新表格：请先在「确定齿数和最终实际总减速比」「初步性能计算」「减速器选型」等前置页面生成数据并注入流程上下文后再试',
    );
    return;
  }
  setPage7TableRows(parameterTempList.value, [...getPage7TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function handleCalculation() {
  const rows = [...getPage7TableRows(parameterTempList.value)];
  if (!rows.length) {
    message.warning('暂无数据可计算');
    return;
  }
  calculateAllPage7Rows(rows);
  setPage7TableRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage7SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage7TableSavePayload(ensurePage7TableComponentIds(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.page7 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page7-header {
  width: 100%;
  margin-bottom: 12px;
}

.page7-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page7-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.page7-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.page7-table :deep(.ant-table) {
  font-size: 12px;
}

.page7-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page7-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page7-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page7-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}
</style>
