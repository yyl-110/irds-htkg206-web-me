<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import fileListComponents from './fileListComponents.vue';
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
const uploadInfoData = ref<any[]>([]);
const fileListComponentsRef = ref<any>(null);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getDeliverablesFileInfo();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

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

async function submitOk(type: any) {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  data.userId = userStore.getUser.id;
  data.type = type;
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
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <fileListComponents
      ref="fileListComponentsRef"
      @emitCustomRequest="emitCustomRequest"
      titleInfo="采购合作策略"
      :planTaskInfo="planTaskInfo"
      :paramDisabled="paramDisabled"
      :uploadInfoData="uploadInfoData">
    </fileListComponents>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @getDeliverablesFileInfo="getDeliverablesFileInfo"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
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
</style>
