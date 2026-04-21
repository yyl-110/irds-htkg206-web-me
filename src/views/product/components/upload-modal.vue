<script setup lang="ts">
import { computed, watch } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import { getEffectiveConfidentialLevelOptions } from '@/utils/confidentialLevelOptions';

type LevelOption = {
  label: string;
  value: string | number;
};

const userStore = useUserStore();

const props = defineProps<{
  visible: boolean;
  confidentialLevel: number;
  /** 弹窗标题，默认「上传附件」 */
  modalTitle?: string;
  /** 表单上方提示（如红字温馨提示） */
  hint?: string;
  accept: string;
  /** 不传或空数组时，使用用户密级过滤后的 getConfidentialLevel */
  levelOptions?: LevelOption[];
  /**
   * 外层表单密级上限：附件密级选项不得高于该值（仍受用户密级限制）。
   * 不传表示无外层表单密级字段，仅按用户密级过滤。
   */
  formConfidentialLevel?: number | null;
  fileList: UploadFile[];
  beforeUpload: (file: File) => boolean;
  /** 父组件注入：选文件后仍走各自的实际上传接口（uploadFile / uploadWordToPDF / …） */
  customRequest: (options: { file: File | Blob; onSuccess?: (body: unknown, file?: File) => void; onError?: (e: Error) => void }) => Promise<void>;
  /** 单次可选文件数量（多文件确定时对每个已上传文件依次 updateFileConfidentialLevel） */
  maxCount?: number;
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

/** 用户密级范围内的选项；若有外层表单密级则再限制不得高于表单密级 */
const effectiveLevelOptions = computed((): LevelOption[] => {
  const fromUser = userStore.getConfidentialLevel;
  const base = props.levelOptions?.length ? props.levelOptions : fromUser;
  return getEffectiveConfidentialLevelOptions(base, props.formConfidentialLevel) as LevelOption[];
});

watch(
  effectiveLevelOptions,
  opts => {
    if (!opts.length) return;
    const max = Math.max(...opts.map(o => Number(o.value)));
    const cur = Number(levelValue.value);
    if (Number.isFinite(cur) && cur > max) {
      levelValue.value = max;
    }
  },
  { immediate: true },
);

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

function getServerIdForFile(file: UploadFile | undefined): string {
  if (!file) return '';
  const uid = String(file.uid ?? '');
  if (uid.startsWith('-existing-')) {
    return uid.slice('-existing-'.length).trim();
  }
  const fromResponse = parseIdFromUploadResponse(file.response);
  if (fromResponse) return fromResponse;
  const anyFile = file as UploadFile & { id?: string; queryId?: string };
  const direct = anyFile.id ?? anyFile.queryId;
  if (direct != null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  return '';
}

const resolvedModalTitle = computed(() => props.modalTitle?.trim() || '上传附件');

const maxCountCoerced = computed(() => {
  const m = props.maxCount;
  if (m == null || Number(m) < 1) return 1;
  return Math.floor(Number(m));
});

/** 选文件走父级 customRequest 的实际上传；确定时统一再调文件中心更新附件密级 */
async function onConfirm() {
  const max = maxCountCoerced.value;
  const list = props.fileList.filter(f => f.status !== 'removed' && f.status !== 'error');
  const useList = max === 1 ? (list.length ? [list[list.length - 1] as UploadFile] : []) : list;
  if (!useList.length) {
    message.warning('请先上传附件');
    return;
  }
  const ids = useList.map(f => getServerIdForFile(f)).filter(Boolean);
  if (ids.length !== useList.length) {
    message.warning('缺少文件ID，请先完成上传或保留已有关联文件');
    return;
  }
  for (const id of ids) {
    await AdminApiSystemUploadFile.updateFileConfidentialLevel({
      id,
      confidentialLevel: levelValue.value,
    });
  }
  emit('confirm');
  modalVisible.value = false;
}

function onCancel() {
  modalVisible.value = false;
}
</script>

<template>
  <a-modal v-model:visible="modalVisible" :title="resolvedModalTitle" width="640px" @ok="onConfirm" @cancel="onCancel">
    <p v-if="hint" class="upload-modal-hint">{{ hint }}</p>
    <a-form :label-col="{ style: { width: '90px' } }">
      <a-form-item label="附件密级">
        <a-select v-model:value="levelValue" :options="effectiveLevelOptions" placeholder="请选择密级" />
      </a-form-item>
      <a-form-item label="上传文件">
        <a-upload-dragger
          :accept="accept"
          :multiple="maxCountCoerced > 1"
          :max-count="maxCountCoerced"
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

<style scoped lang="less">
.upload-modal-hint {
  margin: 0 0 12px;
  color: #ff4d4f;
  font-size: 13px;
  line-height: 1.5;
}
</style>
