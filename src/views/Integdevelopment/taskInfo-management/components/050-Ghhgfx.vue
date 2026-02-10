<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { handleEpcDownload } from '@/utils/file';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
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
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  console.log(productInfo.value);
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getGcFileInfo();
  getProductPlanFileInfoS();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

//获取产品规划文件信息
async function getProductPlanFileInfoS() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.getProductPlanFileInfo(data);
  historyFileInfoData.value = res.data.data.fileListDataEnds || [];
}

//获取过程文件信息
async function getGcFileInfo() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  data.fileType = '7';
  const res = await AdminApiProductPlanTaskDesign.getTaskGcFileInfo(data);
  uploadInfoData.value = res.data.data.fileListDataEnds || [];
}

async function submitOk(type: any) {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  data.userId = userStore.getUser.id;
  data.uploadInfoData = uploadInfoData.value;
  data.menuType = '7';
  const res = await AdminApiProductPlanTaskDesign.keepTaskFileInfo(data);
  if (res.data.code == 200) {
    submitAdd();
  }
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

const localeB = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '当前为第一期规划，无规划资料',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
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

function handleClosePowModal() {
  powVisible.value = false;
}

async function downLoadTemplate(type: any) {
  let data: any = {};
  data.fileType = '101';
  const res = await AdminApiProductPlanTaskDesign.getTemplateFile(data);
  if (res.data.data.fileInfoList.length > 0) {
    res.data.data.fileInfoList.forEach((selectedRow: any) => {
      if (selectedRow.fileId != null) {
        const downLoadItem = {
          fileId: selectedRow.fileId,
        };
        if (selectedRow.oldFileName != null && selectedRow.oldFileName != '') {
          handleEpcDownload(downLoadItem, `${selectedRow.oldFileName}`);
        }
      }
    });
  } else {
    message.warn(WeiI18n.t('请先上传模板文件').value);
  }
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

function delEnSystemUpload(row: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      uploadInfoData.value = uploadInfoData.value.filter((item: any) => item.fileId !== row.fileId);
      message.success('删除成功!');
    },
  });
}

async function downFile(row: any) {
  const downLoadItem = {
    fileId: row.fileId,
  };
  handleEpcDownload(downLoadItem, row.oldFileName);
}

async function customRequest_A(options: any, type: any) {
  // 调用上传接口
  loading.value = true;
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      uploadInfoData.value.push({
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

const uploadInfoData = ref<any>([]);
const historyFileInfoData = ref<any>([]);
const uploadColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '文件名称',
    dataIndex: 'oldFileName',
    key: 'oldFileName',
    ellipsis: true,
    align: 'left',
    width: 330,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.oldFileName, b.oldFileName),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 120,
    align: 'center',
  },
]);
const loading = ref<boolean>(false);
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="bodyPageStyle" :style="{ height: operateFlag }">
      <div class="content-title">
        <i></i>
        <span class="test">规划回顾分析</span>
        <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate('1')"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
        <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_A(options, 1)" :show-upload-list="false">
          <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
            <EpcIcon type="icon-shangchuanwenjian1" style="font-size: 14px" />
            {{ $t('上传文件') }}
          </a-button>
        </a-upload>
      </div>
      <a-div style="margin-top: 10px">
        <a-div :span="18">
          <a-table
            :scroll="{ x: 'max-content' }"
            :locale="localeA"
            @resizeColumn="handleResizeColumn"
            style="margin-left: 20px; overflow-y: auto; height: 245px"
            :columns="uploadColumns"
            bordered
            :pagination="false"
            :data-source="uploadInfoData">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.key === 'oldFileName'">
                <a @click="priview(record)" type="link">{{ record.oldFileName }}</a>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a type="link" v-if="paramDisabled" :disabled="paramDisabled">删除</a>
                <a @click="delEnSystemUpload(record)" type="link" v-else>删除</a>
                <a-divider type="vertical" />
                <a @click="downFile(record)" type="link">下载</a>
              </template>
            </template>
          </a-table>
        </a-div>
      </a-div>

      <div class="content-title" style="margin-top: 10px">
        <i></i>
        <span class="test">上期规划资料</span>
      </div>
      <a-div>
        <a-div :span="18">
          <a-table
            :scroll="{ x: 'max-content' }"
            :locale="localeB"
            bordered
            @resizeColumn="handleResizeColumn"
            style="margin-left: 20px; overflow-y: auto; height: 390px"
            :columns="uploadColumns"
            :pagination="false"
            :data-source="historyFileInfoData">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ index + 1 }}
              </template>
              <template v-if="column.key === 'oldFileName'">
                <a @click="priview(record)" type="link">{{ record.oldFileName }}</a>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a @click="downFile(record)" type="link">下载</a>
              </template>
            </template>
          </a-table>
        </a-div>
      </a-div>
    </div>
  </a-spin>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
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
