<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, Form, InputNumber, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { UploadFile } from '@/components/UploadFile';
import { file } from '@babel/types';
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
interface OptionrItem {
  label: string;
  value: string;
}
const attributeList = ref<OptionrItem[]>([
  { label: '政策', value: '政策' },
  { label: '法律', value: '法律' },
  { label: '法规', value: '法规' },
  { label: '标准', value: '标准' },
  { label: '民俗', value: '民俗' },
]);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  initPageData();
  getTaskWorkStatus();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function initPageData() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.planLawList(data);
  tableList.value = res.data.data;
}

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 206;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
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

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

async function updatePram(record: any) {
  modalTitle.value = '编辑法律法规';
  currentRecord.value = record;
  // 填充表单数据
  formData.codeName = record.codeName || '';
  formData.name = record.name || '';
  formData.attribute = record.attribute || undefined;
  formData.effectiveTime = record.effectiveTime || '';
  formData.deadline = record.deadline || '';
  formData.keyTerms = record.keyTerms || '';
  formData.scopeApplication = record.scopeApplication || '';
  formData.influence = record.influence || '';
  formData.actionSuggestions = record.actionSuggestions || '';
  formData.fileId = record.fileId || '';
  fileListDataEnds.value = record.fileInfos || [];
  modalVisible.value = true;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Flfgfx');
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(rows: any) {
  if (!rows.fileInfos || rows.fileInfos.length === 0) {
    message.warning('暂无文件信息');
    return;
  }
  const row = rows.fileInfos[0];
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function handleClosePowModal() {
  powVisible.value = false;
}
async function deletePram(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条法律法规记录吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let data: any = {};
        data.id = record.id;
        const res = await AdminApiProductPlanTaskDesign.painLawDelete(data);
        if (res.data.code === 200) {
          message.success('删除成功');
          // 重新加载数据
          await initPageData();
        } else {
          message.error(res.data.message || '删除失败');
        }
      } catch (error) {
        message.error('删除失败，请重试');
      }
    },
  });
}

const tableList = ref<any>([]);
// 弹窗相关状态
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>('添加法律法规');
const currentRecord = ref<any>({});
// 表单数据
const formData = reactive({
  codeName: '',
  name: '',
  attribute: undefined,
  effectiveTime: null,
  deadline: null,
  keyTerms: '',
  scopeApplication: '',
  influence: '',
  actionSuggestions: '',
  fileId: '',
});
// 表单实例
const formRef = ref();
const fileListDataEnds = ref<any>([]);
// 表单验证规则
const rules = {
  codeName: [
    {
      required: true,
      message: '请输入代号',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  attribute: [
    {
      required: true,
      message: '请输入属性',
      trigger: 'blur',
    },
  ],
  // effectiveTime: [
  //   {
  //     required: true,
  //     message: '请输入生效时间',
  //     trigger: 'blur',
  //   },
  // ],
  // deadline: [
  //   {
  //     required: true,
  //     message: '请输入截止期限',
  //     trigger: 'blur',
  //   },
  // ],
  // keyTerms: [
  //   {
  //     required: true,
  //     message: '请输入关键条款',
  //     trigger: 'blur',
  //   },
  // ],
  // scopeApplication: [
  //   {
  //     required: true,
  //     message: '请输入使用范围',
  //     trigger: 'blur',
  //   },
  // ],
  // influence: [
  //   {
  //     required: true,
  //     message: '请输入对公司影响',
  //     trigger: 'blur',
  //   },
  // ],
  // actionSuggestions: [
  //   {
  //     required: true,
  //     message: '请输入行动建议',
  //     trigger: 'blur',
  //   },
  // ],
};
// 表单验证错误信息
const formErrors = reactive({
  targetMarket: '',
  painPoint: '',
  painSort: '',
  actionPlan: '',
});
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '代号',
    dataIndex: 'codeName',
    key: 'codeName',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.codeName, b.codeName),
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
  },
  {
    title: '属性',
    dataIndex: 'attribute',
    key: 'attribute',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.attribute, b.attribute),
  },
  {
    title: '生效时间',
    dataIndex: 'effectiveTime',
    key: 'effectiveTime',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.effectiveTime, b.effectiveTime),
  },
  {
    title: '截止期限',
    dataIndex: 'deadline',
    key: 'deadline',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.deadline, b.deadline),
  },
  {
    title: '关键条款',
    dataIndex: 'keyTerms',
    key: 'keyTerms',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.keyTerms, b.keyTerms),
  },
  {
    title: '使用范围',
    dataIndex: 'scopeApplication',
    key: 'scopeApplication',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.scopeApplication, b.scopeApplication),
  },
  {
    title: '对公司影响',
    dataIndex: 'influence',
    key: 'influence',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.influence, b.influence),
  },
  {
    title: '行动建议',
    dataIndex: 'actionSuggestions',
    key: 'actionSuggestions',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actionSuggestions, b.actionSuggestions),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]);

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

async function downLoadTemplate() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.lawExcelTemplate(data);
  const fileName = '法律法规分析模板.xlsx';
  downloadFileFromStream(res, fileName);
}

const openfileUploadModal = ref<boolean>(false);
const uploadFileList = ref<any>([]);
const fileList = ref<any>([]);
async function importExcelModal() {
  uploadFileList.value = [];
  fileList.value = [];
  openfileUploadModal.value = true;
}

async function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.lawExcelImport({
      file,
      data,
    });
    if (res.data.code == 200) {
      openfileUploadModal.value = false;
      await initPageData();
      message.success(WeiI18n.t('导入成功').value);
    }
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

async function datacustomRequest(options: any) {
  fileList.value[0] = options.file;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      uploadFileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

async function exportExcel() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.lawExcelExport(data);
  const fileName = '法律法规分析.xlsx';
  downloadFileFromStream(res, fileName);
}

async function addModule() {
  modalTitle.value = '添加法律法规';
  currentRecord.value = null;
  formData.codeName = '';
  formData.name = '';
  formData.attribute = undefined;
  formData.effectiveTime = null;
  formData.deadline = null;
  formData.keyTerms = '';
  formData.scopeApplication = '';
  formData.influence = '';
  formData.actionSuggestions = '';
  formData.fileId = '';
  fileListDataEnds.value = [];
  modalVisible.value = true;
}

// 保存表单数据
async function saveForm() {
  // 使用表单验证
  try {
    await formRef.value?.validate();

    let data: any = {
      id: currentRecord.value ? currentRecord.value.id : null,
      codeName: formData.codeName,
      name: formData.name,
      attribute: formData.attribute,
      effectiveTime: formData.effectiveTime,
      deadline: formData.deadline,
      keyTerms: formData.keyTerms,
      scopeApplication: formData.scopeApplication,
      influence: formData.influence,
      actionSuggestions: formData.actionSuggestions,
      fileId: formData.fileId,
      taskId: planTaskInfo.value.id,
    };

    let res;
    if (currentRecord.value == null) {
      res = await AdminApiProductPlanTaskDesign.planLawCreate(data);
      if (res.data.code === 200) {
        message.success('添加成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } else {
      res = await AdminApiProductPlanTaskDesign.planLawUpdate(data);
      if (res.data.code === 200) {
        message.success('修改成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '修改失败');
      }
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('表单验证失败，请检查输入信息');
    }
  }
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};
async function customRequest(options: any, type: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListDataEnds.value = [];
      formData.fileId = res.data.data.id;
      fileListDataEnds.value.push({
        fileId: res.data.data.id,
        oldFileName: res.data.data.oldFileName,
        fileName: res.data.data.newFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
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
function delEnSystemUpload(row: any) {
  fileListDataEnds.value = fileListDataEnds.value.filter((item: any) => item.fileId !== row.fileId);
  formData.fileId = '';
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">法律法规分析</span>
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-button type="primary" @click="importExcelModal()" style="margin-left: 20px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="addModule()" :disabled="paramDisabled"> <EpcIcon type="icon-tianjia1" style="font-size: 12px" />添加</a-button>
    </div>
    <a-div>
      <a-div>
        <a-table
          :scroll="{ x: 'max-content' }"
          :locale="localeA"
          @resizeColumn="handleResizeColumn"
          style="margin-left: 20px; margin-right: 10px; overflow-y: auto; height: 390px"
          :columns="columns"
          :pagination="false"
          bordered
          :data-source="tableList">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
              <a v-else @click="updatePram(record)" type="link">编辑</a>
              <a-divider type="vertical" />
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">删除</a>
              <a v-else @click="deletePram(record)" type="link">删除</a>
              <a-divider type="vertical" />
              <a @click="priview(record)" type="link">预览</a>
            </template>
          </template>
        </a-table>
      </a-div>
    </a-div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>

  <div class="Flfgfx" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="800" :mask-closable="false">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" style="padding: 20px">
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="代号" name="codeName" required>
              <a-input v-model:value="formData.codeName" placeholder="请输入代号" :style="{ width: '100%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="名称" name="name" required>
              <a-input v-model:value="formData.name" placeholder="请输入名称" :style="{ width: '100%' }" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="属性" name="attribute" required>
              <a-select allowClear v-model:value="formData.attribute" placeholder="请选择属性" :style="{ width: '100%' }">
                <a-select-option v-for="item in attributeList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="生效时间" name="effectiveTime">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.effectiveTime"
                format="YYYY-MM-DD "
                placeholder="请选择生效时间"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="关键条款" name="keyTerms">
              <a-input v-model:value="formData.keyTerms" placeholder="请输入关键条款" :style="{ width: '100%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="截止期限" name="deadline">
              <a-date-picker :locale="locale" v-model:value="formData.deadline" format="YYYY-MM-DD " placeholder="请选择截止期限" value-format="YYYY-MM-DD" style="width: 100%" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="使用范围" name="scopeApplication">
              <a-input v-model:value="formData.scopeApplication" placeholder="请输入使用范围" :style="{ width: '100%' }" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="对公司影响" name="influence">
              <a-input v-model:value="formData.influence" placeholder="请输入对公司影响" :style="{ width: '100%' }" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col full-width">
            <a-form-item label="行动建议" name="actionSuggestions">
              <a-input v-model:value="formData.actionSuggestions" placeholder="请输入行动建议" :style="{ width: '100%' }" :rows="4" />
            </a-form-item>
          </div>
        </div>
        <a-row>
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
        </a-row>
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
      </a-form>
      <template #footer>
        <div class="modal-footer">
          <a-button type="primary" @click="saveForm">确定</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </template>
    </a-modal>
  </div>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 只允许上传xls、xlsx格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.upload-btn-wrap {
  margin-left: 2px;
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
  margin: 0 20px 28px 2px;
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

// 表单样式
.form-content {
  padding: 10px 0;

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-input-number) {
    width: 100%;
  }
}

// 弹窗底部按钮样式
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    margin-left: 8px;
  }
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

.Flfgfx {
  position: relative;
  z-index: 1000;
}

// 两列表单布局样式
.form-row {
  display: flex;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-col {
  flex: 1;
  padding: 0 8px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &.full-width {
    flex: none;
    width: 100%;
    padding: 0;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
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
  .test {
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
</style>
