<script lang="ts">
import type { Ref, UnwrapRef } from 'vue';
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
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
// eslint-disable-next-line jsdoc/check-indentation
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation3-width');
  return Number(width);
});
type RangeValue = [Dayjs, Dayjs];
export default defineComponent({
  name: 'Dict',
  components: { DictUpdateOrAdd, dictTypeData, EpcIcon },
  setup() {
    onMounted(() => {
      getTableData();
    });
    const formRef = ref();
    const dictTypeDataRef = ref<any>(null);
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const addOrUpdate: any = ref(null);
    const columns = ref<TableColumnType<FormData>[]>([
      {
        title: WeiI18n.t('序号').value,
        dataIndex: 'id',
        key: 'id',
        width: 50,
        align: 'center',
        sortDirections: ['descend', 'ascend'],
        customRender({ text, record, index }) {
          return h(
            'div',
            {
              style: '',
            },
            [h('span', { innerText: index + 1 })],
          );
        },
      },
      {
        title: WeiI18n.t('字典名称').value,
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        resizable: true,
        width: 160,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: WeiI18n.t('字典类型').value,
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        resizable: true,
        width: 90,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: WeiI18n.t('状态').value,
        dataIndex: 'status',
        key: 'status',
        resizable: true,
        width: 90,
      },
      {
        title: WeiI18n.t('备注').value,
        dataIndex: 'remark',
        key: 'remark',
        resizable: true,
        ellipsis: true,
        width: 120,
      },
      {
        title: WeiI18n.t('创建时间').value,
        dataIndex: 'createTime',
        key: 'createTime',
        width: 110,
        resizable: true,
        sorter: (a: any, b: any) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        sortDirections: ['descend', 'ascend'],
        /**
         * custom render
         * @param root0
         * @param root0.text
         */
        customRender: ({ text }) => {
          return useRender.renderDateNoTime(text);
        },
      },
      {
        title: WeiI18n.t('操作').value,
        dataIndex: 'operation',
        align: 'left',
        width: operationWidth.value,
      },
    ]);
    const tableData: Ref<FormData[]> = ref([]);
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
    function handleResizeColumn(w: any, col: any) {
      col.width = w;
    }
    return {
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
  <a-card v-if="!dictTypeDataflag">
    <a-form ref="formRef" class="form_css" layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol" :model="formData" @finish="handleFinish">
      <a-input v-model:value="formData.name" style="width: 240px" :placeholder="$t('请输入字典名称')" allow-clear />
      <a-input v-model:value="formData.type" style="width: 240px; margin-left: 15px" :placeholder="$t('请输入字典类型')" allow-clear />
      <a-select v-model:value="formData.status" style="width: 240px; margin-left: 15px; text-align: left" :placeholder="$t('请选择字典状态')" allow-clear>
        <a-select-option value="0">
          {{ $t('开启') }}
        </a-select-option>
        <a-select-option value="1">
          {{ $t('关闭') }}
        </a-select-option>
      </a-select>
      <a-range-picker v-model:value="formData.createTime" style="width: 240px; text-align: left; margin-left: 15px" :placeholder="[$t('开始日期'), $t('结束日期')]" />
      <a-form-item>
        <a-button type="primary" html-type="submit" style="margin-left: 30px">
          <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
          {{ $t('查询') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleAddOrUpdate(undefined)">
          <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
          {{ $t('添加') }}
        </a-button>
      </a-form-item>
      <!-- <a-form-item>
        <a-button @click="resetForm">
          <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
          {{ $t('重置') }}
        </a-button>
      </a-form-item> -->
    </a-form>
  </a-card>
  <a-card v-if="!dictTypeDataflag" class="card_css b-body2">
    <a-table
      row-key="id"
      :scroll="{ x: 1200 }"
      :locale="locale"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :loading="loading"
      @resizeColumn="handleResizeColumn"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <!-- :row-selection="rowSelection" -->
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
          <!-- v-hasPermi="['system:dict:update']" -->
          <a @click="handleAddOrUpdate(record.id)">{{ $t('修改') }}</a>
          <!-- v-hasPermi="['system:dict:update']" -->
          <a-divider type="vertical" />
          <a @click="onClickData(record)">{{ $t('数据') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="$isPending('delete', record.id)" @confirm="handleDelete(record.id)">
            <!-- v-hasPermi="['system:dict:delete']" -->
            <a-button type="link" danger :disabled="$isPending('delete', record.id)" class="p-0">
              {{ $t('删除') }}
            </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-pagination
      v-model:current="pagData.pageNo"
      v-model:page-size="pagData.pageSize"
      align="right"
      style="margin-top: 20px"
      :show-quick-jumper="false"
      :show-size-changer="true"
      :total="pagData.total"
      :show-total="(total: any) => `${$t('共') + total + $t('条')}`"
      :build-option-text="prop => `${prop.value}${$t('条/页')}`"
      @change="handlePagTable" />
    <DictUpdateOrAdd ref="addOrUpdate" v-model:modal-visible="visible" @close="handleCloseModal" @refresh-table-data="getTableData" />
  </a-card>
  <dictTypeData v-if="dictTypeDataflag" @cancel="dictTypeDataflag = false" ref="dictTypeDataRef"></dictTypeData>
</template>

<style scoped>
.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

:deep(.ant-table-column-sorters) {
  justify-content: flex-start;
  align-items: flex-end;
}
</style>
