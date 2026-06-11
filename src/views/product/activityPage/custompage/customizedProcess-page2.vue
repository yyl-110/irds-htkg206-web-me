<template>
  <div class="layout-wrapper">
    <div class="layout-header">
      <div class="layout-header__title">电机选型：</div>

      <a-form layout="vertical" label-align="left" :colon="false" class="power-form">
        <a-form-item label="舟它额定功率（旋转）（W）：">
          <a-input v-model:value="parameterTempList[0].defaultValue" class="field-input" disabled allow-clear />
        </a-form-item>
        <a-form-item label="舟它额定功率（直线）（W）：">
          <a-input v-model:value="parameterTempList[1].defaultValue" class="field-input" disabled allow-clear />
        </a-form-item>
      </a-form>

      <div class="section-toolbar">
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger style="margin-left: 20px" :disabled="rowFlag" @click="handleDeleteRow">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除
        </a-button>
        <a-button type="primary" style="margin-left: 20px" @click="handleBrowseRow">
          <template #icon><FolderOpenOutlined /></template>
          浏览
        </a-button>
      </div>

      <div class="selectBox">
        <a-table
          :columns="motorTableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          class="motor-table"
          :scroll="{ y: tabHeight }"
          :row-key="motorTableRowKey"
          :row-selection="motorRowSelection">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'p0'">
              <a-select v-model:value="record.p0" class="table-cell-select" @change="onMotorTypeChange(record, index)">
                <a-select-option v-for="item in motorTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="isEditableMotorCell(column, record)">
              <a-input
                v-if="column.inputType === 'text'"
                v-model:value="record[String(column.dataIndex)]"
                type="text"
                class="table-cell-input"
                @input="onMotorCellInput(record, index, String(column.dataIndex))" />
              <a-input-number
                v-else
                v-model:value="record[String(column.dataIndex)]"
                type="number"
                class="table-cell-input"
                @input="onMotorCellInput(record, index, String(column.dataIndex))" />
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
import { getFlowModuleid, isValid } from '@/api/flowData/flowData';
import { useUserStore } from '@/store/modules/user';
import ModuleLibraryPickerModal from '@/views/product/activityPage/components/module-library-picker-modal.vue';
import { loadPage2PageParameters } from './page2/loadPageParameters';
import { createDefaultPage2ParameterList, type Page2ParameterItem } from './page2/parameterDefaults';
import {
  addMotorRow,
  applyModuleLibraryToRow,
  deleteMotorRows,
  extractPage2SaveParamValues,
  getMotorTableRows,
} from './page2/rowOperations';
import { isBrowseModeRow, MOTOR_SELECT_ANT_COLUMNS, MOTOR_TYPE_OPTIONS, type Page2AntColumn } from './page2/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page2' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page2ParameterItem[];
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
const tabHeight = 530;
const motorTypeOptions = MOTOR_TYPE_OPTIONS;
const motorTableColumns = MOTOR_SELECT_ANT_COLUMNS;

function createInitialParameterList(): Page2ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultPage2ParameterList(props.pageid);
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<Page2ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadPage2PageParameters,
  });

const selectList = ref<Array<Record<string, string | number | undefined>>>([]);
const selectedRowKeys = ref<Array<string | number>>([]);
const rowFlag = ref(false);
const modulePickerVisible = ref(false);
const modulePickerCategoryId = ref('');
const modulePickerMenuId = ref('');
const modulePickerQueryPrefill = ref<Record<string, string>>({});
const modulecategoryid = ref('');
const selectRow = ref(0);

const tableRowData = computed(() => getMotorTableRows(parameterTempList.value));

watch(
  selectedRowKeys,
  keys => {
    rowFlag.value = keys.length <= 0;
  },
  { immediate: true },
);

const motorRowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Array<string | number>, rows: Array<Record<string, string | number | undefined>>) => {
    selectedRowKeys.value = keys;
    selectList.value = rows;
  },
}));

function motorTableRowKey(record: Record<string, string | number | undefined>, index?: number) {
  if (record.id != null && record.id !== '') {
    return String(record.id);
  }
  if (record.delIndex != null && record.delIndex !== '') {
    return String(record.delIndex);
  }
  return String(index ?? 0);
}

function isEditableMotorCell(column: Page2AntColumn, record: Record<string, string | number | undefined>) {
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

function onMotorTypeChange(record: Record<string, string | number | undefined>, index: number) {
  if (parameterTempList.value[2]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[2].tableMap.rowData[index].p0 = record.p0;
  }
  setSaveBtnEnable();
}

function onMotorCellInput(record: Record<string, string | number | undefined>, index: number, field: string) {
  if (parameterTempList.value[2]?.tableMap?.rowData?.[index]) {
    parameterTempList.value[2].tableMap.rowData[index][field] = record[field];
  }
  setSaveBtnEnable();
}

function handleAddRow() {
  addMotorRow(parameterTempList.value);
  setSaveBtnEnable();
}

function handleDeleteRow() {
  if (!selectList.value.length) return;
  deleteMotorRows(parameterTempList.value, selectList.value);
  selectList.value = [];
  selectedRowKeys.value = [];
  setSaveBtnEnable();
}



async function handleBrowseRow() {
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

  const categoryId = '194';

  const rows = getMotorTableRows(parameterTempList.value);
  const selected = selectList.value[0];
  selectRow.value = rows.findIndex(row => row.p1 === selected.p1);
  if (selectRow.value < 0) {
    message.info('未找到所选行');
    return;
  }

  let edgl = parameterTempList.value[0]?.defaultValue ?? '';
  if (!isValid(edgl)) {
    edgl = parameterTempList.value[1]?.defaultValue ?? '';
  }

  modulePickerCategoryId.value = categoryId;
  modulePickerMenuId.value = '9';
  modulePickerQueryPrefill.value = edgl ? { DJ1_1_EDGL_X: String(edgl) } : {};
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
  return extractPage2SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.layout-wrapper {
  padding: 0 10px;
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

.power-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px 0 0 10px;
}

.power-form :deep(.ant-form-item) {
  margin-bottom: 0;
}

.power-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.power-form :deep(.ant-form-item-label > label) {
  white-space: normal;
  line-height: 1.4;
  height: auto;
  font-weight: 400;
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

.motor-table {
  width: 100%;
}

.motor-table :deep(.ant-table-wrapper) {
  width: 100%;
}

.motor-table :deep(.ant-table-content table) {
  table-layout: fixed;
  width: 100% !important;
}

.motor-table :deep(.ant-table-thead > tr > th) {
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
