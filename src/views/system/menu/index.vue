<script setup lang="ts">
import { computed, h, inject, nextTick, onMounted, reactive, ref } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import MenuAddUpdate from './menu-add-update.vue';
import { AdminApiSystemMenu } from '@/api/tags/管理后台菜单';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiIcon } from '@/wei-components';
import { WeiI18n } from '@/utils/WeiI18n';
import { PermissionAssignUsersRoleRequestDTOmenuModel } from '@/api/models/menu/PermissionAssignUsersRoleRequestDTOmenuModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';

/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); // 表格高度

/** 列表请求参数 */
const requestParams = reactive(new PermissionAssignUsersRoleRequestDTOmenuModel());
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
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const addOrUpdate = ref<InstanceType<typeof MenuAddUpdate>>();
const treeDataTranslate: any = inject('treeDataTranslate');
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.t('菜单名称').value,
    dataIndex: 'name',
    key: 'name',
    width: 250,
    resizable: true,
    align: 'left',
    fixed: 'left',
  },
  {
    title: WeiI18n.t('图标').value,
    dataIndex: 'icon',
    key: 'icon',
    width: 130,
    resizable: true,
    align: 'center',
    customRender(opt) {
      return h(WeiIcon, { icon: opt.record.icon });
    },
  },
  {
    title: WeiI18n.t('排序').value,
    dataIndex: 'sort',
    key: 'sort',
    width: 130,
    resizable: true,
    align: 'center',
  },
  {
    title: WeiI18n.t('权限标识').value,
    dataIndex: 'permission',
    key: 'permission',
    width: 130,
    resizable: true,
    align: 'left',
  },
  {
    title: WeiI18n.t('组件路径').value,
    dataIndex: 'component',
    key: 'component',
    resizable: true,
    width: 230,
    align: 'left',
    /** 超出显示 …，悬停通过原生 title 展示完整路径 */
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.t('组件名称').value,
    dataIndex: 'componentName',
    key: 'componentName',
    ellipsis: true,
    resizable: true,
    width: 130,
    align: 'left',
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    width: 150,
    align: 'center',
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

/** 横向滚动宽度（与 parameter / 系统列表一致） */
const MENU_TABLE_SCROLL_BUFFER = 24;
const menuTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + MENU_TABLE_SCROLL_BUFFER;
});

/** 列表数据 */
const dataSource = ref<Array<Menus>>([]);
/** 获取部门数据 */
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemMenu.getMenuList(requestParams);
    loading.value = false;
    dataSource.value = treeDataTranslate(res.data.data, 'id');
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getListData();
});

/** 允许新增子菜单的菜单类型 */
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
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
/**
 * 删除
 * @param id id
 */
function handleDelete(id: Menus['id']) {
  AdminApiSystemMenu.deleteMenu({ id }).then(() => {
    message.success('删除成功!');
    getListData();
  });
}

function handleResizeColumn(w: number, col: TableColumnType<Menus>) {
  col.width = w;
}

function menuTableRowClassName(_record: Menus, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

const { resetFields } = useForm(requestParams);
</script>

<template>
  <div class="drawerContent">
    <a-card class="b-body menu-list-card">
      <a-form layout="inline" class="calc-toolbar-form" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
        <a-row :gutter="[24, 12]" :wrap="true">
          <a-col :span="12" :xl="8">
            <a-form-item name="name">
              <a-input v-model:value="requestParams.name" style="width: 220px" allow-clear :placeholder="$t('请输入菜单名称')" />
            </a-form-item>
          </a-col>

          <a-col :span="12" :xl="8">
            <a-form-item name="status">
              <a-select v-model:value="requestParams.status" style="width: 220px; text-align: left" :placeholder="$t('请选择菜单状态')" allow-clear>
                <a-select-option value="0">
                  {{ $t('开启') }}
                </a-select-option>
                <a-select-option value="1">
                  {{ $t('关闭') }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12" :xl="8" class="space-x-[16px]">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
            <!-- v-hasPermi="['system:menu:create']" -->
            <a-button type="primary" @click="handleAddOrUpdate(undefined)">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-table
        class="menu-list-table exe-config-table parameter-table-spaced"
        bordered
        table-layout="fixed"
        :scroll="{ x: menuTableScrollX }"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :locale="locale"
        :data-source="dataSource"
        :columns="columns"
        @resize-column="handleResizeColumn"
        :row-class-name="menuTableRowClassName">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === 0" color="blue">开启</a-tag>
              <a-tag v-else-if="record.status === 1">关闭</a-tag>
            </span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div style="height: 22px; display: flex; align-items: center">
              <!-- v-hasPermi="['system:menu:update']" -->
              <a @click.stop="handleAddOrUpdate(record.id)">{{ $t('修改') }}</a>
              <!-- v-hasPermi="['system:menu:update']" -->
              <a-divider type="vertical" />
              <template v-if="ALLOW_CREATE_TYPES.includes(record.type) && record.status === 0">
                <!-- v-hasPermi="['system:menu:create']" -->
                <a @click.stop="handleAddOrUpdate(undefined, record.id)">{{ $t('新增') }}</a>
                <!-- v-hasPermi="['system:menu:create']" -->
                <a-divider type="vertical" />
              </template>
              <span @click.stop>
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="$t('确定要删除吗？')"
                  :ok-text="$t('确定')"
                  :cancel-text="$t('取消')"
                  :disabled="$isPending('delete', record.id)"
                  @confirm="handleDelete(record.id)">
                  <!-- v-hasPermi="['system:menu:delete']" -->
                  <a style="color: #ff4d4f">{{ $t('删除') }}</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </template>
      </a-table>
      <MenuAddUpdate ref="addOrUpdate" v-model:modal-visible="visible" @refresh-table-data="getListData" />
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.calc-toolbar-form {
  gap: 4px;
}

/* 与 product/parameter、系统角色列表表格一致 */
.menu-list-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 20px 0;
    box-sizing: border-box;
  }
}

.menu-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

/* 表头全部居中；表体对齐由各列 align 控制 */
.menu-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.menu-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.menu-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.menu-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.menu-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.menu-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.menu-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.menu-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.menu-list-table.exe-config-table.parameter-table-spaced {
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
</style>
