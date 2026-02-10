<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
import { getProductgroupingStyle } from '@/style/StatusStyle';
import { UploadFile } from '@/components/UploadFile';
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
const tableList = ref<any>([]);
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>('');
const currentRecord = ref<any>({});
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '产品平台',
    dataIndex: 'productPlatform',
    key: 'productPlatform',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productPlatform, b.productPlatform),
  },
  {
    title: '产品',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
  },
  {
    title: '产品分组',
    dataIndex: 'productGroup',
    key: 'productGroup',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productGroup, b.productGroup),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '立项启动',
    dataIndex: 'projectInitiationDate',
    key: 'projectInitiationDate',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectInitiationDate, b.projectInitiationDate),
  },
  {
    title: '立项评审',
    dataIndex: 'projectReviewDate',
    key: 'projectReviewDate',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectReviewDate, b.projectReviewDate),
  },
  {
    title: 'PDCP',
    dataIndex: 'pdcpDate',
    key: 'pdcpDate',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.pdcpDate, b.pdcpDate),
  },
  {
    title: 'TR5',
    dataIndex: 'tr5Date',
    key: 'tr5Date',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.tr5Date, b.tr5Date),
  },
  {
    title: 'GA',
    dataIndex: 'gaDate',
    key: 'gaDate',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.gaDate, b.gaDate),
  },
  {
    title: '目前所处阶段',
    dataIndex: 'currentStage',
    key: 'currentStage',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.currentStage, b.currentStage),
  },
  {
    title: '人力投入',
    dataIndex: 'manpowerInvestment',
    key: 'manpowerInvestment',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.manpowerInvestment, b.manpowerInvestment),
  },
  {
    title: '预算',
    dataIndex: 'budget',
    key: 'budget',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.budget, b.budget),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.remark, b.remark),
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
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getListData();
}
const formData = reactive({
  id: 0,
  productName: '',
  projectInitiationDate: '',
  projectReviewDate: '',
  pdcpDate: '',
  tr5Date: '',
  currentStage: '',
  budget: '',
  remark: '',
});
const currentStageStr = ref<any>([
  {
    value: '概念',
    label: '概念',
  },
  {
    value: '开发',
    label: '开发',
  },
  {
    value: '上市',
    label: '上市',
  },
  {
    value: '增长',
    label: '增长',
  },
  {
    value: '成熟',
    label: '成熟',
  },
  {
    value: '衰退',
    label: '衰退',
  },
]);
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function getListData() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.customizationList(data);
  tableList.value = res.data.data;
}

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 215;
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
  modalTitle.value = '编辑';
  currentRecord.value = record;
  // 填充表单数据
  formData.productName = record.productName || '';
  formData.projectInitiationDate = record.projectInitiationDate || '';
  formData.projectReviewDate = record.projectReviewDate || '';
  formData.pdcpDate = record.pdcpDate || '';
  formData.tr5Date = record.tr5Date || '';
  formData.currentStage = record.currentStage || '';
  formData.budget = record.budget || '';
  formData.remark = record.remark || '';
  modalVisible.value = true;
}

// 保存表单数据
async function saveForm() {
  // 使用表单验证
  try {
    let data: any = {
      id: currentRecord.value ? currentRecord.value.id : null,
      productName: formData.productName,
      projectInitiationDate: formData.projectInitiationDate,
      projectReviewDate: formData.projectReviewDate,
      pdcpDate: formData.pdcpDate,
      tr5Date: formData.tr5Date,
      currentStage: formData.currentStage,
      budget: formData.budget,
      remark: formData.remark,
    };
    let res = await AdminApiProductPlanTaskDesign.customizationUpdate(data);
    if (res.data.code === 200) {
      message.success('修改成功');
      modalVisible.value = false;
      // 重新加载数据
      await getListData();
    } else {
      message.error(res.data.message || '修改失败');
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('表单验证失败，请检查输入信息');
    } else {
      message.error('操作失败，请重试');
    }
  }
}

async function downLoadTemplate() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.customizationExcelTemplate(data);
  const fileName = '产品开发计划模板.xlsx';
  downloadFileFromStream(res, fileName);
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Zdcpkfjh');
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
    data.planId = planTaskInfo.value.planId;
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.customizationExcelImport({
      file,
      data,
    });
    if (res.data.code == 200) {
      openfileUploadModal.value = false;
      await getListData();
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
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.customizationExcelExport(data);
  const fileName = '产品开发计划数据.xlsx';
  downloadFileFromStream(res, fileName);
}
async function SynchronizationList() {
  try {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    const res = await AdminApiProductPlanTaskDesign.productDevelopmentsyncList(data);
    if (res.data.code === 200) {
      getListData();
      message.success('同步成功');
    }
  } catch (error) {
    console.log(error, 'error');
  }
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">产品开发计划</span>
      <a-button type="primary" style="margin-left: 20px" @click="SynchronizationList">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步列表数据</a-button
      >
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-button type="primary" @click="importExcelModal()" style="margin-left: 20px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button @click="exportExcel()" type="primary" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
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
            <template v-if="column.dataIndex === 'productGroup'">
              <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
            </template>
            <!-- <template v-if="column.dataIndex === 'version'">
              <span style="color: #407fff">{{ record.version }}</span>
            </template> -->
            <template v-if="column.dataIndex === 'action'">
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
              <a v-else @click="updatePram(record)" type="link">编辑</a>
            </template>
          </template>
        </a-table>
      </a-div>
    </a-div>
  </div>

  <div class="Zdcpkfjh" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="800" :mask-closable="false">
      <a-form ref="formRef" :model="formData" layout="vertical" style="padding: 20px">
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="立项启动" name="projectInitiationDate">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.projectInitiationDate"
                format="YYYY-MM-DD "
                placeholder="请选择立项启动时间"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="立项评审" name="projectReviewDate">
              <a-date-picker
                :locale="locale"
                v-model:value="formData.projectReviewDate"
                format="YYYY-MM-DD "
                placeholder="请选择立项评审时间"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="PDCP" name="pdcpDate">
              <a-date-picker :locale="locale" v-model:value="formData.pdcpDate" format="YYYY-MM-DD " placeholder="请选择PDCP时间" value-format="YYYY-MM-DD" style="width: 100%" />
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="TR5" name="tr5Date">
              <a-date-picker :locale="locale" v-model:value="formData.tr5Date" format="YYYY-MM-DD " placeholder="请选择TR5时间" value-format="YYYY-MM-DD" style="width: 100%" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <a-form-item label="目前所处阶段" name="currentStage">
              <a-select v-model:value="formData.currentStage" placeholder="请选择目前所处阶段" :style="{ width: '100%' }" allowClear>
                <a-select-option v-for="option in currentStageStr" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="form-col">
            <a-form-item label="预算" name="budget">
              <a-input v-model:value="formData.budget" placeholder="请输入预算" :style="{ width: '100%' }" :rows="4" />
            </a-form-item>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col full-width">
            <a-form-item label="备注" name="remark">
              <!-- 文本域 -->
              <a-textarea v-model:value="formData.remark" placeholder="请输入备注" :style="{ width: '100%' }" :rows="4" />
            </a-form-item>
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
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
</template>

<style lang="less" scoped>
.Zdcpkfjh {
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

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
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
