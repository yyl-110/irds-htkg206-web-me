<script lang="ts" setup>
import { ref, watch } from 'vue';
import { message, UploadProps } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { WeiMessage } from '@/utils/WeiMessage';
import { WeiI18n } from '@/utils/WeiI18n';
import TreeNode from '@/components/tree/TreeNode.vue';
import { Uploado_draggerFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const props = defineProps({
  treeData: {
    require: false,
    type: Array,
  },
  /** 操作按钮状态 */
  operateFlag: {
    require: false,
    type: Boolean,
    default: true,
  },
  /** 添加列 */
  nodeColmoun: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 默认展开的树节点 */
  expandedKeys: {
    require: false,
    type: Array<nodeSource>,
    default: () => {
      return [];
    },
  },

  /** 是否允许添加根节点 */
  ifAddRoot: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 唯一性标识 */
  sign: {
    require: false,
    type: String,
    default: '',
  },

  selectedKeys: {
    require: false,
    type: String,
    default: '',
  },

  currentNode: {
    require: false,
    type: Object,
    default: {},
  },

  /** bom 类型 */
  bomType: {
    require: false,
    type: String,
    default: '',
  },

  defaultExpandKeys: {
    require: false,
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits<{
  /** 添加、编辑点击确认 */
  submit: [nodelist: Array<nodeSource>, selectedKeys: any];
  /** 点击选择节点按钮触发 */
  selectNode: [selectedKeys: any];

  /** 重新加载结构树 */
  reloadTree: [languageSel: string];

  /** 获取节点修改信息 */
  getNodeUpdateData: [selectedKeys: any];

  /** 删除节点 */
  deleteTreeNode: [selectedKeys: any];

  /** 获取兄弟节点数组 */
  currentNodeList: [id: any, type: any];

  /** 节点查询 */
  changeSelectKey: [title: any, languageSel: any];

  /** 选择Boom树节点 */
  selectBoomTree: [item: any];
  /** 浏览人员*/
  Personnelselection: [item: any];
}>();

const searchValue = ref<string>('');
const languageSel = ref<string>('');
const selectedKey = ref<any>();
const modalVisible = ref<boolean>(false);
const title = ref<string>('');
const labelCol = ref({ style: { width: '100px' } });
const selectedKeys = ref<any>([]);
const selectedNode = ref<any>();
const newExpandedKeys = ref<any>([]);
const btnReadOnly = ref<string>('0');
const formRef = ref<any>(null);
function initMenuState() {
  newExpandedKeys.value = [];
  // 获取初始化选中节点
  if (props.selectedKeys != null) {
    selectedKeys.value = [props.selectedKeys];
    selectedKey.value = props.selectedKeys;
  }
  // 获取初始化展开节点数据
  if (props.expandedKeys != null) {
    const list = props.expandedKeys as Array<any>;
    if (list.includes(',')) {
      list
        .toString()
        .split(',')
        .forEach((item: any) => {
          newExpandedKeys.value.push(item);
        });
    } else if (list && !list.includes(',')) {
      newExpandedKeys.value.push(list);
    }
  }
}
// initMenuState()
watch(
  () => props.selectedKeys || props.expandedKeys,
  () => {
    nextTick(() => {
      initMenuState();
    });
  },
  { immediate: true, deep: true },
);

watch(searchValue, value => {
  // 查询条件变更更改结构树
  emit('changeSelectKey', value, languageSel.value);
});

/** 树节点类型定义,根据实际业务情况进行调整 */
interface nodeSource {
  title: string;
  key: string;
  value: string;
}

/**
 * @description 树节点进行添加
 */
function addTree() {
  if (checkedNode()) {
    title.value = '新增节点';
    ruleForm.parentId = props.currentNode.id;
    ruleForm.parentNodeName = props.currentNode.partName;
    ruleForm.id = '';
    ruleForm.nodeName = '';
    ruleForm.nodeEnName = '';
    ((ruleForm.nodeCategory = '1'), (ruleForm.applicationType = 'Excel'));
    ruleForm.imageFileId = '';
    ruleForm.uploadFileList = [];
    fileListExcel.value = [];
    fileListWord.value = [];
    fileList.value = [];
    modalVisible.value = true;
  }
}

async function updTree() {
  if (props.currentNode.parentId == 0) {
    WeiMessage.warning(WeiI18n.$t('根节点不允许编辑'));
    return;
  }
  if (checkedNode()) {
    title.value = '编辑节点';
    let data: any = { id: props.currentNode.id };
    const res = await AdminApiSystemCheckInfoApi.checkTreeDetail(data);
    console.log(res);
    let result = res.data.data.result;
    ruleForm.id = result.id;
    ruleForm.parentId = result.parentId;
    ruleForm.productType = result.productType;
    ruleForm.toolType = result.toolType;
    ruleForm.parentNodeName = result.parentNodeName;
    ruleForm.nodeName = result.nodeName;
    ruleForm.nodeEnName = result.nodeEnName;
    ruleForm.nodeCategory = result.nodeCategory;
    ruleForm.applicationType = result.applicationType;
    ruleForm.imageFileId = result.imageFileId;
    ruleForm.organizationalAffiliation1 = result.organizationalAffiliation1;
    ruleForm.organizationalAffiliation2 = result.organizationalAffiliation2;
    ruleForm.empowerFlag = result.empowerFlag;
    ruleForm.secretLevel = result.secretLevel;
    ruleForm.createBy = result.createBy;
    ruleForm.exeId = result.exeId;
    ruleForm.sort = result.sort;
    fileListExcel.value = [];
    fileListWord.value = [];
    if (result.uploadFileList.length > 0) {
      result.uploadFileList.forEach((item: any) => {
        if (item.uploadFileType == 'Excel') {
          fileListExcel.value.push({
            fileId: item.fileId,
            oldFileName: item.fileName,
            fileName: item.fileName,
            filePath: imgRooturl + item.fileName,
            pdfFileName: imgRooturl + item.fileName,
          });
        } else {
          fileListWord.value.push({
            fileId: item.fileId,
            oldFileName: item.fileName,
            fileName: item.fileName,
            filePath: imgRooturl + item.fileName,
            pdfFileName: imgRooturl + item.fileName,
          });
        }
      });
    }
    modalVisible.value = true;
  }
}
/**
 * 判断选中的节点是否有效
 * @returns 返回布尔值，如果选中的节点有效返回true，否则返回false
 */
function checkedNode(): boolean {
  let flag = true;
  if (props.ifAddRoot !== true) {
    if (selectedKey.value === undefined) {
      WeiMessage.warning(WeiI18n.$t('请选择'));
      flag = false;
    }
    //  需要根据实际返回数据进行调整， 这里只是模拟数据 1 为根节点
    if (selectedKey.value === '0') {
      WeiMessage.warning(WeiI18n.$t('请选择根节点'));
      flag = false;
    }
  }
  return flag;
}

/**
 * @description 树节点进行排序 向上
 */
async function toUpTreeNode() {
  let data: any = { id: props.currentNode.id, moveFlag: 1 };
  const res = await AdminApiSystemCheckInfoApi.checkTreeUpOrDownMove(data);
  WeiMessage.success('排序成功');
  emit('reloadTree', '');
}

/**
 * @description 树节点进行排序 向下
 */
async function toDownTreeNode() {
  let data: any = { id: props.currentNode.id, moveFlag: 2 };
  const res = await AdminApiSystemCheckInfoApi.checkTreeUpOrDownMove(data);
  WeiMessage.success('排序成功');
  emit('reloadTree', '');
}

/**
 * @description 树节点进行删除
 */
async function delTree() {
  if (checkedNode()) {
    let data: any = { id: props.currentNode.id };
    const res = await AdminApiSystemCheckInfoApi.checkTreeDelete(data);
    WeiMessage.success('删除成功');
    emit('reloadTree', '');
  }
}

/**
 * @param selectedKeys - 选中节点key
 * @param info - 选中节点信息
 * @param info.selected 是否选中
 * @param info.key  节点key
 * @param info.node 选中节点
 * @param info.event   事件
 * @param info.index
 */
function onSelect(
  selectedKeys: any[],
  info: {
    selected: boolean;
    key: string;
    node: any;
    event: Event;
    index: number;
  },
): void {
  selectedKey.value = selectedKeys[0];
  selectedNode.value = info.node;
  emit('selectNode', selectedNode.value);
}

/**
 * 取消点击事件时触发
 * @param e MouseEvent
 */
function cancel(e: MouseEvent) {
  message.error('取消删除');
}

const ruleForm = reactive({
  id: '',
  parentId: '',
  productType: '17',
  toolType: '1',
  parentNodeName: '',
  nodeName: '',
  nodeEnName: '',
  nodeCategory: '1',
  applicationType: 'Excel',
  imageFileId: '',
  organizationalAffiliation1: '',
  organizationalAffiliation2: '',
  empowerFlag: '',
  secretLevel: '',
  createBy: useUserStore().getUser.id,
  exeId: '',
  sort: '',
  uploadFileList: [],
});
const rules = reactive({
  nodeName: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    { min: 1, max: 20, message: '名称1至20个字', trigger: 'blur' },
  ],
  nodeCategory: [
    {
      required: true,
      message: '请选择节点类型',
      trigger: 'change',
    },
  ],
});
async function onOk() {
  // 调用表单验证方法
  formRef.value
    .validate()
    .then(async () => {
      if (ruleForm.nodeCategory == '1') {
        ruleForm.uploadFileList = [];
        if (fileListExcel.value.length > 0) {
          ruleForm.uploadFileList.push({
            fileId: fileListExcel.value[0].fileId,
            uploadFileType: 'Excel',
          });
        }
        if (fileListWord.value.length > 0) {
          ruleForm.uploadFileList.push({
            fileId: fileListWord.value[0].fileId,
            uploadFileType: 'Template',
          });
        }
      }
      const res = await AdminApiSystemCheckInfoApi.checkSaveOrUpdate(ruleForm);
      if (res.data.code == '0') {
        WeiMessage.success('保存成功');
        modalVisible.value = false;
        emit('reloadTree', '');
      }
    })
    .catch(errorInfo => {
      // 验证失败
      console.log('验证失败', errorInfo);
    });
}
/**
 * @param innerFlag
 * @description 添加节点
 */
function changeBtnStyle(innerFlag: boolean) {
  if (innerFlag) {
    // 内部节点不可编辑删除
    btnReadOnly.value = '1';
  } else {
    // 外部节点可编辑删除
    btnReadOnly.value = '0';
  }
}
// 搜索树的子节点
function searchSubTree(node: any) {
  const { children } = node;
  if (children && children.length) {
    let hasVisibleChild = false;
    const newChildren = children.filter(child => {
      const { partNumber, partName } = child;
      const showName = partNumber + partName;
      const isVisible = showName.includes(searchValue.value) || searchSubTree(child);
      if (isVisible) hasVisibleChild = true;
      return isVisible;
    });
    if (!hasVisibleChild) return false;
    node.children = newChildren;
  }
  return true;
}

const fileList = ref<any>([]);
const userStore = useUserStore();
const fileListExcel = ref<any>([]);
const fileListWord = ref<any>([]);
async function customRequest(options: any, type: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 0) {
      if (type == 1) {
        fileListExcel.value = [];
        fileListExcel.value.push({
          fileId: res.data.id,
          oldFileName: res.data.oldFileName,
          fileName: res.data.newFileName,
          filePath: imgRooturl + res.data.newFileName,
          pdfFileName: imgRooturl + res.data.pdfFileName,
        });
      } else if (type == 2) {
        fileListWord.value = [];
        fileListWord.value.push({
          fileId: res.data.id,
          oldFileName: res.data.oldFileName,
          fileName: res.data.newFileName,
          filePath: imgRooturl + res.data.newFileName,
          pdfFileName: imgRooturl + res.data.pdfFileName,
        });
      } else {
        ruleForm.imageFileId = res.data.id || '';
        const file: any = {
          ...res.data,
          name: res.data?.oldFileName,
        };
        fileList.value[0] = file;
      }
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

function linkClick(url: string) {
  window.open(url);
}

async function handleSelectClick(value: any) {
  console.log(value);
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 20;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${20}M！`);
  return imgSize;
};

function filechange(file: any) {
  fileList.value[0] = file;
}

function filterTreeNode(node: any) {
  if (!searchValue.value.trim()) {
    return false;
  }
  // 针对不同的bom类型处理方式不同
  if (props.bomType === 'bom') {
    const { partNumber, partName } = node;
    const showName = partNumber + partName;
    return showName.includes(searchValue.value) || searchSubTree(node);
  }
  return false;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.treeModal');
}
function DisplayPersonnel(key: string, names: any, ids: string) {}
function initializationassignment(node: any) {
  selectedNode.value = node;
}
defineExpose({ changeBtnStyle, DisplayPersonnel, initializationassignment });
</script>

<template>
  <div class="container">
    <div class="controls-wrap">
      <a-input v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="$t('请输入')" allow-clear />
      <div v-if="props.operateFlag" class="action">
        <div class="icon" @click="addTree">
          <PlusCircleOutlined />
        </div>

        <div v-if="btnReadOnly === '1'" class="icon">
          <FormOutlined style="color: #dededf" />
        </div>
        <div v-else class="icon" @click="updTree">
          <FormOutlined />
        </div>

        <div class="icon" @click="toUpTreeNode">
          <ArrowUpOutlined />
        </div>

        <div class="icon" @click="toDownTreeNode">
          <ArrowDownOutlined />
        </div>
        <div v-if="btnReadOnly === '1'" class="icon">
          <DeleteOutlined style="color: #dededf" />
        </div>
        <div v-else class="icon">
          <a-popconfirm :title="WeiI18n.t('是否确认删除').value" :ok-text="WeiI18n.t('确定').value" :cancel-text="WeiI18n.t('取消').value" @confirm="delTree" @cancel="cancel">
            <DeleteOutlined />
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div>
      <!-- {{ selectedKeys }}--选中节点 {{ newExpandedKeys }}--展开节点 -->
      <a-directory-tree
        v-model:selected-keys="selectedKeys"
        v-model:expanded-keys="newExpandedKeys"
        :style="{
          width: '100%',
          overflowY: 'auto',
          height: operateFlag ? 'calc(100vh - 213px)' : 'calc(100vh - 200px)',
        }"
        :show-icon="true"
        :tree-data="treeData"
        :expand-action="false"
        default-expand-all
        @select="onSelect">
        <template #title="item">
          <a-dropdown v-if="bomType === 'unBom'">
            <TreeNode :show-name="$t(item.partName)" :search-value="searchValue" :node="item" />
          </a-dropdown>
          <a-dropdown v-else>
            <TreeNode :node="item" :show-name="$t(item.title)" :search-value="searchValue" />
          </a-dropdown>
        </template>
        <template #icon="item">
          <EpcIcon v-if="(item.type === 'category' && item.level == '1') || item.nodeType == 1" type="icon-wenjianjia" />
          <EpcIcon v-else-if="item.type === 'category' && item.level == '2'" type="icon-wenjianjia" />
          <EpcIcon v-else-if="item.type === 'category' && item.level == '3'" type="icon-a-xiangmu1" />
        </template>
      </a-directory-tree>
    </div>
  </div>
  <div class="treeModal" v-dragModal>
    <a-modal
      v-model:visible="modalVisible"
      :getContainer="customGetContainer"
      style="width: 50%"
      :title="$t(title)"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="onOk"
      @cancel="modalVisible = false">
      <a-form ref="formRef" :model="ruleForm" :rules="rules" label-width="130px" class="ruleForm" :label-col="labelCol" style="height: 500px; overflow-y: auto">
        <a-row class="elrow">
          <a-form-item label="父节点名称：">
            <a-input v-model:value="ruleForm.parentNodeName" class="elinput" disabled />
          </a-form-item>
          <a-form-item label="节点名称：" prop="nodeName">
            <a-input v-model:value="ruleForm.nodeName" class="elinput" placeholder="请输入" />
          </a-form-item>
        </a-row>
        <a-row class="elrow">
          <a-form-item label="节点类别：" prop="nodeCategory">
            <a-select @change="handleSelectClick(ruleForm.nodeCategory)" v-model:value="ruleForm.nodeCategory" placeholder="请选择" class="elinput" clearable>
              <a-select-option value="1">计算程序</a-select-option>
              <a-select-option value="2">计算分类</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row v-if="ruleForm.nodeCategory == '1'">
          <a-div>
            <a-form-item label="上传Excel：">
              <div class="upload-btn-wrap">
                <div class="block">
                  <div class="file-uploaad">
                    <a-upload ref="fileUpload" multiple type="drag" :before-upload="beforeUpload" :custom-request="options => customRequest(options, 1)" :show-upload-list="false">
                      <div style="padding: 10px">
                        <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 30px; position: absolute; left: 35px; top: 20px" />
                        <div style="margin-top: 30px">上传文件</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
                <div class="upload-dec">
                  <div>文件要求</div>
                  <p>格式：支持格式xlsx，xls</p>
                  <p>文件大小限制：对单个文件大小有限制，每个文档不超过20M</p>
                </div>
              </div>
            </a-form-item>
          </a-div>
          <div class="upload-file-wrap">
            <div v-for="(item, index) in fileListExcel" :key="index">
              <div class="file-list">
                <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                <div class="file-dec">
                  <div class="tit">{{ item.oldFileName }}</div>
                  <div class="number">
                    <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-row>
        <a-row v-if="ruleForm.nodeCategory == '1'">
          <a-div>
            <a-form-item label="上传模板：">
              <div class="upload-btn-wrap">
                <div class="block">
                  <div class="file-uploaad">
                    <a-upload ref="fileUpload" multiple type="drag" :before-upload="beforeUpload" :custom-request="options => customRequest(options, 2)" :show-upload-list="false">
                      <div style="padding: 10px">
                        <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 30px; position: absolute; left: 35px; top: 20px" />
                        <div style="margin-top: 30px">上传文件</div>
                      </div>
                    </a-upload>
                  </div>
                </div>
                <div class="upload-dec">
                  <div>文件要求</div>
                  <p>格式：支持格式.docx</p>
                  <p>文件大小限制：对单个文件大小有限制，每个文档不超过20M</p>
                </div>
              </div>
            </a-form-item>
          </a-div>
          <div class="upload-file-wrap">
            <div v-for="(item, index) in fileListWord" :key="index">
              <div class="file-list">
                <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                <div class="file-dec">
                  <div class="tit">{{ item.oldFileName }}</div>
                  <div class="number">
                    <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-row>
        <a-row class="elrow">
          <a-form-item label="封面图：">
            <div class="upload-area">
              <Uploado_draggerFile :fileTypesImg="true" width="560px" :file-list="fileList" @change="filechange" @custom-request="customRequest" />
            </div>
          </a-form-item>
        </a-row>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="onOk">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="modalVisible = false">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.upload-btn-wrap {
  margin-left: 1px;
  margin-top: 10px;
  display: flex;
  .block {
    margin-top: 2px;
    width: 102px;
    margin-bottom: 20px;
    height: 80px;
    border-radius: 8px;
    // border: 1px solid #d3d2d9;
    cursor: pointer;
  }
  .upload-dec {
    margin-top: 13px;
    margin-left: 15px;
    font-weight: Regular;
    font-style: Source Sans 3-Regular;
    div {
      margin: 9px 0;
      color: #6a696e;
    }
    p {
      color: #a2a1a6;
      font-size: 12px;
    }
    .correlationBtn {
      margin-top: 5px;
    }
  }
}

//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 100px;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 50px);
  .file-list {
    min-width: 493px;
    max-width: 493px;
    height: 72px;
    background: #f3f2f7;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    margin-right: 12px;
    margin-bottom: 12px;
    .icon {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      color: #0d53e2;
      margin: 15px 13px 20px 15px;
    }
    .file-dec {
      position: relative;
      width: 100%;
      .tit {
        margin: 16px 0 4px 0;
        height: 22px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .number {
        display: flex;
        align-items: center;
        height: 12px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 12px;
        color: #6a696e;
        line-height: 12px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        .hover-link {
          font-size: 12px !important;
          height: 14px;
          width: 280px;
          overflow: hidden;
          color: #0d53e2;
          cursor: pointer;
        }
      }
      .elbutton {
        position: absolute;
        right: 0px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
    }
  }
}

.elrow {
  display: flex;
  justify-content: start;
  .el-form-item {
    margin-right: 15px;
  }
  .elinput {
    width: 195px;
  }
}
.container {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  // padding: 20px;
}
.controls-wrap {
  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.0625rem solid #f1f1f1;
    padding-bottom: 0.625rem;

    .icon {
      font-size: 1.125rem;
      cursor: pointer;
      &:hover {
        color: var(--main-selected);
      }
    }
  }
}
:deep(.ant-tree .ant-tree-title) {
  user-select: text; /* 或者使用 auto，这样用户可以复制文本 */
}
// :deep(.ant-tree-switcher-noop) {
//   display: none;
// }
// :deep(.ant-tree-node-content-wrapper){
//   display: flex
// }
// 控制树节点中图标与倒三角符号的间距
:deep(.ant-tree-iconEle) {
  margin-left: -4px !important; /* 进一步减小图标与倒三角之间的间距 */
  width: 14px; /* 设置固定宽度确保图标大小一致 */
  display: inline-block;
}

// 调整节点内容的布局
:deep(.ant-tree-node-content-wrapper) {
  padding: 2px 6px; /* 调整整个节点内容的内边距 */
  display: flex;
  align-items: center;
}

// 完全重置树节点相关元素的间距
:deep(.ant-tree) {
  .ant-tree-treenode {
    .ant-tree-switcher {
      margin-right: 0 !important; /* 完全移除开关与图标之间的右边距 */
      width: 16px; /* 控制开关宽度 */
      flex-shrink: 0;
    }

    .ant-tree-iconEle {
      margin-left: 0 !important; /* 移除图标左侧边距 */
      margin-right: 4px; /* 仅保留图标与文字之间的间距 */
      width: 14px; /* 设置固定宽度确保图标大小一致 */
      flex-shrink: 0;
    }

    .ant-tree-node-content-wrapper {
      padding: 2px 6px !important; /* 调整整个节点内容的内边距 */
      display: flex;
      align-items: center;
    }
  }
}

// 确保折叠/展开图标区域与节点图标紧密相连
:deep(.ant-tree-switcher-noop) {
  width: 16px; /* 控制空白开关的宽度 */
  margin-right: 0 !important;
}

.operate-tree {
  height: calc(100vh - 213px);
  width: 100%;
  overflow-y: auto;
}
.operate-tree2 {
  height: calc(100vh - 190px);
  width: 100%;
  overflow-y: auto;
}
</style>
