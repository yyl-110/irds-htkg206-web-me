<script setup lang="ts" name="UploadImg">
import { ref, defineExpose } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { handleEpcDownload } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';
type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';
/** 定义 props 的类型 */
interface Props {
  /**
   * 文件的 queryId / queryId 列表
   * @example `'queryId1'` / `['queryId1', 'queryId2']`
   */
  /** 上传请求地址 */
  updateUrl?: string;
  /** 是否支持拖拽上传 */
  // drag?: boolean;
  /** 是否禁用上传组件 */
  // disabled?: boolean;
  /** 图片大小限制, 默认为 5M */
  fileSize?: number;
  /** 文件类型 */
  fileType?: string[];
  /** 组件高度 */
  // height?: string;
  /** 组件宽度 */
  // width?: string;
  /** 组件边框圆角 */
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
  customRequest: any;
  change: [UploadfileList: Array<UploadFile>];
}>();
const loading = ref<boolean>(false);
const previewTitle = ref<string>('');
const previewImage = ref<string>('');
const previewVisible = ref<boolean>(false);
const userStore = useUserStore();
const UploadfileList = ref<Array<UploadFile>>([]);

/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType;
  if (!imgType.includes(file.type as FileTypes)) message.warn('上传图片不符合所需的格式！');
  if (!imgSize) message.warn(`上传图片大小不能超过 ${props.fileSize}M！`);
  return imgType.includes(file.type as FileTypes) && imgSize;
};

/**
 * handle file change
 * @param evt event
 */
const onFileChange: UploadProps['onChange'] = async evt => {};

/**
 * custom request
 * @param options options
 */
const customRequest: UploadProps['customRequest'] = async options => {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      let data = res.data.data;
      emit('customRequest', data);
    }
  } catch (err) {
    console.log(err);
  }
};
const onFileremove: UploadProps['onChange'] = async evt => {
  let file: any = null;
  emit('change', file);
};
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const handlePreview: UploadProps['onChange'] = async (file: any) => {
  // const downLoadItem = {
  //   fileId: file.data ? file.data.id : file.id,
  // };
  // handleEpcDownload(downLoadItem, file.data ? file.data.fileName : `${file.name}`);
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const ResetData = () => {
  UploadfileList.value = [];
};

watch(
  () => props.fileList,
  (newVal: any, oldVal) => {
    UploadfileList.value = newVal;
  },
  { immediate: true, deep: true }
);
defineExpose({ ResetData });
</script>

<template>
  <div class="upload-box">
    <a-upload
      v-model:file-list="UploadfileList"
      name="file"
      :max-count="1"
      class="avatar-uploader"
      list-type="picture-card"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
      @remove="onFileremove"
      @change="onFileChange">
      <div v-if="UploadfileList.length < 1">
        <!-- <LoadingOutlined v-if="loading" />
        <a-button type="primary" size="small">
          <upload-outlined></upload-outlined>
          选择
        </a-button> -->
        <plus-outlined />
        <div style="margin-top: 8px">点击上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
