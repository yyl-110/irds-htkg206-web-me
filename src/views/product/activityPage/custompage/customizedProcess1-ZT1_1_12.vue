<template>
  <div class="zt1-page">
    <div class="zt1-page__section-title">元器件原材料选用</div>

    <div class="zt1-page__label">元器件选型原则：</div>
    <a-textarea
      v-model:value="parameterTempList[0].defaultValue"
      class="zt1-page__textarea"
      :rows="5"
      :maxlength="1000"
      show-count
      @input="setSaveBtnEnable()" />

    <div class="zt1-page__table-header">
      <span class="zt1-page__label zt1-page__label--inline">系统元器件统计：</span>
      <a-space :size="12">
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
      :scroll="{ x: 'max-content' }"
      :row-key="tableRowKey"
      :row-selection="rowSelection"
      class="zt1-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="resolveLeafColumn(column)?.cellMode === 'editable'">
          <a-input
            v-model:value="record[String(column.dataIndex)]"
            class="table-cell-input"
            @input="onCellInput(record, index)" />
        </template>
        <template v-else-if="resolveLeafColumn(column)?.cellMode === 'readonly'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
      </template>

      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="0" />
            <a-table-summary-cell v-for="(key, cellIndex) in summaryKeys" :key="key" :index="cellIndex + 1" align="center">
              {{ summaryValues[key] }}
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>

    <div class="zt1-page__label zt1-page__label--spaced">系统元器件国产化达标情况及自主可控方案：</div>
    <a-textarea
      v-model:value="parameterTempList[2].defaultValue"
      class="zt1-page__textarea"
      :rows="5"
      :maxlength="1000"
      show-count
      @input="setSaveBtnEnable()" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { isValid } from '@/api/flowData/flowData';
import { buildTableSummary, calcRowPercents } from './ZT1_1_12/calculations';
import { loadZt1PageParameters } from './ZT1_1_12/loadPageParameters';
import {
  createDefaultZt1ParameterList,
  getStatsTableRows,
  setStatsTableRows,
  type Zt1ParameterItem,
  type Zt1TableRow,
} from './ZT1_1_12/parameterDefaults';
import { addStatsRow, deleteStatsRows, extractZt1SaveParamValues } from './ZT1_1_12/rowOperations';
import {
  ZT1_1_12_LEAF_COLUMNS,
  ZT1_1_12_SUMMARY_KEYS,
  ZT1_1_12_TABLE_COLUMNS,
  type Zt1AntColumn,
} from './ZT1_1_12/tableColumns';

defineOptions({ name: 'rx-customizedProcess1-ZT1_1_12' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1ParameterItem[];
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
const tableColumns = ZT1_1_12_TABLE_COLUMNS;
const summaryKeys = ZT1_1_12_SUMMARY_KEYS;
const leafColumnMap = new Map(ZT1_1_12_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<Zt1TableRow[]>([]);

function cloneParameterList(source: Zt1ParameterItem[]): Zt1ParameterItem[] {
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

function createInitialParameterList(): Zt1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1ParameterItem[]>(createInitialParameterList());
const tableRows = computed(() => getStatsTableRows(parameterTempList.value));
const summaryValues = computed(() => buildTableSummary(tableRows.value));
const rowFlag = computed(() => selectedRows.value.length <= 0);

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
    }
  },
  { deep: true },
);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: Zt1TableRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveLeafColumn(column: { dataIndex?: string | number }): Zt1AntColumn | undefined {
  return leafColumnMap.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: Zt1TableRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.delIndex ?? index ?? '');
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

function onCellInput(record: Zt1TableRow, index: number) {
  const rows = getStatsTableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index] = calcRowPercents(record);
  }
  setStatsTableRows(parameterTempList.value, [...rows]);
  setSaveBtnEnable();
}

function handleAddRow() {
  addStatsRow(parameterTempList.value);
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!isValid(selectedRows.value) || selectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteStatsRows(parameterTempList.value, selectedRows.value);
  selectedRowKeys.value = [];
  selectedRows.value = [];
  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadZt1PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractZt1SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
});
</script>

<style scoped>
.zt1-page {
  padding: 0 10px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.zt1-page__section-title {
  margin-top: 20px;
  padding-bottom: 8px;
  width: 200px;
  /* border-bottom: 1px solid silver; */
  font-weight: 600;
  font-size: 15px;
}

.zt1-page__label {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 14px;
}

.zt1-page__label--inline {
  margin-top: 0;
  margin-left: 0;
}

.zt1-page__label--spaced {
  margin-top: 30px;
}

.zt1-page__textarea {
  width: 600px;
  max-width: 100%;
  margin: 8px 0 0 20px;
}

.zt1-page__table-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0 10px 10px;
  font-size: 15px;
}

.zt1-table {
  margin-left: 10px;
}

.zt1-table :deep(.ant-table) {
  font-size: 12px;
}

.zt1-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.zt1-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.zt1-table :deep(.ant-table-summary > tr > td) {
  padding: 6px 8px;
  text-align: center;
  font-weight: 600;
  background: #fafafa;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}
</style>
