<template>
  <div class="load-page">
    <div class="load-page__title">负载设备用电分析</div>

    <div class="load-page__toolbar">
      <a-space :size="12" wrap>
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger :disabled="rowFlag" @click="handleDeleteRow">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除行
        </a-button>
        <a-button type="primary" @click="openAddColumnModal">
          <template #icon><PlusOutlined /></template>
          添加列
        </a-button>
        <a-button type="primary" danger @click="openDeleteColumnModal">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除列
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="loadTableColumns"
      :data-source="loadRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ x: 'max-content' }"
      :row-key="loadRowKey"
      :row-selection="loadRowSelection"
      class="load-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveLoadColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveLoadColumn(column)?.cellMode === 'select'">
          <a-select
            v-model:value="record.p2"
            class="table-cell-select"
            :options="powerTypeOptions"
            allow-clear
            @change="setSaveBtnEnable()" />
        </template>
        <template v-else-if="resolveLoadColumn(column)?.cellMode === 'number'">
          <a-input-number
            v-model:value="record[String(column.dataIndex)]"
            type="number"
            class="table-cell-input"
            @input="setSaveBtnEnable()" />
        </template>
        <template v-else-if="resolveLoadColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
        </template>
      </template>

      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="0" />
            <a-table-summary-cell
              v-for="(leaf, cellIndex) in loadLeafColumns"
              :key="String(leaf.dataIndex)"
              :index="cellIndex + 1"
              align="center">
              {{ summaryValues[String(leaf.dataIndex)] ?? '' }}
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>

    <div class="load-page__subtitle">用电设备等级</div>
    <a-table
      :columns="gradeTableColumns"
      :data-source="gradeRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: 450, x: 'max-content' }"
      :row-key="gradeRowKey"
      class="grade-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveGradeColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveGradeColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:visible="addColumnVisible"
      title="设置列名"
      :mask-closable="true"
      :width="420"
      @cancel="closeAddColumnModal">
      <div class="modal-field">
        <span>新列名称:</span>
        <a-input v-model:value="newColumnName" class="modal-field__input" />
      </div>
      <template #footer>
        <a-button type="primary" @click="confirmAddColumn">确定</a-button>
        <a-button @click="closeAddColumnModal">取消</a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="deleteColumnVisible"
      title="删除列"
      :mask-closable="true"
      :width="320"
      @cancel="closeDeleteColumnModal">
      <div class="delete-col-list">
        <a-checkbox
          v-for="item in deleteColumnCandidates"
          :key="item.field"
          v-model:checked="item.check"
          class="delete-col-list__item">
          {{ item.title }}
        </a-checkbox>
      </div>
      <template #footer>
        <a-button type="primary" @click="confirmDeleteColumns">确定</a-button>
        <a-button @click="closeDeleteColumnModal">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { message } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { isValid } from '@/api/flowData/flowData';
import { buildLoadTableSummary } from './ZT1_5_3_2A/calculations';
import { loadZt1_532APageParameters, resolveConditionColumns } from './ZT1_5_3_2A/loadPageParameters';
import {
  createDefaultZt1_532AParameterList,
  getGradeRows,
  getLoadRows,
  getRemarkField,
  POWER_TYPE_OPTIONS,
  syncTableHeaderMetadata,
  type ConditionColumnDef,
  type LoadAnalysisRow,
  type Zt1_532AParameterItem,
} from './ZT1_5_3_2A/parameterDefaults';
import {
  addConditionColumn,
  addLoadRow,
  deleteConditionColumns,
  deleteLoadRows,
  extractZt1_532ASaveParamValues,
} from './ZT1_5_3_2A/rowOperations';
import {
  buildLoadTableColumns,
  flattenLoadLeafColumns,
  GRADE_LEAF_COLUMN_MAP,
  GRADE_TABLE_COLUMNS,
  type LoadAntColumn,
} from './ZT1_5_3_2A/tableColumns';

defineOptions({ name: 'rx-customizedProcess1-ZT1_5_3_2A' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_532AParameterItem[];
  }>(),
  {
    checkId: '',
    categoryId: '',
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

const powerTypeOptions = POWER_TYPE_OPTIONS;
const gradeTableColumns = GRADE_TABLE_COLUMNS;

const conditionColumns = ref<ConditionColumnDef[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<LoadAnalysisRow[]>([]);
const addColumnVisible = ref(false);
const deleteColumnVisible = ref(false);
const newColumnName = ref('');
const deleteColumnCandidates = ref<Array<ConditionColumnDef & { check: boolean }>>([]);

function cloneParameterList(source: Zt1_532AParameterItem[]): Zt1_532AParameterItem[] {
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

function createInitialParameterList(): Zt1_532AParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_532AParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_532AParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadZt1_532APageParameters,
  });

const remarkField = computed(() => getRemarkField(conditionColumns.value.length));
const loadTableColumns = computed(() => buildLoadTableColumns(conditionColumns.value, remarkField.value));
const loadLeafColumns = computed(() => flattenLoadLeafColumns(loadTableColumns.value));
const loadLeafColumnMap = computed(() => new Map(loadLeafColumns.value.map(col => [String(col.dataIndex), col])));
const loadRows = computed(() => getLoadRows(parameterTempList.value));
const gradeRows = computed(() => getGradeRows(parameterTempList.value));
const rowFlag = computed(() => selectedRows.value.length <= 0);
const summaryValues = computed(() =>
  buildLoadTableSummary(
    loadRows.value,
    conditionColumns.value.map(col => col.field),
    remarkField.value,
  ),
);

const loadRowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: LoadAnalysisRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveLoadColumn(column: { dataIndex?: string | number }): LoadAntColumn | undefined {
  return loadLeafColumnMap.value.get(String(column.dataIndex ?? ''));
}

function resolveGradeColumn(column: { dataIndex?: string | number }): LoadAntColumn | undefined {
  return GRADE_LEAF_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function loadRowKey(record: LoadAnalysisRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.delIndex ?? record.p0 ?? index ?? '');
}

function gradeRowKey(record: { p0?: string | number }, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  syncTableHeaderMetadata(parameterTempList.value, conditionColumns.value);
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

function handleAddRow() {
  addLoadRow(parameterTempList.value, conditionColumns.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!isValid(selectedRows.value) || selectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteLoadRows(parameterTempList.value, selectedRows.value);
  selectedRowKeys.value = [];
  selectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function openAddColumnModal() {
  newColumnName.value = '';
  addColumnVisible.value = true;
}

function closeAddColumnModal() {
  addColumnVisible.value = false;
  newColumnName.value = '';
}

function confirmAddColumn() {
  const title = newColumnName.value.trim();
  if (!title) {
    message.info('请输入列名');
    return;
  }
  conditionColumns.value = addConditionColumn(parameterTempList.value, conditionColumns.value, title);
  parameterTempList.value = [...parameterTempList.value];
  closeAddColumnModal();
  setSaveBtnEnable();
}

function openDeleteColumnModal() {
  deleteColumnCandidates.value = conditionColumns.value.map(col => ({
    ...col,
    check: false,
  }));
  deleteColumnVisible.value = true;
}

function closeDeleteColumnModal() {
  deleteColumnVisible.value = false;
  deleteColumnCandidates.value = [];
}

function confirmDeleteColumns() {
  const selectedTitles = deleteColumnCandidates.value.filter(item => item.check).map(item => item.title);
  if (selectedTitles.length <= 0) {
    message.info('请选择要删除的列');
    return;
  }
  conditionColumns.value = deleteConditionColumns(parameterTempList.value, conditionColumns.value, selectedTitles);
  parameterTempList.value = [...parameterTempList.value];
  closeDeleteColumnModal();
  setSaveBtnEnable();
}

function rebuildColumnsFromHeader() {
  conditionColumns.value = resolveConditionColumns(parameterTempList.value);
  syncTableHeaderMetadata(parameterTempList.value, conditionColumns.value);
}


function updateEl() {
  nextTick(() => {

    rebuildColumnsFromHeader();
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractZt1_532ASaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  rebuildColumnsFromHeader();
});
</script>

<style scoped>
.load-page {
  padding: 0 10px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.load-page__title {
  margin-top: 20px;
  padding-bottom: 8px;
  width: 200px;
  /* border-bottom: 1px solid silver; */
  font-size: 15px;
  font-weight: 600;
}

.load-page__subtitle {
  margin: 30px 0 12px 10px;
  font-size: 15px;
  font-weight: 600;
}

.load-page__toolbar {
  margin: 20px 0 12px 10px;
}

.load-table,
.grade-table {
  margin-left: 10px;
}

.load-table :deep(.ant-table),
.grade-table :deep(.ant-table) {
  font-size: 12px;
}

.load-table :deep(.ant-table-thead > tr > th),
.grade-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.load-table :deep(.ant-table-tbody > tr > td),
.grade-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.load-table :deep(.ant-table-summary > tr > td) {
  padding: 6px 8px;
  text-align: center;
  font-weight: 600;
  background: #fafafa;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

.modal-field {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.modal-field__input {
  width: 200px;
}

.delete-col-list {
  max-height: 200px;
  overflow: auto;
  padding-left: 20px;
}

.delete-col-list__item {
  display: flex;
  margin-bottom: 8px;
}
</style>
