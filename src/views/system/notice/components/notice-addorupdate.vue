<script lang="ts" setup>
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { message } from 'ant-design-vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { Uploado_draggerFile } from '@/components/UploadFile';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
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
requestParams.userid = userStore.getUser.id;

const id = ref(0);
const title = ref('');

const content = ref('');
const ckeditorRef = ref();

/** handle close */
function handleClose() {
  fileList.value = [];
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
  if (type.value == '2' && !fileList.value[0].id) {
    message.error(WeiI18n.$t('附件不能为空!'));
    return;
  }
  if (type.value == '1') {
    content.value = ckeditorRef.value.getData();
  }
  // 保存信息
  if (id.value != undefined && id.value > 0) {
    requestParams.id = id.value;
    if (fileList.value !== undefined && fileList.value.length > 0) {
      requestParams.fileid = fileList.value[0].id;
    } else {
      requestParams.fileid = '';
    }
    requestParams.title = title.value;
    requestParams.type = type.value;
    requestParams.content = content.value;
    requestParams.userid = `${userStore.getUser.id}`;
    // 保存页面信息
    const res = await AdminApiSystemNotice.noticeUpdate({
      ...requestParams,
    });
  } else {
    if (fileList.value !== undefined && fileList.value.length > 0) {
      requestParams.fileid = fileList.value[0].id;
    } else {
      requestParams.fileid = '';
    }
    requestParams.title = title.value;
    requestParams.type = type.value;
    requestParams.content = content.value;
    requestParams.userid = `${userStore.getUser.id}`;
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

const fileList = ref<any>([]);
async function customRequest(options: any) {
  // 调用上传接口
  const data = new FormData();
  data.append('file', options.file);
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      fileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
function filechange(file: any) {
  fileList.value[0] = file;
}

// 初始化数据
function noticeInfoAddOrUpdate(data: any, filedata: any) {
  if (data && filedata) {
    id.value = data.id;
    title.value = data.title;
    type.value = data.type;
    content.value = data.content;
    fileList.value = [{ ...filedata, name: filedata.oldFileName }];
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
        <Uploado_draggerFile v-if="type === '2'" width="600px" :file-list="fileList" @change="filechange" @custom-request="customRequest" />
      </a-form-item>
    </a-form>
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
</style>
