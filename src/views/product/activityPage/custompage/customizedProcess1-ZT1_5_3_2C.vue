<template>
  <div ref="pageRootRef" class="interface-page">
    <div class="interface-page__title">配电接口表</div>
    <div class="interface-page__subtitle">供电接口汇总表</div>

    <a-table
      :columns="summaryTableColumns"
      :data-source="summaryRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ x: 'max-content' }"
      :row-key="summaryRowKey"
      class="summary-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveSummaryColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveSummaryColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
        </template>
      </template>
    </a-table>

    <div ref="toolbarAnchorRef" class="interface-page__toolbar">
      <a-space :size="12" wrap>
        <a-button type="primary" @click="handleAddInterface">
          <template #icon><PlusOutlined /></template>
          添加接口表
        </a-button>
        <a-button type="primary" danger :disabled="interfaceDeleteDisabled" @click="handleDeleteInterface">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除接口表
        </a-button>
      </a-space>
    </div>

    <div v-for="groupNo in interfaceGroupCount" :key="groupNo" class="interface-group">
      <div class="interface-group__header">
        <a-checkbox v-model:checked="checkArr[groupNo - 1]" class="interface-group__checkbox">
          供电接口表组{{ groupNo }}
        </a-checkbox>
      </div>

      <div class="interface-group__name">
        <span>供电接口表名称：</span>
        <a-input
          v-model:value="parameterTempList[getGroupBaseIndex(groupNo - 1)].defaultValue"
          class="interface-group__name-input"
          @input="handleInterfaceNameInput(groupNo)" />
      </div>

      <div class="interface-group__toolbar">
        <a-space :size="12">
          <a-button type="primary" @click="handleAddPointRow(getPointTableIndex(groupNo))">
            <template #icon><PlusOutlined /></template>
            添加行
          </a-button>
          <a-button
            type="primary"
            danger
            :disabled="isPointDeleteDisabled(getPointTableIndex(groupNo))"
            @click="handleDeletePointRow(getPointTableIndex(groupNo))">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            删除行
          </a-button>
        </a-space>
      </div>

      <a-table
        :columns="pointTableColumns"
        :data-source="getPointRowsByGroup(groupNo)"
        :pagination="false"
        bordered
        size="small"
        :scroll="{ x: 'max-content' }"
        :row-key="pointRowKey"
        :row-selection="createPointRowSelection(getPointTableIndex(groupNo))"
        class="point-table">
        <template #bodyCell="{ column, record }">
          <template v-if="resolvePointColumn(column)?.cellMode === 'text'">
            <span>{{ record[String(column.dataIndex)] }}</span>
          </template>
          <template v-else-if="resolvePointColumn(column)?.cellMode === 'editable'">
            <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
          </template>
        </template>
      </a-table>

      <div class="interface-group__connector-title">连接器类型:</div>
      <div class="interface-group__textarea-row">
        <span class="interface-group__textarea-label">插座:</span>
        <a-textarea
          v-model:value="parameterTempList[getGroupBaseIndex(groupNo - 1) + 2].defaultValue"
          :rows="5"
          :maxlength="1000"
          show-count
          class="interface-group__textarea"
          @input="handleSocketInput(groupNo)" />
      </div>
      <div class="interface-group__textarea-row">
        <span class="interface-group__textarea-label">插头:</span>
        <a-textarea
          v-model:value="parameterTempList[getGroupBaseIndex(groupNo - 1) + 3].defaultValue"
          :rows="5"
          :maxlength="1000"
          show-count
          class="interface-group__textarea"
          @input="setSaveBtnEnable()" />
      </div>
    </div>

    <div v-show="showFloatToolbar" class="interface-page__float-toolbar">
      <a-space :size="12">
        <a-button type="primary" @click="handleAddInterface">
          <template #icon><PlusOutlined /></template>
          添加接口表
        </a-button>
        <a-button type="primary" danger :disabled="interfaceDeleteDisabled" @click="handleDeleteInterface">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除接口表
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { delPageInputtempByIds, isValid } from '@/api/flowData/flowData';
import {
  addInterfaceGroup,
  collectDeletedInputTempIds,
  rebuildAfterDeleteGroups,
  syncSummaryName,
  syncSummarySocketContent,
} from './ZT1_5_3_2C/interfaceOperations';
import { loadZt1_532CPageParameters } from './ZT1_5_3_2C/loadPageParameters';
import {
  createDefaultZt1_532CParameterList,
  getGroupBaseIndex,
  getInterfaceGroupCount,
  getPointRows,
  getSummaryRows,
  type PointRow,
  type SummaryRow,
  type Zt1_532CParameterItem,
} from './ZT1_5_3_2C/parameterDefaults';
import { addPointRow, deletePointRows, extractZt1_532CSaveParamValues } from './ZT1_5_3_2C/rowOperations';
import {
  POINT_COLUMN_MAP,
  POINT_TABLE_COLUMNS,
  SUMMARY_COLUMN_MAP,
  SUMMARY_TABLE_COLUMNS,
  type InterfaceAntColumn,
} from './ZT1_5_3_2C/tableColumns';

defineOptions({ name: 'rx-customizedProcess1-ZT1_5_3_2C' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_532CParameterItem[];
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
const summaryTableColumns = SUMMARY_TABLE_COLUMNS;
const pointTableColumns = POINT_TABLE_COLUMNS;

const pageRootRef = ref<HTMLElement | null>(null);
const toolbarAnchorRef = ref<HTMLElement | null>(null);
const checkArr = ref<boolean[]>([]);
const selectedPointRows = ref<PointRow[]>([]);
const showFloatToolbar = ref(false);
let scrollContainer: HTMLElement | null = null;

function cloneParameterList(source: Zt1_532CParameterItem[]): Zt1_532CParameterItem[] {
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

function createInitialParameterList(): Zt1_532CParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_532CParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_532CParameterItem[]>(createInitialParameterList());
const interfaceGroupCount = computed(() => getInterfaceGroupCount(parameterTempList.value));
const summaryRows = computed(() => getSummaryRows(parameterTempList.value));
const interfaceDeleteDisabled = computed(() => !checkArr.value.some(Boolean));

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
      syncCheckArr();
    }
  },
  { deep: true },
);

watch(interfaceGroupCount, () => syncCheckArr(), { immediate: true });

function syncCheckArr() {
  const count = interfaceGroupCount.value;
  const next = [...checkArr.value];
  while (next.length < count) next.push(false);
  if (next.length > count) next.length = count;
  checkArr.value = next;
}

function getPointTableIndex(groupNo: number) {
  return getGroupBaseIndex(groupNo - 1) + 1;
}

function getPointRowsByGroup(groupNo: number) {
  return getPointRows(parameterTempList.value, getPointTableIndex(groupNo));
}

function resolveSummaryColumn(column: { dataIndex?: string | number }): InterfaceAntColumn | undefined {
  return SUMMARY_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function resolvePointColumn(column: { dataIndex?: string | number }): InterfaceAntColumn | undefined {
  return POINT_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function summaryRowKey(record: SummaryRow, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function pointRowKey(record: PointRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return `${record.p4 ?? ''}-${record.delIndex ?? record.p0 ?? index ?? ''}`;
}

function createPointRowSelection(tableIndex: number) {
  const selectedKeys = selectedPointRows.value.filter(row => Number(row.p4) === tableIndex).map(row => pointRowKey(row));

  return {
    selectedRowKeys: selectedKeys,
    onChange: (_keys: Key[], rows: PointRow[]) => {
      const others = selectedPointRows.value.filter(row => Number(row.p4) !== tableIndex);
      selectedPointRows.value = [...others, ...rows];
    },
  };
}

function isPointDeleteDisabled(tableIndex: number) {
  return selectedPointRows.value.filter(row => Number(row.p4) === tableIndex).length <= 0;
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

function handleInterfaceNameInput(groupNo: number) {
  syncSummaryName(parameterTempList.value, groupNo);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleSocketInput(groupNo: number) {
  syncSummarySocketContent(parameterTempList.value, groupNo);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleAddInterface() {
  addInterfaceGroup(parameterTempList.value, props.pageid);
  parameterTempList.value = [...parameterTempList.value];
  syncCheckArr();
  setSaveBtnEnable();
}

async function handleDeleteInterface() {
  const deleteIndexes = checkArr.value.map((checked, index) => (checked ? index : -1)).filter(index => index >= 0);

  if (deleteIndexes.length <= 0) {
    message.info('请选择要删除的接口组');
    return;
  }

  const inputtempids = collectDeletedInputTempIds(parameterTempList.value, deleteIndexes);
  parameterTempList.value = rebuildAfterDeleteGroups(parameterTempList.value, deleteIndexes);
  selectedPointRows.value = [];
  checkArr.value = checkArr.value.map(() => false);
  syncCheckArr();

  if (inputtempids) {
    await delPageInputtempByIds({ inputtempids });
  }

  setSaveBtnEnable();
}

function handleAddPointRow(tableIndex: number) {
  addPointRow(parameterTempList.value, tableIndex);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeletePointRow(tableIndex: number) {
  const selected = selectedPointRows.value.filter(row => Number(row.p4) === tableIndex);
  if (!isValid(selected) || selected.length <= 0) {
    message.info('请选择要删除的行');
    return;
  }
  const deleted = deletePointRows(parameterTempList.value, tableIndex, selected);
  if (!deleted) {
    message.info('请选择要删除的行');
    return;
  }
  selectedPointRows.value = selectedPointRows.value.filter(row => Number(row.p4) !== tableIndex);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleScroll() {
  const anchor = toolbarAnchorRef.value;
  const container = scrollContainer;
  if (!anchor || !container) {
    showFloatToolbar.value = false;
    return;
  }
  const top = anchor.offsetTop - container.scrollTop + 32;
  showFloatToolbar.value = top <= 0;
}

function bindScrollContainer() {
  scrollContainer = document.getElementById('pageContainerDiv');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll, false);
  }
}

function unbindScrollContainer() {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll);
    scrollContainer = null;
  }
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadZt1_532CPageParameters(pageId);
  syncCheckArr();
}

function updateEl() {
  nextTick(() => {
    syncCheckArr();
  });
}

function getCurrentSaveParamValues() {
  return extractZt1_532CSaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  bindScrollContainer();
});

onBeforeUnmount(() => {
  unbindScrollContainer();
});
</script>

<style scoped>
.interface-page {
  padding: 0 10px 24px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  text-align: left;
}

.interface-page__title {
  margin-top: 20px;
  padding-bottom: 8px;
  width: 200px;
  /* border-bottom: 1px solid silver; */
  font-size: 15px;
  font-weight: 600;
  text-align: left;
}

.interface-page__subtitle {
  margin: 10px 0 12px;
  font-size: 15px;
  text-align: left;
}

.interface-page__toolbar {
  margin: 20px 0;
  text-align: left;
}

.interface-page__float-toolbar {
  position: fixed;
  top: 150px;
  left: 24px;
  z-index: 20;
  padding: 8px 12px;
  background: #eee;
  border-radius: 4px;
  text-align: left;
}

.summary-table,
.point-table {
  margin: 0 0 16px;
}

.interface-group {
  margin: 20px 0 0;
  padding-top: 16px;
  border-top: 1px solid #eee;
  text-align: left;
}

.interface-group__header {
  margin-bottom: 12px;
  text-align: left;
}

.interface-group__checkbox {
  font-size: 18px;
}

.interface-group__name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin: 0 0 16px;
  text-align: left;
}

.interface-group__name-input {
  width: 200px;
}

.interface-group__toolbar {
  margin: 0 0 12px;
  text-align: left;
}

.interface-group__connector-title {
  margin: 20px 0 12px;
  text-align: left;
}

.interface-group__textarea-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  margin: 0 0 12px;
  text-align: left;
}

.interface-group__textarea-label {
  width: 40px;
  padding-top: 6px;
  flex-shrink: 0;
  text-align: left;
}

.interface-group__textarea {
  width: 600px;
}

.interface-group__textarea :deep(.ant-input) {
  text-align: left;
}

.interface-group__textarea :deep(.ant-input-textarea-show-count::after) {
  text-align: left;
}

.summary-table :deep(.ant-table),
.point-table :deep(.ant-table) {
  font-size: 12px;
}

.summary-table :deep(.ant-table-thead > tr > th),
.point-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.summary-table :deep(.ant-table-tbody > tr > td),
.point-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: left;
}

.summary-table :deep(.ant-table-selection-column),
.point-table :deep(.ant-table-selection-column) {
  text-align: left;
}

.table-cell-input {
  width: 100%;
}

.table-cell-input :deep(.ant-input) {
  text-align: left;
}
</style>
