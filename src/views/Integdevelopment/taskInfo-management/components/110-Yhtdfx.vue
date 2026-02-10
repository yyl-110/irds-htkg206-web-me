<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, Form, InputNumber } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { downloadFileFromStream } from '@/utils/file.ts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
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
  const res = await AdminApiProductPlanTaskDesign.painPointList(data);
  tableList.value = res.data.data;
}

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 205;
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
  modalTitle.value = '编辑用户痛点';
  currentRecord.value = record;
  // 填充表单数据
  formData.targetMarket = record.targetMarket || '';
  formData.painPoint = record.painPoint || '';
  formData.painSort = record.painSort || '';
  formData.actionPlan = record.actionPlan || '';
  modalVisible.value = true;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Yhtdfx');
}

async function deletePram(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条用户痛点记录吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let data: any = {};
        data.id = record.id;
        const res = await AdminApiProductPlanTaskDesign.painPointDelete(data);
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
const modalTitle = ref<string>('添加用户痛点');
const currentRecord = ref<any>(null);
// 表单数据
const formData = reactive({
  targetMarket: '',
  painPoint: '',
  painSort: '',
  actionPlan: '',
});
// 表单实例
const formRef = ref();
// 表单验证规则
const rules = {
  targetMarket: [
    {
      required: true,
      message: '请输入目标市场',
      trigger: 'blur',
    },
  ],
  painPoint: [
    {
      required: true,
      message: '请输入客户挑战，痛点，问题',
      trigger: 'change',
    },
  ],
  painSort: [
    {
      required: true,
      message: '请输入问题排序',
      trigger: 'blur',
    },
  ],
  actionPlan: [
    {
      required: true,
      message: '请输入行动方案',
      trigger: 'blur',
    },
  ],
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
    title: '目标市场',
    dataIndex: 'targetMarket',
    key: 'targetMarket',
    ellipsis: true,
    align: 'left',
    width: 220,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.targetMarket, b.targetMarket),
  },
  {
    title: '客户挑战/痛点/问题',
    dataIndex: 'painPoint',
    key: 'painPoint',
    ellipsis: true,
    align: 'left',
    width: 270,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.painPoint, b.painPoint),
  },
  {
    title: '问题重要排序',
    dataIndex: 'painSort',
    key: 'painSort',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.painSort, b.painSort),
  },
  {
    title: '行动方案',
    dataIndex: 'actionPlan',
    key: 'actionPlan',
    ellipsis: true,
    align: 'left',
    width: 270,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actionPlan, b.actionPlan),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 120,
    align: 'center',
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
  const res = await AdminApiProductPlanTaskDesign.pointExcelTemplate(data);
  const fileName = '用户痛点分析模板.xlsx';
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
    const res = await AdminApiProductPlanTaskDesign.pointExcelImport({
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
  const res = await AdminApiProductPlanTaskDesign.pointExcelExport(data);
  const fileName = '用户痛点分析数据.xlsx';
  downloadFileFromStream(res, fileName);
}

async function addModule() {
  modalTitle.value = '添加用户痛点';
  currentRecord.value = null;
  formData.targetMarket = '';
  formData.painPoint = '';
  formData.painSort = '';
  formData.actionPlan = '';
  modalVisible.value = true;
}

// 保存表单数据
async function saveForm() {
  // 首先检查问题重要排序是否重复
  const painSortNum = Number(formData.painSort);
  const duplicate = tableList.value.some((item: any) => Number(item.painSort) === painSortNum && (!currentRecord.value || item.id !== currentRecord.value.id));

  if (duplicate) {
    message.error('问题重要排序已存在，请输入其他值');
    return;
  }

  // 使用表单验证
  try {
    await formRef.value?.validate();

    let data: any = {
      id: currentRecord.value ? currentRecord.value.id : null,
      targetMarket: formData.targetMarket,
      painPoint: formData.painPoint,
      painSort: painSortNum,
      actionPlan: formData.actionPlan,
      taskId: planTaskInfo.value.id,
    };

    let res;
    if (currentRecord.value == null) {
      res = await AdminApiProductPlanTaskDesign.painPointCreate(data);
      if (res.data.code === 200) {
        message.success('添加成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } else {
      res = await AdminApiProductPlanTaskDesign.painPointUpdate(data);
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
    } else {
      message.error('操作失败，请重试');
    }
  }
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">用户痛点分析</span>
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
          bordered
          :pagination="false"
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

  <div class="Yhtdfx" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="600" :mask-closable="false">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" style="padding: 20px">
        <a-form-item label="目标市场" name="targetMarket" required>
          <a-input v-model:value="formData.targetMarket" placeholder="请输入目标市场" style="width: 100%" />
        </a-form-item>
        <a-form-item label="客户挑战/痛点/问题" name="painPoint" required>
          <a-input v-model:value="formData.painPoint" placeholder="请输入客户挑战/痛点/问题" style="width: 100%" />
        </a-form-item>
        <a-form-item label="问题重要排序" name="painSort" required>
          <a-input v-model:value="formData.painSort" placeholder="请输入问题重要排序" style="width: 100%" type="number" min="0" onInput="value = value ? Math.floor(value) : ''" />
        </a-form-item>
        <a-form-item label="行动方案" name="actionPlan" required>
          <a-input v-model:value="formData.actionPlan" placeholder="请输入行动方案" style="width: 100%" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="modal-footer">
          <a-button type="primary" @click="saveForm">确定</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </template>
    </a-modal>
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
  </div>
</template>

<style lang="less" scoped>
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

.Yhtdfx {
  position: relative;
  z-index: 1000;
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
