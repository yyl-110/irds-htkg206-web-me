<script setup lang="ts" name="UploadImg">
import { ref } from 'vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';
import UploadModal from '@/views/product/components/upload-modal.vue';
import { useUserStore } from '@/store/modules/user';

type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';

interface Props {
  modelValue: string;
  updateUrl?: string;
  drag?: boolean;
  disabled?: boolean;
  fileSize?: number;
  fileType?: string[];
  height?: string;
  width?: string;
  borderRadius?: string;
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
});

const emit = defineEmits<{
  change: [fileList: Array<UploadFile>];
}>();

const userStore = useUserStore();
const uploadModalVisible = ref(false);
const attachmentLevel = ref(Number(userStore.getConfidentialLevel[0]?.value ?? 0));
const innerFileList = ref<Array<UploadFile>>([]);

if (props.modelValue) {
  const file: UploadFile = {
    uid: generateUUID(),
    name: props.modelValue,
    url: props.modelValue,
  };
  void updateFileUrl(file, props.modelValue).then(() => innerFileList.value.push(file));
}

async function updateFileUrl(file: UploadFile, queryId?: string) {
  const r = file.response as { data?: { queryId?: string } } | undefined;
  const qid = r?.data?.queryId;
  if (queryId || (file.status === 'done' && !file.url && qid)) {
    const _queryId = queryId ?? qid;
    const res = await service({
      url: '/admin-api/system/demo/showByQueryId',
      params: { token: getAccessToken(), queryId: _queryId },
    });
    file.url = res.data.data;
  }
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType;
  if (!imgType.includes(file.type as FileTypes)) message.warn('上传图片不符合所需的格式！');
  if (!imgSize) message.warn(`上传图片大小不能超过 ${props.fileSize}M！`);
  return imgType.includes(file.type as FileTypes) && imgSize;
};

/** 与历史一致：走 demo 保存文件接口（路径若与后端不一致可调整） */
async function imgDemoCustomRequest(options: Parameters<NonNullable<UploadProps['customRequest']>>[0]) {
  const formData = new FormData();
  formData.append('file', options.file as File);
  try {
    const res = await service({
      url: '/admin-api/system/demo/saveFile',
      method: 'POST',
      data: formData,
    });
    const payload = res.data?.data ?? res.data;
    options.onSuccess?.(payload);
  } catch (err) {
    options.onError?.(err as Error);
  }
}

async function onUploadChange(info: UploadChangeParam) {
  innerFileList.value = [...info.fileList];
  await Promise.all(innerFileList.value.map(item => updateFileUrl(item)));
  emit('change', innerFileList.value);
}

function onRemoveFile() {
  innerFileList.value = [];
}

function onModalConfirm() {
  emit('change', [...innerFileList.value]);
}
</script>

<template>
  <div class="upload-box" :style="{ width: props.width }">
    <div v-if="innerFileList[0]?.url" class="upload-img-thumb">
      <img :src="innerFileList[0].url" alt="" />
    </div>
    <a-button type="dashed" :disabled="disabled" class="upload-img-trigger" @click="uploadModalVisible = true">
      <PlusOutlined />
      <span class="ant-upload-text">Upload</span>
    </a-button>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="attachmentLevel"
      accept="image/png,image/jpeg,image/jpg,image/gif"
      :file-list="innerFileList"
      :before-upload="beforeUpload"
      :custom-request="imgDemoCustomRequest"
      :max-count="1"
      @upload-change="onUploadChange"
      @remove-file="onRemoveFile"
      @confirm="onModalConfirm" />
  </div>
</template>

<style scoped lang="less">
.upload-box {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.upload-img-thumb {
  width: 100%;
  max-width: 120px;
  img {
    max-width: 100%;
    border-radius: 6px;
    vertical-align: middle;
  }
}
.upload-img-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
