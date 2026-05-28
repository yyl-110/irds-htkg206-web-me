<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { DICT_TYPE } from '@/utils/dict'
import { formatPast2 } from '@/utils/formatTime'
import * as TaskApi from '@/api/bpm/task'
import { useDateRangeParams } from '@/hooks/useDate'
import { useRender } from '@/components/escape'
import Empty from '@/components/Empty/index.vue'
import { EpcIcon } from '@/components/icon/EpcIcon'
import { WeiI18n } from '@/utils/WeiI18n'
const { push } = useRouter() // 路由
// 它和【待办任务】【已办任务】的差异是，该菜单可以看全部的流程任务
defineOptions({ name: 'BpmManagerTask' })

const loading = ref(true)
const total = ref(0)
const list = ref<Record<string, any>[]>([])

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  orderByBean: {
    attributeName: '',
    sortType: '',
  },
  params: {
    name: '' as string | undefined,
    createTime: [] as string[] | undefined,
    processBusinessTypeName: undefined as string | undefined,
    formFieldsParams: '{}',
  },
})

const { dateRange, dateRangeParams } = useDateRangeParams()

type TaskManagerRow = Record<string, any>

const columns = ref<TableColumnType<TaskManagerRow>[]>([
  {
    title: '流程名称',
    dataIndex: 'processName',
    key: 'processName',
    width: 180,
    align: 'left',
    ellipsis: { showTitle: true },
  },
  {
    title: '流程主题',
    dataIndex: 'processSubject',
    key: 'processSubject',
    width: 280,
    align: 'left',
    ellipsis: { showTitle: true },
  },
  { title: '发起人', dataIndex: 'startUser', key: 'startUser', width: 100, align: 'center' },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 180,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '当前任务', dataIndex: 'name', key: 'name', width: 180, align: 'left', ellipsis: { showTitle: true } },
  {
    title: '任务开始时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  {
    title: '任务结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: 180,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '审批人', dataIndex: 'assigneeUser', key: 'assigneeUser', width: 100, align: 'center' },
  { title: '审批状态', dataIndex: 'status', key: 'status', width: 120, align: 'center' },
  { title: '审批建议', dataIndex: 'reason', key: 'reason', width: 180, align: 'left', ellipsis: { showTitle: true } },
  { title: '耗时', dataIndex: 'durationInMillis', key: 'durationInMillis', width: 160, align: 'center' },
  // {
  //   title: '流程编号',
  //   dataIndex: 'processInstanceId',
  //   key: 'processInstanceId',
  //   width: 220,
  //   align: 'center',
  //   ellipsis: { showTitle: true },
  // },
  // { title: '任务编号', dataIndex: 'id', key: 'id', width: 220, align: 'center', ellipsis: { showTitle: true } },
  { title: '操作', dataIndex: 'operation', key: 'id', width: 80, align: 'center', fixed: 'right' },
])

const BPM_TASK_MANAGER_TABLE_SCROLL_BUFFER = 24
const taskManagerTableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + BPM_TASK_MANAGER_TABLE_SCROLL_BUFFER
})

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '暂无数据',
    style: { paddingBottom: '50px' },
  }),
})

function taskManagerTableRowClassName(_record: TaskManagerRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function taskManagerPaginationShowTotal(totalCount: number) {
  return `${WeiI18n.$t('共')}${totalCount}${WeiI18n.$t('条')}`
}

function taskManagerPaginationBuildOptionText(prop: { value: number }) {
  return `${prop.value}${WeiI18n.$t('条/页')}`
}

async function getList() {
  loading.value = true
  try {
    const data = await TaskApi.getTaskManagerPage({
      ...queryParams,
      params: {
        ...queryParams.params,
        createTime: dateRangeParams.value,
      },
    })
    if (data.data.code === 200) {
      list.value = data.data.data.data || []
      total.value = data.data.data.count || 0
    }
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageIndex = 1
  const formFields: Record<string, string> = { PROCESS_BUSINESS_TYPE_NAME: '' }
  if (queryParams.params.processBusinessTypeName) {
    formFields.PROCESS_BUSINESS_TYPE_NAME = queryParams.params.processBusinessTypeName
  }
  queryParams.params.formFieldsParams = JSON.stringify(formFields)
  getList()
}

function resetQuery() {
  queryParams.params.name = ''
  queryParams.params.processBusinessTypeName = undefined
  dateRange.value = null
  handleQuery()
}

function handlePagTable(page: number, pageSize: number) {
  queryParams.pageIndex = page
  queryParams.pageRows = pageSize
  getList()
}
/** 处理审批按钮 */
const handleAudit = (row: any) => {
  push({
    name: 'BpmProcessInstanceDetailA',
    query: {
      id: row.processInstance.id,
      readType: 0,
    },
  })
}
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="drawerContent bpm-task-manager-page-root">
    <a-card class="bpm-task-manager-list-card">
      <div class="bpm-task-manager-list-body-scroll">
        <a-form
          class="calc-toolbar-form bpm-task-manager-toolbar-form"
          layout="inline"
          :model="queryParams"
          @finish="handleQuery">
          <a-form-item name="params.name">
            <a-input
              v-model:value="queryParams.params.name"
              style="width: 200px"
              allow-clear
              placeholder="请输入任务名称"
              @press-enter="handleQuery" />
          </a-form-item>
          <a-form-item name="params.processBusinessTypeName">
            <a-input
              v-model:value="queryParams.params.processBusinessTypeName"
              style="width: 200px"
              allow-clear
              placeholder="请输入流程主题"
              @press-enter="handleQuery" />
          </a-form-item>
          <a-form-item>
            <a-range-picker
              v-model:value="dateRange"
              style="width: 240px; text-align: left"
              :placeholder="['开始日期', '结束日期']" />
          </a-form-item>
          <a-form-item class="bpm-task-manager-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              查询
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="bpm-task-manager-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: taskManagerTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="list"
          :pagination="false"
          :loading="loading"
          :row-class-name="taskManagerTableRowClassName">
          <template #headerCell="{ column }">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'processName'">
              {{ record.processInstance?.name }}
            </template>
            <template v-else-if="column.dataIndex === 'processSubject'">
              {{ record.processInstance?.processVariables?.PROCESS_BUSINESS_TYPE_NAME }}
            </template>
            <template v-else-if="column.dataIndex === 'startUser'">
              <a-tooltip :title="record.processInstance?.startUser?.account" placement="top">
                <span>{{ record.processInstance?.startUser?.nickname }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'startTime'">
              {{ useRender.renderDate(record.createTime) }}
            </template>
            <template v-else-if="column.dataIndex === 'assigneeUser'">
              <a-tooltip :title="record.assigneeUser?.account" placement="top">
                <span>{{ record.assigneeUser?.nickname }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'durationInMillis'">
              {{ formatPast2(record.durationInMillis) }}
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="handleAudit(record)">历史</a>
            </template>
          </template>
        </a-table>

        <div class="bpm-task-manager-list-pagination">
          <a-pagination
            v-model:current="queryParams.pageIndex"
            v-model:page-size="queryParams.pageRows"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="total"
            :show-total="taskManagerPaginationShowTotal"
            :build-option-text="taskManagerPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.drawerContent.bpm-task-manager-page-root {
  height: 100%;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  position: static;
  background-color: #ffffff;
}

.calc-toolbar-form {
  gap: 4px;
}

.bpm-task-manager-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.bpm-task-manager-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.bpm-task-manager-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 8px;
}

.bpm-task-manager-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.bpm-task-manager-list-card {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: none;
  overflow: hidden;

  :deep(.ant-card-body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: 12px 20px 0;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.bpm-task-manager-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bpm-task-manager-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.bpm-task-manager-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.bpm-task-manager-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.bpm-task-manager-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.bpm-task-manager-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.bpm-task-manager-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.bpm-task-manager-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.bpm-task-manager-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.bpm-task-manager-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.bpm-task-manager-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.bpm-task-manager-list-table.exe-config-table.parameter-table-spaced {
  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
}

.header-cell-main--static {
  padding-right: 0;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}
</style>
