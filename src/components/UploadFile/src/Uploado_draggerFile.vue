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
  confidentialLevel?: number;
  width?: string;
  fileTypesImg?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 10,
  height: '150px',
  width: '150px',
  borderRadius: '8px',
  fileTypesImg: false,
});
const emit = defineEmits<{
  customRequest: any;
  change: [UploadfileList: Array<UploadFile>];
}>();
const loading = ref(false);

const UploadfileList = ref<Array<UploadFile>>([]);
const fileTypes = ref<string[]>(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);
/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  let imgSize = file.size / 1024 / 1024 < props.fileSize;
  if (!imgSize) {
    message.warn(`上传文件大小不能超过 ${props.fileSize}M！`);
  } else {
    if (props.fileTypesImg) {
      console.log(file);
      const imgType: string = file.type as FileTypes;
      const imgTypeIndex = fileTypes.value.includes(imgType);
      if (imgTypeIndex === false) {
        message.warn(`上传文件类型错误，请上传图片文件！`);
        imgSize = false;
      }
    }
  }
  return imgSize || Upload.LIST_IGNORE;
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
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="upload-box" :style="{ width: width }">
    <a-upload-dragger
      v-model:file-list="UploadfileList"
      :max-count="1"
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
    <!-- <p class="Attention" v-if="!fileTypesImg">{{ $t('支持文件类型.xls,xlsx.pdf,.docx,doc,pptx,ppt，文件大小最大10兆') }}</p>
    <p class="Attention" v-if="fileTypesImg">{{ $t('支持文件类型.jpg,.png,.gif,.jpeg，文件大小最大10兆') }}</p> -->
    <p class="Attention">{{ $t('支持文件类型.jpg,.png,.gif,.jpeg，文件大小最大10兆') }}</p>
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
