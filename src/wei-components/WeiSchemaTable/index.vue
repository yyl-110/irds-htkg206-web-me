<script lang="ts" setup>
import type { BaseModel } from '@wei/openapi-codegen/es/src/BaseModel'
import type { BaseUISchema } from '@wei/openapi-codegen/es/src/BaseUISchema'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { ColumnsType } from 'ant-design-vue/es/table/Table'
import { tableProps } from 'ant-design-vue/es/table/Table' // 引入组件定义的 props
import { computed, ref } from 'vue'

const props = defineProps({
  ...tableProps(),
  /** 是否在最后增加额外的操作列 */
  schemaActionColumn: {
    type: [Object, Boolean],
    default: true,
    required: false,
    validator(column: ColumnType) {
      return column.key === '$$action'
    },
  },
})
const actionColumn: ColumnType = {
  key: '$$action',
  title: '操作',
}
// 定义 props

const tableColumns = computed<ColumnsType>(() => {
  if (!props.columns)
    return []
  const columnsProp = props.columns as BaseUISchema<BaseModel>['columns']
  const _columns = columnsProp.map((c) => {
    return {
      ...c,
      title: c.schemaTitle || c.title,
      label: c.schemaTitle || c.label,
    }
  })
  if (props.schemaActionColumn) {
    const actionCol = props.schemaActionColumn === true ? actionColumn : (props.schemaActionColumn as ColumnType<any>)
    return _columns.concat(actionCol as any)
  }
  else {
    return _columns
  }
})

// console.log(tableColumns)

const component = ref()

defineExpose({ component })
</script>

<template>
  <a-card class="mb-4">
    <a-table ref="component" class="wei-schema-table" v-bind="props" :columns="tableColumns" :scroll="{ x: 'auto' }" :row-class-name="(record, index) => index % 2 === 0 ? 'odd' : 'even'">
      <template v-for="(slot, k) in $slots" :key="k" #[k]="slotProps">
        <!-- <component :is="(slot as any)" v-bind="slotProps"></component> -->
        <slot :name="k" v-bind="slotProps" />
      </template>
    </a-table>
  </a-card>
</template>
