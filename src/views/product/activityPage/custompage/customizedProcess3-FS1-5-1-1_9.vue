<template>
  <div class="frame-lining-page">
    <section class="frame-lining-page__form">
      <div class="frame-lining-page__section-header">
        <span class="frame-lining-page__title">设计输入：</span>

        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>

          更新数据
        </a-button>
      </div>

      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="frame-lining-page__form-grid">
          <div class="frame-lining-page__form-col">
            <a-form-item v-for="field in formLeftFields" :key="field.index" :label="field.label">
              <a-input
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>

          <div class="frame-lining-page__form-col">
            <a-form-item v-for="field in formRightFields" :key="field.index" :label="field.label">
              <a-input
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

    <section class="frame-lining-page__table">
      <div class="frame-lining-page__section-header">
        <span class="frame-lining-page__title">口框设计：</span>

        <a-space :size="12">
          <a-button type="primary" :disabled="frameAssemblingFlag" @click="handleFrameAssemble">
            <template #icon><BuildOutlined /></template>

            装配
          </a-button>

          <a-button type="primary" :disabled="frameAssemblingFlag" @click="handleFrameRegen">
            <template #icon><ReloadOutlined /></template>

            再生模型
          </a-button>

          <a-button type="primary" danger :disabled="frameDeleteDisabled" @click="handleFrameDelete">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" /> 删除</a-button
          >
        </a-space>
      </div>

      <a-table
        :columns="frameTableColumns"
        :data-source="frameTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tableHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="frameRowSelection"
        class="frame-lining-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveFrameColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>

          <template v-else-if="resolveFrameColumn(column)?.cellMode === 'number'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>

          <template v-else-if="resolveFrameColumn(column)?.cellMode === 'editable'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @blur="setSaveBtnEnable()"
              @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>

    <section class="frame-lining-page__table frame-lining-page__table--lining">
      <div class="frame-lining-page__section-header">
        <span class="frame-lining-page__title">衬板设计：</span>

        <a-space :size="12">
          <a-button type="primary" @click="handleLiningAdd">
            <template #icon><PlusOutlined /></template>

            添加
          </a-button>

          <a-button type="primary" danger :disabled="liningDeleteDisabled" @click="handleLiningDelete">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>

          <a-button type="primary" :disabled="liningAssemblingFlag" @click="handleLiningAssemble">
            <template #icon><BuildOutlined /></template>

            装配
          </a-button>

          <a-button type="primary" :disabled="liningAssemblingFlag" @click="handleLiningRegen">
            <template #icon><ReloadOutlined /></template>

            再生模型
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="liningTableColumns"
        :data-source="liningTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tableHeight, x: 'max-content' }"
        :row-key="tableRowKey"
        :row-selection="liningRowSelection"
        class="frame-lining-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolveLiningColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>

          <template v-else-if="resolveLiningColumn(column)?.cellMode === 'number'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              type="number"
              class="table-cell-input"
              @blur="handleNumberBlur(record, String(column.dataIndex), $event)"
              @input="setSaveBtnEnable()" />
          </template>

          <template v-else-if="resolveLiningColumn(column)?.cellMode === 'editable'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @blur="setSaveBtnEnable()"
              @input="setSaveBtnEnable()" />
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

import { BuildOutlined, PlusOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons-vue';

import type { Key } from 'ant-design-vue/es/table/interface';

import { EpcIcon } from '@/components/icon/EpcIcon';

import {
  assembleFrameModule,
  assembleLiningModule,
  regenerateFrameModel,
  regenerateLiningModel,
} from './FS1_5_1_1_9/assemblyOperations';

import { applyFs151_1_9InitData } from './FS1_5_1_1_9/initData';

import { extractFs151_1_9SaveParamValues, loadFs151_1_9PageParameters } from './FS1_5_1_1_9/loadPageParameters';

import {
  addLiningRow,
  createDefaultFs151_1_9ParameterList,
  deleteSelectedRows,
  getFrameTableRows,
  getLiningTableRows,
  NUMERIC_REG,
  setFrameTableRows,
  setLiningTableRows,
  type FrameDesignRow,
  type Fs151_1_9ParameterItem,
  type LiningDesignRow,
} from './FS1_5_1_1_9/parameterDefaults';

import {
  FORM_LEFT_FIELDS,
  FORM_RIGHT_FIELDS,
  FRAME_COLUMN_MAP,
  FRAME_TABLE_COLUMNS,
  LINING_COLUMN_MAP,
  LINING_TABLE_COLUMNS,
  type DesignAntColumn,
} from './FS1_5_1_1_9/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1_9' });

const props = withDefaults(
  defineProps<{
    width?: number;

    modalFlag?: boolean;

    pageid?: string;

    parameterTempList?: Fs151_1_9ParameterItem[];
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

const tableHeight = 220;

const formLabelCol = { style: { width: '110px' } };

const frameTableColumns = FRAME_TABLE_COLUMNS;

const liningTableColumns = LINING_TABLE_COLUMNS;

const formLeftFields = FORM_LEFT_FIELDS;

const formRightFields = FORM_RIGHT_FIELDS;

const frameSelectedRowKeys = ref<Key[]>([]);

const frameSelectedRows = ref<FrameDesignRow[]>([]);

const liningSelectedRowKeys = ref<Key[]>([]);

const liningSelectedRows = ref<LiningDesignRow[]>([]);

function cloneParameterList(source: Fs151_1_9ParameterItem[]): Fs151_1_9ParameterItem[] {
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

function createInitialParameterList(): Fs151_1_9ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_9ParameterList(props.pageid);
  }

  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_9ParameterItem[]>(createInitialParameterList());

const frameTableRows = computed(() => getFrameTableRows(parameterTempList.value));

const liningTableRows = computed(() => getLiningTableRows(parameterTempList.value));

const frameAssemblingFlag = computed(() => frameSelectedRows.value.length !== 1);

const liningAssemblingFlag = computed(() => liningSelectedRows.value.length !== 1);

const frameDeleteDisabled = computed(() => frameSelectedRows.value.length <= 0);

const liningDeleteDisabled = computed(() => liningSelectedRows.value.length <= 0);

watch(
  () => props.parameterTempList,

  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);

      applyFs151_1_9InitData(parameterTempList.value);
    }
  },

  { deep: true },
);

const frameRowSelection = computed(() => ({
  selectedRowKeys: frameSelectedRowKeys.value,

  onChange: (keys: Key[], rows: FrameDesignRow[]) => {
    frameSelectedRowKeys.value = keys;

    frameSelectedRows.value = rows;
  },
}));

const liningRowSelection = computed(() => ({
  selectedRowKeys: liningSelectedRowKeys.value,

  onChange: (keys: Key[], rows: LiningDesignRow[]) => {
    liningSelectedRowKeys.value = keys;

    liningSelectedRows.value = rows;
  },
}));

function resolveFrameColumn(column: { dataIndex?: string | number }): DesignAntColumn | undefined {
  return FRAME_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function resolveLiningColumn(column: { dataIndex?: string | number }): DesignAntColumn | undefined {
  return LINING_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: FrameDesignRow | LiningDesignRow, index?: number) {
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

function handleNumberBlur(record: FrameDesignRow | LiningDesignRow, field: string, event: FocusEvent) {
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
  const ok = applyFs151_1_9InitData(parameterTempList.value);

  parameterTempList.value = [...parameterTempList.value];

  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面 FS1-5-1F 已保存');

    return;
  }

  setSaveBtnEnable();
}

function getSingleFrameRow(): FrameDesignRow | null {
  if (frameSelectedRows.value.length <= 0) {
    message.info('请选择模型');

    return null;
  }

  if (frameSelectedRows.value.length > 1) {
    message.info('请只选择一个模型');

    return null;
  }

  return frameSelectedRows.value[0];
}

function getSingleLiningRow(): LiningDesignRow | null {
  if (liningSelectedRows.value.length <= 0) {
    message.info('请选择模型');

    return null;
  }

  if (liningSelectedRows.value.length > 1) {
    message.info('请只选择一个模型');

    return null;
  }

  return liningSelectedRows.value[0];
}

async function handleAssemblyResult(result: { ok: boolean; message?: string }) {
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');

    return;
  }

  setSaveBtnEnable();
}

async function handleFrameAssemble() {
  const row = getSingleFrameRow();

  if (!row) return;

  const instance = getCurrentInstance()?.proxy;

  if (!instance) return;

  await handleAssemblyResult(await assembleFrameModule(instance, row));
}

async function handleFrameRegen() {
  const row = getSingleFrameRow();

  if (!row) return;

  await handleAssemblyResult(await regenerateFrameModel(row));
}

async function handleLiningAssemble() {
  const row = getSingleLiningRow();

  if (!row) return;

  const instance = getCurrentInstance()?.proxy;

  if (!instance) return;

  await handleAssemblyResult(await assembleLiningModule(instance, row));
}

async function handleLiningRegen() {
  const row = getSingleLiningRow();

  if (!row) return;

  await handleAssemblyResult(await regenerateLiningModel(row));
}

function handleFrameDelete() {
  const rows = deleteSelectedRows(getFrameTableRows(parameterTempList.value), frameSelectedRows.value);

  setFrameTableRows(parameterTempList.value, rows);

  frameSelectedRowKeys.value = [];

  frameSelectedRows.value = [];

  parameterTempList.value = [...parameterTempList.value];

  setSaveBtnEnable();
}

function handleLiningAdd() {
  addLiningRow(parameterTempList.value);

  parameterTempList.value = [...parameterTempList.value];

  setSaveBtnEnable();
}

function handleLiningDelete() {
  const rows = deleteSelectedRows(getLiningTableRows(parameterTempList.value), liningSelectedRows.value);

  setLiningTableRows(parameterTempList.value, rows);

  liningSelectedRowKeys.value = [];

  liningSelectedRows.value = [];

  parameterTempList.value = [...parameterTempList.value];

  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) {
    applyFs151_1_9InitData(parameterTempList.value);

    return;
  }

  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();

  if (!pageId) return;

  parameterTempList.value = await loadFs151_1_9PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractFs151_1_9SaveParamValues(parameterTempList.value);
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
.frame-lining-page {
  padding: 20px 10px 24px;

  min-height: 650px;

  background: #fff;

  box-sizing: border-box;

  text-align: left;
}

.frame-lining-page__title {
  font-size: 15px;

  font-weight: 600;
}

.frame-lining-page__section-header {
  display: flex;

  align-items: center;

  gap: 20px;

  margin-bottom: 12px;

  padding-left: 10px;
}

.frame-lining-page__form-grid {
  display: flex;

  gap: 60px;

  padding: 20px 15px 0;
}

.frame-lining-page__form-col {
  flex: 1;

  min-width: 280px;
}

.frame-lining-page__table {
  margin-top: 16px;
}

.frame-lining-page__table--lining {
  margin-top: 8px;
}

.field-input {
  width: 100px;
}

.frame-lining-table {
  width: 100%;
}

.frame-lining-table :deep(.ant-table) {
  font-size: 12px;
}

.frame-lining-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;

  text-align: left;

  background: #fafafa;
}

.frame-lining-table :deep(.ant-table-tbody > tr > td) {
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
