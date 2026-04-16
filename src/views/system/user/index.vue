<!-- eslint-disable jsdoc/check-tag-names -->
<script setup lang="ts">
import { h, nextTick, reactive, ref } from 'vue';
import type { FormInstance, FormProps, UploadFile } from 'ant-design-vue';
import { Modal, Switch, message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { VxeGridPropTypes } from 'vxe-table';
import { SearchOutlined } from '@ant-design/icons-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import SubaccountDialog from './components/form/SubaccountDialog.vue';
import Userdetail from './components/detail/index.vue';
import UserAddUpdate from './components/form/user-add-update.vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { CommonStatusEnum } from '@/utils/constants';
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
import { listToTree } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
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
/** vxe表格 */
const columns: VxeGridPropTypes.Columns<UserPageItemResponseDTOModel> = [
  {
    title: WeiI18n.t('用户名').value,
    field: 'username',
    width: 200,
  },
  {
    title: WeiI18n.t('姓名').value,
    field: 'nickname',
    width: 200,
    editRender: {
      name: 'input',
      enabled: true,
    },
  },
  {
    title: WeiI18n.t('部门名称').value,
    field: 'dept',
    width: 200,
    align: 'left',
    slots: {
      default: 'dept_default',
    },
  },
  {
    title: WeiI18n.t('密级').value,
    field: 'confidentialLevel',
    width: 100,
    slots: {
      default: 'confidentialLevel_default',
    },
    //根据行中数据数值显示密级
  },
  {
    title: WeiI18n.t('状态').value,
    field: 'status',
    width: 130,
    slots: {
      default(params) {
        // 判断是否可以点击（userType != '4' 时可以点击）
        const canClick = userStore.getUser.userType !== '4';

        return h(Switch, {
          checked: Number(params.row.status) === 0,
          disabled: !canClick, // 如果不能点击，则禁用 Switch
          onChange() {
            // 修改状态的二次确认
            const _text = params.row.status === CommonStatusEnum.ENABLE ? WeiI18n.t('停用').value : WeiI18n.t('启用').value;
            Modal.confirm({
              title: `确认要"${_text}""${params.row.username}"用户吗?`,
              okText: WeiI18n.t('确定').value,
              cancelText: WeiI18n.t('取消').value,
              async onOk() {
                // 发起修改状态
                await AdminApiSystemUser.updateUserStatus({ id: params.row.id as number, status: params.row.status === 0 ? 1 : 0 });
                // 刷新列表
                await getListData();
              },
            });
          },
        });
      },
    },
  },
  {
    title: WeiI18n.t('创建时间').value,
    field: 'createTime',
    width: 200,
    formatter: params => {
      const date = new Date(params.row.createTime);
      return useRender.renderDateNoTime(date); // 格式化日期为年月日
    },
  },
  {
    title: WeiI18n.t('操作').value,
    field: 'operation',
    fixed: 'right',
    width: 240,
    slots: {
      default: 'operation_default',
    },
  },
];
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
  requestParams.deptId = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
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
    <a-card v-if="!modalVisible && !modalVisibledetail">
      <a-form layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol" :model="requestParams" @finish="handleFinish">
        <a-form-item>
          <a-input v-model:value="requestParams.condition" style="width: 220px" :placeholder="$t('请输入用户名或姓名')"> </a-input>
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
    </a-card>
    <a-card v-if="!modalVisible && !modalVisibledetail" style="margin-top: 10px" class="b-body">
      <VxeGrid :columns="columns" :loading="loading" :loading-config="{text: '加载中...'}" :data="resources" :empty-text="$t('暂无数据')" :cell-config="{ height: 45 }" :header-cell-config="{ height: 45 }">
        <template #operation_default="{ row }">
          <!-- @click="handleClick" -->

          <a @click="handleAddOrUpdate(row.id, false)" v-if="userStore.getUser.userType != '4'"> {{ $t('编辑') }}</a>
          <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
          <a @click="handleAddOrUpdate(row.id, true)"> {{ $t('详情') }}</a>
          <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
          <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(row.id)">
            <!-- v-hasPermi="['system:role:delete']" -->
            <a-button type="link" danger class="p-0 text-[12px]" v-if="userStore.getUser.userType != '4'">
              {{ $t('删除') }}
            </a-button>
          </a-popconfirm>
          <a-divider type="vertical" v-if="userStore.getUser.userType != '4'" />
          <a @click="resetpassword(row)" v-if="userStore.getUser.userType != '4'"> {{ $t('重置密码') }}</a>
        </template>
        <template #workCard_default="{ row }">
          <a @click.stop="handleAddOrUpdate(row.id, true)">{{ row.workCard }}</a>
        </template>
        <template #dept_default="{ row }">
          <div>{{ handledeptIdList(row) }}</div>
        </template>
        <template #confidentialLevel_default="{ row }">
          <div v-if="row.confidentialLevel==2">一般</div>
          <div v-else-if="row.confidentialLevel==3">重要</div>
          <div v-else-if="row.confidentialLevel==4">核心</div>
          <div v-else>公开</div>
        </template>
        
        <template #userType_default="{ row }">
          <div>{{ userList[row.type - 1]?.label }}</div>
        </template>
        <template #pager>
          <a-pagination v-bind="pagination" class="ant-table-pagination ant-table-pagination-right" />
        </template>
           <!-- 空数据插槽 -->
        <template #empty>
          <div class="mx-auto pt-[40px] w-[235px] h-[235px]">
            <img width="100%" height="auto" src="@/assets/images/empty.png" alt="暂无数据" />
            <div>数据为空</div>
          </div>
        </template>
      </VxeGrid>
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
</style>
