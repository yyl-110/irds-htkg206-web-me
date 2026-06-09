<template>
  <div class="segment-page">
    <section v-for="cabinNo in cabinCount" :key="cabinNo" class="cabin-block">
      <div class="cabin-block__header">
        <span class="cabin-block__title">设备舱{{ cabinNo }}：</span>
        <span class="cabin-block__label">名称：</span>
        <a-input :value="sbcModelData[cabinNo - 1]?.p1 ?? ''" class="cabin-block__input cabin-block__input--name" disabled />
        <span class="cabin-block__label">舱体长(mm)：</span>
        <a-input
          :value="resolveCabinetLength(sbcModelData[cabinNo - 1])"
          class="cabin-block__input cabin-block__input--length"
          disabled />
        <span class="cabin-block__label">舱段数量:</span>
        <a-select
          v-model:value="segmentCountRow[`p${cabinNo - 1}`]"
          class="cabin-block__count-select"
          :options="segmentCountOptions"
          @change="createSegmentCountChangeHandler(cabinNo)" />
      </div>

      <div class="segment-list">
        <div v-for="(row, rowIndex) in visibleSegmentRows(cabinNo)" :key="`${cabinNo}-${rowIndex}`" class="segment-card">
          <div class="segment-card__title">舱段{{ rowIndex + 1 }}:</div>

          <div class="segment-form">
            <div class="segment-form__row">
              <span class="segment-form__label">舱段名称:</span>
              <a-input v-model:value="row.p0" class="segment-form__control" @blur="setSaveBtnEnable()" />

              <span class="segment-form__label">电缆线槽布置:</span>
              <PicAttachmentField
                v-model="row.p1"
                @update:model-value="setSaveBtnEnable()"
                @browse="openUploadModal(cabinNo, rowIndex, 'p1')"
                @preview="previewPicFile" />
            </div>

            <div class="segment-form__row">
              <span class="segment-form__label">舱段长度(mm):</span>
              <a-input-number
                v-model:value="row.p2"
                type="number"
                class="segment-form__control"
                @blur="setSaveBtnEnable()" />

              <span class="segment-form__label">照明设备位置:</span>
              <PicAttachmentField
                v-model="row.p3"
                @update:model-value="setSaveBtnEnable()"
                @browse="openUploadModal(cabinNo, rowIndex, 'p3')"
                @preview="previewPicFile" />
            </div>

            <div class="segment-form__row">
              <span class="segment-form__label">保温层:</span>
              <a-select
                v-model:value="row.p4"
                class="segment-form__control"
                :options="insulationOptions"
                @change="setSaveBtnEnable()" />

              <span class="segment-form__label">开窗布置:</span>
              <PicAttachmentField
                v-model="row.p5"
                @update:model-value="setSaveBtnEnable()"
                @browse="openUploadModal(cabinNo, rowIndex, 'p5')"
                @preview="previewPicFile" />
            </div>

            <div class="segment-form__row">
              <span class="segment-form__label">电缆穿舱孔布置:</span>
              <PicAttachmentField
                v-model="row.p6"
                @update:model-value="setSaveBtnEnable()"
                @browse="openUploadModal(cabinNo, rowIndex, 'p6')"
                @preview="previewPicFile" />

              <span class="segment-form__label">散热空间布置:</span>
              <PicAttachmentField
                v-model="row.p7"
                @update:model-value="setSaveBtnEnable()"
                @browse="openUploadModal(cabinNo, rowIndex, 'p7')"
                @preview="previewPicFile" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <a-modal
      v-model:visible="uploadModalVisible"
      title="上传图片文件"
      :mask-closable="false"
      :width="480"
      @cancel="closeUploadModal">
      <a-upload
        :max-count="1"
        :multiple="false"
        accept="image/jpeg,image/jpg,image/png"
        :file-list="uploadFileList"
        :custom-request="customRequestUpload"
        @remove="clearUploadState">
        请选择图片文件：
        <a-button style="margin-top: 12px">
          <template #icon><UploadOutlined /></template>
          上传文件
        </a-button>
      </a-upload>
      <template #footer>
        <a-button type="primary" @click="confirmUpload">确定</a-button>
        <a-button @click="closeUploadModal">取消</a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="previewModalVisible"
      :title="previewFileName"
      :mask-closable="true"
      :width="1000"
      :footer="null">
      <div class="preview-wrap">
        <img v-if="previewPicUrl" :src="previewPicUrl" alt="预览" class="preview-img" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile } from 'ant-design-vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import { previewUrlFile } from '@/utils/file';
import { readCabinetCountFromFlow, readCabinetModelDataFromFlow } from './ZT1_4_10_2/flowSync';
import { loadZt1_4102PageParameters } from './ZT1_4_10_2/loadPageParameters';
import { formatPicField, parsePicField } from './ZT1_4_10_2/picFieldUtils';
import PicAttachmentField from './ZT1_4_10_2/PicAttachmentField.vue';
import {
  createDefaultZt1_4102ParameterList,
  getCabinetSegmentCount,
  getSegmentCountRow,
  getSegmentRows,
  INSULATION_OPTIONS,
  resolveCabinetLength,
  SEGMENT_COUNT_OPTIONS,
  type SbcModelSummaryRow,
  type Zt1_4102ParameterItem,
  type Zt1SegmentRow,
} from './ZT1_4_10_2/parameterDefaults';
import { extractZt1_4102SaveParamValues, syncSegmentRowCount } from './ZT1_4_10_2/segmentOperations';

defineOptions({ name: 'rx-customizedProcess1-ZT1_4_10_2' });

const props = withDefaults(
  defineProps<{
    checkId?: string;
    categoryId?: string;
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Zt1_4102ParameterItem[];
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
const userStore = useUserStore();

const segmentCountOptions = SEGMENT_COUNT_OPTIONS.map(value => ({ label: value, value }));
const insulationOptions = INSULATION_OPTIONS;

const cabinCount = ref(2);
const sbcModelData = ref<SbcModelSummaryRow[]>([]);
const uploadModalVisible = ref(false);
const previewModalVisible = ref(false);
const previewPicUrl = ref('');
const previewFileName = ref('');
const uploadFileList = ref<UploadFile[]>([]);
const pendingUpload = ref({ fileId: '', fileName: '', newFileName: '' });
const uploadTarget = ref({ cabinNo: 0, rowIndex: -1, field: '' as keyof Zt1SegmentRow });

function cloneParameterList(source: Zt1_4102ParameterItem[]): Zt1_4102ParameterItem[] {
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

function createInitialParameterList(): Zt1_4102ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultZt1_4102ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Zt1_4102ParameterItem[]>(createInitialParameterList());
const segmentCountRow = computed(() => getSegmentCountRow(parameterTempList.value));

watch(
  () => props.parameterTempList,
  val => {
    if (val && val.length > 0) {
      parameterTempList.value = cloneParameterList(val);
    }
  },
  { deep: true },
);

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

function syncFlowContextData() {
  cabinCount.value = readCabinetCountFromFlow(2);
  sbcModelData.value = readCabinetModelDataFromFlow();
}

function visibleSegmentRows(cabinNo: number): Zt1SegmentRow[] {
  const rows = getSegmentRows(parameterTempList.value, cabinNo);
  const count = getCabinetSegmentCount(parameterTempList.value, cabinNo - 1);
  return rows.slice(0, count);
}

function createSegmentCountChangeHandler(cabinNo: number) {
  return (value: string | number | null | undefined) => {
    handleSegmentCountChange(cabinNo, value);
  };
}

function handleSegmentCountChange(cabinNo: number, value: string | number | null | undefined) {
  const count = Number(value ?? 2);
  syncSegmentRowCount(parameterTempList.value, cabinNo, count);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function openUploadModal(cabinNo: number, rowIndex: number, field: keyof Zt1SegmentRow) {
  uploadTarget.value = { cabinNo, rowIndex, field };
  clearUploadState();
  uploadModalVisible.value = true;
}

function closeUploadModal() {
  uploadModalVisible.value = false;
  clearUploadState();
}

function clearUploadState() {
  uploadFileList.value = [];
  pendingUpload.value = { fileId: '', fileName: '', newFileName: '' };
}

async function customRequestUpload(options: {
  file: File | Blob | string;
  onSuccess?: (body: unknown, file?: File) => void;
  onError?: (e: Error) => void;
}) {
  const { file, onSuccess, onError } = options;
  if (!(file instanceof File)) {
    onError?.(new Error('invalid file'));
    return;
  }
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file,
      userId: userStore.getUser.id as number,
      confidentialLevel: 1,
    });
    const uploadData = uploadRes?.data as Record<string, unknown> | undefined;
    if (uploadData?.code == 0) {
      pendingUpload.value = {
        fileId: String(uploadData.id ?? ''),
        fileName: String(uploadData.oldFileName ?? file.name ?? ''),
        newFileName: String(uploadData.newFileName ?? uploadData.oldFileName ?? file.name ?? ''),
      };
      onSuccess?.(uploadData, file);
      message.success('上传成功');
    } else {
      message.error('上传失败');
      onError?.(new Error('upload failed'));
    }
  } catch {
    message.error('上传失败');
    onError?.(new Error('upload failed'));
  }
}

function confirmUpload() {
  const { cabinNo, rowIndex, field } = uploadTarget.value;
  if (cabinNo <= 0 || rowIndex < 0 || !field) {
    message.info('未成功上传文件');
    return;
  }
  if (!pendingUpload.value.fileId) {
    message.info('请先上传图片文件');
    return;
  }

  const rows = getSegmentRows(parameterTempList.value, cabinNo);
  if (!rows[rowIndex]) {
    message.info('未找到目标舱段');
    return;
  }

  rows[rowIndex][field] = formatPicField(
    pendingUpload.value.fileId,
    pendingUpload.value.fileName,
    pendingUpload.value.newFileName,
  );
  parameterTempList.value = [...parameterTempList.value];
  uploadModalVisible.value = false;
  clearUploadState();
  setSaveBtnEnable();
}

function previewPicFile(value: string) {
  const parts = parsePicField(value);
  const fileId = parts.fileId || parts.newFileName;
  if (!fileId) return;
  previewFileName.value = parts.fileName || '图片预览';
  previewPicUrl.value = previewUrlFile(fileId);
  previewModalVisible.value = true;
}

async function loadPageParametersIfNeeded() {
  if (props.parameterTempList && props.parameterTempList.length > 0) return;
  const pageId = String(props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '').trim();
  if (!pageId) return;
  parameterTempList.value = await loadZt1_4102PageParameters(pageId);
}

function updateEl() {
  nextTick(() => {
    syncFlowContextData();
  });
}

function getCurrentSaveParamValues() {
  return extractZt1_4102SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  syncFlowContextData();
});
</script>

<style scoped>
.segment-page {
  padding: 20px 10px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.cabin-block + .cabin-block {
  margin-top: 24px;
}

.cabin-block__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
}

.cabin-block__title {
  margin-left: 10px;
}

.cabin-block__label {
  font-weight: 600;
}

.cabin-block__input--name {
  width: 120px;
}

.cabin-block__input--length {
  width: 80px;
}

.cabin-block__count-select {
  width: 80px;
}

.segment-list {
  margin-left: 50px;
}

.segment-card + .segment-card {
  margin-top: 24px;
}

.segment-card__title {
  font-weight: 600;
  margin-bottom: 10px;
}

.segment-form__row {
  display: grid;
  grid-template-columns: 130px minmax(220px, 1fr) 130px minmax(220px, 1fr);
  gap: 10px 12px;
  align-items: center;
  margin-bottom: 10px;
}

.segment-form__label {
  color: rgba(0, 0, 0, 0.88);
}

.segment-form__control {
  width: 100%;
  max-width: 200px;
}

.preview-wrap {
  max-height: 600px;
  overflow: auto;
  text-align: center;
}

.preview-img {
  max-width: 100%;
}
</style>
