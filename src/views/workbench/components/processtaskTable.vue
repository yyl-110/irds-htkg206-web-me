<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { TableColumnType, TableProps, Modal, Button, Input, Select, DatePicker } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { processTaskPage } from '@/api/models/processTask/processTaskPage';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import MemberAuthModal from '@/components/MemberAuthModal/index.vue'; // 引入封装组件
import DecisionAnalysis from './form/DecisionAnalysis.vue';
import productPlanTask from './form/productPlanTask.vue';
import productPlanReview from './form/productPlanReview.vue';
import demandScoringpopup from './form/demandScoringpop-up.vue';
import Productcombinationsorting from './form/Productcombinationsorting.vue';
import ProductScoringPopUp from './form/ProductScoringPop-up.vue';
import { getStatusStyle } from '@/style/StatusStyle';
import { sortermethod } from '@/utils/tools';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
const router = useRouter();
const userStore = useUserStore();
const props = defineProps({
  tsakType: {
    require: true,
    type: String,
    default: () => '1',
  },
});
const operationWidthType = ref('');
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation3-width');
  return Number(width);
});
const loading = ref<boolean>(false);
const DecisionAnalysisRef = ref<any>();
const DecisionModal = ref<boolean>(false);
const productPlanModal = ref<boolean>(false);
const productPlanTaskRef = ref<any>();
const productPlanReviewRef = ref<any>();
const productPlanReviewModal = ref<boolean>(false);
const ScoringModal = ref<boolean>(false);
const ScoringpopupRef = ref<any>();
const ProductcombinationsortingModal = ref<boolean>(false);
const ProductcombinationsortingRef = ref<any>();
const ProductScoringPopUpModal = ref<boolean>(false);
const ProductScoringPopUpRef = ref<any>();
// 表格数据 - 模拟数据
const tableData = ref([]);
const basicId = ref('');
/** 列表请求参数 */
const requestParams = reactive(new processTaskPage());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});

function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
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
// 表格列定义
const columns = ref<TableColumnType[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
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
    title: '流程编号',
    dataIndex: 'num',
    key: 'num',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.num, b.num),
    width: 150,
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    width: 280,
  },
  {
    title: '流程状态',
    dataIndex: 'processStatus',
    key: 'processStatus',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.processStatus, b.processStatus),
    width: 100,
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.approvalStatus, b.approvalStatus),
    width: 100,
  },
  {
    title: '流程发起人',
    dataIndex: 'initiationNickname',
    key: 'initiationNickname',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiationNickname, b.initiationNickname),
    width: 100,
  },
  {
    title: '流程接收人',
    dataIndex: 'receiveUserNickname',
    key: 'receiveUserNickname',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.receiveUserNickname, b.receiveUserNickname),
    width: 100,
  },

  {
    title: '流程发起时间',
    dataIndex: 'initiationTime',
    key: 'initiationTime',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiationTime, b.initiationTime),
    width: 170,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: operationWidthType.value == '1' ? 100 : operationWidth.value,
    fixed: 'right',
  },
]);

// 处理函数
async function handleSearch() {
  getListData();
}
async function restSeach() {
  requestParams.name = '';
  getListData();
}
async function getListData() {
  try {
    loading.value = true;
    requestParams.pageType = props.tsakType;
    operationWidthType.value = props.tsakType;
    const res = await AdminApiSystemProcessTask.getProcessTaskList(requestParams);
    tableData.value = res.data.data.list || [];
    pagination.total = res.data.data.total;
  } catch (error) {
    console.log(error, 'error');
  } finally {
    loading.value = false;
  }
}
async function selectTaskInfo() {
  await getListData();
}
const requirementData = ref<any>([]);
const productType = ref<any>('');
async function InitiateDecisionAnalysis(record: any, type: string) {
  productType.value = record.type;
  if (record.type == '产品规划发起清单评审') {
    if (record.approvalStatus != '已驳回') {
      productPlanModal.value = true;
      nextTick(() => {
        productPlanTaskRef.value.ViewDetails(record, type);
      });
    } else {
      if (type == 'detail') {
        productPlanModal.value = true;
        nextTick(() => {
          productPlanTaskRef.value.ViewDetails(record, type);
        });
      } else {
        productPlanTaskRef.value.ViewDetailsTask(record, type);
      }
    }
  } else if (record.type == '产品规划清单评审') {
    productPlanReviewModal.value = true;
    nextTick(() => {
      productPlanReviewRef.value.ViewDetails(record, type);
    });
  } else if (record.type == '决策分析') {
    DecisionModal.value = true;
    basicId.value = record.basicId;
    nextTick(() => {
      DecisionAnalysisRef.value.ViewDetails(record, type);
    });
    const res = await AdminApiSystemDemandcollect.getInitDemandDetail({ basicId: record.basicId });
    let data: any = res.data;
    if (data.code == 200) {
      requirementData.value[0] = data.data;
    }
  } else if (record.type == '产品规划发起打分') {
    ProductcombinationsortingModal.value = true;
    nextTick(() => {
      ProductcombinationsortingRef.value.ViewDetails(record, type);
    });
  } else if (record.type.includes('产品规划排序打分')) {
    // 产品规划 研发和市场和财务
    ProductScoringPopUpModal.value = true;
    nextTick(() => {
      ProductScoringPopUpRef.value.handleModalChange(record, type);
    });
  } else {
    // 需求打分 研发和市场分
    ScoringModal.value = true;
    basicId.value = record.basicId;
    nextTick(() => {
      ScoringpopupRef.value.ViewDetails(record, type);
    });
  }
}

async function fuallTask(record: any, type: string) {
  if (record.type == '产品规划发起清单评审') {
    nextTick(() => {
      productPlanTaskRef.value.ViewDetailsTask(record, type);
    });
  }
}

const rolelabel = ref('');
const targetKeys = ref<any>([]);
const grpuVisible = ref<boolean>(false);
const commonData = ref<any>([]);
const roleData = ref<any>([]);
const groupData = ref<any>([]);
// 浏览用户方法
const browseUser = async (role: any) => {
  try {
    rolelabel.value = role.label;
    targetKeys.value = [];
    const data = {
      roleName: role.label,
    };
    const res = await AdminApiSystemProductSpecification.getPositionUserList(data);
    const resB = await AdminApiSystemUser.getSimpleUsers({});
    roleData.value = res.data.data || [];
    groupData.value = resB.data.data || [];
    const groupIds = new Set(groupData.value.map((item: any) => item.id));
    commonData.value = roleData.value.filter((roleItem: any) => groupIds.has(roleItem.id));
    if (role.id != null && role.id != undefined && role.id != '') {
      targetKeys.value.push(role.id);
    } else {
      targetKeys.value = [];
    }
    grpuVisible.value = true;
  } catch (error) {
    console.log(error, 'error');
  }
};

function handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
  targetKeys.value = nextTargetKeys;
}
async function handleModalConfirm() {
  const selectedUser = commonData.value.find((item: any) => item.id === targetKeys.value[0]);
  if (selectedUser) {
  }
  grpuVisible.value = false;
}
function handleClose() {
  grpuVisible.value = false;
}

function close() {
  DecisionModal.value = false;
  ScoringModal.value = false;
  productPlanModal.value = false;
  productPlanReviewModal.value = false;
  ProductcombinationsortingModal.value = false;
  ProductScoringPopUpModal.value = false;
}
// 已办的流程不允许发起决策分析
function disabledlaunch(row: any) {
  return row.processStatus === getTaskStatusLabel(TaskStatus.Done);
}
// 接送人是当前用户可以打分，否则不能打分
function userIdflag(row: any) {
  if (row.receiveUserId == userStore.getUser.id) {
    return false;
  } else {
    return true;
  }
}
defineExpose({ selectTaskInfo });
</script>

<template>
  <div>
    <div>
      <a-input v-model:value="requestParams.name" allowClear placeholder="请输入流程名称" style="width: 220px; margin-right: 10px" />
      <a-button type="primary" @click="handleSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }}</a-button>
      <a-button style="margin-left: 10px" @click="restSeach">
        <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
        重置
      </a-button>
    </div>
    <div class="task-table-container">
      <a-table
        :scroll="{ x: 'max-content' }"
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :locale="locale"
        :loading="loading"
        @resizeColumn="handleResizeColumn"
        :customRow="customRow"
        :pagination="pagination"
        class="task-table"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'processStatus'">
            <span :style="getStatusStyle(record.processStatus)">{{ record.processStatus }}</span>
          </template>
          <template v-if="column.dataIndex === 'approvalStatus'">
            <span v-if="record.approvalStatus != null && record.approvalStatus != 'null' && record.approvalStatus != ''" :style="getStatusStyle(record.approvalStatus)">{{
              record.approvalStatus
            }}</span>
            <span v-else>\</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 我发起的 -->
            <div v-if="tsakType == '1'">
              <!-- <span v-if="record.type == '产品规划发起清单评审'">
                <a-button
                  v-if="record.approvalStatus != '驳回'"
                  shape="circle"
                  type="link"
                  :disabled="userIdflag(record) || disabledlaunch(record)"
                  @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起评审</a-button
                >
                <a-button v-else shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="fuallTask(record, 'launch')">重新发起</a-button>
              </span>
              <span v-else-if="record.type == '决策分析'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起决策分析</a-button
                >
              </span>
              <span v-else-if="record.type == '产品规划发起打分'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起排序</a-button
                >
              </span>
              产品规划 研发和市场和财务
              <span v-else-if="record.type.includes('产品规划排序打分')">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <span v-else>
                需求打分 研发和市场
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <a-divider type="vertical" /> -->
              <a-button shape="circle" type="link" @click="InitiateDecisionAnalysis(record, 'detail')">详情</a-button>
            </div>
            <!-- 我处理的 -->
            <div v-else-if="tsakType == '2'">
              <span v-if="record.type == '产品规划清单评审'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')">审批</a-button>
              </span>
              <span v-else-if="record.type == '决策分析'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起决策分析</a-button
                >
              </span>
              <span v-else-if="record.type == '产品规划发起打分'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起排序</a-button
                >
              </span>
              <!-- 产品规划 研发和市场和财务 -->
              <span v-else-if="record.type.includes('产品规划排序打分')">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <span v-else-if="record.type.includes('产品规划发起清单评审')">
                <a-button
                  v-if="record.approvalStatus != '已驳回'"
                  shape="circle"
                  type="link"
                  :disabled="userIdflag(record) || disabledlaunch(record)"
                  @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起评审</a-button
                ><a-button v-else shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >重新发起</a-button
                >
              </span>
              <span v-else>
                <!-- 需求打分 研发和市场 -->
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" @click="InitiateDecisionAnalysis(record, 'detail')">详情</a-button>
            </div>
            <!-- 全部 -->
            <div v-else-if="tsakType == '3'">
              <span v-if="record.type == '产品规划清单评审'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')">审批</a-button>
              </span>
              <span v-else-if="record.type == '产品规划发起清单评审'">
                <a-button
                  v-if="record.approvalStatus != '已驳回'"
                  shape="circle"
                  type="link"
                  :disabled="userIdflag(record) || disabledlaunch(record)"
                  @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起评审</a-button
                >
                <a-button v-else shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="fuallTask(record, 'launch')">重新发起</a-button>
              </span>
              <span v-else-if="record.type == '决策分析'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起决策分析</a-button
                >
              </span>
              <span v-else-if="record.type == '产品规划发起打分'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起排序</a-button
                >
              </span>
              <!-- 产品规划 研发和市场和财务 -->
              <span v-else-if="record.type.includes('产品规划排序打分')">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <span v-else>
                <!-- 需求打分 研发和市场 -->
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" @click="InitiateDecisionAnalysis(record, 'detail')">详情</a-button>
            </div>
            <!-- 我的待办 -->
            <div v-else>
              <span v-if="record.type == '产品规划清单评审'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')">审批</a-button>
              </span>
              <span v-else-if="record.type == '决策分析'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起决策分析</a-button
                >
              </span>
              <span v-else-if="record.type == '产品规划发起打分'">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起排序</a-button
                >
              </span>
              <span v-else-if="record.type == '产品规划发起清单评审'">
                <a-button
                  v-if="record.approvalStatus != '已驳回'"
                  shape="circle"
                  type="link"
                  :disabled="userIdflag(record) || disabledlaunch(record)"
                  @click="InitiateDecisionAnalysis(record, 'launch')"
                  >发起评审</a-button
                >
                <a-button v-else shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="fuallTask(record, 'launch')">重新发起</a-button>
              </span>
              <!-- 产品规划 研发和市场和财务 -->
              <span v-else-if="record.type.includes('产品规划排序打分')">
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <span v-else>
                <!-- 需求打分 研发和市场 -->
                <a-button shape="circle" type="link" :disabled="userIdflag(record) || disabledlaunch(record)" @click="InitiateDecisionAnalysis(record, 'launch')"
                  >开始打分</a-button
                >
              </span>
              <a-divider type="vertical" />
              <a-button shape="circle" type="link" @click="InitiateDecisionAnalysis(record, 'detail')">详情</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!-- 决策分析流程 -->
  <DecisionAnalysis
    ref="DecisionAnalysisRef"
    :basicId="basicId"
    :modalVisible="DecisionModal"
    :tableData="requirementData"
    @browseUser="browseUser"
    @refreshTableData="getListData"
    @close="close"></DecisionAnalysis>
  <!-- 产品规划组合清单流程 -->
  <productPlanTask ref="productPlanTaskRef" :modalVisible="productPlanModal" @browseUser="browseUser" @refreshTableData="getListData" @close="close"></productPlanTask>
  <!-- 产品组合清单评审 -->
  <productPlanReview ref="productPlanReviewRef" :modalVisible="productPlanReviewModal" @browseUser="browseUser" @refreshTableData="getListData" @close="close"></productPlanReview>
  <!-- 决策分析打分-->
  <demandScoringpopup
    ref="ScoringpopupRef"
    :basicId="basicId"
    :modalVisible="ScoringModal"
    @browseUser="browseUser"
    @refreshTableData="getListData"
    @close="close"></demandScoringpopup>
  <!-- 发起排序打分流程 -->
  <Productcombinationsorting
    ref="ProductcombinationsortingRef"
    :modalVisible="ProductcombinationsortingModal"
    @browseUser="browseUser"
    @refreshTableData="getListData"
    @close="close"></Productcombinationsorting>
  <!-- 打分列表 -->
  <ProductScoringPopUp
    ref="ProductScoringPopUpRef"
    :modalVisible="ProductScoringPopUpModal"
    @browseUser="browseUser"
    @refreshTableData="getListData"
    @close="close"></ProductScoringPopUp>
  <MemberAuthModal
    modalWidth="60%"
    v-model:modalVisible="grpuVisible"
    :data-source="commonData"
    v-model:target-keys="targetKeys"
    :Singlechoice="true"
    @confirm="handleModalConfirm"
    @change="handleChange"
    @Cancel="handleClose" />
</template>

<style lang="less" scoped>
.task-table-container {
  flex: 1;
  height: calc(100vh - 420px);
  overflow: auto;
  margin-top: 20px;
  .task-table {
    .ant-table-thead > tr > th {
      background-color: #0066cc;
      color: white;
      font-weight: bold;
      border: 1px solid #ddd;
    }

    .ant-table-tbody > tr > td {
      border: 1px solid #ddd;
      padding: 10px;
    }

    .ant-table-tbody > tr:hover > td {
      background-color: #f5f5f5;
    }

    // 阶段行样式
    .ant-table-tbody > tr:not(.ant-table-row-expand-icon-cell) > td {
      &:first-child {
        font-weight: bold;
      }
    }
  }
}

// 任务项样式
.task-item {
  display: flex;
  align-items: center;
  padding: 4px 0;

  .task-icon {
    margin-right: 8px;
    font-size: 16px;
  }
}

// 滚动条样式优化
.task-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.task-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.task-table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.task-table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
