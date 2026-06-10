<template>
  <div class="zjzcjh-page">
    <div class="zjzcjh-page__title">车架总成校核</div>

    <a-table
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: tabHeight, x: 810 }"
      :row-key="rowKey"
      class="zjzcjh-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'p2' || column.dataIndex === 'p3'">
          <a-input
            v-model:value="record[String(column.dataIndex)]"
            class="table-cell-input"
            @input="onEditableCellInput(record, index, String(column.dataIndex))" />
        </template>
        <template v-else-if="column.dataIndex === 'p4'">
          <a-space :size="16">
            <a class="link-action" @click="openCheckMethod(index)">检查方法</a>
            <a class="link-action" @click="openSketchMap(index)">示意图</a>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="sketchVisible" title="查看示意图" :mask-closable="false" :width="1015" :footer="null">
      <div class="sketch-wrap">
        <img v-if="sketchUrl" :src="sketchUrl" alt="示意图" class="sketch-img" />
      </div>
    </a-modal>

    <a-modal
      v-model:open="detailVisible"
      title="知识详情"
      :mask-closable="false"
      :width="1300"
      :footer="null"
      :style="{ top: '30px' }"
      @cancel="handleDetailClose">
      <div class="detail-wrap" :style="{ height: `${modelHeight}px` }">
        <iframe
          v-if="detailUrl && matchFileType(detailUrl) === 'pdf'"
          :src="pdfViewerUrl"
          class="detail-frame"
          title="PDF预览" />
        <video
          v-else-if="detailUrl && matchFileType(detailUrl) === 'video'"
          ref="videoRef"
          class="detail-video"
          controls
          preload="auto">
          <source :src="detailUrl" type="video/mp4" />
        </video>
        <img v-else-if="detailUrl" :src="detailUrl" alt="预览" class="detail-img" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import {
  buildPdfViewerUrl,
  CHECK_METHOD_URLS,
  matchFileType,
  SKETCH_IMAGE_URLS,
} from './zjzcjh1-1/mediaAssets';
import { loadZjzcjhPageParameters } from './zjzcjh1-1/loadPageParameters';
import {
  createDefaultZjzcjhParameterList,
  getCheckTableRows,
  type ZjzcjhCheckRow,
  type ZjzcjhParameterItem,
} from './zjzcjh1-1/parameterDefaults';
import { ZJZCJH_TABLE_COLUMNS } from './zjzcjh1-1/tableColumns';

defineOptions({ name: 'rx-customizedProcess-zjzcjh1-1' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ZjzcjhParameterItem[];
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

const tabHeight = 300;
const modelHeight = Math.max(document.body.clientHeight - 240, 480);
const tableColumns = ZJZCJH_TABLE_COLUMNS;

const sketchVisible = ref(false);
const sketchUrl = ref('');
const detailVisible = ref(false);
const detailUrl = ref('');
const videoRef = ref<HTMLVideoElement | null>(null);

const pdfViewerUrl = computed(() => (detailUrl.value ? buildPdfViewerUrl(detailUrl.value) : ''));

function cloneParameterList(source: ZjzcjhParameterItem[]): ZjzcjhParameterItem[] {
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

function createInitialParameterList(): ZjzcjhParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZjzcjhParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<ZjzcjhParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadZjzcjhPageParameters,
  });

const tableRows = computed(() => getCheckTableRows(parameterTempList.value));

function rowKey(record: ZjzcjhCheckRow, index?: number) {
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
        // reserved for scalar params
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

function onEditableCellInput(record: ZjzcjhCheckRow, index: number, field: string) {
  const rows = getCheckTableRows(parameterTempList.value);
  if (rows[index]) {
    rows[index][field] = record[field];
  }
  setSaveBtnEnable();
}

function openCheckMethod(rowIndex: number) {
  const url = CHECK_METHOD_URLS[rowIndex];
  if (!url) return;
  detailUrl.value = url;
  detailVisible.value = true;
}

function openSketchMap(rowIndex: number) {
  const url = SKETCH_IMAGE_URLS[rowIndex];
  if (!url) return;
  sketchUrl.value = url;
  sketchVisible.value = true;
}

function handleDetailClose() {
  if (matchFileType(detailUrl.value) === 'video') {
    videoRef.value?.pause();
  }
}


mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.zjzcjh-page {
  padding: 12px 16px 16px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}

.zjzcjh-page__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 12px;
}

.zjzcjh-table :deep(.ant-table) {
  font-size: 12px;
}

.zjzcjh-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: center;
  background: #fafafa;
}

.zjzcjh-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
}

.table-cell-input {
  width: 100%;
  text-align: center;
}

.table-cell-input :deep(.ant-input) {
  text-align: center;
}

.link-action {
  color: #1979e0;
  cursor: pointer;
  user-select: none;
}

.link-action:hover {
  color: #0958d9;
}

.sketch-wrap {
  width: 100%;
  min-height: 400px;
}

.sketch-img {
  width: 100%;
  max-height: 700px;
  object-fit: contain;
}

.detail-wrap {
  width: 100%;
  overflow: hidden;
}

.detail-frame,
.detail-video,
.detail-img {
  width: 100%;
  height: 90%;
  border: none;
}

.detail-img {
  object-fit: contain;
}
</style>
