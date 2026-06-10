<template>
  <div class="power-page">
    <div class="power-page__title">配电设计</div>

    <div class="power-page__toolbar">
      <a-space :size="12" wrap>
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger :disabled="rowFlag" @click="handleDeleteRow">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除行
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: 450, x: 'max-content' }"
      :row-key="tableRowKey"
      :row-selection="rowSelection"
      class="power-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'select'">
          <a-select
            v-model:value="record.p1"
            class="table-cell-select"
            :options="powerTypeOptions"
            allow-clear
            @change="handlePowerTypeChange(record, $event)" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { isValid } from '@/api/flowData/flowData';
import { loadZt1_532BPageParameters } from './ZT1_5_3_2B/loadPageParameters';
import {
  createDefaultZt1_532BParameterList,
  getPowerBranchRows,
  POWER_TYPE_OPTIONS,
  setPowerBranchRows,
  type PowerBranchRow,
  type Zt1_532BParameterItem,
} from './ZT1_5_3_2B/parameterDefaults';
import { addPowerBranchRow, deletePowerBranchRows, extractZt1_532BSaveParamValues } from './ZT1_5_3_2B/rowOperations';
import { ZT1_5_3_2B_COLUMN_MAP, ZT1_5_3_2B_TABLE_COLUMNS, type PowerBranchAntColumn } from './ZT1_5_3_2B/tableColumns';

defineOptions({ name: 'rx-customizedProcess1-ZT1_5_3_2B' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_532BParameterItem[];
  }>(),
  {
    checkId: '',
    categoryId: '',
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

const tableColumns = ZT1_5_3_2B_TABLE_COLUMNS;
const powerTypeOptions = POWER_TYPE_OPTIONS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<PowerBranchRow[]>([]);

function cloneParameterList(source: Zt1_532BParameterItem[]): Zt1_532BParameterItem[] {
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

function createInitialParameterList(): Zt1_532BParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_532BParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_532BParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadZt1_532BPageParameters,
  });

const tableRows = computed(() => getPowerBranchRows(parameterTempList.value));
const rowFlag = computed(() => selectedRows.value.length <= 0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: PowerBranchRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): PowerBranchAntColumn | undefined {
  return ZT1_5_3_2B_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: PowerBranchRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.delIndex ?? record.p0 ?? index ?? '');
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

function handlePowerTypeChange(record: PowerBranchRow, value: string | number | null | undefined) {
  record.p1 = value == null ? '0' : value;
  setPowerBranchRows(parameterTempList.value, [...getPowerBranchRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function handleAddRow() {
  addPowerBranchRow(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!isValid(selectedRows.value) || selectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deletePowerBranchRows(parameterTempList.value, selectedRows.value);
  selectedRowKeys.value = [];
  selectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractZt1_532BSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.power-page {
  padding: 0 10px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.power-page__title {
  margin-top: 20px;
  padding-bottom: 8px;
  width: 100px;
  /* border-bottom: 1px solid silver; */
  font-size: 15px;
  font-weight: 600;
}

.power-page__toolbar {
  margin: 20px 0 12px 0;
}

.power-table :deep(.ant-table) {
  font-size: 12px;
}

.power-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.power-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

.table-cell-select :deep(.ant-select-selector) {
  text-align: center;
}
</style>
