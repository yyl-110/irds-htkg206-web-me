<script lang="ts" setup>
import { computed, h, onActivated, onMounted, reactive, ref } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { DICT_TYPE } from '@/utils/dict'
import { useDictStore } from '@/store/modules/dict'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { CategoryApi } from '@/api/bpm/category'
import { useDateRangeParams } from '@/hooks/useDate'
import { useRender } from '@/components/escape'
import Empty from '@/components/Empty/index.vue'
import { EpcIcon } from '@/components/icon/EpcIcon'
import DictTag from '@/components/DictTag/src/DictTag.vue'
import ProcessDetailDrawer from './components/ProcessDetailDrawer.vue'
import { useMessage } from '@/hooks/web/useMessage'
import { WeiI18n } from '@/utils/WeiI18n'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'BpmProcessInstanceManager' })

const { t } = useI18n()
const msgBox = useMessage()
const dictStore = useDictStore()

const loading = ref(true)
const total = ref(0)
const list = ref<Record<string, any>[]>([])

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 20,
  orderByBean: {
    attributeName: '',
    sortType: '',
  },
  params: {
    startUserId: undefined as number | undefined,
    name: '' as string | undefined,
    processDefinitionId: undefined as string | undefined,
    processInstanceId: undefined as string | undefined,
    processBusinessTypeName: undefined as string | undefined,
    category: undefined as string | undefined,
    status: undefined as number | undefined,
    createTime: [] as string[] | undefined,
    formFieldsParams: '{}',
  },
})

const categoryQueryParams = reactive({
  pageIndex: 1,
  pageRows: 9999,
  params: {},
})

const categoryList = ref<any[]>([])
const { dateRange, dateRangeParams } = useDateRangeParams()

const processVariablesDialogVisible = ref(false)
const processVariablesContent = ref('')
/** 流程变量弹窗需高于 el-drawer（约 2000），避免在详情抽屉内打开时被遮挡 */
const PROCESS_VARIABLES_MODAL_Z_INDEX = 3000

function processVariablesModalGetContainer() {
  return document.body
}
const processDetailDrawerVisible = ref(false)
const currentProcessDetail = ref<Record<string, any>>()

const processInstanceStatusOptions = computed(() => dictStore.getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS))

type ProcessInstanceRow = Record<string, any>

const columns = ref<TableColumnType<ProcessInstanceRow>[]>([
  {
    title: '主题',
    dataIndex: 'subject',
    key: 'subject',
    width: 260,
    align: 'left',
    fixed: 'left',
    ellipsis: { showTitle: false },
  },
  { title: '任务名称', dataIndex: 'tasks', key: 'tasks', width: 120, align: 'center' },
  { title: '当前审批人', dataIndex: 'taskUser', key: 'taskUser', width: 120, align: 'center' },
  { title: '流程名称', dataIndex: 'name', key: 'name', width: 180, align: 'left', ellipsis: { showTitle: true } },
  {
    title: '流程分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 180,
    align: 'left',
    ellipsis: { showTitle: true },
  },
  { title: '发起人', dataIndex: 'startUser', key: 'startUser', width: 120, align: 'center' },
  {
    title: '发起部门',
    dataIndex: 'startUserDept',
    key: 'startUserDept',
    width: 120,
    align: 'center',
    ellipsis: { showTitle: true },
  },
  { title: '流程状态', dataIndex: 'status', key: 'status', width: 120, align: 'center' },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 170,
    align: 'left',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: 190,
    align: 'left',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '流程编号', dataIndex: 'id', key: 'id', width: 320, align: 'center', ellipsis: { showTitle: true } },
  { title: '操作', dataIndex: 'operation', key: 'operation', width: 190, align: 'center', fixed: 'right' },
])

const BPM_PI_MANAGER_TABLE_SCROLL_BUFFER = 24
const piManagerTableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + BPM_PI_MANAGER_TABLE_SCROLL_BUFFER
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

function piManagerTableRowClassName(_record: ProcessInstanceRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function piManagerPaginationShowTotal(totalCount: number) {
  return `${WeiI18n.$t('共')}${totalCount}${WeiI18n.$t('条')}`
}

function piManagerPaginationBuildOptionText(prop: { value: number }) {
  return `${prop.value}${WeiI18n.$t('条/页')}`
}

function getTipContent(row: Record<string, any>, label: string) {
  if (label === '当前审批人') {
    return h('div', [
      h('div', `名称：${row.assigneeUser?.nickname ?? ''}`),
      h('div', `工号：${row.assigneeUser?.account ?? ''}`),
    ])
  }
  if (label === '任务名称') {
    return h('div', '暂无任务状态')
  }
  if (label === '主题') {
    return h('div', [
      h('div', `流程编号：${row.id}`),
      h('div', `流程名称：${row.name}`),
      h('div', `流程分类：${row.categoryName}`),
      h('div', [
        '流程状态：',
        h(DictTag, {
          type: DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
          value: row.status,
        }),
      ]),
      h('div', `发起时间：${row.startTime}`),
      h('div', `结束时间：${row.endTime || '-'}`),
      h('div', `发起人：${row.startUser?.nickname}`),
      h('div', `发起部门：${row.startUser?.deptName}`),
    ])
  }
  return h('div', '暂无定义提示信息')
}

async function getList() {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getProcessInstanceManagerPage({
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
  queryParams.params.category = undefined
  queryParams.params.status = undefined
  queryParams.params.processInstanceId = undefined
  dateRange.value = null
  handleQuery()
}

function handlePagTable(page: number, pageSize: number) {
  queryParams.pageIndex = page
  queryParams.pageRows = pageSize
  getList()
}

async function handleCancel(row: ProcessInstanceRow) {
  try {
    const { value } = await msgBox.prompt('请输入取消原因', '取消流程')
    if (!value || !/^[\s\S]*.*\S[\s\S]*$/.test(value)) {
      message.error('取消原因不能为空')
      return
    }
    await ProcessInstanceApi.cancelProcessInstanceByAdmin(row.id, value)
    message.success(t('取消成功'))
    await getList()
  } catch {
    /* 取消或失败 */
  }
}

async function showProcessVariables(row: ProcessInstanceRow) {
  try {
    processVariablesContent.value = '加载中...'
    processVariablesDialogVisible.value = true
    const response = await ProcessInstanceApi.getProcessVariables(row.id)
    const payload = response?.data?.data
    if (payload != null && payload !== '') {
      processVariablesContent.value = JSON.stringify(payload, null, 2)
    } else {
      processVariablesContent.value = '暂无流程变量数据'
    }
  } catch (error) {
    console.error('获取流程变量失败:', error)
    processVariablesContent.value = '获取流程变量失败，请重试'
    message.error('获取流程变量失败')
  }
}

async function copyProcessVariables() {
  try {
    await navigator.clipboard.writeText(processVariablesContent.value)
    message.success('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败，请手动复制')
  }
}

function showProcessDetail(row: ProcessInstanceRow) {
  currentProcessDetail.value = row
  processDetailDrawerVisible.value = true
}

onMounted(async () => {
  await getList()
  const resp = await CategoryApi.getCategoryPage(categoryQueryParams)
  categoryList.value = resp.data.data.data || []
})
</script>

<template>
  <div class="drawerContent bpm-pi-manager-page-root">
    <a-card class="bpm-pi-manager-list-card">
      <div class="bpm-pi-manager-list-body-scroll">
        <a-form
          class="calc-toolbar-form bpm-pi-manager-toolbar-form"
          layout="inline"
          :model="queryParams"
          @finish="handleQuery">
          <a-form-item name="params.name">
            <a-input
              v-model:value="queryParams.params.name"
              style="width: 200px"
              allow-clear
              placeholder="请输入流程名称"
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
          <a-form-item name="params.category">
            <a-select
              v-model:value="queryParams.params.category"
              style="width: 200px; text-align: left"
              placeholder="请选择流程分类"
              allow-clear
              show-search>
              <a-select-option v-for="category in categoryList" :key="category.code" :value="category.code">
                {{ category.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="params.status">
            <a-select
              v-model:value="queryParams.params.status"
              style="width: 200px; text-align: left"
              placeholder="请选择流程状态"
              allow-clear
              show-search>
              <a-select-option v-for="dict in processInstanceStatusOptions" :key="dict.value" :value="dict.value">
                {{ dict.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-range-picker
              v-model:value="dateRange"
              style="width: 240px; text-align: left"
              :placeholder="['开始日期', '结束日期']" />
          </a-form-item>
          <a-form-item name="params.processInstanceId">
            <a-input
              v-model:value="queryParams.params.processInstanceId"
              style="width: 200px"
              allow-clear
              placeholder="请输入流程实例编号"
              @press-enter="handleQuery" />
          </a-form-item>
          <a-form-item class="bpm-pi-manager-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              查询
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="bpm-pi-manager-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: piManagerTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="list"
          :pagination="false"
          :loading="loading"
          :row-class-name="piManagerTableRowClassName">
          <template #headerCell="{ column }">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'subject'">
              <a-tooltip placement="top">
                <template #title>
                  <component :is="getTipContent(record, '主题')" />
                </template>
                <a class="process-title-link" @click="showProcessDetail(record)">
                  {{ record.processVariables?.PROCESS_BUSINESS_TYPE_NAME }}
                </a>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'tasks'">
              <template v-if="record.tasks?.length">
                <div v-for="task in record.tasks" :key="task.id">
                  <a-tooltip placement="top">
                    <template #title>
                      <component :is="getTipContent(task, '任务名称')" />
                    </template>
                    <a>{{ task.name }}</a>
                  </a-tooltip>
                </div>
              </template>
              <span v-else>-</span>
            </template>
            <template v-else-if="column.dataIndex === 'taskUser'">
              <template v-if="record.tasks?.length">
                <div v-for="task in record.tasks" :key="task.id">
                  <a-tooltip placement="top">
                    <template #title>
                      <component :is="getTipContent(task, '当前审批人')" />
                    </template>
                    <a>{{ task?.assigneeUser?.nickname }}</a>
                  </a-tooltip>
                </div>
              </template>
              <span v-else>-</span>
            </template>
            <template v-else-if="column.dataIndex === 'startUser'">
              <a-tooltip :title="record.startUser?.account" placement="top">
                <span>{{ record.startUser?.nickname }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'startUserDept'">
              {{ record.startUser?.deptName }}
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="showProcessVariables(record)">流程变量</a>
              <template v-if="record.status === 1">
                <a-divider type="vertical" />
                <a class="del-text" @click="handleCancel(record)">取消</a>
              </template>
            </template>
          </template>
        </a-table>

        <div class="bpm-pi-manager-list-pagination">
          <a-pagination
            v-model:current="queryParams.pageIndex"
            v-model:page-size="queryParams.pageRows"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="total"
            :show-total="piManagerPaginationShowTotal"
            :build-option-text="piManagerPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
    </a-card>
  </div>

  <a-modal
    v-model:visible="processVariablesDialogVisible"
    title="流程变量"
    width="60%"
    :mask-closable="false"
    :get-container="processVariablesModalGetContainer"
    :z-index="PROCESS_VARIABLES_MODAL_Z_INDEX">
    <a-textarea
      v-model:value="processVariablesContent"
      :rows="20"
      readonly
      placeholder="流程变量内容将显示在这里"
      class="process-variables-textarea" />
    <template #footer>
      <a-button @click="processVariablesDialogVisible = false"> 关闭 </a-button>
      <a-button type="primary" @click="copyProcessVariables"> 复制内容 </a-button>
    </template>
  </a-modal>

  <ProcessDetailDrawer
    v-model="processDetailDrawerVisible"
    :process-detail="currentProcessDetail"
    @show-process-variables="showProcessVariables" />
</template>

<style scoped lang="less">
.drawerContent.bpm-pi-manager-page-root {
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

.bpm-pi-manager-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.bpm-pi-manager-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.bpm-pi-manager-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 8px;
}

.bpm-pi-manager-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.bpm-pi-manager-list-card {
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

.bpm-pi-manager-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bpm-pi-manager-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.bpm-pi-manager-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.bpm-pi-manager-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.bpm-pi-manager-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.bpm-pi-manager-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.bpm-pi-manager-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.bpm-pi-manager-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.bpm-pi-manager-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.bpm-pi-manager-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.bpm-pi-manager-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.bpm-pi-manager-list-table.exe-config-table.parameter-table-spaced {
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

.process-title-link {
  cursor: pointer;
  transition: color 0.3s ease;
}

.process-title-link:hover {
  color: #1677ff;
}

.del-text {
  color: var(--ant-error-color);
}

.process-variables-textarea {
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}
</style>
