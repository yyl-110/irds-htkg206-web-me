<template>
  <div class="zlkwjc-page">
    <div class="zlkwjc-page__header">
      <div class="zlkwjc-page__title">纵梁孔位检查</div>
      <a class="link-action" @click="handleHoleCheck">模型检查</a>
    </div>

    <a-table
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: tabHeight, x: 620 }"
      :row-key="rowKey"
      v-model:expanded-row-keys="expandedRowKeys"
      :row-expandable="isRowExpandable"
      class="zlkwjc-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'p2'">
          <span :class="resultClass(record.p2)">{{ record.p2 || '' }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'p3'">
          <a class="link-action" @click="openCheckMethod(index)">检查方法</a>
        </template>
      </template>

      <template #expandedRowRender="{ record, index }">
        <div v-if="getFailedRowExpandItems(checkReturnValue, index).length" class="expand-panel">
          <div
            v-for="(item, itemIndex) in getFailedRowExpandItems(checkReturnValue, index)"
            :key="`${record.p0}-${itemIndex}`"
            class="expand-panel__item">
            <a class="link-action" @click="highlightHole(index, itemIndex)">
              {{ itemIndex + 1 }}&nbsp;&nbsp;孔位高亮&nbsp;&nbsp;
            </a>
            <span class="expand-panel__info">{{ item.info }}</span>
          </div>
        </div>
      </template>
    </a-table>

    <a-modal
      v-model:open="detailVisible"
      title="知识详情"
      :mask-closable="false"
      :width="1300"
      :footer="null"
      :style="{ top: '30px' }">
      <div class="detail-wrap" :style="{ height: `${modelHeight}px` }">
        <iframe
          v-if="detailUrl && matchFileType(detailUrl) === 'pdf'"
          :src="pdfViewerUrl"
          class="detail-frame"
          title="PDF预览" />
        <img v-else-if="detailUrl" :src="detailUrl" alt="预览" class="detail-img" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { apiExtHoleCheck, apiExtHoleCheckShow } from '@/libs/webSocket';
import { buildPdfViewerUrl, CHECK_METHOD_URLS, matchFileType } from './zlkwjc1-1/mediaAssets';
import { applyHoleCheckResults, getFailedRowExpandItems, type HoleCheckResponse } from './zlkwjc1-1/holeCheck';
import {
  extractZlkwjcSaveParamValues,
  extractZlkwjcTableSavePayload,
  loadZlkwjcPageParameters,
} from './zlkwjc1-1/loadPageParameters';
import {
  createDefaultZlkwjcParameterList,
  ensureZlkwjcTableComponentIds,
  getCheckTableRows,
  setCheckTableRows,
  ZLKWJC1_1_TABLE_INDEX,
  type ZlkwjcCheckRow,
  type ZlkwjcParameterItem,
} from './zlkwjc1-1/parameterDefaults';
import { ZLKWJC_TABLE_COLUMNS } from './zlkwjc1-1/tableColumns';

defineOptions({ name: 'rx-customizedProcess-zlkwjc1-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ZlkwjcParameterItem[];
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


const tabHeight = 420;
const modelHeight = Math.max(document.body.clientHeight - 240, 480);
const tableColumns = ZLKWJC_TABLE_COLUMNS;

const detailVisible = ref(false);
const detailUrl = ref('');
const checkReturnValue = ref<HoleCheckResponse | null>(null);
const expandedRowKeys = ref<string[]>([]);

const pdfViewerUrl = computed(() => (detailUrl.value ? buildPdfViewerUrl(detailUrl.value) : ''));

function cloneParameterList(source: ZlkwjcParameterItem[]): ZlkwjcParameterItem[] {
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

function createInitialParameterList(): ZlkwjcParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZlkwjcParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<ZlkwjcParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, setupParameterWatch, mountWithTaskParamMap } = useCustomPageTaskParamMap({
  props,
  parameterTempList,
  loadPageParameters: loadZlkwjcPageParameters,
});

const tableRows = computed(() => getCheckTableRows(parameterTempList.value));

function rowKey(record: ZlkwjcCheckRow, index?: number) {
  return String(record.p0 ?? index ?? '');
}

function resultClass(value?: string) {
  if (value === '不通过') return 'result-text result-text--fail';
  if (value === '通过') return 'result-text result-text--pass';
  return 'result-text';
}

function syncExpandedRowKeys() {
  expandedRowKeys.value = tableRows.value.filter(row => row.p2 === '不通过').map(row => String(row.p0 ?? ''));
}

function isRowExpandable(record: ZlkwjcCheckRow) {
  return record.p2 === '不通过';
}

function setSaveBtnEnable() {
  emit('setSaveBtnEnable', true);
}

function handleHoleCheck() {
  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;
  apiExtHoleCheck(instance, 1, 1, [1, 1]);
}

function initUdfCheckData(returnJson: HoleCheckResponse) {
  checkReturnValue.value = returnJson;
  const currentRows = getCheckTableRows(parameterTempList.value);
  const nextRows = applyHoleCheckResults(currentRows, returnJson);
  setCheckTableRows(parameterTempList.value, nextRows);
  syncExpandedRowKeys();
  setSaveBtnEnable();
}

function openCheckMethod(rowIndex: number) {
  const url = CHECK_METHOD_URLS[rowIndex];
  if (!url) return;
  detailUrl.value = url;
  detailVisible.value = true;
}

function highlightHole(rowIndex: number, itemIndex: number) {
  const dataItem = checkReturnValue.value?.data?.[rowIndex];
  const item = dataItem?.items?.[itemIndex];
  if (!item) return;

  const instance = getCurrentInstance()?.proxy;
  if (!instance) return;

  apiExtHoleCheckShow(instance, item.model, item.path, item.id1, item.id2);
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function syncParameterListBeforeSave() {
  const rows = getCheckTableRows(parameterTempList.value);
  const tableItem = parameterTempList.value[ZLKWJC1_1_TABLE_INDEX];
  if (tableItem?.tableMap) {
    tableItem.tableMap.rowData = rows.map(row => ({ ...row }));
    tableItem.tableMap.rowNums = String(rows.length);
  }
}

function getCurrentSaveParamValues() {
  syncParameterListBeforeSave();
  return extractZlkwjcSaveParamValues(parameterTempList.value);
}

function getCurrentTableSavePayload() {
  syncParameterListBeforeSave();
  return extractZlkwjcTableSavePayload(ensureZlkwjcTableComponentIds(parameterTempList.value));
}

defineExpose({
  initUdfCheckData,
  updateEl,
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.zlkwjc-page {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 680px;
  box-sizing: border-box;
}

.zlkwjc-page__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.zlkwjc-page__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.zlkwjc-table :deep(.ant-table) {
  font-size: 12px;
}

.zlkwjc-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.zlkwjc-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.link-action {
  color: #1979e0;
  cursor: pointer;
  user-select: none;
  text-decoration: underline;
}

.link-action:hover {
  color: #0958d9;
}

.result-text {
  color: rgba(0, 0, 0, 0.65);
}

.result-text--fail {
  color: #ff4d4f;
}

.result-text--pass {
  color: rgba(0, 0, 0, 0.65);
}

.expand-panel {
  padding: 4px 8px 8px 48px;
}

.expand-panel__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.expand-panel__info {
  color: rgba(0, 0, 0, 0.88);
  line-height: 22px;
}

.detail-wrap {
  width: 100%;
  overflow: hidden;
}

.detail-frame,
.detail-img {
  width: 100%;
  height: 90%;
  border: none;
}

.detail-img {
  object-fit: contain;
}
</style>
