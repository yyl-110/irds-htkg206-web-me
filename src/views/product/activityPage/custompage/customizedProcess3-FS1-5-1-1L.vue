<template>
  <div class="wall-check-page">
    <section class="wall-check-page__section">
      <div class="wall-check-page__header">
        <span class="wall-check-page__title">筒壁层合板性能计算：</span>
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </div>
      <a-table
        :columns="displayColumns"
        :data-source="displayRows"
        :pagination="false"
        bordered
        :scroll="{ y: 230, x: 'max-content' }"
        :row-key="displayRowKey"
        class="wall-check-table" />
    </section>

    <section class="wall-check-page__section">
      <div class="wall-check-page__header">
        <span class="wall-check-page__title">筒壁校核：</span>
        <a-button type="primary" :disabled="calcDisabled" :loading="calculating" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </div>
      <a-form label-align="left" :colon="false" :label-col="formLabelCol" class="wall-check-page__form">
        <div class="wall-check-page__form-grid">
          <a-form-item v-for="field in formFields.slice(0, 2)" :key="field.index" :label="field.label">
            <a-input-number
              v-model:value="parameterTempList[field.index].defaultValue"
              type="number"
              class="field-input"
              disabled
              style="width: 200px" />
          </a-form-item>
          <a-form-item v-for="field in formFields.slice(2)" :key="field.index" :label="field.label">
            <a-input-number
              v-model:value="parameterTempList[field.index].defaultValue"
              type="number"
              class="field-input"
              disabled
              style="width: 200px" />
          </a-form-item>
        </div>
      </a-form>
      <a-table
        :columns="checkColumns"
        :data-source="checkRows"
        :pagination="false"
        bordered
        :scroll="{ y: 230, x: 'max-content' }"
        :row-key="checkRowKey"
        :row-selection="rowSelection"
        class="wall-check-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveCheckColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveCheckColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>
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
import { runWallCheckCalculation, validateWallCheckInputs } from './FS1_5_1_1_L/calculation';
import { applyFs151_1_1LInitData } from './FS1_5_1_1_L/initData';
import { extractFs151_1_1LSaveParamValues, loadFs151_1_1LPageParameters } from './FS1_5_1_1_L/loadPageParameters';
import {
  createDefaultFs151_1_1LParameterList,
  FORM_FIELDS,
  getCheckTableRows,
  getDisplayTableRows,
  NUMERIC_REG,
  type Fs151_1_1LParameterItem,
  type WallCheckDisplayRow,
  type WallCheckRow,
} from './FS1_5_1_1_L/parameterDefaults';
import {
  CHECK_COLUMN_MAP,
  CHECK_TABLE_COLUMNS,
  DISPLAY_TABLE_COLUMNS,
  type WallCheckAntColumn,
} from './FS1_5_1_1_L/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1L' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_1LParameterItem[];
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
const formLabelCol = { style: { width: '140px' } };
const displayColumns = DISPLAY_TABLE_COLUMNS;
const checkColumns = CHECK_TABLE_COLUMNS;
const formFields = FORM_FIELDS;

const calculating = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<WallCheckRow[]>([]);

function cloneParameterList(source: Fs151_1_1LParameterItem[]): Fs151_1_1LParameterItem[] {
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

function createInitialParameterList(): Fs151_1_1LParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_1LParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_1LParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_1_1LPageParameters,
  });

const displayRows = computed(() => getDisplayTableRows(parameterTempList.value));
const checkRows = computed(() => getCheckTableRows(parameterTempList.value));
const calcDisabled = computed(() => selectedRows.value.length !== 1);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: WallCheckRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveCheckColumn(column: { dataIndex?: string | number }): WallCheckAntColumn | undefined {
  return CHECK_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function displayRowKey(record: WallCheckDisplayRow, index?: number) {
  return `${record.p0}-${record.p1}-${index ?? ''}`;
}

function checkRowKey(record: WallCheckRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.p0 ?? index ?? '');
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

function handleNumberBlur(record: WallCheckRow, field: string, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  record[field] = field === 'p5' || field === 'p9' || field === 'p10' ? Number(value) : value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleInitData() {
  const ok = applyFs151_1_1LInitData(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面 FS1-5-1-1K 已保存');
    return;
  }
  setSaveBtnEnable();
}

async function handleCalculation() {
  if (selectedRows.value.length !== 1) return;
  const row = selectedRows.value[0];
  if (!validateWallCheckInputs(parameterTempList.value, row)) {
    message.error('计算参数不能为空');
    return;
  }
  calculating.value = true;
  try {
    const userId = userStore.getUser.id ?? '';
    await runWallCheckCalculation(parameterTempList.value, row, userId);
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
  return extractFs151_1_1LSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.wall-check-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  text-align: left;
}

.wall-check-page__section {
  margin-bottom: 16px;
}

.wall-check-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.wall-check-page__title {
  font-size: 15px;
  font-weight: 600;
}

.wall-check-page__form {
  padding: 0 15px 12px;
}

.wall-check-page__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 8px 40px;
}

.field-input {
  width: 100px;
}

.wall-check-table {
  width: 100%;
}

.wall-check-table :deep(.ant-table) {
  font-size: 12px;
}

.wall-check-table :deep(.ant-table-thead > tr > th),
.wall-check-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input {
  width: 100%;
}
</style>
