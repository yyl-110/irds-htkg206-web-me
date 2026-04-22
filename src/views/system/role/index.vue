<script lang="ts" setup>
import { computed, h, nextTick, reactive, ref } from 'vue';
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
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
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
  nickname?: string;
  username?: string;
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
const targetKeys2 = ref<number[]>([]);
/** 用户组数据 */
const groupData = ref<Array<GroupData>>([]);

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

/** 列表数据（须在 roleTableDisplayList 等之前声明） */
const resources = ref<Array<RolePOModel>>([]);

/** 首列固定 + 操作列固定；排序/首列筛选由表头插槽控制 */
const columns = ref<TableColumnType<RolePOModel>[]>([
  {
    title: WeiI18n.$t('角色名称'),
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    resizable: true,
    width: 260,
    fixed: 'left',
  },
  {
    title: WeiI18n.$t('角色标识'),
    dataIndex: 'code',
    key: 'code',
    align: 'left',
    resizable: true,
    width: 260,
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    resizable: true,
    width: 160,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 160,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'center',
    width: 300,
    fixed: 'right',
  },
]);

type RoleSortOrder = 'ascend' | 'descend' | '';
const roleTableSortState = ref<{ key: string; order: RoleSortOrder }>({ key: '', order: '' });

/** 表头筛选（与 product/parameter/index 一致） */
const roleTableFilterValueMap = ref<Record<string, string>>({ name: '' });
const roleTableFilterOpenMap = ref<Record<string, boolean>>({});

function isRoleTableSortableColumn(column: any) {
  const k = column?.dataIndex;
  return Boolean(k && k !== 'operation');
}

function isRoleTableFilterableColumn(column: any) {
  return column?.dataIndex === 'name';
}

function setRoleTableFilterOpen(key: string, open: boolean) {
  roleTableFilterOpenMap.value = { ...roleTableFilterOpenMap.value, [key]: open };
}

function getRoleTableFilterOpen(key: string) {
  return Boolean(roleTableFilterOpenMap.value[key]);
}

function handleRoleTableFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'name') {
      roleTableFilterValueMap.value = { ...roleTableFilterValueMap.value, name: String(requestParams.name ?? '') };
    }
  }
  setRoleTableFilterOpen(key, open);
}

function onRoleNameTableFilterVisibleChange(visible: boolean) {
  handleRoleTableFilterOpenChange('name', visible);
}

function getRoleTableSortOrder(dataIndex: string): RoleSortOrder {
  return roleTableSortState.value.key === dataIndex ? roleTableSortState.value.order : '';
}

function toggleRoleTableColumnSort(column: any) {
  if (!isRoleTableSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (roleTableSortState.value.key !== key) {
    roleTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (roleTableSortState.value.order === 'ascend') {
    roleTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (roleTableSortState.value.order === 'descend') {
    roleTableSortState.value = { key: '', order: '' };
    return;
  }
  roleTableSortState.value = { key, order: 'ascend' };
}

const roleTableDisplayList = computed(() => {
  let list = [...resources.value];
  if (!roleTableSortState.value.key || !roleTableSortState.value.order) return list;
  const key = roleTableSortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[key], b[key]));
  return roleTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function applyRoleTableColumnFilter(key: string) {
  if (key === 'name') {
    requestParams.name = String(roleTableFilterValueMap.value[key] ?? '').trim();
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setRoleTableFilterOpen(key, false);
  void getResources();
}

function resetRoleTableColumnFilter(key: string) {
  if (key === 'name') {
    roleTableFilterValueMap.value = { ...roleTableFilterValueMap.value, name: '' };
    requestParams.name = '';
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setRoleTableFilterOpen(key, false);
  void getResources();
}

const ROLE_TABLE_SCROLL_BUFFER = 24;
const roleTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + ROLE_TABLE_SCROLL_BUFFER;
});

function getRoleRowKey(record: RolePOModel) {
  return record.id ?? '';
}

function transferItemRender(item: GroupData) {
  return `${item.nickname}  （${item.username}）`;
}

function transferRowKey(item: GroupData) {
  return item.id;
}

function roleTableRowClassName(_record: RolePOModel, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

/** handle reset fields */
function handleResetFields() {
  dateRange.value = null;
  requestParams.pageNo = 1;
  pagination.current = 1;
  roleTableSortState.value = { key: '', order: '' };
  roleTableFilterValueMap.value = { ...roleTableFilterValueMap.value, name: '' };
  setRoleTableFilterOpen('name', false);
  resetFields();
}

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
async function handleDelete(id: string | number) {
  // Modal.confirm({
  //   title: "`${$t('确定要删除吗')}?`",
  //   async onOk() {
  await AdminApiSystemRole.deleteRole({ id: Number(id) });
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

function handleResizeColumn(w: number, col: TableColumnType<RolePOModel>) {
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
    const input = el as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
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
  targetKeys2.value =
    res.data.data?.flatMap(item => (item.id != null ? [Number(item.id)] : [])) ?? [];
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
    style: { paddingTop: '50px' },
  }),
});

/** submit */
async function handleResetOk() {
  const rid = Number(currentRoleId.value);
  if (!currentRoleId.value || !Number.isFinite(rid)) throw new Error('Missing role id');
  const userIds: Array<number> = [];
  const deptIds: Array<number> = [];
  targetKeys2.value?.forEach((item: any) => {
    userIds.push(item);
  });
  const params: PermissionAssignUsersRoleRequestDTO = {
    roleIds: [rid],
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
    <a-card class="b-body2 role-page-card">
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
      <a-table
        class="role-list-table exe-config-table parameter-table-spaced"
        bordered
        table-layout="fixed"
        :scroll="{ x: roleTableScrollX }"
        :row-key="getRoleRowKey"
        :columns="columns"
        :data-source="roleTableDisplayList"
        :pagination="pagination"
        :locale="locale"
        :loading="loading"
        :row-class-name="roleTableRowClassName"
        @resize-column="handleResizeColumn">
        <template #headerCell="{ column }">
          <template v-if="isRoleTableSortableColumn(column) || isRoleTableFilterableColumn(column)">
            <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isRoleTableFilterableColumn(column) }">
              <span
                class="header-title-sort"
                :class="{ 'header-title-sort--disabled': !isRoleTableSortableColumn(column) }"
                @click.stop="toggleRoleTableColumnSort(column)">
                <span>{{ column.title }}</span>
                <span v-if="isRoleTableSortableColumn(column)" class="header-sort-icon">
                  <CaretUpOutlined v-if="getRoleTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                  <CaretDownOutlined v-else-if="getRoleTableSortOrder(String(column.dataIndex)) === 'descend'" />
                  <CaretUpOutlined v-else class="header-sort-icon--muted" />
                </span>
              </span>
              <span v-if="isRoleTableFilterableColumn(column)" class="header-filter-anchor">
                <a-popover
                  trigger="click"
                  placement="bottomRight"
                  :visible="getRoleTableFilterOpen('name')"
                  @update:visible="onRoleNameTableFilterVisibleChange">
                  <template #content>
                    <div class="header-filter-pop">
                      <a-input
                        v-model:value="roleTableFilterValueMap.name"
                        :placeholder="`${$t('搜索')} ${column.title}`"
                        allow-clear
                        @pressEnter="applyRoleTableColumnFilter('name')" />
                      <div class="header-filter-actions">
                        <a-button type="primary" size="small" @click="applyRoleTableColumnFilter('name')">
                          <SearchOutlined />
                          {{ $t('确定') }}
                        </a-button>
                        <a-button size="small" @click="resetRoleTableColumnFilter('name')">{{ $t('重置') }}</a-button>
                      </div>
                    </div>
                  </template>
                  <FilterOutlined class="header-query-icon" />
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
          <template v-else-if="column.dataIndex === 'createTime'">
            <span>{{ useRender.renderDateNoTime(record.createTime) }}</span>
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
              <a-button type="link" danger :disabled="record.type === 1" class="p-0 text-[12px]">
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
            :render="transferItemRender"
            :row-key="transferRowKey"
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

.role-page-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 20px 0;
    box-sizing: border-box;
  }
}

.role-page-card :deep(.ant-table-wrapper) {
  margin-top: 0;
}

.role-page-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.role-page-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.role-page-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.role-page-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.role-page-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.role-page-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.role-page-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.role-page-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.role-page-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.role-list-table.exe-config-table.parameter-table-spaced {
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
  padding-right: 22px;
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

/** 文本列：表体左对齐（列 align:left）；表头仍居中，与参数列表参考图一致 */
.role-list-table :deep(.ant-table-thead > tr > th:nth-child(1)),
.role-list-table :deep(.ant-table-thead > tr > th:nth-child(2)),
.role-list-table :deep(.ant-table-thead > tr > th:nth-child(4)) {
  text-align: center !important;
}

.role-list-table :deep(.ant-table-thead > tr > th:nth-child(1) .ant-table-column-sorters),
.role-list-table :deep(.ant-table-thead > tr > th:nth-child(2) .ant-table-column-sorters),
.role-list-table :deep(.ant-table-thead > tr > th:nth-child(4) .ant-table-column-sorters) {
  justify-content: center !important;
}

.role-list-table :deep(.ant-table-tbody > tr > td:nth-child(1)),
.role-list-table :deep(.ant-table-tbody > tr > td:nth-child(2)),
.role-list-table :deep(.ant-table-tbody > tr > td:nth-child(4)) {
  text-align: left !important;
}
</style>
