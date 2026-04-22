<!-- eslint-disable jsdoc/check-tag-names -->
<script setup lang="ts">
import { computed, h, nextTick, reactive, ref } from 'vue';
import type { FormInstance, FormProps, UploadFile } from 'ant-design-vue';
import { Modal, Switch, message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { VxeGridPropTypes } from 'vxe-table';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import SubaccountDialog from './components/form/SubaccountDialog.vue';
import Userdetail from './components/detail/index.vue';
import UserAddUpdate from './components/form/user-add-update.vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { CommonStatusEnum } from '@/utils/constants';
import { TableColumnsType } from 'ant-design-vue';
import { encryptValue, passwordPattern, passwordPatternMessage } from '@/utils/AES';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { UserPageRequestDTOModel } from '@/api/models/UserPageRequestDTOModel';
import type { UserPageItemResponseDTOModel } from '@/api/models/UserPageItemResponseDTOModel';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { useUserStore } from '@/store/modules/user';
import appStore from '@/store';
import Cookies from 'js-cookie';
import { useRender } from '@/components/escape';
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import type { UserProfileUpdatePasswordRequestDTO } from '@/api/tags/data-contracts';
import { useRoute, useRouter } from 'vue-router';
import { toLogin } from '@/httpRequest';
import { exportFile } from '@/utils/file';
import { listToTree, sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
const { push, $router } = useRouter();
const userStore = useUserStore();
/** 列表请求参数 */
const requestParams = reactive(new UserPageRequestDTOModel());
requestParams.status = undefined; // 将状态参数初始化为 undefined
requestParams.fullname = undefined; // 将 fullname 参数初始化为 undefined
/** 角色id列表 */
const deptIdList = ref<Array<DefaultOptionType>>([]);
const deptIdtreeList = ref<Array<DefaultOptionType>>([]);
/** 表单样式 label对象 */
const labelCol = ref({ style: { width: '80px' } });
/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });
const treeDefaultExpandedKeys = ref<any>('');
const synchronizeLoading = ref<boolean>(false);
async function getdeptList() {
  const res = await AdminApiSystemDept.listDepts({});
  if (res.data.data[0]) {
    treeDefaultExpandedKeys.value = res.data.data[0].id;
  }
  const list = res.data.data?.map(item => ({ label: item.name, value: item.id, id: item.id, parentId: item.parentId })) || [];
  deptIdList.value = list;
  deptIdtreeList.value = listToTree(list || []);
}
const visibleSubaccountCart = ref<boolean>(false);
function handledeptIdList(row: any) {
  let str = '';
  deptIdList.value.forEach(item => {
    if (item.value == row.deptId) {
      str = item.label;
    }
  });
  return str;
}
const userType = ref([
  {
    label: '普通用户',
    value: 1,
  },
  {
    label: 'pdm',
    value: 2,
  },
]);

const handleStatusChange = (record: any) => {
  const _text = record.status === CommonStatusEnum.ENABLE ? WeiI18n.t('停用').value : WeiI18n.t('启用').value;
  Modal.confirm({
    title: `确认要"${_text}""${record.username}"用户吗?`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      await AdminApiSystemUser.updateUserStatus({ id: record.id as number, status: record.status === 0 ? 1 : 0 });
      await getListData();
    },
  });
};

/** 斑马纹：与参数管理列表一致（odd / even） */
const rowClassName = (_record: any, index: number) => (index % 2 === 0 ? 'odd' : 'even');

function getUserTableRowKey(record: UserPageItemResponseDTOModel) {
  return record.id;
}

/** 表头排序（当前页数据，与 product/parameter/index 一致） */
type UserSortOrder = 'ascend' | 'descend' | '';
const userTableSortState = ref<{ key: string; order: UserSortOrder }>({ key: '', order: '' });
/** 表头筛选：草稿 + 弹层显隐 */
const userTableFilterValueMap = ref<Record<string, string>>({ username: '' });
const userTableFilterOpenMap = ref<Record<string, boolean>>({});

function isUserTableSortableColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation') return false;
  return true;
}

function isUserTableFilterableColumn(column: any) {
  return column?.dataIndex === 'username';
}

function setUserTableFilterOpen(key: string, open: boolean) {
  userTableFilterOpenMap.value = { ...userTableFilterOpenMap.value, [key]: open };
}

function getUserTableFilterOpen(key: string) {
  return Boolean(userTableFilterOpenMap.value[key]);
}

function handleUserTableFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'username') {
      userTableFilterValueMap.value = { ...userTableFilterValueMap.value, username: String(requestParams.username ?? '') };
    }
  }
  setUserTableFilterOpen(key, open);
}

function onUsernameTableFilterVisibleChange(visible: boolean) {
  handleUserTableFilterOpenChange('username', visible);
}

function getUserTableSortOrder(dataIndex: string): UserSortOrder {
  return userTableSortState.value.key === dataIndex ? userTableSortState.value.order : '';
}

function toggleUserTableColumnSort(column: any) {
  if (!isUserTableSortableColumn(column)) return;
  const key = String(column.dataIndex ?? column.key);
  if (userTableSortState.value.key !== key) {
    userTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (userTableSortState.value.order === 'ascend') {
    userTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (userTableSortState.value.order === 'descend') {
    userTableSortState.value = { key: '', order: '' };
    return;
  }
  userTableSortState.value = { key, order: 'ascend' };
}

const userTableDisplayList = computed(() => {
  let list = [...resources.value];
  if (!userTableSortState.value.key || !userTableSortState.value.order) return list;
  const key = userTableSortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[key], b[key]));
  return userTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function applyUserTableColumnFilter(key: string) {
  if (key === 'username') {
    requestParams.username = String(userTableFilterValueMap.value[key] ?? '').trim();
  }
  requestParams.pageNo = 1;
  pagination.current = 1;
  setUserTableFilterOpen(key, false);
  void getListData();
}

function resetUserTableColumnFilter(key: string) {
  if (key === 'username') {
    userTableFilterValueMap.value = { ...userTableFilterValueMap.value, username: '' };
    requestParams.username = '';
  }
  requestParams.pageNo = 1;
  pagination.current = 1;
  setUserTableFilterOpen(key, false);
  void getListData();
}

/** 表格 locale（排序提示等）；空状态仍优先使用下方 #emptyText 插槽 */
const tableLocale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/** 仅首列左侧固定 + 操作列右侧固定；排序/筛选由表头插槽控制（首列独有筛选） */
const columns = computed<TableColumnsType>(() => [
  {
    title: WeiI18n.t('用户名').value,
    dataIndex: 'username',
    key: 'username',
    width: 200,
    fixed: 'left',
    align: 'center',
  },
  {
    title: WeiI18n.t('姓名').value,
    dataIndex: 'nickname',
    key: 'nickname',
    width: 200,
    align: 'center',
  },
  {
    title: WeiI18n.t('部门名称').value,
    dataIndex: 'deptId',
    key: 'dept',
    width: 200,
    align: 'left',
  },
  {
    title: WeiI18n.t('密级').value,
    dataIndex: 'confidentialLevel',
    key: 'confidentialLevel',
    width: 100,
    align: 'center',
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'status',
    key: 'status',
    width: 130,
    align: 'center',
  },
  {
    title: WeiI18n.t('创建时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    align: 'center',
  },
  {
    title: WeiI18n.t('操作').value,
    key: 'operation',
    fixed: 'right',
    width: 240,
    align: 'center',
  },
]);

/** 横向滚动宽度（列宽之和 + 缓冲） */
const USER_TABLE_SCROLL_BUFFER = 24;
const userTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + USER_TABLE_SCROLL_BUFFER;
});
const loading = ref(false);
const { dateRange, dateRangeParams } = useDateRangeParams();
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const resources = ref<Array<UserPageItemResponseDTOModel>>([]);
/** 新增页面编辑状态 */
const updFlag = ref<boolean>(false);
/** 参数字典的用户类型 */
const userList = ref([
  {
    label: '国内',
    value: '1',
  },
  {
    label: '国贸',
    value: '2',
  },
  {
    label: '集成',
    value: '3',
  },
  {
    label: '服务站',
    value: '4',
  },
  {
    label: '中心站',
    value: '5',
  },
]);
/** 列表、添加编辑切状态 */
const modalVisible = ref<boolean>(false);
/** 列表、详情切状态 */
const modalVisibledetail = ref<boolean>(false);
const dataDetails: any = ref();
const fRefAddUpdate: any = ref();
/** 获取表格数据 */
async function getListData() {
  loading.value = true;
  try {
    requestParams.createTime = dateRangeParams.value; // 开始 - 结束时间
    requestParams.roleName = userStore.getUser.nickname;
    requestParams.userType = userStore.getUser.userType;
    const res = await AdminApiSystemUser.getUserPage(requestParams);
    resources.value = res.data.data!.list;
    pagination.total = res.data.data!.total;
    // gridOptions.value.pagerConfig!.total = res.data.data!.total
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getdeptList();
  getListData();
});

/**
 * 删除用户
 * @param id user id
 */
async function handleDelete(id: number) {
  await AdminApiSystemUser.deleteUser1({ id });
  message.success(WeiI18n.t('删除成功').value);
  pagination.current = 1;
  getListData();
}
/**
 * 新增 or 修改 弹窗
 * @param id id
 * @param type true：详情 false：新增编辑
 */
function handleAddOrUpdate(id: any, type: boolean) {
  updFlag.value = type;
  if (type) {
    modalVisibledetail.value = true;
  } else {
    modalVisible.value = true;
  }
  if (id) {
    if (type) {
      nextTick(() => {
        dataDetails.value.handleModalAddOrUpdate(id);
      });
    } else {
      nextTick(() => {
        fRefAddUpdate.value.handleModalAddOrUpdate(id);
      });
    }
  }
}
async function synchronizeUsers() {
  try {
    synchronizeLoading.value = true;
    const res = await AdminApiSystemUser.syncWTUser({});
    if (res.data.code == 0) {
      message.success('操纵成功');
    }
  } catch (error) {
    console.log(error);
  } finally {
    synchronizeLoading.value = false;
  }
}
/**
 * @description: 用户组实体类
 */
interface GroupData {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}
function canlemodalVisible() {
  modalVisible.value = false;
  getListData();
}
/**
 * @description 清除搜索
 */
function handleResetFields() {
  requestParams.type = '';
  requestParams.condition = '';
  requestParams.username = '';
  requestParams.deptId = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  userTableSortState.value = { key: '', order: '' };
  userTableFilterValueMap.value = { ...userTableFilterValueMap.value, username: '' };
  setUserTableFilterOpen('username', false);
  getListData();
}
function canlemodalVisibledetail() {
  modalVisibledetail.value = false;
  getListData();
}
/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
const fileList = ref<any[]>([]);
// const onCustomRequest: = async file => {
//   const res = await AdminApiSystemUser.uploadFile({ file });
//   if (res.data.code === 200) {
//     getListData();
//   }
//   fileList.value = [];
//   return res.data.data;
// };
const userRow = ref<any>();

const current = ref<string[]>([]);
function mouseoverenter() {
  current.value = [];
}
// -----------------重置密码------------------
const promptvisible = ref<boolean>(false);
const resetpasswordId = ref<any>('');
/** 表单对象 */
const formRef = ref<FormInstance>();
/** 基本信息 - 修改密码 */
interface UserProfileUpdatePasswordForm extends UserProfileUpdatePasswordRequestDTO {
  newPassword: string;
  confirmPassword: string;
}
/** 密码对象 */
const passwordFormData = ref<UserProfileUpdatePasswordForm>({ newPassword: '', confirmPassword: '' });
function resetpassword(row: any) {
  promptvisible.value = true;
  resetpasswordId.value = row.id;
}
async function handleOk() {
  await formRef.value?.validateFields();
  let data = {
    id: resetpasswordId.value,
    password: passwordFormData.value.confirmPassword,
  };
  try {
    const res = await AdminApiSystemUser.updatepasswor(data);
    if (res.data.code === 200) {
      message.success(WeiI18n.t('操作成功').value);
      if (userStore.getUser.id == resetpasswordId.value) {
        Cookies.set('IsUpdatePassCheck', '0');
        const userStore = appStore.useUser;
        try {
          await userStore.loginOut();
        } catch (error) {
          console.error(error);
        } finally {
          await toLogin();
          $router.replace('/login');
        }
      }
      promptvisible.value = false;
    } else {
      message.error(WeiI18n.t('操作失败').value);
    }
  } catch (error) {
    console.log(error);
  }
}
function handcancel() {
  promptvisible.value = false;
  resetForm();
}
/** resetForm */
const resetForm = () => formRef.value?.resetFields();

/** validatePassword */
function validatePassword() {
  if (passwordFormData.value.confirmPassword !== '' && passwordFormData.value.newPassword !== '' && passwordFormData.value.confirmPassword !== passwordFormData.value.newPassword) {
    return Promise.reject(new Error('两次输入的密码必须一致'));
  } else {
    return Promise.resolve();
  }
}
const rules: Record<keyof UserProfileUpdatePasswordForm, Rule | Array<Rule>> = {
  newPassword: [
    { required: true, message: '新密码不能为空' },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'change' },
  ],
  confirmPassword: [
    { required: true, message: '新密码不能为空' },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'change' },
  ],
};

const iconLoading = ref<boolean>(false);
/**
 * @description 导出数据
 */
async function exportData() {
  try {
    iconLoading.value = true;
    await AdminApiSystemUser.excelExport({}).then(res => {
      exportFile(res, '用户信息列表.xlsx');
      iconLoading.value = false;
    });
  } catch (error) {
    iconLoading.value = false;
  }
}
</script>

<template>
  <div class="drawerContent">
    <a-card v-if="!modalVisible && !modalVisibledetail" class="calc-merged-card user-page-list-card">
      <a-form layout="inline" class="calc-toolbar-form" :label-col="labelCol" :wrapper-col="wrapperCol" :model="requestParams" @finish="handleFinish">
        <a-form-item>
          <a-input v-model:value="requestParams.condition" style="width: 220px" :placeholder="$t('请输入用户名或姓名')" allow-clear />
        </a-form-item>
        <a-form-item name="deptId">
          <a-tree-select
            v-model:value="requestParams.deptId"
            show-search
            :placeholder="$t('请选择部门')"
            style="width: 240px; text-align: left"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            allow-clear
            :treeDefaultExpandedKeys="[treeDefaultExpandedKeys]"
            :tree-data="deptIdtreeList"
            tree-node-filter-prop="label">
          </a-tree-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button v-if="userStore.getUser.userType != '4'" type="primary" @click="handleAddOrUpdate(undefined, false)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button v-if="userStore.getUser.userType != '4'" type="primary" :loading="synchronizeLoading" @click="synchronizeUsers">
            <EpcIcon type="icon-tongbu2" style="font-size: 15px" />
            {{ $t('同步用户') }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button v-if="userStore.getUser.userType != '4'" type="primary" class="m-right" :loading="iconLoading" @click="exportData">
            <EpcIcon type="icon-daochu" style="font-size: 12px" />
            {{ $t('导出') }}
          </a-button>
        </a-form-item>
      </a-form>

      <a-table
        class="exe-config-table parameter-table-spaced"
        table-layout="fixed"
        :columns="columns"
        :data-source="userTableDisplayList"
        :scroll="{ x: userTableScrollX }"
        :row-key="getUserTableRowKey"
        :loading="loading"
        bordered
        :locale="tableLocale"
        :row-class-name="rowClassName"
        :pagination="false">
        <template #headerCell="{ column }">
          <template v-if="isUserTableSortableColumn(column) || isUserTableFilterableColumn(column)">
            <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isUserTableFilterableColumn(column) }">
              <span
                class="header-title-sort"
                :class="{ 'header-title-sort--disabled': !isUserTableSortableColumn(column) }"
                @click.stop="toggleUserTableColumnSort(column)">
                <span>{{ column.title }}</span>
                <span v-if="isUserTableSortableColumn(column)" class="header-sort-icon">
                  <CaretUpOutlined v-if="getUserTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                  <CaretDownOutlined v-else-if="getUserTableSortOrder(String(column.dataIndex)) === 'descend'" />
                  <CaretUpOutlined v-else class="header-sort-icon--muted" />
                </span>
              </span>
              <span v-if="isUserTableFilterableColumn(column)" class="header-filter-anchor">
                <a-popover
                  trigger="click"
                  placement="bottomRight"
                  :visible="getUserTableFilterOpen('username')"
                  @update:visible="onUsernameTableFilterVisibleChange">
                  <template #content>
                    <div class="header-filter-pop">
                      <a-input
                        v-model:value="userTableFilterValueMap.username"
                        :placeholder="`${$t('搜索')} ${column.title}`"
                        allow-clear
                        @pressEnter="applyUserTableColumnFilter('username')" />
                      <div class="header-filter-actions">
                        <a-button type="primary" size="small" @click="applyUserTableColumnFilter('username')">
                          <SearchOutlined />
                          {{ $t('确定') }}
                        </a-button>
                        <a-button size="small" @click="resetUserTableColumnFilter('username')">{{ $t('重置') }}</a-button>
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
          <template v-if="column.key === 'dept'">
            <div>{{ handledeptIdList(record) }}</div>
          </template>
          <template v-if="column.key === 'confidentialLevel'">
            <div v-if="record.confidentialLevel==2">一般</div>
            <div v-else-if="record.confidentialLevel==3">重要</div>
            <div v-else-if="record.confidentialLevel==4">核心</div>
            <div v-else>公开</div>
          </template>
          <template v-if="column.key === 'status'">
            <a-switch
              :checked="Number(record.status) === 0"
              :disabled="userStore.getUser.userType === '4'"
              @change="() => handleStatusChange(record)"
            />
          </template>
          <template v-if="column.key === 'createTime'">
            <span>{{ useRender.renderDateNoTime(new Date(record.createTime)) }}</span>
          </template>
          <template v-if="column.key === 'operation'">
            <a @click="handleAddOrUpdate(record.id, false)" v-if="userStore.getUser.userType != '4'"> {{ $t('编辑') }}</a>
            <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
            <a @click="handleAddOrUpdate(record.id, true)"> {{ $t('详情') }}</a>
            <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0 text-[12px]" v-if="userStore.getUser.userType != '4'">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
            <a @click="resetpassword(record)" v-if="userStore.getUser.userType != '4'"> {{ $t('重置密码') }}</a>
          </template>
        </template>
        <!-- 空数据插槽 -->
        <template #emptyText>
          <div class="mx-auto pt-[40px] w-[235px] h-[235px]">
            <img width="100%" height="auto" src="@/assets/images/empty.png" alt="暂无数据" />
            <div>数据为空</div>
          </div>
        </template>
      </a-table>
      <div class="user-page-pagination flex justify-end mt-[16px]">
        <a-pagination v-bind="pagination" class="ant-table-pagination" />
      </div>
    </a-card>
    <div class="user-page">
      <!-- 新增、编辑页面 -->
      <UserAddUpdate v-if="modalVisible" ref="fRefAddUpdate" @canlemodal-visible="canlemodalVisible" />
      <!-- 弹窗, 详情 -->
      <Userdetail v-if="modalVisibledetail" ref="dataDetails" @canlemodal-visible="canlemodalVisibledetail" />
    </div>
    <SubaccountDialog :userRow="userRow" :modal-visible="visibleSubaccountCart" @on-close="visibleSubaccountCart = false" />
    <a-modal v-model:visible="promptvisible" :title="$t('重置密码')" @ok="handleOk" @cancel="handcancel" width="45%">
      <a-form ref="formRef" class="w-full max-w-[600px] min-w-[240px]" :model="passwordFormData" :rules="rules" :label-col="{ style: { width: '100px' } }">
        <a-form-item has-feedback :label="$t('新密码')" name="newPassword" class="inputstyle">
          <a-input v-model:value="passwordFormData.newPassword" type="password" autocomplete="off" />
          <a-tooltip
            title="密码必须包含4种形式文字:大写字母、小写字母、数字和特殊字符:密码中不能包含:连续的字母、数字或键盘符号、重复的字母或数字、工号、OA账号、名字全拼、姓名首字母缩写、电话号码:生日等常见密码或默认密码。">
            <InfoCircleOutlined class="iconstyle" />
          </a-tooltip>
        </a-form-item>
        <a-form-item has-feedback :label="$t('确认密码')" name="confirmPassword">
          <a-input v-model:value="passwordFormData.confirmPassword" type="password" autocomplete="off" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}
.page-body {
  padding: 20px;
  min-height: calc(100vh - 130px);
}
:deep(.label-imag-body) {
  line-height: 25px !important;
}
.el-c {
  color: var(--ant-error-color);
}
.g-back {
  font-size: 26px;
  color: #165dff;
  padding-right: 20px;
  cursor: pointer;
}

.f-item {
  max-width: 550px;
  min-width: 300px;
}
.f-au-item {
  display: inline-flex;
  flex-direction: column;
  width: 370px;
}
// :deep(.vxe-table--header-wrapper) {
//   height: 50px !important; /* 强制设置表头高度 */
// }
// :deep(.vxe-header--row .vxe-cell) {
//   margin-top: -15px !important;
//   background-color: #ededed;
//   height: 48px;
// }
:deep(.ant-upload-list) {
  display: none;
}
:deep(.ant-menu-overflow-item::after) {
  display: none !important;
}
.iconstyle {
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
  color: #165dff;
}

/* ---------- 对齐 src/views/product/parameter/index.vue 列表表格样式 ---------- */
.calc-toolbar-form {
  gap: 4px;
}

.calc-merged-card.user-page-list-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 20px 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  :deep(.ant-table-wrapper) {
    flex: 1;
    min-height: 0;
  }

  :deep(.parameter-table-spaced) {
    margin-top: 16px;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead .ant-table-column-sorters) {
    justify-content: center !important;
  }

  :deep(.ant-table-thead .ant-table-column-title) {
    flex: none;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }
}

.exe-config-table.parameter-table-spaced {
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

.user-page-pagination {
  flex-shrink: 0;
}

/* 表头：标题 + 排序 + 首列筛选（与参数管理列表一致） */
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
</style>
