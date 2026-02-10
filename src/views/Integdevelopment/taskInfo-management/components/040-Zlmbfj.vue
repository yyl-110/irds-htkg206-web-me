<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import StrategicObjectiveUpdate from '../subcomponent/strategicObjectiveUpdate.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { useUserStore } from '@/store/modules/user';
import { downloadFileFromStream } from '@/utils/file.ts';
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const addDialogVisible = ref<any>(false);
const goalBreakdownsList = ref<any>({});
const strategicObjectiveModel = ref();
const strategicObjectiveVisible = ref(false);
const taskStatusComponentsa = ref<any>(null);
const formRef = ref();
const userStore = useUserStore();
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
// 表单数据
const formData = reactive({
  strategicVision: '',
  salesTarget: '',
  revenueTarget: '',
  profitGrowth: '',
  competitiveTarget: '',
});

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

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  },
);

function initPageData() {
  //更新页面内容-获取战略目标信息
  const params = {
    taskId: planTaskInfo.value?.id,
  };
  AdminApiProductPlanTaskDesign.getProductPlanTaskStrategicInfo(params).then(res => {
    if (res && res.data.code == 200) {
      formData.strategicVision = res.data.data.strategicVision;
      formData.salesTarget = res.data.data.salesTarget;
      formData.revenueTarget = res.data.data.revenueTarget;
      formData.profitGrowth = res.data.data.profitGrowth;
      formData.competitiveTarget = res.data.data.competitiveTarget;
      goalBreakdownsList.value = res.data.data.goalBreakdownsList;
    }
  });
}

function changeStrategicInfo() {
  // formRef.value.resetFields();
  addDialogVisible.value = true;
}

// 增加编辑弹窗
async function confirm() {
  await formRef.value?.validate();
  const params = {
    taskId: planTaskInfo.value?.id,
    strategicVision: formData.strategicVision,
    salesTarget: formData.salesTarget,
    revenueTarget: formData.revenueTarget,
    profitGrowth: formData.profitGrowth,
    competitiveTarget: formData.competitiveTarget,
  };
  AdminApiProductPlanTaskDesign.productPlanTaskDetailUpdate(params).then(res => {
    if (res && res.data.code == 200) {
      initPageData();
      addDialogVisible.value = false;
    }
  });
}

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 201;
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
async function submitStatus() {}

function closeStrategicObjectiveModal() {
  strategicObjectiveVisible.value = false;
}

function updateStrategicObjective(plantformId: any) {
  strategicObjectiveVisible.value = true;
  nextTick(() => {
    strategicObjectiveModel.value?.initInfo(planTaskInfo.value?.id, plantformId, formData);
  });
}
async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  const res = await AdminApiProductPlanTaskDesign.breakdownsExcelExport(data);
  const fileName = '战略目标分解数据.xlsx';
  downloadFileFromStream(res, fileName);
}

function customRequest_A() {
  message.success('开发中...');
}
async function editStatus() {}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="content-title-class">战略目标分解</span>
      <a-button @click="exportExcel()" type="primary" style="margin-left: 40px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
    </div>
    <div style="margin: 0 auto; display: flex; justify-content: center">
      <div>
        <div class="triangle" style="text-align: center; cursor: pointer" @click="changeStrategicInfo">
          <div style="width: 1000px; position: relative; right: 500px; top: 20px">
            <h2 style="color: #333">{{ formData.strategicVision }}</h2>
            <h3 style="color: #333">
              <span v-if="formData.salesTarget != ''">{{ formData.salesTarget }}，</span>
              <span v-if="formData.revenueTarget != ''">{{ formData.revenueTarget }}，</span>
              <span v-if="formData.profitGrowth != ''">{{ formData.profitGrowth }}，</span>
              <span v-if="formData.competitiveTarget != ''">{{ formData.competitiveTarget }}</span>
            </h3>
          </div>
        </div>
        <div style="background-color: ffffff; width: 1000px; height: 580px; border: 1px solid #bfbfbf">
          <div class="calculateItem" @click="updateStrategicObjective(item.platformId)" v-for="item in goalBreakdownsList" :key="item.id">
            <div class="Img-box">
              <div style="width: 100%; text-align: center; font-weight: 700; margin-top: 5px">{{ item.templateName }}</div>
              <ul style="margin-left: 20px; margin-top: 5px">
                <li style="line-height: 25px">
                  销售目标：<span style="margin-left: 10px">{{ item.salesTarget }}</span>
                </li>
                <li style="line-height: 25px">
                  收入目标：<span style="margin-left: 10px">{{ item.revenueTarget }}</span>
                </li>
                <li style="line-height: 25px">
                  盈利目标：<span style="margin-left: 10px">{{ item.profitGrowth }}</span>
                </li>
                <li style="line-height: 25px">
                  竞争目标：<span style="margin-left: 10px">{{ item.competitiveTarget }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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

  <a-modal v-model:visible="addDialogVisible" title="公司战略目标设置" width="30%">
    <a-form :label-col="{ style: { width: '140px' } }" ref="formRef" :model="formData" label-position="right" label-width="100">
      <div style="margin-left: 20px; font-weight: 700">公司战略愿景：</div>
      <a-form-item label="公司愿景" name="strategicVision" :rules="{ required: true, message: '请输入公司战略愿景' }">
        <a-input v-model:value="formData.strategicVision" :disabled="paramDisabled" allowClear s></a-input>
      </a-form-item>
      <div style="margin-left: 20px; font-weight: 700">战略目标：</div>
      <a-form-item label="销售目标">
        <a-input v-model:value="formData.salesTarget" :disabled="paramDisabled" allowClear></a-input>
      </a-form-item>
      <a-form-item label="收入目标">
        <a-input v-model:value="formData.revenueTarget" :disabled="paramDisabled" allowClear></a-input>
      </a-form-item>
      <a-form-item label="盈利目标">
        <a-input v-model:value="formData.profitGrowth" :disabled="paramDisabled" allowClear></a-input>
      </a-form-item>
      <a-form-item label="竞争目标">
        <a-input v-model:value="formData.competitiveTarget" :disabled="paramDisabled" allowClear></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="confirm" :disabled="paramDisabled">确定</a-button>
        <a-button @click="addDialogVisible = false">取消</a-button>
      </div>
    </template>
  </a-modal>
  <StrategicObjectiveUpdate
    ref="strategicObjectiveModel"
    :paramDisabled="paramDisabled"
    :modal-visible="strategicObjectiveVisible"
    @refresh-table-data="initPageData"
    @close="closeStrategicObjectiveModal" />
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
  .content-title-class {
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

.triangle {
  width: 0;
  height: 0;
  border-left: 500px solid transparent;
  border-right: 500px solid transparent;
  border-bottom: 90px solid #e5e5e5; /* 三角形颜色 */
}

:deep(.container) {
  overflow-y: auto !important;
}

.calculateItem {
  position: relative;
  width: 290px;
  float: left;
  margin-top: 30px;
  margin-left: 26px;
  margin-bottom: 10px;
  margin-right: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
}
.calculateItem:hover {
  transform: translateY(-10px);
  background: #1971ff;
  color: #fff;

  .calclation-content {
    color: #fff;
    display: flex;
    justify-content: space-between;
  }
  .calclation-content2 {
    color: #fff;
  }
}

.Img-box {
  position: relative;
  display: block;
  width: 100%;
  height: 140px;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}
</style>
