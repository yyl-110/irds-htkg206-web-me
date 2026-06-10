<template>
  <div class="opening-page">
    <div class="opening-page__header">
      <span class="opening-page__title">开口设计：</span>
      <a-button type="primary" @click="handleInitData">
        <template #icon><SyncOutlined /></template>
        更新数据
      </a-button>
    </div>

    <a-table
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: tabHeight, x: 'max-content' }"
      :row-key="tableRowKey"
      :row-selection="rowSelection"
      class="opening-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'select'">
          <a-select
            v-model:value="record.p7"
            class="table-cell-select"
            :options="reviewOptions"
            allow-clear
            @change="handleReviewChange(record, $event)" />
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
import { SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { applyFs151JInitData } from './FS_1_5_1J/initData';
import { loadFs151JPageParameters } from './FS_1_5_1J/loadPageParameters';
import {
  createDefaultFs151JParameterList,
  getOpeningRows,
  REVIEW_OPTIONS,
  setOpeningRows,
  type Fs151JParameterItem,
  type OpeningDesignRow,
} from './FS_1_5_1J/parameterDefaults';
import { extractFs151JSaveParamValues } from './FS_1_5_1J/rowOperations';
import { FS_1_5_1J_COLUMN_MAP, FS_1_5_1J_TABLE_COLUMNS, type OpeningAntColumn } from './FS_1_5_1J/tableColumns';

defineOptions({ name: 'rx-customizedProcess3-FS-1-5-1J' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151JParameterItem[];
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

const tabHeight = 520;
const tableColumns = FS_1_5_1J_TABLE_COLUMNS;
const reviewOptions = REVIEW_OPTIONS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<OpeningDesignRow[]>([]);

function cloneParameterList(source: Fs151JParameterItem[]): Fs151JParameterItem[] {
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

function createInitialParameterList(): Fs151JParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151JParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151JParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151JPageParameters,
  });

const tableRows = computed(() => getOpeningRows(parameterTempList.value));

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: OpeningDesignRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): OpeningAntColumn | undefined {
  return FS_1_5_1J_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: OpeningDesignRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.p0 ?? record.delIndex ?? index ?? '');
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

function handleReviewChange(record: OpeningDesignRow, value: string | number | null | undefined) {
  record.p7 = value == null ? '1' : value;
  setOpeningRows(parameterTempList.value, [...getOpeningRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function handleInitData() {
  const ok = applyFs151JInitData(parameterTempList.value);
  if (!ok) {
    message.warning('未能更新数据：请先在 FS1-5-1F 页面保存数据，且流程上下文已注入后再试');
    return;
  }
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
  return extractFs151JSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.opening-page {
  padding: 20px 10px 24px;
  min-height: 635px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.opening-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.opening-page__title {
  font-size: 15px;
  font-weight: 600;
}

.opening-table {
  width: 100%;
}

.opening-table :deep(.ant-table) {
  font-size: 12px;
}

.opening-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.opening-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: left;
}

.table-cell-select {
  width: 100%;
}
</style>
