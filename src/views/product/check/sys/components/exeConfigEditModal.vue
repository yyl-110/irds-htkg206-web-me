<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
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
  /** 列表行原始数据 */
  record: Record<string, unknown> | null;
  currentNodeName?: string;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  success: [];
}>();

const editSubmitting = ref(false);
const uploadModalVisible = ref(false);
const userStore = useUserStore();
const editFormRef = ref();
const editId = ref('');
/** 新上传得到的文件 ID；未重新上传则沿用 initialFileId */
const uploadedFileId = ref('');
const initialFileId = ref('');
const editForm = ref({
  calcName: '',
  confidentialLevel: 0,
  attachmentConfidentialLevel: 0,
  fileList: [] as UploadFile[],
});

const FILE_INFO_ROW_KEYS = [
  'fileId',
  'queryId',
  'oldFileName',
  'newFileName',
  'documentName',
  'fileName',
  'fileType',
  'fileUrl',
  'filePath',
  'createData',
  'createName',
  'creator',
  'confidentialLevel',
];

const levelOptions = computed(() => userStore.getConfidentialLevel);
const editRules = {
  calcName: [{ required: true, message: '请输入计算名称', trigger: 'blur' }],
  confidentialLevel: [{ required: true, message: '请选择密级', trigger: 'change' }],
};

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

function parseLevelNum(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeLevel(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function handleOuterLevelChange(value: number) {
  const outer = normalizeLevel(value);
  const attachment = normalizeLevel(editForm.value.attachmentConfidentialLevel);
  if (attachment > outer) {
    editForm.value.attachmentConfidentialLevel = outer;
  }
}

function resolveSecurityLevel(row: Record<string, unknown>): number {
  const sl = parseLevelNum(row.confidentialLevel);
  if (sl !== undefined) return sl;
  const cl = parseLevelNum(row.confidentialLevel);
  if (cl !== undefined) return cl;
  const label = String(row.confidentialLevel ?? row.levelName ?? '').trim();
  const found = userStore.getConfidentialLevel.find(item => item.label === label);
  return found?.value ?? 0;
}

/** 与列表一致：优先使用 fileList[0] 中的文件字段（oldFileName、fileId、filePath） */
function getPrimaryFileRow(row: Record<string, unknown>): Record<string, unknown> {
  const fl = row.fileList;
  if (Array.isArray(fl) && fl.length > 0) {
    const first = fl[0];
    if (first && typeof first === 'object') {
      return { ...row, ...(first as Record<string, unknown>) };
    }
  }
  return row;
}

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

async function handleUploadPreview(file: UploadFile) {
  const uid = String(file.uid ?? '');
  const fromUid = uid.startsWith('-existing-') ? uid.slice('-existing-'.length) : '';
  const fid = String(uploadedFileId.value || initialFileId.value || fromUid || (file.response as any)?.id || '').trim();
  if (!fid) {
    message.warning('无法下载：缺少文件ID');
    return;
  }
  const row = props.record ? getPrimaryFileRow(props.record as Record<string, unknown>) : {};
  const saveName = String(row.oldFileName ?? (file.response as Record<string, unknown>)?.oldFileName ?? file.name ?? 'download.exe').trim() || 'download.exe';
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

async function customRequest(options: { file: File | Blob; onSuccess?: (body: unknown, file?: File) => void; onError?: (e: Error) => void }) {
  const { file, onSuccess, onError } = options;
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file: file as File,
      userId: userStore.getUser.id,
      confidentialLevel: editForm.value.attachmentConfidentialLevel,
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
        editForm.value.attachmentConfidentialLevel = serverLevel > editForm.value.confidentialLevel ? editForm.value.confidentialLevel : serverLevel;
        await nextTick();
      }
    }

    const docName = record.documentName != null ? String(record.documentName).trim() : '';
    if (!String(editForm.value.calcName || '').trim() && docName) {
      editForm.value.calcName = docName;
      await nextTick();
      editFormRef.value?.validateFields(['calcName']).catch(() => {});
    }

    message.success('上传成功');
    onSuccess?.(uploadRes.data, file as File);
    await nextTick();
    const displayName = String(record.oldFileName ?? (file as File).name ?? '').trim() || (file as File).name;
    const rows = editForm.value.fileList.slice(-1);
    if (rows[0]) {
      rows[0].name = displayName;
      if (!rows[0].response) rows[0].response = uploadRes.data as any;
      editForm.value.fileList = [...rows];
    }
    editFormRef.value?.validateFields(['fileList']).catch(() => {});
  } catch (err) {
    message.error('exe文件上传失败，请重试');
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

function onUploadChange(info: UploadChangeParam) {
  editForm.value.fileList = info.fileList.slice(-1);
  if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
  if (info.file.status === 'removed') {
    uploadedFileId.value = '';
  }
}

function removeUploadFile() {
  editForm.value.fileList = [];
  uploadedFileId.value = '';
}

function closeEditModal() {
  editFormRef.value?.resetFields();
  editForm.value.fileList = [];
  editForm.value.attachmentConfidentialLevel = editForm.value.confidentialLevel;
  uploadedFileId.value = '';
  initialFileId.value = '';
  editId.value = '';
  uploadModalVisible.value = false;
  modalVisible.value = false;
}

function getCurrentFileName() {
  const first = editForm.value.fileList?.[0];
  return String(first?.name ?? '').trim();
}

function pickFileFieldsFromRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of FILE_INFO_ROW_KEYS) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') out[k] = v;
  }
  const fid = row.fileId ?? row.queryId;
  if (fid != null && String(fid).trim() !== '') out.fileId = fid;
  return out;
}

/** 解析 getFileStorage / 与上传接口类似的多种响应结构 */
function unwrapFileApiPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const code = o.code;
  const ok = code === undefined || code === null || code === 0 || code === 200 || code === '0';
  if (!ok) return null;
  let inner: unknown = o.data !== undefined ? o.data : o;
  if (typeof inner === 'string') {
    const s = inner.trim();
    if (!s) return null;
    try {
      inner = JSON.parse(s) as unknown;
    } catch {
      return { fileUrl: s };
    }
  }
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) return inner as Record<string, unknown>;
  return null;
}

function mergeDisplayFileName(row: Record<string, unknown>, remote: Record<string, unknown> | null): string {
  const r = { ...row, ...(remote || {}) };
  const name = String(r.oldFileName ?? r.documentName ?? r.newFileName ?? r.fileName ?? '').trim();
  const fid = String(r.fileId ?? r.id ?? r.queryId ?? '').trim();
  if (name) return name.endsWith('.exe') || name.includes('.') ? name : `${name}.exe`;
  return fid ? `已关联文件 (${fid})` : '已上传.exe';
}

async function loadExistingUploadedFile(row: Record<string, unknown>) {
  editForm.value.fileList = [];
  const fileRow = getPrimaryFileRow(row);
  const fid = String(fileRow.fileId ?? fileRow.queryId ?? row.fileId ?? row.queryId ?? '').trim();
  if (!fid) return;

  let remote: Record<string, unknown> | null = null;
  try {
    const res = await AdminApiSystemUploadFile.getFileStorage({ fileId: fid });
    remote = unwrapFileApiPayload(res?.data);
  } catch {
    remote = null;
  }

  const fromRow = pickFileFieldsFromRow(fileRow);
  const merged: Record<string, unknown> = { ...fromRow, ...(remote || {}) };
  if (merged.fileId == null || String(merged.fileId).trim() === '') {
    merged.fileId = fid;
  }

  const displayName = mergeDisplayFileName(fileRow, remote);
  editForm.value.fileList = [
    {
      uid: `-existing-${fid}`,
      name: displayName || '已上传.exe',
      status: 'done',
    },
  ];
}

async function initFromRecord(row: Record<string, unknown>) {
  editId.value = String(row.id ?? '');
  editForm.value.calcName = String(row.checkName ?? row.parameterName ?? row.calcName ?? '');
  editForm.value.confidentialLevel = resolveSecurityLevel(row);
  const fileRow = getPrimaryFileRow(row);
  const attachmentLevel = parseLevelNum(fileRow.confidentialLevel);
  editForm.value.attachmentConfidentialLevel = attachmentLevel !== undefined ? Math.min(attachmentLevel, editForm.value.confidentialLevel) : editForm.value.confidentialLevel;
  const fid = String(fileRow.fileId ?? fileRow.queryId ?? row.fileId ?? row.queryId ?? '').trim();
  initialFileId.value = fid;
  uploadedFileId.value = fid;
  await loadExistingUploadedFile(row);
}

watch(
  () => [props.visible, props.record] as const,
  ([visible, record]) => {
    if (!visible || !record) return;
    void nextTick(() => {
      void initFromRecord(record);
    });
  },
  { flush: 'post' },
);

async function submitEditForm() {
  try {
    await editFormRef.value?.validate();
    editSubmitting.value = true;

    const fileId = uploadedFileId.value || initialFileId.value;
    if (!fileId) {
      message.warning('请上传exe文件或保留原文件');
      return;
    }
    if (normalizeLevel(editForm.value.attachmentConfidentialLevel) > normalizeLevel(editForm.value.confidentialLevel)) {
      message.warning('附件密级不能高于外层密级');
      return;
    }

    const row = props.record || {};
    const payload = {
      id: editId.value,
      checkName: editForm.value.calcName,
      checkNum: String(row.checkNum ?? editForm.value.calcName),
      fileId,
      useType: String(row.useType ?? 'exe计算'),
      status: row.status ?? 0,
      confidentialLevel: editForm.value.confidentialLevel,
      treeName: String(row.treeName ?? props.currentNodeName ?? ''),
      userId: userStore.getUser.id,
    };
    const res = await AdminApiSystemCheckInfoApi.updateCheckExeInfo(payload);
    const resCode = res?.data?.code as number | string | undefined;
    if (resCode !== 0 && resCode !== 200 && resCode !== '0') {
      message.error(res?.data?.msg || '保存失败');
      return;
    }

    message.success(WeiI18n.t('保存成功').value || '保存成功');
    emit('success');
    closeEditModal();
  } finally {
    editSubmitting.value = false;
  }
}
</script>

<template>
  <a-modal v-model:visible="modalVisible" title="编辑exe计算" width="760px" :confirm-loading="editSubmitting" @ok="submitEditForm" @cancel="closeEditModal">
    <a-form v-if="record" ref="editFormRef" :model="editForm" :rules="editRules" :label-col="{ style: { width: '90px' } }">
      <a-form-item label="计算名称" name="calcName">
        <a-input v-model:value="editForm.calcName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="所属分类">
        <a-input :value="String(record?.treeName ?? currentNodeName ?? '--')" disabled />
      </a-form-item>
      <a-form-item label="计算类型">
        <a-input value="exe计算" disabled />
      </a-form-item>
      <a-form-item label="密级" name="confidentialLevel">
        <a-select v-model:value="editForm.confidentialLevel" :options="levelOptions" placeholder="请选择密级" @change="handleOuterLevelChange" />
      </a-form-item>
      <a-form-item label="附件">
        <div class="edit-upload-trigger">
          <a-button type="primary" @click="uploadModalVisible = true">上传附件</a-button>
          <span v-if="getCurrentFileName()" class="edit-upload-trigger__name">{{ getCurrentFileName() }}</span>
        </div>
      </a-form-item>
    </a-form>
    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="editForm.attachmentConfidentialLevel"
      accept=".exe"
      :form-confidential-level="editForm.confidentialLevel"
      :file-list="editForm.fileList"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @upload-change="onUploadChange"
      @upload-preview="handleUploadPreview"
      @remove-file="removeUploadFile" />
    <template #footer>
      <a-button type="primary" :loading="editSubmitting" @click="submitEditForm">确定</a-button>
      <a-button @click="closeEditModal">取消</a-button>
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
