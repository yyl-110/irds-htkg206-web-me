<template>
  <a-table
    :columns="taskColumns"
    :data-source="tasks"
    :loading="listLoading"
    :locale="{ emptyText: renderTableEmptyText('暂无数据') }"
    :pagination="false"
    :row-key="rowKey"
    bordered
    class="workbench-main-table bg-white process-task-list-table"
    :scroll="{ x: 1200 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'assignee'">
        {{ record.assigneeUser?.nickname || record.ownerUser?.nickname || '—' }}
      </template>
      <template v-else-if="column.key === 'createTime'">
        {{ formatCellDate(record.createTime) }}
      </template>
      <template v-else-if="column.key === 'endTime'">
        {{ formatCellDate(record.endTime) }}
      </template>
      <template v-else-if="column.key === 'status'">
        <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="record.status" />
      </template>
      <template v-else-if="column.key === 'reason'">
        {{ record.reason || '—' }}
      </template>
      <template v-else-if="column.key === 'transferRecords'">
        {{ record.transferRecords || '—' }}
      </template>
      <template v-else-if="column.key === 'durationInMillis'">
        {{ formatPast2(record.durationInMillis) }}
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE } from '@/utils/dict'
import { renderTableEmptyText } from '@/utils/emptyState'
import * as TaskApi from '@/api/bpm/task'
import DictTag from '@/components/DictTag/src/DictTag.vue'

defineOptions({ name: 'BpmProcessInstanceTaskList' })

const props = defineProps({
  /** 兼容管理端抽屉：为 true 时触发拉取 */
  loading: propTypes.bool.def(false),
  id: propTypes.string,
  /** 父级审批成功后递增，用于刷新流转记录 */
  refreshKey: propTypes.number.def(0),
})

const tasks = ref<any[]>([])
const listLoading = ref(false)

const taskColumns = [
  { title: '审批节点', dataIndex: 'name', key: 'name', width: 120, align: 'center', ellipsis: true },
  { title: '审批人', key: 'assignee', width: 100, align: 'center', ellipsis: true },
  { title: '开始时间', key: 'createTime', width: 140, align: 'center' },
  { title: '结束时间', key: 'endTime', width: 140, align: 'center' },
  { title: '审批状态', key: 'status', width: 90, align: 'center' },
  { title: '审批建议', dataIndex: 'reason', key: 'reason', width: 200, align: 'center', ellipsis: true },
  { title: '转办记录', key: 'transferRecords', width: 200, align: 'center', ellipsis: true },
  { title: '耗时', key: 'durationInMillis', width: 100, align: 'center' },
]

const rowKey = (record: any, index?: number) => String(record?.id ?? index ?? '')

function formatCellDate(value: unknown) {
  return dateFormatter({}, {}, value) || '—'
}

async function fetchTasks() {
  if (!props.id) return
  listLoading.value = true
  try {
    const res = await TaskApi.getTaskListByProcessInstanceId(props.id)
    if (res.data.code === 200) {
      tasks.value = res.data.data
    }
  } finally {
    listLoading.value = false
  }
}

onMounted(() => {
  void fetchTasks()
})

watch(
  () => props.loading,
  value => {
    if (value) {
      void fetchTasks()
    }
  },
)

watch(
  () => props.refreshKey,
  (key, prev) => {
    if (key > 0 && key !== prev) {
      void fetchTasks()
    }
  },
)
</script>

<style lang="scss" scoped>
.process-task-list-table {
  margin-top: 10px;
}

:deep(.workbench-main-table .ant-table-thead > tr > th) {
  background: #f7f8fa;
  color: #313133;
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 1px solid #eaeaf1;
}

:deep(.workbench-main-table .ant-table-tbody > tr > td) {
  padding: 10px 12px;
  color: #313133;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.workbench-main-table .ant-table-tbody > tr:hover > td) {
  background: #f9fbff;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
