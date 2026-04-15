<script setup lang="ts">
import { computed, ref } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';


const props = defineProps<{
  visible: boolean;
  currentNodeName?: string;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  success: [];
}>();

const addSubmitting = ref(false);
const userStore = useUserStore();
const addFormRef = ref();
const addForm = ref({
  calcName: '',
  securityLevel: undefined as string | undefined,
  fileList: [] as UploadFile[],
});
const levelOptions = [
  { label: '公开', value: '公开' },
  { label: '内部', value: '内部' },
  { label: '秘密', value: '秘密' },
];
const addRules = {
  calcName: [{ required: true, message: '请输入计算名称', trigger: 'blur' }],
  securityLevel: [{ required: true, message: '请选择密级', trigger: 'change' }],
  fileList: [{ required: true, validator: validateFileRequired, trigger: 'change' }],
};

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

function validateFileRequired() {
  if (addForm.value.fileList.length > 0) return Promise.resolve();
  return Promise.reject('请上传exe文件');
}

function beforeUpload(file: File) {
  const isExe = file.name.toLowerCase().endsWith('.exe');
  if (!isExe) {
    message.warning('仅支持上传 .exe 文件');
    return false;
  }
  return false;
}

function onUploadChange(info: UploadChangeParam) {
  addForm.value.fileList = info.fileList.slice(-1);
}

function removeUploadFile() {
  addForm.value.fileList = [];
}

function closeAddModal() {
  modalVisible.value = false;
  addFormRef.value?.resetFields();
  addForm.value.fileList = [];
}

async function submitAddForm() {
  try {
    await addFormRef.value?.validate();
    addSubmitting.value = true;

    const fileItem = addForm.value.fileList[0] as any;
    const rawFile = (fileItem?.originFileObj || fileItem) as File | undefined;
    if (!rawFile) {
      message.warning('请先选择exe文件');
      return;
    }

    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file: rawFile,
      userId: userStore.getUser.id,
    });
    if (uploadRes?.data?.code !== 0 && uploadRes?.data?.code !== 200) {
      message.error(uploadRes?.data?.msg || 'exe文件上传失败');
      return;
    }

    const uploadData: any = uploadRes?.data?.data || {};
    const fileId = String(uploadData?.id ?? uploadData?.queryId ?? '');
    if (!fileId) {
      message.error('未获取到上传文件ID');
      return;
    }

    const payload = {
      checkName: addForm.value.calcName,
      // 后端字段要求包含 checkNum，当前页面无单独输入项，先沿用计算名称
      checkNum: addForm.value.calcName,
      fileId,
      useType: 'exe计算',
      status: 0,
      securityLevel: addForm.value.securityLevel,
      treeName: props.currentNodeName || '',
      userId: userStore.getUser.id,
    };
    const addRes = await AdminApiSystemCheckInfoApi.addCheckExeInfo(payload);
    if (addRes?.data?.code !== 0 && addRes?.data?.code !== 200) {
      message.error(addRes?.data?.msg || '添加失败');
      return;
    }

    message.success(WeiI18n.t('保存成功').value || '添加成功');
    emit('success');
    closeAddModal();
  } finally {
    addSubmitting.value = false;
  }
}
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    title="添加exe计算"
    width="760px"
    :confirm-loading="addSubmitting"
    @ok="submitAddForm"
    @cancel="closeAddModal">
    <a-form ref="addFormRef" :model="addForm" :rules="addRules" :label-col="{ style: { width: '90px' } }">
      <a-form-item label="计算名称" name="calcName">
        <a-input v-model:value="addForm.calcName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="所属分类">
        <a-input :value="currentNodeName || '--'" disabled />
      </a-form-item>
      <a-form-item label="计算类型">
        <a-input value="exe计算" disabled />
      </a-form-item>
      <a-form-item label="密级" name="securityLevel">
        <a-select v-model:value="addForm.securityLevel" :options="levelOptions" placeholder="请选择密级" />
      </a-form-item>
      <a-form-item label="上传文件" name="fileList">
        <a-upload-dragger
          accept=".exe"
          :multiple="false"
          :file-list="addForm.fileList"
          :before-upload="beforeUpload"
          @change="onUploadChange"
          @remove="removeUploadFile">
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p class="ant-upload-hint">支持扩展名：.exe，仅能上传一个文件</p>
        </a-upload-dragger>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" :loading="addSubmitting" @click="submitAddForm">确定</a-button>
      <a-button @click="closeAddModal">取消</a-button>
    </template>
  </a-modal>
</template>
