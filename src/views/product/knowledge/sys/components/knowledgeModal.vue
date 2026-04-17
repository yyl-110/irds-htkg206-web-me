<template>
  <div class="content-layout">
    <draggable-modal
      :visible="modalVisible"
      :title="modalType === 2 ? '编辑知识' : '知识上传'"
      :closable="false"
      centered
      :maskClosable="false"
      @cancel="closeFun"
      @ok="submitFun"
      :ok-text="modalType === 2 ? '确认' : '确认'"
      :cancel-text="'取消'"
      :width="900"
      :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }">
      <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="上传文件">
          <a-upload
            v-model:fileList="fileList"
            class="upload-demo"
            :max-count="limit"
            :accept="accept"
            :show-upload-list="true"
            :before-upload="handleBeforeUpload"
            :custom-request="customRequest"
            @change="handleUploadChange">
            <div style="display: flex">
              <div class="upBtn">
                <img src="@/assets/images/Frame1.png" alt="" />
                <div class="upBtnText">上传文件</div>
              </div>
              <div class="upRight">
                <div class="fileRequest">文件要求</div>
                <div class="fileImport">格式：支持格式pdf,docx,doc,mp4,jpg,wmv,avi,bmp,png,ppt,pptx,jpeg,xlsx,xls</div>
                <div class="fileImport">文件大小限制：对单个文件大小有限制，每个文档不超过100M!</div>
                <div class="fileImport">超过5M的文件，预览功能上传成功后一分钟后可以使用</div>
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="附件名称">
          <a-input class="elInput" v-model:value="ruleForm.annexName" disabled />
        </a-form-item>
        <a-form-item label="标签属性" name="checkTabList" class="position-el-form-item">
          <a-input class="elInput" :value="ruleForm.checkTabList.join(',')" disabled placeholder="请选择标签属性" />
          <div class="elBtn text-primary" @click="editTabStatsFun">浏览</div>
        </a-form-item>

        <a-form-item label="附件类型">
          <a-select class="elInput" v-model:value="ruleForm.annexType" disabled>
            <a-select-option value="doc">.doc</a-select-option>
            <a-select-option value="pdf">.pdf</a-select-option>
            <a-select-option value="docx">.docx</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="密级">
          <a-select class="elInput" v-model:value="ruleForm.confidentialLevel" placeholder="请选择密级">
            <a-select-option value="0">公开</a-select-option>
            <a-select-option value="1">内部</a-select-option>
            <a-select-option value="2">秘密</a-select-option>
            <a-select-option value="3">机密</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布状态" name="releaseStatus">
          <a-select class="elInput" v-model:value="ruleForm.releaseStatus" placeholder="请选择发布状态">
            <a-select-option value="0">已发布</a-select-option>
            <a-select-option value="1">未发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键字" class="position-el-form-item">
          <a-input class="elInput" v-model:value="ruleForm.keywords" placeholder="请输入关键字" />
          <a-tooltip placement="topRight" title="使用英文逗号,分隔">
            <InfoCircleFilled class="infoFilled-ico text-primary" />
          </a-tooltip>
        </a-form-item>
        <a-form-item label="标准代号">
          <a-input class="elInput" :disabled="codeNumber" v-model:value="ruleForm.codeNumber" />
        </a-form-item>
        <a-form-item label="是否允许下载源文件" name="isDown">
          <a-radio-group v-model:value="ruleForm.isDown" class="ml-4">
            <a-radio value="1">否</a-radio>
            <a-radio value="0">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否设计推送知识" class="position-el-form-item">
          <a-radio-group v-model:value="ruleForm.isAnnex" class="ml-4">
            <a-radio value="1">否</a-radio>
            <a-radio value="0">是</a-radio>
          </a-radio-group>
          <a-tooltip placement="topRight" title="如为是，用于知识推送选择文档及内容">
            <InfoCircleFilled class="infoFilled-ico infoFilled-ico1 text-primary" />
          </a-tooltip>
        </a-form-item>
        <a-form-item label="摘要">
          <a-textarea v-model:value="ruleForm.desc" :maxlength="100" placeholder="请输入摘要，最多100字符" />
        </a-form-item>
      </a-form>
    </draggable-modal>

    <tag-modal ref="tagModalRef" @closeModal="saveTag" :listData="labelData" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { InfoCircleFilled } from '@ant-design/icons-vue';
import draggableModal from '@/components/DraggableModal/index.vue';
import { getTreeNodeByNodeLevel, modifyInit, saveKnowledgeFile } from '@/api/knowledge';
import tagModal from './tagModal.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  nodeData: {
    type: Object,
    default: () => {},
  },
  parentNode: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['saveSuccess']);

const modalVisible = ref(false);
const modalType = ref(1);
const ruleFormRef = ref();
const tagModalRef = ref(null);
const editData = ref({});

/* 文件上传 */
const fileList = ref([]);
const limit = ref(1);
const accept = ref('.pdf, .docx, .doc, .mp4, .MP4, .JPG, .wmv, .avi, .bmp, .png, .ppt, .pptx,.jpeg, .xlsx, .xls');
// 标准代号禁用
const codeNumber = ref(false);
// 文件对象参数
const fileObjParams = ref([]);

const kldFileId = ref('');

const labelData = ref([]);

// 新建知识上传数据
const ruleForm = reactive({
  annexName: '',
  codeNumber: '',
  keywords: '',
  releaseStatus: '0', // 默认发布
  isDown: '1',
  annexType: '',
  isAnnex: '1',
  confidentialLevel: null,
  desc: '',
  classification: '非密',
  checkTabList: [],
});

const rules = {
  checkTabList: [{ required: true, message: '请选择分类属性', trigger: 'blur' }],
  releaseStatus: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
  isDown: [{ required: true, message: '请选择分类属性', trigger: 'change' }],
};

const editTabStatsFun = () => {
  tagModalRef.value.show(ruleForm.checkTabList);
};

const saveTag = data => {
  ruleForm.checkTabList = data;
};

const fetchDetail = async () => {
  try {
    const res = await modifyInit({ kldFileId: kldFileId.value });
    if (res.data.code === '0') {
      editData.value = res.data.data;
      const val = res.data.data;

      // 组装文件对象参数
      fileObjParams.value = [
        {
          fileId: String(val.fileId),
          fileName: val.fileName,
          fileType: val.fileType,
          fileUrl: val.fileUrl,
        },
      ];

      ruleForm.annexName = val.fileName;
      ruleForm.codeNumber = val.standardNo;
      ruleForm.isDown = val.allowDownload == 1 ? '1' : '0';
      ruleForm.isAnnex = val.isTextAttachment == 1 ? '1' : '0';
      ruleForm.keywords = val.keywords;
      ruleForm.annexType = val.fileType;
      ruleForm.desc = val.summary;
      ruleForm.releaseStatus = val.releaseStatus;
      // 标签属性
      ruleForm.checkTabList = val.kldTageNames.split('[')[1]?.split(']')[0]?.split(', ') ?? val.kldTageNames.split(',');

      fileList.value = [{ name: val.fileName + '' + val.fileType }];
    }
  } catch (error) {
    console.log('error:', error);
  }
};

const show = (type, id) => {
  fetchTagList();
  kldFileId.value = id;
  modalType.value = type;
  if (id) {
    fetchDetail();
  }
  modalVisible.value = true;
};

const resetClose = () => {
  Object.assign(ruleForm, {
    annexName: '',
    codeNumber: '',
    keywords: '',
    releaseStatus: '0',
    isDown: '1',
    annexType: '',
    isAnnex: '1',
    desc: '',
    classification: '非密',
    checkTabList: [],
    confidentialLevel: null,
  });

  fileList.value = [];
  fileObjParams.value = [];
  codeNumber.value = false;

  kldFileId.value = '';
  modalType.value = 1;
  modalVisible.value = false;
};

defineExpose({
  show,
  close: resetClose,
});

const closeFun = () => {
  ruleFormRef.value?.resetFields();
  resetClose();
};

const handleBeforeUpload = file => {
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
      confidentialLevel: props.nodeData.level,
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

// 文件上传成功：处理文件信息并回显表单
const handleUploadSuccess = data => {
  if (!data?.id) return;

  fileObjParams.value = [
    {
      fileId: String(data.id),
      fileName: data.documentName,
      fileType: data.fileType,
      fileUrl: data.fileUrl,
    },
  ];

  // 回显表单字段
  ruleForm.annexName = data.documentName;
  ruleForm.annexType = data.fileType;

  const mediaTypes = ['JPG', 'jpg', 'png', 'avi', 'mp4', 'wmv'];
  if (mediaTypes.includes(data.fileType)) {
    ruleForm.codeNumber = '';
    codeNumber.value = true;
  } else {
    codeNumber.value = false;
  }

  message.success('上传成功');
};

// Upload Change Handler：仅负责同步 fileList 和处理异常状态
const handleUploadChange = info => {
  fileList.value = [...info.fileList];

  if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  } else if (info.file.status === 'removed') {
    fileObjParams.value = [];
  }
};

const submitFun = async () => {
  try {
    await ruleFormRef.value.validateFields();
    submit();
  } catch (error) {
    console.warn('Validation failed:', error);
  }
};

const submit = async () => {
  try {
    const checkTabNames = new Set(ruleForm.checkTabList);
    const extractedIds = new Set();
    const selectedLabel = [];

    labelData.value.forEach(group => {
      group.children?.forEach(child => {
        if (checkTabNames.has(child.nodeName)) {
          selectedLabel.push(child);
          extractedIds.add(child.id);
        }
      });
    });

    const params = {
      id: kldFileId.value || '',
      userId: useUserStore().getUser.id,
      standardNo: ruleForm.codeNumber,
      kldTagIds: Array.from(extractedIds).join(','),
      kldTageNames: ruleForm.checkTabList,
      allowDownload: ruleForm.isDown === '1' ? '1' : '0',
      confidentialLevel: ruleForm.confidentialLevel,
      isTextAttachment: ruleForm.isAnnex === '1' ? '1' : '0',
      attachmentType: '',
      releaseStatus: ruleForm.releaseStatus,
      confidentialLevel: ruleForm.classification === '非密' ? '2' : '1',
      kldTreeId: props.nodeData.key || editData.value.kldTreeId,
      kldTreeNodeId: props.parentNode?.id || editData.value.kldTreeNodeId,
      keywords: ruleForm.keywords,
      summary: ruleForm.desc,
      title: ruleForm.annexName,
      tagsJson: JSON.stringify(selectedLabel),
      batch: fileObjParams.value,
    };
    const res = await saveKnowledgeFile(params);
    if (res?.data?.code === '0') {
      message.success('保存成功');
      emit('saveSuccess');
      resetClose();
    } else {
      message.warning(res?.data?.msg || '保存失败');
    }
  } catch (error) {
    console.error('提交知识文件失败:', error);
    message.error('系统异常，请稍后重试');
  }
};

const fetchTagList = async () => {
  try {
    const res = await getTreeNodeByNodeLevel({ nodeLevel: '2', tagType: '1' });
    if (res.data.code === '0') {
      labelData.value = res.data.data.result || [];
    }
  } catch (error) {
    console.log('error:', error);
  }
};
</script>

<style lang="less" scoped>
.position-el-form-item {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;

    .elBtn {
      flex-shrink: 0;
      margin-left: 10px;
    }

    .infoFilled-ico {
      flex-shrink: 0;
      margin-left: 10px;
    }
  }
}

.upBtn {
  width: 88px;
  height: 88px;
  border-radius: 4px;
  border: 1px dashed #d3d2d9;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .upBtnText {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: var(--ant-primary-color);
  }
}

.upRight {
  .fileRequest {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: #6a696e;
    height: 22px;
  }

  .fileImport {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #a2a1a6;
    height: 22px;
  }
}
</style>
