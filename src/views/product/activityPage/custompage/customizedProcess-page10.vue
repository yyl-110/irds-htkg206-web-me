<template>
  <div class="page10">
    <div class="page10-header">
      <div class="page10-title">所有角度性能校核计算：</div>
      <!-- <a-space :size="12" class="page10-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </a-space> -->
    </div>

    <div class="page10-scheme-wrap">
      <a-table
        :columns="schemeTableColumns"
        :data-source="schemeTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: schemeTabHeight, x: schemeTableScrollX }"
        :row-key="schemeRowKey"
        :row-selection="schemeRowSelection"
        class="page10-table" />
    </div>

    <div class="page10-detail">
      <div class="page10-detail__title">{{ programmeTitle }}</div>
      <div class="page10-toolbar">
        <span class="page10-toolbar__label">传动效率:</span>
        <a-input
          v-model:value="efficiencyValue"
          allow-clear
          class="page10-toolbar__input"
          @input="handleEfficiencyChange" />
        <a-button type="primary" @click="openImportModal">
          <template #icon><ImportOutlined /></template>
          导入
        </a-button>
        <a-button type="primary" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </div>

      <div class="page10-degree-wrap">
        <a-table
          :columns="degreeTableColumns"
          :data-source="degreeTableRows"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: degreeTabHeight, x: degreeTableScrollX }"
          :row-key="degreeRowKey"
          class="page10-table">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.cellMode === 'editable' || resolveDegreeColumn(column)?.cellMode === 'editable'">
              <a-input-number
                v-model:value="record[String(column.dataIndex)]"
                type="number"
                class="table-cell-input"
                @input="onDegreeCellInput(record, index, String(column.dataIndex))" />
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <a-modal
      v-model:visible="importModalVisible"
      title="批量上传"
      :mask-closable="false"
      width="600px"
      @ok="closeImportModal"
      @cancel="closeImportModal">
      <div class="import-panel">
        <div class="import-panel__row">
          <span>请选择模板：</span>
          <a-button @click="downloadTemplate">
            <template #icon><DownloadOutlined /></template>
            模板下载
          </a-button>
        </div>
        <div class="import-panel__row">
          <span>请选择附件：</span>
          <a-upload :before-upload="handleExcelBeforeUpload" :show-upload-list="true" accept=".xlsx" :max-count="1">
            <a-button>
              <template #icon><UploadOutlined /></template>
              上传文件
            </a-button>
          </a-upload>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, DownloadOutlined, ImportOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { handleDownloadByFilename } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';
import {
  calculateAllPage10DegreeRows,
  extractPage10SaveParamValues,
  extractPage10TableSavePayload,
} from './page10/calculations';
import { buildDegreeRowsFromImport, readDegreeExcelFile } from './page10/excelImport';
import {
  applyEfficiencyToDegreeRows,
  applyPage10InitData,
  applyPage10SchemeSelection,
  captureAllPage10DegreeTablesEditable,
  captureDegreeEditableValues,
  getDegreeDisplayRows,
  getEfficiencyValue,
  getSchemeTableRows,
  getSelectedRowIndex,
  markPage10DegreeManualEdit,
  restoreAllPage10DegreeTablesEditable,
  restoreDegreeEditableValues,
  setDegreeDisplayRows,
  setEfficiencyValue,
  setSelectedRowIndex,
  syncCalculatedDegreeRowsToSource,
} from './page10/initData';
import { loadPage10PageParameters } from './page10/loadPageParameters';
import {
  createDefaultPage10ParameterList,
  ensurePage10TableComponentIds,
  type Page10DegreeRow,
  type Page10ParameterItem,
  type Page10SchemeRow,
} from './page10/parameterDefaults';
import {
  PAGE10_DEGREE_COLUMNS,
  PAGE10_DEGREE_TABLE_MIN_WIDTH,
  PAGE10_SCHEME_COLUMNS,
  PAGE10_SCHEME_TABLE_MIN_WIDTH,
  isNumericInput,
  type Page10AntColumn,
} from './page10/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page10' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page10ParameterItem[];
    savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null;
    savedTables?: Array<Record<string, unknown>> | null;
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

const hasAutoRefreshed = ref(false);

const route = useRoute();

const userStore = useUserStore();
const schemeTabHeight = 280;
const degreeTabHeight = 420;
const schemeTableScrollX = PAGE10_SCHEME_TABLE_MIN_WIDTH;
const degreeTableScrollX = PAGE10_DEGREE_TABLE_MIN_WIDTH;
const schemeTableColumns = PAGE10_SCHEME_COLUMNS;
const degreeTableColumns = PAGE10_DEGREE_COLUMNS;

const selectedRowKeys = ref<Key[]>([]);
const selectedSchemeRows = ref<Page10SchemeRow[]>([]);
const importModalVisible = ref(false);
const efficiencyValue = ref('0.73');

function clonePage10ParameterList(list: Page10ParameterItem[]): Page10ParameterItem[] {
  return ensurePage10TableComponentIds(
    list.map(item => ({
      ...item,
      tableMap: item.tableMap
        ? {
            ...item.tableMap,
            rowData: item.tableMap.rowData?.map(row => ({ ...row })) ?? [],
          }
        : item.tableMap,
    })),
  );
}

function createInitialParameterList(): Page10ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage10ParameterList(createDefaultPage10ParameterList(props.pageid));
  }
  return clonePage10ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page10ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage10PageParameters,
  cloneItem: clonePage10ParameterList,
});

efficiencyValue.value = getEfficiencyValue(parameterTempList.value);

const schemeTableRows = computed(() => getSchemeTableRows(parameterTempList.value));
const degreeTableRows = computed(() => getDegreeDisplayRows(parameterTempList.value));
const programmeTitle = computed(() => {
  const selected = selectedSchemeRows.value[0];
  return selected?.p0 ? `当前方案：${selected.p0}` : '请选择组合方案';
});

function schemeRowKey(record: Page10SchemeRow, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function degreeRowKey(record: Page10DegreeRow, index?: number) {
  return `${record.p0 ?? 'row'}-${index ?? ''}`;
}

function resolveDegreeColumn(column: Page10AntColumn): Page10AntColumn | undefined {
  return PAGE10_DEGREE_COLUMNS.find(col => col.dataIndex === column.dataIndex);
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

function restoreSelectionFromParam() {
  const selIndex = getSelectedRowIndex(parameterTempList.value);
  const rows = getSchemeTableRows(parameterTempList.value);
  if (selIndex >= 0 && selIndex < rows.length) {
    const row = rows[selIndex];
    selectedSchemeRows.value = [row];
    selectedRowKeys.value = [schemeRowKey(row, selIndex)];
    const degreeRows = applyPage10SchemeSelection(parameterTempList.value, [row]);
    setDegreeDisplayRows(parameterTempList.value, degreeRows);
  }
}

function handleSchemeSelection(_keys: Key[], rows: Page10SchemeRow[]) {
  if (rows.length > 1) {
    message.info('请只选一个方案');
    selectedSchemeRows.value = rows.slice(0, 1);
    selectedRowKeys.value = selectedSchemeRows.value.map(row => schemeRowKey(row));
    return;
  }

  selectedSchemeRows.value = rows;
  selectedRowKeys.value = rows.map(row => schemeRowKey(row));

  if (!rows.length) {
    setDegreeDisplayRows(parameterTempList.value, []);
    return;
  }

  const degreeRows = applyPage10SchemeSelection(parameterTempList.value, rows);
  setDegreeDisplayRows(parameterTempList.value, degreeRows);
  setSaveBtnEnable();
}

function ensureDefaultSchemeSelection() {
  if (selectedRowKeys.value.length > 0) return;
  const rows = getSchemeTableRows(parameterTempList.value);
  if (!rows.length) return;
  const firstRow = rows[0];
  handleSchemeSelection([schemeRowKey(firstRow, 0)], [firstRow]);
}

const schemeRowSelection = computed(() => ({
  type: 'radio' as const,
  fixed: true,
  selectedRowKeys: selectedRowKeys.value,
  onChange: handleSchemeSelection,
}));

function handleEfficiencyChange() {
  setEfficiencyValue(parameterTempList.value, efficiencyValue.value);
  applyEfficiencyToDegreeRows(parameterTempList.value, efficiencyValue.value);
  setSaveBtnEnable();
}

function onDegreeCellInput(record: Page10DegreeRow, index: number, field: string) {
  if (!isNumericInput(String(record[field] ?? ''))) {
    message.error('请输入数字');
    return;
  }
  const rows = [...getDegreeDisplayRows(parameterTempList.value)];
  if (rows[index]) {
    rows[index][field] = record[field];
    markPage10DegreeManualEdit(rows[index], field);
  }
  setDegreeDisplayRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function ensureSingleSchemeSelected() {
  if (!selectedSchemeRows.value.length) {
    message.info('请选择一个方案');
    return false;
  }
  if (selectedSchemeRows.value.length > 1) {
    message.info('请只选一个方案');
    return false;
  }
  return true;
}

function handleInitData(): boolean {
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  const userId = String(userStore.getUser?.id ?? '');
  const degreeEditableSnapshot = captureAllPage10DegreeTablesEditable(parameterTempList.value);
  const result = applyPage10InitData(parameterTempList.value, pageId, userId);
  if (!result.ok) {
    message.warning('未能更新表格：请先在 page9「校核减速机构的齿轮强度」页面生成数据并注入流程上下文后再试');
    return false;
  }
  parameterTempList.value = ensurePage10TableComponentIds(parameterTempList.value);
  applyTaskParamMapToList();
  restoreAllPage10DegreeTablesEditable(parameterTempList.value, degreeEditableSnapshot);
  efficiencyValue.value = getEfficiencyValue(parameterTempList.value);
  selectedRowKeys.value = [];
  selectedSchemeRows.value = [];
  setSaveBtnEnable();
  ensureDefaultSchemeSelection();
  return true;
}

function handleCalculation() {
  if (!ensureSingleSchemeSelected()) return;
  const editableSnapshot = captureDegreeEditableValues([...getDegreeDisplayRows(parameterTempList.value)]);
  const rows = calculateAllPage10DegreeRows([...getDegreeDisplayRows(parameterTempList.value)]);
  restoreDegreeEditableValues(rows, editableSnapshot);
  setDegreeDisplayRows(parameterTempList.value, rows);
  syncCalculatedDegreeRowsToSource(parameterTempList.value, String(selectedSchemeRows.value[0].p0 ?? ''), rows);
  setSaveBtnEnable();
}

function openImportModal() {
  if (!ensureSingleSchemeSelected()) return;
  importModalVisible.value = true;
}

function closeImportModal() {
  importModalVisible.value = false;
}

function downloadTemplate() {
  handleDownloadByFilename('multiDegree-Template.xlsx');
}

async function handleExcelBeforeUpload(file: File) {
  if (!ensureSingleSchemeSelected()) {
    return false;
  }
  try {
    const imported = await readDegreeExcelFile(file);
    const currentRows = getDegreeDisplayRows(parameterTempList.value);
    const templateRow = currentRows[0] ?? {};
    const rows = buildDegreeRowsFromImport(imported, templateRow, selectedSchemeRows.value[0]);
    setDegreeDisplayRows(parameterTempList.value, rows);
    setSaveBtnEnable();
    message.success('文件读取成功');
  } catch {
    message.error('文件读取出错');
  }
  return false;
}

function updateEl(): Promise<void> {
  return nextTick(() => {
    applyTaskParamMapToList();
    parameterTempList.value = clonePage10ParameterList(parameterTempList.value);
    efficiencyValue.value = getEfficiencyValue(parameterTempList.value);
    selectedRowKeys.value = [];
    selectedSchemeRows.value = [];
    if (getSchemeTableRows(parameterTempList.value).length > 0) {
      restoreSelectionFromParam();
      ensureDefaultSchemeSelection();
    }
  });
}

async function runAutoInitAndCalculateOnce() {
  if (hasAutoRefreshed.value) return;
  hasAutoRefreshed.value = true;
  await updateEl();
  handleInitData();
}

function onMountReady() {
  void runAutoInitAndCalculateOnce();
}

setupParameterWatch(updateEl);

function syncStateBeforeSave() {
  setEfficiencyValue(parameterTempList.value, efficiencyValue.value);

  const degreeRows = degreeTableRows.value.map(row => ({ ...row }));
  setDegreeDisplayRows(parameterTempList.value, degreeRows);

  const schemeRows = getSchemeTableRows(parameterTempList.value);
  let schemeKey = '';
  if (selectedSchemeRows.value.length === 1) {
    schemeKey = String(selectedSchemeRows.value[0].p0 ?? '');
    schemeRows.forEach((row, index) => {
      if (row.p0 === selectedSchemeRows.value[0].p0) {
        setSelectedRowIndex(parameterTempList.value, index);
      }
    });
  } else {
    const selIndex = getSelectedRowIndex(parameterTempList.value);
    if (selIndex >= 0 && selIndex < schemeRows.length) {
      schemeKey = String(schemeRows[selIndex]?.p0 ?? '');
    }
  }

  if (schemeKey && degreeRows.length) {
    syncCalculatedDegreeRowsToSource(parameterTempList.value, schemeKey, degreeRows);
  }

  parameterTempList.value = ensurePage10TableComponentIds(parameterTempList.value);
}

function getInternalParameterList() {
  syncStateBeforeSave();
  return parameterTempList.value;
}

function getCurrentSaveParamValues() {
  syncStateBeforeSave();
  return extractPage10SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  syncStateBeforeSave();
  return extractPage10TableSavePayload(parameterTempList.value);
}

defineExpose({
  updateEl,
  getInternalParameterList,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(onMountReady);
</script>

<style scoped>
.page10 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page10-header {
  margin-bottom: 12px;
}

.page10-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page10-actions {
  display: flex;
  justify-content: flex-start;
}

.page10-scheme-wrap {
  margin-bottom: 16px;
  overflow-x: auto;
}

.page10-detail__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}

.page10-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.page10-toolbar__label {
  white-space: nowrap;
  font-weight: 600;
}

.page10-toolbar__input {
  width: 120px;
}

.page10-degree-wrap {
  overflow-x: auto;
}

.page10-table :deep(.ant-table) {
  font-size: 12px;
}

.page10-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page10-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page10-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page10-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}

.page10-table :deep(.ant-table-selection-column) {
  text-align: left;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

.import-panel__row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
</style>
