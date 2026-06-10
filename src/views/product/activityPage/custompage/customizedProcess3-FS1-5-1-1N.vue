<template>
  <div class="frame-check-page">
    <div class="frame-check-page__header">
      <span class="frame-check-page__title">复合材料加强框校核(矩形截面)：</span>
      <a-space :size="12">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
        <a-button type="primary" :disabled="calcDisabled" :loading="calculating" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
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
      class="frame-check-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'number'">
          <a-input-number
            v-model:value="record[String(column.dataIndex)]"
            type="number"
            class="table-cell-input"
            @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
            @input="setSaveBtnEnable()" />
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
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { useUserStore } from '@/store/modules/user';
import { runFrameCheckCalculation, validateFrameCheckInputs } from './FS1_5_1_1_N/calculation';
import { applyFs151_1_1NInitData } from './FS1_5_1_1_N/initData';
import { extractFs151_1_1NSaveParamValues, loadFs151_1_1NPageParameters } from './FS1_5_1_1_N/loadPageParameters';
import {
  createDefaultFs151_1_1NParameterList,
  getFrameCheckRows,
  NUMERIC_REG,
  type FrameCheckRow,
  type Fs151_1_1NParameterItem,
} from './FS1_5_1_1_N/parameterDefaults';
import { FRAME_CHECK_COLUMN_MAP, FRAME_CHECK_TABLE_COLUMNS, type FrameCheckAntColumn } from './FS1_5_1_1_N/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1N' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_1NParameterItem[];
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

const userStore = useUserStore();
const tabHeight = 530;
const tableColumns = FRAME_CHECK_TABLE_COLUMNS;

const calculating = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<FrameCheckRow[]>([]);

function cloneParameterList(source: Fs151_1_1NParameterItem[]): Fs151_1_1NParameterItem[] {
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

function createInitialParameterList(): Fs151_1_1NParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_1NParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_1NParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1_1NPageParameters,
  });

const tableRows = computed(() => getFrameCheckRows(parameterTempList.value));
const calcDisabled = computed(() => selectedRows.value.length !== 1);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: FrameCheckRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): FrameCheckAntColumn | undefined {
  return FRAME_CHECK_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: FrameCheckRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.p0 ?? record.p1 ?? index ?? '');
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  parameterTempList.value.forEach((item: any) => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else {
      const colNums = Number(item.tableMap?.colNums ?? 0);
      if (colNums > 0) {
        item.tableMap?.rowData?.forEach((row: any) => {
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

function handleNumberBlur(record: FrameCheckRow, field: string, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  record[field] = value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleInitData() {
  const ok = applyFs151_1_1NInitData(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面 FS1-5-1-1M 已保存');
    return;
  }
  setSaveBtnEnable();
}

async function handleCalculation() {
  if (selectedRows.value.length !== 1) return;
  const row = selectedRows.value[0];
  if (!validateFrameCheckInputs(row)) {
    message.error('计算参数不能为空');
    return;
  }
  calculating.value = true;
  try {
    const userId = userStore.getUser.id ?? '';
    await runFrameCheckCalculation(parameterTempList.value, row, userId);
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  } catch (err) {
    message.error(err instanceof Error ? err.message : '计算请求失败');
  } finally {
    calculating.value = false;
  }
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractFs151_1_1NSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.frame-check-page {
  padding: 20px 10px 24px;
  min-height: 680px;
  background: #fff;
  text-align: left;
}

.frame-check-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.frame-check-page__title {
  font-size: 15px;
  font-weight: 600;
}

.frame-check-table {
  width: 100%;
}

.frame-check-table :deep(.ant-table) {
  font-size: 12px;
}

.frame-check-table :deep(.ant-table-thead > tr > th),
.frame-check-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input {
  width: 100%;
}
</style>
