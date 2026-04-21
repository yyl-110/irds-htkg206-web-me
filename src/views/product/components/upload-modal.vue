<script setup lang="ts">
import { computed } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
type LevelOption = {
  label: string;
  value: string | number;
};

const props = defineProps<{
  visible: boolean;
  confidentialLevel: number;
  accept: string;
  levelOptions: LevelOption[];
  fileList: UploadFile[];
  beforeUpload: (file: File) => boolean;
  customRequest: (options: { file: File | Blob; onSuccess?: (body: unknown, file?: File) => void; onError?: (e: Error) => void }) => Promise<void>;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  'update:confidentialLevel': [level: number];
  confirm: [];
  uploadChange: [info: UploadChangeParam];
  uploadPreview: [file: UploadFile];
  removeFile: [];
}>();

const modalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

const levelValue = computed({
  get: () => props.confidentialLevel,
  set: (value: number) => emit('update:confidentialLevel', value),
});

function onUploadChange(info: UploadChangeParam) {
  emit('uploadChange', info);
}

function onPreview(file: UploadFile) {
  emit('uploadPreview', file);
}

function onRemove() {
  emit('removeFile');
}

/** 与列表/预览一致：服务端文件 id（非 Upload 组件的 uid） */
function parseIdFromUploadResponse(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return '';
  const body = raw as Record<string, unknown>;
  let record: Record<string, unknown> = body;
  const nested = body.data;
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id != null) {
    record = nested as Record<string, unknown>;
  } else if (body.id == null && body.queryId == null && nested && typeof nested === 'object') {
    record = nested as Record<string, unknown>;
  }
  return String(record.id ?? record.queryId ?? '').trim();
}

function getCurrentFileServerId(): string {
  const list = props.fileList;
  const file = list.length ? list[list.length - 1] : undefined;
  if (!file) return '';
  const uid = String(file.uid ?? '');
  if (uid.startsWith('-existing-')) {
    return uid.slice('-existing-'.length).trim();
  }
  return parseIdFromUploadResponse(file.response);
}

async function onConfirm() {
  const id = getCurrentFileServerId();
  if (!id) {
    message.warning('缺少文件ID，请先完成上传或保留已有关联文件');
    return;
  }
  await AdminApiSystemUploadFile.updateFileConfidentialLevel({
    id,
    confidentialLevel: levelValue.value,
  });
  emit('confirm');
  modalVisible.value = false;
}

function onCancel() {
  modalVisible.value = false;
}
</script>

<template>
  <a-modal v-model:visible="modalVisible" title="上传附件" width="640px" @ok="onConfirm" @cancel="onCancel">
    <a-form :label-col="{ style: { width: '90px' } }">
      <a-form-item label="附件密级">
        <a-select v-model:value="levelValue" :options="levelOptions" placeholder="请选择密级" />
      </a-form-item>
      <a-form-item label="上传文件">
        <a-upload-dragger
          :accept="accept"
          :multiple="false"
          :max-count="1"
          :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @preview="onPreview"
          @change="onUploadChange"
          @remove="onRemove">
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p class="ant-upload-hint">支持类型：{{ accept }}；不更换文件可直接保存；</p>
        </a-upload-dragger>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="onConfirm">确定</a-button>
      <a-button @click="onCancel">取消</a-button>
    </template>
  </a-modal>
</template>
