<template>
  <div class="module-library-approval">
    <CommonApprovalContent
      v-if="displayTitleList.length > 0"
      :title-list="displayTitleList"
      :data-list="displayDataList"
      :opinion="opinion" />
    <el-card v-else style="margin: 10px; min-height: 100px; margin-right: 30px">
      <el-empty description="暂无模块库审批数据" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CommonApprovalContent from './CommonApprovalContent.vue'

/** 模块库字段与表头映射（dataProp -> propertyName） */
const MODULE_FIELD_LABELS: Record<string, string> = {
  para1: '模型件号',
  para2: '模型编码',
  para3: '模型名称',
  para4: '模型类型',
  para5: '模型坐标系',
  para6: '英文名称',
  para7: '贡献者',
  para7Name: '贡献者',
  para8: '所属分类',
  para9: 'CAD计算重量',
  para10: '状态',
  para11: '备注',
  creatorName: '创建人',
}

/** 优先展示的列顺序（按 sort 排序） */
const MODULE_COLUMN_ORDER = [
  'para1',
  'para2',
  'para3',
  'para4',
  'para5',
  'para6',
  'para7',
  'para8',
  'para9',
  'para10',
  'para11',
  'creatorName',
]

/** 不在表格中展示的字段 */
const HIDDEN_FIELDS = new Set(['id', 'categoryId', 'creator', 'menuId', 'ROW_ID', 'confidentialLevel'])

const props = defineProps<{
  processInstance: any
  titleList: any[]
  opinion: string
}>()

const modelList = computed<any[]>(() => {
  console.log(props.processInstance?.formVariables, 'props.processInstance?.formVariables')
  const vars = props.processInstance?.formVariables ?? props.processInstance?.processVariables ?? {}
  const list = vars.ModelList
  return Array.isArray(list) ? list : []
})

function hasColumnValue(rows: any[], key: string) {
  return rows.some(row => {
    const val = row?.[key]
    return val != null && String(val).trim() !== ''
  })
}

function buildColumnsFromModelList(rows: any[]) {
  if (!rows.length) return []

  const orderedKeys = MODULE_COLUMN_ORDER.filter(key => hasColumnValue(rows, key))
  const extraKeys = Object.keys(rows[0] ?? {}).filter(
    key => !HIDDEN_FIELDS.has(key) && !MODULE_COLUMN_ORDER.includes(key) && hasColumnValue(rows, key),
  )

  return [...orderedKeys, ...extraKeys].map(key => ({
    key,
    value: MODULE_FIELD_LABELS[key] ?? key,
  }))
}

const displayTitleList = computed(() => {
  if (props.titleList?.length) return props.titleList
  return buildColumnsFromModelList(modelList.value)
})

const displayDataList = computed(() => {
  return modelList.value
})
</script>

<style lang="scss" scoped>
.module-library-approval {
  width: 100%;
}
</style>
