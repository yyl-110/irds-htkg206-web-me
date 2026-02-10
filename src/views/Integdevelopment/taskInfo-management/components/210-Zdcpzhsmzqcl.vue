<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import VChart from 'vue-echarts';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
import lifecycle from '../strategycomponent/lifecycle.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { Productgroupingdisplay } from '@/utils/Requirementtablejudgment';
import { getProductgroupingStyle } from '@/style/StatusStyle';
import { base64ToFile } from '@/utils/file';
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
const lifecycleVisible = ref<boolean>(false);
const lifecycleRef = ref<any>(null);
const activeKey = ref('0');
const loading = ref<boolean>(false);
const datasource = ref<any>([]);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { marginTop: '50px' },
  }),
});
interface OptionrItem {
  label: string;
  value: string;
}
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
    const file = base64ToFile(base64Url, '产品组合生命周期可视化命名图.png');
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
// 产品平台
const ProductPlatformlist = ref<OptionrItem[]>([]);
const productPlatformIds = ref<any>();
/** 获取分类数据 */
async function getLifeCyclePlatformList() {
  const res = await AdminApiSystemProductPlanningscoring.getLifeCyclePlatformList({ planId: planTaskInfo.value.planId });
  if (res.data.code == 200 && res.data.data && res.data.data.length > 0) {
    ProductPlatformlist.value = res.data.data.map((item: any) => ({ label: item.productPlatform, value: `${item.productPlatformId}` })) || [];
  }
}
async function getListData() {
  await getLifeCyclePlatformList();
  loading.value = true;
  try {
    const res = await AdminApiSystemProductPlanningscoring.getcycleList({ planId: planTaskInfo.value.planId, productPlatformIds: productPlatformIds.value });
    loading.value = false;
    if (res.data.code === 200) {
      datasource.value = res.data.data;
      initData();
    }
  } finally {
    loading.value = false;
  }
}

function handleChange() {
  getListData();
}

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
    title: WeiI18n.$t('GA(正式上市)'),
    dataIndex: 'gaDate',
    key: 'gaDate',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.gaDate, b.gaDate),
    width: 200,
  },
  {
    title: WeiI18n.$t('EOM(停止市场推广)'),
    dataIndex: 'eomDate',
    key: 'eomDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.eomDate, b.eomDate),
    width: 200,
  },
  {
    title: WeiI18n.$t('EOP(停止生产)'),
    dataIndex: 'eopDate',
    key: 'eopDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.eopDate, b.eopDate),
    width: 200,
  },
  {
    title: WeiI18n.$t('LODSP(备件最后订购日期)'),
    dataIndex: 'lodspDate',
    key: 'lodspDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.lodspDate, b.lodspDate),
    width: 230,
  },
  {
    title: WeiI18n.$t('EOS(停止支持)'),
    dataIndex: 'eosDate',
    key: 'eosDate',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.eosDate, b.eosDate),
    width: 200,
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
function handleClick(tab: any, event: any) {
  activeKey.value = tab;
}
async function SynchronizationList() {
  try {
    const res = await AdminApiSystemProductPlanningscoring.syncLifeCycleList({ planId: planTaskInfo.value.planId });
    loading.value = false;
    if (res.data.code === 200) {
      getListData();
      message.success('同步成功');
    }
  } catch (error) {
    console.log(error, 'error');
  }
}
const chartRef = ref<InstanceType<typeof VChart>>();
const series = ref<any[]>([]);
const dateKeys = ref(['gaDate', 'eomDate', 'eopDate', 'lodspDate', 'eosDate']); // X轴日期字段
const dateLabels = ref({
  // 日期字段中文标签
  gaDate: 'GA(正式上市)',
  eomDate: 'EOM(停止市场推广)',
  eopDate: 'EOP(停止生产)',
  lodspDate: 'LODSP(备件最后订购日期)',
  eosDate: 'EOS(停止支持)',
});

let colorStr = ref<any>([
  '#3fb1e3',
  '#6be6c1',
  '#626c91',
  'rgba(247, 165, 165, 0.4)',
  'rgba(149, 146, 241, 0.4)',
  'rgba(126, 231, 243, 0.4)',
  'rgba(126, 243, 197, 0.4)',
  'rgba(118, 227, 130, 0.4)',
  'rgba(212, 227, 90, 0.4)',
  'rgba(149, 146, 241, 0.4)',
  'rgba(126, 231, 243, 0.4)',
  'rgba(126, 243, 197, 0.4)',
  'rgba(118, 227, 130, 0.4)',
  'rgba(247, 165, 165, 0.4)',
  'rgba(149, 146, 241, 0.4)',
  'rgba(126, 231, 243, 0.4)',
  'rgba(126, 243, 197, 0.4)',
  'rgba(118, 227, 130, 0.4)',
]);
// 处理数据：按 productName 分组，提取非空日期
function initData() {
  const platformMap = new Map<string, any[]>();
  datasource.value.forEach(item => {
    const { productName } = item;
    if (!platformMap.has(productName)) {
      platformMap.set(productName, []);
    }

    // 收集当前产品的所有非空日期
    dateKeys.value.forEach((key: any) => {
      if (item[key]) {
        // 仅保留非空日期
        platformMap.get(productName)!.push({
          name: item.productPlatform, // 产品名称（悬停显示）
          date: item[key], // 日期值
          type: dateLabels.value[key], // 日期类型标签
        });
      }
    });
  });
  // 转换为ECharts series格式
  series.value = Array.from(platformMap.entries()).map(([platName, dates], index) => ({
    name: platName,
    symbol: 'triangle',
    type: 'line',
    data: dates.map(d => [d.date, index, d.name, d.type]), // [x轴日期, y轴索引, 产品名, 日期类型]
    symbolSize: 15, // 标记大小
    lineStyle: {
      color: '#5470C6',
      width: 4,
      type: 'dashed',
    },
    itemStyle: {
      borderWidth: 3,
      color: colorStr.value[index],
    },
  }));
  option.value.series = series.value;
  option.value.yAxis.data = Array.from(platformMap.keys());
}
const option = ref<any>({
  // dataZoom: [
  //   {
  //     type: 'slider', // 滑动条式缩放（底部显示）
  //     start: 0, // 初始显示范围（0%~50%）
  //     end: 50,
  //     xAxisIndex: 0, // 绑定X轴（多轴时需指定索引）
  //   },
  // ],
  tooltip: {
    trigger: 'item',
    formatter: params => {
      const [date, yIndex, productName, type] = params.data;
      return `
        <div>
          <p>平台名称：${params.seriesName}</p>
          <p>产品分组：${productName}</p>
          <p>日期类型：${type}</p>
          <p>时间：${date}</p>
        </div>
      `;
    },
  },
  grid: { left: '5%', right: '5%', top: '10%', bottom: '10%' }, // 边距调整
  xAxis: {
    type: 'time',
    axisLabel: {
      formatter: '{yyyy}-{MM}-{dd}',
      interval: 0, // 强制显示所有标签（默认会自动跳过部分标签）
      rotate: 45, // 旋转角度（建议30°~60°，角度越大占用垂直空间越多）
      margin: 15, // 标签与轴线的距离，避免文字溢出
    }, // 日期格式
    splitLine: { show: true, lineStyle: { type: 'dashed' } },
  },
  yAxis: {
    type: 'category',
    data: [], // Y轴分类：产品平台列表
    axisLabel: {
      interval: 0,
    }, // 强制显示所有标签
    splitLine: { show: false },
  },
  series: [], // 上文格式化的series数据
});

async function UpdateParameterInfoModule(record: any) {
  lifecycleVisible.value = true;
  lifecycleRef.value?.handleModalChange(record);
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="text">制定产品组合生命周期策略</span>
      <a-button type="primary" style="margin-left: 20px" @click="SynchronizationList">
        <EpcIcon type="icon-tongbu2" style="font-size: 16px" />
        同步列表数据</a-button
      >
    </div>
    <div class="tabs-box">
      <a-tabs v-model:active-key="activeKey" @tab-click="handleClick">
        <a-tab-pane tab="产品组合生命周期策划" key="0">
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
            <template #headerCell="{ column }">
              <template v-if="column.key === 'gaDate'">
                <a-tooltip placement="leftTop">
                  <template #title>{{ '示例: 2020年1月1日' }}</template>
                  <EpcIcon type="icon-xiangqing" style="font-size: 18px; position: relative; top: 1px; margin-right: 15px; color: #165dff" />
                </a-tooltip>
                <span>GA(正式上市)</span>
              </template>
              <template v-if="column.key === 'eomDate'">
                <a-tooltip placement="leftTop">
                  <template #title>{{ '示例: 2025年1月1日（发布新款交换机，停止推广旧款）' }}</template>
                  <EpcIcon type="icon-xiangqing" style="font-size: 18px; position: relative; top: 1px; margin-right: 15px; color: #165dff" />
                </a-tooltip>
                <span>EOM(停止市场推广)</span>
              </template>
              <template v-if="column.key === 'eopDate'">
                <a-tooltip placement="leftTop">
                  <template #title>{{ '示例: 2025年6月30日（停止生产并停止接受新订单）' }}</template>
                  <EpcIcon type="icon-xiangqing" style="font-size: 18px; position: relative; top: 1px; margin-right: 15px; color: #165dff" />
                </a-tooltip>
                <span>EOP(停止生产)</span>
              </template>
              <template v-if="column.key === 'lodspDate'">
                <a-tooltip placement="leftTop">
                  <template #title>{{ '示例: 2030年6月30日（在停售后5年内仍可订购备件）' }}</template>
                  <EpcIcon type="icon-xiangqing" style="font-size: 18px; position: relative; top: 1px; margin-right: 15px; color: #165dff" />
                </a-tooltip>
                <span>LODSP(备件最后订购日期)</span>
              </template>
              <template v-if="column.key === 'eosDate'">
                <a-tooltip placement="leftTop">
                  <template #title>{{ '示例: 2035年6月30日（提供总共10年的支持服务）' }}</template>
                  <EpcIcon type="icon-xiangqing" style="font-size: 18px; position: relative; top: 1px; margin-right: 15px; color: #165dff" />
                </a-tooltip>
                <span>EOS(停止支持)</span>
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'productGroup'">
                <span :style="getProductgroupingStyle(record.productGroup)">{{ Productgroupingdisplay(record.productGroup) }}</span>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button shape="circle" type="link" :disabled="paramDisabled" @click="UpdateParameterInfoModule(record)">生命周期定义</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="产品组合生命周期可视化" key="1">
          <span style="font-weight: bold">过滤选项</span>
          <a-select style="width: 220px; margin-left: 20px" v-model:value="productPlatformIds" :max-tag-count="1" mode="multiple" @change="handleChange">
            <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <div class="e-box">
            <VChart v-if="!loading" ref="chartRef" class="chart" :option="option" autoresize />
            <div v-else class="example">
              <a-spin tip="加载中..." />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <lifecycle :modalVisible="lifecycleVisible" ref="lifecycleRef" @onClose="lifecycleVisible = false" @RefreshtableData="getListData" />
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
.example {
  position: absolute;
  top: 70%;
  left: 65%;
}
.tabs-box {
  margin: 0 20px 0 20px;
  overflow-y: auto;
}
.e-box {
  height: calc(100vh - 200px);
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
</style>
