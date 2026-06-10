<template>
  <div class="frame-force-page">
    <div class="frame-force-page__header">
      <span class="frame-force-page__title">加强框内力计算：</span>
      <a-space :size="12">
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger :disabled="deleteDisabled" @click="handleDeleteRow">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除
        </a-button>
      </a-space>
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
      class="frame-force-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
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
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { extractFs151_1_1MSaveParamValues, loadFs151_1_1MPageParameters } from './FS1_5_1_1_M/loadPageParameters';
import {
  createDefaultFs151_1_1MParameterList,
  getFrameForceRows,
  type FrameForceRow,
  type Fs151_1_1MParameterItem,
} from './FS1_5_1_1_M/parameterDefaults';
import { addFrameForceRow, deleteFrameForceRows } from './FS1_5_1_1_M/rowOperations';
import { FRAME_FORCE_COLUMN_MAP, FRAME_FORCE_TABLE_COLUMNS, type FrameForceAntColumn } from './FS1_5_1_1_M/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1M' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_1MParameterItem[];
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

const tabHeight = 530;
const tableColumns = FRAME_FORCE_TABLE_COLUMNS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<FrameForceRow[]>([]);

function cloneParameterList(source: Fs151_1_1MParameterItem[]): Fs151_1_1MParameterItem[] {
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

function createInitialParameterList(): Fs151_1_1MParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_1MParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_1MParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1_1MPageParameters,
  });

const tableRows = computed(() => getFrameForceRows(parameterTempList.value));
const deleteDisabled = computed(() => selectedRows.value.length <= 0);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: FrameForceRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): FrameForceAntColumn | undefined {
  return FRAME_FORCE_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: FrameForceRow, index?: number) {
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
          for (let i = 0; i < colNums; i += 1) {
            if (row[`cellParameterId${i}`] === parameterId) {
              row[`p${i}`] = parameterValue;
            }
          }
        });
      }
    }
  });
}

function handleAddRow() {
  addFrameForceRow(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (selectedRows.value.length <= 0) return;
  deleteFrameForceRows(parameterTempList.value, selectedRows.value);
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
  return extractFs151_1_1MSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.frame-force-page {
  padding: 20px 10px 24px;
  min-height: 680px;
  background: #fff;
  text-align: left;
}

.frame-force-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.frame-force-page__title {
  font-size: 15px;
  font-weight: 600;
}

.frame-force-table {
  width: 100%;
}

.frame-force-table :deep(.ant-table) {
  font-size: 12px;
}

.frame-force-table :deep(.ant-table-thead > tr > th),
.frame-force-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input {
  width: 100%;
}
</style>
