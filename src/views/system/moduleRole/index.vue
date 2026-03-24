<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import type RoleMenuData from './components/form/role-menu-data.vue';
import type RoleModularData from './components/form/role-modular-data.vue';
import type RoleServiceData from './components/form/role-service-data.vue';
import RolePowerData from './components/form/role-power-data.vue';
import RoleAddAndUpdate from './components/form/RoleAddAndUpdate.vue';
import AuthManagementData from './components/form/AuthManagementData.vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { useRender } from '@/components/escape';
import type { AdminListItemResponseDTO, PermissionAssignUsersRoleRequestDTO, RolePO } from '@/api/tags/data-contracts';
import { AdminApiSystemPermission } from '@/api/tags/管理后台权限';
import { WeiMessage } from '@/utils/WeiMessage';
import { RolePageRequestDTOModel } from '@/api/models/RolePageRequestDTOModel';
import { AdminApiSystemRole } from '@/api/tags/管理后台角色';
import type { RolePOModel } from '@/api/models/RolePOModel';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const transferlocale = ref(zhCN); // 绑定中文语言包
const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);
const menuVisible = ref<boolean>(false);
const authVisible = ref<boolean>(false);
const ModularVisible = ref<boolean>(false);
const ServiceVisible = ref<boolean>(false);
const menuModel = ref<InstanceType<typeof RoleMenuData>>();
const ModularModel = ref<InstanceType<typeof RoleModularData>>();
const powerModel = ref<InstanceType<typeof RolePowerData>>();
const ServiceModel = ref<InstanceType<typeof RoleServiceData>>();
const authModel = ref<InstanceType<typeof AuthManagementData>>();
/** 是否显示 新增 / 编辑 弹窗 */
const visibleRoleEditor = ref<boolean>(false);
const leftLoading = ref<boolean>(false);
interface GroupData {
  id: number;
  deptId?: number;
  name: string;
  roleClass?: number;
  key?: object;
}
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); //
/** 组授权页面状态 */
const grpuVisible = ref<boolean>(false);
/** 已授权数据 */
const targetKeys = ref<string[]>();
/** 当前操作的数据 */
const editableData = ref<RolePOModel>();
const targetKeys2 = ref<Array<number>[]>([]);
/** 用户组数据 */
const groupData = ref<Array<GroupData>>([]);
const columns = ref<TableColumnType<RolePOModel>[]>([
  // {
  //   title: WeiI18n.$t('角色编号'),
  //   dataIndex: 'id',
  //   key: 'id',
  //   align: 'center',
  //   width: 150,
  // },
  {
    title: WeiI18n.$t('角色名称'),
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    width: 260,
  },
  {
    title: WeiI18n.$t('角色标识'),
    dataIndex: 'code',
    key: 'code',
    align: 'center',
    resizable: true,
    width: 260,
    sorter: (a: any, b: any) => sortermethod(a.code, b.code),
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    resizable: true,
    width: 160,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    /**
     * customRender
     * @param root0 params
     * @param root0.text text
     */
    customRender: ({ text }) => {
      return useRender.renderDateNoTime(text);
    },
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 160,
    sorter: (a: any, b: any) => sortermethod(a.remark, b.remark),
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'center',
    width: 300,
  },
  {},
]);
const { dateRange, dateRangeParams } = useDateRangeParams();
/** 列表请求参数 */
const requestParams = reactive(new RolePageRequestDTOModel());
requestParams.code = undefined;
requestParams.roleClass = undefined;
requestParams.status = undefined;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

const { resetFields } = useForm(requestParams);
/** handle reset fields */
function handleResetFields() {
  dateRange.value = null;
  requestParams.pageNo = 1;
  pagination.current = 1;
  resetFields();
}

/** 列表数据 */
const resources = ref<Array<RolePOModel>>([]);

/** 获取用户组数据 */
async function getResources() {
  loading.value = true;
  try {
    const res = await AdminApiSystemRole.getRolePage({
      ...requestParams,
      createTime: dateRangeParams.value,
    });
    resources.value = res.data.data?.list || [];
    pagination.total = res.data.data?.total;
    resources.value.forEach((item: any) => {
      item.loading_Management = false;
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getResources();
});

/** 查询表格数据 */
function handleFinish() {
  pagination.current = 1;
  requestParams.pageNo = 1;
  getResources();
}

/**
 * 删除资源
 * @param id id
 */
async function handleDelete(id: number) {
  // Modal.confirm({
  //   title: "`${$t('确定要删除吗')}?`",
  //   async onOk() {
  await AdminApiSystemRole.deleteRole({ id });
  message.success(WeiI18n.$t('删除成功'));
  handleFinish();
  //   },
  // })
}

/**
 * handle add or update
 * @param record record
 */
function handleAddOrUpdate(record?: RolePOModel) {
  // visible.value = true
  // nextTick(() => {
  //   addOrUpdate.value?.handleModalAddOrUpdate(record)
  // })
  editableData.value = record;
  visibleRoleEditor.value = true;
}
/**
 * handle menu data
 * @param resource resource
 */
function handleMenuData(resource: RolePOModel) {
  menuVisible.value = true;
  nextTick(() => {
    menuModel.value?.handleMenuListData(resource);
  });
}

function handleResizeColumn(w, col) {
  col.width = w;
}

/**
 * 授权管理
 * @param resource resource
 */
function authManagement(resource: RolePOModel) {
  authVisible.value = true;

  nextTick(() => {
    authModel.value?.handleMenuListData(resource);
  });
}

/**
 * handle menu data
 * @param resource resource
 */
function handleModularData(resource: RolePOModel) {
  ModularVisible.value = true;
  nextTick(() => {
    ModularModel.value?.handleMenuListData(resource);
  });
}
/**
 * handle menu data
 * @param resource resource
 */
function handleServiceData(resource: RolePOModel) {
  ModularVisible.value = true;
  nextTick(() => {
    ServiceModel.value?.handleMenuListData(resource);
  });
}
/**
 * handle power data
 * @param resource resource
 */
function handlePowerData(resource: RolePOModel) {
  powVisible.value = true;
  nextTick(() => {
    powerModel.value?.handlePowerListData(resource);
  });
}
/** handle close menu modal */
function handleCloseMenuModal() {
  menuVisible.value = false;
}
/** handle close menu modal */
function handleCloseModularModal() {
  ModularVisible.value = false;
}
/** handle close power modal */
function handleClosePowModal() {
  powVisible.value = false;
}
const currentRoleId = ref<string | null>(null);
function transclearSearch() {
  document.querySelectorAll('.ant-transfer-list-search .ant-input').forEach(el => {
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
  const res = await AdminApiSystemPermission.getUsersByRole({
    roleId: record.id,
  });
  currentRoleId.value = record.id;
  targetKeys2.value = res.data.data?.map(item => item.id) || [];
  record.loading_Management = false;
  grpuVisible.value = true;
  getUserSelectData();
  transclearSearch();
}
/** 获取用户下拉列表数据 */
function getUserSelectData() {
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

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/** submit */
async function handleResetOk() {
  if (!currentRoleId.value) throw new Error('Missing rold id');
  const userIds: Array<number> = [];
  const deptIds: Array<number> = [];
  targetKeys2.value?.forEach((item: any) => {
    userIds.push(item);
  });
  const params: PermissionAssignUsersRoleRequestDTO = {
    roleIds: [currentRoleId.value],
    userIds,
    deptIds,
  };
  await AdminApiSystemPermission.assignUsersRole(params);
  WeiMessage.success(WeiI18n.$t('操作成功'));
  grpuVisible.value = false;
}
function handleClose() {
  grpuVisible.value = false;
}
function handleChange(nextTargetKeys: any, direction: string, moveKeys: string[]) {
  targetKeys.value = nextTargetKeys;
}
/**
 *
 * @param sourceSelectedKeys 数据源选中列表
 * @param targetSelectedKeys 已授权选中列表
 */
function handleSelectChange(sourceSelectedKeys: string[], targetSelectedKeys: string[]) {}

interface MockData {
  key: string;
  title: string;
  username: string;
  nickname: string;
  chosen: boolean;
}
function filterOption(inputValue: string, option: MockData) {
  const arr = option.nickname + option.username;
  return arr.includes(inputValue);
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.roleIndex');
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
        <a-form-item name="name">
          <a-input v-model:value="requestParams.name" style="width: 220px" :placeholder="$t('请输入角色名称')" allow-clear />
        </a-form-item>
        <a-form-item name="code">
          <a-input v-model:value="requestParams.code" style="width: 220px" :placeholder="$t('请输入角色标识')" allow-clear />
        </a-form-item>
        <a-form-item name="createTime">
          <a-range-picker v-model:value="dateRange" style="width: 300px" :placeholder="[$t('选择开始日期'), $t('选择结束日期')]" />
        </a-form-item>
        <a-form-item>
          <!-- v-hasPermi="['system:role:query']" -->
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <!-- v-hasPermi="['system:role:create']" -->
          <a-button type="primary" style="margin-left: 15px" @click="handleAddOrUpdate(undefined)" v-if="userStore.getUser.userType != '3'">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="mt-[10px] b-body2">
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="resources"
        :pagination="pagination"
        :locale="locale"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
        @resize-column="handleResizeColumn">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === 0" color="blue"> {{ $t('开启') }}</a-tag>
              <a-tag v-else-if="record.status === 1">{{ $t('关闭') }}</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation' && userStore.getUser.userType != '3'">
            <!-- v-hasPermi="['system:role:update']" -->
            <!-- <a-button type="link" :disabled="record.type === 1" @click="handleAddOrUpdate(record)">
            {{ $t('编辑') }}
          </a-button> -->
            <a v-if="record.type !== 1" @click="handleAddOrUpdate(record)">{{ $t('编辑') }}</a>
            <!-- v-hasPermi="['system:role:update']" -->
            <a-divider type="vertical" />
            <!-- v-hasPermi="['system:permission:assign-role-menu']" -->
            <a @click="authManagement(record)">{{ $t('授权管理') }}</a>
            <!-- v-hasPermi="['system:permission:assign-role-menu']" -->
            <a-divider type="vertical" />
            <!-- v-hasPermi="['system:permission:assign-user-role']" -->
            <a v-if="record.type !== 1" @click="handleAddUsers(record)">{{ $t('成员管理') }}</a>
            <!-- <a-button type="link" :loading="record.loading_Management" @click.stop="handleAddUsers(record)">{{ $t('成员管理') }}</a-button> -->
            <!-- v-hasPermi="['system:permission:assign-user-role']" -->
            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="record.type === 1" @confirm="handleDelete(record.id)">
              <!-- v-hasPermi="['system:role:delete']" -->
              <a-button type="link" danger :disabled="record.type === 1" class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
      <RoleAddAndUpdate v-model:visible="visibleRoleEditor" :resource="editableData" @success="handleFinish" />
      <RolePowerData ref="powerModel" v-model:modal-visible="powVisible" @refresh-table-data="getResources" @close="handleClosePowModal" />
      <AuthManagementData ref="authModel" v-model:modal-visible="authVisible" />
    </a-card>
    <div v-dragModal class="roleIndex">
      <a-modal
        v-model:visible="grpuVisible"
        style="width: 60%"
        :get-container="customGetContainer"
        :mask-closable="false"
        :title="$t('成员授权')"
        :confirm-loading="$isPending()"
        @ok="handleResetOk"
        @cancel="handleClose">
        <div style="display: flex; justify-content: center">
          <a-transfer
            v-model:target-keys="targetKeys2"
            :locale="transferlocale.Transfer"
            :data-source="groupData"
            :titles="['未授权用户', '已授用户']"
            :render="(item: any) => `${item.nickname}  （${item.username}）`"
            :row-key="(item: any) => item.id"
            show-search
            :filter-option="filterOption"
            :pagination="{
              pageSize: 20,
            }"
            :list-style="{
              width: '400px',
              height: '540px',
            }"
            @change="handleChange"
            @select-change="handleSelectChange">
            <template #notFoundContent>
              <a-spin v-if="leftLoading" size="small" tip="加载中..." />
              <span v-else>暂无数据</span>
            </template>
          </a-transfer>
        </div>
        <template #footer>
          <a-button type="primary" @click="handleResetOk()">
            {{ $t('确定') }}
          </a-button>
          <a-button @click="handleClose">
            {{ $t('取消') }}
          </a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<style lang="less" scoped>
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}

// .user-selector-modal{
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
