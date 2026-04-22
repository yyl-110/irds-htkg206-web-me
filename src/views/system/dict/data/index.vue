<script lang="ts">
import type { Ref, UnwrapRef } from 'vue';
import { computed, defineComponent, h, nextTick, onActivated, reactive, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import DictTypeDataUpdateOrAdd from '../components/form/dictTypeDataUpdateOrAdd.vue';
import { useRender } from '@/components/escape';
import { useDateRangeParams } from '@/hooks/useDate';
import type { DictTypeVO } from '@/api/system/dict/dict.type';
import { getSimpleDictTypeList } from '@/api/system/dict/dict.type';
import type { DictDataVO } from '@/api/system/dict/dict.data';
import { getDictDataPage } from '@/api/system/dict/dict.data';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { WeiI18n } from '@/utils/WeiI18n';
type FormData = DictDataVO;
interface PagData {
  pageNo: number;
  pageSize: number;
  total: number;
}
const dictRow = ref<any>();
type RangeValue = [Dayjs, Dayjs];
type DictDataSortOrder = 'ascend' | 'descend' | '';

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

export default defineComponent({
  name: 'Dict',
  components: {
    DictTypeDataUpdateOrAdd,
    EpcIcon,
    CaretDownOutlined,
    CaretUpOutlined,
    FilterOutlined,
    SearchOutlined,
  },
  setup(props, { emit }) {
    const dictTypeList = ref<DictTypeVO[]>(); // 字典类型的列表
    onActivated(() => {
      // 查询字典（精简)列表
      getSimpleDictTypeList().then(res => (dictTypeList.value = res.data.data));
    });
    const route = useRoute(); // 路由
    const formRef = ref();
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const addOrUpdate: any = ref(null);
    const tableData: Ref<FormData[]> = ref([]);
    const { dateRangeParams } = useDateRangeParams();
    const formData = reactive<any>({
      label: undefined,
      status: undefined,
      dictType: route.query.dictType,
    });
    const pagData: UnwrapRef<PagData> = reactive({
      pageNo: 1,
      pageSize: 10,
      total: 0,
    });

    const dictDataSortState = ref<{ key: string; order: DictDataSortOrder }>({ key: '', order: '' });
    const dictDataFilterValueMap = ref<Record<string, string>>({ label: '' });
    const dictDataFilterOpenMap = ref<Record<string, boolean>>({});

    function isDictDataSortableColumn(column: { dataIndex?: unknown }) {
      const k = column?.dataIndex;
      if (k === 'operation' || k === 'id') return false;
      return Boolean(k);
    }

    /** 表头筛选与查询条件「字典标签」一致 */
    function isDictDataFilterableColumn(column: { dataIndex?: unknown }) {
      return column?.dataIndex === 'label';
    }

    function setDictDataFilterOpen(key: string, open: boolean) {
      dictDataFilterOpenMap.value = { ...dictDataFilterOpenMap.value, [key]: open };
    }

    function getDictDataFilterOpen(key: string) {
      return Boolean(dictDataFilterOpenMap.value[key]);
    }

    function handleDictDataFilterOpenChange(key: string, open: boolean) {
      if (open && key === 'label') {
        dictDataFilterValueMap.value = { ...dictDataFilterValueMap.value, label: String(formData.label ?? '') };
      }
      setDictDataFilterOpen(key, open);
    }

    function onDictDataLabelFilterOpenChange(vis: boolean) {
      handleDictDataFilterOpenChange('label', vis);
    }

    function getDictDataSortOrder(dataIndex: string): DictDataSortOrder {
      return dictDataSortState.value.key === dataIndex ? dictDataSortState.value.order : '';
    }

    function toggleDictDataColumnSort(column: { dataIndex?: unknown }) {
      if (!isDictDataSortableColumn(column)) return;
      const key = String(column.dataIndex);
      if (dictDataSortState.value.key !== key) {
        dictDataSortState.value = { key, order: 'ascend' };
        return;
      }
      if (dictDataSortState.value.order === 'ascend') {
        dictDataSortState.value = { key, order: 'descend' };
        return;
      }
      if (dictDataSortState.value.order === 'descend') {
        dictDataSortState.value = { key: '', order: '' };
        return;
      }
      dictDataSortState.value = { key, order: 'ascend' };
    }

    const dictDataDisplayList = computed(() => {
      const list = [...tableData.value];
      if (!dictDataSortState.value.key || !dictDataSortState.value.order) return list;
      const k = dictDataSortState.value.key;
      if (k === 'createTime') {
        const sorted = [...list].sort(
          (a, b) => new Date((a as any).createTime).getTime() - new Date((b as any).createTime).getTime(),
        );
        return dictDataSortState.value.order === 'ascend' ? sorted : sorted.reverse();
      }
      if (k === 'sort') {
        const sorted = [...list].sort((a, b) => (Number((a as any).sort) || 0) - (Number((b as any).sort) || 0));
        return dictDataSortState.value.order === 'ascend' ? sorted : sorted.reverse();
      }
      const sorted = [...list].sort((a, b) => sortermethod((a as any)[k], (b as any)[k]));
      return dictDataSortState.value.order === 'ascend' ? sorted : sorted.reverse();
    });

    const columns = ref<TableColumnType<FormData>[]>([
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
        dataIndex: 'cssClass',
        key: 'cssClass',
        align: 'left',
        resizable: true,
        width: 140,
        fixed: 'left',
        ellipsis: { showTitle: true },
      },
      {
        title: WeiI18n.t('字典标签').value,
        dataIndex: 'label',
        key: 'label',
        align: 'left',
        resizable: true,
        width: 120,
        ellipsis: { showTitle: true },
      },
      {
        title: WeiI18n.t('字典键值').value,
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        resizable: true,
        width: 100,
        ellipsis: { showTitle: true },
      },
      {
        title: WeiI18n.t('字典排序').value,
        dataIndex: 'sort',
        key: 'sort',
        align: 'center',
        resizable: true,
        width: 100,
      },
      {
        title: WeiI18n.t('状态').value,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        resizable: true,
        width: 90,
      },
      {
        title: WeiI18n.t('颜色类型').value,
        dataIndex: 'colorType',
        key: 'colorType',
        align: 'center',
        resizable: true,
        width: 100,
      },
      {
        title: WeiI18n.t('备注').value,
        dataIndex: 'remark',
        key: 'remark',
        align: 'left',
        resizable: true,
        width: 120,
        ellipsis: { showTitle: true },
      },
      {
        title: WeiI18n.t('创建时间').value,
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        resizable: true,
        width: 180,
        customRender: ({ text }) => useRender.renderDate(text),
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

    const DICT_DATA_TABLE_SCROLL_BUFFER = 24;
    const dictDataTableScrollX = computed(() => {
      let sum = 0;
      for (const col of columns.value) {
        const w = col.width;
        sum += typeof w === 'number' ? w : Number(w) || 0;
      }
      return sum + DICT_DATA_TABLE_SCROLL_BUFFER;
    });

    function applyDictDataColumnFilter(key: string) {
      if (key === 'label') {
        const v = String(dictDataFilterValueMap.value.label ?? '').trim();
        formData.label = v || undefined;
      }
      pagData.pageNo = 1;
      setDictDataFilterOpen(key, false);
      getTableData(dictRow.value);
    }

    function resetDictDataColumnFilter(key: string) {
      if (key === 'label') {
        dictDataFilterValueMap.value = { ...dictDataFilterValueMap.value, label: '' };
        formData.label = undefined;
      }
      pagData.pageNo = 1;
      setDictDataFilterOpen(key, false);
      getTableData(dictRow.value);
    }

    function handleResizeColumn(w: number, col: TableColumnType<FormData>) {
      col.width = w;
    }

    function dictDataTableRowClassName(_record: FormData, index: number) {
      return index % 2 === 0 ? 'odd' : 'even';
    }

    function dictPaginationShowTotal(total: number) {
      return `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
    }

    function dictPaginationBuildOptionText(prop: { value: number }) {
      return `${prop.value}${WeiI18n.$t('条/页')}`;
    }

    /** get table data */
    function getTableData(row?: any) {
      if (row) {
        formData.dictType = row.type;
        dictRow.value = row;
      }
      if (!formData.dictType && route.query.dictType) {
        formData.dictType = route.query.dictType as any;
      }
      loading.value = true;
      getDictDataPage({
        ...pagData,
        ...formData,
      })
        .then((res: any) => {
          const data = res.data;
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
     * handle table pagination
     * @param cur
     * @param pag
     */
    const handlePagTable = (cur: any, pag: any) => {
      pagData.pageNo = cur;
      pagData.pageSize = pag;
      getTableData(dictRow.value);
    };
    /** 查询表格数据 */
    const handleFinish = () => {
      pagData.pageNo = 1;
      getTableData(dictRow.value);
    };

    /**
     * 删除字典数据
     * @param id dict id
     */
    async function handleDelete(id: number) {
      await AdminApiSystemDictData.deleteDictData({ id });
      message.success('删除成功');
      getTableData(dictRow.value);
    }
    // /**
    //  * 删除
    //  * @param val
    //  */
    // const handleDelete = (val: any) => {
    //   const delTable = deleteDictData(val)
    //   delTable.then(() => {
    //     message.success('删除成功')
    //     getTableData(dictRow.value)
    //   })
    // }
    /** reset */
    const handleReset = () => {
      formRef.value.resetFields();
    };
    /**
     * handle add or update
     * @param val
     */
    const handleAddOrUpdate = (val?: string) => {
      visible.value = true;
      nextTick(() => {
        addOrUpdate.value.handleModalAddOrUpdate(val, dictRow.value);
      });
    };
    const { push } = useRouter();
    /**
     * click data
     * @param record
     */
    const oncancel = () => {
      emit('cancel');
    };
    /** 关闭弹窗 */
    const handleCloseModal = () => {
      visible.value = false;
    };
    function resetForm(value: string) {
      handleReset();
      getTableData(dictRow.value);
    }
    function refreshTableData() {
      getTableData(dictRow.value);
    }
    return {
      locale,
      isDictDataSortableColumn,
      isDictDataFilterableColumn,
      getDictDataSortOrder,
      toggleDictDataColumnSort,
      getDictDataFilterOpen,
      onDictDataLabelFilterOpenChange,
      applyDictDataColumnFilter,
      resetDictDataColumnFilter,
      dictDataFilterValueMap,
      dictDataDisplayList,
      dictDataTableScrollX,
      handleResizeColumn,
      dictDataTableRowClassName,
      dictPaginationShowTotal,
      dictPaginationBuildOptionText,
      dictTypeList,
      dateRangeParams,
      dateValue: ref<RangeValue>(),
      visible,
      loading,
      addOrUpdate,
      formRef,
      formData,
      pagData,
      columns,
      tableData,
      refreshTableData,
      resetForm,
      oncancel,
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
  <div class="drawerContent dict-data-page-root">
    <a-card class="dict-data-list-card">
      <div class="dict-data-list-body-scroll">
        <a-form ref="formRef" class="calc-toolbar-form dict-data-toolbar-form" layout="inline" :model="formData" @finish="handleFinish">
          <a-form-item name="label">
            <a-input v-model:value="formData.label" style="width: 200px" :placeholder="$t('请输入字典标签')" allow-clear />
          </a-form-item>
          <a-form-item name="status">
            <a-select v-model:value="formData.status" style="width: 200px; text-align: left" :placeholder="$t('请选择字典状态')" allow-clear show-search>
              <a-select-option value="0">
                {{ $t('开启') }}
              </a-select-option>
              <a-select-option value="1">
                {{ $t('关闭') }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="margin-left: 15px" @click="handleAddOrUpdate()">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="resetForm">
              <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
              {{ $t('重置') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="oncancel()">
              <EpcIcon type="icon-fanhui-copy" style="font-size: 12px" />
              {{ $t('返回') }}
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="dict-data-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          row-key="id"
          :scroll="{ x: dictDataTableScrollX }"
          :locale="locale"
          :columns="columns"
          :data-source="dictDataDisplayList"
          :pagination="false"
          :loading="loading"
          @resize-column="handleResizeColumn"
          :row-class-name="dictDataTableRowClassName">
          <template #headerCell="{ column }">
            <template v-if="isDictDataSortableColumn(column) || isDictDataFilterableColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isDictDataFilterableColumn(column) }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isDictDataSortableColumn(column) }"
                  @click.stop="toggleDictDataColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isDictDataSortableColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getDictDataSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getDictDataSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isDictDataFilterableColumn(column)" class="header-filter-anchor" @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getDictDataFilterOpen('label')"
                    @openChange="onDictDataLabelFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="dictDataFilterValueMap.label"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyDictDataColumnFilter('label')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyDictDataColumnFilter('label')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetDictDataColumnFilter('label')">{{ $t('重置') }}</a-button>
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
            <template v-if="column.dataIndex === 'status'">
              <span>
                <a-tag v-if="record.status === 0" color="blue"> {{ $t('开启') }}</a-tag>
                <a-tag v-else-if="record.status === 1"> {{ $t('关闭') }}</a-tag>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="handleAddOrUpdate(record.id)">{{ $t('修改') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="`${$t('确定要删除吗')}?`"
                :ok-text="$t('确定')"
                :cancel-text="$t('取消')"
                :disabled="$isPending('delete', record.id)"
                @confirm="handleDelete(record.id)">
                <a-button type="link" danger :disabled="$isPending('delete', record.id)" class="p-0 text-[12px]">
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
        <div class="dict-data-list-pagination">
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
      <DictTypeDataUpdateOrAdd
        ref="addOrUpdate"
        v-model:modal-visible="visible"
        :dict-type="formData.dictType"
        @close="handleCloseModal"
        @refresh-table-data="refreshTableData" />
    </a-card>
  </div>
</template>

<style scoped lang="less">
.drawerContent.dict-data-page-root {
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

.dict-data-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.dict-data-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.dict-data-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 8px;
}

.dict-data-list-card {
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

.dict-data-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.dict-data-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.dict-data-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.dict-data-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.dict-data-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.dict-data-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.dict-data-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.dict-data-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.dict-data-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.dict-data-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.dict-data-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.dict-data-list-table.exe-config-table.parameter-table-spaced {
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
</style>
