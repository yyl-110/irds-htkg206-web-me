<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import MenuAddUpdate from './components/form/index.vue';
import { AdminApiSystemModular } from '@/api/tags/管理后台模块';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { CommonListRequestDTOModulemanaGementModel } from '@/api/models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';

/** 模块树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); // 表格高度
/** 列表请求参数 */
const requestParams = reactive(new CommonListRequestDTOModulemanaGementModel());
requestParams.condition = undefined;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

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
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
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
  const width = getComputedStyle(root).getPropertyValue('--main-operation2-width');
  return Number(width);
});
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const addOrUpdate = ref<InstanceType<typeof MenuAddUpdate>>();
const treeDataTranslate: any = inject('treeDataTranslate');
const columns: TableColumnType<Menus>[] = [
  {
    title: WeiI18n.t('模块名称').value,
    dataIndex: 'name',
    key: 'name',
    width: 150,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('排序').value,
    dataIndex: 'sort',
    key: 'sort',
    width: 90,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作').value,
    align: 'left',
    dataIndex: 'operation',
    width: operationWidth.value,
    fixed: 'right',
  },
];

/** 列表数据 */
const dataSource = ref<Array<Menus>>([]);
/** 获取部门数据 */
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemModular.getModularList({ ...requestParams });
    loading.value = false;
    dataSource.value = treeDataTranslate(res.data.data, 'id');
  } finally {
    loading.value = false;
  }
}
getListData();

/** 允许新增子模块的模块类型 */
const ALLOW_CREATE_TYPES: Array<number> = [1, 2];

/**
 * 新增 / 修改
 * @param id id
 * @param parentId parentId
 */
function handleAddOrUpdate(id: any, parentId?: number) {
  visible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    addOrUpdate.value?.handleModalAddOrUpdate(id, parentId);
  });
}
/**
 * 查询表格数据
 */
function handleFinish() {
  getListData();
}
/**
 * 删除
 * @param id id
 */
function handleDelete(id: Menus['id']) {
  AdminApiSystemModular.deleteModular({ id }).then(() => {
    message.success('删除成功!');
    getListData();
  });
}

const { resetFields } = useForm(requestParams);
</script>

<template>
  <a-card>
    <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
      <a-row :gutter="[24, 12]" :wrap="true">
        <a-col :span="12" :xl="12">
          <a-form-item :label="$t('模块名称')" name="name">
            <a-input v-model:value="requestParams.name" style="width: 220px" allow-clear :placeholder="$t('请输入模块名称')" />
          </a-form-item>
        </a-col>
        <a-col :span="12" :xl="12" class="space-x-[16px]">
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <!-- v-hasPermi="['system:funcMenu:create']" -->
          <a-button type="primary" @click="handleAddOrUpdate(undefined)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card style="margin-top: 10px" class="b-body">
    <!--    表格处 -->
    <a-table
      :scroll="{ x: 1200 }"
      :pagination="pagination"
      :loading="loading"
      row-key="id"
      :locale="locale"
      :data-source="dataSource"
      :columns="columns"
      :row-selection="rowSelection"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="height: 22px; display: flex; align-items: center">
            <!-- v-hasPermi="['system:funcMenu:update']" -->
            <a @click.stop="handleAddOrUpdate(record.id)">{{ $t('修改') }}</a>
            <!-- v-hasPermi="['system:funcMenu:update']" -->
            <a-divider type="vertical" />
            <div @click.stop>
              <a-popconfirm
                v-if="dataSource.length"
                :title="`${$t('确定要删除吗')}?`"
                :ok-text="$t('确定')"
                :cancel-text="$t('取消')"
                :disabled="$isPending('delete', record.id)"
                @confirm="handleDelete(record.id)">
                <!-- v-hasPermi="['system:funcMenu:delete']"  -->
                <a style="color: #ff4d4f">{{ $t('删除') }}</a>
              </a-popconfirm>
            </div>
          </div>
        </template>
      </template>
    </a-table>
    <!--    弹窗 -- 新增 or 修改 -->
    <MenuAddUpdate ref="addOrUpdate" v-model:modal-visible="visible" @refresh-table-data="getListData" />
  </a-card>
</template>

<style scoped></style>
