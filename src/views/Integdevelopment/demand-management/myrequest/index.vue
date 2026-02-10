<script setup lang="ts">
// 我的需求
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { ProdDemandRequestDTOModel } from '@/api/models/demand/ProdDemandRequestDTOModel';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import DemandAddUpdate from './components/form/demand-add-update.vue';
import change from './components/form/change.vue';
import demanddetail from './components/detail/index.vue';
import { notification } from 'ant-design-vue';
import { SmileOutlined } from '@ant-design/icons-vue';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { getStatusStyle } from '@/style/StatusStyle';
import { Isiteditable } from '@/utils/Requirementtablejudgment';
const router = useRoute();
const userStore = useUserStore();
const selectedColumn = ref('demandTitle'); // 选择要搜索的列
const ChangeVisible = ref<boolean>(false);
const AddUpdateVisible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const tableHeight = ref(window.innerHeight - 370);
const datasource = ref([]); // 系列设计列表数据
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation6-width');
  return Number(width);
});
const RefAddUpdate = ref();
const RefChange = ref();
const Refdemanddetail = ref();
/** 列表请求参数 */
const requestParams = reactive<any>(new ProdDemandRequestDTOModel());
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

/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '120px', marginTop: '50px' },
  }),
});
const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 50,
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
    width: 80,
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
    title: WeiI18n.$t('任务状态'),
    dataIndex: 'taskStatus',
    key: 'taskStatus',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskStatus, b.taskStatus),
    width: 120,
  },
  {
    title: WeiI18n.$t('需求分析结论'),
    dataIndex: 'conclusion',
    key: 'conclusion',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.conclusion, b.conclusion),
    width: 150,
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
    width: 150,
  },
  {
    title: WeiI18n.$t('驳回时间'),
    dataIndex: 'rejectTime',
    key: 'rejectTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.rejectTime, b.rejectTime),
    width: 150,
  },
  {
    title: WeiI18n.$t('期望反馈时间'),
    dataIndex: 'feedbackTime',
    key: 'feedbackTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.feedbackTime, b.feedbackTime),
    width: 150,
  },
  {
    title: WeiI18n.$t('实际反馈时间'),
    dataIndex: 'allocateTime',
    key: 'allocateTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateTime, b.allocateTime),
    width: 150,
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
    width: 100,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 130,
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
// 待提交状态可以提交
function disabledsubmit(row: any) {
  return row.taskStatus !== getTaskStatusLabel(TaskStatus.TO_BE_SUBMITTED);
}

// 待RME分析状态可以撤回
function disabledreject(row: any) {
  return row.status !== TaskStatus.RME_AP;
}
// 已提交状态不可以编辑
function disablededit(row: any) {
  return row.taskStatus === getTaskStatusLabel(TaskStatus.SUBMITTED);
}
// 只有草稿状态可以删除
function disableddelete(row: any) {
  return row.status !== TaskStatus.DRAFT;
}

// 除草稿状态和已关闭外可以变更
function disabledchange(row: any) {
  if (row.status === TaskStatus.DRAFT || row.status === TaskStatus.COMPLETED) {
    return true;
  } else {
    return false;
  }
}
// 草稿状态可以复制
function disabledcopy(row: any) {
  if (row.status === TaskStatus.DRAFT) {
    return false;
  } else {
    return true;
  }
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
  try {
    const res = await AdminApiSystemDemand.getdemandList({
      ...requestParams,
    });
    datasource.value = res.data.data.list || [];
    pagination.total = res.data.data.total;
  } finally {
    loading.value = false;
  }
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

function handleAdddemand(row: any) {
  AddUpdateVisible.value = true;
  nextTick(() => {
    RefAddUpdate.value?.handleModalAddOrUpdate(row);
  });
}
function handleSubmit(row: any) {
  AddUpdateVisible.value = true;
  nextTick(() => {
    RefAddUpdate.value?.handleModalAddOrUpdate(row, '原始需求');
  });
}
function Change(row: any) {
  ChangeVisible.value = true;
  nextTick(() => {
    RefChange.value?.handleModalChange(row, '变更需求');
  });
}
function copy(row: any) {
  Modal.confirm({
    title: `确定要复制该需求吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemDemand.copyOriginalDemand({
        originalId: row.originalId,
      });
      getListData();
      message.success('复制成功!');
    },
  });
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
      const res = await AdminApiSystemDemand.revokeDemand({
        basicId: row.basicId,
      });
      getListData();
      message.success('撤回成功!');
    },
  });
}

function handleModalDetails(row: any) {
  detailVisible.value = true;
  nextTick(() => {
    Refdemanddetail.value?.handleModalDetails(row);
  });
}

//删除当前需求
function delDemandClick(row: any) {
  Modal.confirm({
    title: `确定要删除该需求吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemDemand.Deletedemand({
        id: row.originalId,
      });
      getListData();
      message.success('删除成功!');
    },
  });
}
function initnotification() {
  notification.open({
    message: 'Hello!',
    description: '尊敬的贡献者，感谢您为产品发展提出的宝贵需求与建议，您的每一个想法都是我们持续优化和创新的重要源泉。我们会认真评估，期待与您共同打造更卓越的产品!',
    duration: 5,
    icon: () => h(SmileOutlined, { style: 'color: #407fff' }),
    onClick: () => {},
  });
  getListData();
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
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
defineExpose({ initnotification });
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <div class="pagecontent-title">
        <i></i>
        <span>需求列表</span>
      </div>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
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
        <a-form-item>
          <a-button type="primary" @click="handleAdddemand(undefined)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('新建需求') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
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
            <div>
              <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledsubmit(record)" @click="handleSubmit(record)">提交</a-button>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledreject(record)" @click="handlerevoke(record)">撤回</a-button>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disablededit(record)" @click="handleAdddemand(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button
                shape="circle"
                type="link"
                :disabled="Isiteditable(record) || disableddelete(record)"
                :style="{
                  color: record.taskStatus === getTaskStatusLabel(TaskStatus.SUBMITTED) ? '' : 'red',
                }"
                @click.stop="delDemandClick(record)"
                >删除</a-button
              >
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" :disabled="Isiteditable(record) || disabledchange(record)" @click="Change(record)">变更</a-button>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" :disabled="Isiteditable(record)" @click="copy(record)">需求复制</a-button>
              <a-divider type="vertical" />
              <a-button shape="circle" :disabled="record.status == TaskStatus.DRAFT" type="link" @click="handleModalDetails(record)">详情</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <DemandAddUpdate :modalVisible="AddUpdateVisible" ref="RefAddUpdate" @onClose="AddUpdateVisible = false" @RefreshtableData="getListData" />
  <change :modalVisible="ChangeVisible" ref="RefChange" @onClose="ChangeVisible = false" @RefreshtableData="getListData" />
  <demanddetail :modalVisible="detailVisible" ref="Refdemanddetail" @onClose="detailVisible = false" />
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
.drawerContent {
  background-color: #ffffff !important;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
