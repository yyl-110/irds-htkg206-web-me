<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import VChart from 'vue-echarts';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
import topComponents from './topComponents.vue';
import { sortermethod } from '@/utils/tools';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { getProductgroupingStyle } from '@/style/StatusStyle';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
import allocateresources from '../strategycomponent/allocateresources.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { base64ToFile } from '@/utils/file';
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const allocation = ref<any>({});
const activeKey = ref('0');
const allocateresourcesVisible = ref<boolean>(false);
const allocateresourcesRef = ref<any>(null);
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
const loading = ref<boolean>(false);
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
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  getListData();
  allocationStatistics();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: flex-start;align-items: center;',
        },
        [h('span', { innerText: index + 1 })]
      );
    },
  },
  {
    title: WeiI18n.$t('产品名称'),
    dataIndex: 'productName',
    key: 'productName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productName, b.productName),
    width: 120,
  },
  {
    title: WeiI18n.$t('产品分组'),
    dataIndex: 'productGroup',
    key: 'productGroup',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productGroup, b.productGroup),
    width: 180,
  },
  {
    title: WeiI18n.$t('评分分值'),
    dataIndex: 'totalScore',
    key: 'totalScore',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.totalScore, b.totalScore),
    width: 80,
  },
  {
    title: WeiI18n.$t('设计开始时间'),
    dataIndex: 'projectInitiationDate',
    key: 'projectInitiationDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectInitiationDate, b.projectInitiationDate),
    width: 120,
  },
  {
    title: WeiI18n.$t('设计结束时间'),
    dataIndex: 'designDate',
    key: 'designDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.designDate, b.designDate),
    width: 120,
  },
  {
    title: WeiI18n.$t('已分配人数'),
    dataIndex: 'totalPeople',
    key: 'totalPeople',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.totalPeople, b.totalPeople),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
]);
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.allocationList({ planId: planTaskInfo.value.planId });
    loading.value = false;
    if (res.data.code === 200) {
      datasource.value = res.data.data;
    }
  } finally {
    loading.value = false;
  }
}

const chartRef = ref<InstanceType<typeof VChart>>();
const selectPtOptions = ref<any>(['	车辆总体设计师', '	车辆机械设计师', '车辆电气设计师']);
const option = ref<any>({
  // 标题
  title: {
    text: '资源分配与容量对比',
    left: 'center',
  },
  // 提示框（鼠标悬停时显示详情）
  tooltip: {
    trigger: 'axis', // 按坐标轴触发
    axisPointer: { type: 'shadow' }, // 阴影指示器
  },
  // 图例（如果有多个数据系列，用于区分）
  legend: {
    data: ['资源容量', '已分配资源'], // 与series.name对应
    top: 30, // 距离顶部30px
  },
  // x轴（类目轴，如月份）
  xAxis: {
    type: 'category', // 类目类型
    data: selectPtOptions.value, // x轴数据
  },
  // y轴（数值轴，如销量值）
  yAxis: {
    type: 'value', // 数值类型
    name: '占比（%）', // 轴名称
  },
  // 数据系列（柱状图核心数据）
  series: [
    {
      name: '资源容量', // 与图例data对应
      type: 'bar', // 类型为柱状图
      data: [], // 具体数值
      barWidth: 40, // 柱形宽度
      itemStyle: {
        color: '#71b7e6', // 柱形颜色
      },
    },
    {
      name: '已分配资源', // 与图例data对应
      type: 'bar', // 类型为柱状图
      data: [], // 具体数值
      barWidth: 40, // 柱形宽度
      itemStyle: {
        color: '#6cdb9b', // 柱形颜色
      },
    },
  ],
});

function allocationStatistics() {
  AdminApiSystemProductPlanningscoring.allocationStatistics({ planId: planTaskInfo.value.planId }).then(res => {
    if (res.data.code === 200) {
      let data: any = res.data.data;
      allocation.value = data;
      RequirementsatheringList.value[0].number = data.allCount;
      RequirementsatheringList.value[1].number = data.allocatedCount;
      RequirementsatheringList.value[2].number = data.utilizationRate;
      option.value.series[0].data = [Number(data.totalDesignerCount), Number(data.mechanicalDesignerCount), Number(data.electricalDesignerCount)];
      option.value.series[1].data = [Number(data.totalDesignerCountAllocated), Number(data.mechanicalDesignerCountAllocated), Number(data.electricalDesignerCountAllocated)];
    }
  });
}
async function SynchronizationList() {
  try {
    const res = await AdminApiSystemProductPlanningscoring.syncAllocationList({ planId: planTaskInfo.value.planId });
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
    submitCommit();
    Echartssavepreprocessing();
  }
}
async function Echartssavepreprocessing() {
  activeKey.value = '1';
  nextTick(async () => {
    let fileId = '';
    const base64Url = chartRef.value.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    });
    const file = base64ToFile(base64Url, '资源分配与容量对比图.png');
    const res = await AdminApiSystemUploadFile.uploadFile({ file: file as File, userId: userStore.getUser.id });
    if (res.data.code == 200) {
      fileId = res.data.data.id;
    }
    await AdminApiProductPlanTaskDesign.saveProductPlanFileBatch({
      type: '303',
      fileIds: [fileId],
      taskId: planTaskInfo.value.id,
      planId: planTaskInfo.value.planId,
    });
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
function handleClick(tab: any, event: any) {
  activeKey.value = tab;
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

const RequirementsatheringList = ref([
  {
    key: '1',
    title: WeiI18n.t('全部资源').value,
    number: '',
    iconType: 'icon-quanbuziyuan',
  },
  {
    key: '2',
    title: WeiI18n.t('已分配资源').value,
    number: '',
    iconType: 'icon-yifenpeiziyuan',
  },
  {
    key: '3',
    title: WeiI18n.t('资源利用率').value,
    number: '',
    iconType: 'icon-ziyuanliyongshuai',
  },
]);

async function UpdateParameterInfoModule(record: any) {
  allocateresourcesVisible.value = true;
  allocateresourcesRef.value?.handleModalChange(record);
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="text">审视管道平衡</span>
      <a-button type="primary" style="margin-left: 20px" @click="SynchronizationList">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步列表数据</a-button
      >
    </div>
    <div class="content-box">
      <div v-for="item in RequirementsatheringList" :key="item.key">
        <div class="content-internal-box">
          <EpcIcon :type="item.iconType" style="font-size: 50px; margin-right: 10px; color: #165dff" />
          <div class="content-internal-minbox">
            <div class="content-internal-title">{{ item.title }}</div>
            <div class="content-internal-number">
              {{ item.number }}<span v-if="item.title == '资源利用率'">{{ '%' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-box">
      <a-tabs v-model:active-key="activeKey" @tab-click="handleClick">
        <a-tab-pane tab="资源分配" key="0">
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
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'productGroup'">
                <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button shape="circle" type="link" :disabled="paramDisabled" @click="UpdateParameterInfoModule(record)">分配资源</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="资源平衡可视化" key="1">
          <div class="e-box">
            <VChart ref="chartRef" class="chart" :option="option" autoresize /></div
        ></a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <allocateresources
    :modalVisible="allocateresourcesVisible"
    :allocation="allocation"
    ref="allocateresourcesRef"
    @onClose="allocateresourcesVisible = false"
    @RefreshtableData="getListData" />
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
.tabs-box {
  margin: 10px 20px 0 20px;
  overflow-y: auto;
}
.e-box {
  height: calc(100vh - 500px);
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
.content-box {
  width: 100%;
  height: 80px;
  margin-top: -30px;
  display: flex;
  justify-content: space-around;
  .content-internal-box {
    min-width: 150px;
    min-height: 100px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    .content-internal-minbox {
      .content-internal-title {
        font-size: 20px;
        font-weight: bold;
        color: #666666;
      }
      .content-internal-number {
        font-size: 20px;
        font-weight: bold;
        color: #81d3f8;
        span {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
