<template>
  <div class="outer-skin-page">
    <section class="outer-skin-page__form">
      <div class="outer-skin-page__form-header">
        <span class="outer-skin-page__title">设计输入：</span>
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </div>
      <a-form label-align="left" :colon="false" :label-col="formLabelCol">
        <div class="outer-skin-page__form-grid">
          <div class="outer-skin-page__form-col">
            <a-form-item v-for="field in formLeftFields" :key="field.index" :label="field.label">
              <a-input-number
                v-model:value="parameterTempList[field.index].defaultValue"
                type="number"
                class="field-input"
                disabled
                style="width: 200px" />
            </a-form-item>
          </div>
          <div class="outer-skin-page__form-col">
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

    <section class="outer-skin-page__table">
      <div class="outer-skin-page__table-header">
        <span class="outer-skin-page__title">外蒙皮加强段设计：</span>
        <a-space :size="12">
          <a-button type="primary" @click="handleCalculation">
            <template #icon><CalculatorOutlined /></template>
            计算
          </a-button>
          <a-button type="primary" :disabled="assemblingFlag" @click="handleAssembleModule">
            <template #icon><BuildOutlined /></template>
            装配
          </a-button>
          <a-button type="primary" :disabled="assemblingFlag" @click="handleRegenModel">
            <template #icon><ReloadOutlined /></template>
            再生模型
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
        class="outer-skin-table">
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
          <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
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
import { BuildOutlined, CalculatorOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { assembleOuterSkinModule, regenerateOuterSkinModel } from './FS1_5_1_1_2/assemblyOperations';
import { runOuterSkinDesignCalculation } from './FS1_5_1_1_2/calculation';
import { applyFs151_1_2InitData } from './FS1_5_1_1_2/initData';
import { extractFs151_1_2SaveParamValues, loadFs151_1_2PageParameters } from './FS1_5_1_1_2/loadPageParameters';
import {
  createDefaultFs151_1_2ParameterList,
  getDesignTableRows,
  NUMERIC_REG,
  type Fs151_1_2ParameterItem,
  type OuterSkinDesignRow,
} from './FS1_5_1_1_2/parameterDefaults';
import {
  FORM_LEFT_FIELDS,
  FORM_RIGHT_FIELDS,
  OUTER_SKIN_DESIGN_COLUMN_MAP,
  OUTER_SKIN_DESIGN_TABLE_COLUMNS,
  type DesignAntColumn,
} from './FS1_5_1_1_2/tableColumns';

defineOptions({ name: 'customizedProcess3-FS1-5-1-1_2' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_1_2ParameterItem[];
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
const tabHeight = 400;
const formLabelCol = { style: { width: '130px' } };
const tableColumns = OUTER_SKIN_DESIGN_TABLE_COLUMNS;
const formLeftFields = FORM_LEFT_FIELDS;
const formRightFields = FORM_RIGHT_FIELDS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<OuterSkinDesignRow[]>([]);

function cloneParameterList(source: Fs151_1_2ParameterItem[]): Fs151_1_2ParameterItem[] {
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

function createInitialParameterList(): Fs151_1_2ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_1_2ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_1_2ParameterItem[]>(createInitialParameterList());
const tableRows = computed(() => getDesignTableRows(parameterTempList.value));
const assemblingFlag = computed(() => selectedRows.value.length !== 1);

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      applyFs151_1_2InitData(parameterTempList.value);
    }
  },
  { deep: true },
);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: OuterSkinDesignRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): DesignAntColumn | undefined {
  return OUTER_SKIN_DESIGN_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: OuterSkinDesignRow, index?: number) {
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

function handleNumberBlur(record: OuterSkinDesignRow, field: string, event: FocusEvent) {
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
  const ok = applyFs151_1_2InitData(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  if (!ok) {
    message.warning('未能从流程上下文读取数据，请确认前置页面 FS1-5-1_5 已保存');
    return;
  }
  setSaveBtnEnable();
}

function handleCalculation() {
  runOuterSkinDesignCalculation(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function getSingleSelectedRow(): OuterSkinDesignRow | null {
  if (selectedRows.value.length <= 0) {
    message.info('请选择模型');
    return null;
  }
  if (selectedRows.value.length > 1) {
    message.info('请只选择一个模型');
    return null;
  }
  return selectedRows.value[0];
}

async function handleAssembleModule() {
  const row = getSingleSelectedRow();
  if (!row) return;
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const result = await assembleOuterSkinModule(instance, row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function handleRegenModel() {
  const row = getSingleSelectedRow();
  if (!row) return;

  const result = await regenerateOuterSkinModel(row);
  if (!result.ok) {
    if (result.message?.includes('模型号')) message.warning(result.message);
    else if (result.message) message.error(result.message);
    else message.info(result.message ?? '操作失败');
    return;
  }
  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) {
    applyFs151_1_2InitData(parameterTempList.value);
    return;
  }
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadFs151_1_2PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractFs151_1_2SaveParamValues(parameterTempList.value);
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
.outer-skin-page {
  padding: 20px 10px 24px;
  min-height: 650px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.outer-skin-page__title {
  font-size: 15px;
  font-weight: 600;
}

.outer-skin-page__form-header,
.outer-skin-page__table-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.outer-skin-page__form-grid {
  display: flex;
  gap: 60px;
  padding: 20px 15px 0;
}

.outer-skin-page__form-col {
  flex: 1;
  min-width: 280px;
}

.outer-skin-page__table {
  margin-top: 16px;
}

.field-input {
  width: 100px;
}

.outer-skin-table {
  width: 100%;
}

.outer-skin-table :deep(.ant-table) {
  font-size: 12px;
}

.outer-skin-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.outer-skin-table :deep(.ant-table-tbody > tr > td) {
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
