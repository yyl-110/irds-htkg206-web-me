<template>
  <div class="page9">
    <div class="page9-header">
      <div class="page9-title">校核减速机构的齿轮强度：</div>
      <a-space :size="12" class="page9-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
      </a-space>
    </div>

    <div class="page9-scheme-wrap">
      <a-table
        :columns="schemeTableColumns"
        :data-source="schemeTableRows"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ y: schemeTabHeight, x: schemeTableScrollX }"
        :row-key="schemeRowKey"
        :row-selection="schemeRowSelection"
        class="page9-table" />
    </div>

    <div class="page9-toolbar">
      <span class="page9-toolbar__label">载荷系数：</span>
      <a-input v-model:value="loadCoefficient" class="page9-toolbar__input" @input="handleCoefficientChange" />
      <a-button type="primary" @click="handleCalculation">
        <template #icon><CalculatorOutlined /></template>
        计算
      </a-button>
    </div>

    <div class="page9-body">
      <div class="page9-gear-wrap">
        <a-table
          :columns="gearTableColumns"
          :data-source="gearTableRows"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: gearTabHeight, x: gearTableScrollX }"
          :row-key="gearRowKey"
          class="page9-table">
          <template #bodyCell="{ column, record, index }">
            <template v-if="resolveGearColumn(column)?.cellMode === 'editable'">
              <a-input
                v-model:value="record[String(column.dataIndex)]"
                :disabled="isPage9GearCellDisabled(record, String(column.dataIndex))"
                class="table-cell-input"
                @blur="onGearCellBlur(record, index, String(column.dataIndex))"
                @input="onGearCellInput(record, index, String(column.dataIndex))" />
            </template>
          </template>
        </a-table>
      </div>

      <div class="page9-diagrams">
        <div >
          <img :src="diagramTopSrc" alt="推荐模数示意" class="page9-diagram__img" @error="onDiagramTopError" />
        </div>
        <div style="margin-left: 30px;">
          <img :src="diagramBottomSrc" alt="齿轮参数示意" class="page9-diagram__img" @error="onDiagramBottomError" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import diagramPlaceholder from '@/assets/images/viz-schematic-placeholder.png';
import diagramCl from '@/assets/images/cl.png';
import diagramTjms from '@/assets/images/tjms.png';
import {
  calculateAllPage9GearRows,
  applyRootBendingStressToRow,
  applyTangentialForceToRow,
  extractPage9SaveParamValues,
  extractPage9TableSavePayload,
} from './page9/calculations';
import { createGearRatioTable, lookupGearFactors } from './page9/gearRatio';
import {
  applyPage9InitData,
  captureAllPage9GearTablesEditable,
  captureGearEditableValues,
  markPage9GearManualEdit,
  refreshPage9SchemePerformanceFields,
  restoreAllPage9GearTablesEditable,
  restoreGearEditableValues,
} from './page9/initData';
import { loadPage9PageParameters } from './page9/loadPageParameters';
import {
  createDefaultPage9ParameterList,
  ensurePage9TableComponentIds,
  PAGE9_INPUT_TABLE_COMPONENT_ID,
  PAGE9_INPUT_TABLE_NUM,
  type Page9GearRow,
  type Page9ParameterItem,
  type Page9SchemeRow,
} from './page9/parameterDefaults';
import { syncTableToFlowContext } from './_shared/utils/syncTableToFlowContext';
import {
  applyLoadCoefficientToGearRows,
  getGearDisplayRows,
  getLoadCoefficient,
  getSchemeTableRows,
  setGearDisplayRows,
  setLoadCoefficient,
  updateGearRowField,
} from './page9/rowOperations';
import { applyPage9SchemeSelection, syncCalculatedGearRowsToSource } from './page9/selectionHandler';
import {
  isNumericInput,
  isPage9GearCellDisabled,
  PAGE9_GEAR_COLUMNS,
  PAGE9_GEAR_LEAF_COLUMNS,
  PAGE9_GEAR_TABLE_MIN_WIDTH,
  PAGE9_SCHEME_TABLE_MIN_WIDTH,
  PAGE9_SCHEME_COLUMNS,
  type Page9AntColumn,
} from './page9/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page9' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page9ParameterItem[];
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

const schemeTabHeight = 280;
const gearTabHeight = 360;
const schemeTableScrollX = PAGE9_SCHEME_TABLE_MIN_WIDTH;
const gearTableScrollX = PAGE9_GEAR_TABLE_MIN_WIDTH;
const schemeTableColumns = PAGE9_SCHEME_COLUMNS;
const gearTableColumns = PAGE9_GEAR_COLUMNS;
const gearLeafMap = new Map(PAGE9_GEAR_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));
const gearRatioTable = createGearRatioTable();

const selectedRowKeys = ref<Key[]>([]);
const selectedSchemeRows = ref<Page9SchemeRow[]>([]);
const diagramTopSrc = ref(diagramTjms);
const diagramBottomSrc = ref(diagramCl);
let diagramTopFallback = false;
let diagramBottomFallback = false;

function clonePage9ParameterList(list: Page9ParameterItem[]): Page9ParameterItem[] {
  return ensurePage9TableComponentIds(
    list.map(item => ({
      ...item,
      tableMap: item.tableMap
        ? {
            ...item.tableMap,
            rowData: item.tableMap.rowData?.map(row => ({ ...row })),
          }
        : item.tableMap,
    })),
  );
}

function createInitialParameterList(): Page9ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage9ParameterList(createDefaultPage9ParameterList(props.pageid));
  }
  return clonePage9ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page9ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage9PageParameters,
  cloneItem: clonePage9ParameterList,
});

const loadCoefficient = ref(getLoadCoefficient(parameterTempList.value));

const schemeTableRows = computed(() => getSchemeTableRows(parameterTempList.value));
const gearTableRows = computed(() => getGearDisplayRows(parameterTempList.value));

function schemeRowKey(record: Page9SchemeRow, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function gearRowKey(record: Page9GearRow, index?: number) {
  return `${record.p0 ?? index ?? ''}-${index ?? ''}`;
}

function resolveGearColumn(column: { dataIndex?: string | number }): Page9AntColumn | undefined {
  return gearLeafMap.get(String(column.dataIndex ?? ''));
}

function syncPage9SchemeFlowContext() {
  syncTableToFlowContext(PAGE9_INPUT_TABLE_NUM, PAGE9_INPUT_TABLE_COMPONENT_ID, getSchemeTableRows(parameterTempList.value), 20);
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
  syncPage9SchemeFlowContext();
}

function handleSchemeSelection(_keys: Key[], rows: Page9SchemeRow[]) {
  if (rows.length > 1) {
    message.info('请只选一个方案');
    selectedRowKeys.value = rows.length ? [schemeRowKey(rows[0])] : [];
    selectedSchemeRows.value = rows.slice(0, 1);
    setGearDisplayRows(parameterTempList.value, []);
    return;
  }

  selectedSchemeRows.value = rows;
  selectedRowKeys.value = rows.map(row => schemeRowKey(row));

  if (!rows.length) {
    setGearDisplayRows(parameterTempList.value, []);
    return;
  }

  const gearRows = applyPage9SchemeSelection(parameterTempList.value, rows, gearRatioTable);
  setGearDisplayRows(parameterTempList.value, gearRows);
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
  selectedRowKeys: selectedRowKeys.value,
  onChange: handleSchemeSelection,
}));

function handleCoefficientChange() {
  setLoadCoefficient(parameterTempList.value, loadCoefficient.value);
  applyLoadCoefficientToGearRows(parameterTempList.value, loadCoefficient.value);
  setSaveBtnEnable();
}

function onGearCellInput(record: Page9GearRow, index: number, field: string) {
  const value = String(record[field] ?? '');
  if (field === 'p2' || field === 'p4' || field === 'p5' || field === 'p6') {
    if (value && !isNumericInput(value)) {
      message.error('请输入数字');
      return;
    }
  }
  const rows = [...getGearDisplayRows(parameterTempList.value)];
  updateGearRowField(rows, index, field as keyof Page9GearRow, value);
  markPage9GearManualEdit(rows[index], field);
  if ((field === 'p2' || field === 'p4') && (index === 2 || index === 4) && rows[index + 1]) {
    markPage9GearManualEdit(rows[index + 1], field);
  }
  setGearDisplayRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function onGearCellBlur(record: Page9GearRow, index: number, field: string) {
  const rows = [...getGearDisplayRows(parameterTempList.value)];
  const value = String(record[field] ?? '');
  updateGearRowField(rows, index, field as keyof Page9GearRow, value);
  markPage9GearManualEdit(rows[index], field);

  if (field === 'p4') {
    const factors = lookupGearFactors(String(rows[index]?.p3 ?? ''), gearRatioTable);
    if (factors.YF) rows[index].p5 = factors.YF;
    if (factors.YS) rows[index].p6 = factors.YS;
  }

  if (field === 'p2') {
    applyTangentialForceToRow(rows[index], index, rows);
  }
  if (field === 'p5' || field === 'p6') {
    applyRootBendingStressToRow(rows[index], index, rows);
  }

  setGearDisplayRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function handleInitData(): boolean {
  const gearEditableSnapshot = captureAllPage9GearTablesEditable(parameterTempList.value);
  const result = applyPage9InitData(parameterTempList.value, props.savedTables);
  if (result.cleared) {
    message.warning('请先在 初步筛选若干组合方案页面 勾选组合方案并保存方案索引后再试');
    selectedRowKeys.value = [];
    selectedSchemeRows.value = [];
    setSaveBtnEnable();
    return false;
  }
  if (!result.ok) {
    message.warning('未能更新表格：请先在「初步筛选若干组合方案」页面勾选方案并注入流程上下文后再试');
    return false;
  }
  parameterTempList.value = ensurePage9TableComponentIds(parameterTempList.value);
  applyTaskParamMapToList();
  refreshPage9SchemePerformanceFields(parameterTempList.value, props.savedTables);
  restoreAllPage9GearTablesEditable(parameterTempList.value, gearEditableSnapshot);
  selectedRowKeys.value = [];
  selectedSchemeRows.value = [];
  setSaveBtnEnable();
  ensureDefaultSchemeSelection();
  syncPage9SchemeFlowContext();
  return true;
}

function handleCalculation() {
  const editableSnapshot = captureGearEditableValues([...getGearDisplayRows(parameterTempList.value)]);
  const rows = [...getGearDisplayRows(parameterTempList.value)];
  if (!rows.length) {
    message.warning('请先选择一个组合方案');
    return;
  }
  calculateAllPage9GearRows(rows);
  restoreGearEditableValues(rows, editableSnapshot);
  setGearDisplayRows(parameterTempList.value, rows);

  if (selectedSchemeRows.value.length === 1) {
    syncCalculatedGearRowsToSource(parameterTempList.value, String(selectedSchemeRows.value[0].p0 ?? ''), rows);
  }
  setSaveBtnEnable();
}

function onDiagramTopError() {
  if (diagramTopFallback) return;
  diagramTopFallback = true;
  diagramTopSrc.value = diagramPlaceholder;
}

function onDiagramBottomError() {
  if (diagramBottomFallback) return;
  diagramBottomFallback = true;
  diagramBottomSrc.value = diagramPlaceholder;
}

function updateEl(): Promise<void> {
  return nextTick(() => {
    applyTaskParamMapToList();
    refreshPage9SchemePerformanceFields(parameterTempList.value, props.savedTables);
    parameterTempList.value = clonePage9ParameterList(parameterTempList.value);
    loadCoefficient.value = getLoadCoefficient(parameterTempList.value);
    selectedRowKeys.value = [];
    selectedSchemeRows.value = [];
    if (getSchemeTableRows(parameterTempList.value).length > 0) {
      ensureDefaultSchemeSelection();
    }
    syncPage9SchemeFlowContext();
  });
}

async function runAutoInitAndCalculateOnce() {
  if (hasAutoRefreshed.value) return;
  hasAutoRefreshed.value = true;
  await updateEl();
  handleInitData();
  handleCalculation();
}

function onMountReady() {
  void runAutoInitAndCalculateOnce();
}

setupParameterWatch(updateEl);

function syncStateBeforeSave() {
  setLoadCoefficient(parameterTempList.value, loadCoefficient.value);
  const gearRows = getGearDisplayRows(parameterTempList.value);
  if (selectedSchemeRows.value.length === 1 && gearRows.length) {
    syncCalculatedGearRowsToSource(parameterTempList.value, String(selectedSchemeRows.value[0].p0 ?? ''), gearRows);
  }
}

function getCurrentSaveParamValues() {
  syncStateBeforeSave();
  return extractPage9SaveParamValues(ensurePage9TableComponentIds(parameterTempList.value));
}

function getCurrentTableSavePayload() {
  syncStateBeforeSave();
  return extractPage9TableSavePayload(ensurePage9TableComponentIds(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(onMountReady);
</script>

<style scoped>
.page9 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page9-header {
  width: 100%;
  margin-bottom: 12px;
}

.page9-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page9-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.page9-scheme-wrap {
  margin-bottom: 12px;
  overflow-x: auto;
}

.page9-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.page9-toolbar__label {
  font-weight: 600;
}

.page9-toolbar__input {
  width: 100px;
}

.page9-body {
  width: 100%;
}

.page9-gear-wrap {
  width: 100%;
  overflow-x: auto;
}

.page9-diagrams {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
}

.page9-diagram {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 280px;
  min-height: 180px;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-sizing: border-box;
}

.page9-diagram__img {
  max-width: 100%;
  height: 260px;
  margin-top: 20px;
  object-fit: contain;
}

.page9-table :deep(.ant-table) {
  font-size: 12px;
}

.page9-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page9-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page9-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page9-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}

.table-cell-input {
  width: 100%;
  min-width: 72px;
  text-align: center;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
  padding: 4px 8px;
}

@media (max-width: 1200px) {
  .page9-diagram {
    min-width: 100%;
  }

  .page9-diagram__img {
    max-height: 180px;
  }
}
</style>
