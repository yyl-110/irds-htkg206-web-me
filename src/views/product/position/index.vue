<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import MenuAddUpdate from './components/form/index.vue';
import { AdminApiSystemPosition } from '@/api/tags/position/管理后台岗位管理';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { ProdPositionInfoRequestDTOModel } from '@/api/models/position/ProdPositionInfoRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { WeiMessage } from '@/utils/WeiMessage';
import { exportFile } from '@/utils/file';
import UploadModal from './components/modal/upload-modal.vue';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
import MemberAuthModal from '@/components/MemberAuthModal/index.vue'; // 引入封装组件
import { EpcIcon } from '@/components/icon/EpcIcon';

/** 模块树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

/** 表单样式 label对象 */
const labelCol = ref({ style: { width: '70px' } });

/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });
/** 获取用户对象 */
const userStore = useUserStore();
const currentRoleId = ref<string | null>(null);
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); // 表格高度
const leftLoading = ref<boolean>(false);
/** 组授权页面状态 */
const grpuVisible = ref<boolean>(false);
/** 已授权数据 */
const modalVisible = ref<boolean>(false);
const targetKeys = ref<any>([]);
/** 用户组数据 */
const groupData = ref<any>([]);

interface customerList {
  label: string;
  value?: number | string;
}
/** 用户数据 */
const customerList = ref<Array<customerList>>([]);
/** 列表请求参数 */
const requestParams = reactive(new ProdPositionInfoRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** tab切换  */
const activeKey = ref('1');
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
const columns = ref([
  {
    title: WeiI18n.t('岗位名称').value,
    dataIndex: 'roleName',
    key: 'roleName',
    sorter: (a: any, b: any) => sortermethod(a.roleName, b.roleName),
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('岗位编码').value,
    dataIndex: 'roleCode',
    key: 'roleCode',
    sorter: (a: any, b: any) => sortermethod(a.roleCode, b.roleCode),
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  // {
  //   title: WeiI18n.t('编辑标识').value,
  //   dataIndex: 'modifyFlag',
  //   key: 'modifyFlag',
  //   sorter: (a: any, b: any) => sortermethod(a.modifyFlag, b.modifyFlag),
  //   width: 150,
  //  resizable: true,
  //   sortDirections: ['descend', 'ascend'],
  // },
  {
    title: WeiI18n.t('操作').value,
    align: 'left',
    dataIndex: 'operation',
    width: 100,
    fixed: 'right',
  },
]);

/** 列表数据 */
const dataSource = ref<Array<Menus>>([]);
/**
 * @description tab切换
 * @param key tab切换key
 */
function tabChange(key: string) {
  if (key === '1') {
    requestParams.type = 'INTER_PART';
  } else if (key === '2') {
    requestParams.type = 'EXTERNAL_PART';
  } else if (key === '3') {
    requestParams.type = 'OIL';
  }
  requestParams.pageNo = 1;
  getListData();
}

async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemPosition.getpositionList({
      ...requestParams,
    });
    loading.value = false;
    dataSource.value = res.data.data?.list;
    pagination.total = res.data.data?.total;
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getListData();
});

/**
 * 新增 / 修改
 * @param row
 * @param parentId parentId
 */
function handleAddOrUpdate(row: any, parentId?: number) {
  visible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    addOrUpdate.value?.handleModalAddOrUpdate(row, parentId);
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
 * @description 清除搜索
 */
function handleReset() {
  requestParams.roleName = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
/**
 * 删除
 * @param id id
 */
function handleDelete(id: Menus['id']) {
  AdminApiSystemPosition.deletePosition({ id }).then(() => {
    message.success('删除成功!');
    getListData();
  });
}
function transclearSearch() {
  document.querySelectorAll('.ant-transfer-list-search .ant-input').forEach((el: any) => {
    el.value = '';
    el.dispatchEvent(new Event('input'));
  });
}
/**
 * handle add users
 * @param record
 */
async function handleAddUsers(record: any) {
  if (!record.id) return;
  record.loading_Management = true;
  const res = await AdminApiSystemPosition.getAssignUsers({
    id: record.id,
  });
  currentRoleId.value = record.id;
  targetKeys.value = res.data.data.userIds?.map(item => item) || [];
  grpuVisible.value = true;
  getUsergroupData();
  transclearSearch();
}
/** submit */
async function handleModalConfirm() {
  if (!currentRoleId.value) throw new Error('Missing rold id');
  const userIds: Array<number> = [];
  targetKeys.value?.forEach((item: any) => {
    userIds.push(item);
  });
  const params = {
    roleId: currentRoleId.value,
    userIds,
  };
  await AdminApiSystemPosition.getObtainpositionlusers(params);
  WeiMessage.success(WeiI18n.$t('操作成功'));
  grpuVisible.value = false;
}
/** 获取用户下拉列表数据 */
function getUsergroupData() {
  try {
    leftLoading.value = true;
    AdminApiSystemUser.getSimpleUsers().then((res: any) => {
      groupData.value = res.data.data || [];
      leftLoading.value = false;
    });
  } catch (error) {
    leftLoading.value = false;
  }
}
function handleClose() {
  grpuVisible.value = false;
}
function handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
  targetKeys.value = nextTargetKeys;
}
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
/**
 * @description 导出数据
 */
async function exportData() {}
/**
 * @description 导入数据成功回调
 */
function importSuccess() {
  getListData();
  modalVisible.value = false;
}
interface MockData {
  key: string;
  title: string;
  username: string;
  nickname: string;
  chosen: boolean;
}
</script>

<template>
  <div class="bg-body">
    <a-card>
      <a-form ref="formRef" layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol" :model="requestParams">
        <a-form-item :label="$t('名称')" name="roleName">
          <a-input v-model:value="requestParams.roleName" allow-clear style="width: 240px; text-align: left" :placeholder="$t('请输入')"> </a-input>
        </a-form-item>
        <!-- <a-form-item>
          <a-button type="primary" @click="handleAddOrUpdate(undefined)">
            <EpcIcon type="icon-md-add" style="font-size: 17px" />{{
              $t("添加")
            }}
          </a-button>
        </a-form-item> -->
        <!-- <a-form-item>
          <a-button type="primary" @click="exportData">
            {{ $t('导出') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="modalVisible = true">
            {{ $t('导入') }}
          </a-button>
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" @click="handleFinish"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }} </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />{{ $t('重置') }} </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 10px">
      <a-table
        :scroll="{ x: 1200, y: 600 }"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :locale="locale"
        :data-source="dataSource"
        :columns="columns"
        @resizeColumn="handleResizeColumn"
        :row-selection="rowSelection"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div style="height: 22px; display: flex; align-items: center">
              <!-- <a @click.stop="handleAddOrUpdate(record)">{{ $t("修改") }}</a>
              <a-divider type="vertical" /> -->
              <a-button type="link" @click.stop="handleAddUsers(record)">{{ $t('成员管理') }}</a-button>
              <!-- <a-divider type="vertical" /> -->
              <!-- <div @click.stop>
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="`${$t('确定要删除吗')}?`"
                  :ok-text="$t('确定')"
                  :cancel-text="$t('取消')"
                  :disabled="$isPending('delete', record.id)"
                  @confirm="handleDelete(record.id)"
                >
                  <a style="color: #ff4d4f">{{ $t("删除") }}</a>
                </a-popconfirm>
              </div> -->
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <UploadModal :modal-visible="modalVisible" @cancel="modalVisible = false" @import-success="importSuccess" />
    <!--    弹窗 -- 新增 or 修改 -->
    <MenuAddUpdate ref="addOrUpdate" v-model:modal-visible="visible" @refresh-table-data="getListData" />
    <!-- 成员授权弹窗 -->
    <MemberAuthModal
      modalWidth="60%"
      v-model:modalVisible="grpuVisible"
      :data-source="groupData"
      v-model:target-keys="targetKeys"
      :leftLoading="leftLoading"
      :Singlechoice="false"
      @confirm="handleModalConfirm"
      @change="handleChange"
      @Cancel="handleClose" />
  </div>
</template>

<style scoped>
.bg-body {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: flex-start;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
