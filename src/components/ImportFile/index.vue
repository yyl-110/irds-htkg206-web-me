<template>
  <div class="importFileIndex" v-dragModal>
    <a-modal v-model:visible="visible" style="width: 40%" :title="'附件上传'" :confirm-loading="$isPending()" :mask-closable="false" @ok="batchOk" @cancel="batchCancel">
      <div style="width: 100%; height: 100%">
        <div style="width: 500px; height: auto">
          请选择模板：
          <a-button type="primary" @click="templateDownload()" style="margin-left: 15px; width: 110px">
            <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />
            {{ $t('模板下载') }}
          </a-button>
        </div>
        <div style="margin-top: 10px">
          请选择附件:
          <!-- :headers="{ Authorization: getAccessToken() }"
          :data="dataParams"
          :action="actionUrl" -->
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
              <a-button type="primary" style="margin-left: 26px">
                <EpcIcon type="icon-shangchuanwenjian1" style="font-size: 14px" />
                {{ $t('上传文件') }}
              </a-button>
            </div>
          </a-upload>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="batchOk">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="batchCancel">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, defineProps, defineEmits } from 'vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { getAccessToken } from '@/utils/auth';
import { service } from '@/httpRequest/service';
import { generateUUID } from '@/utils/GenerateUUID';
import { handleEpcDownload } from '@/utils/file';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
type FileTypes = 'image/apng' | 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/pjpeg' | 'image/png' | 'image/svg+xml' | 'image/tiff' | 'image/webp' | 'image/x-icon';
/** 定义 props 的类型 */
interface Props {
  // /**
  //  * 文件的 queryId / queryId 列表
  //  * @example `'queryId1'` / `['queryId1', 'queryId2']`
  //  */
  // /** 上传请求地址 */
  updateUrl?: string;
  modalVisible: boolean;
  // /** 是否禁用上传组件 */
  // disabled?: boolean;
  // /** 图片大小限制, 默认为 5M */
  fileSize?: number;
  selectedKeys?: string;
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
  selectedKeys: '',
  modalVisible: false,
  disabledFlag: false,
  exportType: 0,
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
  importSuccessfulFun: any;
  close: any;
  templateDownload: any;
}>();
const loading = ref(false);
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.importFileIndex');
}
const categoryid = computed(() => {
  return props.selectedKeys;
});
const dataParams = ref({
  userId: userStore.getUser.id,
  categoryid: categoryid,
});

const actionUrl = ref(`${import.meta.env.VITE_BASE_PREVIEW_URL}/cirpoint-base-api/tempalteinfo/import`);

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
const onFileChange: UploadProps['onChange'] = async options => {};
/**
 * custom request
 * @param options options
 */
const customRequest: UploadProps['customRequest'] = async options => {
  emit('customRequest', options);
};

const onFileremove: UploadProps['onChange'] = async evt => {
  let file: any = null;
  emit('change', file);
};
const handlePreview: UploadProps['onChange'] = async (file: any) => {};

watch(
  () => props.fileList,
  (newVal: any, oldVal) => {
    UploadfileList.value = newVal;
  },
  { immediate: true, deep: true }
);

//excel 导出
//页面配置模板
const templateDownload = () => {
  emit('templateDownload');
};

const batchCancel = () => {
  emit('close');
};

const batchOk = () => {
  emit('importSuccessfulFun');
};
</script>
<style lang="less" scoped>
.button {
  margin-left: 16px;
}
</style>
