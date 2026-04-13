<template>
  <draggable-modal :visible="modalVisible" title="批量上传" :closable="false" centered :maskClosable="false" :width="600"
    @cancel="closeFun" @ok="submitFun" ok-text="确定" cancel-text="取消">
    <a-upload-dragger v-model:fileList="fileList" class="upload-demo" drag multiple :max-count="limit" :accept="accept"
      :show-upload-list="true" :before-upload="handleBeforeUpload" :custom-request="customRequest"
      @change="handleUploadChange">
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">拖拽或点击上传</p>
      <p class="ant-upload-hint">{{ uploadTip }}</p>
      <p class="ant-upload-hint">超过5M的文件，预览功能上传成功后一分钟后可以使用</p>
    </a-upload-dragger>
  </draggable-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import draggableModal from '@/components/DraggableModal/index.vue';
import { saveKnowledgeFile } from '@/api/knowledge';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  nodeData: {
    type: Object,
    default: () => ({}),
  },
  parentNode: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['saveSuccess']);

const modalVisible = ref(false);

const fileList = ref([]);
const limit = ref(8);
const accept = ref('.pdf, .docx, .doc, .mp4, .MP4, .JPG, .jpg, .wmv, .avi, .bmp, .png, .ppt, .pptx,.jpeg, .xlsx, .xls');
const uploadTip = '文件小于100M且同时只能上传8个文件！';

// 已成功上传的文件对象列表，用于提交
const dataList = ref<any[]>([]);

// 上传前校验
const handleBeforeUpload = (file: File) => {
  if (fileList.value.length >= limit.value) {
    message.error(`只能上传${limit.value}个附件`);
    return false;
  }
  if (file.size && file.size > 104857600) {
    message.error('文件不能大于 100M!');
    return false;
  }
  return true;
};

// 自定义上传请求
const customRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF({
      file: file as File,
      userId: useUserStore().getUser.id,
      securityLevel: props.nodeData?.level,
    });
    if (res?.data?.code === '0' || res?.data?.code === 0) {
      handleUploadSuccess(res.data);
      onSuccess(res.data, file);
    } else {
      message.error(res?.data?.msg || '上传失败');
      onError(new Error(res?.data?.msg || '上传失败'));
    }
  } catch (err) {
    console.error('上传失败:', err);
    message.error('上传失败，请重试');
    onError(err);
  }
};

// 单个文件上传成功后，将文件信息收集到 dataList
const handleUploadSuccess = (data: any) => {
  if (!data?.id) return;
  dataList.value.push({
    fileId: String(data.id),
    fileName: data.documentName,
    fileType: data.fileType,
    fileUrl: data.fileUrl,
  });
  message.success(`${data.documentName} 上传成功`);
};

// Upload Change Handler：同步 fileList 并处理删除/错误
const handleUploadChange = (info: any) => {
  fileList.value = [...info.fileList];

  if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  } else if (info.file.status === 'removed') {
    // 从 dataList 中移除对应文件
    const removedId = info.file.response?.id;
    if (removedId) {
      dataList.value = dataList.value.filter((v) => v.fileId !== String(removedId));
    }
  }
};

// 提交保存
const submitFun = async () => {
  if (dataList.value.length === 0) {
    message.warning('请先上传文件');
    return;
  }
  try {
    const params = {
      id: '',
      userId: useUserStore().getUser.id,
      standardNo: '',
      kldTagIds: '',
      kldTageNames: '',
      allowDownload: '1',
      isTextAttachment: '1',
      attachmentType: '',
      securityLevel: '2',
      kldTreeId: props.nodeData?.key || '',
      kldTreeNodeId: props.parentNode?.id || '',
      keywords: '',
      summary: '',
      title: '',
      releaseStatus: '1',
      tagsJson: JSON.stringify(dataList.value),
      batch: dataList.value,
    };
    const res = await saveKnowledgeFile(params);
    if (res?.data?.code === '0') {
      message.success('保存成功');
      emit('saveSuccess');
      resetState();
    } else {
      message.warning(res?.data?.msg || '保存失败');
    }
  } catch (error) {
    console.error('批量上传提交失败:', error);
    message.error('系统异常，请稍后重试');
  }
};

const resetState = () => {
  fileList.value = [];
  dataList.value = [];
  modalVisible.value = false;
};

const show = () => {
  modalVisible.value = true;
};

defineExpose({ show });

const closeFun = () => {
  resetState();
};
</script>

<style lang="less" scoped>
.ant-upload-hint {
  font-size: 12px;
  line-height: 24px;
}
</style>
