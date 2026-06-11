<template>
  <div class="layout-wrapper">
    <div class="layout-content">
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="section-title">确认输入数据</div>

        <a-form-item label="任务ID：" class="task-id-item">
          <a-input
            v-model:value="parameterTempList[0].defaultValue"
            class="task-id-input"
            disabled
            placeholder="请输入..." />
          <a-button type="primary" @click="freshData">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
        </a-form-item>

        <div class="table-block">
          <div class="table-block__title">基本数据：</div>
          <a-table
            :columns="baseParamColumns"
            :data-source="parameterTempList[1].tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ y: 150, x: 1000 }"
            :row-key="tableRowKey">
            <template #bodyCell="{ column, record }">
              <template v-if="isEditableColumn(column)">
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  class="table-cell-input"
                  @input="setSaveBtnEnable()" />
              </template>
            </template>
          </a-table>
        </div>

        <div class="table-block">
          <div class="table-block__title">工作参数：</div>
          <a-table
            :columns="workParamColumns"
            :data-source="parameterTempList[2].tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ y: 120, x: 1000 }"
            :row-key="tableRowKey">
            <template #bodyCell="{ column, record }">
              <template v-if="isEditableColumn(column)">
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  class="table-cell-input"
                  @input="setSaveBtnEnable()" />
              </template>
            </template>
          </a-table>
        </div>

        <div class="table-row-pair">
          <div class="table-block table-block--narrow">
            <div class="table-block__title">通讯形式：</div>
            <a-table
              :columns="commParamColumns"
              :data-source="parameterTempList[3].tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: 120 }"
              :row-key="tableRowKey">
              <template #bodyCell="{ column, record }">
                <template v-if="isEditableColumn(column)">
                  <a-input
                    v-model:value="record[String(column.dataIndex)]"
                    class="table-cell-input"
                    @input="setSaveBtnEnable()" />
                </template>
              </template>
            </a-table>
          </div>

          <div class="table-block table-block--wide">
            <div class="table-block__title">幅相参数：</div>
            <a-table
              :columns="fuxiangParamColumns"
              :data-source="parameterTempList[4].tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: 120 }"
              :row-key="tableRowKey">
              <template #bodyCell="{ column, record }">
                <template v-if="isEditableColumn(column)">
                  <a-input
                    v-model:value="record[String(column.dataIndex)]"
                    class="table-cell-input"
                    @input="setSaveBtnEnable()" />
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { isValid } from '@/api/flowData/flowData';
import { createDefaultPage0_1ParameterList, type Page0_1ParameterItem } from './page0-1/parameterDefaults';
import { extractPage0_1SaveParamValues, extractPage0_1TableSavePayload } from './page0-1/calculations';
import {
  BASE_PARAMS_COLUMNS,
  COMM_PARAMS_COLUMNS,
  FUXIANG_PARAMS_COLUMNS,
  isEditableColumn,
  toAntTableColumns,
  WORK_PARAMS_COLUMNS,
} from './page0-1/tableColumns';
import { loadPage0_1PageParameters } from './page0-1/loadPageParameters';
import { applyFreshData } from './page0-1/freshData';

defineOptions({ name: 'rx-customizedProcess-page0-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page0_1ParameterItem[];
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

const formLabelCol = { style: { width: '120px' } };

const baseParamColumns = computed(() => toAntTableColumns(BASE_PARAMS_COLUMNS));
const workParamColumns = computed(() => toAntTableColumns(WORK_PARAMS_COLUMNS));
const commParamColumns = computed(() => toAntTableColumns(COMM_PARAMS_COLUMNS));
const fuxiangParamColumns = computed(() => toAntTableColumns(FUXIANG_PARAMS_COLUMNS));

function createInitialParameterList(): Page0_1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage0_1ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: Array.isArray(item.tableMap.rowData) ? item.tableMap.rowData.map(row => ({ ...row })) : [],
        }
      : item.tableMap,
  }));
}

const parameterTempList = ref<Page0_1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage0_1PageParameters,
  });

function tableRowKey(record: Record<string, string>, index?: number) {
  return String(record?.p0 ?? index ?? 0);
}

function freshData() {
  applyFreshData(parameterTempList.value);
  setSaveBtnEnable();
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
    } else if (item.tableMap && Number(item.tableMap.colNums) > 0) {
      const colNums = Number(item.tableMap.colNums);
      item.tableMap.rowData?.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
    }
  });
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage0_1SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage0_1TableSavePayload(parameterTempList.value);
}

async function initPageData() {
  await loadPageParametersIfNeeded();
  applyTaskParamMapToList();
  await nextTick();
  if (isValid(parameterTempList.value[1]?.tableMap?.rowData) === false) {
    freshData();
  }
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

onMounted(() => {
  void initPageData();
});
</script>

<style scoped>
.layout-wrapper {
  padding: 12px 16px 24px;
  background: #ffffff;
  min-height: 680px;
}

.layout-content {
  background: #ffffff;
}

.section-title {
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.task-id-item :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-id-input {
  width: 200px;
}

.table-block {
  margin-bottom: 20px;
}

.table-block__title {
  margin-bottom: 8px;
  font-weight: 500;
}

.table-row-pair {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.table-block--narrow {
  flex: 0 0 400px;
  max-width: 100%;
}

.table-block--wide {
  flex: 1 1 580px;
  min-width: 320px;
}

.table-cell-input {
  text-align: center;
}

:deep(.ant-table-cell) {
  padding: 4px 8px !important;
}

:deep(.ant-input[disabled]) {
  color: rgba(0, 0, 0, 0.65);
  background: #f5f5f5;
}
</style>
