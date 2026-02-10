<script setup lang="ts">
// 需求实现
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { ProdDemandplementationRequestDTOModel } from '@/api/models/demand/ProdDemandplementationRequestDTOModel';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import Requirementimplementation from './components/form/Requirementimplementation.vue';
import Changerequest from './components/form/Changerequest.vue';
import SupportingDocuments from './components/form/SupportingDocuments.vue';
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
const loukcount = ref<any>('');
const SupportingDocumentsVisible = ref<boolean>(false);
const RequirementimplementationVisible = ref<boolean>(false);
const ChangerequestVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const datasource = ref([]);
const tableHeight = ref(window.innerHeight - 450);
const SupportingDocumentsRef = ref<any>();
const RequirementimplementationRef = ref<any>();
const ChangerequestRef = ref<any>();
/** 列表请求参数 */
const requestParams = reactive<any>(new ProdDemandplementationRequestDTOModel());
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
    title: WeiI18n.$t('初始需求标题'),
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
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.conclusion, b.conclusion),
    width: 140,
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
    title: WeiI18n.$t('验收结论'),
    dataIndex: 'acceptConclusion',
    key: 'acceptConclusion',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acceptConclusion, b.acceptConclusion),
    width: 200,
  },
  {
    title: WeiI18n.$t('原因说明'),
    dataIndex: 'acceptReasons',
    key: 'acceptReasons',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acceptReasons, b.acceptReasons),
    width: 200,
  },
  {
    title: WeiI18n.$t('需求实现周期'),
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
    width: 130,
  },
  {
    title: WeiI18n.$t('分发时间'),
    dataIndex: 'allocateTime',
    key: 'allocateTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateTime, b.allocateTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('材料上传时间'),
    dataIndex: 'materialUploadTime',
    key: 'materialUploadTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.materialUploadTime, b.materialUploadTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('发起验收时间'),
    dataIndex: 'initiateAcceptTime',
    key: 'initiateAcceptTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiateAcceptTime, b.initiateAcceptTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('完成验收时间'),
    dataIndex: 'acceptTime',
    key: 'acceptTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acceptTime, b.acceptTime),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 365,
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
    title: WeiI18n.t('开发中').value,
    number: '',
    iconType: 'icon-kaifazhong',
    Key: 'inDevCount',
  },
  {
    key: '3',
    title: WeiI18n.t('待验收').value,
    number: '',
    iconType: 'icon-daiyanshou1',
    Key: 'pendingAcceptCount',
  },
  {
    key: '4',
    title: WeiI18n.t('已完成').value,
    number: '',
    iconType: 'icon-yiwancheng',
    Key: 'doneCount',
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
// 已分发可以确认
function disabledibution(row: any) {
  if (row.status === TaskStatus.DISPATCHED) {
    return false;
  } else {
    return true;
  }
}
// 已分发和开发中可以变更
function disabledchange(row: any) {
  if (row.status === TaskStatus.DISPATCHED || row.status === TaskStatus.IMPLEMENTATION_PENDING) {
    return false;
  } else {
    return true;
  }
}

// 开发中且判断没有上传过证明材料 可以上传证明材料
function disabledUpload(row: any) {
  if (row.status === TaskStatus.IMPLEMENTATION_PENDING && (row.materialUploadTime == '' || row.materialUploadTime == null || row.materialUploadTime == undefined)) {
    return false;
  } else {
    return true;
  }
}
// 开发中可以发起需求验收
function disablediateAcceptance(row: any) {
  if (row.status === TaskStatus.IMPLEMENTATION_PENDING && row.materialUploadTime) {
    return false;
  } else {
    return true;
  }
}

// 待验收可以撤回
function disabledIrevoke(row: any) {
  if (row.status === TaskStatus.ACCEPTANCE_PENDING) {
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
    const res = await AdminApiSystemplementation.getdemandtaskList({
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
    const res = await AdminApiSystemplementation.getdemandtaskList({
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
    const res = await AdminApiSystemplementation.getplementationstatisticInfo({});
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
function confirm(row: any) {
  RequirementimplementationVisible.value = true;
  nextTick(() => {
    RequirementimplementationRef.value.handleModaldetail(row);
  });
}
function change(row: any) {
  ChangerequestVisible.value = true;
  nextTick(() => {
    ChangerequestRef.value.handleModalAddOrUpdate(row);
  });
}
function handleUploadProofMaterials(row: any) {
  SupportingDocumentsVisible.value = true;
  nextTick(() => {
    SupportingDocumentsRef.value.handleModalSupportingDocument(row);
  });
}

function InitiateAcceptance(row: any) {
  Modal.confirm({
    title: `确定要发起需求验收吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemplementation.updateStatus({
        taskId: row.taskId,
        status: TaskStatus.ACCEPTANCE_PENDING,
      });
      if (res.data.code == 200) {
        getListData();
        message.success('操作成功');
      }
    },
  });
}

async function revoke(row: any) {
  Modal.confirm({
    title: `确定要撤回此数据吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemplementation.retract({
        basicId: row.basicId,
        taskId: row.taskId,
      });
      if (res.data.code == 200) {
        getListData();
        message.success('操作成功');
      }
    },
  });
}
function BatchAcceptance() {
  if (selectedRowList.value.length == 0) {
    message.error('请勾选要发起验收的需求');
    return;
  }
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
        <span>需求实现</span>
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
                  <template v-if="column.dataIndex === 'acceptConclusion'">
                    <a-tooltip>
                      <template #title>{{ record.acceptConclusion }}</template>
                      <span class="single-line">{{ record.acceptConclusion }}</span>
                    </a-tooltip>
                  </template>
                  <template v-if="column.dataIndex === 'acceptReasons'">
                    <a-tooltip>
                      <template #title>{{ record.acceptReasons }}</template>
                      <span class="single-line">{{ record.acceptReasons }}</span>
                    </a-tooltip>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <a-button shape="circle" :disabled="Isiteditable(record) || disabledibution(record)" @click="confirm(record)" type="link">确定</a-button>
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledchange(record)" @click="change(record)">变更</a-button>
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledUpload(record)" @click="handleUploadProofMaterials(record)"
                      >上传证明材料</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disablediateAcceptance(record)" @click="InitiateAcceptance(record)"
                      >发起需求验收</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledIrevoke(record)" @click="revoke(record)">撤回</a-button>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-card>
  </div>
  <Requirementimplementation
    :modalVisible="RequirementimplementationVisible"
    ref="RequirementimplementationRef"
    @onClose="RequirementimplementationVisible = false"
    @RefreshtableData="RefreshtableData" />
  <Changerequest :modalVisible="ChangerequestVisible" ref="ChangerequestRef" @onClose="ChangerequestVisible = false" @RefreshtableData="getListData" />
  <SupportingDocuments :modalVisible="SupportingDocumentsVisible" ref="SupportingDocumentsRef" @onClose="SupportingDocumentsVisible = false" @RefreshtableData="getListData" />
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
.single-line {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  width: 200px; /* 需指定宽度（或父元素有宽度） */
}
</style>
