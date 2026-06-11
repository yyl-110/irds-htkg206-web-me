<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">减速器选型：</div>

      <a-form layout="vertical" label-align="left" :colon="false" class="param-form">
        <div v-for="(row, rowIndex) in formFieldRows" :key="rowIndex" class="form-row">
          <div v-for="field in row" :key="field.index" class="form-col">
            <a-form-item :label="field.label">
              <a-input v-model:value="parameterTempList[field.index].defaultValue" class="field-input" disabled allow-clear />
            </a-form-item>
          </div>
        </div>
      </a-form>

      <div class="section-toolbar">
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger style="margin-left: 20px" :disabled="rowFlag" @click="handleDeleteRow">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除行
        </a-button>
        <a-button type="primary" style="margin-left: 20px" @click.stop="handleBrowseRow">
          <template #icon><FolderOpenOutlined /></template>
          浏览
        </a-button>
      </div>

      <div class="selectBox">
        <a-table
          :columns="reducerTableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          class="reducer-table"
          :scroll="{ y: tabHeight }"
          :row-key="reducerTableRowKey"
          :row-selection="reducerRowSelection">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'p0'">
              <a-select v-model:value="record.p0" class="table-cell-select" @change="onReducerTypeChange(record, index)">
                <a-select-option v-for="item in reducerTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="isEditableReducerCell(column, record)">
              <a-input
                v-if="column.inputType === 'text'"
                v-model:value="record[String(column.dataIndex)]"
                type="text"
                class="table-cell-input"
                @input="onReducerCellInput(record, index, String(column.dataIndex))" />
              <a-input-number
                v-else
                v-model:value="record[String(column.dataIndex)]"
                class="table-cell-input"
                @input="onReducerCellInput(record, index, String(column.dataIndex))" />
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <ModuleLibraryPickerModal
      v-model:visible="modulePickerVisible"
      :category-id="modulePickerCategoryId"
      :menu-id="modulePickerMenuId"
      :user-id="userStore.getUser.id"
      :query-prefill="modulePickerQueryPrefill"
      @confirm="onModulePickerConfirm" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import ModuleLibraryPickerModal from '@/views/product/activityPage/components/module-library-picker-modal.vue';
import { extractPage2_1SaveParamValues, extractPage2_1TableSavePayload } from './page2-1/calculations';
import { buildReducerBrowseQueryPrefill } from './page2-1/browseHelpers';
import { loadPage2_1PageParameters } from './page2-1/loadPageParameters';
import { createDefaultPage2_1ParameterList, type Page2_1ParameterItem, type Page2_1TableRow } from './page2-1/parameterDefaults';
import { addReducerRow, applyModuleLibraryToRow, deleteReducerRows, getReducerTableRows } from './page2-1/rowOperations';
import { isBrowseModeRow, REDUCER_SELECT_ANT_COLUMNS, REDUCER_TYPE_OPTIONS, normalizeReducerCategoryValue, type Page2_1AntColumn } from './page2-1/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page2-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page2_1ParameterItem[];
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

const route = useRoute();

const userStore = useUserStore();
const tabHeight = 440;
const reducerTypeOptions = REDUCER_TYPE_OPTIONS;
const reducerTableColumns = REDUCER_SELECT_ANT_COLUMNS;

interface FormFieldConfig {
  index: number;
  label: string;
}

const formFields: FormFieldConfig[] = [
  { index: 6, label: '舟它工作方式:' },
  { index: 0, label: '机械行程（单边转角）:' },
  { index: 1, label: '机械行程（单边直线）:' },
  { index: 3, label: '减速器载荷 (旋转) (Nm):' },
  { index: 4, label: '减速器载荷 (直线) (Nm):' },
  { index: 7, label: '等效力臂（mm）:' },
  { index: 2, label: '舟它末端减速器形式:' },
];

const formFieldRows = computed(() => {
  const rows: FormFieldConfig[][] = [];
  for (let i = 0; i < formFields.length; i += 3) {
    rows.push(formFields.slice(i, i + 3));
  }
  return rows;
});

function createInitialParameterList(): Page2_1ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage2_1ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({
    ...item,
    tableMap: item.tableMap
      ? {
          ...item.tableMap,
          rowData: Array.isArray(item.tableMap.rowData) ? item.tableMap.rowData.map(row => ({ ...row })) : [],
        }
      : item.tableMap,
  }));
}

const parameterTempList = ref<Page2_1ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage2_1PageParameters,
});

const selectList = ref<Array<Record<string, string | number | undefined>>>([]);
const selectedRowKeys = ref<Array<string | number>>([]);
const rowFlag = ref(false);
const modulePickerVisible = ref(false);
const modulePickerCategoryId = ref('');
const modulePickerMenuId = ref('');
const modulePickerQueryPrefill = ref<Record<string, string>>({});
const selectRow = ref(0);
const browseClickBusy = ref(false);
const BROWSE_ROW_HINT_KEY = 'customized-process-page2-1-browse-row';

function showBrowseHint(content: string) {
  message.warning({ content, key: BROWSE_ROW_HINT_KEY });
}

function resolveBrowseTargetRow(): Page2_1TableRow | null {
  const rows = getReducerTableRows(parameterTempList.value);
  const browseRows = rows.filter(row => isBrowseModeRow(row));

  if (selectList.value.length === 1 && isBrowseModeRow(selectList.value[0])) {
    return selectList.value[0] as Page2_1TableRow;
  }

  if (browseRows.length === 1) {
    return browseRows[0];
  }

  if (browseRows.length > 1) {
    const selectedBrowse = selectList.value.filter(row => isBrowseModeRow(row));
    if (selectedBrowse.length === 1) {
      return selectedBrowse[0] as Page2_1TableRow;
    }
  }

  return null;
}

const tableRowData = computed(() => getReducerTableRows(parameterTempList.value));

watch(
  selectedRowKeys,
  keys => {
    rowFlag.value = keys.length <= 0;
  },
  { immediate: true },
);

const reducerRowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Array<string | number>, rows: Array<Record<string, string | number | undefined>>) => {
    selectedRowKeys.value = keys;
    selectList.value = rows;
  },
}));

function reducerTableRowKey(record: Record<string, string | number | undefined>, index?: number) {
  if (record.delIndex != null && record.delIndex !== '') {
    return String(record.delIndex);
  }
  if (record.id != null && record.id !== '') {
    return String(record.id);
  }
  return String(index ?? 0);
}

function isEditableReducerCell(column: Page2_1AntColumn, record: Record<string, string | number | undefined>) {
  if (!column.dataIndex || column.dataIndex === 'p0' || column.dataIndex === 'p1') {
    return false;
  }
  if (column.editable === false) {
    return false;
  }
  return !isBrowseModeRow(record);
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') {
    return;
  }
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) {
    return;
  }
  if (parameterValue === undefined || parameterValue === null) {
    return;
  }
  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else if (item.tableMap && Number(item.tableMap.colNums) > 0) {
      const colNums = Number(item.tableMap.colNums);
      item.tableMap.rowData?.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
    }
  });
}

function onReducerTypeChange(record: Record<string, string | number | undefined>, index: number) {
  const normalized = normalizeReducerCategoryValue(record.p0);
  record.p0 = normalized;
  if (parameterTempList.value[5]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[5].tableMap.rowData[index].p0 = normalized;
  }
  setSaveBtnEnable();
}

function onReducerCellInput(record: Record<string, string | number | undefined>, index: number, field: string) {
  if (parameterTempList.value[5]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[5].tableMap.rowData[index][field] = record[field];
  }
  setSaveBtnEnable();
}

function handleAddRow() {
  addReducerRow(parameterTempList.value);
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!selectList.value.length) return;
  deleteReducerRows(parameterTempList.value, selectList.value);
  selectList.value = [];
  selectedRowKeys.value = [];
  setSaveBtnEnable();
}

function handleBrowseRow() {
  if (!selectList.value.length) {
    message.info('请选择浏览行');
    return;
  }
  if (selectList.value.length !== 1) {
    message.info('请只选择一个浏览行');
    return;
  }
  if (!isBrowseModeRow(selectList.value[0])) {
    message.info('请选择浏览行.');
    return;
  }

  const categoryId = '195';

  const rows = getReducerTableRows(parameterTempList.value);
  selectRow.value = rows.findIndex(row => row.p1 === selected.p1);
  if (selectRow.value < 0) {
    showBrowseHint('未找到所选行');
    return;
  }

  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = '9';
  modulePickerQueryPrefill.value = buildReducerBrowseQueryPrefill(parameterTempList.value);
  modulePickerVisible.value = true;
}

function onModulePickerConfirm(payload: { row: Record<string, unknown>; columns: Array<Record<string, unknown>> }) {
  applyModuleLibraryToRow(parameterTempList.value, selectRow.value, payload);
  modulePickerVisible.value = false;
  setSaveBtnEnable();
}

function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage2_1SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage2_1TableSavePayload(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.layout-wrapper {
  padding: 10px 10px;
  min-height: 680px;
  background-color: #ffffff;
}

.layout-header {
  background: #ffffff;
  min-height: 680px;
  line-height: 40px;
  padding: 0;
  margin-bottom: 10px;
}

.layout-header__title {
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  padding-left: 10px;
}

.param-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px 0;
}

.param-form :deep(.ant-form-item) {
  margin-bottom: 0;
}

.param-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.param-form :deep(.ant-form-item-label > label) {
  white-space: normal;
  line-height: 1.4;
  height: auto;
  font-weight: 400;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

.form-col {
  flex: 0 0 300px;
  width: 300px;
}

.form-col :deep(.ant-form-item) {
  width: 100%;
}

.section-toolbar {
  padding: 10px 0 10px 10px;
}

.selectBox {
  width: 100%;
  padding: 0 10px;
}

.field-input {
  width: 300px;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}

.reducer-table {
  width: 100%;
}

.reducer-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.reducer-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.reducer-table :deep(.ant-table-thead > tr > th) {
  white-space: normal;
  word-break: break-all;
  line-height: 1.35;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: normal;
}

.selectBox :deep(.ant-table-cell) {
  padding: 4px 6px;
  font-size: 12px;
}
</style>
