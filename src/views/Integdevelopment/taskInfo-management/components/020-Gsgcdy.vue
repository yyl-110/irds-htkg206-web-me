<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { message, Tabs as ATabs, UploadProps, Modal, TableColumnType } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { sortermethod } from '@/utils/tools';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import fileListComponents from './fileListComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const fileListComponentsRef = ref<any>(null);
// 随笔记录表格数据
const fileListDataEnds = ref<any[]>([]);
const notesData = ref<any[]>([]);
const userStore = useUserStore();
// Modal相关状态
const isModalVisible = ref(false);
const isModalVisibleCat = ref(false);
const newNoteForm = reactive({
  title: '',
  date: '',
  content: '',
});

// 表单实例
const formRef = ref();

// 表单验证规则
const rules = {
  title: [
    {
      required: true,
      message: '请输入随笔记录标题',
      trigger: 'blur',
    },
  ],
  date: [
    {
      required: true,
      message: '请选择记录日期',
      trigger: 'change',
    },
  ],
  content: [
    {
      required: true,
      message: '请输入记录内容',
      trigger: 'blur',
    },
  ],
};

// 打开添加随笔记录的Modal
function addNote() {
  // 重置表单
  newNoteForm.title = '';
  newNoteForm.date = '';
  newNoteForm.content = '';
  // 重置表单验证状态
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 显示Modal
  isModalVisible.value = true;
}
async function getNotes() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.getPlanEssayByTaskId(data);
  notesData.value = res.data.data || [];
}

// 确认添加随笔记录
async function handleOk() {
  // 使用表单验证
  formRef.value
    ?.validate()
    .then(async () => {
      // 关闭Modal
      isModalVisible.value = false;
      let data: any = {};
      data.taskId = planTaskInfo.value.id;
      data.essayTitle = newNoteForm.title;
      data.essayContent = newNoteForm.content;
      data.essayTime = newNoteForm.date;
      const res = await AdminApiProductPlanTaskDesign.productPlanEssayCreate(data);
      console.log(res);
      message.success('添加成功');
      getNotes();
    })
    .catch(() => {
      // 验证失败，不执行添加操作
      console.log('表单验证失败');
    });
}

// 取消添加
function handleCancel() {
  isModalVisible.value = false;
  isModalVisibleCat.value = false;
}

// 删除随笔记录行
const essayContent = ref<any>('');
function catNote(record: any) {
  isModalVisibleCat.value = true;
  essayContent.value = record.essayContent;
}

// 删除随笔记录行
function removeNote(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      const res = await AdminApiProductPlanTaskDesign.deletePlanEssay({ id: record.id });
      if (res.data.code == 200) {
        getNotes();
        message.success('删除成功!');
      } else {
        message.success('删除失败。');
      }
    },
  });
}
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getNotes();
  getGcFileInfo();
  getDeliverablesFileInfo();
}

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
  planTaskInfo.value.progress = res.data.data.progress;
  if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true &&
    submitDisabled.value == true &&
    keepDisabled.value == true
  ) {
    paramDisabled.value = true;
  } else if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true
  ) {
    paramDisabled.value = false;
  } else {
    paramDisabled.value = true;
  }
}

const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
}
//获取过程文件信息
async function getGcFileInfo() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  data.fileType = '5';
  const res = await AdminApiProductPlanTaskDesign.getTaskGcFileInfo(data);
  fileListDataEnds.value = res.data.data.fileListDataEnds || [];
}

//获取交付物文件信息
async function getDeliverablesFileInfo() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  data.fileType = '6';
  const res = await AdminApiProductPlanTaskDesign.getTaskDeliverablesFileInfo(data);
  uploadInfoData.value = res.data.data.uploadInfoData || [];
  nextTick(() => {
    fileListComponentsRef.value.setisdownload();
  });
}

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '随笔记录标题',
    dataIndex: 'essayTitle',
    key: 'essayTitle',
    align: 'center',
    ellipsis: true,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.essayTitle, b.essayTitle),
  },
  {
    title: '记录时间',
    dataIndex: 'essayTime',
    key: 'essayTime',
    width: 150,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.essayTime, b.essayTime),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'left',
    fixed: 'right',
  },
]);

const uploadInfoData = ref<any[]>([]);

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Gsgcdy');
}

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};
async function customRequest(options: any, type: any) {
  // 调用上传接口
  loading.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListDataEnds.value.push({
        fileId: res.data.data.id,
        type: '1',
        oldFileName: res.data.data.oldFileName,
        fileName: res.data.data.newFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
      console.log(fileListDataEnds.value);
      loading.value = false;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      loading.value = false;
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
async function emitCustomRequest(res: any) {
  var versionS = '';
  if (uploadInfoData.value.length > 0) {
    versionS = uploadInfoData.value[0].version;
  } else {
    versionS = 'A';
  }
  uploadInfoData.value = [];
  uploadInfoData.value.push({
    fileId: res.data.data.id,
    fileName: res.data.data.oldFileName.split('-')[1] || res.data.data.oldFileName,
    fileNumber: res.data.data.oldFileName.split('-').length > 1 ? res.data.data.oldFileName.split('-')[0] : '',
    version: versionS || 'A',
    headerUserName: planTaskInfo.value.headUserName,
    headerUserId: planTaskInfo.value.headerUserId,
    status: '保存',
    filePath: imgRooturl + res.data.data.newFileName,
    pdfFileName: imgRooturl + res.data.data.pdfFileName,
  });
}
async function submitOk(type: any) {
  // if (uploadInfoData.value.length == 0) {
  //   message.error(WeiI18n.t('请上传最终交付物').value);
  //   return;
  // }
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  data.userId = userStore.getUser.id;
  data.type = type;
  data.fileListDataEnds = fileListDataEnds.value;
  data.uploadInfoData = uploadInfoData.value;
  const res = await AdminApiProductPlanTaskDesign.keepTaskInfo(data);
  if (res.data.code == 200) {
    if (type == 0) {
      submitAdd();
    } else {
      submitCommit();
    }
  }
}
async function submitCommit() {
  //调取子方法
  taskStatusComponentsa.value?.submitCommit(planTaskInfo.value.progress);
}
async function submitAdd() {
  //调取子方法
  taskStatusComponentsa.value?.submitAdd(planTaskInfo.value.progress);
}
function linkClick(url: string) {
  window.open(url);
}
function delEnSystemUpload(row: any) {
  fileListDataEnds.value = fileListDataEnds.value.filter((item: any) => item.fileId !== row.fileId);
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="bodyPageStyle" :style="{ height: operateFlag }">
      <div class="content-title">
        <i></i>
        <span>公司高层调研</span>
      </div>
      <div>
        <span style="margin-left: 40px; font-weight: 600; font-size: 16px">随笔记录</span>
        <a-button type="primary" :disabled="paramDisabled" style="margin-left: 20px; margin-top: 10px" @click="addNote">
          <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
          添加</a-button
        >
        <a-div style="margin-top: 10px">
          <a-div>
            <a-table
              :locale="localeA"
              @resizeColumn="handleResizeColumn"
              style="margin-left: 20px; margin-top: 10px; height: 250px; overflow-y: auto"
              :columns="columns"
              :pagination="false"
              :data-source="notesData"
              bordered
              :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                  {{ index + 1 }}
                </template>
                <template v-else-if="column.key === 'timeout'">
                  {{ record.timeout ? record.timeout.format('YYYY-MM-DD') : '' }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <a @click="catNote(record)" type="link">查看</a>
                  <a-divider type="vertical" />
                  <a type="link" v-if="paramDisabled" :disabled="paramDisabled">删除</a>
                  <a @click="removeNote(record)" type="link" v-else>删除</a>
                </template>
              </template>
            </a-table>
          </a-div>
        </a-div>
        <span style="margin-left: 40px; font-weight: 600; margin-top: 20px; font-size: 16px">过程文件记录</span>
        <a-div>
          <div class="upload-btn-wrap">
            <div class="block">
              <div class="file-uploaad">
                <a-upload
                  ref="fileUpload"
                  multiple
                  type="drag"
                  :before-upload="beforeUpload"
                  :disabled="paramDisabled"
                  :custom-request="options => customRequest(options, 1)"
                  :show-upload-list="false">
                  <div style="padding: 10px">
                    <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 30px; position: absolute; left: 45px; top: 20px" />
                    <div style="margin-top: 30px">上传文件</div>
                  </div>
                </a-upload>
              </div>
            </div>
            <div class="upload-dec">
              <div>文件要求</div>
              <p>格式：支持格式为PDF、Word、Excel...文档</p>
              <p>文件大小限制：对单个文件大小有限制，每个文档不超过20M</p>
            </div>
          </div>
        </a-div>
        <div class="upload-file-wrap">
          <div v-for="(item, index) in fileListDataEnds" :key="index">
            <div class="file-list">
              <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
              <div class="file-dec">
                <div class="tit">{{ item.oldFileName }}</div>
                <div class="number">
                  <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                </div>
                <a-button class="elbutton" @click="delEnSystemUpload(item)" :disabled="paramDisabled">
                  <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <fileListComponents
        ref="fileListComponentsRef"
        @emitCustomRequest="emitCustomRequest"
        titleInfo="最终交付物"
        :planTaskInfo="planTaskInfo"
        :paramDisabled="paramDisabled"
        :uploadInfoData="uploadInfoData"></fileListComponents>
    </div>
  </a-spin>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @getDeliverablesFileInfo="getDeliverablesFileInfo"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <div class="Gsgcdy" v-dragModal>
    <a-modal v-model:visible="isModalVisible" :getContainer="customGetContainer" title="添加数据" ok-text="确定" cancel-text="取消" :mask-closable="false">
      <a-form ref="formRef" :model="newNoteForm" :rules="rules" layout="vertical" style="padding: 20px">
        <a-form-item label="随笔记录标题" name="title" required>
          <a-input v-model:value="newNoteForm.title" placeholder="请输入随笔记录标题" style="width: 100%" />
        </a-form-item>
        <a-form-item label="记录日期" name="date" required>
          <a-date-picker :locale="locale" v-model:value="newNoteForm.date" format="YYYY-MM-DD " value-format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
        <a-form-item label="记录内容" name="content" required>
          <a-textarea v-model:value="newNoteForm.content" placeholder="请输入记录内容" :rows="4" style="width: 100%" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="handleOk">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleCancel">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>

  <a-modal v-model:visible="isModalVisibleCat" title="查看数据" cancel-text="关闭" :mask-closable="false" @cancel="handleCancel">
    <a-form :model="newNoteForm" layout="vertical" style="padding: 20px">
      <a-form-item label="记录内容" name="content">
        <a-textarea readonly v-model:value="essayContent" placeholder="请输入记录内容" :rows="4" style="width: 100%" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleCancel">
        {{ $t('关闭') }}
      </a-button>
    </template>
  </a-modal>

  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>
<style lang="less" scoped>
.upload-btn-wrap {
  margin-left: 40px;
  margin-top: 10px;
  display: flex;
  .block {
    margin-top: 2px;
    width: 122px;
    margin-bottom: 20px;
    height: 100px;
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
  margin: 0 20px 28px 40px;
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

.Gsgcdy {
  position: relative;
  z-index: 1000;
}

//底部按钮
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}

//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  span {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}

.notes-table-container {
  margin: 0 20px 0 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input {
  text-align: left;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-picker) {
  width: 100%;
  border-radius: 2px;
}

:deep(.ant-table-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: center;
  height: 40px;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td:first-child) {
  font-weight: 500;
}

:deep(.ant-table) {
  margin-bottom: 0;
}
</style>
