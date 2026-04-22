<script lang="ts">
import type { Ref, UnwrapRef } from 'vue';
import { defineComponent, computed, h, nextTick, onMounted, reactive, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import DictUpdateOrAdd from './components/form/dictUpdateOrAdd.vue';
import { getDictTableData } from '@/api/system/dict/index';
import { useRender } from '@/components/escape';
import type { DateRangeParams } from '@/hooks/useDate';
import { useDateRangeParams } from '@/hooks/useDate';
import { AdminApiSystemDictType } from '@/api/tags/管理后台字典类型';
import { WeiI18n } from '@/utils/WeiI18n';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
import dictTypeData from './data/index.vue';
interface FormData {
  id: string | undefined;
  name: string | undefined;
  type: any;
  status: string | number | undefined;
  createTime: DateRangeParams;
}
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); //
interface PagData {
  pageNo: number;
  pageSize: number;
  total: number;
}
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
  },
};
type RangeValue = [Dayjs, Dayjs];

type DictSortOrder = 'ascend' | 'descend' | '';
type DictRow = Record<string, any>;

export default defineComponent({
  name: 'Dict',
  components: {
    DictUpdateOrAdd,
    dictTypeData,
    EpcIcon,
    CaretDownOutlined,
    CaretUpOutlined,
    FilterOutlined,
    SearchOutlined,
  },
  setup() {
    const formRef = ref();
    const dictTypeDataRef = ref<any>(null);
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const addOrUpdate: any = ref(null);
    const tableData = ref<DictRow[]>([]);
    const { dateRange, dateRangeParams } = useDateRangeParams();
    const formData: UnwrapRef<FormData> = reactive({
      id: undefined,
      name: undefined,
      type: undefined,
      status: undefined,
      createTime: dateRange,
    });
    const pagData: UnwrapRef<PagData> = reactive({
      pageNo: 1,
      pageSize: 10,
      total: 0,
    });

    const dictTableSortState = ref<{ key: string; order: DictSortOrder }>({ key: '', order: '' });
    const dictTableFilterValueMap = ref<Record<string, string>>({ name: '' });
    const dictTableFilterOpenMap = ref<Record<string, boolean>>({});

    function isDictTableSortableColumn(column: { dataIndex?: unknown }) {
      const k = column?.dataIndex;
      if (k === 'operation' || k === 'id') return false;
      return Boolean(k);
    }

    function isDictTableFilterableColumn(column: { dataIndex?: unknown }) {
      return column?.dataIndex === 'name';
    }

    function setDictTableFilterOpen(key: string, open: boolean) {
      dictTableFilterOpenMap.value = { ...dictTableFilterOpenMap.value, [key]: open };
    }

    function getDictTableFilterOpen(key: string) {
      return Boolean(dictTableFilterOpenMap.value[key]);
    }

    function handleDictTableFilterOpenChange(key: string, open: boolean) {
      if (open && key === 'name') {
        dictTableFilterValueMap.value = { ...dictTableFilterValueMap.value, name: String(formData.name ?? '') };
      }
      setDictTableFilterOpen(key, open);
    }

    function onDictNameTableFilterOpenChange(vis: boolean) {
      handleDictTableFilterOpenChange('name', vis);
    }

    function getDictTableSortOrder(dataIndex: string): DictSortOrder {
      return dictTableSortState.value.key === dataIndex ? dictTableSortState.value.order : '';
    }

    function toggleDictTableColumnSort(column: { dataIndex?: unknown }) {
      if (!isDictTableSortableColumn(column)) return;
      const key = String(column.dataIndex);
      if (dictTableSortState.value.key !== key) {
        dictTableSortState.value = { key, order: 'ascend' };
        return;
      }
      if (dictTableSortState.value.order === 'ascend') {
        dictTableSortState.value = { key, order: 'descend' };
        return;
      }
      if (dictTableSortState.value.order === 'descend') {
        dictTableSortState.value = { key: '', order: '' };
        return;
      }
      dictTableSortState.value = { key, order: 'ascend' };
    }

    const dictTableDisplayList = computed(() => {
      const list = [...tableData.value];
      if (!dictTableSortState.value.key || !dictTableSortState.value.order) return list;
      const k = dictTableSortState.value.key;
      if (k === 'createTime') {
        const sorted = [...list].sort(
          (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        );
        return dictTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
      }
      const sorted = [...list].sort((a, b) => sortermethod(a[k], b[k]));
      return dictTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
    });

    const columns = ref<TableColumnType<DictRow>[]>([
      {
        title: WeiI18n.t('序号').value,
        dataIndex: 'id',
        key: 'id',
        width: 56,
        align: 'center',
        fixed: 'left',
        resizable: false,
        customRender({ index }) {
          return h('span', { innerText: String((index ?? 0) + 1) });
        },
      },
      {
        title: WeiI18n.t('字典名称').value,
        dataIndex: 'name',
        key: 'name',
        ellipsis: { showTitle: true },
        resizable: true,
        width: 180,
        align: 'left',
        fixed: 'left',
      },
      {
        title: WeiI18n.t('字典类型').value,
        dataIndex: 'type',
        key: 'type',
        ellipsis: { showTitle: true },
        resizable: true,
        width: 100,
        align: 'center',
      },
      {
        title: WeiI18n.t('状态').value,
        dataIndex: 'status',
        key: 'status',
        resizable: true,
        width: 96,
        align: 'center',
      },
      {
        title: WeiI18n.t('备注').value,
        dataIndex: 'remark',
        key: 'remark',
        resizable: true,
        ellipsis: { showTitle: true },
        width: 120,
        align: 'left',
      },
      {
        title: WeiI18n.t('创建时间').value,
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
        resizable: true,
        align: 'center',
        customRender: ({ text }) => useRender.renderDateNoTime(text),
      },
      {
        title: WeiI18n.t('操作').value,
        dataIndex: 'operation',
        key: 'operation',
        align: 'left',
        fixed: 'right',
        resizable: false,
        width: 200,
      },
    ]);

    const DICT_TABLE_SCROLL_BUFFER = 24;
    const dictTableScrollX = computed(() => {
      let sum = 0;
      for (const col of columns.value) {
        const w = col.width;
        sum += typeof w === 'number' ? w : Number(w) || 0;
      }
      return sum + DICT_TABLE_SCROLL_BUFFER;
    });

    function applyDictTableColumnFilter(key: string) {
      if (key === 'name') {
        const v = String(dictTableFilterValueMap.value.name ?? '').trim();
        formData.name = v || undefined;
      }
      pagData.pageNo = 1;
      setDictTableFilterOpen(key, false);
      getTableData();
    }

    function resetDictTableColumnFilter(key: string) {
      if (key === 'name') {
        dictTableFilterValueMap.value = { ...dictTableFilterValueMap.value, name: '' };
        formData.name = undefined;
      }
      pagData.pageNo = 1;
      setDictTableFilterOpen(key, false);
      getTableData();
    }
    /**
     * get table data
     */
    function getTableData() {
      const dictData = getDictTableData({
        ...pagData,
        ...formData,
        createTime: dateRangeParams.value,
      });
      dictData
        .then((res: any) => {
          loading.value = true;
          const data = res.data;
          loading.value = false;
          tableData.value = data.data.list;
          pagData.total = data.data.total;
        })
        .catch(() => {
          tableData.value = [];
          pagData.total = 0;
        })
        .finally(() => {
          loading.value = false;
        });
    }
    /**
     * hdndle table pagination
     * @param cur
     * @param pag
     */
    const handlePagTable = (cur: any, pag: any) => {
      pagData.pageNo = cur;
      pagData.pageSize = pag;
      loading.value = true;
      getTableData();
    };
    /** 查询表格数据 */
    const handleFinish = () => {
      pagData.pageNo = 1;
      getTableData();
    };
    /**
     * 删除字典类型
     * @param id dict id
     */
    async function handleDelete(id: number) {
      await AdminApiSystemDictType.deleteDictType({ id });
      message.success('删除成功');
      getTableData();
    }
    // /**
    //  * handle delete
    //  * @param val
    //  */
    // const handleDelete = (val: any) => {
    //   const delTable = getDeleteTableData({ id: val })
    //   delTable.then(() => {
    //     message.success('删除成功')
    //     getTableData()
    //   })
    // }
    /** handle reset */
    const handleReset = () => {
      formRef.value.resetFields();
    };
    /**
     * handle add or update
     * @param val
     */
    const handleAddOrUpdate = (val: any) => {
      visible.value = true;
      nextTick(() => {
        addOrUpdate.value.handleModalAddOrUpdate(val);
      });
    };
    const { push } = useRouter();
    const dictTypeDataflag = ref<boolean>(false);
    /**
     * click data
     * @param record
     */
    const onClickData = (record: any) => {
      console.log(record, 'record');
      dictTypeDataflag.value = true;
      nextTick(() => {
        dictTypeDataRef.value.getTableData(record);
      });
    };
    /** 关闭弹窗 */
    const handleCloseModal = () => {
      visible.value = false;
    };
    function resetForm(value: string) {
      handleReset();
      getTableData();
    }
    function handleResizeColumn(w: number, col: TableColumnType<DictRow>) {
      col.width = w;
    }

    function dictTableRowClassName(_record: DictRow, index: number) {
      return index % 2 === 0 ? 'odd' : 'even';
    }

    function dictPaginationShowTotal(total: number) {
      return `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
    }

    function dictPaginationBuildOptionText(prop: { value: number }) {
      return `${prop.value}${WeiI18n.$t('条/页')}`;
    }

    onMounted(() => {
      getTableData();
    });

    return {
      isDictTableSortableColumn,
      isDictTableFilterableColumn,
      getDictTableSortOrder,
      toggleDictTableColumnSort,
      getDictTableFilterOpen,
      onDictNameTableFilterOpenChange,
      applyDictTableColumnFilter,
      resetDictTableColumnFilter,
      dictTableFilterValueMap,
      dictTableDisplayList,
      dictTableScrollX,
      dictTableRowClassName,
      dictPaginationShowTotal,
      dictPaginationBuildOptionText,
      onClickData,
      resetForm,
      handleResizeColumn,
      dateRangeParams,
      dateValue: ref<RangeValue>(),
      labelCol: { style: { width: '100px', height: '50px' } },
      wrapperCol: { span: 14 },
      visible,
      loading,
      addOrUpdate,
      formRef,
      formData,
      pagData,
      columns,
      tableData,
      tableHXH,
      locale,
      dictTypeDataflag,
      dictTypeDataRef,
      getTableData,
      handlePagTable,
      handleFinish,
      handleDelete,
      handleReset,
      handleAddOrUpdate,
      handleCloseModal,
    };
  },
});
</script>

<template>
  <div v-if="!dictTypeDataflag" class="drawerContent dict-type-page-root">
    <a-card class="dict-type-list-card">
      <div class="dict-type-list-body-scroll">
        <a-form
          ref="formRef"
          class="calc-toolbar-form dict-type-toolbar-form"
          layout="inline"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :model="formData"
          @finish="handleFinish">
          <a-form-item>
            <a-input v-model:value="formData.name" style="width: 200px" :placeholder="$t('请输入字典名称')" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="formData.type" style="width: 200px" :placeholder="$t('请输入字典类型')" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="formData.status" style="width: 200px; text-align: left" :placeholder="$t('请选择字典状态')" allow-clear>
              <a-select-option value="0">
                {{ $t('开启') }}
              </a-select-option>
              <a-select-option value="1">
                {{ $t('关闭') }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-range-picker
              v-model:value="formData.createTime"
              style="width: 240px; text-align: left"
              :placeholder="[$t('开始日期'), $t('结束日期')]" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="margin-left: 15px" @click="handleAddOrUpdate(undefined)">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="dict-type-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: dictTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="dictTableDisplayList"
          :pagination="false"
          :loading="loading"
          @resize-column="handleResizeColumn"
          :row-class-name="dictTableRowClassName">
          <template #headerCell="{ column }">
            <template v-if="isDictTableSortableColumn(column) || isDictTableFilterableColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isDictTableFilterableColumn(column) }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isDictTableSortableColumn(column) }"
                  @click.stop="toggleDictTableColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isDictTableSortableColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getDictTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getDictTableSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isDictTableFilterableColumn(column)" class="header-filter-anchor" @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getDictTableFilterOpen('name')"
                    @openChange="onDictNameTableFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="dictTableFilterValueMap.name"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyDictTableColumnFilter('name')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyDictTableColumnFilter('name')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetDictTableColumnFilter('name')">{{ $t('重置') }}</a-button>
                        </div>
                      </div>
                    </template>
                    <FilterOutlined class="header-query-icon" @mousedown.stop />
                  </a-popover>
                </span>
              </div>
            </template>
            <template v-else>
              <div class="header-cell-main header-cell-main--static">
                <span class="header-title-sort header-title-sort--disabled">
                  <span>{{ column.title }}</span>
                </span>
              </div>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              {{ record.name }}
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <span>
                <a-tag v-if="record.status === 0" color="blue">{{ $t('开启') }}</a-tag>
                <a-tag v-else-if="record.status === 1">{{ $t('关闭') }}</a-tag>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="handleAddOrUpdate(record.id)">{{ $t('修改') }}</a>
              <a-divider type="vertical" />
              <a @click="onClickData(record)">{{ $t('数据') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="`${$t('确定要删除吗')}?`"
                ok-text="确定"
                cancel-text="取消"
                :disabled="$isPending('delete', record.id)"
                @confirm="handleDelete(record.id)">
                <a-button type="link" danger :disabled="$isPending('delete', record.id)" class="p-0 text-[12px]">
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
        <div class="dict-type-list-pagination">
          <a-pagination
            v-model:current="pagData.pageNo"
            v-model:page-size="pagData.pageSize"
            class="ant-table-pagination"
            align="right"
            :show-quick-jumper="false"
            :show-size-changer="true"
            :total="pagData.total"
            :show-total="dictPaginationShowTotal"
            :build-option-text="dictPaginationBuildOptionText"
            @change="handlePagTable" />
        </div>
      </div>
      <DictUpdateOrAdd ref="addOrUpdate" v-model:modal-visible="visible" @close="handleCloseModal" @refresh-table-data="getTableData" />
    </a-card>
  </div>
  <dictTypeData v-if="dictTypeDataflag" @cancel="dictTypeDataflag = false" ref="dictTypeDataRef" />
</template>

<style scoped lang="less">
.drawerContent.dict-type-page-root {
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

.dict-type-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.dict-type-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.dict-type-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 12px;
}

.dict-type-list-card {
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

.dict-type-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.dict-type-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.dict-type-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.dict-type-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.dict-type-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.dict-type-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.dict-type-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.dict-type-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.dict-type-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.dict-type-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.dict-type-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.dict-type-list-table.exe-config-table.parameter-table-spaced {
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

/* 表头：排序 + 字典名称列筛选 */
.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
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

.header-cell-main--has-filter {
  gap: 6px;
  padding-right: 0;
}

.header-filter-anchor {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.header-filter-pop {
  width: 220px;
}

.header-filter-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.del-text {
  color: var(--ant-error-color);
}
</style>
