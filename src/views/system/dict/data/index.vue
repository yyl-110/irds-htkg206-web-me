<script lang="ts">
import type { Ref, UnwrapRef } from 'vue';
import { defineComponent, nextTick, onMounted, reactive, ref, defineEmits } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import DictTypeDataUpdateOrAdd from '../components/form/dictTypeDataUpdateOrAdd.vue';
import { useRender } from '@/components/escape';
import { useDateRangeParams } from '@/hooks/useDate';
import type { DictTypeVO } from '@/api/system/dict/dict.type';
import { getSimpleDictTypeList } from '@/api/system/dict/dict.type';
import type { DictDataVO } from '@/api/system/dict/dict.data';
import { getDictDataPage } from '@/api/system/dict/dict.data';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
import { EpcIcon } from '@/components/icon/EpcIcon';
type FormData = DictDataVO;
interface PagData {
  pageNo: number;
  pageSize: number;
  total: number;
}
const dictRow = ref<any>();
const emit = defineEmits(['cancel']);
type RangeValue = [Dayjs, Dayjs];
export default defineComponent({
  name: 'Dict',
  components: { DictTypeDataUpdateOrAdd, EpcIcon },
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
    const columns: TableColumnType<FormData>[] = [
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
        title: '字典名称',
        dataIndex: 'cssClass',
        key: 'cssClass',
        align: 'center',
        width: 150,
      },
      {
        title: '字典标签',
        dataIndex: 'label',
        key: 'label',
        align: 'center',
        width: 90,
      },
      {
        title: '字典键值',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        width: 90,
      },
      {
        title: '字典排序',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center',
        width: 90,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 90,
      },
      {
        title: '颜色类型',
        dataIndex: 'colorType',
        key: 'colorType',
        align: 'center',
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        ellipsis: true,
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 200,
        /**
         * custom render
         * @param root0
         * @param root0.text
         */
        customRender: ({ text }) => {
          return useRender.renderDate(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 150,
      },
    ];
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
    /** get table data */
    function getTableData(row: any) {
      formData.dictType = row.type;
      dictRow.value = row;
      const dictData = getDictDataPage({
        ...pagData,
        ...formData,
      });
      dictData.then((res: any) => {
        const data = res.data;
        tableData.value = data.data.list;
        pagData.total = data.data.total;
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
      dictTypeList,
      dateRangeParams,
      dateValue: ref<RangeValue>(),
      labelCol: { style: { width: '100px' } },
      wrapperCol: { span: 14 },
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
  <a-card>
    <a-form ref="formRef" class="form_css" layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol" :model="formData" @finish="handleFinish">
      <!-- <a-form-item :label="$t('字典名称')" name="dictType">
        <a-select v-model:value="formData.dictType" style="width: 240px; text-align: left" placeholder="请选择字典" show-search>
          <a-select-option v-for="item in dictTypeList" :key="item.type" :value="item.type">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item :label="$t('字典标签')" name="label">
        <a-input v-model:value="formData.label" style="width: 240px" :placeholder="$t('请输入字典标签')" allow-clear />
      </a-form-item>
      <a-form-item :label="$t('状态')" name="status">
        <a-select v-model:value="formData.status" style="width: 240px; text-align: left" :placeholder="$t('请选择字典状态')" allow-clear show-search>
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
        <a-button type="primary" @click="handleAddOrUpdate()">
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
  </a-card>

  <a-card class="card_css">
    <a-table :columns="columns" :data-source="tableData" :pagination="false" style="overflow-x: auto" :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          {{ record.name }}
        </template>
        <template v-else-if="column.dataIndex === 'status'">
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
      style="margin-top: 10px"
      show-quick-jumper
      :show-size-changer="true"
      :total="pagData.total"
      :show-total="(total: number) => `共${total}条`"
      @change="handlePagTable" />
    <DictTypeDataUpdateOrAdd
      ref="addOrUpdate"
      v-model:modal-visible="visible"
      :dict-type="formData.dictType as any"
      @close="handleCloseModal"
      @refresh-table-data="refreshTableData" />
  </a-card>
</template>

<style scoped>
.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}
</style>
