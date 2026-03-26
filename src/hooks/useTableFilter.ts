import type { Ref } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import TableFilterDropdown from '@/components/TableFilterDropdown/index.vue'
import FilterIcon from '@/components/TableFilterDropdown/FilterIcon.vue'

interface FilterDropdownSlotParams {
  setSelectedKeys: (keys: string[]) => void
  selectedKeys: string[]
  confirm: (param?: { closeDropdown?: boolean }) => void
  clearFilters?: () => void
  column: { title?: string; dataIndex?: string }
}

/**
 * 表格列自定义筛选 hook
 *
 * 用法：
 * - 输入框搜索：...getColumnSearchProps('dataIndex')
 * - 选择筛选：...getColumnSelectProps('dataIndex', tableData)
 * - 页面无需引入任何组件，无需写任何 slot
 */
export function useTableFilter() {
  const searchText = ref('')
  const searchedColumn = ref('')

  const onSearchCb = (keys: string[], idx: string) => {
    searchText.value = keys[0] || ''
    searchedColumn.value = idx
  }

  const onResetCb = () => {
    searchText.value = ''
    searchedColumn.value = ''
  }

  const renderFilterIcon = ({ filtered }: { filtered: boolean }) =>
    h(FilterIcon, { filtered })

  /** 输入框搜索筛选 */
  const getColumnSearchProps = (dataIndex: string): Partial<TableColumnType> => ({
    filterDropdown: (params: FilterDropdownSlotParams) =>
      h(TableFilterDropdown, {
        selectedKeys: params.selectedKeys,
        setSelectedKeys: params.setSelectedKeys,
        confirm: params.confirm,
        clearFilters: params.clearFilters,
        column: params.column,
        mode: 'input',
        onSearch: onSearchCb,
        onReset: onResetCb,
      }),
    filterIcon: renderFilterIcon,
    onFilter: (value, record: any) =>
      String(record[dataIndex] ?? '')
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  })

  /** 选择筛选，选项从 dataSource 自动去重 */
  const getColumnSelectProps = (dataIndex: string, dataSource: Ref<any[]>): Partial<TableColumnType> => ({
    filterDropdown: (params: FilterDropdownSlotParams) => {
      const unique = [...new Set(
        dataSource.value
          .map(row => row[dataIndex])
          .filter(v => v != null && v !== '')
      )]
      const options = unique.map(v => ({ label: String(v), value: String(v) }))
      return h(TableFilterDropdown, {
        selectedKeys: params.selectedKeys,
        setSelectedKeys: params.setSelectedKeys,
        confirm: params.confirm,
        clearFilters: params.clearFilters,
        column: params.column,
        mode: 'select',
        options,
        onSearch: onSearchCb,
        onReset: onResetCb,
      })
    },
    filterIcon: renderFilterIcon,
    onFilter: (value, record: any) =>
      String(record[dataIndex] ?? '') === String(value),
  })

  return {
    searchText,
    searchedColumn,
    getColumnSearchProps,
    getColumnSelectProps,
  }
}
