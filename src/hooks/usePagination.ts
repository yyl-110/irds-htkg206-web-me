import type { BasePaginationParamsType } from '@wei/openapi-codegen/es/src/BaseUISchemaPagination'
import type { PaginationProps } from 'ant-design-vue'

/** 全局默认的列表页表格分页参数 */
const defaultPaginationOptions: Partial<PaginationProps> = {
  showQuickJumper: true,
  showSizeChanger: true,
}

/** 默认每页显示数量 */
const defaultPageSize = ref(10)

/**
 * 初始化请求参数中的分页参数
 * @param params 请求参数
 */
function resetPagination<P extends BasePaginationParamsType>(params: P) {
  params.pageNo = 1
  params.pageSize = defaultPageSize.value
}

/**
 * 初始化列表请求的分页参数
 * @since 3.0.0
 * @param params 包含分页字段的请求参数
 * @param onChange 翻页事件函数
 */
export function usePagination<P extends BasePaginationParamsType>(params: P, onChange: Function) {
  // 先初始化分页参数
  if (!params.pageNo || !params.pageSize)
    resetPagination(params)
  /** 可用于 a-table 的 pagination 参数 */
  const pagination = reactive<PaginationProps>({
    ...defaultPaginationOptions,
    current: 1,
    pageSize: defaultPageSize.value,
    onChange(pageNo: number, pageSize: number) {
      pagination.current = pageNo
      pagination.pageSize = pageSize
      params.pageNo = pageNo
      params.pageSize = pageSize
      onChange()
    },
  })

  // pagination 数据变化时, 同步更新到请求参数中
  watch(() => pagination.current, () => params.pageNo = pagination.current || 1)
  watch(() => pagination.pageSize, () => params.pageSize = pagination.pageSize || defaultPageSize.value)

  return {
    /** 可用于 a-table 的 pagination 参数 */
    pagination,
    /** 初始化请求参数中的分页参数 */
    resetPagination,
  }
}
