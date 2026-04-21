<script setup lang="ts" name="Uploado_draggerFile">
import { computed, ref, watch } from 'vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message, Upload } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
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

function onModalConfirm() {
  emit('change', [...innerFileList.value]);
}

const hintText = computed(() =>
  props.fileTypesImg ? '支持文件类型.jpg,.png,.gif,.jpeg，文件大小最大10兆' : '文件大小在限制内；支持多种格式',
);
</script>

<template>
  <div class="upload-box" :style="{ width: width }">
    <a-button type="primary" @click="uploadModalVisible = true">
      {{ $t('打开上传') }}
    </a-button>
    <p class="Attention">{{ hintText }}</p>
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
</style>
