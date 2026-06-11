<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">电机、减速器组合（以电机进行电机与末端减速器的排列组合）：</div>

      <div class="section-toolbar">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </div>

      <div class="selectBox">
        <a-table
          :columns="page4TableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: tabHeight }"
          :row-key="page4TableRowKey"
          class="page4-table" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import { extractPage4SaveParamValues, extractPage4TableSavePayload } from './page4/calculations';
import { applyPage4InitData } from './page4/initData';
import { loadPage4PageParameters } from './page4/loadPageParameters';
import { createDefaultPage4ParameterList, type Page4ParameterItem, type Page4TableRow } from './page4/parameterDefaults';
import { getPage4TableRows, setPage4TableRows } from './page4/rowOperations';
import { PAGE4_ANT_COLUMNS } from './page4/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page4ParameterItem[];
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
const page4TableColumns = PAGE4_ANT_COLUMNS;

function createInitialParameterList(): Page4ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage4ParameterList(props.pageid);
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

const parameterTempList = ref<Page4ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage4PageParameters,
  });


const tableRowData = computed(() => getPage4TableRows(parameterTempList.value));

function page4TableRowKey(record: Page4TableRow, index?: number) {
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

function handleInitData() {
  const ok = applyPage4InitData(parameterTempList.value);
  if (!ok) {
    message.warning(
      '未能生成组合方案：请先在「电机选型」「减速器选型」「初始性能计算」页面填写并保存，且流程上下文已注入后再点更新数据',
    );
    return;
  }
  setPage4TableRows(parameterTempList.value, [...getPage4TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage4SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage4TableSavePayload(parameterTempList.value);
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

.page4-table {
  width: 100%;
}

.page4-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.page4-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.page4-table :deep(.ant-table-thead > tr > th) {
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
