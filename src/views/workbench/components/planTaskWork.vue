<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { TableColumnType, TableProps, Modal, Button, Input, Select, DatePicker, Descriptions, DescriptionsItem } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { WeiI18n } from '@/utils/WeiI18n';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { productSpecificationPage } from '@/api/models/productSpecification/productSpecificationPage';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { encryptValue } from '@/utils';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import MemberAuthModal from '@/components/MemberAuthModal/index.vue'; // 引入封装组件
import { getStatusStyle } from '@/style/StatusStyle';
const props = defineProps({
  viewType: String,
  isShowRigth: String,
  isSendTask: Boolean,
});
const router = useRouter();
const userStore = useUserStore();
const taskType = ref('');
const taskName = ref('');
const loading = ref<boolean>(false);
const grpuVisible = ref<boolean>(false);
const roleData = ref<any>([]);
const groupData = ref<any>([]);
const targetKeys = ref<any>([]);
const commonData = ref<any>([]);
const memberDialogDesign = ref(false); // 选择角色弹窗
const selectedUserRowList = ref<any[]>([]);
const selectedUserRowkeys = ref<any[]>([]);
// 表格数据 - 模拟数据
const tableData = ref<any>([]);
const userName = ref('');
/** 列表请求参数 */
const requestParams = reactive(new productSpecificationPage());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, handleSearch);
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
const finishType = ref(); //1-近五天要完工 2-近15天要完工 3-超期任务
const DateCompletedList = ref([
  {
    label: '近5天要完成',
    value: '1',
  },
  {
    label: '近15天要完成',
    value: '2',
  },
  {
    label: '延期未完成',
    value: '3',
  },
]);

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
    align: 'center',
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
    title: '任务编号',
    dataIndex: 'taskNumber',
    key: 'taskNumber',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskNumber, b.taskNumber),
    width: 200,
  },
  {
    title: '任务名称',
    dataIndex: 'nodeName',
    key: 'nodeName',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.nodeName, b.nodeName),
    width: 230,
  },
  {
    title: '当前所处阶段',
    dataIndex: 'parentNodeName',
    key: 'parentNodeName',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.parentNodeName, b.parentNodeName),
    width: 170,
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 90,
  },
  {
    title: '负责人',
    dataIndex: 'headUserName',
    key: 'headUserName',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.headUserName, b.headUserName),
    width: 100,
  },
  {
    title: '计划开始时间',
    dataIndex: 'planStartTime',
    key: 'planStartTime',
    resizable: true,
    align: 'center',
    sorter: (a: any, b: any) => sortermethod(a.planStartTime, b.planStartTime),
    width: 150,
  },
  {
    title: '计划完成时间',
    dataIndex: 'planEndTime',
    key: 'planEndTime',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planEndTime, b.planEndTime),
    align: 'center',
    width: 150,
  },
  {
    title: '实际开始时间',
    dataIndex: 'actualStartTime',
    key: 'actualStartTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actualStartTime, b.actualStartTime),
    width: 150,
  },
  {
    title: '实际完成时间',
    dataIndex: 'actualEndTime',
    key: 'actualEndTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actualEndTime, b.actualEndTime),
    width: 150,
  },
  {
    title: '发起人',
    dataIndex: 'initiatorName',
    key: 'initiatorName',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiatorName, b.initiatorName),
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'left',
    width: 200,
    fixed: 'right',
  },
]);
const viewTypeName = ref('任务卡片');

async function restSeach() {
  taskName.value = '';
  handleSearch();
}
// 处理函数
async function handleSearch() {
  loading.value = true;
  try {
    requestParams.userId = userStore.getUser.id;
    requestParams.currentPage = requestParams.pageNo;
    requestParams.pageSize = viewTypeName.value == '任务卡片' ? 100 : requestParams.pageSize;
    requestParams.taskType = taskType.value;
    requestParams.keywords = taskName.value;
    requestParams.timeType = finishType.value;
    const res = await AdminApiSystemProductSpecification.getTaskWorkByPlanId(requestParams);
    if (res.data.code === 200) {
      tableData.value = res.data.data.list || [];
      pagination.total = res.data.data.total;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getFinishType(value: any) {
  if (finishType.value == value) {
    resetTaskSearch();
    return;
  }
  finishType.value = value;
  handleSearch();
}
function resetTaskSearch() {
  finishType.value = '';
  handleSearch();
}
async function selectTaskInfo(taskTypes: any, TypeName: any) {
  taskType.value = taskTypes;
  taskName.value = '';
  viewTypeName.value = TypeName;
  await handleSearch();
}

async function startTaskInfo(record: any) {
  if (record.status == 0) {
    //修改任务启动状态和开始时间
    const res = await AdminApiSystemProductSpecification.updateTaskStatus({ id: record.id, status: '1' });
    if (res.data.code === 200) {
      router.push({
        path: '/home/taskFlow',
        query: { parms: encryptValue(JSON.stringify(record)) },
      });
    } else {
      message.error('任务启动失败');
    }
  } else {
    router.push({
      path: '/home/taskFlow',
      query: { parms: encryptValue(JSON.stringify(record)) },
    });
  }
}

function rejectTaskInfo(record: any) {
  Modal.confirm({
    title: `确定要驳回任务吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemProductSpecification.updateTaskStatus({ id: record.id, status: '2' });
      if (res.data.code === 200) {
        await handleSearch();
      } else {
        message.success('任务驳回失败！');
      }
    },
  });
}

// 处理负责人选择
const handlePlanTaskId = ref<any>('');
async function handleUserBrowse(record: any) {
  handlePlanTaskId.value = record.id;
  targetKeys.value = [];
  const data = {
    roleName: record.roleName,
    roleCode: record.roleCode,
    type: '1',
  };
  const res = await AdminApiSystemProductSpecification.getPositionUserList(data);
  commonData.value = res.data.data || [];
  groupData.value = res.data.data || [];
  selectedUserRowList.value = [];
  selectedUserRowkeys.value = [];
  grpuVisible.value = true;
}

async function handleModalConfirm() {
  if (selectedUserRowList.value.length == 0) {
    message.error('请选择要转办的人');
    return;
  }
  if (handlePlanTaskId.value != '') {
    let data = {
      id: handlePlanTaskId.value,
      headUserId: selectedUserRowList.value[0].id,
    };
    const res = await AdminApiSystemProductSpecification.transferTaskInfo(data);
    if (res.data.code == 200) {
      grpuVisible.value = false;
      message.success('转办成功');
      nextTick(() => {
        handleSearch();
      });
    }
  }
}

function handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
  targetKeys.value = nextTargetKeys;
}

function handleClose() {
  grpuVisible.value = false;
}

const modalVisible = ref(false);
const taskDetails = ref<any>({});

async function priviewTaskInfo(record: any) {
  taskDetails.value = record;
  modalVisible.value = true;
}
function dateStr(date: any) {
  if (date) {
    return dayjs(date).format('YYYY-MM-DD');
  }
}
function delayDays(record: any) {
  const { planEndTime, actualEndTime } = record;
  const planEnd = new Date(planEndTime).getTime(); // 计划结束时间戳（毫秒）

  // 1. 计划结束时间不存在，无法判断
  if (!planEndTime || isNaN(planEnd)) {
    return { isDelayed: false, delayDays: 0 };
  }

  // 2. 确定比较时间（实际结束时间或当前时间）
  let compareTime;
  if (actualEndTime) {
    compareTime = new Date(actualEndTime).getTime();
    if (isNaN(compareTime)) {
      // 实际结束时间格式错误
      return { isDelayed: false, delayDays: 0 };
    }
  } else {
    compareTime = new Date().getTime(); // 当前时间戳
  }

  // 3. 判断是否延期
  if (compareTime <= planEnd) {
    return { isDelayed: false, delayDays: 0 }; // 未延期
  }

  // 4. 计算延期天数（向上取整，不足1天按1天算）
  const delayMs = compareTime - planEnd; // 延期毫秒数
  const delayDays = Math.ceil(delayMs / (24 * 60 * 60 * 1000)); // 转换为天并向上取整

  return { isDelayed: true, delayDays };
}
function deadline(record: any) {
  const { planEndTime } = record;
  const planEnd = new Date(planEndTime).getTime(); // 计划截止时间戳（毫秒）
  const now = new Date().getTime(); // 当前时间戳

  // 1. 计划截止时间不存在或格式错误
  if (!planEndTime || isNaN(planEnd)) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  // 2. 计算剩余时间（毫秒）
  const timeLeftMs = planEnd - now;

  // 3. 已截止（剩余时间 ≤ 0）
  if (timeLeftMs <= 0) {
    //
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  // 4. 转换为天、小时、分钟（忽略秒，向下取整）
  const days = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000)); // 剩余天数
  const remainingMsAfterDays = timeLeftMs % (24 * 60 * 60 * 1000); // 剩余毫秒数（扣除整天后）

  const hours = Math.floor(remainingMsAfterDays / (60 * 60 * 1000)); // 剩余小时数
  const remainingMsAfterHours = remainingMsAfterDays % (60 * 60 * 1000); // 剩余毫秒数（扣除整小时后）

  const minutes = Math.floor(remainingMsAfterHours / (60 * 1000)); // 剩余分钟数

  return { days: days };
}

/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: selectedUserRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedUserRowList.value = selectedRows;
      selectedUserRowkeys.value = selectedRowKeys;
    },
  };
});
/** 表格勾选事件 */
function rowSelectionUser(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedUserRowkeys.value];
      const selectedRows = [...selectedUserRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedUserRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedUserRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedUserRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedUserRowList.value = [...selectedRows, record];
      }
    },
  };
}

const usercolumns = ref<TableColumnType[]>([
  {
    title: WeiI18n.$t('成员'),
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.nickname, b.nickname),
    width: 200,
  },
  {
    title: WeiI18n.$t('工号'),
    dataIndex: 'username',
    key: 'username',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.username, b.username),
    width: 300,
  },
]);
async function searchMembers() {
  commonData.value = groupData.value.filter((item: any) => (item.nickname + item.username).includes(userName.value));
}
const resetTurnToTask = () => {
  userName.value = '';
  commonData.value = groupData.value;
};
defineExpose({ selectTaskInfo });
</script>
<template>
  <div>
    <a-row class="elrow">
      <a-col :span="24">
        <div class="form-wrap">
          <a-input v-model:value="taskName" allowClear placeholder="请输入任务名称" style="width: 220px; margin-right: 10px" />
          <a-button type="primary" @click="handleSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }}</a-button>
          <a-button style="margin-left: 10px" @click="restSeach">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            重置
          </a-button>
          <span class="seach-append">
            <a
              v-for="item in DateCompletedList"
              :key="item.value"
              :style="{ color: finishType === item.value ? '#165dff' : '' }"
              class="elLink"
              @click.stop="getFinishType(item.value)"
              >{{ item.label }}</a
            >
          </span>
        </div>
      </a-col>
    </a-row>
    <div v-if="viewType == 'card'" class="layoutBody" style="margin-top: 18px">
      <div v-for="(item, index) in tableData" :key="index" class="layoutTableBox">
        <div class="card-detail">
          <div class="card-list" :style="{ width: isShowRigth == '展开' ? '384px' : '401px' }">
            <div class="title">
              <span class="tit"
                >{{ item.taskName }}
                <span class="status" :class="item.status == 0 ? 'daiban' : item.status == 1 ? 'working' : item.status == 2 ? 'biangeng' : 'yiban'">{{
                  item.status == 0 ? '待启动' : item.status == 1 ? '正在工作' : item.status == 2 ? '变更中' : '已完成'
                }}</span>
              </span>
              <span class="t-more">
                <a-dropdown v-if="taskType != '3'">
                  <div class="dot">...</div>
                  <template #overlay>
                    <a-menu>
                      <div style="text-align: left">
                        <a-menu-item>
                          <a v-if="taskType != '2' && (item.status == 0 || item.status == 1 || item.status == 2) && !isSendTask" @click.stop="startTaskInfo(item)">开始</a>
                          <a v-else style="margin-left: 0px; color: #cccccc"> 开始 </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a v-if="taskType != '2' && item.status == 0 && !isSendTask" @click.stop="rejectTaskInfo(item)">驳回</a>
                          <a v-else style="margin-left: 0px; color: #cccccc"> 驳回 </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a v-if="taskType != '2' && item.status == 0 && item.transferHandlerId == null && !isSendTask" @click.stop="handleUserBrowse(item)">转办</a>
                          <a v-else style="margin-left: 0px; color: #cccccc"> 转办 </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a v-if="item.status != 0" @click.stop="priviewTaskInfo(item)">详情</a>
                          <a v-else style="margin-left: 0px; color: #cccccc"> 详情 </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a v-if="item.status == 3" @click.stop="startTaskInfo(item)">查看</a>
                        </a-menu-item>
                      </div>
                    </a-menu>
                  </template>
                </a-dropdown>
              </span>
            </div>
            <div class="time">任务时间：{{ dateStr(item.planStartTime) }} ~ {{ dateStr(item.planEndTime) }}</div>
            <a-tooltip>
              <template #title>{{ item.nodeName }}</template>
              <div class="time">任务名称：{{ item.nodeName }}</div>
            </a-tooltip>
            <div class="time">所处阶段：{{ item.parentNodeName }}</div>
            <div class="schedule">
              <span class="schedule-info"
                >当前进度：<span class="num">{{ item.progress }}%</span></span
              >
              <span class="schedule-time" :style="item.status == '3' ? '' : delayDays(item).isDelayed ? 'color:red;' : 'color:black;'">{{
                item.status == '3'
                  ? '完成时间：' + dateStr(item.actualEndTime)
                  : delayDays(item).isDelayed
                    ? '延期' + delayDays(item).delayDays + '天'
                    : '距截止还剩' + deadline(item).days + '天'
              }}</span>
            </div>
            <a-progress :text-inside="true" :stroke-width="12" :percent="item.progress" color="linear-gradient( 270deg, #6F96FA 0%, #3172F5 72%)" />
            <div class="create-pop">
              接收人：<span class="user"><img src="../../../assets/workbench/avatar.jpg" alt="" />{{ item.headUserName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 任务表格 -->
    <div class="task-table-container" v-if="viewType == 'table'">
      <a-table
        :scroll="{ x: 'max-content' }"
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :locale="locale"
        @resizeColumn="handleResizeColumn"
        :customRow="customRow"
        :pagination="pagination"
        :loading="loading"
        class="task-table"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'planStartTime'">
            {{ record.planStartTime.split(' ')[0] || '' }}
          </template>
          <template v-if="column.dataIndex === 'planEndTime'">
            {{ record.planEndTime.split(' ')[0] || '' }}
          </template>
          <template v-if="column.dataIndex === 'actualStartTime' && record.actualStartTime != undefined">
            {{ record.actualStartTime.split(' ')[0] || '' }}
          </template>
          <template v-if="column.dataIndex === 'actualEndTime' && record.actualEndTime != undefined">
            {{ record.actualEndTime.split(' ')[0] || '' }}
          </template>
          <template v-if="column.dataIndex === 'nodeName'">
            <a @click.stop="startTaskInfo(record)" v-if="taskType == '2'">{{ record.nodeName }}</a>
            <span v-else>{{ record.nodeName }}</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span>
              <span v-if="record.status == 0" :style="getStatusStyle('待启动')">{{ $t('待启动') }}</span>
              <span v-else-if="record.status == 1" :style="getStatusStyle('正在工作')">{{ $t('正在工作') }}</span>
              <span v-else-if="record.status == 2" :style="getStatusStyle('变更中')">{{ $t('变更中') }}</span>
              <span v-else-if="record.status == 3" :style="getStatusStyle('已完成')">{{ $t('已完成') }}</span>
            </span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <span v-if="taskType != '3'">
              <a v-if="taskType != '2' && (record.status == 0 || record.status == 1 || record.status == 2)" @click="startTaskInfo(record)">{{ $t('开始') }}</a>
              <a-divider type="vertical" v-if="taskType != '2' && (record.status == 0 || record.status == 1 || record.status == 2)" />
              <a @click="rejectTaskInfo(record)" v-if="taskType != '2' && record.status == 0">{{ $t('驳回') }}</a>
              <a-divider type="vertical" v-if="taskType != '2' && record.status == 0" />
              <a @click="handleUserBrowse(record)" v-if="taskType != '2' && record.status == 0 && record.transferHandlerId == null">{{ $t('转办') }}</a>
              <a-divider type="vertical" v-if="taskType != '2' && record.status == 0 && record.transferHandlerId == null" />
              <a @click="priviewTaskInfo(record)" v-if="record.status != 0">{{ $t('详情') }}</a>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!-- 任务详情模态框 -->
  <a-modal v-model:visible="modalVisible" title="任务详情" width="600px" :footer="null" @cancel="modalVisible = false">
    <a-descriptions :column="1" bordered size="middle">
      <a-descriptions-item label="任务编号">{{ taskDetails?.taskNumber }}</a-descriptions-item>
      <a-descriptions-item label="任务名称">{{ taskDetails?.nodeName }}</a-descriptions-item>
      <a-descriptions-item label="当前所处阶段">{{ taskDetails?.parentNodeName }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <span v-if="taskDetails.status == 0">
          <span :style="getStatusStyle('待启动')">{{ $t('待启动') }}</span>
        </span>
        <span v-else-if="taskDetails.status == 1">
          <span :style="getStatusStyle('正在工作')">{{ $t('正在工作') }}</span>
        </span>
        <span v-else-if="taskDetails.status == 2">
          <span :style="getStatusStyle('变更中')">{{ $t('变更中') }}</span>
        </span>
        <span v-else-if="taskDetails.status == 3">
          <span :style="getStatusStyle('已完成')">{{ $t('已完成') }}</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="负责人">{{ taskDetails?.headUserName }}</a-descriptions-item>
      <a-descriptions-item label="计划开始时间">
        {{ taskDetails?.planStartTime ? taskDetails.planStartTime.split(' ')[0] : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="计划完成时间">
        {{ taskDetails?.planEndTime ? taskDetails.planEndTime.split(' ')[0] : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="实际开始时间">
        {{ taskDetails?.actualStartTime ? taskDetails.actualStartTime.split(' ')[0] : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="实际完成时间">
        {{ taskDetails?.actualEndTime ? taskDetails.actualEndTime.split(' ')[0] : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="发起人">{{ taskDetails?.initiatorName }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>

  <!-- <MemberAuthModal
    modalWidth="60%"
    v-model:modalVisible="grpuVisible"
    :data-source="commonData"
    v-model:target-keys="targetKeys"
    :Singlechoice="true"
    @confirm="handleModalConfirm"
    @change="handleChange"
    @Cancel="handleClose" /> -->
  <a-modal v-model:visible="grpuVisible" title="选择转办用户" width="1000px">
    <div class="member-modal-body">
      <div class="member-search-row">
        <a-input v-model:value="userName" style="width: 240px" placeholder="请输入关键字" />
        <a-button type="primary" @click="searchMembers" style="margin-left: 10px"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />搜索</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>
      <div class="member-table-wrap">
        <!-- 表格处 -->
        <a-table
          :scroll="{ x: 800, y: 250 }"
          :row-key="(record: any) => (record.id ? record.id : record.userId)"
          :columns="usercolumns"
          :row-selection="rowSelection"
          :customRow="rowSelectionUser"
          :pagination="false"
          style="width: 100%; margin-top: 10px"
          :locale="locale"
          :data-source="commonData"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              {{ record.name }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="handleModalConfirm()"> 确定 </a-button>
        <a-button @click="handleClose()">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../assets/css/workbench/workbench.less';
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

.seach-append {
  .elLink {
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
    &:hover {
      color: #0d53e2;
      border-bottom: 1px solid blue;
      transform: translateY(-2px);
    }
    color: #6a696e;
    font-size: 13px;
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
