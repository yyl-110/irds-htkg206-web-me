<script setup lang="ts" name="UploadFile">
import { computed, ref, watch } from 'vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { handleEpcDownload } from '@/utils/file';
import UploadModal from '@/views/product/components/upload-modal.vue';
import { useUserStore } from '@/store/modules/user';

interface Props {
  fileSize?: number;
  fileList?: Array<UploadFile>;
  /** 接受的文件类型，如 .pdf,.doc 或 * */
  accept?: string;
  /** 有外层表单密级时传入，用于限制附件密级选项 */
  formConfidentialLevel?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  fileSize: 10,
  accept: '*',
});

const emit = defineEmits<{
  customRequest: [options: any];
  change: [UploadfileList: Array<UploadFile> | null];
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
  return ok;
};

function passCustomRequest(options: Parameters<NonNullable<UploadProps['customRequest']>>[0]) {
  emit('customRequest', options);
}

function onUploadChange(info: UploadChangeParam) {
  innerFileList.value = [...info.fileList];
  emit('change', innerFileList.value);
}

function onUploadPreview(file: UploadFile) {
  const r = file.response as { id?: string; fileName?: string } | undefined;
  const fileId = r?.id ?? (file as UploadFile & { id?: string }).id;
  handleEpcDownload({ fileId }, r?.fileName ?? file.name ?? '');
}

function onRemoveFile() {
  innerFileList.value = [];
  emit('change', null);
}

function onModalConfirm() {
  emit('change', [...innerFileList.value]);
}

const displayName = computed(() => innerFileList.value[0]?.name);
</script>

<template>
  <div class="upload-box">
    <a-space align="center">
      <a-button type="primary" ghost @click="uploadModalVisible = true">
        <UploadOutlined />
        {{ $t('选择') }}
      </a-button>
      <span v-if="displayName" class="upload-file-inline-name">{{ displayName }}</span>
    </a-space>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="attachmentLevel"
      :accept="accept"
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
.upload-file-inline-name {
  color: rgba(0, 0, 0, 0.65);
}
</style>
