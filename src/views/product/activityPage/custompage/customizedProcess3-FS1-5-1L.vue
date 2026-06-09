<template>
  <div class="seal-page">
    <section class="seal-page__section">
      <div class="seal-page__header">
        <span class="seal-page__title">密封件选型：</span>
        <a-space :size="12">
          <a-button type="primary" @click="handleAddRow">
            <template #icon><PlusOutlined /></template>
            添加
          </a-button>
          <a-button type="primary" danger :disabled="deleteDisabled" @click="handleDeleteRow">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
          <a-button type="primary" :disabled="singleDisabled" @click="handleBrowse">
            <template #icon><FolderOpenOutlined /></template>
            浏览
          </a-button>
          <a-button type="primary" :disabled="singleDisabled" @click="handleAssemble">
            <template #icon><BuildOutlined /></template>
            装配
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="selectTableColumns"
        :data-source="selectTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="selectRowSelection"
        class="seal-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="resolveSelectColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveSelectColumn(column)?.cellMode === 'editable'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @blur="handleDescriptionBlur(record, index, $event)" />
          </template>
        </template>
      </a-table>
    </section>

    <section class="seal-page__section">
      <div class="seal-page__header">
        <span class="seal-page__title">密封件校核：</span>
        <a-button type="primary" :disabled="calcDisabled" :loading="calculating" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </div>
      <a-table
        :columns="checkTableColumns"
        :data-source="checkTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="checkRowSelection"
        class="seal-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="resolveCheckColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveCheckColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleCheckNumberBlur(record, index, String(column.dataIndex), $event)" />
          </template>
          <template v-else-if="resolveCheckColumn(column)?.cellMode === 'select'">
            <a-select
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-select"
              :options="pressureDirectionOptions"
              @change="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>

    <ModuleDataSelect
      ref="moduleDataSelectRef"
      :module-data-select="moduleDataFlag"
      :mcategoryid="moduleCategoryId"
      @module-ok="handleModuleOk"
      @module-cancel="handleModuleCancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { BuildOutlined, CalculatorOutlined, DeleteOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import { assembleSealModule } from './FS1_5_1L/assemblyOperations';
import { runSealCheckCalculation } from './FS1_5_1L/calculation';
import { applyFs15_1LInitData } from './FS1_5_1L/initData';
import { extractFs15_1LSaveParamValues, loadFs15_1LPageParameters } from './FS1_5_1L/loadPageParameters';
import {
  createDefaultFs15_1LParameterList,
  MODULE_CATEGORY_ID,
  NUMERIC_REG,
  PRESSURE_DIRECTION_OPTIONS,
  type Fs15_1LParameterItem,
  type SealTableRow,
} from './FS1_5_1L/parameterDefaults';
import {
  addDualTableRows,
  applyModuleBrowseToRow,
  deleteDualTableRows,
  syncSelectDescription,
} from './FS1_5_1L/rowOperations';
import {
  CHECK_COLUMN_MAP,
  CHECK_TABLE_COLUMNS,
  SELECT_COLUMN_MAP,
  SELECT_TABLE_COLUMNS,
  type AntColumn,
} from './FS1_5_1L/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1L' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs15_1LParameterItem[];
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
const tabHeight = 260;
const selectTableColumns = SELECT_TABLE_COLUMNS;
const checkTableColumns = CHECK_TABLE_COLUMNS;
const moduleCategoryId = MODULE_CATEGORY_ID;
const pressureDirectionOptions = PRESSURE_DIRECTION_OPTIONS;

const moduleDataSelectRef = ref<{ initData: (categoryId: string, pageStr: string) => void } | null>(null);
const moduleDataFlag = ref(false);
const calculating = ref(false);
const selectIndex = ref(0);

const selectedSelectKeys = ref<Key[]>([]);
const selectedSelectRows = ref<SealTableRow[]>([]);
const selectedCheckKeys = ref<Key[]>([]);
const selectedCheckRows = ref<SealTableRow[]>([]);

function cloneParameterList(source: Fs15_1LParameterItem[]): Fs15_1LParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap ? { ...item.tableMap, rowData: item.tableMap.rowData?.map(row => ({ ...row })) } : item.tableMap,
  }));
}

function createInitialParameterList(): Fs15_1LParameterItem[] {
  if (!props.parameterTempList?.length) return createDefaultFs15_1LParameterList(props.pageid);
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs15_1LParameterItem[]>(createInitialParameterList());

const selectTableRows = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);
const checkTableRows = computed(() => parameterTempList.value[1]?.tableMap?.rowData ?? []);
const deleteDisabled = computed(() => selectedSelectRows.value.length <= 0);
const singleDisabled = computed(() => selectedSelectRows.value.length !== 1);
const calcDisabled = computed(() => selectedCheckRows.value.length !== 1);

watch(
  () => props.parameterTempList,
  val => {
    if (val?.length) {
      parameterTempList.value = cloneParameterList(val);
      applyFs15_1LInitData(parameterTempList.value);
    }
  },
  { deep: true },
);

const selectRowSelection = computed(() => ({
  selectedRowKeys: selectedSelectKeys.value,
  onChange: (keys: Key[], rows: SealTableRow[]) => {
    selectedSelectKeys.value = keys;
    selectedSelectRows.value = rows;
    selectIndex.value = rows.length === 1 ? Number(rows[0].p0) - 1 : 0;
  },
}));

const checkRowSelection = computed(() => ({
  selectedRowKeys: selectedCheckKeys.value,
  onChange: (keys: Key[], rows: SealTableRow[]) => {
    selectedCheckKeys.value = keys;
    selectedCheckRows.value = rows;
  },
}));

function resolveSelectColumn(column: { dataIndex?: string | number }): AntColumn | undefined {
  return SELECT_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function resolveCheckColumn(column: { dataIndex?: string | number }): AntColumn | undefined {
  return CHECK_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: SealTableRow, index?: number) {
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
      if (item.parameterId === parameterId) item.defaultValue = parameterValue;
    } else {
      const colNums = Number(item.tableMap?.colNums ?? 0);
      if (colNums > 0) {
        item.tableMap?.rowData?.forEach(row => {
          for (let i = 0; i < colNums; i += 1) {
            if (row[`cellParameterId${i}`] === parameterId) row[`p${i}`] = parameterValue;
          }
        });
      }
    }
  });
}

function handleDescriptionBlur(record: SealTableRow, index: number, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (!value) return;
  record.p3 = value;
  syncSelectDescription(parameterTempList.value, index, value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleCheckNumberBlur(record: SealTableRow, _index: number, field: string, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  if (!value) return;
  record[field] = value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleAddRow() {
  addDualTableRows(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!selectedSelectRows.value.length) return;
  deleteDualTableRows(parameterTempList.value, selectedSelectRows.value);
  selectedSelectKeys.value = [];
  selectedSelectRows.value = [];
  selectedCheckKeys.value = [];
  selectedCheckRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleBrowse() {
  if (singleDisabled.value) return;
  moduleDataSelectRef.value?.initData(MODULE_CATEGORY_ID, '');
  moduleDataFlag.value = true;
}

function handleModuleOk(payload: {
  para1?: string;
  para3?: string;
  para4?: string;
  arr?: Array<{ name?: string; val?: string }>;
}) {
  moduleDataFlag.value = false;
  applyModuleBrowseToRow(parameterTempList.value, selectIndex.value, payload);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleModuleCancel() {
  moduleDataFlag.value = false;
}

async function handleAssemble() {
  if (!selectedSelectRows.value.length) {
    message.info('请选择模型');
    return;
  }
  if (selectedSelectRows.value.length > 1) {
    message.info('请只选择一个模型');
    return;
  }
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const result = await assembleSealModule(instance, selectedSelectRows.value[0]);
  if (!result.ok) {
    if (result.message) message.error(result.message);
    else message.info('操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function handleCalculation() {
  if (selectedCheckRows.value.length !== 1) return;
  calculating.value = true;
  try {
    const result = await runSealCheckCalculation(parameterTempList.value, selectedCheckRows.value[0]);
    if (!result.ok) {
      message.error(result.message ?? '计算失败');
      return;
    }
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  } catch {
    message.error('计算请求失败');
  } finally {
    calculating.value = false;
  }
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList?.length) {
    parameterTempList.value = cloneParameterList(props.parameterTempList);
    applyFs15_1LInitData(parameterTempList.value);
    return;
  }
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  parameterTempList.value = await loadFs15_1LPageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractFs15_1LSaveParamValues(parameterTempList.value);
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
.seal-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.seal-page__section {
  margin-bottom: 10px;
}

.seal-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.seal-page__title {
  font-size: 15px;
  font-weight: 600;
}

.seal-table {
  width: 100%;
}

.seal-table :deep(.ant-table) {
  font-size: 12px;
}

.seal-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.seal-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}
</style>
