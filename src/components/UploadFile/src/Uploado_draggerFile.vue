<script setup lang="ts" name="Uploado_draggerFile">
import { computed, ref, watch } from 'vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message, Upload } from 'ant-design-vue';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { dePreviewFile } from '@/utils/file';
import UploadModal from '@/views/product/components/upload-modal.vue';

interface Props {
  fileSize?: number;
  fileList?: Array<UploadFile>;
  confidentialLevel?: number;
  width?: string;
  fileTypesImg?: boolean;
  /** 有外层表单密级时传入 */
  formConfidentialLevel?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  fileSize: 10,
  fileTypesImg: false,
});
const emit = defineEmits<{
  customRequest: [options: any];
  change: [UploadfileList: Array<UploadFile>];
}>();

const userStore = useUserStore();
const uploadModalVisible = ref(false);
const attachmentLevel = ref(
  Number(props.confidentialLevel ?? userStore.getConfidentialLevel[0]?.value ?? 0),
);
const innerFileList = ref<UploadFile[]>([]);

watch(
  () => props.fileList,
  v => {
    innerFileList.value = v ? [...v] : [];
  },
  { immediate: true, deep: true },
);

watch(
  () => props.confidentialLevel,
  v => {
    if (v !== undefined && v !== null && Number.isFinite(Number(v))) {
      attachmentLevel.value = Number(v);
    }
  },
  { immediate: true },
);

const acceptStr = computed(() =>
  props.fileTypesImg ? 'image/jpeg,image/jpg,image/png,image/gif' : '*',
);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  let ok = file.size / 1024 / 1024 < props.fileSize;
  if (!ok) {
    message.warn(`上传文件大小不能超过 ${props.fileSize}M！`);
  } else if (props.fileTypesImg) {
    const allow = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allow.includes(file.type)) {
      message.warn(`上传文件类型错误，请上传图片文件！`);
      ok = false;
    }
  }
  return ok || Upload.LIST_IGNORE;
};

function passCustomRequest(options: Parameters<NonNullable<UploadProps['customRequest']>>[0]) {
  emit('customRequest', options);
}

function onUploadChange(info: UploadChangeParam) {
  innerFileList.value = [...info.fileList];
  emit('change', innerFileList.value);
}

function onUploadPreview(file: UploadFile) {
  let fileUels = '';
  const f = file as UploadFile & { filePathl?: string; filePath?: string; fileUrl?: string };
  if (f.filePathl) fileUels = f.filePathl;
  else if (f.filePath) fileUels = f.filePath;
  else if (f.fileUrl) fileUels = f.fileUrl;
  if (!fileUels) return;
  if (fileUels.startsWith('http')) window.open(fileUels);
  else window.open(`${import.meta.env.VITE_MINIO_PREVIEW_URL}${fileUels}`);
}

function onRemoveFile() {
  innerFileList.value = [];
  emit('change', []);
}

function removeListedFile(file: UploadFile) {
  innerFileList.value = innerFileList.value.filter(item => item.uid !== file.uid);
  emit('change', [...innerFileList.value]);
}

function onModalConfirm() {
  emit('change', [...innerFileList.value]);
}

function parseUploadFileId(file: UploadFile): string {
  const anyFile = file as UploadFile & { id?: string; queryId?: string };
  const direct = anyFile.id ?? anyFile.queryId;
  if (direct != null && String(direct).trim() !== '')
    return String(direct).trim();
  const raw = file.response;
  if (!raw || typeof raw !== 'object')
    return '';
  const body = raw as Record<string, unknown>;
  const nested = body.data;
  if (nested && typeof nested === 'object')
    return String((nested as Record<string, unknown>).id ?? (nested as Record<string, unknown>).queryId ?? '').trim();
  return String(body.id ?? body.queryId ?? '').trim();
}

function getListedFilePreviewUrl(file: UploadFile): string {
  if (file.url)
    return String(file.url);
  if (file.thumbUrl)
    return String(file.thumbUrl);
  const f = file as UploadFile & { filePathl?: string; filePath?: string; fileUrl?: string };
  let path = '';
  if (f.filePathl)
    path = f.filePathl;
  else if (f.filePath)
    path = f.filePath;
  else if (f.fileUrl)
    path = f.fileUrl;
  if (path) {
    return path.startsWith('http') ? path : `${import.meta.env.VITE_MINIO_PREVIEW_URL}${path}`;
  }
  const fileId = parseUploadFileId(file);
  if (props.fileTypesImg && fileId)
    return dePreviewFile(fileId);
  return '';
}

const hintText = computed(() =>
  props.fileTypesImg ? '支持文件类型.jpg,.png,.gif,.jpeg，文件大小最大10兆' : '文件大小在限制内；支持多种格式',
);
</script>

<template>
  <div class="upload-box" :style="{ width: width }">
    <a-button type="primary" @click="uploadModalVisible = true">
      <UploadOutlined />
      {{ $t('打开上传') }}
    </a-button>
    <p class="Attention">{{ hintText }}</p>
    <ul v-if="innerFileList.length" class="upload-file-list">
      <li v-for="file in innerFileList" :key="file.uid" class="upload-file-list__item">
        <img
          v-if="fileTypesImg && getListedFilePreviewUrl(file)"
          class="upload-file-list__thumb"
          :src="getListedFilePreviewUrl(file)"
          :alt="file.name"
        >
        <span class="upload-file-list__name" :title="file.name">{{ file.name }}</span>
        <span class="upload-file-list__actions">
          <a-button type="link" size="small" class="upload-file-list__action" @click="onUploadPreview(file)">
            <EyeOutlined />
          </a-button>
          <a-button type="link" size="small" danger class="upload-file-list__action" @click="removeListedFile(file)">
            <DeleteOutlined />
          </a-button>
        </span>
      </li>
    </ul>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="attachmentLevel"
      :accept="acceptStr"
      :file-list="innerFileList"
      :before-upload="beforeUpload"
      :custom-request="passCustomRequest"
      :form-confidential-level="formConfidentialLevel"
      :max-count="1"
      @upload-change="onUploadChange"
      @upload-preview="onUploadPreview"
      @remove-file="onRemoveFile"
      @confirm="onModalConfirm" />
  </div>
</template>

<style scoped lang="less">
.upload-box {
  margin-top: 10px;
}
.Attention {
  margin-top: 8px;
  color: #9e9fa2;
  font-size: 12px;
}

.upload-file-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.upload-file-list__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.upload-file-list__thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.upload-file-list__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
}

.upload-file-list__actions {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.upload-file-list__action {
  padding: 0 4px;
  height: auto;
}
</style>
