<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import Empty from '@/components/Empty/index.vue';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
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
const sumbitDisplay = ref<boolean>(false);
const activeKey = ref<string>('1');
const fileListDataEnds = ref<any>([]);
const fileListData = ref<any>([]);

async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  handleTabChange('1');
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

async function customRequest_A(options: any, type: any) {
  // 调用上传接口
  loading.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    if (res.data.code == 200) {
      fileListDataEnds.value = [];
      fileListDataEnds.value.push({
        fileId: res.data.data.id,
        fileName: res.data.data.oldFileName,
        oldFileName: res.data.data.oldFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
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

async function customRequest_B(options: any, type: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListData.value = [];
      fileListData.value.push({
        fileId: res.data.data.id,
        fileName: res.data.data.oldFileName,
        oldFileName: res.data.data.oldFileName,
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

async function submitOk(type: any) {
  if (type == 0) {
    if (activeKey.value == '1') {
      let data: any = {};
      data.planId = planTaskInfo.value.planId;
      data.taskId = planTaskInfo.value.id;
      let strategyReviewFileIds: any = [];
      strategyReviewFileIds = fileListDataEnds.value.map(element => element.fileId);
      data.reportReviewFileIds = strategyReviewFileIds;
      const res = await AdminApiProductPlanTaskDesign.savePlanReportFileInfoS(data);
      if (res.data.code == 200) {
        submitAdd();
      }
    } else if (activeKey.value == '2') {
      let data: any = {};
      data.planId = planTaskInfo.value.planId;
      let strategyReviewProofFileIds: any = [];
      strategyReviewProofFileIds = fileListData.value.map(element => element.fileId);
      data.reportReviewFileIds = strategyReviewProofFileIds;
      data.reportConclusion = itemReviewConclusion.value;
      data.reportReviewInstr = strategyReviewInstr.value;
      // 格式化为后端需要的yyyy-MM-dd HH:mm:ss格式
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      data.reportReviewTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      data.saveStatus = 0;
      data.taskId = planTaskInfo.value.id;
      const res = await AdminApiProductPlanTaskDesign.savePlanReportConclusion(data);
      if (res.data.code == 200) {
        submitAdd();
      }
    }
  } else {
    // 提交
    let data: any = {};
    data.planId = planTaskInfo.value.planId;
    let strategyReviewProofFileIds: any = [];
    strategyReviewProofFileIds = fileListData.value.map(element => element.fileId);
    data.reportReviewFileIds = strategyReviewProofFileIds;
    data.reportConclusion = itemReviewConclusion.value;
    data.reportReviewInstr = strategyReviewInstr.value;
    // 格式化为后端需要的yyyy-MM-dd HH:mm:ss格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    data.reportReviewTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    data.saveStatus = 1;
    data.taskId = planTaskInfo.value.id;
    const res = await AdminApiProductPlanTaskDesign.savePlanReportConclusion(data);
    if (res.data.code == 200) {
      if (itemReviewConclusion.value == '通过') {
        submitCommit();
      }
    }
  }
}
async function handleTabChange(key: any) {
  if (key == '1') {
    activeKey.value = '1';
    const res = await AdminApiProductPlanTaskDesign.getPlanReportFileInfo({ planId: planTaskInfo.value.planId });
    if (res.data.data) {
      fileListDataEnds.value = res.data.data.reportReviewFileList;
    }
  } else {
    activeKey.value = '2';
    const res = await AdminApiProductPlanTaskDesign.getPlanReportConclusion({ planId: planTaskInfo.value.planId });
    if (res.data.data) {
      itemReviewConclusion.value = res.data.data.reportConclusion;
      strategyReviewInstr.value = res.data.data.reportReviewInstr;
      fileListData.value = res.data.data.reportReviewFileList;
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
  sumbitDisplay.value = res.data.data.sumbitDisplay;
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
const selectStr = [
  { label: '通过', value: '通过' },
  { label: '不通过', value: '不通过' },
];
const itemReviewConclusion = ref<string>('通过');
const strategyReviewInstr = ref<string>('');
function linkClick(url: string) {
  window.open(url);
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function delEnSystemUpload(row: any) {
  fileListDataEnds.value = fileListDataEnds.value.filter((item: any) => item.fileId !== row.fileId);
}
function delEnSystemUploadB(row: any) {
  fileListData.value = fileListData.value.filter((item: any) => item.fileId !== row.fileId);
}
function handleClosePowModal() {
  powVisible.value = false;
}

async function generateReport() {
  //调用接口生成报告
  const res = await AdminApiProductPlanTaskDesign.generateReport({ planId: planTaskInfo.value.planId });
  const fileName = '产品规划报告.docx';
  downloadFileFromStream(res, fileName);
}
const loading = ref<boolean>(false);
const ailoading = ref<boolean>(false);
async function aiAnalysis() {
  try {
    ailoading.value = true;
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 13;
    const res = await AdminApiProductPlanTaskDesign.aiAnalytics(data);
    if (res.data.code == 200) {
    }
  } catch (error) {
    console.log(error);
  } finally {
    ailoading.value = false;
  }
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="bodyPageStyle" :style="{ height: operateFlag }">
      <div style="margin-left: 15px; margin-top: -15px">
        <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
          <a-tab-pane key="1" tab="产品规划报告编制">
            <div class="content-title">
              <i></i>
              <span class="test">产品规划报告</span>
              <!-- <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_A(options, 1)" :show-upload-list="false">
                <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
                  <EpcIcon type="icon-shangchuanwenjian1" style="font-size: 14px" />
                  {{ $t('上传文件') }}
                </a-button>
              </a-upload> -->
              <!-- <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled" @click="generateReport">
                <EpcIcon type="icon-xitongguanli" style="font-size: 14px" />
                {{ $t('生成报告') }}
              </a-button> -->
              <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled" :loading="ailoading" @click="aiAnalysis">
                <EpcIcon type="icon-rengongzhineng" style="font-size: 16px" />
                {{ $t('AI分析') }}
              </a-button>
              <!-- 大约30分钟, -->
              <span style="margin-left: 20px; color: red">{{ '注：AI分析加载时间较长,请耐心等待!' }}</span>
            </div>
            <div class="upload-file-wrap" style="margin-top: 20px">
              <div v-for="(item, index) in fileListDataEnds" :key="index">
                <div class="file-list">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                    </div>
                    <a-button class="elbuttoAn" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                    <a-button class="elbutton" :disabled="paramDisabled" @click="delEnSystemUpload(item)">
                      <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="产品规划报告评审意见">
            <div>
              <div class="content-title">
                <i></i>
                <span class="test">评审结论及结论</span>
              </div>
              <div style="display: flex; margin-top: 20px; margin-left: 20px">
                <div style="width: 50%; margin-right: 20px">
                  <div style="margin-bottom: 20px">
                    <span style="margin-left: 1px; font-weight: 500; font-size: 15px">评审结论：</span>
                    <a-select v-model:value="itemReviewConclusion" placeholder="请选择评审结论" style="width: 100%; margin-top: 10px">
                      <a-select-option v-for="option in selectStr" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <!-- 证明材料 -->
                  <div style="margin-bottom: 10px">
                    <span style="margin-left: 1px; font-weight: 500; font-size: 15px">证明材料</span>
                    <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_B(options, 1)" :show-upload-list="false">
                      <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
                        <EpcIcon type="icon-shangchuan" style="font-size: 14px" />
                        {{ $t('上传材料') }}
                      </a-button>
                    </a-upload>
                  </div>
                  <div class="upload-file-wrap" style="margin-top: 20px">
                    <div v-for="(item, index) in fileListData" :key="index">
                      <div class="file-list">
                        <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                        <div class="file-dec">
                          <div class="tit">{{ item.oldFileName }}</div>
                          <div class="number">
                            <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                          </div>
                          <a-button class="elbuttoAn" @click="priview(item)">
                            <EpcIcon type="icon-liulan" style="font-size: 15px" />
                          </a-button>
                          <a-button class="elbutton" :disabled="paramDisabled" @click="delEnSystemUploadB(item)">
                            <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 右侧：说明（单独显示） -->
                <div style="width: 50%">
                  <div style="margin-bottom: 10px">
                    <span style="margin-left: 1px; font-weight: 500; font-size: 15px">说明</span>
                  </div>
                  <a-textarea v-model:value="strategyReviewInstr" placeholder="请输入" style="width: 99%; height: 200px; min-height: 200px"></a-textarea>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-spin>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    :submitDisplay="activeKey == '2' && sumbitDisplay ? true : false"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <!-- 信息弹窗 -->
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
.role-item {
  margin-right: 20px;
  margin-bottom: 10px;
}
.role-label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  text-align: right;
}
.role-user-container {
  display: flex;
  flex-wrap: wrap;
}
//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 1px;
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
      .elbuttoAn {
        position: absolute;
        right: 30px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
    }
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
