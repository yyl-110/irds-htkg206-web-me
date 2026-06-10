<template>
  <div>
    <div class="layout-wrapper">
      <div class="layout-header">
        <div class="layout-header__title">计算输入参数：</div>
        <div class="input-param-table">
            <a-table
              :columns="inputParamColumns"
              :data-source="parameterTempList[0]?.tableMap?.rowData ?? []"
              :pagination="false"
              bordered
              size="small"
              class="adaptive-table"
              :row-key="tableRowKey">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'p1' && column.editable">
                  <a-input-number
                    v-model:value="record.p1"
                    type="number"
                    class="table-cell-input"
                    @input="onInputParamInput(record, index, 'p1')"
                    @blur="onInputParamBlur(record, index, 'p1', $event)" />
                </template>
                <template v-else-if="column.dataIndex === 'p2' && column.editable">
                  <a-input-number
                    v-model:value="record.p2"
                    type="number"
                    class="table-cell-input"
                    @input="onInputParamInput(record, index, 'p2')"
                    @blur="onInputParamBlur(record, index, 'p2', $event)" />
                </template>
              </template>
            </a-table>
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
            class="zero-position-table adaptive-table"
            :scroll="tableScroll1"
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
          <span class="trip-row__label">总行程：</span>
          <a-input v-model:value="trip" disabled style="width: 200px; display: none" />
          <a-input :value="parameterTempList[2]?.defaultValue" disabled style="width: 200px" />
        </div>
      </div>

      <div class="layout-content2">
        <div class="section-toolbar section-toolbar--actions">
          <a-button type="primary" @click="addRowData">
            <template #icon><PlusOutlined /></template>
            添加行
          </a-button>
          <a-button type="primary" danger :disabled="rowFlag" @click="handleDelRow">
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
            class="adaptive-table"
            :scroll="tableScroll2"
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
import { EpcIcon } from '@/components/icon/EpcIcon';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { createPage1Calculations, extractPage1SaveParamValues } from './page1/calculations';
import { loadPage1PageParameters } from './page1/loadPageParameters';
import { createDefaultPage1ParameterList, type Page1ParameterItem } from './page1/parameterDefaults';
import {
  INPUT_PARAM_ANT_COLUMNS,
  INPUT_PARAM_NUMBER_REG,
  isResultTableEditableColumn,
  isZeroPositionEditableColumn,
  RESULT_ANGLE_NUMBER_REG,
  RESULT_TABLE_ANT_COLUMNS,
  ZERO_ANGLE_NUMBER_REG,
  ZERO_POSITION_ANT_COLUMNS,
} from './page1/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page1ParameterItem[];
  }>(),
  {
    width: 985,
    modalFlag: false,
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();

const route = useRoute();
const tabHeight1 = 140;
const tabHeight2 = 250;

const tableScroll1 = computed(() => ({ y: tabHeight1, x: '100%' }));
const tableScroll2 = computed(() => ({ y: tabHeight2, x: '100%' }));

const inputParamColumns = INPUT_PARAM_ANT_COLUMNS;
const zeroPositionColumns = ZERO_POSITION_ANT_COLUMNS;
const resultTableColumns = RESULT_TABLE_ANT_COLUMNS;

function cloneParameterList(source: Page1ParameterItem[]): Page1ParameterItem[] {
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

function createInitialParameterList(): Page1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage1ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page1ParameterItem[]>(createInitialParameterList());
const data = ref<Array<Record<string, string>>>(parameterTempList.value[0]?.tableMap?.rowData ?? []);
const data1 = ref<Array<Record<string, string>>>(parameterTempList.value[1]?.tableMap?.rowData ?? []);
const data2 = ref<Array<Record<string, string>>>(parameterTempList.value[3]?.tableMap?.rowData ?? []);
const trip = ref(parameterTempList.value[2]?.defaultValue ?? '');
const selectList = ref<Array<Record<string, string>>>([]);
const selectedResultRowKeys = ref<Array<string | number>>([]);

const rowFlag = computed(() => selectList.value.length === 0);

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      data.value = parameterTempList.value[0]?.tableMap?.rowData ?? [];
      data1.value = parameterTempList.value[1]?.tableMap?.rowData ?? [];
      data2.value = parameterTempList.value[3]?.tableMap?.rowData ?? [];
      trip.value = parameterTempList.value[2]?.defaultValue ?? '';
    }
  },
  { deep: true },
);

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

const { addRowData, delRow, calc, angleInput, changeInput1, changeInput2, changeInput3, changeInput4, changeInput5 } =
  createPage1Calculations(calcCtx);

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

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadPage1PageParameters(pageId);
  data.value = parameterTempList.value[0]?.tableMap?.rowData ?? [];
  data1.value = parameterTempList.value[1]?.tableMap?.rowData ?? [];
  data2.value = parameterTempList.value[3]?.tableMap?.rowData ?? [];
  trip.value = parameterTempList.value[2]?.defaultValue ?? '';
}

function updateEl() {
  nextTick(() => {
    // no-op, preserved for parent compatibility
  });
}

function onInputParamInput(record: Record<string, string>, index: number, field: 'p1' | 'p2') {
  if (parameterTempList.value[0]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[0].tableMap.rowData[index][field] = record[field];
  }
  data.value[index] = record;
  setSaveBtnEnable();
}

function onInputParamBlur(record: Record<string, string>, index: number, field: 'p1' | 'p2', event: FocusEvent) {
  const target = event.target as HTMLInputElement;
  if (target.value && !INPUT_PARAM_NUMBER_REG.test(target.value)) {
    message.error('请输入数字');
    return;
  }
  record[field] = target.value;
  if (parameterTempList.value[0]?.tableMap?.rowData) {
    parameterTempList.value[0].tableMap.rowData[index] = record;
  }
  data.value[index] = record;
  if (field === 'p1') {
    if (index === 1) {
      changeInput1(target.value);
    } else if (index === 2) {
      changeInput2(target.value);
    }
  } else if (field === 'p2') {
    if (index === 1) {
      changeInput3(target.value);
    } else if (index === 2) {
      changeInput4(target.value);
    }
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
  angleInput(record);
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
  changeInput5(index, target.value);
}

function handleDelRow() {
  delRow(selectList.value);
  selectList.value = [];
  selectedResultRowKeys.value = [];
}

function getCurrentSaveParamValues() {
  return extractPage1SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
});
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 10px 10px 0;
  height: 770px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
}

.layout-header {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  background: #ffffff;
}

.layout-header__title,
.input-param-table,
.section-toolbar,
.table-row,
.trip-row {
  width: 100%;
  margin-left: 0;
  padding-left: 0;
  box-sizing: border-box;
}

.layout-header__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.input-param-table {
  width: 600px;
  max-width: 100%;
}

.layout-content,
.layout-content2 {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  background: #ffffff;
}

.section-toolbar {
  display: flex;
  align-items: center;
  gap: 25px;
  font-weight: 600;
}

.section-toolbar--actions {
  font-weight: normal;
}

.table-row {
  width: 100%;
}

.zero-position-table {
  z-index: 0;
}

.trip-row {
  display: flex;
  align-items: center;
  gap: 25px;
}

.trip-row__label {
  font-weight: 600;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}

.adaptive-table {
  width: 100%;
}

.adaptive-table :deep(.ant-table-wrapper) {
  margin-left: 0;
  padding-left: 0;
}

.adaptive-table :deep(.ant-table) {
  width: 100%;
}

.adaptive-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.adaptive-table :deep(.ant-table-thead > tr > th) {
  white-space: normal;
  word-break: break-all;
  line-height: 1.35;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: normal;
}

.adaptive-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 2px;
  font-size: 12px;
}
</style>
