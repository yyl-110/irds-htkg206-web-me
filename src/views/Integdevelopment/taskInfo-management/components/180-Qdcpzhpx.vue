<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
import { downloadFileFromStream } from '@/utils/file.ts';
import { DownOutlined } from '@ant-design/icons-vue';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import taskStatusComponents from './taskStatusComponents.vue';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import Productgrouping from '../strategycomponent/Productgrouping.vue';
import Groupweight from '../strategycomponent/Groupweight.vue';
import { getProductgroupingStyle } from '@/style/StatusStyle';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
import Weightsubitems from '../strategycomponent/Weightsubitems.vue';
import ElementScoring from '../strategycomponent/ElementScoring.vue';
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const tableHeight = ref(window.innerHeight - 650);
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
const ProductgroupingVisible = ref<boolean>(false);
const ProductgroupingRef = ref<any>(null);
const GroupweightVisible = ref<boolean>(false);
const GroupweightRef = ref<any>(null);
const WeightsubitemsVisible = ref<boolean>(false);
const WeightsubitemsRef = ref<any>(null);
const ElementScoringVisible = ref<boolean>(false);
const ElementScoringRef = ref<any>(null);
const loading = ref<boolean>(false);
const statusloading = ref<boolean>(false);
const datasource = ref([]);
const initScoreFlag = ref<boolean>(false);
const statusdatasource = ref([
  {
    mainProduct: '产品排序打分',
    devFlag: false,
    marketFlag: false,
    financeFlag: false,
  },
]);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    width: '235',
    height: '145',
    style: { marginTop: '10px' },
  }),
});
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getListData();
  getscoringprocessListData();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  },
);
const columns = ref([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: '产品平台',
    dataIndex: 'productPlatform',
    key: 'productPlatform',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productPlatform, b.productPlatform),
  },
  {
    title: '主型产品',
    dataIndex: 'mainProduct',
    key: 'mainProduct',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.mainProduct, b.mainProduct),
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
  },
  {
    title: '产品分组',
    dataIndex: 'productGroup',
    key: 'productGroup',
    ellipsis: true,
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productGroup, b.productGroup),
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    align: 'center',
    width: 80,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  },
  {
    title: '产品描述',
    dataIndex: 'productGroup',
    key: 'productGroup',
    children: [
      {
        title: '技术特征',
        dataIndex: 'feature',
        key: 'feature',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.feature, b.feature),
      },
      {
        title: '功能特征',
        dataIndex: 'characteristics',
        key: 'characteristics',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.characteristics, b.characteristics),
      },
    ],
  },
  {
    title: '开发阶段（里程碑）',
    dataIndex: 'developmentPhase',
    key: 'developmentPhase',
    children: [
      {
        title: '立项',
        dataIndex: 'projectInitiationDate',
        key: 'projectInitiationDate',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.projectInitiationDate, b.projectInitiationDate),
      },
      {
        title: '设计',
        dataIndex: 'designDate',
        key: 'designDate',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.designDate, b.designDate),
      },
      {
        title: '样机试制',
        dataIndex: 'prototypeDate',
        key: 'prototypeDate',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.prototypeDate, b.prototypeDate),
      },
      {
        title: '产品发布',
        dataIndex: 'productLaunchDate',
        key: 'productLaunchDate',
        ellipsis: true,
        align: 'center',
        width: 200,
        resizable: true,
        sorter: (a: any, b: any) => sortermethod(a.productLaunchDate, b.productLaunchDate),
      },
    ],
  },
]);
const statuscolumns = ref([
  {
    title: '文件',
    dataIndex: 'mainProduct',
    key: 'mainProduct',
    align: 'center',
    width: 200,
    resizable: true,
  },
  {
    title: '研发',
    dataIndex: 'devFlag',
    key: 'devFlag',
    align: 'center',
    width: 200,
    resizable: true,
  },
  {
    title: '市场',
    dataIndex: 'marketFlag',
    key: 'marketFlag',
    align: 'center',
    width: 200,
    resizable: true,
  },
  {
    title: '财务',
    dataIndex: 'financeFlag',
    key: 'financeFlag',
    align: 'center',
    width: 200,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.financeFlag, b.financeFlag),
  },
]);

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
async function getListData() {
  statusloading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.getProductGroupSortList({ planId: planTaskInfo.value.planId });
    statusloading.value = false;
    if (res.data.code === 200) {
      datasource.value = res.data.data;
    }
  } finally {
    loading.value = false;
  }
}
async function getscoringprocessListData() {
  statusloading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.getScoreProcessUser({ planId: planTaskInfo.value.planId });
    statusloading.value = false;
    if (res.data.code === 200) {
      statusdatasource.value[0].devFlag = res.data.data.devFlag;
      statusdatasource.value[0].marketFlag = res.data.data.marketFlag;
      statusdatasource.value[0].financeFlag = res.data.data.financeFlag;
      initScoreFlag.value = res.data.data.initScoreFlag;
    }
  } finally {
    statusloading.value = false;
  }
}
async function SynchronizationList() {
  try {
    const res = await AdminApiSystemProductPlanningscoring.syncProductSortList({ planId: planTaskInfo.value.planId });
    loading.value = false;
    if (res.data.code === 200) {
      getListData();
      message.success('同步成功');
    }
  } catch (error) {
    console.log(error, 'error');
  }
}
async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 209;
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
}
async function onClick(e: any) {
  if (e.key == '1') {
    ProductgroupingVisible.value = true;
    nextTick(() => {
      ProductgroupingRef.value.handleModalChange(planTaskInfo.value, datasource.value);
    });
  } else if (e.key == '2') {
    GroupweightVisible.value = true;
    nextTick(() => {
      GroupweightRef.value.handleModalChange(planTaskInfo.value);
    });
  } else if (e.key == '3') {
    WeightsubitemsVisible.value = true;
    nextTick(() => {
      WeightsubitemsRef.value.handleModalChange(planTaskInfo.value);
    });
  } else if (e.key == '4') {
    Modal.confirm({
      title: `确定发起打分流程吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        const res = await AdminApiSystemProductPlanningscoring.initScoreProcess({ taskId: planTaskInfo.value.id });
        if (res.data.code === 200) {
          message.success('操作成功！');
        }
      },
    });
  }
}
async function onClicks(e: any) {
  if (e.key == '1') {
    ElementScoringVisible.value = true;
    nextTick(() => {
      ElementScoringRef.value.handleModalChange(planTaskInfo.value);
    });
  } else if (e.key == '2') {
    const res = await AdminApiSystemProductPlanningscoring.scoreResultExport({ planId: planTaskInfo.value.planId });
    const fileName = planTaskInfo.value.nodeName + '-打分结果.xlsx';
    downloadFileFromStream(res, fileName);
    message.success('导出成功');
  }
}
const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
  submitSaveScore();
}
function submitSaveScore() {
  AdminApiSystemProductPlanningscoring.submitSaveScore({ planId: planTaskInfo.value.planId }).then(res => {
    if (res.data.code === 200) {
      message.success('操作成功！');
      console.log('++');
    }
  });
}
function submitflag() {
  let flag = true;
  if (statusdatasource.value[0].devFlag && statusdatasource.value[0].marketFlag && statusdatasource.value[0].financeFlag) {
    flag = false;
  }
  return flag;
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="text">产品组合排序</span>
      <a-button type="primary" style="margin-left: 15px" @click="SynchronizationList">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步产品组合清单</a-button
      >
      <a-tooltip>
        <template #title>{{ '请先设置产品/打分权重，然后发起打分流程！' }}</template>
        <EpcIcon type="icon-xiangqing" style="margin-left: 15px; font-size: 18px; color: #165dff" />
      </a-tooltip>
      <a-dropdown placement="bottom">
        <a class="ant-dropdown-link" @click.prevent style="margin-left: 15px">
          打分项设置
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu @click="onClick">
            <a-menu-item key="1">产品分组设置</a-menu-item>
            <a-menu-item key="2">产品分组权重设置</a-menu-item>
            <a-menu-item key="3">打分项权重设置</a-menu-item>
            <a-menu-item key="4" :disabled="initScoreFlag">发起打分流程</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown placement="bottom" :disabled="submitflag()">
        <a class="ant-dropdown-link" @click.prevent style="margin-left: 15px">
          打分结果
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu @click="onClicks">
            <a-menu-item key="1">查看打分结果</a-menu-item>
            <a-menu-item key="2">导出打分结果</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div class="table-box">
      <a-table
        :scroll="{ x: 'max-content', y: tableHeight }"
        row-key="id"
        :columns="columns"
        :data-source="datasource"
        :locale="locale"
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'productGroup'">
            <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
          </template>
        </template>
      </a-table>
    </div>
    <div class="content-title" style="margin-top: 10px">
      <i></i>
      <span class="text">打分任务完成状态：</span>
    </div>
    <div class="table-box">
      <a-table
        :scroll="{ x: 'max-content', y: tableHeight }"
        row-key="id"
        :columns="statuscolumns"
        :data-source="statusdatasource"
        :locale="locale"
        bordered
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :loading="statusloading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'devFlag'">
            <EpcIcon v-if="record.devFlag" type="icon-yiwancheng" style="font-size: 16px; color: #029b00" />
            <EpcIcon v-else type="icon-hongsegantanhao" style="font-size: 16px; color: red" />
          </template>
          <template v-if="column.dataIndex === 'marketFlag'">
            <EpcIcon v-if="record.marketFlag" type="icon-yiwancheng" style="font-size: 16px; color: #029b00" />
            <EpcIcon v-else type="icon-hongsegantanhao" style="font-size: 16px; color: red" />
          </template>
          <template v-if="column.dataIndex === 'financeFlag'">
            <EpcIcon v-if="record.financeFlag" type="icon-yiwancheng" style="font-size: 16px; color: #029b00" />
            <EpcIcon v-else type="icon-hongsegantanhao" style="font-size: 16px; color: red" />
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
    :submitDisabled="submitflag() || submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <Productgrouping
    :initScoreFlag="initScoreFlag"
    :modalVisible="ProductgroupingVisible"
    ref="ProductgroupingRef"
    @onClose="ProductgroupingVisible = false"
    @RefreshtableData="getListData" />
  <Groupweight :initScoreFlag="initScoreFlag" :modalVisible="GroupweightVisible" ref="GroupweightRef" @onClose="GroupweightVisible = false" @RefreshtableData="getListData" />
  <Weightsubitems
    :initScoreFlag="initScoreFlag"
    :modalVisible="WeightsubitemsVisible"
    ref="WeightsubitemsRef"
    @onClose="WeightsubitemsVisible = false"
    @RefreshtableData="getListData" />
  <ElementScoring :modalVisible="ElementScoringVisible" ref="ElementScoringRef" @onClose="ElementScoringVisible = false" @RefreshtableData="getListData" />
</template>

<style lang="less" scoped>
:deep(.ant-dropdown::before) {
  margin-left: 1000px !important;
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
  margin-bottom: 18px;
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
</style>
