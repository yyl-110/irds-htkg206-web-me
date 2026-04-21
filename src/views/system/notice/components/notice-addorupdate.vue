<script lang="ts" setup>
import { computed, nextTick, reactive, ref } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { message } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import UploadModal from '@/views/product/components/upload-modal.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const type = ref('1');
const emit = defineEmits(['close', 'refreshtabledata']);
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const requestParams = reactive(new NoticeInfoRequestDTOModel());
requestParams.releaseFlag = 0;
requestParams.userId = userStore.getUser.id;

const id = ref(0);
const title = ref('');
const confidentialLevel = ref(0);
const content = ref('');
const ckeditorRef = ref();

const uploadModalVisible = ref(false);

/** handle close */
function handleClose() {
  fileList.value = [];
  uploadModalVisible.value = false;
  title.value = '';
  emit('close');
}

async function savePageInfo() {
  if (!title.value) {
    message.error(WeiI18n.$t('公告标题不能为空!'));
    return;
  }
  if (type.value == '1' && !ckeditorRef.value.getData()) {
    message.error(WeiI18n.$t('公告内容不能为空!'));
    return;
  }
  if (type.value == '2' && !getNoticeUploadedFileId()) {
    message.error(WeiI18n.$t('附件不能为空!'));
    return;
  }
  if (type.value == '1') {
    content.value = ckeditorRef.value.getData();
  }
  // 保存信息
  if (id.value != undefined && id.value > 0) {
    requestParams.id = id.value;
    const fid = getNoticeUploadedFileId();
    if (fid) {
      requestParams.fileId = fid;
    } else {
      requestParams.fileId = '';
    }
    requestParams.title = title.value;
    requestParams.type = type.value;
    requestParams.content = content.value;
    requestParams.userId = `${userStore.getUser.id}`;
    // 保存页面信息
    const res = await AdminApiSystemNotice.noticeUpdate({
      ...requestParams,
    });
  } else {
    const fid = getNoticeUploadedFileId();
    if (fid) {
      requestParams.fileId = fid;
    } else {
      requestParams.fileId = '';
    }
    requestParams.title = title.value;
    requestParams.type = type.value;
    requestParams.content = content.value;
    requestParams.userId = `${userStore.getUser.id}`;
    // 保存页面信息
    const res = await AdminApiSystemNotice.noticeSave({
      ...requestParams,
    });
  }
  title.value = '';
  fileList.value = [];
  // 刷新父页面列表数据
  emit('refreshtabledata');
  emit('close');
}

const fileList = ref<UploadFile[]>([]);

function getNoticeUploadedFileId(): string {
  const f = fileList.value[0] as (UploadFile & { id?: string }) | undefined;
  if (!f) return '';
  const direct = f.id ?? (f as any).queryId;
  if (direct != null && String(direct).trim() !== '') return String(direct).trim();
  const r = f.response as Record<string, unknown> | undefined;
  if (!r || typeof r !== 'object') return '';
  const data = r.data as Record<string, unknown> | undefined;
  const id = (typeof data === 'object' && data ? data.id : r.id) ?? r.queryId ?? data?.queryId;
  return id != null ? String(id).trim() : '';
}

async function noticeUploadCustomRequest(options: {
  file: File | Blob;
  onSuccess?: (body: unknown, file?: File) => void;
  onError?: (e: Error) => void;
}) {
  const { file, onSuccess, onError } = options;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF({
      file: file as File,
      userId: userStore.getUser.id,
      confidentialLevel: String(confidentialLevel.value),
    });
    if (res.data?.code === 0) {
      const payload = res.data as Record<string, unknown>;
      const row = (typeof payload.data === 'object' && payload.data ? payload.data : payload) as Record<string, unknown>;
      const fid = String(row.id ?? row.queryId ?? '').trim();
      const displayName = String(row.oldFileName ?? (file as File).name ?? '');
      const uid = fid || `notice-${Date.now()}`;
      const next = {
        uid,
        name: displayName,
        status: 'done' as const,
        response: res.data,
        ...(fid ? { id: fid } : {}),
      } as UploadFile & { id?: string };
      fileList.value = [next];
      onSuccess?.(res.data, file as File);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
      onError?.(new Error(String((res.data as any)?.msg ?? 'upload failed')));
    }
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

function beforeUploadNotice() {
  return true;
}

function onNoticeRemoveFile() {
  fileList.value = [];
}

// 初始化数据
function noticeInfoAddOrUpdate(data: any, filedata: any) {
  if (data && filedata) {
    id.value = data.id;
    title.value = data.title;
    type.value = data.type;
    content.value = data.content;
    const fid = String(filedata.id ?? filedata.queryId ?? '').trim();
    fileList.value = [
      {
        uid: fid ? `-existing-${fid}` : `notice-${Date.now()}`,
        name: String(filedata.oldFileName ?? ''),
        status: 'done',
        response: filedata,
        ...(fid ? { id: fid } : {}),
      } as UploadFile & { id?: string },
    ];
    confidentialLevel.value = filedata.confidentialLevel ?? 0;
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData(data.content);
      }
    });
  } else {
    id.value = 0;
    title.value = '';
    type.value = '1';
    content.value = '';
    fileList.value = [];
    uploadModalVisible.value = false;
    confidentialLevel.value = 0;
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData(data.content);
      }
    });
  }
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.notice-addorUpdate');
}

defineExpose({ noticeInfoAddOrUpdate });
</script>

<template>
  <!-- <div class="notice-addorUpdate" v-dragModal> -->
  <a-modal
    v-model:visible="visible"
    style="width: 70%"
    :style="{ top: '5%' }"
    :title="$t('公告管理')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="savePageInfo"
    @cancel="handleClose">
    <a-form model="formData" style="margin-top: 20px">
      <a-form-item :label="$t('公告标题')" name="name">
        <a-input v-model:value="title" placeholder="请输入" />
      </a-form-item>
      <a-form-item :label="$t('公告类型')" name="code">
        <a-radio-group v-model:value="type" name="radioGroup">
          <a-radio value="1"> 富文本 </a-radio>
          <a-radio value="2"> 附件 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('公告内容')" name="code">
        <CkeditorPlugin v-if="type === '1'" ref="ckeditorRef" height="400" style="margin-top: 10px" />
        <div v-else-if="type === '2'" class="notice-attachment-row">
          <a-button type="primary" @click="uploadModalVisible = true">上传附件</a-button>
          <span v-if="fileList[0]?.name" class="notice-attachment-row__name">{{ fileList[0].name }}</span>
        </div>
      </a-form-item>
    </a-form>
    <UploadModal
      v-if="type === '2'"
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="confidentialLevel"
      accept=".doc,.docx"
      :file-list="fileList"
      :before-upload="beforeUploadNotice"
      :custom-request="noticeUploadCustomRequest"
      @remove-file="onNoticeRemoveFile" />
    <template #footer>
      <a-button type="primary" @click="savePageInfo">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="handleClose">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<style scoped lang="less">
.notice-addorUpdate {
  position: relative;
}

.notice-attachment-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-attachment-row__name {
  color: rgba(0, 0, 0, 0.65);
}
</style>
