<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { TableColumnType, TableProps, Modal, Button, Input, Select, DatePicker } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { DesignApiInfo } from '@/api/tags/design/产品设计.ts';
import { AdminApiWorkbench } from '@/api/tags/workbench/工作台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { handleEpcDownload } from '@/utils/file';
import { downloadFileFromStream, exportFile } from '@/utils/file.ts';
import Gantt from './gantt.vue';
// import Gantt from './gantt.vue';
const userStore = useUserStore();
// 响应式数据
const searchForm = reactive({
  taskName: '',
  taskType: '阶段+任务',
});
const uploadInfoData = ref<any[]>([]);
// 表格数据 - 模拟数据
const tableData = ref([]);
const defaultExpandedKeys = ref<any>([]);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '120px', marginTop: '50px' },
  }),
});

const ifPlayPicture = ref<boolean>(false);
const ganttTasks = ref<any[]>([]);
const ganttRef = ref();
const resource = ref('edit');
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

const uploadColumnsInfoList = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '文件名称',
    dataIndex: 'oldFileName',
    key: 'oldFileName',
    ellipsis: true,
    align: 'left',
    width: 270,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.oldFileName, b.oldFileName),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
  },
]);

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

const emit = defineEmits<{
  reloadListData: any;
}>();

// 表格列定义
const columns = [
  {
    title: 'WBS',
    dataIndex: 'wbsCode',
    key: 'wbsCode',
    width: 160,
  },
  {
    title: '任务项点',
    dataIndex: 'nodeName',
    key: 'nodeName',
    width: 160,
  },
  {
    title: '交付物',
    dataIndex: 'action',
    key: 'action',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'taskStatus',
    key: 'taskStatus',
    width: 80,
  },
  {
    title: '计划开始时间',
    dataIndex: 'planStartTime',
    key: 'planStartTime',
    width: 130,
  },
  {
    title: '计划完成时间',
    dataIndex: 'planEndTime',
    key: 'planEndTime',
    width: 130,
  },
  {
    title: '实际开始时间',
    dataIndex: 'actualStartTime',
    key: 'actualStartTime',
    width: 130,
  },
  {
    title: '实际完成时间',
    dataIndex: 'actualEndTime',
    key: 'actualEndTime',
    width: 130,
  },
  {
    title: '负责人',
    dataIndex: 'headUserName',
    key: 'headUserName',
    width: 100,
  },
  // 把 操作 列放到最后并固定到右侧
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    width: 140,
    align: 'center',
    fixed: 'right',
  },
];
const loading = ref<boolean>(false);
// 处理函数
const handleSearch = async () => {
  debugger;
  loading.value = true;
  try {
    let data = <any>{};
    tableData.value = [];
    data.projectId = productId.value;
    data.taskType = searchForm.taskType;
    data.taskName = searchForm.taskName;
    const res = await DesignApiInfo.ckProjectDeliveryApi(data);
    tableData.value = res.data.data || [];
    ganttTasks.value = { data: res.data.data || [], links: [] };
    //根据不同的项目阶段展开不同的任务项点
    defaultExpandedKeys.value = [];
    let nums = 0;
    tableData.value.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        nums++;
        defaultExpandedKeys.value.push(item.id);
      }
    });
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

async function handleKeyIndicatorChange(checked: boolean) {
  ifPlayPicture.value = checked;
  if (checked) {
    nextTick(() => {
      setTimeout(() => {
        ganttRef.value.initData('111');
      }, 200);
    });
  }
}

async function exportFileInfo() {
  let data: any = {};
  data.taskId = 1;
  data.productId = productId.value;
  const res = await AdminApiSystemProductSpecification.deliveryFileExport(data);
  const fileName = '交付物信息.zip';
  downloadFileFromStream(res, fileName);
}

async function exportPlan() {
  let data: any = {};
  data.projectId = productId.value;
  data.taskName = searchForm.taskName;
  debugger;
  const res = await DesignApiInfo.exportDeliveryApi(data);
  console.log('res===', res);

  const fileName = '产品计划.xlsx';
  downloadFileFromStream(res, fileName);
}
const isModalVisible = ref<boolean>(false);
const productId = ref<any>('');
async function selectTaskInfo(Id: any) {
  productId.value = Id;
  searchForm.taskType = '阶段+任务';
  searchForm.taskName = '';

  await handleSearch();
}

async function selectFileInfo(record: any) {
  debugger;
  let data: any = {};
  data.taskId = record.taskId;
  data.userId = userStore.getUser.id;
  const res = await DesignApiInfo.getDeliveryFileApi(data);
  uploadInfoData.value = res.data.data.fileInfoList || [];
  isModalVisible.value = true;
}

async function helckClick() {
  isModalVisible.value = false;
}

function reloadTaskInfosss(Id: any, resourceType: string) {
  resource.value = resourceType;
  selectTaskInfo(Id);
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const filePath = row.filePath;
  // const lastDotIndex = row.fileName.lastIndexOf('.');
  // fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  // if (fileType.value == '.doc' || fileType.value == '.pdf') {
  //   filePath.value = row.pdfFileName;
  // } else {
  //   filePath.value = row.filePath;
  // }
  // powVisible.value = true;
  window.open(filePath, '_blank');
}
function handleClosePowModal() {
  powVisible.value = false;
}
async function downFile(row: any) {
  const downLoadItem = {
    fileId: row.fileId,
  };
  handleEpcDownload(downLoadItem, row.oldFileName);
}
function handleClear() {
  searchForm.taskName = '';
  handleSearch();
}
defineExpose({ selectTaskInfo, reloadTaskInfosss });

// 新增：回退任务（修改）确认并调用接口
async function confirmRollback(record: any) {
  const taskId = record.taskId ?? record.id;
  if (!taskId) {
    message.error('无法获取任务ID');
    return;
  }

  Modal.confirm({
    title: '确认修改',
    content: '该任务已完成，确认要回退为可修改状态吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await AdminApiWorkbench.rollBackTaskApi({ taskId });
        // 兼容返回格式
        const code = String(res?.data?.code ?? res?.code ?? '');
        if (code == '0' || code == '200') {
          message.success('回退成功');
          // 刷新当前列表
          await handleSearch();
        } else {
          message.error(res?.data?.msg ?? '回退失败');
        }
      } catch (err) {
        console.error('rollBackTaskApi error:', err);
        message.error('回退失败');
      }
    },
    onCancel() {
      // 取消则不做操作
    },
  });
}
</script>

<template>
  <div class="task-management-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <!-- <a-select v-model:value="searchForm.taskType" placeholder="阶段+任务" style="width: 120px; margin-right: 10px" @change="handleSearch">
        <a-select-option value="">阶段+任务</a-select-option>
        <a-select-option value="阶段">阶段</a-select-option>
      </a-select> -->
      <a-input allowClear v-model:value="searchForm.taskName" placeholder="请输入任务名称" style="width: 300px; margin-right: 10px" />
      <a-button type="primary" style="margin-left: 10px" @click="handleSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }}</a-button>
      <a-button style="margin-left: 10px" @click="handleClear">
        <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
        {{ $t('重置') }}
      </a-button>
      <a-button type="primary" @click="exportPlan" style="margin-left: 10px"> <EpcIcon type="icon-daochu" style="font-size: 12px" />{{ $t('导出计划') }}</a-button>
      <!-- <a-button type="primary" @click="exportFileInfo" style="margin-left: 10px"> <EpcIcon type="icon-daochu1" style="font-size: 12px" />{{ $t('导出交付物') }}</a-button> -->
      <span class="gantt-switch-container">
        <a-switch v-model:checked="ifPlayPicture" @change="handleKeyIndicatorChange($event)" style="margin-right: 5px" />
        <span style="margin-right: 5px">{{ $t('显示甘特图') }}</span>
      </span>
    </div>

    <!-- 任务表格 -->
    <div class="task-table-container" v-if="ifPlayPicture == false">
      <a-table
        :scroll="{ x: 'max-content' }"
        row-key="id"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :locale="locale"
        v-model:expandedRowKeys="defaultExpandedKeys"
        @resizeColumn="handleResizeColumn"
        class="task-table"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <div v-if="record.hasAttachment == true && record.taskStatus != 0">
              <a v-if="record.taskStatus != 0" @click="selectFileInfo(record)" type="primary">查看附件</a>
            </div>
            <div v-else>/</div>
          </template>
          <!-- 操作列：把修改按钮放到这里，和未来的其他操作统一展示 -->
          <template v-if="column.dataIndex === 'operations'">
            <div v-if="record.nodeType != '阶段'" class="action-buttons">
              <!-- 当任务已完成时显示 修改 图标 -->
              <a-tooltip placement="top" title="变更">
                <a v-if="record.taskStatus == 2" @click.stop="confirmRollback(record)">
                  <EpcIcon type="icon-bianji1" style="font-size: 15px" />
                </a>
                <a v-else :disabled="true" type="primary"><EpcIcon type="icon-bianji1" style="font-size: 15px" /></a>
              </a-tooltip>
            </div>
          </template>
          <template v-if="column.dataIndex === 'roleName'">
            {{ record.roleName || '/' }}
          </template>
          <template v-if="column.dataIndex === 'planStartTime'">
            {{ record.planStartTime || '/' }}
          </template>
          <template v-if="column.dataIndex === 'planEndTime'">
            {{ record.planEndTime || '/' }}
          </template>
          <template v-if="column.dataIndex === 'actualStartTime'">
            {{ record.actualStartTime || '/' }}
          </template>
          <template v-if="column.dataIndex === 'actualEndTime'">
            <div v-if="record.taskStatus == 2">{{ record.actualEndTime }}</div>
            <div v-else>/</div>
            <!-- {{ record.actualEndTime || '/' }} -->
          </template>
          <template v-if="column.dataIndex === 'headUserName'">
            <div v-if="record.nodeType == '阶段'">/</div>
            <div v-else>
              <span style="display: inline-block; width: 80px">{{ record.headUserName }}</span>
            </div>
          </template>
          <!-- //0：待启动，1：正在工作，2已完成,3:驳回 -->
          <template v-if="column.dataIndex === 'taskStatus'">
            <span v-if="record.taskStatus == 0">待启动</span>
            <span v-if="record.taskStatus == 1" style="color: #e6a23c">正在工作</span>
            <span v-if="record.taskStatus == 2" style="color: #67c23a">已完成</span>
            <span v-if="record.taskStatus == 3" style="color: #9370db">驳回</span>
            <span v-if="!record.taskStatus && record.taskStatus !== 0">/</span>
          </template>
        </template>
      </a-table>
    </div>
    <div class="task-table-container" v-else>
      <Gantt ref="ganttRef" :tasks="ganttTasks" :columns="columns" style="height: calc(100vh - 222px)"></Gantt>
    </div>
  </div>
  <a-modal v-model:visible="isModalVisible" :style="{ width: '600px', height: '500px' }" title="查看文件" ok-text="确定" cancel-text="取消" :mask-closable="false">
    <div>
      <a-table
        :scroll="{ x: 'max-content' }"
        :locale="localeA"
        @resizeColumn="handleResizeColumn"
        style="height: calc(100% - 200px)"
        :columns="uploadColumnsInfoList"
        :pagination="false"
        :data-source="uploadInfoData">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a @click="priview(record)" type="link">预览</a>
            <a-divider type="vertical" />
            <!-- <a @click="downFile(record)" type="link">下载</a> -->
          </template>
        </template>
      </a-table>
    </div>
    <template #footer>
      <a-button @click="helckClick">
        {{ $t('关闭') }}
      </a-button>
    </template>
  </a-modal>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
.gantt-switch-container {
  display: flex;
  align-items: center;
  margin-left: auto; /* 这会让容器靠右 */
  margin-right: 20px; /* 右侧边距 */
}
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
