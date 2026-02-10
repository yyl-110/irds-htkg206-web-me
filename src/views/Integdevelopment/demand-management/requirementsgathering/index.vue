<script setup lang="ts">
// 需求收集
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { ProdDemandcollectRequestDTOModel } from '@/api/models/demand/ProdDemandcollectRequestDTOModel';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import DemandAddUpdate from './components/form/demand-add-update.vue';
import demanddetail from './components/detail/index.vue';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { getStatusStyle } from '@/style/StatusStyle';
import { Isiteditable } from '@/utils/Requirementtablejudgment';
const props = defineProps({
  todocount: {
    require: false,
    type: String,
    default: '',
  },
});
const emit = defineEmits(['Refreshpendingtasks']);
const router = useRoute();
const userStore = useUserStore();
const selectedColumn = ref('demandTitle'); // 选择要搜索的列
const Refdemanddetail = ref();
const AddUpdateVisible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const tableHeight = ref(window.innerHeight - 450);
const datasource = ref([]); // 系列设计列表数据
const loukcount = ref<any>('');
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation4-width');
  return Number(width);
});
const RefAddUpdate = ref();
const Refdetail = ref();
/** 列表请求参数 */
const requestParams = reactive<any>(new ProdDemandcollectRequestDTOModel());
requestParams.taskStatus = '';
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
const tabLabelList = reactive([
  {
    label: '待办',
    id: 1,
  },
  {
    label: '进行中',
    id: 2,
  },
  {
    label: '已办',
    id: 3,
  },
  {
    label: '全部',
    id: 4,
  },
]);
/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);
const taskIndex = ref('待办');
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '60px', marginTop: '50px' },
  }),
});
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
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: WeiI18n.$t('需求编号'),
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
    width: 110,
  },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'version',
    key: 'version',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
    width: 100,
  },
  {
    title: WeiI18n.$t('原始需求标题'),
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandTitle, b.demandTitle),
    width: 240,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 120,
  },
  {
    title: WeiI18n.$t('细分市场'),
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.marketSegment, b.marketSegment),
    width: 160,
  },
  {
    title: WeiI18n.$t('提出人'),
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('RME'),
    dataIndex: 'rmeUserName',
    key: 'rmeUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.rmeUserName, b.rmeUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('任务状态'),
    dataIndex: 'taskStatus',
    key: 'taskStatus',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskStatus, b.taskStatus),
    width: 130,
  },
  {
    title: WeiI18n.$t('需求分析结论'),
    dataIndex: 'conclusion',
    key: 'conclusion',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.conclusion, b.conclusion),
    width: 130,
  },
  {
    title: WeiI18n.$t('需求状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 150,
  },
  {
    title: WeiI18n.$t('提交时间'),
    dataIndex: 'submitTime',
    key: 'submitTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.submitTime, b.submitTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('RME处理时间'),
    dataIndex: 'rmeAnalyzeTime',
    key: 'rmeAnalyzeTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.rmeAnalyzeTime, b.rmeAnalyzeTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('期望反馈时间'),
    dataIndex: 'feedbackTime',
    key: 'feedbackTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.feedbackTime, b.feedbackTime),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: operationWidth.value,
    fixed: 'right',
  },
]);
const RequirementsatheringList = ref([
  {
    key: '1',
    title: WeiI18n.t('全部需求').value,
    number: '',
    iconType: 'icon-quanbuxuqiu',
    Key: 'allCount',
  },
  {
    key: '2',
    title: WeiI18n.t('待RME分析').value,
    number: '',
    iconType: 'icon-daifenxi',
    Key: 'unAnalyzedCount',
  },
  {
    key: '3',
    title: WeiI18n.t('RME已分析').value,
    number: '',
    iconType: 'icon-yitijiao',
    Key: 'rmeAnalyzedCount',
  },
  {
    key: '4',
    title: WeiI18n.t('已关闭').value,
    number: '',
    iconType: 'icon-dingdan-yiwancheng',
    Key: 'closeCount',
  },
]);
const searchcolumns = ref([
  {
    title: WeiI18n.$t('需求编号'),
    dataIndex: 'demandNum',
    key: 'demandNum',
  },
  {
    title: WeiI18n.$t('需求标题'),
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandTitle, b.demandTitle),
    width: 150,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 150,
  },
  {
    title: WeiI18n.$t('需求状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskStatus, b.taskStatus),
    width: 120,
  },
]);
const statuscolumns = ref([
  {
    title: WeiI18n.t('待RME分析').value,
    key: 'RME_AP',
  },
  {
    title: WeiI18n.t('RME分析中').value,
    key: 'RME_ANALYZING',
  },
  {
    title: WeiI18n.t('需求分析已关闭').value,
    key: 'A_CLOSED',
  },
  {
    title: WeiI18n.t('RME已分析/待处理').value,
    key: 'RME_ANALYZED',
  },
  {
    title: WeiI18n.t('RAT待分析').value,
    key: 'RAT_NOT_ANALYZED',
  },
  {
    title: WeiI18n.t('RAT分析中').value,
    key: 'RAT_ANALYZING',
  },
  {
    title: WeiI18n.t('RAT分析完成').value,
    key: 'RAT_AC',
  },
  {
    title: WeiI18n.t('IPMT待决策').value,
    key: 'IPMT_PD',
  },
  {
    title: WeiI18n.t('IPMT已决策').value,
    key: 'IPMT_DEC',
  },
  {
    title: WeiI18n.t('升级决策已关闭').value,
    key: 'UP_CLOSED',
  },
  {
    title: WeiI18n.t('最终决策已关闭').value,
    key: 'FD_CLOSED',
  },
  {
    title: WeiI18n.t('最终决策/待分发').value,
    key: 'DISPATCH_PENDING',
  },
  {
    title: WeiI18n.t('分发中').value,
    key: 'DISTRIBUTION',
  },
  {
    title: WeiI18n.t('已分发').value,
    key: 'DISPATCHED',
  },
  {
    title: WeiI18n.t('开发中').value,
    key: 'IMPLEMENTATION_PENDING',
  },
  {
    title: WeiI18n.t('待验收').value,
    key: 'ACCEPTANCE_PENDING',
  },
  {
    title: '已关闭',
    key: 'COMPLETED',
  },
]);
// tab切换
function getTasks(task: any) {
  requestParams.taskStatus = task == '全部' ? '' : task;
  getListData();
}
// 待办可以提交
function disabledpreanalysis(row: any) {
  return row.taskStatus === getTaskStatusLabel(TaskStatus.Done);
}
// RME已分析/待处理状态可以撤回
function disabledrevoke(row: any) {
  return row.status !== TaskStatus.RME_ANALYZED;
}
function handlerevoke(row: any) {
  Modal.confirm({
    title: `确定要撤回该需求吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      if (row.version != 'A') {
        message.warning('需求版本不为A版的需求不允许撤回!');
        return;
      }
      const res = await AdminApiSystemDemand.revokeDemand({ basicId: row.basicId });
      getListData();
      message.success('撤回成功!');
    },
  });
}

// 模糊搜索系列
function serialSearch() {
  getListData();
}
function resetForm(value: string) {
  clearsearchcolumns();
  selectedColumn.value = 'demandTitle';
  getListData();
}
function clearsearchcolumns() {
  searchcolumns.value.forEach((item: any) => {
    requestParams[item.key] = '';
  });
  requestParams.status = undefined;
}

// 获取设计列表数据
async function getListData() {
  loading.value = true;
  statisticInfo();
  try {
    const res = await AdminApiSystemDemandcollect.getdemandcollectList({
      ...requestParams,
    });
    if (res.data.code == 200) {
      datasource.value = res.data.data.list || [];
      pagination.total = res.data.data.total;
      if (requestParams.taskStatus == '进行中') {
        loukcount.value = res.data.data.total;
      }
    }
  } finally {
    loading.value = false;
  }
}

async function getListData2() {
  requestParams.taskStatus = '进行中';
  try {
    const res = await AdminApiSystemDemandcollect.getdemandcollectList({
      ...requestParams,
    });
    if (res.data.code == 200) {
      loukcount.value = res.data.data.total;
    }
  } finally {
    requestParams.taskStatus = '待办';
  }
}

const NumberdemandList = ref<any>({});
// 获取设计列表数据
async function statisticInfo() {
  try {
    const res = await AdminApiSystemDemandcollect.statisticInfo({});
    if (res.data.code == 200) {
      NumberdemandList.value = res.data.data || [];
      RequirementsatheringList.value.forEach(item => {
        item.number = NumberdemandList.value[item.Key] || 0;
      });
    }
  } finally {
  }
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

async function handlepreanalysis(row: any) {
  AddUpdateVisible.value = true;
  nextTick(() => {
    RefAddUpdate.value?.handleModalAddOrUpdate(row);
  });
  if (row.status != TaskStatus.RME_ANALYZING) {
    const res = await AdminApiSystemDemandcollect.updateStatus({ basicId: row.basicId, status: TaskStatus.RME_ANALYZING });
    if (res.data.code == 200) {
      getListData();
    }
  }
}
async function handleModalDetails(row: any) {
  detailVisible.value = true;
  nextTick(() => {
    Refdemanddetail.value?.handleModaldetail(row);
  });
}
function onClose() {
  AddUpdateVisible.value = false;
}
function onClosedetail() {
  detailVisible.value = false;
}
const visible = ref<boolean>(false);
/** 图片地址 */
const previewUrl = ref<string>('');
/**
 * @description 图片怨言状态修改
 * @param value
 */
function setVisible(value: boolean): void {
  visible.value = value;
}
const ExtractImgSrc = (htmlStr: any) => {
  // 正则表达式匹配src属性（支持单引号、双引号或无引号的情况）
  const srcRegex = /<img[^>]+src=["']?([^"']*)["']?/i;
  const match = htmlStr.match(srcRegex);
  let imgSrc: string = '';
  if (match && match[1]) {
    imgSrc = match[1];
  }
  return imgSrc;
};
/**
 * @description 图片预览
 * @param row  当前行数据
 */
function handleShowImgInfo(htmlStr: any) {
  if (htmlStr) {
    previewUrl.value = htmlStr;
    setVisible(true);
  }
}
function extractTextByRegex(html: any) {
  // 正则匹配所有HTML标签并替换为空字符串
  return html.replace(/<[^>]+>/g, '').trim();
}
onMounted(() => {
  requestParams.taskStatus = '待办';
  taskIndex.value = '待办';
});
function RefreshtableData() {
  getListData();
  emit('Refreshpendingtasks');
}
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
defineExpose({ getListData, getListData2 });
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <div class="pagecontent-title">
        <i></i>
        <span>需求收集</span>
      </div>
      <div class="content-box">
        <div v-for="item in RequirementsatheringList" :key="item.key">
          <div class="content-internal-box">
            <EpcIcon :type="item.iconType" style="font-size: 50px; margin-right: 10px; color: #165dff" />
            <div class="content-internal-minbox">
              <div class="content-internal-title">{{ item.title }}</div>
              <div class="content-internal-number">
                {{ item.number }}
                <span>条</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 30px">
      <div class="pagecontent-title_botton">
        <i></i>
        <span>需求列表 </span>
      </div>
      <div class="work-wrap">
        <div class="work_nav_top">
          <a-tabs v-model:activeKe="taskIndex" @tab-click="getTasks" class="body_box">
            <a-tab-pane v-for="item in tabLabelList" :key="item.label" style="border: 0px">
              <a-form style="margin-bottom: 10px" layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
                <a-form-item>
                  <a-select v-model:value="selectedColumn" @change="clearsearchcolumns()" style="width: 100px" placeholder="请选择要搜索的列">
                    <a-select-option v-for="col in searchcolumns" :key="col.key">
                      {{ col.title }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    v-if="selectedColumn == 'status'"
                    show-search
                    :filter-option="filterOption"
                    v-model:value="requestParams[selectedColumn]"
                    style="width: 220px"
                    placeholder="请选择需求状态">
                    <a-select-option v-for="col in statuscolumns" :key="col.key" :label="col.title">
                      {{ col.title }}
                    </a-select-option>
                  </a-select>
                  <a-input v-else v-model:value="requestParams[selectedColumn]" style="width: 220px" placeholder="请输入关键字搜索" allowClear />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="serialSearch">
                    <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                    {{ $t('查询') }}
                  </a-button>
                </a-form-item>
                <a-form-item>
                  <a-button @click="resetForm">
                    <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
                    {{ $t('重置') }}
                  </a-button>
                </a-form-item>
              </a-form>
              <template #tab>
                {{ item.label }}
                <a-badge
                  v-if="item.id == 1"
                  style="position: absolute; left: 22px; top: -2px; z-index: 10px; display: flex; justify-content: center"
                  :count="todocount"
                  :overflow-count="99">
                </a-badge>
                <a-badge
                  v-if="item.id == 2"
                  style="position: absolute; left: 28px; top: -2px; z-index: 10px; display: flex; justify-content: center"
                  :count="loukcount"
                  :overflow-count="99">
                </a-badge>
              </template>
              <a-table
                :scroll="{ x: 1200, y: tableHeight }"
                row-key="id"
                :columns="columns"
                :data-source="datasource"
                :locale="locale"
                :pagination="pagination"
                @resizeColumn="handleResizeColumn"
                :loading="loading"
                :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'demandNum'">
                    <a-tooltip>
                      <template #title>{{ '变更中' }}</template>
                      <EpcIcon v-if="record.changingFlag" type="icon-biangengzhong" style="font-size: 15px; cursor: 'pointer'; color: #3d7cff" />
                    </a-tooltip>
                    <span v-if="!record.changingFlag" style="width: 15px; display: inline-block"></span>
                    <span>{{ record.demandNum }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'demandRemarks'">
                    <div style="display: flex">
                      <div>{{ extractTextByRegex(record.demandRemarks) }}</div>
                      <EpcIcon
                        @click="handleShowImgInfo(ExtractImgSrc(record.demandRemarks || ''))"
                        v-if="ExtractImgSrc(record.demandRemarks || '')"
                        type="icon-tupian1"
                        style="font-size: 18px; cursor: 'pointer'; margin-left: 5px" />
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'taskStatus'">
                    <span :style="getStatusStyle(record.taskStatus)">{{ record.taskStatus }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'status'">
                    <span :style="getStatusStyle(record.status)">{{ getTaskStatusLabel(record.status) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledpreanalysis(record)" @click="handlepreanalysis(record)">预分析</a-button>
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledrevoke(record)" @click="handlerevoke(record)">撤回</a-button>
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" @click="handleModalDetails(record)">详情</a-button>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-card>
  </div>
  <DemandAddUpdate :modalVisible="AddUpdateVisible" ref="RefAddUpdate" @onClose="onClose" @RefreshtableData="RefreshtableData" />
  <demanddetail :modalVisible="detailVisible" ref="Refdemanddetail" @onClose="onClosedetail" />
  <a-image
    :width="200"
    :style="{ display: 'none' }"
    :preview="{
      visible,
      onVisibleChange: setVisible,
    }"
    :src="previewUrl" />
</template>

<style lang="less" scoped>
@import '../../../../assets/css/demandHome/demandHome.less';
</style>
