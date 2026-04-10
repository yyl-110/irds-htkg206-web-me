<template>
  <div class="content-layout">
    <draggable-modal :visible="modalVisible" :title="modalType === 2 ? '编辑知识' : '知识上传'" :closable="false" centered
      :maskClosable="false" @cancel="closeFun" @ok="submitFun" :ok-text="modalType === 2 ? '确认' : '确认'"
      :cancel-text="'取消'" :width="900">

      <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="附件名称">
          <a-input class="elInput" v-model:value="ruleForm.annexName" disabled />
        </a-form-item>
        <a-form-item label="标签属性" name="checkTabList" class="position-el-form-item">
          <a-input class="elInput" :value="ruleForm.checkTabList.join(',')" disabled />
          <div class="elBtn text-primary" @click="editTabStatsFun">浏览</div>
        </a-form-item>
        <a-form-item label="OU属性" class="position-el-form-item">
          <a-input class="elInput" :value="checkOUList.join(', ')" disabled />
          <div class="elBtn text-primary" @click="chooseOUFun">浏览</div>
        </a-form-item>
        <a-form-item label="附件类型">
          <a-select class="elInput" v-model:value="ruleForm.annexType" disabled>
            <a-select-option value="doc">.doc</a-select-option>
            <a-select-option value="pdf">.pdf</a-select-option>
            <a-select-option value="docx">.docx</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布状态" name="releaseStatus">
          <a-select class="elInput" v-model:value="ruleForm.releaseStatus">
            <a-select-option value="0">已发布</a-select-option>
            <a-select-option value="1">未发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键字" class="position-el-form-item">
          <a-input class="elInput" v-model:value="ruleForm.keywords" />
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
        <a-form-item label="是否文本附件" class="position-el-form-item">
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
        <a-form-item label="上传文件">
          <!-- <UploadFile :fileList="fileList" @change="filechange" @customRequest="customRequest" /> -->
          <a-upload v-model:fileList="fileList" class="upload-demo" :action="actionUrl" :data="loginUserId"
            :max-count="limit" :accept="accept" :show-upload-list="true" :before-upload="handleBeforeUpload"
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
      </a-form>
    </draggable-modal>
    <draggable-modal v-model:visible="OUDialogVisible" :maskClosable="false" :width="500" title="OU属性"
      @cancel="closeOUDialogFun">
      <a-checkbox v-model:checked="checkAllOU" :indeterminate="isIndeterminate"
        @change="handleCheckAllChange">电装集团</a-checkbox>
      <div class="mt-[16px]">
        <a-checkbox-group v-model:value="checkOUList" @change="handleCheckedCitiesChange">
          <a-checkbox v-for="item in OUData" :key="item.id" :value="item.name">{{ item.name }}</a-checkbox>
        </a-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button type="primary" @click="closeOUDialogFun">确定</a-button>
          <a-button @click="closeOUDialogFun">取消</a-button>
        </span>
      </template>
    </draggable-modal>

    <tag-modal ref="tagModalRef" @closeModal="saveTag" :listData="labelData" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { InfoCircleFilled } from '@ant-design/icons-vue';
import draggableModal from "@/components/DraggableModal/index.vue";
import { getTreeNodeByNodeLevel, modifyInit, OuList, saveKnowledgeFile } from "@/api/knowledge";
import tagModal from './tagModal.vue'
import { UploadFile } from "@/components/UploadFile";
import HttpRequestConfig from "@/httpRequest/config";
import { useUserStore } from "@/store/modules/user";

const props = defineProps({
  nodeData: {
    type: Object,
    default: () => { },
  },
  parentNode: {
    type: Object,
    default: () => { },
  }
});
const emit = defineEmits(["saveSuccess"]);

const modalVisible = ref(false);
const modalType = ref(1);
const ruleFormRef = ref();
const tagModalRef = ref(null);
const editData = ref({})

/* 文件上传 */
const fileList = ref([]);
const limit = ref(1);
const accept = ref('.pdf, .docx, .doc, .mp4, .MP4, .JPG, .wmv, .avi, .bmp, .png, .ppt, .pptx,.jpeg, .xlsx, .xls');
const actionUrl = ref('')
// 标准代号禁用
const codeNumber = ref(false);
// 上传类型标识
const uploadType = ref('');
// 文件对象参数
const fileObjParams = ref([]);
const loginUserId = { userId: useUserStore().getUser.id }
const fileInfo = ref({})

// 分类标签数据
const checkTabList = ref([]);
// OU属性标签
const checkOUList = ref(['新变厂', '衡变公司', '沈变公司']);
const OUDialogVisible = ref(false)
const isIndeterminate = ref(true);
// OU属性所有值
const OUData = ref([]);
// 选中标签名称
const selectedName = ref([]);
const kldFileId = ref('')

const labelData = ref([])

// 新建知识上传数据
const ruleForm = reactive({
  annexName: '',
  codeNumber: '',
  keywords: '',
  // 默认发布
  releaseStatus: '0',
  isDown: '否',
  annexType: '',
  isAnnex: '否',
  desc: '',
  classification: '非密',
  checkTabList: []
});

// 注意：Ant Design Vue 的 rules 需配合 a-form-item 的 name 使用
const rules = {
  checkTabList: [{ required: true, message: '请选择分类属性', trigger: 'blur' }],
  releaseStatus: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
  isDown: [{ required: true, message: '请选择分类属性', trigger: 'change' }],
};

// 获取OU属性的数据
const getOUList = () => {
  const params = {
    key: 'OU',
  };
  OuList(params).then(res => {
    OUData.value = [];
    selectedName.value = [];
    OUData.value = res.data.data.slice(1);
    selectedName.value = res.data.data.slice(1);
    checkOUList.value = OUData.value.map(v => v.name);
  });
};

// OU属性浏览
const chooseOUFun = () => {
  getOUList();
  OUDialogVisible.value = true;
};

// OU属性关闭
const closeOUDialogFun = () => {
  OUDialogVisible.value = false;
};

// OU属性事件
const handleCheckedCitiesChange = value => {
  selectedName.value = OUData.value.filter(v => value.includes(v.name));
  const checkedCount = value.length;
  // 判断选中状态
  checkAllOU.value = checkedCount === OUData.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < OUData.value.length;
};

// OU属性全选
const handleCheckAllChange = e => {
  const checked = e?.target?.checked;
  checkOUList.value = checked ? OUData.value.map(v => v.name) : [];
  selectedName.value = checked ? [...OUData.value] : [];
  isIndeterminate.value = false;
};

const editTabStatsFun = () => {
  tagModalRef.value.show(ruleForm.checkTabList);
}

const saveTag = (data) => {
  ruleForm.checkTabList = data;
};

// 文件信息
const fileData = val => {
  fileObjParams.value = [];
  let obj = {};
  obj = {
    fileId: String(val.fileId),
    fileName: val.fileName,
    fileType: val.fileType,
    fileUrl: val.fileUrl,
  };
  fileObjParams.value.push(obj);
};

const fetchDetail = async () => {
  try {
    const res = await modifyInit({ kldFileId: kldFileId.value })
    if (res.data.code === '0') {
      editData.value = res.data.data
      const val = res.data.data
      fileData(val);
      ruleForm.annexName = val.fileName;
      ruleForm.codeNumber = val.standardNo;
      ruleForm.isDown = val.allowDownload === 1 ? '1' : '0';
      ruleForm.isAnnex = val.isTextAttachment === 1 ? '1' : '0';
      ruleForm.keywords = val.keywords;
      ruleForm.annexType = val.fileType;
      ruleForm.desc = val.summary;
      ruleForm.releaseStatus = val.releaseStatus;
      // 标签属性
      ruleForm.checkTabList = val.kldTageNames.split('[')[1]?.split(']')[0]?.split(', ') ? val.kldTageNames.split('[')[1]?.split(']')[0]?.split(', ') : val.kldTageNames.split(',');
      // OU属性
      checkOUList.value = [val.ou1Name, val.ou2Name, val.ou3Name];
      fileList.value = [];
      fileList.value.push({ name: val.fileName + '' + val.fileType });
      uploadTypeFun(val);
    }
  } catch (error) {
    console.log('error:', error)
  }
}

/**
 * 显示标签弹窗
 * @param {Object} node 当前节点
 * @param {Object} parent 父级节点
 * @param {String} modalType 弹窗类型 1 新增 2 修改
 */
const show = (type, id) => {
  fetchTagList()
  getOUList();
  kldFileId.value = id;
  modalType.value = type;
  if (id) {
    fetchDetail();
  }
  modalVisible.value = true;
};

const resetClose = () => {
  // 1. 重置表单数据
  Object.assign(ruleForm, {
    annexName: '',
    codeNumber: '',
    keywords: '',
    releaseStatus: '0', // 默认已发布
    isDown: '否',
    annexType: '',
    isAnnex: '否',
    desc: '',
    classification: '非密',
    checkTabList: [],
  });

  // 2. 重置文件相关
  fileList.value = [];
  fileObjParams.value = [];
  fileInfo.value = {};
  actionUrl.value = '';
  codeNumber.value = false; // 标准代号输入框恢复可编辑

  // 3. 重置标签和 OU
  checkOUList.value = ['新变厂', '衡变公司', '沈变公司']; // 恢复默认值或清空？根据需求
  selectedName.value = [];
  kldFileId.value = '';

  // 4. 重置其他状态
  modalType.value = 1;
  uploadType.value = '';
  modalVisible.value = false;
};

defineExpose({
  show,
  close: resetClose,
});

const closeFun = () => {
  // Ant Design Vue 的 form 没有 resetFields，需手动重置或使用 form 实例方法
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
  resetClose();
};

const handleBeforeUpload = file => {
  const maxSize = 104857600;
  if (fileList.value.length >= limit.value) {
    message.error(`只能上传${limit.value}个附件`);
    return false;
  }
  if (file.size && file.size > maxSize) {
    message.error('文件不能大于 100M!');
    return false;
  }
  return new Promise(resolve => {
    nextTick(() => {
      actionUrl.value = HttpRequestConfig.baseUrl + '/base-service/fileManagerController/uploadWordToPDFForKnowledge.json';
      resolve();
    });
  });
};

// 上传类型
const uploadTypeFun = type => {
  if (type.fileType === 'JPG' || type.fileType === 'jpg' || type.fileType === 'png') {
    uploadType.value = '3';
  } else if (type.fileType === 'MP4' || type.fileType === 'mp4' || type.fileType === 'wmv' || type.fileType === 'avi') {
    uploadType.value = '2';
  } else {
    uploadType.value = '1';
  }
};

// 文件上传成功
const handleUploadSuccess = (response, file) => {
  if (response.data?.id) {
    fileObjParams.value = [];
    fileInfo.value = response.data
    let obj = {};
    obj = {
      fileId: String(response.data.id),
      fileName: response.data.documentName,
      fileType: response.data.fileType,
      fileUrl: response.data.fileUrl,
    };
    fileObjParams.value.push(obj);
    uploadTypeFun(response.data);
    message.success('上传成功');
    return;
  }
};

// Ant Design Vue Upload Change Handler 
const handleUploadChange = (info) => {
  let resFileList = [...info.fileList];
  fileList.value = resFileList;

  if (info.file.status === 'done') {
    handleUploadSuccess(info.file.response, info.file);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  } else if (info.file.status === 'removed') {
    removeFileList(info.file, resFileList);
  }
};

// 文件删除
const removeFileList = (file, flist) => {
  fileList.value = flist;
};

const submitFun = async () => {
  try {
    await ruleFormRef.value.validateFields();
    submit()
  } catch (error) {
    console.warn("Validation failed:", error);
  }
};

const submit = async () => {
  try {
    // 1. 使用 Set 优化查找速度 (O(1) 查找)
    const checkTabNames = new Set(ruleForm.checkTabList);
    const extractedIds = new Set(); // 直接用 Set 去重收集，替代原来的 push + [...new Set()]
    const selectedLabel = []

    // 2. 仅遍历一次 labelData 收集对应的 ID，去掉了冗余的 selectType 判断
    labelData.value.forEach(group => {
      if (group.children && group.children.length > 0) {
        group.children.forEach(child => {
          // 精准匹配，只有在被勾选的标签里的，才提取其 ID
          if (checkTabNames.has(child.nodeName)) {
            selectedLabel.push(child)
            extractedIds.add(child.id);
          }
        });
      }
    });

    const kldTagIdsStr = Array.from(extractedIds).join(','); // 替代原先脆弱的 slice(-length) 逻辑

    // 3. 简化 params 组装，使用 || 替代繁琐的三元表达式
    const params = {
      id: kldFileId.value || '', // 新增时传空，编辑时传id
      userId: useUserStore().getUser.id,
      standardNo: ruleForm.codeNumber,
      kldTagIds: kldTagIdsStr,
      kldTageNames: ruleForm.checkTabList, // 若接口需要字符串可加 .join(',')
      allowDownload: ruleForm.isDown === '1' ? '1' : '0',
      oU1Id: selectedName.value[0]?.value || '',
      oU1Name: selectedName.value[0]?.name || '',
      oU2Id: selectedName.value[1]?.value || '',
      oU2Name: selectedName.value[1]?.name || '',
      oU3Id: selectedName.value[2]?.value || '',
      oU3Name: selectedName.value[2]?.name || '',
      isTextAttachment: ruleForm.isAnnex === '1' ? '1' : '0',
      attachmentType: '',
      releaseStatus: ruleForm.releaseStatus,
      securityLevel: ruleForm.classification === '非密' ? '2' : '1',
      kldTreeId: props.nodeData.id || editData.value.kldTreeId,
      kldTreeNodeId: props.parentNode?.id || editData.value.kldTreeNodeId,
      keywords: ruleForm.keywords,
      summary: ruleForm.desc,
      title: ruleForm.annexName,
      tagsJson: JSON.stringify(selectedLabel),
      batch: fileObjParams.value,
    };

    const res = await saveKnowledgeFile(params);

    // 4. 增加容错判断
    if (res?.data?.code === '0') {
      message.success('保存成功');
      emit('saveSuccess');
      resetClose()
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
    const params = {
      nodeLevel: '2',
      tagType: '1',
    };

    const res = await getTreeNodeByNodeLevel(params);
    if (res.data.code === '0') {
      labelData.value = res.data.data.result || [];
    }
  } catch (error) {
    console.log('error:', error)

  }
}

watch(
  () => fileInfo.value,
  val => {
    if (val) {
      // 文件上传成功后反显
      ruleForm.annexName = val.documentName;
      ruleForm.annexType = val.fileType;
      if (val.fileType === 'JPG' || val.fileType === 'png' || val.fileType === 'jpg' || val.fileType === 'avi' || val.fileType === 'mp4' || val.fileType === 'wmv') {
        ruleForm.codeNumber = '';
        codeNumber.value = true;
      } else {
        codeNumber.value = false;
      }
      uploadTypeFun(val);
    }
  },
);
</script>

<style lang="less" scoped>
.position-el-form-item {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;

    .elBtn {
      flex-shrink: 0;
      margin-left: 10px
    }

    .infoFilled-ico {
      flex-shrink: 0;
      margin-left: 10px
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
    font-family: Source Sans 3, Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: var(--ant-primary-color);
  }
}

.upRight {
  .fileRequest {
    font-family: Source Sans 3, Source Sans 3;
    font-weight: 400;
    font-size: 14px;
    color: #6a696e;
    height: 22px;
  }

  .fileImport {
    font-family: Source Sans 3, Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #a2a1a6;
    height: 22px;
  }
}
</style>