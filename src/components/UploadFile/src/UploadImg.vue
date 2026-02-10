<script setup lang="ts" name="UploadImg">
import { ref } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';

type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';

/** 定义 props 的类型 */
interface Props {
  /**
   * 文件的 queryId / queryId 列表
   * @example `'queryId1'` / `['queryId1', 'queryId2']`
   */
  modelValue: string;
  /** 上传请求地址 */
  updateUrl?: string;
  /** 是否支持拖拽上传 */
  drag?: boolean;
  /** 是否禁用上传组件 */
  disabled?: boolean;
  /** 图片大小限制, 默认为 5M */
  fileSize?: number;
  /** 文件类型 */
  fileType?: string[];
  /** 组件高度 */
  height?: string;
  /** 组件宽度 */
  width?: string;
  /** 组件边框圆角 */
  borderRadius?: string;
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 5,
  /** 文件类型 */
  fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
});

const emit = defineEmits<{
  change: [fileList: Array<UploadFile>];
}>();
const loading = ref(false);

const fileList = ref<Array<UploadFile>>([]);

if (props.modelValue) {
  const file: UploadFile = {
    uid: generateUUID(),
    name: props.modelValue,
    url: props.modelValue,
  };
  updateFileUrl(file, props.modelValue).then(() => fileList.value.push(file));
}

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
 * 更新 file url
 * @param file
 * @param queryId
 */
async function updateFileUrl(file: UploadFile, queryId?: string) {
  if (queryId || (file.status === 'done' && !file.url && file.response && file.response.data && file.response.data.queryId)) {
    const _queryId = queryId || file.response.data.queryId;
    const res = await service({
      url: '/admin-api/system/demo/showByQueryId',
      params: { token: getAccessToken(), queryId: _queryId },
    });
    // file.url = 'https://ss2.bdstatic.com/lfoZeXSm1A5BphGlnYG/skin/22.jpg'
    file.url = res.data.data;
  }
}

/**
 * handle file change
 * @param evt event
 */
const onFileChange: UploadProps['onChange'] = async evt => {
  await Promise.all(evt.fileList.map(item => updateFileUrl(item)));
  fileList.value = [...evt.fileList];
  emit('change', fileList.value);
};

/**
 * custom request
 * @param options options
 */
const customRequest: UploadProps['customRequest'] = async options => {
  const data = new FormData();
  data.append('file', options.file);
  try {
    // const res = await service({ url: props.updateUrl, method: 'POST', data })
    const res = await AdminApiSystemDemo.saveFile({ file: options.file as File });
    console.log(res);
    if (options.onSuccess) options.onSuccess(res.data.data);
  } catch (err) {
    if (options.onError) options.onError(err as any);
  }
};
</script>

<template>
  <div class="upload-box">
    <a-upload
      v-model:file-list="fileList"
      name="file"
      list-type="picture-card"
      class="avatar-uploader"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @change="onFileChange">
      <!-- <img v-if="modelValue" style="width: 100%;" :src="modelValue" alt="avatar"> -->
      <!-- <div v-else> -->
      <div>
        <LoadingOutlined v-if="loading" />
        <PlusOutlined />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped lang="less"></style>
