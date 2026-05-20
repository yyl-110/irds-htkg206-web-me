<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import * as DefinitionApi from '@/api/bpm/definition'
import { setConfAndFields2 } from '@/utils/formCreate'
import { DICT_TYPE } from '@/utils/dict'
import { BpmModelFormType } from '@/utils/constants'
import { useRender } from '@/components/escape'
import { Dialog } from '@/components/Dialog'
import Empty from '@/components/Empty/index.vue'
import { WeiI18n } from '@/utils/WeiI18n'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'BpmProcessDefinition' })

const { t } = useI18n()
const { push } = useRouter()
const { query } = useRoute()

const loading = ref(true)
const total = ref(0)
const list = ref<Record<string, any>[]>([])

const queryParams = reactive({
  pageIndex: 1,
  pageRows: 10,
  params: {
    key: query.key as string | undefined,
  },
})

type DefinitionRow = Record<string, any>

const columns = ref<TableColumnType<DefinitionRow>[]>([
  { title: '流程名称', dataIndex: 'name', key: 'name', width: 150, align: 'left', ellipsis: { showTitle: true } },
  { title: '可见范围', dataIndex: 'startUsers', key: 'startUsers', width: 120, align: 'center' },
  { title: '流程类型', dataIndex: 'modelType', key: 'modelType', width: 120, align: 'center' },
  { title: '表单信息', dataIndex: 'formInfo', key: 'formInfo', width: 180, align: 'left', ellipsis: { showTitle: true } },
  { title: '流程版本', dataIndex: 'version', key: 'version', width: 96, align: 'center' },
  {
    title: '部署时间',
    dataIndex: 'deploymentTime',
    key: 'deploymentTime',
    width: 180,
    align: 'center',
    customRender: ({ text }) => useRender.renderDate(text),
  },
  { title: '操作', dataIndex: 'operation', key: 'operation', width: 88, align: 'center', fixed: 'right' },
])

const BPM_DEFINITION_TABLE_SCROLL_BUFFER = 24
const definitionTableScrollX = computed(() => {
  let sum = 0
  for (const col of columns.value) {
    const w = col.width
    sum += typeof w === 'number' ? w : Number(w) || 0
  }
  return sum + BPM_DEFINITION_TABLE_SCROLL_BUFFER
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

function definitionTableRowClassName(_record: DefinitionRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even'
}

function definitionPaginationShowTotal(totalCount: number) {
  return `${WeiI18n.$t('共')}${totalCount}${WeiI18n.$t('条')}`
}

function definitionPaginationBuildOptionText(prop: { value: number }) {
  return `${prop.value}${WeiI18n.$t('条/页')}`
}

function getStartUsersTooltip(record: DefinitionRow) {
  const users = record.startUsers as { nickname?: string }[] | undefined
  if (!users?.length) return ''
  return users.map((user) => user.nickname).join('、')
}

async function getList() {
  loading.value = true
  try {
    const res = await DefinitionApi.getProcessDefinitionPage(queryParams)
    if (res.data.code === 200) {
      list.value = res.data.data.data
      total.value = res.data.data.count
    }
  } finally {
    loading.value = false
  }
}

function handlePagTable(page: number, pageSize: number) {
  queryParams.pageIndex = page
  queryParams.pageRows = pageSize
  getList()
}

const formDetailVisible = ref(false)
const formDetailPreview = ref({
  rule: [],
  option: {},
})

async function handleFormDetail(row: DefinitionRow) {
  if (row.formType === BpmModelFormType.NORMAL) {
    setConfAndFields2(formDetailPreview, row.formConf, row.formFields)
    formDetailVisible.value = true
  } else {
    await push({
      path: row.formCustomCreatePath,
    })
  }
}

function getFormInfoLabel(row: DefinitionRow) {
  if (row.formType === BpmModelFormType.NORMAL) {
    return row.formName as string
  }
  if (row.formType === BpmModelFormType.CUSTOM) {
    return row.formCustomCreatePath as string
  }
  return t('暂无表单')
}

function hasFormLink(row: DefinitionRow) {
  return row.formType === BpmModelFormType.NORMAL || row.formType === BpmModelFormType.CUSTOM
}

async function openModelForm(id?: number) {
  await push({
    name: 'BpmModelUpdate',
    params: { id, type: 'definition' },
  })
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="drawerContent bpm-definition-page-root">
    <a-card class="bpm-definition-list-card">
      <div class="bpm-definition-list-body-scroll">
        <a-table
          class="bpm-definition-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: definitionTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="list"
          :pagination="false"
          :loading="loading"
          :row-class-name="definitionTableRowClassName">
          <template #headerCell="{ column }">
            <div class="header-cell-main header-cell-main--static">
              <span class="header-title-sort header-title-sort--disabled">
                <span>{{ column.title }}</span>
              </span>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'startUsers'">
              <span v-if="!record.startUsers?.length">全部可见</span>
              <span v-else-if="record.startUsers.length === 1">
                {{ record.startUsers[0].nickname }}
              </span>
              <a-tooltip v-else placement="top" :title="getStartUsersTooltip(record)">
                <span>
                  {{ record.startUsers[0].nickname }}等 {{ record.startUsers.length }} 人可见
                </span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'modelType'">
              <dict-tag :value="record.modelType" :type="DICT_TYPE.BPM_MODEL_TYPE" />
            </template>
            <template v-else-if="column.dataIndex === 'formInfo'">
              <a v-if="hasFormLink(record)" @click="handleFormDetail(record)">
                {{ getFormInfoLabel(record) }}
              </a>
              <span v-else>{{ getFormInfoLabel(record) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'version'">
              <a-tag>v{{ record.version }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="openModelForm(record.id)">恢复</a>
            </template>
          </template>
        </a-table>

        <div class="bpm-definition-list-pagination">
          <a-pagination
            v-model:current="queryParams.pageIndex"
            v-model:page-size="queryParams.pageRows"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="total"
            :show-total="definitionPaginationShowTotal"
            :build-option-text="definitionPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
    </a-card>
  </div>

  <Dialog v-model="formDetailVisible" title="表单详情" width="800">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>
</template>

<style scoped lang="less">
.drawerContent.bpm-definition-page-root {
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

.bpm-definition-list-card {
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

.bpm-definition-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bpm-definition-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.bpm-definition-list-card :deep(.parameter-table-spaced) {
  margin-top: 15px;
}

.bpm-definition-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.bpm-definition-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.bpm-definition-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.bpm-definition-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.bpm-definition-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.bpm-definition-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.bpm-definition-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.bpm-definition-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.bpm-definition-list-table.exe-config-table.parameter-table-spaced {
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
