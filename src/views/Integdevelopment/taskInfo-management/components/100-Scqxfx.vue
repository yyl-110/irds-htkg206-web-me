<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import MarketTrendData100 from '../subcomponent/MarketTrendData100.vue';
import MarketTrendChart100 from '../subcomponent/MarketTrendChart100.vue';
import MarketTrendCompetition100 from '../subcomponent/MarketTrendCompetition100.vue';
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
const activeKey = ref<string>('1');
const marketTrendData100Comp = ref<any>(null);
const marketTrendChart100Comp = ref<any>(null);
const competitionChart100Comp = ref<any>(null);
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  activeKey.value = '1';
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

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 203;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    data.fileType = 204;
    const res2 = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200 && res2.data.code == 200) {
      submitCommit();
    }
    Echartssavepreprocessing();
  }
}
async function Echartssavepreprocessing() {
  activeKey.value = '2';
  nextTick(async () => {
    let fileId = await marketTrendChart100Comp.value?.getEchartsimgfile('centerEchart1', '市场规模与增长率趋势图.png');
    let fileId2 = await marketTrendChart100Comp.value?.getEchartsimgfile('centerEchart2', '市场增长率分布图.png');
    let arr = [
      { fileId, type: '301' },
      { fileId: fileId2, type: '302' },
    ];
    arr.forEach(async (item: any) => {
      const res = await AdminApiProductPlanTaskDesign.saveProductPlanFileBatch({
        type: item.type,
        fileIds: [item.fileId],
        taskId: planTaskInfo.value.id,
        planId: planTaskInfo.value.planId,
      });
    });
  });
}
async function submitCommit() {
  //调取子方法
  nextTick(() => {
    taskStatusComponentsa.value?.submitCommit(planTaskInfo.value.progress);
  });
}
async function submitAdd() {
  nextTick(() => {
    let resultStr = marketTrendData100Comp.value?.saveTableData();
    if (resultStr) {
      //调取子方法
      taskStatusComponentsa.value?.submitAdd(planTaskInfo.value.progress);
    }
  });
}

async function handleTabChange(key: any) {
  nextTick(() => {
    if (key == '1') {
      marketTrendData100Comp.value?.initInfo(planTaskInfo.value);
    } else if (key == '2') {
      marketTrendChart100Comp.value?.initInfo(planTaskInfo.value.id, planTaskInfo.value.planId);
    } else if (key == '3') {
      competitionChart100Comp.value?.initInfo(planTaskInfo.value.id, planTaskInfo.value.planId);
    }
  });
}

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  // if (productInfo.value.id != planTaskInfo.value.id) {
  //   paramDisabled.value = true;
  // }
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
  planTaskInfo.value.progress = res.data.data.progress;
}

const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag, overflowY: 'hidden' }">
    <div class="content-title">
      <i></i>
      <span>市场趋势分析</span>
    </div>
    <div style="margin-left: 15px; margin-top: -15px">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane key="1" tab="数据管理">
          <MarketTrendData100 ref="marketTrendData100Comp" :paramDisabled="paramDisabled" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="市场趋势分析">
          <MarketTrendChart100 ref="marketTrendChart100Comp" :paramDisabled="paramDisabled" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="竞争趋势分析">
          <MarketTrendCompetition100 ref="competitionChart100Comp" :paramDisabled="paramDisabled" />
        </a-tab-pane>
      </a-tabs>
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
