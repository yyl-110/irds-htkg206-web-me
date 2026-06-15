<template>
  <div class="page6">
    <div class="page6-header">
      <div class="page6-title">确定齿数和最终实际总减速比：</div>
      <a-space :size="12" class="page6-actions">
        <a-button type="primary" @click="handleInitData">
          <template #icon><SyncOutlined /></template>
          更新数据
        </a-button>
        <a-button type="primary" @click="handleCalculation">
          <template #icon><CalculatorOutlined /></template>
          计算
        </a-button>
      </a-space>
    </div>

    <div class="page6-main">
      <div class="page6-diagram">
        <img :src="diagramSrc" alt="齿轮传动示意图" class="page6-diagram__img" @error="onDiagramError" />
      </div>

      <div class="page6-table-wrap">
        <a-table
          :columns="page6TableColumns"
          :data-source="tableRowData"
          :pagination="false"
          bordered
          size="small"
          :scroll="{ y: tabHeight, x: tableScrollX }"
          :row-key="page6TableRowKey"
          class="page6-table">
          <template #bodyCell="{ column, record, index }">
            <template v-if="resolveLeafColumn(column)?.cellMode === 'editable'">
              <a-input-number
                v-model:value="record[String(column.dataIndex)]"
                :disabled="isPage6CellDisabled(record, String(column.dataIndex))"
                type="number"
                class="table-cell-input"
                @input="onCellInput(record, index, String(column.dataIndex))" />
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons-vue';
import diagramPlaceholder from '@/assets/images/viz-schematic-placeholder.png';
import diagramClcs from '@/assets/images/clcs.png';
import { calculateAllPage6Rows, extractPage6SaveParamValues, extractPage6TableSavePayload } from './page6/calculations';
import { applyPage6InitData, captureEditableInputValues, restoreEditableInputValues } from './page6/initData';
import { loadPage6PageParameters } from './page6/loadPageParameters';
import {
  createDefaultPage6ParameterList,
  ensurePage6TableComponentIds,
  type Page6ParameterItem,
  type Page6TableRow,
} from './page6/parameterDefaults';
import { getPage6TableRows, setPage6TableRows } from './page6/rowOperations';
import {
  getPage6EditableFieldIndexes,
  isPage6CellDisabled,
  PAGE6_ANT_COLUMNS,
  PAGE6_LEAF_COLUMNS,
  PAGE6_TABLE_MIN_WIDTH,
  type Page6AntColumn,
} from './page6/tableColumns';

defineOptions({ name: 'rx-customizedProcess-page6' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Page6ParameterItem[];
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

const tabHeight = 480;
const tableScrollX = PAGE6_TABLE_MIN_WIDTH;
const page6TableColumns = PAGE6_ANT_COLUMNS;
const leafColumnMap = new Map(PAGE6_LEAF_COLUMNS.map(col => [String(col.dataIndex), col]));

/** 示意图：默认 clcs；加载失败时回退占位图 */
const diagramSrc = ref(diagramClcs);

function onDiagramError() {
  diagramSrc.value = diagramPlaceholder;
}

function clonePage6ParameterList(list: Page6ParameterItem[]): Page6ParameterItem[] {
  return ensurePage6TableComponentIds(
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

function createInitialParameterList(): Page6ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return clonePage6ParameterList(createDefaultPage6ParameterList(props.pageid));
  }
  return clonePage6ParameterList(props.parameterTempList);
}

const parameterTempList = ref<Page6ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadPage6PageParameters,
  cloneItem: clonePage6ParameterList,
});

const tableRowData = computed(() => getPage6TableRows(parameterTempList.value));

function resolveLeafColumn(column: { dataIndex?: string | number }): Page6AntColumn | undefined {
  return leafColumnMap.get(String(column.dataIndex ?? ''));
}

function page6TableRowKey(record: Page6TableRow, index?: number) {
  return String(record.p0 ?? index ?? '');
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

function onCellInput(record: Page6TableRow, index: number, field: string) {
  const rows = getPage6TableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index][field] = record[field] != null ? String(record[field]) : '';
    const fieldIndex = Number(field.replace(/^p/, ''));
    if (getPage6EditableFieldIndexes().includes(fieldIndex)) {
      rows[index][`cellUserOverride${fieldIndex}`] = '1';
    }
  }
  setSaveBtnEnable();
}

function handleInitData(): boolean {
  const editableSnapshot = captureEditableInputValues([...getPage6TableRows(parameterTempList.value)]);
  const result = applyPage6InitData(parameterTempList.value, props.savedTables);
  if (!result.ok) {
    message.warning('未能更新表格：请先在「齿轮减速比分配」页面生成数据并注入流程上下文后再试');
    return false;
  }
  restoreEditableInputValues(getPage6TableRows(parameterTempList.value), editableSnapshot);
  setPage6TableRows(parameterTempList.value, [...getPage6TableRows(parameterTempList.value)]);
  setSaveBtnEnable();
  return true;
}

function handleCalculation() {
  const editableSnapshot = captureEditableInputValues([...getPage6TableRows(parameterTempList.value)]);
  const rows = [...getPage6TableRows(parameterTempList.value)];
  if (!rows.length) {
    message.warning('暂无数据可计算');
    return;
  }
  calculateAllPage6Rows(rows);
  restoreEditableInputValues(rows, editableSnapshot);
  setPage6TableRows(parameterTempList.value, rows);
  setSaveBtnEnable();
}

function updateEl(): Promise<void> {
  return nextTick(() => {
    applyTaskParamMapToList();
    parameterTempList.value = clonePage6ParameterList(parameterTempList.value);
  });
}

async function runAutoInitAndCalculateOnce() {
  if (hasAutoRefreshed.value) return;
  hasAutoRefreshed.value = true;
  await updateEl();
  if (handleInitData()) {
    handleCalculation();
  }
}

function onMountReady() {
  void runAutoInitAndCalculateOnce();
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractPage6SaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  return extractPage6TableSavePayload(ensurePage6TableComponentIds(parameterTempList.value));
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(onMountReady);
</script>

<style scoped>
.page6 {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.page6-header {
  width: 100%;
  margin-bottom: 12px;
}

.page6-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
  margin: 0 0 10px;
}

.page6-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.page6-main {
  position: relative;
  width: 100%;
}

.page6-diagram {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(380px, 42%);
  min-height: 140px;
  max-height: 220px;
  padding: 8px 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-sizing: border-box;
}

.page6-diagram__img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.page6-table-wrap {
  width: 100%;
  overflow-x: auto;
}

@media (min-width: 992px) {
  .page6-table-wrap {
    padding-right: calc(min(380px, 42%) + 16px);
  }
}

@media (max-width: 991px) {
  .page6-diagram {
    position: static;
    width: 100%;
    max-width: 100%;
    margin-bottom: 12px;
  }

  .page6-table-wrap {
    padding-right: 0;
  }
}

.page6-table :deep(.ant-table) {
  font-size: 12px;
}

.page6-table :deep(.ant-table-content table) {
  table-layout: fixed;
}

.page6-table :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px;
  text-align: center;
  background: #fafafa;
  white-space: nowrap;
}

.page6-table :deep(.ant-table-tbody > tr > td) {
  padding: 6px 12px;
  text-align: center;
}

.page6-table :deep(.ant-table-cell-fix-left) {
  background: #fff;
  z-index: 2;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

@media (max-width: 1200px) {
  .page6-diagram {
    max-height: 180px;
  }

  .page6-diagram__img {
    max-height: 160px;
  }
}
</style>
