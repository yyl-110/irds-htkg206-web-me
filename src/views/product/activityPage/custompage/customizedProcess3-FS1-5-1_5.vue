<template>
  <div class="skin-page">
    <section class="skin-section">
      <div class="skin-section__header">
        <span class="skin-section__title">外蒙皮加强段：</span>
        <a-space :size="12">
          <a-button type="primary" @click="handleAddOuterRow">
            <template #icon><PlusOutlined /></template>
            添加行
          </a-button>
          <a-button type="primary" danger :disabled="outerRowFlag" @click="handleDeleteOuterRows">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="outerRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="skinRowKey"
        :row-selection="outerRowSelection"
        class="skin-table">
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
          <template v-else-if="resolveColumn(column)?.cellMode === 'required'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @blur="handleRequiredBlur(record, String(column.dataIndex), resolveColumn(column)?.requiredMessage, $event)"
              @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>
    </section>

    <section class="skin-section">
      <div class="skin-section__header">
        <span class="skin-section__title">内蒙皮加强段：</span>
        <a-space :size="12">
          <a-button type="primary" @click="handleAddInnerRow">
            <template #icon><PlusOutlined /></template>
            添加行
          </a-button>
          <a-button type="primary" danger :disabled="innerRowFlag" @click="handleDeleteInnerRows">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除
          </a-button>
        </a-space>
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="innerRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: tabHeight, x: 'max-content' }"
        :row-key="skinRowKey"
        :row-selection="innerRowSelection"
        class="skin-table">
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
          <template v-else-if="resolveColumn(column)?.cellMode === 'required'">
            <a-input
              v-model:value="record[String(column.dataIndex)]"
              class="table-cell-input"
              @blur="handleRequiredBlur(record, String(column.dataIndex), resolveColumn(column)?.requiredMessage, $event)"
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
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { isValid } from '@/api/flowData/flowData';
import { loadFs151_5PageParameters } from './FS1_5_1_5/loadPageParameters';
import {
  createDefaultFs151_5ParameterList,
  getInnerSkinRows,
  getOuterSkinRows,
  NUMERIC_REG,
  type Fs151_5ParameterItem,
  type SkinSegmentRow,
} from './FS1_5_1_5/parameterDefaults';
import {
  addInnerSkinRow,
  addOuterSkinRow,
  deleteInnerSkinRows,
  deleteOuterSkinRows,
  extractFs151_5SaveParamValues,
} from './FS1_5_1_5/rowOperations';
import { SKIN_SEGMENT_COLUMN_MAP, SKIN_SEGMENT_TABLE_COLUMNS, type SkinAntColumn } from './FS1_5_1_5/tableColumns';

defineOptions({ name: 'rx-customizedProcess3-FS1-5-1_5' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_5ParameterItem[];
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
const tabHeight = 280;
const tableColumns = SKIN_SEGMENT_TABLE_COLUMNS;

const outerSelectedRowKeys = ref<Key[]>([]);
const outerSelectedRows = ref<SkinSegmentRow[]>([]);
const innerSelectedRowKeys = ref<Key[]>([]);
const innerSelectedRows = ref<SkinSegmentRow[]>([]);

function cloneParameterList(source: Fs151_5ParameterItem[]): Fs151_5ParameterItem[] {
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

function createInitialParameterList(): Fs151_5ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_5ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_5ParameterItem[]>(createInitialParameterList());
const outerRows = computed(() => getOuterSkinRows(parameterTempList.value));
const innerRows = computed(() => getInnerSkinRows(parameterTempList.value));
const outerRowFlag = computed(() => outerSelectedRows.value.length <= 0);
const innerRowFlag = computed(() => innerSelectedRows.value.length <= 0);

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
    }
  },
  { deep: true },
);

const outerRowSelection = computed(() => ({
  selectedRowKeys: outerSelectedRowKeys.value,
  onChange: (keys: Key[], rows: SkinSegmentRow[]) => {
    outerSelectedRowKeys.value = keys;
    outerSelectedRows.value = rows;
  },
}));

const innerRowSelection = computed(() => ({
  selectedRowKeys: innerSelectedRowKeys.value,
  onChange: (keys: Key[], rows: SkinSegmentRow[]) => {
    innerSelectedRowKeys.value = keys;
    innerSelectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): SkinAntColumn | undefined {
  return SKIN_SEGMENT_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function skinRowKey(record: SkinSegmentRow, index?: number) {
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

function handleNumberBlur(record: SkinSegmentRow, field: string, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (value && !NUMERIC_REG.test(value)) {
    message.error('请输入数字');
    return;
  }
  record[field] = value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleRequiredBlur(record: SkinSegmentRow, field: string, errorMessage: string | undefined, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (!value.trim()) {
    message.error(errorMessage ?? '请输入内容');
    return;
  }
  record[field] = value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleAddOuterRow() {
  addOuterSkinRow(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteOuterRows() {
  if (!isValid(outerSelectedRows.value) || outerSelectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteOuterSkinRows(parameterTempList.value, outerSelectedRows.value);
  outerSelectedRowKeys.value = [];
  outerSelectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleAddInnerRow() {
  addInnerSkinRow(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteInnerRows() {
  if (!isValid(innerSelectedRows.value) || innerSelectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteInnerSkinRows(parameterTempList.value, innerSelectedRows.value);
  innerSelectedRowKeys.value = [];
  innerSelectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadFs151_5PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {});
}

function getCurrentSaveParamValues() {
  return extractFs151_5SaveParamValues(parameterTempList.value);
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
.skin-page {
  padding: 20px 10px 24px;
  min-height: 680px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.skin-section {
  margin-bottom: 16px;
}

.skin-section__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.skin-section__title {
  font-size: 15px;
  font-weight: 600;
}

.skin-table {
  width: 100%;
}

.skin-table :deep(.ant-table) {
  font-size: 12px;
}

.skin-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.skin-table :deep(.ant-table-tbody > tr > td) {
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
