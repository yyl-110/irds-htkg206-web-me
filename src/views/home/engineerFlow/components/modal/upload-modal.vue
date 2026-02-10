<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { handleEpcDownload } from '@/utils/file';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  uploadDate: {
    require: false,
    type: Object,
    default: false,
  },
  systemsData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  secretData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  stageData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  typeData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
  uploadBelong: {
    require: false,
    type: String,
    default: false,
  },
  taskId: {
    require: false,
    type: Number,
    default: false,
  },
  uploadSuccesscData: {
    require: false,
    type: Array,
    default: () => {
      return [];
    },
  },
});
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  editStage: [type: string];
  uploadsuccess: [fileList: any];
  onFileremove: [fileList: any];
  uploadOk: [fileList: any];
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});

const UploadfileList = ref<Array<UploadFile>>([]);
const labelCol = ref({ style: { width: '120px' } });
// 定义响应式数据（根据实际需求调整）
const formEditdate = reactive({}); // 表单模型（若需表单验证，需配合a-form的rules）
/**
 * before upload file
 * @param file file
 */
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};
/**
 * handle file change
 * @param evt event
 */
const onFileChange: UploadProps['onChange'] = async evt => {};
async function customRequest(options: any) {
  // 调用上传接口
  let data: any = {};
  data.system = props.uploadDate.system;
  data.miji = props.uploadDate.secret;
  data.docType = props.uploadDate.type;
  data.taskId = props.taskId;
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadFileToPDM(data);
    if (res.data.code == 0) {
      const file: any = { ...res.data.data, name: res.data.data?.originalFilename };
      message.success(WeiI18n.t('上传成功').value);
      emit('uploadsuccess', [file]);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
function onFileremove(file: any) {
  console.log(file, 'file');

  emit('onFileremove', [file]);
}
const handlePreview: UploadProps['onChange'] = async (file: any) => {
  const downLoadItem = {
    fileId: file.response ? file.response.id : file.id,
  };
  handleEpcDownload(downLoadItem, file.response ? file.response.fileName : `${file.name}`);
};
const confirmUpload = () => {
  // 关闭模态框
  emit('uploadOk');
};

const editStage = (id: any) => {
  // 文档阶段改变回调（如根据阶段切换文档类型）
  console.log(id, 'id');
  emit('editStage', id);
};
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
watch(
  () => props.uploadSuccesscData,
  (newVal: any, oldVal) => {
    console.log(newVal, 'newVal');
    UploadfileList.value = newVal;
  },
  { immediate: true, deep: true },
);
</script>
<template>
  <a-modal width="40%" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="`${uploadBelong} - pdm上传文件`" @cancel="cancel">
    <a-form ref="ruleFormRef" :model="formEditdate" :label-col="labelCol" style="margin-top: 4px">
      <!-- {{ uploadDate }} -->
      <a-form-item label="系统：" prop="system" style="margin-bottom: 24px">
        <a-select v-model:value="uploadDate.system" placeholder="请选择..." allow-clear show-search style="width: 234px">
          <a-select-option v-for="item in systemsData" :key="item.id" :value="item.name"> {{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 秘级选择 -->
      <a-form-item label="秘级：" prop="secret" style="margin-bottom: 24px">
        <a-select v-model:value="uploadDate.secret" placeholder="请选择..." allow-clear show-search style="width: 234px">
          <a-select-option v-for="item in secretData" :key="item.id" :value="item.name"> {{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 文档阶段选择（带change事件） -->
      <a-form-item label="文档阶段：" prop="stage" style="margin-bottom: 24px">
        <a-select v-model:value="uploadDate.stage" placeholder="请选择..." allow-clear show-search style="width: 234px" @change="editStage">
          <a-select-option v-for="item in stageData" :key="item.id" :value="item.idList"> {{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 文档类型选择 -->
      <a-form-item label="文档类型：" prop="type" style="margin-bottom: 24px">
        <a-select v-model:value="uploadDate.type" placeholder="请选择..." allow-clear show-search style="width: 234px">
          <a-select-option v-for="item in typeData" :key="item.id" :value="item.name"> {{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 上传形式 radio 组 -->
      <a-form-item label="上传形式：" prop="uploadType" style="margin-bottom: 24px">
        <a-radio-group v-model:value="uploadDate.uploadType" style="width: 234px">
          <a-radio value="1">文件上传</a-radio>
          <a-radio value="2">关联已有文件</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 关联已有文件 - 文档编号（uploadType=2时显示） -->
      <a-form-item v-if="uploadDate.uploadType == '2'" label="文档编号：" prop="filePdfNum" style="margin-bottom: 24px">
        <a-input v-model:value="uploadDate.filePdfNum" placeholder="请输入..." style="width: 234px" />
      </a-form-item>
      <!-- 关联已有文件 - 文档版本（uploadType=2时显示） -->
      <a-form-item v-if="uploadDate.uploadType == '2'" label="文档版本：" prop="filePdfVersion" style="margin-bottom: 24px">
        <a-input v-model:value="uploadDate.filePdfVersion" placeholder="请输入..." style="width: 234px" />
      </a-form-item>
      <!-- 文件上传 - 选择文件（uploadType=1时显示） -->
      <a-form-item v-if="uploadDate.uploadType == '1'" label="请选择文件" prop="uploadFile" style="margin-bottom: 24px">
        <a-upload
          v-model:file-list="UploadfileList"
          class="avatar-uploader"
          :with-credentials="true"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @preview="handlePreview"
          @remove="onFileremove"
          @change="onFileChange">
          <div>
            <LoadingOutlined />
            <a-button>
              <upload-outlined></upload-outlined>
              {{ $t('文件上传') }}
            </a-button>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>

    <!-- 模态框 footer -->
    <template #footer>
      <div class="dialog-footer">
        <a-button @click="confirmUpload" type="primary">确定</a-button>
        <a-button @click="emit('onClose', false)">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.upload-demo {
  margin-top: 8px;
}
</style>
