<template>
  <el-table-column
    :min-width="column.minWidth || 113"
    :prop="column.prop || column.field"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :sortable="column.sortable"
    v-bind="column.componentProps || {}"
    show-overflow-tooltip
  >
    <!-- 自定义列头模板 -->
    <template #header>
      <div class="table-header-with-filter">
        <div class="header-content">
          <!-- 如果有自定义表头插槽 -->
          <template v-if="column.headerSlotName">
            <slot :name="column.headerSlotName"></slot>
          </template>
          <template v-else>
            <autoTooltipText :text="column.label"></autoTooltipText>
          </template>
          
          <el-popover placement="bottom" :width="300" trigger="click" :visible="popoverShow" v-if="column.filterable">
            <template #reference>
              <!-- 筛选图标 -->
              <el-icon class="filter-icon" :class="{ 'filter-active': tempFilterValue || popoverShow }" @click="popoverShow = !popoverShow">
                <Filter />
              </el-icon>
            </template>
            <div class="filter-dialog">
              <!-- 根据 filterType 显示不同的筛选组件 -->
              <template v-if="column.filterType === 'select' && column.filterOptions">
                <el-select
                  v-model="tempFilterValue"
                  :placeholder="`请选择${column.label}`"
                  clearable
                  style="width: 100%"
                  @change="confirmFilter"
                >
                  <el-option
                    v-for="option in column.filterOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <template v-else>
                <el-input
                  v-model="tempFilterValue"
                  :placeholder="`请输入${column.label}筛选条件`"
                  clearable
                  @change="confirmFilter"
                />
              </template>
              <div class="filter-actions">
                <el-button @click="popoverShow = false" type="primary">{{ $t('关闭') }}</el-button>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </template>
    <!-- 自定义列模板 -->
    <template v-if="column.slotName" #default="scope">
      <slot :name="column.slotName" v-bind="scope"></slot>
    </template>

    <!-- 格式化内容 -->
    <template v-else-if="column.formatter" #default="scope">
      {{ column.formatter(scope.row) }}
    </template>
    <!-- <template v-if="column.children && column.children.length">
      <el-table-column prop="111" label="tes"></el-table-column>
    </template> -->
    <!-- 递归渲染子列 -->
    <template v-if="column.children && column.children.length">
      <RecursiveColumn v-for="child in column.children" :key="child.id" :column="child">
        <!-- 传递所有插槽 -->
        <template v-for="(_, slotName) in $slots" #[slotName]="scope">
          <slot :name="slotName" v-bind="scope"></slot>
        </template>
      </RecursiveColumn>
    </template>
  </el-table-column>
</template>

<script setup>
import autoTooltipText from '@/components/BasicDataSearchForm/auto-tooltip-text.vue'
import { Filter } from '@element-plus/icons-vue'
defineOptions({
  name: 'RecursiveColumn'
})
const props = defineProps({
  column: {
    required: true,
    type: Object
  }
})
const emit = defineEmits(['filter-change'])
const popoverShow = ref(false)
const tempFilterValue = ref('')

// 确认筛选
const confirmFilter = () => {
  emit('filter-change', {
    prop: props.column.prop || props.column.field,
    value: tempFilterValue.value.trim(),
    column: props.column
  })
}
</script>
<style scoped lang="scss">
.table-header-with-filter {
  display: flex;
  width: 100%;
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
.filter-icon {
  cursor: pointer;
  color: #c2c2c2;
  transition: color 0.3s;
  font-size: 13px;
}

.filter-icon:hover {
  color: #76dc78;
}

.filter-active {
  color: #76dc78;
}

.filter-dialog {
  padding: 10px 0;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
