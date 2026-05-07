<template>
  <div class="tableinfo">
    <el-card>
      <template #header>
        <div class="tableinfo__header">
          <span>{{ $t('签审列表') }}</span>
        </div>
      </template>
      <div class="tableinfo__search">
        <el-input
          v-model="searchContent"
          clearable
          :placeholder="$t('请输入')"
          style="width: 245px"
          @clear="handleClear"
        ></el-input>
        <el-button type="primary" plain @click="handleSearch">
          {{ $t('查询') }}
        </el-button>
      </div>
      <div class="noborder-adujst-column-styles">
        <el-table
          class="tableinfo__table"
          header-cell-class-name="table-header-gray"
          :data="tableData"
          height="300"
          resizable
          border
        >
          <el-table-column :label="$t('序号')" type="index" width="60px" />
          <el-table-column
            v-for="(item, index) in titleList"
            :key="index"
            :label="item.value"
            width="120px"
            :prop="item.key"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span v-if="item.key === 'state'">
                <n-tag :type="renderTableTagFun(scope.row[item.key])?.type">
                  {{ scope.row[item.key] }}
                  <template #icon>
                    <gs-icon
                      svg
                      :icon="renderTableTagFun(scope.row[item.key])?.icon"
                      size="16px"
                    />
                  </template>
                </n-tag>
              </span>
              <span
                v-else
                :style="handleStyle(item.key)"
                @click="handleRowClick(scope.row, item.key)"
              >
                {{ scope.row[item.key] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps<{
  titleList: any[]
  dataList: any[]
  opinion?: string
  clickableFields?: string[]
}>()

const emit = defineEmits<{
  (e: 'search', content: string): void
  (e: 'row-click', row: any, field: string): void
}>()

const searchContent = ref<string>('')

const tableData = computed(() => props.dataList)
const handleClear = () => {
  searchContent.value = ''
  emit('search', '')
}

const handleSearch = () => {
  emit('search', searchContent.value)
}

const handleRowClick = (row: any, field: string) => {
  emit('row-click', row, field)
}

const handleStyle = (field: any) => {
  const clickable = props.clickableFields || ['name', 'orderNo', 'areaConfigName', 'designModel']
  return {
    color: clickable.includes(field) ? '#0158F0' : '#161e2e',
    cursor: 'pointer',
    'text-decoration': clickable.includes(field) ? 'underline' : 'none'
  }
}
watch(() => props.dataList, (newVal) => {
  console.log(newVal, props.titleList,'>>>>>>>>newVal')
}, {
  immediate: true
})
const renderTableTagFun = (status: any) => {
  if (!status) return null
  const iconList = {
    审阅中: { icon: 'icon_examine', type: 'info' },
    设计中: { icon: 'nav_cppz', type: 'info', color: { textColor: '#834BF4' } },
    重新工作: { icon: 'icon_examine', type: 'info' },
    已发布: { icon: 'yfb', type: 'success' },
    已关闭: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    已停售: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    废弃: { icon: 'ygb', type: 'success', color: { textColor: '#555D6D' } },
    发布异常: { icon: 'ygb', type: '', color: { textColor: '#555D6D' } }
  }

  return {
    bordered: false,
    type: iconList[status]?.type,
    size: 'small',
    color: iconList[status]?.color || undefined,
    icon: iconList[status]?.icon
  }
}
</script>
<style lang="scss" scoped>
.tableinfo{
  padding: 10px 30px 10px 10px;
  &__header{
    font-weight: 700;
  }
  &__search{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 8px;
  }
  &__table{
    margin-top: 16px;
  }
}
.noborder-adujst-column-styles {
  :deep(.el-table--border .el-table__cell) {
    border-right: none !important ;
  }
  :deep(.el-table__border-left-patch) {
    display: none !important;
  }
  :deep(.el-table--border .el-table__inner-wrapper::after),
  :deep(.el-table--border .el-table__inner-wrapper::before),
  :deep(.el-table--border:before),
  :deep(.el-table--border:after) {
    width: 0px !important;
  }
  :deep(.el-table .el-table__header thead th.is-leaf:not(:last-child)) {
    .cell {
      border-right: 1px solid var(--el-table-border-color) !important;
    }
  }
  :deep(.el-table) {
    .el-table__row {
      color: #161e2e;
    }
    .cell{
      .el-button {
        font-family: 'PingFang SC, Microsoft YaHei';
        font-weight: 400;
        background: none !important;
        color: #0158f0;
        height: 24px;
        font-size: 14px;
        padding: 0;
        margin-left: 0;
        &:not(.is-disabled):hover {
          color: #0158f0;
        }
        &.is-disabled {
          color: #161e2e;
        }
        &:not(:last-child){
          margin-right: 16px;
        }
      }
    }
  }
  // 列头单元格内容容器样式
  :deep(.el-table__header-wrapper) {
    .el-table__header {
      .el-table__cell {
        & > .cell {
          // 直接子元素.cell
          overflow-x: hidden;
          white-space: nowrap; // 强制不换行
          display: inline-flex; // 行内弹性布局
          align-items: center; // 垂直居中
          width:100%;
        }
      }
    }
  }
  // 排序图标样式
  :deep(.el-table__sort-icon) {
    margin-left: 4px; // 与标题保持间距
  }
}
</style>
