<template>
  <div class="task-table-container">
    <a-table
      :scroll="{ x: 1200 }"
      :pagination="false"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :data-source="tableData"
      @resizeColumn="handleResizeColumn"
      :locale="locale"
      :loading="loading"
      class="task-table"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.dataIndex === 'projectCategory'">
          <div v-if="record.projectCategory === '1'">市场执行项目</div>
          <span v-else-if="record.projectType === '2'">{{ $t('科技开发项目') }}</span>
          <span v-else-if="record.projectType === '3'"> {{ $t('机电业务项目') }}</span>
          <span v-else-if="record.projectType === '4'">{{ $t('检修运维项目') }}</span>
        </template>
        <template v-if="column.dataIndex === 'projectType'">
          <div v-if="record.projectType === '1'">一般改进型产品</div>
          <div v-else-if="record.projectType === '2'">重大改进型产品</div>
          <div v-else-if="record.projectType === '3'">延续型产品</div>
          <div v-else>全新产品</div>
        </template>
        <template v-if="column.dataIndex === 'taskStatus'">
          <span>
            <span v-if="record.status === '0'">{{ $t('待启动') }}</span>
            <span v-else-if="record.status === '1'" style="color: blue">{{ $t('已发布') }}</span>
            <span v-else style="color: green">{{ $t('已发布') }}</span>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'operation'">
          <div class="cells">
            <template v-if="record.workStatus == 1 && !isSendTask">
              <a @click="startDes(record)">{{ '开始' }}</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="record.workStatus == 1 && !isSendTask && record.taskStatus != 1">
              <a @click="turnTo(record)">{{ '转办' }}</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="record.taskStatus == 0 && !isSendTask">
              <a @click="turnDown(record)">{{ '驳回' }}</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="(record.workStatus == 2 && !isSendTask) || (record.taskStatus == 2 && !isSendTask)">
              <a @click="seeE(record)">{{ '查看' }}</a>
              <a-divider type="vertical" />
            </template>
            <template v-if="record.type == 1 || record.type == 2">
              <a @click="seeSchmels(record)">{{ '查看进度' }}</a>
            </template>
          </div>
        </template>
      </template>
    </a-table>
    <div class="page">
      <span class="page-total">共 {{ page.total }} 条</span>
      <a-pagination
        v-model:current="page.currentPage"
        v-model:page-size="page.numberPage"
        :page-size-options="pageSizeOptions"
        :total="page.total"
        show-size-changer
        @change="change"
        @showSizeChange="onShowSizeChange">
        <template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  tableData: Array,
  // loading: Boolean,
  isSendTask: Boolean,
  page: {
    type: Object as PropType<PaginationProps>,
    default: () => ({
      current: 1,
      pageSize: 10,
      total: 0,
    }),
  },
});
const emit = defineEmits(['onShowSizeChange', 'detailTask', 'startTask', 'settingsTask', 'turnDownTask', 'turnToTask', 'exportTask', 'modificationTask', 'seeToTask', 'seeSchmel']);
interface PaginationProps {
  currentPage: number;
  numberPage: number;
  total: number;
}
const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50']);
/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRowList.value = selectedRows;
    parameterSelectRowIds.value = selectedRowKeys;
  },
};

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const loading = ref<boolean>(false);

const columns = ref<TableColumnType<any>[]>([
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
        [h('span', { innerText: index + 1 })]
      );
    },
  },
  {
    title: WeiI18n.$t('任务名称'),
    dataIndex: 'taskName',
    key: 'taskName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskName, b.taskName),
    width: 180,
  },
  {
    title: WeiI18n.$t('任务接收人'),
    dataIndex: 'designName',
    key: 'designName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.designName, b.designName),
    width: 130,
  },
  {
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'code',
    key: 'code',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.code, b.code),
    width: 120,
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'nameCN',
    key: 'nameCN',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.nameCN, b.nameCN),
    width: 180,
  },
  {
    title: WeiI18n.$t('平台名称'),
    dataIndex: 'platformName',
    key: 'platformName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.platformName, b.platformName),
    width: 180,
  },
  {
    title: WeiI18n.$t('项目类别'),
    dataIndex: 'projectCategory',
    key: 'projectCategory',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectCategory, b.projectCategory),
    width: 130,
  },
  {
    title: WeiI18n.$t('项目类型'),
    dataIndex: 'projectType',
    key: 'projectType',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.projectType, b.projectType),
    width: 150,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'createName',
    key: 'createName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createName, b.createName),
    width: 130,
  },
  {
    title: WeiI18n.$t('计划开始时间'),
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.startTime, b.startTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('计划结束时间'),
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.endTime, b.endTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('实际开始时间'),
    dataIndex: 'acStartTime',
    key: 'acStartTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acStartTime, b.acStartTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('项目状态'),
    dataIndex: 'taskStatus',
    key: 'taskStatus',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskStatus, b.taskStatus),
    width: 120,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 280,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

function handleResizeColumn(w, col) {
  col.width = w;
}
const onShowSizeChange = (current: number, pageSize: number) => {
  emit('onShowSizeChange', current, pageSize);
};
const change = (current: number, pageSize: number) => {
  emit('onShowSizeChange', current, pageSize);
};

// 详情
function deitDes(row: any) {
  emit('detailTask', row);
}
// 查看进度seeSchmel
function seeSchmels(row: any) {
  debugger;
  emit('seeSchmel', row);
}
//seeSchmel

//任务开始
function startDes(row: any) {
  emit('startTask', row);
}

// 驳回
function turnDown(row: any) {
  emit('turnDownTask', row);
}

// 设置
function settings(row: any) {
  emit('settingsTask', row);
}
//转办
function turnTo(row: any) {
  emit('turnToTask', row);
}

function exportE(row: any) {
  emit('exportTask', row);
}
function editE(row: any) {
  emit('modificationTask', row);
}
function seeE(row: any) {
  emit('seeToTask', row);
}
</script>

<style scoped lang="less">
.task-table-container {
  flex: 1;
  height: calc(100vh - 440px);
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
.page {
  padding: 10px 0 0;
  margin-top: -12px;
  min-height: 52px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;
  gap: 12px;
  text-align: right;
}
.page-total {
  color: rgba(0, 0, 0, 0.65);
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  font-family: var(--ant-font-family, inherit);
}

.icon {
  cursor: pointer;

  :hover {
    color: #1971ff;
  }
}
.eltable {
  width: 100%;
}
:deep(.a-table__header-wrapper .caret-wrapper) {
  display: none;
}
.cells {
  display: flex;
  align-items: center;
  // gap: 16px;
}
:deep(.task-table-layout .ant-pagination-options) {
  font-size: 12px;
  line-height: 22px;
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
