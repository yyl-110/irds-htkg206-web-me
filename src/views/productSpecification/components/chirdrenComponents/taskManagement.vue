<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { TableColumnType, TableProps, Modal, Button, Input, Select, DatePicker } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import MemberAuthModal from '@/components/MemberAuthModal/index.vue'; // 引入封装组件
const userStore = useUserStore();
// 响应式数据
const searchForm = reactive({
  taskName: '',
  taskType: '阶段+任务',
});

// 表格数据 - 模拟数据
const tableData = ref([]);
const defaultExpandedKeys = ref<any>([]);
const loading = ref<boolean>(true);
const handleWorkStatusMore = ref<boolean>(true);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '120px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
const emit = defineEmits<{
  reloadListData: any;
}>();
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
  handleWorkStatusMore.value = false;
  if (selectedRowList.value.length == 0) {
    handleWorkStatusMore.value = true;
  }
  selectedRowList.value.forEach((item: any) => {
    //判断是否需要开启批量操作
    if (item.parentId == '0') {
      handleWorkStatusMore.value = true;
      return;
    } else if (item.ifWork != 0 || item.publishStatus == '1' || item.headUserId == null || item.headUserId == undefined) {
      handleWorkStatusMore.value = true;
      return;
    }
  });

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
const columns = ref([
  {
    title: 'WBS',
    dataIndex: 'wbsCode',
    key: 'wbsCode',
    resizable: true,
    width: 120,
  },
  {
    title: '任务项点',
    dataIndex: 'nodeName',
    key: 'nodeName',
    resizable: true,
    width: 250,
  },
  {
    title: '节点类型',
    dataIndex: 'nodeType',
    key: 'nodeType',
    resizable: true,
    width: 100,
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    key: 'businessType',
    resizable: true,
    width: 100,
  },
  {
    title: '计划开始时间',
    dataIndex: 'planStartTime',
    key: 'planStartTime',
    resizable: true,
    width: 170,
  },
  {
    title: '计划完成时间',
    dataIndex: 'planEndTime',
    key: 'planEndTime',
    resizable: true,
    width: 170,
  },
  {
    title: '任务角色',
    dataIndex: 'roleName',
    key: 'roleName',
    resizable: true,
    width: 120,
  },
  {
    title: '负责人',
    dataIndex: 'headUserName',
    key: 'headUserName',
    resizable: true,
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]);

// 处理函数
const handleSearch = async () => {
  loading.value = true;
  try {
    let data = <any>{};
    tableData.value = [];
    data.id = planId.value;
    data.taskType = searchForm.taskType;
    data.taskName = searchForm.taskName;
    const res = await AdminApiSystemProductSpecification.getTaskInfo(data);
    tableData.value = res.data.data || [];
    //根据不同的项目阶段展开不同的任务项点
    defaultExpandedKeys.value = [];
    let nums = 0;
    tableData.value.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        nums++;
        if (nums == planPhase.value) {
          //展开层级一致
          defaultExpandedKeys.value.push(item.id);
        }
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

async function handleBatchPublish() {
  //获取选中的节点
  Modal.confirm({
    title: `确定要执行该操作吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      selectedRowList.value.forEach((item: any) => {
        updateWorkStatusInfo(item.id);
      });
      setTimeout(() => {
        selectTaskInfo(planId.value, planInfoStartTime.value, planInfoEndTime.value, planPhase.value);
      }, 1000);
    },
  });
}

async function updateWorkStatusInfo(id: any) {
  const data = <any>{};
  data.id = id;
  data.status = 2;
  data.planId = planId.value;
  await AdminApiSystemProductSpecification.updateWorkStatus(data);
}

const handleBatchDelete = (ids: any) => {
  const params = {
    id: ids,
  };
  // 删除
  AdminApiSystemProductSpecification.deletePlanTask(params).then(() => {
    message.success('删除成功');
    handleSearch();
  });
};

const trueOrfalse = (record: any) => {
  if (record.status == 0 && planPhase.value == record.wbsCode) {
    return false;
  } else {
    return true;
  }
};
const disabledDate = (current: any) => {
  if (!planInfoStartTime.value) return false;

  // 创建当前日期的副本并重置时间部分
  const currentDate = new Date(current);
  currentDate.setHours(0, 0, 0, 0);

  const startTime = new Date(planInfoStartTime.value);
  startTime.setHours(0, 0, 0, 0);

  // 如果有结束时间，也将其转换为日期对象
  let endTime: Date | null = null;
  if (planInfoEndTime.value) {
    endTime = new Date(planInfoEndTime.value);
    endTime.setHours(0, 0, 0, 0);
  }

  if (currentDate < startTime) {
    return true;
  }

  if (endTime && currentDate > endTime) {
    return true;
  }

  return false;
};

// 处理日期变更
const handleDateChange = async (record: any, field: any, date: any) => {
  record[field] = '';
  let data = <any>{};
  data.id = record.id;
  data.timeType = field;
  data.planTime = date;
  const res = await AdminApiSystemProductSpecification.updatePlanDate(data);
  selectTaskInfo(planId.value, planInfoStartTime.value, planInfoEndTime.value, planPhase.value);
};

// 编辑任务表单数据
const editForm = reactive({
  planStartTime: '',
  planEndTime: '',
  headUserId: '',
  headUserName: '',
});

// 当前编辑的任务记录
const currentRecord = ref<any>({});

// 处理编辑产品
async function handleEditProduct(record: any) {
  handlePlanTaskId.value = '';
  currentRecord.value = record;
  editForm.planStartTime = record.planStartTime;
  editForm.planEndTime = record.planEndTime;
  editForm.headUserId = record.headUserId;
  editForm.headUserName = record.headUserName;
  editProductModal.value = true;
}

async function handleWorkStatus(record: any, type: any) {
  Modal.confirm({
    title: `确定要执行该操作吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const data = <any>{};
      data.id = record.id;
      data.status = type;
      data.planId = planId.value;
      const res = await AdminApiSystemProductSpecification.updateWorkStatus(data);
      if (res.data.code == 200) {
        await selectTaskInfo(planId.value, planInfoStartTime.value, planInfoEndTime.value, planPhase.value);
        if (type == 1) {
          //调用父页面刷新状态
          emit('reloadListData', false);
        }
        // message.success('保存成功');
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
  };
  const res = await AdminApiSystemProductSpecification.getPositionUserList(data);
  const resB = await AdminApiSystemUser.getSimpleUsers({});
  roleData.value = res.data.data || [];
  groupData.value = resB.data.data || [];
  const groupIds = new Set(groupData.value.map(item => item.id));
  commonData.value = roleData.value.filter(roleItem => groupIds.has(roleItem.id));
  if (record.headUserId != null && record.headUserId != undefined && record.headUserId != '') {
    targetKeys.value.push(record.headUserId);
  } else {
    targetKeys.value = [];
  }
  grpuVisible.value = true;
}

async function handleUserBrowse_B() {
  targetKeys.value = [];
  const data = {
    roleName: currentRecord.value.roleName,
    roleCode: currentRecord.value.roleCode,
  };
  const res = await AdminApiSystemProductSpecification.getPositionUserList(data);
  const resB = await AdminApiSystemUser.getSimpleUsers({});
  roleData.value = res.data.data || [];
  groupData.value = resB.data.data || [];
  const groupIds = new Set(groupData.value.map(item => item.id));
  commonData.value = roleData.value.filter(roleItem => groupIds.has(roleItem.id));
  if (currentRecord.value.headUserId != null && currentRecord.value.headUserId != undefined && currentRecord.value.headUserId != '') {
    targetKeys.value.push(currentRecord.value.headUserId);
  } else {
    targetKeys.value = [];
  }
  grpuVisible.value = true;
}

async function handleModalConfirm() {
  if (handlePlanTaskId.value != '') {
    let data = {
      id: handlePlanTaskId.value,
      headUserId: targetKeys.value[0],
    };
    const res = await AdminApiSystemProductSpecification.updateHeaderUserId(data);
    if (res.data.code == 200) {
      await selectTaskInfo(planId.value, planInfoStartTime.value, planInfoEndTime.value, planPhase.value);
      grpuVisible.value = false;
      message.success('保存成功');
    }
  } else {
    editForm.headUserId = targetKeys.value[0];
    // 根据headUserId循环commonData数组查找对应的用户名称
    const selectedUser = commonData.value.find(item => item.id === targetKeys.value[0]);
    if (selectedUser) {
      editForm.headUserName = selectedUser.nickname || '';
    } else {
      editForm.headUserName = '';
    }
    grpuVisible.value = false;
  }
}

function handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
  targetKeys.value = nextTargetKeys;
}

function handleClose() {
  grpuVisible.value = false;
}

// 保存编辑内容
async function handleSaveEdit() {
  if (!currentRecord.value) return;
  try {
    // 构建保存数据
    const saveData = {
      id: currentRecord.value.id,
      planStartTime: editForm.planStartTime.split(' ')[0],
      planEndTime: editForm.planEndTime.split(' ')[0],
      headUserId: editForm.headUserId,
    };
    const res = await AdminApiSystemProductSpecification.updatePlanTaskInfo(saveData);
    if (res.data.code == 200) {
      editProductModal.value = false;
      await selectTaskInfo(planId.value, planInfoStartTime.value, planInfoEndTime.value, planPhase.value);
      message.success('保存成功');
    }
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败，请重试');
  }
}

// 关闭弹框
function handleCloseModal() {
  editProductModal.value = false;
  Object.keys(editForm).forEach(key => {
    editForm[key as keyof typeof editForm] = '';
  });
  currentRecord.value = {};
}
const targetKeys = ref<any>([]);
const grpuVisible = ref<boolean>(false);
const commonData = ref<any>([]);
const roleData = ref<any>([]);
const groupData = ref<any>([]);
const editProductModal = ref<any>(false);
const planId = ref<any>('');
const planInfoStartTime = ref<any>('');
const planInfoEndTime = ref<any>('');
const planPhase = ref<any>('');
async function selectTaskInfo(Id: any, startTime: any, endTime: any, planPhases: any) {
  planInfoStartTime.value = startTime;
  planInfoEndTime.value = endTime;
  planPhase.value = planPhases;
  planId.value = Id;
  searchForm.taskType = '阶段+任务';
  searchForm.taskName = '';

  await handleSearch();
}
function reloadTaskInfo(Id: any, startTime: any, endTime: any, planPhases: any) {
  selectTaskInfo(Id, startTime, endTime, planPhases);
  //初始化表格选中行
  selectedRowList.value = [];
  selectedRowkeys.value = [];
}
function handleClear() {
  searchForm.taskName = '';
  handleSearch();
}
defineExpose({ selectTaskInfo, reloadTaskInfo });
</script>

<template>
  <div class="task-management-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-select v-model:value="searchForm.taskType" placeholder="阶段+任务" style="width: 120px; margin-right: 10px" @change="handleSearch">
        <a-select-option value="">阶段+任务</a-select-option>
        <a-select-option value="阶段">阶段</a-select-option>
      </a-select>
      <a-input allowClear v-model:value="searchForm.taskName" placeholder="请输入任务名称" style="width: 300px; margin-right: 10px" />
      <a-button type="primary" style="margin-left: 10px" @click="handleSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }}</a-button>
      <a-button style="margin-left: 10px" @click="handleClear">
        <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
        {{ $t('重置') }}
      </a-button>
      <a-button type="primary" :disabled="handleWorkStatusMore" @click="handleBatchPublish" style="margin-left: 10px">
        <EpcIcon type="icon-fafang" style="font-size: 12px" />{{ $t('一键发布') }}</a-button
      >
    </div>

    <!-- 任务表格 -->
    <div class="task-table-container">
      <a-table
        :scroll="{ x: 'max-content' }"
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :locale="locale"
        :loading="loading"
        v-model:expandedRowKeys="defaultExpandedKeys"
        @resizeColumn="handleResizeColumn"
        :row-selection="rowSelection"
        :customRow="customRow"
        class="task-table"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'businessType'">
            {{ record.businessType || '/' }}
          </template>
          <template v-if="column.dataIndex === 'roleName'">
            {{ record.roleName || '/' }}
          </template>
          <template v-if="column.dataIndex === 'planStartTime'">
            <div v-if="record.nodeType == '阶段'">
              <a-date-picker
                :disabled-date="disabledDate"
                :locale="localeA"
                :disabled="trueOrfalse(record)"
                v-model:value="record.planStartTime"
                style="width: 150px"
                placeholder="计划开始时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="date => handleDateChange(record, 'planStartTime', date)" />
            </div>
            <div v-else>
              <a-date-picker
                :disabled-date="disabledDate"
                :locale="localeA"
                :disabled="record.ifWork == 1 || record.publishStatus == '1'"
                v-model:value="record.planStartTime"
                style="width: 150px"
                placeholder="计划开始时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="date => handleDateChange(record, 'planStartTime', date)" />
            </div>
          </template>
          <template v-if="column.dataIndex === 'planEndTime'">
            <div v-if="record.nodeType == '阶段'">
              <a-date-picker
                :disabled-date="disabledDate"
                :locale="localeA"
                :disabled="trueOrfalse(record)"
                v-model:value="record.planEndTime"
                style="width: 150px"
                placeholder="计划结束时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="date => handleDateChange(record, 'planEndTime', date)" />
            </div>
            <div v-else>
              <a-date-picker
                :disabled-date="disabledDate"
                :locale="localeA"
                :disabled="record.ifWork == 1 || record.publishStatus == '1'"
                v-model:value="record.planEndTime"
                style="width: 150px"
                placeholder="计划结束时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="date => handleDateChange(record, 'planEndTime', date)" />
            </div>
          </template>
          <template v-if="column.dataIndex === 'headUserName'">
            <div v-if="record.nodeType == '阶段'">/</div>
            <div v-else>
              <span style="display: inline-block; width: 80px">{{ record.headUserName }}</span>
              <span class="headUser_style" @click.stop="handleUserBrowse(record)" v-if="record.ifWork == 0 && record.publishStatus != '1'">浏览 </span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span v-if="record.status == 0">待启动</span>
            <span v-if="record.status == 1" style="color: #e6a23c">工作中</span>
            <span v-if="record.status == 2" style="color: #9370db">变更中</span>
            <span v-if="record.status == 3" style="color: #67c23a">已完成</span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div v-if="record.nodeType == '阶段'">
              <a-tooltip placement="top" title="编辑">
                <a v-if="record.status == 0 && planPhase == record.wbsCode" @click="handleEditProduct(record)" type="primary"
                  ><EpcIcon type="icon-edit" style="font-size: 15px"
                /></a>
                <a v-else :disabled="true" type="primary"><EpcIcon type="icon-edit" style="font-size: 15px" /></a>
              </a-tooltip>
              <a-divider type="vertical" v-if="record.status == 0 && planPhase == record.wbsCode" />
              <a-tooltip placement="top" title="启动">
                <a v-if="record.status == 0 && planPhase == record.wbsCode" @click="handleWorkStatus(record, 1)" type="primary">
                  <EpcIcon type="icon-yunhang" style="font-size: 18px"
                /></a>
              </a-tooltip>
            </div>
            <div v-else>
              <a-tooltip placement="top" title="编辑">
                <a v-if="record.ifWork == 0 && record.publishStatus != '1'" @click="handleEditProduct(record)" type="primary"
                  ><EpcIcon type="icon-edit" style="font-size: 15px"
                /></a>
                <a v-else :disabled="true" type="primary"><EpcIcon type="icon-edit" style="font-size: 15px" /></a>
              </a-tooltip>
              <a-divider
                v-if="
                  record.status == '3' ||
                  (record.publishStatus != '1' && record.headUserId != null && record.headUserId != undefined) ||
                  (record.publishStatus == '1' && record.status == '0' && record.headUserId != null && record.headUserId != undefined)
                "
                type="vertical" />
              <a-tooltip placement="top" title="变更">
                <a v-if="record.status == '3' && record.headUserId != null && record.headUserId != undefined" @click="handleWorkStatus(record, 4)" type="primary">
                  <EpcIcon type="icon-bianji1" style="font-size: 18px" />
                </a>
              </a-tooltip>
              <a-tooltip placement="top" title="发布">
                <a v-if="record.publishStatus != '1' && record.headUserId != null && record.headUserId != undefined" @click="handleWorkStatus(record, 2)" type="primary">
                  <EpcIcon type="icon-fabu" style="font-size: 19px" />
                </a>
              </a-tooltip>
              <a-tooltip placement="top" title="撤销发布">
                <a
                  v-if="record.publishStatus == '1' && record.status == '0' && record.headUserId != null && record.headUserId != undefined"
                  @click="handleWorkStatus(record, 3)"
                  type="primary"
                  ><EpcIcon type="icon-jinyongxiaoxi" style="font-size: 18px" />
                </a>
              </a-tooltip>

              <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="record.type === 1" @confirm="handleBatchDelete(record.id)">
                <!-- v-hasPermi="['system:role:delete']" -->
                <a-divider v-if="record.publishStatus != '1' && record.cropFlag == 0" type="vertical" />
                <a-tooltip placement="top" title="删除">
                  <a type="link" danger v-if="record.publishStatus != '1' && record.cropFlag == 0" class="p-0">
                    <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                    <!-- 删除-->
                  </a>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <MemberAuthModal
      modalWidth="60%"
      v-model:modalVisible="grpuVisible"
      :data-source="commonData"
      v-model:target-keys="targetKeys"
      :Singlechoice="true"
      @confirm="handleModalConfirm"
      @change="handleChange"
      @Cancel="handleClose" />
    <a-modal v-model:visible="editProductModal" title="编辑任务信息" width="600px">
      <div class="edit-modal-content">
        <a-form layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <!-- 计划开始时间 -->
          <a-form-item label="计划开始时间">
            <a-date-picker
              :disabled-date="disabledDate"
              :locale="localeA"
              v-model:value="editForm.planStartTime"
              style="width: 300px"
              placeholder="计划结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" />
          </a-form-item>

          <!-- 计划完成时间 -->
          <a-form-item label="计划完成时间">
            <a-date-picker
              :disabled-date="disabledDate"
              :locale="localeA"
              v-model:value="editForm.planEndTime"
              style="width: 300px"
              placeholder="计划结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" />
          </a-form-item>

          <!-- 负责人 -->
          <a-form-item label="负责人" v-if="currentRecord.nodeType == '任务'">
            <div style="display: flex; align-items: center">
              <a-input v-model:value="editForm.headUserName" placeholder="请选择负责人" disabled style="flex: 1; margin-right: 8px" />
              <a-button type="primary" @click="handleUserBrowse_B"> 浏览 </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="handleSaveEdit" type="primary">确定</a-button>
        <a-button @click="handleCloseModal" type="primary">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.headUser_style {
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: #1971ff !important;
  border: none !important;
  margin-left: 15px;
  &:hover {
    color: #1971ff !important;
    background-color: none !important;
    border-color: none !important;
  }
}

.task-management-container {
  height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #fff;

  .search-bar {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .task-table-container {
    flex: 1;
    overflow: auto;

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

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  &.status-completed {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }

  &.status-working {
    background-color: #fff7e6;
    color: #fa8c16;
    border: 1px solid #ffd591;
  }

  &.status-pending {
    background-color: #f0f0f0;
    color: #8c8c8c;
    border: 1px solid #d9d9d9;
  }
}

// 操作按钮样式
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .action-btn {
    padding: 0 8px;
    font-size: 12px;

    &.edit-btn {
      color: #1890ff;
    }

    &.start-btn,
    &.publish-btn {
      color: #52c41a;
    }

    &.cancel-btn {
      color: #fa8c16;
    }

    &.change-btn {
      color: #722ed1;
    }

    &.delete-btn {
      color: #ff4d4f;
    }
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
