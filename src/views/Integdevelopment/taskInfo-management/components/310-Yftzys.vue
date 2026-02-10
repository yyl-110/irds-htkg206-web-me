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
import { downloadFileFromStream } from '@/utils/file.ts';
import { UploadFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
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
const columns = ref<TableColumnType<any>[]>([]);
const yearRange = ref<number>(0); // 存储年份范围
const addYear = ref<string>(''); // 存储起始年份

// 定义表单数据，只包含年份字段
const formData = reactive({
  // 年份字段会动态添加
});

const formRef = ref<any>(null);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  initPageData();
}

async function initPageData() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.budgetList(data);
  tableList.value = res.data.data.investmenBudgetItemList;

  // 保存年份信息
  yearRange.value = res.data.data.roadSignRange;
  addYear.value = res.data.data.addYear;

  columns.value = [];
  columns.value.push({
    title: '项目',
    dataIndex: 'projectName',
    key: 'projectName',
    ellipsis: true,
    align: 'left',
    width: 170,
    resizable: true,
  });
  // 创建年份父列，包含所有年份的子列
  const yearColumns: TableColumnType<any>[] = [];
  for (let i = 0; i < res.data.data.roadSignRange; i++) {
    yearColumns.push({
      title: res.data.data.addYear + i,
      dataIndex: 'year' + (1 + i),
      key: 'year' + (1 + i),
      ellipsis: true,
      align: 'left',
      width: 170,
      resizable: true,
      sorter: (a: any, b: any) => {
        const prop = `year${1 + i}`;
        return sortermethod(a[prop], b[prop]);
      },
    });
  }

  // 添加年份父列到columns
  columns.value.push({
    title: '年份',
    key: 'years',
    width: yearColumns.length * 170, // 根据子列数量设置宽度
    align: 'center',
    children: yearColumns,
  });
  columns.value.push({
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    fixed: 'right',
  });
}

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 216;
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
  modalTitle.value = '编辑' + record.projectName + '投资预算';
  currentRecord.value = record;

  // 清空之前的年份数据
  Object.keys(formData).forEach(key => {
    if (key.startsWith('year')) {
      delete formData[key];
    }
  });

  // 加载年份数据
  for (let i = 0; i < yearRange.value; i++) {
    const yearKey = `year${i + 1}`;
    formData[yearKey] = record[yearKey] || '';
  }

  modalVisible.value = true;
}

// 保存表单数据
async function saveForm() {
  try {
    // 构建保存数据
    const saveData = {
      ...currentRecord.value,
      ...formData,
      planId: planTaskInfo.value.planId,
      taskId: planTaskInfo.value.id,
    };
    console.log(saveData);
    // 调用保存API
    const res = await AdminApiProductPlanTaskDesign.budgetUpdate(saveData);
    if (res.data.code === 200) {
      message.success('修改成功');
      modalVisible.value = false;
      // 重新加载数据
      await initPageData();
    } else {
      message.error(res.data.message || '修改失败');
    }
  } catch (error) {
    message.error('保存失败，请稍后重试');
    console.error('保存出错:', error);
  }
}

// 下载模板
async function downLoadTemplate() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.budgetExcelTemplate(data);
  const fileName = '投资预算模板.xlsx';
  downloadFileFromStream(res, fileName);
}

async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.budgetExcelExport(data);
  const fileName = '投资预算数据.xlsx';
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
    data.planId = planTaskInfo.value.planId;
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.excelImport({ file, data });
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

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Yftzys');
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

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">产品研发投资预算</span>
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="importExcelModal()" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button type="primary" style="margin-left: 20px" @click="exportExcel()"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
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
  <div class="Yftzys" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="800" :mask-closable="false">
      <a-form ref="formRef" :model="formData" layout="vertical" style="padding: 20px">
        <!-- 年份数据输入区域 -->
        <div class="year-inputs-container">
          <div class="project-name-display">
            <span class="project-label">项目名称：</span>
            <span class="project-value">{{ currentRecord.projectName }}</span>
          </div>
          <div class="year-inputs-grid">
            <div v-for="i in yearRange" :key="i" class="year-input-item">
              <a-form-item :label="String(Number(addYear) + i - 1)" :name="`year${i}`">
                <a-input v-model:value="formData[`year${i}`]" :placeholder="`请输入${String(Number(addYear) + i - 1)}年数据`" style="width: 200px" />
              </a-form-item>
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
.Yftzys {
  position: relative;
  z-index: 1000;
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

// 年份输入区域样式
.year-inputs-container {
  padding: 16px 0;
}

.project-name-display {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.project-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
}

.project-value {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.year-inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.year-input-item {
  display: flex;
  flex-direction: column;
}

.year-input-item .ant-form-item {
  margin-bottom: 0;
}

.year-input-item .ant-form-item-label {
  margin-bottom: 8px;
  text-align: left;
}

.year-input-item .ant-form-item-label label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}
</style>
