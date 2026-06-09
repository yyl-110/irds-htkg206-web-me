<template>
  <div class="reinforced-frame-page">
    <section class="reinforced-frame-page__form">
      <div class="reinforced-frame-page__form-header">
        <span class="reinforced-frame-page__title">设计输入：</span>
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </div>
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="reinforced-frame-page__form-grid">
          <div class="reinforced-frame-page__form-col">
            <a-form-item v-for="field in formLeftFields" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>
          <div class="reinforced-frame-page__form-col">
            <a-form-item v-for="field in formRightFields" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </section>

    <section class="reinforced-frame-page__table">
      <div class="reinforced-frame-page__table-header">
        <span class="reinforced-frame-page__title">外加强框设计：</span>
        <a-space :size="12">
          <a-button type="primary" :disabled="outerAssemblingFlag" @click="handleOuterAssemble">
            <template #icon><BuildOutlined /></template>
            装配
          </a-button>
          <a-button type="primary" :disabled="outerAssemblingFlag" @click="handleOuterRegenModel">
            <template #icon><ReloadOutlined /></template>
            再生模型
          </a-button>
          <a-button type="primary" danger :disabled="outerRowFlag" @click="handleDeleteOuterRows">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="outerTableColumns"
        :data-source="outerRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="frameRowKey"
        :row-selection="outerRowSelection"
        class="reinforced-frame-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveOuterColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveOuterColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>
          <template v-else-if="resolveOuterColumn(column)?.cellMode === 'editable'">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>

    <section class="reinforced-frame-page__table">
      <div class="reinforced-frame-page__table-header">
        <span class="reinforced-frame-page__title">内加强框设计：</span>
        <a-space :size="12">
          <a-button type="primary" :disabled="innerAssemblingFlag" @click="handleInnerAssemble">
            <template #icon><BuildOutlined /></template>
            装配
          </a-button>
          <a-button type="primary" :disabled="innerAssemblingFlag" @click="handleInnerRegenModel">
            <template #icon><ReloadOutlined /></template>
            再生模型
          </a-button>
          <a-button type="primary" danger :disabled="innerRowFlag" @click="handleDeleteInnerRows">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="innerTableColumns"
        :data-source="innerRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="frameRowKey"
        :row-selection="innerRowSelection"
        class="reinforced-frame-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveInnerColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolveInnerColumn(column)?.cellMode === 'number'">
            <a-input-number
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>
          <template v-else-if="resolveInnerColumn(column)?.cellMode === 'editable'">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { BuildOutlined, DeleteOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { isValid } from '@/api/flowData/flowData';
import {
  assembleInnerFrameModule,
  assembleOuterFrameModule,
  regenerateInnerFrameModel,
  regenerateOuterFrameModel,
} from './FS1_5_1_1_6/assemblyOperations';
import { applyFs151_1_6InitData } from './FS1_5_1_1_6/initData';
import { loadFs151_1_6PageParameters } from './FS1_5_1_1_6/loadPageParameters';
import {
  createDefaultFs151_1_6ParameterList,
  getInnerFrameRows,
  getOuterFrameRows,
  NUMERIC_REG,
  type Fs151_1_6ParameterItem,
  type ReinforcedFrameRow,
} from './FS1_5_1_1_6/parameterDefaults';
import { deleteInnerFrameRows, deleteOuterFrameRows, extractFs151_1_6SaveParamValues } from './FS1_5_1_1_6/rowOperations';
import {
  FORM_LEFT_FIELDS,
  FORM_RIGHT_FIELDS,
  INNER_FRAME_COLUMN_MAP,
  INNER_FRAME_TABLE_COLUMNS,
  OUTER_FRAME_COLUMN_MAP,
  OUTER_FRAME_TABLE_COLUMNS,
  type FrameAntColumn,
} from './FS1_5_1_1_6/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1_6' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_6ParameterItem[];
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
const tabHeight = 220;
const formLabelCol = { style: { width: '130px' } };
const outerTableColumns = OUTER_FRAME_TABLE_COLUMNS;
const innerTableColumns = INNER_FRAME_TABLE_COLUMNS;
const formLeftFields = FORM_LEFT_FIELDS;
const formRightFields = FORM_RIGHT_FIELDS;

const outerSelectedRowKeys = ref<Key[]>([]);
const outerSelectedRows = ref<ReinforcedFrameRow[]>([]);
const innerSelectedRowKeys = ref<Key[]>([]);
const innerSelectedRows = ref<ReinforcedFrameRow[]>([]);

function cloneParameterList(source: Fs151_1_6ParameterItem[]): Fs151_1_6ParameterItem[] {
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

function createInitialParameterList(): Fs151_1_6ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_6ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_6ParameterItem[]>(createInitialParameterList());
const outerRows = computed(() => getOuterFrameRows(parameterTempList.value));
const innerRows = computed(() => getInnerFrameRows(parameterTempList.value));
const outerRowFlag = computed(() => outerSelectedRows.value.length <= 0);
const innerRowFlag = computed(() => innerSelectedRows.value.length <= 0);
const outerAssemblingFlag = computed(() => outerSelectedRows.value.length !== 1);
const innerAssemblingFlag = computed(() => innerSelectedRows.value.length !== 1);

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      applyFs151_1_6InitData(parameterTempList.value);
    }
  },
  { deep: true },
);

const outerRowSelection = computed(() => ({
  selectedRowKeys: outerSelectedRowKeys.value,
  onChange: (keys: Key[], rows: ReinforcedFrameRow[]) => {
    outerSelectedRowKeys.value = keys;
    outerSelectedRows.value = rows;
  },
}));

const innerRowSelection = computed(() => ({
  selectedRowKeys: innerSelectedRowKeys.value,
  onChange: (keys: Key[], rows: ReinforcedFrameRow[]) => {
    innerSelectedRowKeys.value = keys;
    innerSelectedRows.value = rows;
  },
}));

function resolveOuterColumn(column: { dataIndex?: string | number }): FrameAntColumn | undefined {
  return OUTER_FRAME_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function resolveInnerColumn(column: { dataIndex?: string | number }): FrameAntColumn | undefined {
  return INNER_FRAME_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function frameRowKey(record: ReinforcedFrameRow, index?: number) {
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

function handleNumberBlur(record: ReinforcedFrameRow, field: string, event: FocusEvent) {
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
  const ok = applyFs151_1_6InitData(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面已保存');
    return;
  }
  setSaveBtnEnable();
}

function getSingleSelectedRow(rows: ReinforcedFrameRow[]): ReinforcedFrameRow | null {
  if (rows.length <= 0) {
    message.info('请选择模型');
    return null;
  }
  if (rows.length > 1) {
    message.info('请只选择一个模型');
    return null;
  }
  return rows[0];
}

async function handleOuterAssemble() {
  const row = getSingleSelectedRow(outerSelectedRows.value);
  if (!row) return;
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const result = await assembleOuterFrameModule(instance, row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function handleOuterRegenModel() {
  const row = getSingleSelectedRow(outerSelectedRows.value);
  if (!row) return;

  const result = await regenerateOuterFrameModel(row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function handleInnerAssemble() {
  const row = getSingleSelectedRow(innerSelectedRows.value);
  if (!row) return;
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const result = await assembleInnerFrameModule(instance, row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function handleInnerRegenModel() {
  const row = getSingleSelectedRow(innerSelectedRows.value);
  if (!row) return;

  const result = await regenerateInnerFrameModel(row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

function handleDeleteOuterRows() {
  if (!isValid(outerSelectedRows.value) || outerSelectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteOuterFrameRows(parameterTempList.value, outerSelectedRows.value);
  outerSelectedRowKeys.value = [];
  outerSelectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteInnerRows() {
  if (!isValid(innerSelectedRows.value) || innerSelectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteInnerFrameRows(parameterTempList.value, innerSelectedRows.value);
  innerSelectedRowKeys.value = [];
  innerSelectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) {
    applyFs151_1_6InitData(parameterTempList.value);
    return;
  }
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadFs151_1_6PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractFs151_1_6SaveParamValues(parameterTempList.value);
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
.reinforced-frame-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.reinforced-frame-page__title {
  font-size: 15px;
  font-weight: 600;
}

.reinforced-frame-page__form-header,
.reinforced-frame-page__table-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.reinforced-frame-page__form-grid {
  display: flex;
  gap: 60px;
  padding: 20px 15px 0;
}

.reinforced-frame-page__form-col {
  flex: 1;
  min-width: 280px;
}

.reinforced-frame-page__table {
  margin-top: 16px;
}

.field-input {
  width: 100px;
}

.reinforced-frame-table {
  width: 100%;
}

.reinforced-frame-table :deep(.ant-table) {
  font-size: 12px;
}

.reinforced-frame-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.reinforced-frame-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: left;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: left;
}
</style>
