<template>
  <a-card class="common-approval-content-card" :bordered="false" :title="$t('签审列表')">
    <template #extra>
      <a-input v-model:value="searchContent" allow-clear :placeholder="$t('请输入关键字检索')" style="width: 245px" />
    </template>

    <a-table
      :columns="tableColumns"
      :data-source="tableData"
      :locale="{ emptyText: renderTableEmptyText('暂无数据') }"
      :row-class-name="rowClassName"
      :pagination="false"
      :row-key="rowKey"
      bordered
      class="workbench-main-table bg-white tableinfo__table"
      :scroll="{ x: tableScrollX }"
      @resize-column="handleResizeColumn">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === '__index'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.key === 'para10' || column.key === 'state'">
          <a-tag v-if="record[column.key]" :color="getStatusTagColor(record[column.key])">
            {{ record[column.key] }}
          </a-tag>
          <span v-else class="text-[#8c8c8c]">—</span>
        </template>
        <template v-else-if="isLinkField(column.key)">
          <a
            class="wb-cell-link"
            :title="String(record[column.key] ?? '')"
            @click.stop="handleRowClick(record, column.key)">
            {{ record[column.key] ?? '—' }}
          </a>
        </template>
        <template v-else>
          <span
            :class="{ 'wb-cell-link': isClickable(column.key) }"
            :title="String(record[column.key] ?? '')"
            @click="isClickable(column.key) && handleRowClick(record, column.key)">
            {{ record[column.key] ?? '—' }}
          </span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { renderTableEmptyText } from '@/utils/emptyState'

const props = defineProps<{
  titleList: any[]
  dataList: any[]
  opinion?: string
  clickableFields?: string[]
  linkFields?: string[]
}>()

const emit = defineEmits<{
  (e: 'row-click', row: any, field: string): void
}>()

const searchContent = ref<string>('')
const tableColumns = ref<any[]>([])

const tableData = computed(() => {
  const keyword = searchContent.value.trim().toLowerCase()
  const source = props.dataList ?? []
  if (!keyword) return source

  const searchKeys = (props.titleList ?? []).map(item => item.key)
  return source.filter(row => {
    const values = searchKeys.length ? searchKeys.map(key => row?.[key]) : Object.values(row ?? {})
    return values.some(val =>
      String(val ?? '')
        .toLowerCase()
        .includes(keyword),
    )
  })
})

const tableScrollX = computed(() => tableColumns.value.reduce((sum, col) => sum + (Number(col.width) || 120), 0))

watch(
  () => props.titleList,
  list => {
    tableColumns.value = [
      { title: '序号', key: '__index', width: 60, align: 'center', fixed: 'left', resizable: true },
      ...(list ?? []).map((item: any) => ({
        title: item.value,
        dataIndex: item.key,
        key: item.key,
        width: item.colWidth ?? 150,
        ellipsis: true,
        resizable: true,
      })),
    ]
  },
  { immediate: true, deep: true },
)

function handleResizeColumn(width: number, col: any) {
  col.width = width
}

const rowKey = (record: any, index?: number) => String(record?.id ?? record?.ROW_ID ?? index ?? '')

function rowClassName(_record: any, index: number) {
  return index % 2 === 1 ? 'table-striped' : ''
}

function isClickable(field: string) {
  const clickable = props.clickableFields || ['name', 'orderNo', 'areaConfigName', 'designModel']
  return clickable.includes(field)
}

function isLinkField(field: string) {
  return (props.linkFields ?? []).includes(field)
}

const handleRowClick = (row: any, field: string) => {
  emit('row-click', row, field)
}

function getStatusTagColor(status: string) {
  const map: Record<string, string> = {
    设计中: 'processing',
    编制中: 'success',
    已发布: 'success',
    审核中: 'warning',
    停用: 'default',
    已停用: 'default',
    审阅中: 'processing',
    重新工作: 'processing',
  }
  return map[status] ?? 'default'
}
</script>

<style lang="scss" scoped>
.common-approval-content-card {
  margin: 10px 10px 10px 0;
  min-height: 100px;

  :deep(.ant-card-head) {
    min-height: 48px;
    padding: 0 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.ant-card-head-title) {
    padding: 12px 0;
    font-size: 15px;
    font-weight: 700;
    color: #313133;
  }

  :deep(.ant-card-extra) {
    padding: 8px 0;
  }

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.wb-cell-link {
  color: var(--ant-primary-color);
  cursor: pointer;
  text-decoration: underline;
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

:deep(.workbench-main-table .ant-table-thead > tr > th.ant-table-cell-fix-left),
:deep(.workbench-main-table .ant-table-thead > tr > th.ant-table-cell-fix-right) {
  background: #f7f8fa;
}

:deep(.workbench-main-table .ant-table-tbody > tr > td.ant-table-cell-fix-left),
:deep(.workbench-main-table .ant-table-tbody > tr > td.ant-table-cell-fix-right) {
  background: #fff;
}

:deep(.workbench-main-table .ant-table-tbody > tr.table-striped > td) {
  background: #fafbfc;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
