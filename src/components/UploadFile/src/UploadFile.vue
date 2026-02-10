<script setup lang="ts" name="UploadImg">
import { ref } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';
import { handleEpcDownload } from '@/utils/file';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';

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
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 10,
  /** 文件类型 */
  fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
});
const emit = defineEmits<{
  customRequest: [options: any];
  change: [UploadfileList: Array<UploadFile>];
}>();
const loading = ref(false);

const UploadfileList = ref<Array<UploadFile>>([]);

/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < props.fileSize;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${props.fileSize}M！`);
  return imgSize;
};

/**
 * handle file change
 * @param evt event
 */
const onFileChange: UploadProps['onChange'] = async evt => {};
const onFileremove: UploadProps['onChange'] = async evt => {
  let file: any = null;
  emit('change', file);
};
const handlePreview: UploadProps['onChange'] = async (file: any) => {
  const downLoadItem = {
    fileId: file.response ? file.response.id : file.id,
  };
  handleEpcDownload(downLoadItem, file.response ? file.response.fileName : `${file.name}`);
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
  <div class="upload-box">
    <a-upload
      v-model:file-list="UploadfileList"
      :max-count="1"
      class="avatar-uploader"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
      @remove="onFileremove"
      @change="onFileChange">
      <div>
        <LoadingOutlined v-if="loading" />
        <a-button>
          <upload-outlined></upload-outlined>
          {{ $t('选择') }}
        </a-button>
      </div>
    </a-upload>
  </div>
</template>

<style scoped lang="less"></style>
