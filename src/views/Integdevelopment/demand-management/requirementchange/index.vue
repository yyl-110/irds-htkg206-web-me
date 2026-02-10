<script setup lang="ts">
// 需求变更
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { ProdDemandchangeRequestDTOModel } from '@/api/models/demand/ProdDemandchangeRequestDTOModel';
import { AdminApiSystemchange } from '@/api/tags/demand/管理需求变更';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import changecomponent from './components/form/index.vue';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { ChangeType, getDistributionteamLabel } from '@/enums/ChangeType';
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
const changecomponentVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const datasource = ref([]);
const tableHeight = ref(window.innerHeight - 450);
const changecomponentRef = ref<any>();
/** 列表请求参数 */
const requestParams = reactive<any>(new ProdDemandchangeRequestDTOModel());
requestParams.taskStatus = '';
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const tabLabelList = reactive([
  {
    label: '待办',
    id: 1,
  },
  {
    label: '已办',
    id: 2,
  },
  {
    label: '全部',
    id: 3,
  },
]);
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
    title: WeiI18n.$t('需求标题'),
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
    width: 130,
  },
  {
    title: WeiI18n.$t('变更类型'),
    dataIndex: 'changeType',
    key: 'changeType',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.changeType, b.changeType),
    width: 130,
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
    title: WeiI18n.$t('变更结论'),
    dataIndex: 'changeConclusion',
    key: 'changeConclusion',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.changeConclusion, b.changeConclusion),
    width: 130,
  },
  {
    title: WeiI18n.$t('提交时间'),
    dataIndex: 'submitTime',
    key: 'submitTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.submitTime, b.submitTime),
    width: 200,
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
    width: 130,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 150,
    fixed: 'right',
  },
]);
const RequirementsatheringList = ref([
  {
    key: '1',
    title: WeiI18n.t('全部变更').value,
    number: '',
    iconType: 'icon-quanbuxuqiu',
    Key: 'allCount',
  },
  {
    key: '2',
    title: WeiI18n.t('原始变更').value,
    number: '',
    iconType: 'icon-biangeng',
    Key: 'originalCount',
  },
  {
    key: '3',
    title: WeiI18n.t('初始变更').value,
    number: '',
    iconType: 'icon-biangeng1',
    Key: 'initCount',
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
    width: 240,
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
  // {
  //   title: WeiI18n.$t('需求状态'),
  //   dataIndex: 'status',
  //   key: 'status',
  //   align: 'center',
  //   resizable: true,
  //   sorter: (a: any, b: any) => sortermethod(a.taskStatus, b.taskStatus),
  //   width: 120,
  // },
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
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
// 多选点击行选择
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.basicId;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}
// tab切换
function getTasks(task: any) {
  requestParams.taskStatus = task == '全部' ? '' : task;
  getListData();
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
// 已办不可以变更分析
function disabledacceptance(row: any) {
  if (row.taskStatus !== '已办') {
    return false;
  } else {
    return true;
  }
}

// 获取设计列表数据
async function getListData() {
  loading.value = true;
  statisticInfo();
  try {
    const res = await AdminApiSystemchange.getdemandchangeList({
      ...requestParams,
    });
    if (res.data.code == 200) {
      datasource.value = res.data.data.list || [];
      pagination.total = res.data.data.total;
    }
  } finally {
    loading.value = false;
  }
}
const NumberdemandList = ref<any>({});
// 获取设计列表数据
async function statisticInfo() {
  try {
    const res = await AdminApiSystemchange.getchangesticInfo({});
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
function handleChangeAnalysis(row: any, type: string) {
  changecomponentVisible.value = true;
  nextTick(() => {
    changecomponentRef.value.handleModalChange(row, type);
  });
}

function periodicAttributemedth(periodicAttribute: any) {
  let str = '';
  if (periodicAttribute == 1) {
    str = '小于1年';
  } else if (periodicAttribute == 2) {
    str = '1-3年';
  } else if (periodicAttribute == 3) {
    str = '大于3年';
  }
  return str;
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
defineExpose({ getListData });
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <div class="pagecontent-title">
        <i></i>
        <span>需求变更分析</span>
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
        <span>需求列表</span>
      </div>
      <div class="work-wrap">
        <div class="work_nav_top">
          <a-tabs v-model:activeKey="taskIndex" @tab-click="getTasks" class="body_box">
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
                  <a-select v-if="selectedColumn == 'status'" show-search v-model:value="requestParams[selectedColumn]" style="width: 220px" placeholder="请选择需求状态">
                    <a-select-option v-for="col in statuscolumns" :key="col.key">
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
              </template>
              <a-table
                :scroll="{ x: 1200, y: tableHeight }"
                row-key="basicId"
                :columns="columns"
                :data-source="datasource"
                :locale="locale"
                :pagination="pagination"
                @resizeColumn="handleResizeColumn"
                :loading="loading"
                :row-selection="rowSelection"
                :customRow="customRow"
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
                  <template v-if="column.dataIndex === 'periodicAttribute'">
                    <span>{{ periodicAttributemedth(record.periodicAttribute) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'taskStatus'">
                    <span :style="getStatusStyle(record.taskStatus)">{{ record.taskStatus }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'status'">
                    <span :style="getStatusStyle(record.status)">{{ getTaskStatusLabel(record.status) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'changeType'">
                    <span :style="getStatusStyle(record.changeType)">{{ getDistributionteamLabel(record.changeType) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <a-button shape="circle" :disabled="Isiteditable(record) || disabledacceptance(record)" @click="handleChangeAnalysis(record, 'edit')" type="link"
                      >变更分析</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" @click="handleChangeAnalysis(record, 'detail')">详情</a-button>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-card>
  </div>
  <changecomponent :modalVisible="changecomponentVisible" ref="changecomponentRef" @onClose="changecomponentVisible = false" @RefreshtableData="RefreshtableData" />
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
