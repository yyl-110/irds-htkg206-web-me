<script setup lang="ts" name="Uploado_draggerMoreFile">
import { ref, watch } from 'vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message, Upload } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
import UploadModal from '@/views/product/components/upload-modal.vue';

interface Props {
  fileSize?: number;
  fileList?: Array<UploadFile>;
  width?: string;
  disabled?: boolean;
  /** 最大文件数，与历史多文件拖拽一致 */
  maxFileCount?: number;
  formConfidentialLevel?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  fileSize: 300,
  maxFileCount: 99,
});
const emit = defineEmits<{
  customRequest: [options: any];
  change: [payload: UploadFile[] | UploadChangeParam];
}>();

const userStore = useUserStore();
const uploadModalVisible = ref(false);
const attachmentLevel = ref(Number(userStore.getConfidentialLevel[0]?.value ?? 0));
const innerFileList = ref<UploadFile[]>([]);

watch(
  () => props.fileList,
  v => {
    innerFileList.value = v ? [...v] : [];
  },
  { immediate: true, deep: true },
);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const ok = file.size / 1024 / 1024 < props.fileSize;
  if (!ok) message.warn(`上传文件大小不能超过 ${props.fileSize}M！`);
  return ok || Upload.LIST_IGNORE;
};

function passCustomRequest(options: Parameters<NonNullable<UploadProps['customRequest']>>[0]) {
  emit('customRequest', options);
}

function onUploadChange(info: UploadChangeParam) {
  innerFileList.value = [...info.fileList];
  emit('change', info);
}

function onUploadPreview(file: UploadFile) {
  const f = file as UploadFile & { filePathl?: string; filePath?: string; fileUrl?: string };
  let fileUels = '';
  if (f.filePathl) fileUels = f.filePathl;
  else if (f.filePath) fileUels = f.filePath;
  else if (f.fileUrl) fileUels = f.fileUrl;
  if (!fileUels) return;
  if (fileUels.startsWith('http')) window.open(fileUels);
  else window.open(`${import.meta.env.VITE_MINIO_PREVIEW_URL}${fileUels}`);
}

function onRemoveFile() {
  innerFileList.value = [];
}

function onModalConfirm() {
  emit('change', [...innerFileList.value]);
}
</script>

<template>
  <div class="upload-box" :style="{ width: width }">
    <a-button type="primary" :disabled="disabled" @click="uploadModalVisible = true">
      <UploadOutlined />
      {{ $t('打开上传') }}
    </a-button>
    <p class="Attention">{{ $t('文件大小最大300兆') }}（{{ $t('最多选择') }} {{ maxFileCount }} {{ $t('个文件') }}）</p>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="attachmentLevel"
      accept="*"
      :file-list="innerFileList"
      :before-upload="beforeUpload"
      :custom-request="passCustomRequest"
      :form-confidential-level="formConfidentialLevel"
      :max-count="maxFileCount"
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
</style>
