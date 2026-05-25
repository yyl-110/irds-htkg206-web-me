<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { CategoryApi, type CategoryVO } from '@/api/bpm/category'
import CategoryForm from './CategoryForm.vue'
import { useRender } from '@/components/escape'
import Empty from '@/components/Empty/index.vue'
import { EpcIcon } from '@/components/icon/EpcIcon'
import { useDateRangeParams } from '@/hooks/useDate'
import { WeiI18n } from '@/utils/WeiI18n'

defineOptions({ name: 'BpmCategory' })

const loading = ref(true)
const list = ref<CategoryVO[]>([])
const total = ref(0)
const queryFormRef = ref()
const { dateRange, dateRangeParams } = useDateRangeParams()

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    name: undefined as string | undefined,
    code: undefined as string | undefined,
    status: undefined as string | number | undefined,
    createTime: [] as string[] | undefined,
  },
})

type CategoryRow = CategoryVO

const columns = ref<TableColumnType<CategoryRow>[]>([
  { title: '分类编号', dataIndex: 'id', key: 'id', width: 100, align: 'center', ellipsis: { showTitle: true } },
  { title: '分类名', dataIndex: 'name', key: 'name', width: 140, align: 'left', ellipsis: { showTitle: true } },
  { title: '分类标志', dataIndex: 'code', key: 'code', width: 120, align: 'center', ellipsis: { showTitle: true } },
  { title: '分类描述', dataIndex: 'description', key: 'description', width: 160, align: 'left', ellipsis: { showTitle: true } },
  { title: '分类状态', dataIndex: 'status', key: 'status', width: 96, align: 'center' },
  { title: '分类排序', dataIndex: 'sort', key: 'sort', width: 100, align: 'center' },
  {
    title: '创建时间',
    dataIndex: 'creationDate',
    key: 'creationDate',
    width: 170,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '操作', dataIndex: 'operation', key: 'operation', width: 160, align: 'center', fixed: 'right' },
])

const BPM_CATEGORY_TABLE_SCROLL_BUFFER = 24
const categoryTableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + BPM_CATEGORY_TABLE_SCROLL_BUFFER
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

function categoryTableRowClassName(_record: CategoryRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function categoryPaginationShowTotal(totalCount: number) {
  return `${WeiI18n.$t('共')}${totalCount}${WeiI18n.$t('条')}`
}

function categoryPaginationBuildOptionText(prop: { value: number }) {
  return `${prop.value}${WeiI18n.$t('条/页')}`
}

function isCategoryStatusEnabled(status: unknown) {
  return status === 0 || status === '0'
}

/** 查询列表 */
async function getList() {
  loading.value = true
  try {
    const data = await CategoryApi.getCategoryPage({
      ...queryParams,
      params: {
        ...queryParams.params,
        createTime: dateRangeParams.value,
      },
    })
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

/** 重置 */
function resetQuery() {
  queryParams.params.name = undefined
  queryParams.params.code = undefined
  queryParams.params.status = undefined
  dateRange.value = null
  handleQuery()
}

const formRef = ref()
function openForm(type: string, id?: number) {
  formRef.value.open(type, id)
}

/** 删除 */
async function handleDelete(id: number) {
  try {
    await CategoryApi.deleteCategory(id)
    message.success('删除成功')
    await getList()
  } catch {
    /* 取消或失败 */
  }
}

function handlePagTable(page: number, pageSize: number) {
  queryParams.pageIndex = page
  queryParams.pageRows = pageSize
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="drawerContent bpm-category-page-root">
    <a-card class="bpm-category-list-card">
      <div class="bpm-category-list-body-scroll">
        <a-form
          ref="queryFormRef"
          class="calc-toolbar-form bpm-category-toolbar-form"
          layout="inline"
          :model="queryParams"
          @finish="handleQuery">
          <a-form-item name="params.name">
            <a-input
              v-model:value="queryParams.params.name"
              style="width: 200px"
              allow-clear
              placeholder="请输入分类名" />
          </a-form-item>
          <a-form-item name="params.code">
            <a-input
              v-model:value="queryParams.params.code"
              style="width: 200px"
              allow-clear
              placeholder="请输入分类标志" />
          </a-form-item>
          <a-form-item name="params.status">
            <a-select
              v-model:value="queryParams.params.status"
              style="width: 200px; text-align: left"
              placeholder="请选择分类状态"
              allow-clear
              show-search>
              <a-select-option :value="0">
                开启
              </a-select-option>
              <a-select-option :value="1">
                关闭
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-range-picker
              v-model:value="dateRange"
              style="width: 240px; text-align: left"
              :placeholder="['开始日期', '结束日期']" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="margin-left: 15px" @click="openForm('create')">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              新建
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="bpm-category-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: categoryTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="list"
          :pagination="false"
          :loading="loading"
          :row-class-name="categoryTableRowClassName">
          <template #headerCell="{ column }">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-tag v-if="isCategoryStatusEnabled(record.status)" color="blue">
                开启
              </a-tag>
              <a-tag v-else>
                关闭
              </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="openForm('update', record.id)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)">
                <a class="del-text">删除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>

        <div class="bpm-category-list-pagination">
          <a-pagination
            v-model:current="queryParams.pageIndex"
            v-model:page-size="queryParams.pageRows"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="total"
            :show-total="categoryPaginationShowTotal"
            :build-option-text="categoryPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
    </a-card>
  </div>

  <CategoryForm ref="formRef" @success="getList" />
</template>

<style scoped lang="less">
.drawerContent.bpm-category-page-root {
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

.bpm-category-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.bpm-category-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.bpm-category-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 8px;
}

.bpm-category-list-card {
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

.bpm-category-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bpm-category-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.bpm-category-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.bpm-category-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.bpm-category-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.bpm-category-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.bpm-category-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.bpm-category-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.bpm-category-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.bpm-category-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.bpm-category-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.bpm-category-list-table.exe-config-table.parameter-table-spaced {
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
