<template>
  <div class="opening-page">
    <div class="opening-page__header">
      <span class="opening-page__title">开口参数设计：</span>
      <a-space :size="12">
        <a-button type="primary" @click="handleAddRow">
          <template #icon><PlusOutlined /></template>
          添加行
        </a-button>
        <a-button type="primary" danger :disabled="rowFlag" @click="handleDeleteRows">
          <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
          删除
        </a-button>
        <a-button type="primary" :disabled="uploadFlag" @click="openUploadModal">
          <template #icon><UploadOutlined /></template>
          图片上传
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      bordered
      size="small"
      :scroll="{ y: tabHeight, x: 'max-content' }"
      :row-key="tableRowKey"
      :row-selection="rowSelection"
      class="opening-table">
      <template #bodyCell="{ column, record }">
        <template v-if="resolveColumn(column)?.cellMode === 'text'">
          <span>{{ record[String(column.dataIndex)] }}</span>
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'editable'">
          <a-input v-model:value="record[String(column.dataIndex)]" class="table-cell-input" @input="setSaveBtnEnable()" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'required'">
          <a-input
            v-model:value="record[String(column.dataIndex)]"
            class="table-cell-input"
            @blur="handleRequiredBlur(record, String(column.dataIndex), resolveColumn(column)?.requiredMessage, $event)"
            @input="setSaveBtnEnable()" />
        </template>
        <template v-else-if="resolveColumn(column)?.cellMode === 'link'">
          <a v-if="record.p6" class="opening-link" @click.prevent="handlePreviewRowImage(record as OpeningParamRow)">
            {{ record.p6 }}
          </a>
        </template>
      </template>
    </a-table>

    <draggable-modal
      v-model:visible="uploadModalVisible"
      title="图片上传"
      :width="680"
      :mask-closable="false"
      @cancel="closeUploadModal">
      <div class="upload-panel">
        <div v-if="!uploadPreviewUrl" class="upload-dragger-wrap">
          <a-upload-dragger
            :max-count="1"
            :multiple="false"
            accept="image/jpeg,image/jpg,image/png"
            :file-list="uploadFileList"
            :custom-request="customRequestUpload"
            :before-upload="beforeUpload"
            @remove="clearUploadState">
            <p class="ant-upload-drag-icon">
              <CameraOutlined />
            </p>
            <p class="ant-upload-text">点击或拖拽图片到此处上传</p>
            <p class="ant-upload-hint">支持 jpg、jpeg、png，大小不超过 2MB</p>
          </a-upload-dragger>
        </div>
        <div v-else class="upload-preview">
          <img :src="uploadPreviewUrl" alt="上传预览" class="upload-preview__img" />
          <div class="upload-preview__actions">
            <EyeOutlined @click="handlePreviewUploadImage" />
            <DeleteOutlined @click="clearUploadState" />
          </div>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="confirmUpload">确定</a-button>
        <a-button @click="closeUploadModal">取消</a-button>
      </template>
    </draggable-modal>

    <draggable-modal
      v-model:visible="previewModalVisible"
      title="查看图片"
      :width="820"
      :mask-closable="false"
      :footer="null">
      <div class="preview-wrap">
        <img v-if="previewPicUrl" :src="previewPicUrl" alt="图片预览" class="preview-img" />
      </div>
    </draggable-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { CameraOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import draggableModal from '@/components/DraggableModal/index.vue';
import { isValid } from '@/api/flowData/flowData';
import { useUserStore } from '@/store/modules/user';
import { previewUrlFile } from '@/utils/file';
import { loadFs151_6PageParameters } from './FS1_5_1_6/loadPageParameters';
import {
  createDefaultFs151_6ParameterList,
  getOpeningParamRows,
  type Fs151_6ParameterItem,
  type OpeningParamRow,
} from './FS1_5_1_6/parameterDefaults';
import { addOpeningParamRow, deleteOpeningParamRows, extractFs151_6SaveParamValues } from './FS1_5_1_6/rowOperations';
import { OPENING_PARAM_COLUMN_MAP, OPENING_PARAM_TABLE_COLUMNS, type OpeningAntColumn } from './FS1_5_1_6/tableColumns';

defineOptions({ name: 'rx-customizedProcess3-FS1-5-1_6' });

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: Fs151_6ParameterItem[];
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
const tabHeight = 520;
const tableColumns = OPENING_PARAM_TABLE_COLUMNS;

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<OpeningParamRow[]>([]);
const uploadModalVisible = ref(false);
const previewModalVisible = ref(false);
const previewPicUrl = ref('');
const uploadFileList = ref<UploadFile[]>([]);
const uploadPreviewUrl = ref('');
const pendingUpload = ref({ fileName: '', fileUrl: '' });

function cloneParameterList(source: Fs151_6ParameterItem[]): Fs151_6ParameterItem[] {
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

function createInitialParameterList(): Fs151_6ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return createDefaultFs151_6ParameterList(props.pageid);
  }
  return cloneParameterList(props.parameterTempList);
}

const parameterTempList = ref<Fs151_6ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadFs151_6PageParameters,
  });

const tableRows = computed(() => getOpeningParamRows(parameterTempList.value));
const rowFlag = computed(() => selectedRows.value.length <= 0);
const uploadFlag = computed(() => selectedRows.value.length !== 1);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: OpeningParamRow[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

function resolveColumn(column: { dataIndex?: string | number }): OpeningAntColumn | undefined {
  return OPENING_PARAM_COLUMN_MAP.get(String(column.dataIndex ?? ''));
}

function tableRowKey(record: OpeningParamRow, index?: number) {
  if (record.id != null && record.id !== '') return String(record.id);
  return String(record.delIndex ?? record.p0 ?? index ?? '');
}

function resolveImageUrl(raw?: string) {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('/')) return value;
  return previewUrlFile(value);
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

function handleRequiredBlur(record: OpeningParamRow, field: string, errorMessage: string | undefined, event: FocusEvent) {
  const value = (event.target as HTMLInputElement | null)?.value ?? '';
  if (!value.trim()) {
    message.error(errorMessage ?? '请输入内容');
    return;
  }
  record[field] = value;
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleAddRow() {
  addOpeningParamRow(parameterTempList.value);
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function handleDeleteRows() {
  if (!isValid(selectedRows.value) || selectedRows.value.length <= 0) {
    message.info('请先选择要删除的行');
    return;
  }
  deleteOpeningParamRows(parameterTempList.value, selectedRows.value);
  selectedRowKeys.value = [];
  selectedRows.value = [];
  parameterTempList.value = [...parameterTempList.value];
  setSaveBtnEnable();
}

function openUploadModal() {
  if (selectedRows.value.length !== 1) {
    message.info('请先选择一行进行图片上传');
    return;
  }
  clearUploadState();
  uploadModalVisible.value = true;
}

function closeUploadModal() {
  uploadModalVisible.value = false;
  clearUploadState();
}

function clearUploadState() {
  uploadFileList.value = [];
  uploadPreviewUrl.value = '';
  pendingUpload.value = { fileName: '', fileUrl: '' };
}

function beforeUpload(file: File) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowed.includes(file.type)) {
    message.warning('您上传的图片格式有误，应为 jpg、jpeg、png 格式');
    return false;
  }
  if (file.size / 1024 / 1024 > 2) {
    message.warning('此图片最大不应超过 2M');
    return false;
  }
  return true;
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
      const fileUrl = String(uploadData.fileUrl ?? '');
      const fileId = String(uploadData.id ?? '');
      pendingUpload.value = {
        fileName: String(uploadData.oldFileName ?? file.name ?? ''),
        fileUrl: fileUrl || (fileId ? previewUrlFile(fileId) : ''),
      };
      uploadPreviewUrl.value = pendingUpload.value.fileUrl;
      onSuccess?.(uploadData, file);
      message.success('上传成功');
    } else {
      message.error(String(uploadData?.msg ?? '上传失败'));
      onError?.(new Error('upload failed'));
    }
  } catch {
    message.error('上传失败');
    onError?.(new Error('upload failed'));
  }
}

function confirmUpload() {
  if (selectedRows.value.length !== 1) {
    message.info('请先选择一行');
    return;
  }
  if (!pendingUpload.value.fileName || !pendingUpload.value.fileUrl) {
    message.info('请先上传图片');
    return;
  }

  const target = selectedRows.value[0];
  const rows = getOpeningParamRows(parameterTempList.value);
  const row = rows.find(item => tableRowKey(item) === tableRowKey(target));
  if (!row) {
    message.info('未找到目标行');
    return;
  }

  row.p6 = pendingUpload.value.fileName;
  row.p12 = pendingUpload.value.fileUrl;
  parameterTempList.value = [...parameterTempList.value];
  uploadModalVisible.value = false;
  clearUploadState();
  setSaveBtnEnable();
}

function handlePreviewRowImage(record: OpeningParamRow) {
  const url = resolveImageUrl(String(record.p12 ?? ''));
  if (!url) return;
  previewPicUrl.value = url;
  previewModalVisible.value = true;
}

function handlePreviewUploadImage() {
  if (!uploadPreviewUrl.value) return;
  previewPicUrl.value = uploadPreviewUrl.value;
  previewModalVisible.value = true;
}


function updateEl() {
  nextTick(() => {
    applyTaskParamMapToList();
  });
}

setupParameterWatch(updateEl);

function getCurrentSaveParamValues() {
  return extractFs151_6SaveParamValues(parameterTempList.value);
}

defineExpose({
  updateEl,
  getCurrentSaveParamValues,
  setSaveBtnEnable,
});

mountWithTaskParamMap(updateEl);
</script>

<style scoped>
.opening-page {
  padding: 20px 10px 24px;
  min-height: 635px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
}

.opening-page__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  padding-left: 10px;
}

.opening-page__title {
  font-size: 15px;
  font-weight: 600;
}

.opening-table {
  width: 100%;
}

.opening-table :deep(.ant-table) {
  font-size: 12px;
}

.opening-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 8px;
  text-align: left;
  background: #fafafa;
}

.opening-table :deep(.ant-table-tbody > tr > td) {
  padding: 4px 8px;
  text-align: left;
}

.table-cell-input {
  width: 100%;
}

.opening-link {
  color: #1979e0;
  text-decoration: underline;
  cursor: pointer;
}

.upload-panel {
  min-height: 365px;
  padding: 10px;
}

.upload-dragger-wrap {
  width: 100%;
}

.upload-preview {
  position: relative;
  width: 100%;
  height: 338px;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.upload-preview__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-preview:hover .upload-preview__actions {
  display: flex;
}

.upload-preview__actions {
  display: none;
  position: absolute;
  inset: 0;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 30px;
}

.upload-preview__actions :deep(.anticon) {
  cursor: pointer;
}

.preview-wrap {
  width: 800px;
  max-width: 100%;
  height: 600px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
