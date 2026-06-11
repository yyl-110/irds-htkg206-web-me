<template>
  <div class="sbc-page">
    <div class="sbc-page__title">设备舱设计</div>

    <div class="sbc-page__toolbar">
      <div class="sbc-page__count">
        <span>设备舱数量:</span>
        <a-select
          v-model:value="parameterTempList[0].defaultValue"
          class="sbc-page__count-select"
          :options="cabinetCountOptions"
          @change="handleCabinetCountChange" />
      </div>

      <a-space :size="12">
        <a-button type="primary" @click="handleAssembleModule">
          <template #icon><BuildOutlined /></template>
          创建并装配
        </a-button>
        <a-button type="primary" @click="handleRegenModel">
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
      :scroll="{ x: 'max-content' }"
      :row-key="tableRowKey"
      :row-selection="rowSelection"
      class="sbc-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'select'">
          <a-select
            v-model:value="record.p2"
            class="table-cell-select"
            :options="positionOptions"
            allow-clear
            @change="createPositionChangeHandler(record, index)" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'number'">
          <a-input-number
            v-model:value="record[String(column.dataIndex)]"
            type="number"
            class="table-cell-input"
            @input="onCellInput(index)" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="onCellInput(index)" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'readonly'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { BuildOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { assembleModule, parameterInFirstCsys } from '@/libs/webSocket';
import { extractZt1_4101TableSavePayload, loadZt1_4101PageParameters } from './ZT1_4_10_1/loadPageParameters';
import {
  buildModelParametersStr,
  extractZt1_4101SaveParamValues,
  resolveTemplateFileName,
  TEMP_FILE_EXT,
} from './ZT1_4_10_1/modelAssembly';
import {
  CABINET_COUNT_OPTIONS,
  createDefaultZt1_4101ParameterList,
  ensureZt1_4101TableComponentIds,
  getCabinetTableRows,
  POSITION_OPTIONS,
  resolveTemplateByPosition,
  setCabinetTableRows,
  syncCabinetRowCount,
  ZT1_4101_CABINET_TABLE_INDEX,
  type Zt1_4101ParameterItem,
  type Zt1CabinetRow,
} from './ZT1_4_10_1/parameterDefaults';
import { ZT1_4_10_1_COLUMN_MAP, ZT1_4_10_1_TABLE_COLUMNS, type Zt1CabinetAntColumn } from './ZT1_4_10_1/tableColumns';

defineOptions({ name: 'rx-customizedProcess1-ZT1_4_10_1' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_4101ParameterItem[];
    savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null;
    savedTables?: Array<Record<string, unknown>> | null;
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

const tableColumns = ZT1_4_10_1_TABLE_COLUMNS;
const cabinetCountOptions = CABINET_COUNT_OPTIONS.map(value => ({ label: value, value }));
const positionOptions = POSITION_OPTIONS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<Zt1CabinetRow[]>([]);

function cloneParameterList(source: Zt1_4101ParameterItem[]): Zt1_4101ParameterItem[] {
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

function createInitialParameterList(): Zt1_4101ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_4101ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_4101ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadZt1_4101PageParameters,
});

const tableRows = computed(() => getCabinetTableRows(parameterTempList.value));

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: Zt1CabinetRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): Zt1CabinetAntColumn | undefined {
  return ZT1_4_10_1_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: Zt1CabinetRow, index?: number) {
  return String(record.p0 ?? index ?? '');
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

function handleCabinetCountChange(value: string) {
  syncCabinetRowCount(parameterTempList.value, value);
  setCabinetTableRows(parameterTempList.value, [...getCabinetTableRows(parameterTempList.value)]);
  setSaveBtnEnable();
}

function onCellInput(index: number) {
  const rows = getCabinetTableRows(parameterTempList.value);
  if (rows[index]) {
    setCabinetTableRows(parameterTempList.value, [...rows]);
  }
  setSaveBtnEnable();
}

function createPositionChangeHandler(record: Zt1CabinetRow, index: number) {
  return (value: string | number | null | undefined) => {
    onPositionChange(record, index, value);
  };
}

function onPositionChange(record: Zt1CabinetRow, index: number, value: string | number | null | undefined) {
  const position = value == null ? 1 : Number(value);
  record.p2 = position;
  record.p13 = resolveTemplateByPosition(position);
  const rows = getCabinetTableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index] = { ...record };
    setCabinetTableRows(parameterTempList.value, [...rows]);
  }
  setSaveBtnEnable();
}

function getSingleSelectedRow(): Zt1CabinetRow | null {
  if (!selectedRows.value.length) {
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

  const newModuleNum = String(row.p12 ?? '').trim();
  if (!newModuleNum) {
    message.warning('请先输入模型号');
    return;
  }

  const tempNum = resolveTemplateFileName(String(row.p13 ?? ''), TEMP_FILE_EXT);
  const tempNumS = tempNum.split('.');
  if (tempNumS.length !== 2) return;

  const parametersStr = buildModelParametersStr(row);
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  const response = await assembleModule(instance, tempNumS[0], tempNumS[1], '', newModuleNum, '', parametersStr);
  if (response === undefined) {
    message.info('通讯异常');
    return;
  }
  if (response.ReturnStatus !== 0) {
    message.error(`装配失败:${response.ReturnStatus}`);
  }
}

async function handleRegenModel() {
  const row = getSingleSelectedRow();
  if (!row) return;

  const newModuleNum = String(row.p12 ?? '').trim();
  if (!newModuleNum) {
    message.warning('请先输入模型号');
    return;
  }

  const parametersStr = buildModelParametersStr(row);
  const response = await parameterInFirstCsys(newModuleNum, TEMP_FILE_EXT, parametersStr);
  if (response === undefined) {
    message.info('通讯异常');
    return;
  }
  if (response.ReturnStatus !== 0) {
    message.error(`重生失败:${response.ReturnStatus}`);
  }
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function syncParameterListBeforeSave() {
  const rows = getCabinetTableRows(parameterTempList.value);
  const tableItem = parameterTempList.value[ZT1_4101_CABINET_TABLE_INDEX];
  if (tableItem?.tableMap) {
    tableItem.tableMap.rowData = rows.map(row => ({ ...row }));
    tableItem.tableMap.rowNums = String(rows.length);
  }
}

function getCurrentSaveParamValues() {
  syncParameterListBeforeSave();
  return extractZt1_4101SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  syncParameterListBeforeSave();
  return extractZt1_4101TableSavePayload(ensureZt1_4101TableComponentIds(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.sbc-page {
  padding: 10px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.sbc-page__title {
  width: 120px;
  margin: 10px;
  padding-bottom: 5px;
  font-size: 15px;
  font-weight: 600;
}

.sbc-page__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 0 12px 30px;
}

.sbc-page__count {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sbc-page__count-select {
  width: 80px;
}

.sbc-table {
  margin-left: 30px;
}

.sbc-table :deep(.ant-table) {
  font-size: 12px;
}

.sbc-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.sbc-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.table-cell-input,
.table-cell-select {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

.table-cell-select :deep(.ant-select-selector) {
  text-align: center;
}
</style>
