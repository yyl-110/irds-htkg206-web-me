<script setup lang="ts" name="UploadImg">
import { ref } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';
import { handleEpcDownload } from '@/utils/file';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { message, Upload } from 'ant-design-vue';
/** 定义 props 的类型 */
interface Props {
  // /**
  //  * 文件的 queryId / queryId 列表
  //  * @example `'queryId1'` / `['queryId1', 'queryId2']`
  //  */
  // /** 上传请求地址 */
  updateUrl?: string;
  // /** 是否支持拖拽上传 */
  // drag?: boolean;
  // /** 是否禁用上传组件 */
  // disabled?: boolean;
  // /** 图片大小限制, 默认为 5M */
  fileSize?: number;
  // /** 文件类型 */
  // fileType?: string[];
  // /** 组件高度 */
  // height?: string;
  // /** 组件宽度 */
  // width?: string;
  // /** 组件边框圆角 */
  // borderRadius?: string;
  fileList?: Array<UploadFile>;
  width?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 300,
  height: '150px',
  width: '150px',
  borderRadius: '8px',
});
const emit = defineEmits<{
  customRequest: any;
  change: any;
}>();
const loading = ref(false);

const UploadfileList = ref<Array<UploadFile>>([]);
/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  let imgSize = file.size / 1024 / 1024 < props.fileSize;
  if (!imgSize) {
    message.warn(`上传文件大小不能超过 ${props.fileSize}M！`);
  }
  return imgSize || Upload.LIST_IGNORE;
};

/**
 * handle file change
 * @param evt event
 */
const onFileChange: UploadProps['onChange'] = async evt => {};
const onFileremove: UploadProps['onChange'] = async file => {
  emit('change', file);
};
const handlePreview: UploadProps['onChange'] = async (file: any) => {
  let fileUels = '';
  if (file.filePathl) {
    fileUels = file.filePathl;
  } else if (file.filePath) {
    fileUels = file.filePath;
  } else if (file.fileUrl) {
    fileUels = file.fileUrl;
  }
  if (fileUels.startsWith('http')) {
    window.open(fileUels);
  } else {
    window.open(import.meta.env.VITE_MINIO_PREVIEW_URL + fileUels);
  }
};

/**
 * custom request
 * @param options options
 */
const customRequest: UploadProps['customRequest'] = async options => {
  emit('customRequest', options);
};
watch(
  () => props.fileList,
  (newVal: any, oldVal) => {
    UploadfileList.value = newVal;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="upload-box" :style="{ width: width }">
    <a-upload-dragger
      :disabled="disabled"
      v-model:file-list="UploadfileList"
      class="avatar-uploader"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
      @remove="onFileremove"
      @change="onFileChange">
      <p class="ant-upload-drag-icon">
        <EpcIcon type="icon-shangchuanwenjian" style="font-size: 60px" />
      </p>
      <div>
        <span class="Attention">{{ $t('把文件拖拽到这里') }}</span>
        <a href="javascript:;">{{ $t(' 或者点击上传文件') }}</a>
      </div>
    </a-upload-dragger>
    <p class="Attention">{{ $t('文件大小最大300兆') }}</p>
  </div>
</template>

<style scoped lang="less">
.upload-box {
  margin-top: 10px;
}
.Attention {
  color: #9e9fa2;
}
</style>
