<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { downloadFileFromStream } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import UploadModal from '@/views/product/components/upload-modal.vue';

const props = defineProps<{
  visible: boolean;
  /** 左侧分类树当前节点 id，与列表、保存接口 treeId 一致 */
  treeId?: string;
  currentNodeName?: string;
}>();

const uploadModalVisible = ref(false);
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  success: [];
}>();

const addSubmitting = ref(false);
const userStore = useUserStore();
const addFormRef = ref();
/** 选择文件后立即上传得到的文件 ID，提交时直接关联 */
const uploadedFileId = ref('');
const addForm = ref({
  calcName: '',
  confidentialLevel: 0,
  attachmentConfidentialLevel: 0,
  fileList: [] as UploadFile[],
});
const levelOptions = computed(() => userStore.getConfidentialLevel);
const attachmentLevelOptions = computed(() => {
  const outer = Number(addForm.value.confidentialLevel);
  return levelOptions.value.filter(option => Number(option.value) <= outer);
});
const addRules = {
  calcName: [{ required: true, message: '请输入计算名称', trigger: 'blur' }],
  confidentialLevel: [{ required: true, message: '请选择密级', trigger: 'change' }],
  // fileList: [{ required: true, validator: validateFileRequired, trigger: 'change' }],
};

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

function normalizeLevel(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function handleOuterLevelChange(value: number) {
  const outer = normalizeLevel(value);
  const attachment = normalizeLevel(addForm.value.attachmentConfidentialLevel);
  if (attachment > outer) {
    addForm.value.attachmentConfidentialLevel = outer;
  }
}

// function validateFileRequired() {
//   if (uploadedFileId.value) return Promise.resolve();
//   return Promise.reject('请上传exe文件');
// }

async function handleUploadPreview(file: UploadFile) {
  const fid = String(uploadedFileId.value || (file.response as any)?.id || '').trim();
  if (!fid) {
    message.warning('无法下载：缺少文件ID');
    return;
  }
  const saveName = String((file.response as any)?.oldFileName ?? file.name ?? 'download.exe').trim() || 'download.exe';
  try {
    const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId: fid } as any);
    const stream = (res as any)?.data !== undefined ? (res as any).data : res;
    downloadFileFromStream(stream, saveName);
  } catch {
    message.error('下载失败');
  }
}

function beforeUpload(file: File) {
  const isExe = file.name.toLowerCase().endsWith('.exe');
  if (!isExe) {
    message.warning('仅支持上传 .exe 文件');
    return false;
  }
  if (file.size > 104857600) {
    message.error('文件不能大于 100M');
    return false;
  }
  return true;
}

/** 兼容 upload.json：① 直接返回文件 DTO；② CommonResult { code, data, msg } */
function parseUploadFileResult(raw: unknown): { ok: boolean; fileId: string; record: Record<string, unknown>; errMsg?: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, fileId: '', record: {}, errMsg: '响应为空' };
  }
  const body = raw as Record<string, unknown>;
  const code = body.code;
  const successCodes: Array<number | string> = [0, 200, '0'];
  if (code !== undefined && code !== null && !successCodes.includes(code as number | string)) {
    return { ok: false, fileId: '', record: {}, errMsg: String(body.msg ?? '上传失败') };
  }
  let record: Record<string, unknown> = body;
  const nested = body.data;
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id != null) {
    record = nested as Record<string, unknown>;
  } else if (body.id == null && body.queryId == null && nested && typeof nested === 'object') {
    record = nested as Record<string, unknown>;
  }
  const fileId = String(record.id ?? record.queryId ?? '');
  if (!fileId) {
    return { ok: false, fileId: '', record: {}, errMsg: '未获取到上传文件ID' };
  }
  return { ok: true, fileId, record };
}

async function customRequest(options: { file: File | Blob; onSuccess?: (body: unknown, file?: File) => void; onError?: (e: Error) => void }) {
  const { file, onSuccess, onError } = options;
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file: file as File,
      userId: userStore.getUser.id,
      confidentialLevel: addForm.value.attachmentConfidentialLevel,
    });

    const { ok, fileId, record, errMsg } = parseUploadFileResult(uploadRes?.data);
    if (!ok) {
      message.error(errMsg || 'exe文件上传失败');
      onError?.(new Error(errMsg || 'exe文件上传失败'));
      return;
    }
    uploadedFileId.value = fileId;

    const serverLevel = record.confidentialLevel;
    if (typeof serverLevel === 'number' && Number.isFinite(serverLevel)) {
      const allowed = userStore.getConfidentialLevel.some(item => item.value === serverLevel);
      if (allowed) {
        addForm.value.attachmentConfidentialLevel = serverLevel > addForm.value.confidentialLevel ? addForm.value.confidentialLevel : serverLevel;
        await nextTick();
      }
    }

    const docName = record.documentName != null ? String(record.documentName).trim() : '';
    if (!String(addForm.value.calcName || '').trim() && docName) {
      addForm.value.calcName = docName;
      await nextTick();
      addFormRef.value?.validateFields(['calcName']).catch(() => {});
    }

    message.success('上传成功');
    onSuccess?.(uploadRes.data, file as File);
    await nextTick();
    const displayName = String(record.oldFileName ?? (file as File).name ?? '').trim() || (file as File).name;
    const rows = addForm.value.fileList.slice(-1);
    if (rows[0]) {
      rows[0].name = displayName;
      if (!rows[0].response) rows[0].response = uploadRes.data as any;
      addForm.value.fileList = [...rows];
    }
    addFormRef.value?.validateFields(['fileList']).catch(() => {});
  } catch (err) {
    message.error('exe文件上传失败，请重试');
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

function onUploadChange(info: UploadChangeParam) {
  addForm.value.fileList = info.fileList.slice(-1);
  if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
  if (info.file.status === 'removed') {
    uploadedFileId.value = '';
  }
}

function removeUploadFile() {
  addForm.value.fileList = [];
  uploadedFileId.value = '';
}

function closeAddModal() {
  modalVisible.value = false;
  uploadModalVisible.value = false;
  addFormRef.value?.resetFields();
  addForm.value.fileList = [];
  addForm.value.attachmentConfidentialLevel = addForm.value.confidentialLevel;
  uploadedFileId.value = '';
}

async function submitAddForm() {
  try {
    await addFormRef.value?.validate();
    addSubmitting.value = true;

    const fileId = uploadedFileId.value;
    if (!fileId) {
      message.warning('请先上传exe文件');
      return;
    }
    if (normalizeLevel(addForm.value.attachmentConfidentialLevel) > normalizeLevel(addForm.value.confidentialLevel)) {
      message.warning('附件密级不能高于外层密级');
      return;
    }

    const tid = String(props.treeId ?? '').trim();
    const payload = {
      checkName: addForm.value.calcName,
      // 后端字段要求包含 checkNum，当前页面无单独输入项，先沿用计算名称
      checkNum: addForm.value.calcName,
      fileId,
      useType: 'exe计算',
      status: 0,
      confidentialLevel: addForm.value.confidentialLevel,
      treeName: props.currentNodeName || '',
      userId: userStore.getUser.id,
      ...(tid ? { treeId: tid } : {}),
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
function getCurrentFileName() {
  const first = addForm.value.fileList?.[0];
  return String(first?.name ?? '').trim();
}
</script>

<template>
  <a-modal v-model:visible="modalVisible" title="添加exe计算" width="760px" :confirm-loading="addSubmitting" @ok="submitAddForm" @cancel="closeAddModal">
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
      <a-form-item label="密级" name="confidentialLevel">
        <a-select v-model:value="addForm.confidentialLevel" :options="levelOptions" placeholder="请选择密级" @change="handleOuterLevelChange" />
      </a-form-item>
      <a-form-item label="上传文件" name="fileList">
        <div class="edit-upload-trigger">
          <a-button type="primary" @click="uploadModalVisible = true">上传附件</a-button>
          <span v-if="getCurrentFileName()" class="edit-upload-trigger__name">{{ getCurrentFileName() }}</span>
        </div>
      </a-form-item>
    </a-form>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="addForm.attachmentConfidentialLevel"
      accept=".exe"
      :level-options="attachmentLevelOptions"
      :file-list="addForm.fileList"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @upload-change="onUploadChange"
      @upload-preview="handleUploadPreview"
      @remove-file="removeUploadFile" />
    <template #footer>
      <a-button type="primary" :loading="addSubmitting" @click="submitAddForm">确定</a-button>
      <a-button @click="closeAddModal">取消</a-button>
    </template>
  </a-modal>
</template>

<style scoped>
.edit-upload-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-upload-trigger__name {
  color: rgba(0, 0, 0, 0.65);
}
</style>
