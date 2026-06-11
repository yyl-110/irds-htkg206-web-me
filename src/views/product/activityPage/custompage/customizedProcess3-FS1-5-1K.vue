<template>
  <div class="connection-page">
    <section class="connection-page__section">
      <div class="connection-page__header">
        <span class="connection-page__title">连接件选型：</span>
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
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="selectRowSelection"
        class="connection-table">
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

    <section class="connection-page__section">
      <div class="connection-page__header">
        <span class="connection-page__title">连接件校核：</span>
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
        class="connection-table">
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
        </template>
      </a-table>
    </section>

    <ModuleDataSelect
      ref="moduleDataSelectRef"
      :module-data-select="moduleDataFlag"
      :mcategoryid="MODULE_LIBRARY_CATEGORY_ID"
      @module-ok="handleModuleOk"
      @module-cancel="handleModuleCancel" />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { BuildOutlined, CalculatorOutlined, DeleteOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import ModuleDataSelect from '@/views/product/activityPage/components/module-data-select.vue';
import { assembleConnectionModule } from './FS1_5_1K/assemblyOperations';
import { runConnectionCheckCalculation } from './FS1_5_1K/calculation';
import { applyFs15_1KInitData } from './FS1_5_1K/initData';
import { extractFs15_1KSaveParamValues, loadFs15_1KPageParameters } from './FS1_5_1K/loadPageParameters';
import {
  createDefaultFs15_1KParameterList,
  NUMERIC_REG,
  type ConnectionTableRow,
  type Fs15_1KParameterItem,
} from './FS1_5_1K/parameterDefaults';
import {
  addDualTableRows,
  applyModuleBrowseToRow,
  deleteDualTableRows,
  syncSelectDescription,
} from './FS1_5_1K/rowOperations';
import {
  CHECK_COLUMN_MAP,
  CHECK_TABLE_COLUMNS,
  SELECT_COLUMN_MAP,
  SELECT_TABLE_COLUMNS,
  type AntColumn,
} from './FS1_5_1K/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1K' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs15_1KParameterItem[];
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
const MODULE_LIBRARY_CATEGORY_ID = '0';

const moduleDataSelectRef = ref<{ initData: (categoryId: string, pageStr: string) => void } | null>(null);
const moduleDataFlag = ref(false);
const calculating = ref(false);
const selectIndex = ref(0);

const selectedSelectKeys = ref<Key[]>([]);
const selectedSelectRows = ref<ConnectionTableRow[]>([]);
const selectedCheckKeys = ref<Key[]>([]);
const selectedCheckRows = ref<ConnectionTableRow[]>([]);

function cloneParameterList(source: Fs15_1KParameterItem[]): Fs15_1KParameterItem[] {
  return source.map(item => ({
    ...item,
    tableMap: item.tableMap ? { ...item.tableMap, rowData: item.tableMap.rowData?.map(row => ({ ...row })) } : item.tableMap,
  }));
}

function createInitialParameterList(): Fs15_1KParameterItem[] {
  if (!props.parameterTempList?.length) return createDefaultFs15_1KParameterList(props.pageid);
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs15_1KParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs15_1KPageParameters,
  });


const selectTableRows = computed(() => parameterTempList.value[0]?.tableMap?.rowData ?? []);
const checkTableRows = computed(() => parameterTempList.value[1]?.tableMap?.rowData ?? []);
const deleteDisabled = computed(() => selectedSelectRows.value.length <= 0);
const singleDisabled = computed(() => selectedSelectRows.value.length !== 1);
const calcDisabled = computed(() => selectedCheckRows.value.length !== 1);

const selectRowSelection = computed(() => ({
  selectedRowKeys: selectedSelectKeys.value,
  onChange: (keys: Key[], rows: ConnectionTableRow[]) => {
    selectedSelectKeys.value = keys;
    selectedSelectRows.value = rows;
    selectIndex.value = rows.length === 1 ? Number(rows[0].p0) - 1 : 0;
  },
}));

const checkRowSelection = computed(() => ({
  selectedRowKeys: selectedCheckKeys.value,
  onChange: (keys: Key[], rows: ConnectionTableRow[]) => {
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

function tableRowKey(record: ConnectionTableRow, index?: number) {
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

function handleDescriptionBlur(record: ConnectionTableRow, index: number, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (!value) return;
  record.p3 = value;
  syncSelectDescription(parameterTempList.value, index, value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleCheckNumberBlur(record: ConnectionTableRow, _index: number, field: string, event: FocusEvent) {
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
  moduleDataSelectRef.value?.initData(MODULE_LIBRARY_CATEGORY_ID, '');
  moduleDataFlag.value = true;
}

function handleModuleOk(payload: { para1?: string; para3?: string; arr?: Array<{ name?: string; val?: string }> }) {
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

  const result = await assembleConnectionModule(instance, selectedSelectRows.value[0]);
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
    const result = await runConnectionCheckCalculation(parameterTempList.value, selectedCheckRows.value[0]);
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


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractFs15_1KSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.connection-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.connection-page__section {
  margin-bottom: 10px;
}

.connection-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.connection-page__title {
  font-size: 15px;
  font-weight: 600;
}

.connection-table {
  width: 100%;
}

.connection-table :deep(.ant-table) {
  font-size: 12px;
}

.connection-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.connection-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: center;
}

.table-cell-input {
  width: 100%;
}
</style>
