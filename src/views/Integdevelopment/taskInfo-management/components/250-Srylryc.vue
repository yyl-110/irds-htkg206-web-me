<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { UploadFile } from '@/components/UploadFile';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
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
const loading = ref<boolean>(false);
const editflag = ref<boolean>(false);
const datasource = ref([]);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { marginTop: '50px' },
  }),
});
const description = ref<string>('');
const modalTitle = ref<string>('');
const modalVisible = ref<boolean>(false);
const currentRecord = ref<any>({});
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
  getListData();
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
    data.fileType = 211;
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
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.getproductforecastList({
      planId: planTaskInfo.value.planId,
      forecastType: '收入',
    });
    loading.value = false;
    if (res.data.code === 200) {
      if (res.data.data.length > 0) {
        addYear.value = res.data.data[0].addYear;
      }
      columns.value = [];
      columns.value.push({
        title: '项目',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        align: 'left',
        width: 170,
        resizable: true,
      });
      for (let i = 0; i < 5; i++) {
        columns.value.push({
          title: addYear.value + i,
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
      columns.value.push({
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        align: 'left',
        width: 170,
        resizable: true,
        sorter: (a: any, b: any) => {
          const prop = `description`;
          return sortermethod(a[prop], b[prop]);
        },
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
      datasource.value = res.data.data;
    }
  } finally {
    loading.value = false;
  }
}
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
/** 列属性key  */
const addYear = ref<string>(''); // 存储起始年份
const columns = ref<TableColumnType[]>([]);
// 下载模板
async function downLoadTemplate() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  data.forecastType = '收入';
  const res = await AdminApiSystemProductPlanningscoring.excelTemplate(data);
  const fileName = '销量预测模板.xlsx';
  downloadFileFromStream(res, fileName);
}

async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  data.forecastType = '收入';
  const res = await AdminApiSystemProductPlanningscoring.excelExport(data);
  const fileName = '收入与利润预测数据.xlsx';
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
    data.forecastType = '收入';
    const res = await AdminApiSystemProductPlanningscoring.excelImport({
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
function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}
async function updatePram(record: any) {
  modalTitle.value = '编辑' + record.productName + '收入预算';
  currentRecord.value = record;
  description.value = record.description;
  // 清空之前的年份数据
  Object.keys(formData).forEach(key => {
    if (key.startsWith('year')) {
      delete formData[key];
    }
  });

  // 加载年份数据
  for (let i = 0; i < 5; i++) {
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
      forecastType: '收入',
      id: currentRecord.value.id,
      productName: currentRecord.value.productName,
      description: description.value,
    };
    console.log(saveData);
    // 调用保存API
    const res = await AdminApiSystemProductPlanningscoring.forecastUpdate(saveData);
    if (res.data.code === 200) {
      message.success('修改成功');
      modalVisible.value = false;
      // 重新加载数据
      await getListData();
    } else {
      message.error(res.data.message || '修改失败');
    }
  } catch (error) {
    message.error('保存失败，请稍后重试');
    console.error('保存出错:', error);
  }
}
async function SynchronizationList() {
  try {
    const res = await AdminApiSystemProductPlanningscoring.syncForecastList({
      planId: planTaskInfo.value.planId,
      forecastType: '收入',
    });
    loading.value = false;
    if (res.data.code === 200) {
      getListData();
      message.success('同步成功');
    }
  } catch (error) {
    console.log(error, 'error');
  }
}
function aggregationmethod(value: string) {
  if (datasource.value.length > 0) {
    return datasource.value.reduce((sum, item) => sum + Number(item[value]), 0);
  }
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Srykrc');
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="text">收入与利润预测</span>
      <a-button type="primary" style="margin-left: 20px" @click="SynchronizationList">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步列表数据</a-button
      >
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板 </a-button>
      <a-button type="primary" style="margin-left: 20px" @click="importExcelModal()" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button type="primary" style="margin-left: 20px" @click="exportExcel()"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
    </div>
    <div class="table-box">
      <a-table
        :scroll="{ x: 'max-content' }"
        row-key="id"
        :columns="columns"
        :data-source="datasource"
        :locale="locale"
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #summary>
          <a-table-summary-row>
            <a-table-summary-cell style="color: red">合计</a-table-summary-cell>
            <a-table-summary-cell v-for="item in 5" :key="item">
              <a-typography-text type="danger">{{ aggregationmethod('year' + item) }}</a-typography-text>
            </a-table-summary-cell>
            <a-table-summary-cell>
              <a-typography-text type="danger">{{}}</a-typography-text>
            </a-table-summary-cell>
            <a-table-summary-cell>
              <a-typography-text type="danger">{{}}</a-typography-text>
            </a-table-summary-cell>
          </a-table-summary-row>
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'action'">
            <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
            <a v-else @click="updatePram(record)" type="link">编辑</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <div class="Srykrc" v-dragModal>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :getContainer="customGetContainer" :width="800" :mask-closable="false">
      <a-form ref="formRef" :model="formData" layout="vertical" style="padding: 20px">
        <!-- 年份数据输入区域 -->
        <div class="year-inputs-container">
          <div class="project-name-display">
            <span class="project-label">项目名称：</span>
            <span class="project-value">{{ currentRecord.productName }}</span>
          </div>
          <div class="year-inputs-grid">
            <div v-for="i in 5" :key="i" class="year-input-item">
              <a-form-item :label="String(Number(addYear) + i - 1)" :name="`year${i}`">
                <a-input v-model:value="formData[`year${i}`]" :placeholder="`请输入${String(Number(addYear) + i - 1)}年数据`" style="width: 200px" />
              </a-form-item>
            </div>
          </div>
          <div style="margin-top: 20px">
            <a-form-item label="说明">
              <a-textarea v-model:value="description" :placeholder="`请输入说明`" style="width: 800px; height: 100px" />
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
</template>

<style lang="less" scoped>
.Srykrc {
  position: relative;
  z-index: 1000;
}
.table-box {
  margin: 0 20px 0 20px;
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
  .text {
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
</style>
