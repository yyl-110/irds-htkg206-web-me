<template>
  <div>
    <div class="layout-wrapper">
      <div class="layout-header">
        <div class="layout-header__title">计算输入参数：</div>
        <div class="selectBox">
          <div class="selectBox__inner">
            <a-table
              :columns="inputParamColumns"
              :data-source="parameterTempList[0]?.tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              :scroll="{ y: tabHeight0, x: 970 }"
              :row-key="tableRowKey">
              <template #bodyCell="{ column, record, index }">
                <template v-if="isInputParamEditableColumn(column)">
                  <a-input-number
                    v-model:value="record.p2"
                    type="number"
                    class="table-cell-input"
                    @input="onInputParamInput(record, index)"
                    @blur="onInputParamBlur(record, index, $event)" />
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>

      <div class="layout-content">
        <div class="section-toolbar">
          零位（初始位置）：
          <a-button type="primary" @click="calc">
            <template #icon><CalculatorOutlined /></template>
            计算
          </a-button>
        </div>
        <div class="table-row">
          <a-table
            :columns="zeroPositionColumns"
            :data-source="parameterTempList[1]?.tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            class="zero-position-table"
            :scroll="{ y: tabHeight1, x: 970 }"
            :row-key="tableRowKey">
            <template #bodyCell="{ column, record, index }">
              <template v-if="isZeroPositionEditableColumn(column)">
                <a-input-number
                  v-model:value="record.p0"
                  type="number"
                  class="table-cell-input"
                  @input="onZeroAngleInput(record, index)"
                  @blur="onZeroAngleBlur(record, index, $event)" />
              </template>
            </template>
          </a-table>
        </div>
        <div class="trip-row">
          总行程：
          <a-input v-model:value="trip" disabled style="width: 200px; display: none" />
          <a-input :value="parameterTempList[2]?.defaultValue" disabled style="width: 200px" />
        </div>
      </div>

      <div class="layout-content2">
        <div class="section-toolbar">
          <a-button type="primary" class="btnSty" style="margin-bottom: 10px" @click="addRowData">
            <template #icon><PlusOutlined /></template>
            添加行
          </a-button>
          <a-button
            type="primary"
            danger
            class="btnSty"
            style="margin-bottom: 10px; margin-left: 20px"
            :disabled="rowFlag"
            @click="handleDelRow">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </div>
        <div class="table-row">
          <a-table
            :columns="resultTableColumns"
            :data-source="parameterTempList[3]?.tableMap?.rowData ?? []"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ y: tabHeight2, x: 1100 }"
            :row-key="resultTableRowKey"
            :row-selection="resultRowSelection">
            <template #bodyCell="{ column, record, index }">
              <template v-if="isResultTableEditableColumn(column)">
                <a-input-number
                  v-model:value="record.p0"
                  type="number"
                  class="table-cell-input"
                  @input="onResultAngleInput(record, index)"
                  @blur="onResultAngleBlur(record, index, $event)" />
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { CalculatorOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  createPage0_5Calculations,
  extractPage0_5SaveParamValues,
  extractPage0_5TableSavePayload,
} from './page0-5/calculations';
import { loadPage0_4PageParameters } from './page0-4/loadPageParameters';
import {
  createDefaultPage0_4ParameterList,
  applyPage0_4TableComponentIds,
  type Page0_4ParameterItem,
} from './page0-4/parameterDefaults';
import {
  INPUT_PARAM_ANT_COLUMNS,
  INPUT_PARAM_NUMBER_REG,
  isInputParamEditableColumn,
  isResultTableEditableColumn,
  isZeroPositionEditableColumn,
  RESULT_ANGLE_NUMBER_REG,
  RESULT_TABLE_ANT_COLUMNS,
  ZERO_ANGLE_NUMBER_REG,
  ZERO_POSITION_ANT_COLUMNS,
} from './page0-5/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page0-4' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page0_4ParameterItem[];
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

const tabHeight0 = 167;
const tabHeight1 = 180;
const tabHeight2 = 230;

const inputParamColumns = INPUT_PARAM_ANT_COLUMNS;
const zeroPositionColumns = ZERO_POSITION_ANT_COLUMNS;
const resultTableColumns = RESULT_TABLE_ANT_COLUMNS;

function cloneParameterList(source: Page0_4ParameterItem[]): Page0_4ParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: Array.isArray(item.tableMap.rowData) ? item.tableMap.rowData.map(row => ({ ...row })) : [],
        }
      : item.tableMap,
  }));
}

function createInitialParameterList(): Page0_4ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage0_4ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page0_4ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage0_4PageParameters,
  });

const data = ref<Array<Record<string, string>>>(parameterTempList.value[0]?.tableMap?.rowData ?? []);
const data1 = ref<Array<Record<string, string>>>(parameterTempList.value[1]?.tableMap?.rowData ?? []);
const data2 = ref<Array<Record<string, string>>>(parameterTempList.value[3]?.tableMap?.rowData ?? []);
const trip = ref(parameterTempList.value[2]?.defaultValue ?? '');
const selectList = ref<Array<Record<string, string>>>([]);
const selectedResultRowKeys = ref<Array<string | number>>([]);

const rowFlag = computed(() => selectList.value.length === 0);

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

const calcCtx = {
  parameterTempList,
  data,
  data1,
  data2,
  trip,
  onSaveBtnEnable: () => setSaveBtnEnable(),
};

const { addRowData, delRow, calc, angleInput, angleInput1, changeInput, changeInput1, changeInput2, changeInput3 } =
  createPage0_5Calculations(calcCtx);

const resultRowSelection = computed(() => ({
  selectedRowKeys: selectedResultRowKeys.value,
  onChange: (keys: Array<string | number>, rows: Array<Record<string, string>>) => {
    selectedResultRowKeys.value = keys;
    selectList.value = rows;
  },
}));

function tableRowKey(record: Record<string, string>, index?: number) {
  return String(record?.p0 ?? index ?? 0);
}

function resultTableRowKey(record: Record<string, string>, index?: number) {
  if (record.id != null && record.id !== '') {
    return String(record.id);
  }
  if (record.delIndex != null && record.delIndex !== '') {
    return String(record.delIndex);
  }
  return String(index ?? 0);
}

function syncLocalDataFromParameterList() {
  data.value = [...(parameterTempList.value[0]?.tableMap?.rowData ?? [])];
  data1.value = [...(parameterTempList.value[1]?.tableMap?.rowData ?? [])];
  data2.value = [...(parameterTempList.value[3]?.tableMap?.rowData ?? [])];
  trip.value = String(parameterTempList.value[2]?.defaultValue ?? '');
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
    parameterTempList.value = applyPage0_4TableComponentIds(parameterTempList.value);
    syncLocalDataFromParameterList();
  });
}

setupParameterWatch(updateEl);

function onInputParamInput(record: Record<string, string>, index: number) {
  if (parameterTempList.value[0]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[0].tableMap.rowData[index].p2 = record.p2;
  }
  data.value[index] = record;
  setSaveBtnEnable();
}

function onInputParamBlur(record: Record<string, string>, index: number, event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  if (target.value && !INPUT_PARAM_NUMBER_REG.test(target.value)) {
    message.error('请输入数字');
    return;
  }
  record.p2 = target.value;
  if (parameterTempList.value[0]?.tableMap?.rowData) {
    parameterTempList.value[0].tableMap.rowData[index] = record;
  }
  data.value[index] = record;
  if (index === 0) {
    changeInput(target.value);
  } else if (index === 1) {
    changeInput1(target.value);
  } else if (index === 2) {
    changeInput2(target.value);
  } else if (index === 3) {
    changeInput3(target.value);
  }
  setSaveBtnEnable();
}

function onZeroAngleInput(record: Record<string, string>, index: number) {
  if (parameterTempList.value[1]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[1].tableMap.rowData[index].p0 = record.p0;
  }
  data1.value[index] = record;
  setSaveBtnEnable();
}

function onZeroAngleBlur(record: Record<string, string>, index: number, event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  if (target.value && !ZERO_ANGLE_NUMBER_REG.test(target.value)) {
    message.error('请输入数字');
    return;
  }
  record.p0 = target.value;
  data1.value[index] = record;
  angleInput(target.value);
  setSaveBtnEnable();
}

function onResultAngleInput(record: Record<string, string>, index: number) {
  if (parameterTempList.value[3]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[3].tableMap.rowData[index].p0 = record.p0;
  }
  data2.value[index] = record;
  setSaveBtnEnable();
}

function onResultAngleBlur(record: Record<string, string>, index: number, event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  if (target.value && !RESULT_ANGLE_NUMBER_REG.test(target.value)) {
    message.error('请输入数字');
    return;
  }
  record.p0 = target.value;
  data2.value[index] = record;
  angleInput1(index, target.value);
}

function handleDelRow() {
  delRow(selectList.value);
  selectList.value = [];
  selectedResultRowKeys.value = [];
}

function syncParameterListBeforeSave() {
  if (parameterTempList.value[0]?.tableMap) {
    parameterTempList.value[0].tableMap.rowData = data.value;
  }
  if (parameterTempList.value[1]?.tableMap) {
    parameterTempList.value[1].tableMap.rowData = data1.value;
  }
  if (parameterTempList.value[2]) {
    parameterTempList.value[2].defaultValue = trip.value;
  }
  if (parameterTempList.value[3]?.tableMap) {
    parameterTempList.value[3].tableMap.rowData = data2.value;
  }
}

function getCurrentSaveParamValues() {
  syncParameterListBeforeSave();
  return extractPage0_5SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  syncParameterListBeforeSave();
  return extractPage0_5TableSavePayload(parameterTempList.value);
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
  height: 770px;
  background-color: #ffffff;
}

.layout-header {
  background: #ffffff;
  min-height: 230px;
  height: 230px;
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

.selectBox {
  width: 100%;
  height: 100%;
  float: left;
  padding-top: 10px;
}

.selectBox__inner {
  width: 100%;
  height: 190px;
}

.layout-content {
  background: #ffffff;
}

.layout-content2 {
  background: #ffffff;
}

.section-toolbar {
  width: 100%;
  font-weight: 600;
  padding-left: 10px;
  margin-bottom: 20px;
}

.layout-content .section-toolbar {
  margin-bottom: 20px;
}

.layout-content2 .section-toolbar {
  margin-bottom: 10px;
}

.table-row {
  width: 100%;
  float: left;
}

.zero-position-table {
  z-index: 0;
}

.trip-row {
  width: 100%;
  font-weight: 600;
  margin-left: 10px;
  padding-top: 10px;
  float: left;
  height: 55px;
}

.btnSty {
  margin-bottom: 10px;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}
</style>
