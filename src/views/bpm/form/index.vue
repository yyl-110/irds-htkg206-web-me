<script lang="ts" setup>
import { computed, h, ref, reactive, watch } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import * as FormApi from '@/api/bpm/form'
import { setConfAndFields2 } from '@/utils/formCreate'
import { useRender } from '@/components/escape'
import { Dialog } from '@/components/Dialog'
import Empty from '@/components/Empty/index.vue'
import { EpcIcon } from '@/components/icon/EpcIcon'
import { WeiI18n } from '@/utils/WeiI18n'
import formCreate from '@form-create/element-ui'
defineOptions({ name: 'BpmForm' })

const { currentRoute, push } = useRouter()

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
    name: '',
  },
})

type FormRow = Record<string, any>

const columns = ref<TableColumnType<FormRow>[]>([
  { title: '编号', dataIndex: 'id', key: 'id', width: 200, align: 'center', ellipsis: { showTitle: true } },
  { title: '表单名', dataIndex: 'name', key: 'name', width: 180, align: 'left', ellipsis: { showTitle: true } },
  { title: '状态', dataIndex: 'status', key: 'status', width: 96, align: 'center' },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 160, align: 'left', ellipsis: { showTitle: true } },
  {
    title: '创建时间',
    dataIndex: 'creationDate',
    key: 'creationDate',
    width: 170,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '操作', dataIndex: 'operation', key: 'operation', width: 220, align: 'center', fixed: 'right' },
])

const BPM_FORM_TABLE_SCROLL_BUFFER = 24
const formTableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + BPM_FORM_TABLE_SCROLL_BUFFER
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

function formTableRowClassName(_record: FormRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function formPaginationShowTotal(totalCount: number) {
  return `${WeiI18n.$t('共')}${totalCount}${WeiI18n.$t('条')}`
}

function formPaginationBuildOptionText(prop: { value: number }) {
  return `${prop.value}${WeiI18n.$t('条/页')}`
}

function isFormStatusEnabled(status: unknown) {
  return status === 0 || status === '0'
}

/** 查询列表 */
async function getList() {
  loading.value = true
  try {
    const data = await FormApi.getFormPage(queryParams)
    if (data.data.code === 200) {
      list.value = data.data.data.data
      total.value = data.data.data.count
    }
  } finally {
    loading.value = false
  }
}

/** 搜索 */
function handleQuery() {
  queryParams.pageIndex = 1
  getList()
}

function handlePagTable(page: number, pageSize: number) {
  queryParams.pageIndex = page
  queryParams.pageRows = pageSize
  getList()
}

/**
 * 添加/修改操作
 */
function openForm(type: string, id?: number | string) {
  const toRouter: { name: string; query: { type: string; id?: number | string } } = {
    name: 'BpmFormEditor',
    query: { type },
  }
  if (typeof id === 'number' || typeof id === 'string') {
    toRouter.query.id = id
  }
  push(toRouter)
}

/** 删除 */
async function handleDelete(id: number) {
  try {
    await FormApi.deleteForm(id)
    message.success('删除成功')
    await getList()
  } catch {
    /* 取消或失败 */
  }
}

/** 详情 */
const detailVisible = ref(false)
const detailData = ref({
  rule: [],
  option: {},
})

async function openDetail(rowId: number) {
  const data = await FormApi.getForm(rowId)
  if (data.data.code !== 200) return
  setConfAndFields2(detailData, data.data.data.conf, data.data.data.fields)
  detailVisible.value = true
}

watch(
  () => currentRoute.value,
  () => {
    getList()
  },
  { immediate: true },
)
</script>

<template>
  <div class="drawerContent bpm-form-page-root">
    <a-card class="bpm-form-list-card">
      <div class="bpm-form-list-body-scroll">
        <a-form
          class="calc-toolbar-form bpm-form-toolbar-form"
          layout="inline"
          :model="queryParams"
          @finish="handleQuery">
          <a-form-item name="params.name">
            <a-input
              v-model:value="queryParams.params.name"
              style="width: 240px"
              allow-clear
              placeholder="请输入表单名" />
          </a-form-item>
          <a-form-item class="bpm-form-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              查询
            </a-button>
            <a-button type="primary" style="margin-left: 15px" @click="openForm('create')">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              新增
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="bpm-form-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: formTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="list"
          :pagination="false"
          :loading="loading"
          :row-class-name="formTableRowClassName">
          <template #headerCell="{ column }">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-tag v-if="isFormStatusEnabled(record.status)" color="blue">开启</a-tag>
              <a-tag v-else>关闭</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a v-hasPermi="['bpm:form:update']" @click="openForm('copy', record.id)">复制</a>
              <a-divider v-hasPermi="['bpm:form:update']" type="vertical" />
              <a v-hasPermi="['bpm:form:update']" @click="openForm('update', record.id)">编辑</a>
              <a-divider v-hasPermi="['bpm:form:query']" type="vertical" />
              <a v-hasPermi="['bpm:form:query']" @click="openDetail(record.id)">详情</a>
              <a-divider v-hasPermi="['bpm:form:delete']" type="vertical" />
              <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
                <a v-hasPermi="['bpm:form:delete']" class="del-text">删除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>

        <div class="bpm-form-list-pagination">
          <a-pagination
            v-model:current="queryParams.pageIndex"
            v-model:page-size="queryParams.pageRows"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="total"
            :show-total="formPaginationShowTotal"
            :build-option-text="formPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
    </a-card>
  </div>

  <Dialog v-model="detailVisible" title="表单详情" width="800">
    <form-create :option="detailData.option" :rule="detailData.rule" />
  </Dialog>
</template>

<style scoped lang="less">
.drawerContent.bpm-form-page-root {
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

.bpm-form-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.bpm-form-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.bpm-form-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 12px;
}

.bpm-form-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.bpm-form-list-card {
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

.bpm-form-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bpm-form-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.bpm-form-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.bpm-form-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.bpm-form-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.bpm-form-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.bpm-form-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.bpm-form-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.bpm-form-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.bpm-form-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.bpm-form-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.bpm-form-list-table.exe-config-table.parameter-table-spaced {
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

.del-text {
  color: var(--ant-error-color);
}
</style>
