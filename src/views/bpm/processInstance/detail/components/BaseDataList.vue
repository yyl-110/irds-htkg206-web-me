<template>
  <div class="listBox" :style="{ borderTop: props.ifBorderTop ? '1px solid #eceef3' : '' }">
    <div class="toolbar" v-if="$slots.toolbar"><slot name="toolbar"> </slot></div>
    <div class="tableBox noborder-adujst-column-styles">
      <!--v-loading="loading"-->
      <el-table
        v-loading="loading"
        resizable
        border
        :data="filteredTableData"
        height="100%"
        row-key="id"
        stripe
        @selection-change="handleSelectionChange">
        <template v-if="$slots.selectColumn">
          <slot name="selectColumn">
            <el-table-column type="selection" width="60" :selectable="selectable" />
          </slot>
        </template>
        <RecursiveTableColumn
          v-for="column in columns"
          :key="column.prop || column.field || column.label"
          :column="column"
          @filter-change="handleColumnFilterChange">
          <!-- 传递所有插槽 -->
          <template v-for="(_, slotName) in $slots" #[slotName]="scope">
            <slot :name="slotName" v-bind="scope"></slot>
          </template>
        </RecursiveTableColumn>
        <template v-if="$slots.operationsColumn">
          <slot name="operationsColumn">
            <el-table-column label="操作" width="110" fixed="right">
              <template #default="{ row }">
                <div style="display: flex">
                  <el-button link type="primary" size="small" @click="editRow(row)"> {{ $t('编辑') }} </el-button>
                  <el-button v-if="deleFlag" link type="primary" size="small" @click="openDelteDialog(row)">
                    {{ $t('删除') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </slot>
        </template>
      </el-table>
    </div>
    <div class="pageBox" v-if="ifPagination">
      <el-pagination
        :total="paginationData.total"
        v-model:current-page="paginationData.currentPage"
        v-model:page-size="paginationData.pageSize"
        :page-sizes="pageSizes"
        :size="pageDefaultData.size"
        :layout="pagesLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background />
    </div>
    <Dialog
      :dialogVisible="dialogVisible"
      :title="`${$t('确认是否删除')}？`"
      :content="`${$t('删除以后数据无法恢复，请谨慎处理')}。`"
      type="info"
      @update:dialogVisible="visible => (dialogVisible = visible)"
      @leftButtonClick="visible => (dialogVisible = visible)"
      @rightButtonClick="deleteDataFunc"></Dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, nextTick } from 'vue'
import RecursiveTableColumn from './RecursiveTableColumn.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEmpty } from 'lodash'
import Dialog from '@/components/BaseDialog/index.vue'
import { useRoute } from 'vue-router'
import useLoading from '@/hooks/web/loading'
import { pagesLayout, pageSizes, pageDefaultData } from '@/utils/page.ts'
const { isLoading, startLoading, closeLoading } = useLoading()
const route = useRoute()
const instance = getCurrentInstance()
// 可触发的事件
const props = defineProps({
  // 表单列
  columns: { type: Array, default: [] },
  // api接口
  apiLists: { type: Object, required: true },
  // 服务入参转换
  serveParamsTransForm: {
    type: Function,
    default: params => params,
  },
  deleFlag: { type: Boolean, default: true },
  ifPagination: { type: Boolean, default: true },
  ifBorderTop: { type: Boolean, default: true },
  // 添加 selectable 函数
  selectable: {
    type: Function,
    default: () => true,
  },
  deleteData: { type: Function },
  defaultParams: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const loading = ref(false)
// 筛选条件
const filters = ref({})
// 列表相关
const paginationData = ref(cloneDeep(pageDefaultData))
const pageDisabledFlag = ref(false)
const searchFormData = ref({})
const handleSizeChange = () => {
  getTableList(searchFormData.value)
}
const handleCurrentChange = () => {
  getTableList(searchFormData.value)
}
const tableData = ref()
const getTableList = async params => {
  startLoading()
  loading.value = true
  pageDisabledFlag.value = true
  const obj = {
    pageIndex: paginationData.value.currentPage,
    pageRows: paginationData.value.pageSize,
    params,
  }
  if (!isEmpty(props.defaultParams)) {
    obj.params = { ...props.defaultParams, ...params }
  }
  const res = await props.apiLists.query(props.serveParamsTransForm(obj), 'query').catch(() => {
    closeLoading()
    loading.value = false
    pageDisabledFlag.value = false
  })
  pageDisabledFlag.value = false
  closeLoading()
  loading.value = false
  tableData.value = []
  if (res.code === 800 && res.data) {
    nextTick(() => {
      tableData.value = Array.isArray(res.data) ? res.data : res.data.data
      emit('refreshTableData', tableData.value)
      paginationData.value.total = res.data.count
    })
  }
}

// 可触发的事件
const emit = defineEmits(['editTableData', 'selectTableData', 'refreshTableData'])
// 多选
const handleSelectionChange = val => {
  emit('selectTableData', val)
}
// 修改
const editRow = data => {
  emit('editTableData', data)
}

const rowData = ref(cloneDeep(props.defaultAddData))
const dialogVisible = ref(false)
// 可触发的事件
const openDelteDialog = data => {
  rowData.value = cloneDeep(data)
  dialogVisible.value = true
}

// 删除数据
const deleteDataFunc = async () => {
  if (props.deleteData) {
    const deleteFlag = await props.deleteData(rowData.value)
    if (deleteFlag) {
      dialogVisible.value = false
    }
    return
  }
  const res = await props.apiLists.delete(props.serveParamsTransForm(rowData.value.id, 'delete'))
  if (res.code === 800) {
    dialogVisible.value = false
    ElMessage({ message: res.msg, type: 'success' })
    getTableList(searchFormData.value)
  }
}

onMounted(() => {
  getTableList(searchFormData.value)
  instance?.appContext.config.globalProperties.$bus.on(`queryBaseDataList:${route.name}`, ({ params, pageConfig }) => {
    if (pageConfig) {
      paginationData.value = { ...paginationData.value, ...pageConfig }
    }
    if (params) {
      searchFormData.value = cloneDeep(params)
      getTableList(searchFormData.value)
    } else {
      getTableList(searchFormData.value)
    }
  })
})
onUnmounted(() => {
  instance?.appContext.config.globalProperties.$bus.off(`queryBaseDataList:${route.name}`)
})

// 处理列筛选变化
const handleColumnFilterChange = filterInfo => {
  if (filterInfo.value) {
    filters.value[filterInfo.prop] = filterInfo.value
  } else {
    delete filters.value[filterInfo.prop]
  }
}

// 计算筛选后的数据
const filteredTableData = computed(() => {
  if (Object.keys(filters.value).length === 0) {
    return tableData.value
  }

  return tableData.value.filter(row => {
    return Object.entries(filters.value).every(([prop, filterValue]) => {
      if (!filterValue) return true

      const cellValue = row[prop]
      if (cellValue === null || cellValue === undefined) return false
      // 模糊搜索
      return String(cellValue).toLowerCase().includes(filterValue.toLowerCase())
    })
  })
})
// 监听表格数据变化，清空筛选条件（可选）
watch(
  () => tableData.value,
  () => {
    // 如果希望切换数据时清空筛选，取消下面的注释
    filters.value = {}
  },
)
watch(
  () => props.defaultParams,
  newVal => {
    if (newVal) {
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

const setLoading = flag => {
  loading.value = flag
}
defineExpose({
  setLoading,
  getTableList,
})
</script>
<style lang="scss" scoped>
.listBox {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 16px;
  .tableBox {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }
  .pageBox {
    display: flex;
    justify-content: flex-end;
    :deep(.el-pagination__jump) {
      margin-left: 10px;
    }
  }
  :deep(.btn-prev),
  :deep(.btn-next) {
    border: none !important;
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
    .cell {
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
        &:not(:last-child) {
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
          width: 100%;
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
