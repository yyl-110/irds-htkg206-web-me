<script lang="ts" setup>
import type { FunctionalComponent } from 'vue';
import { computed, ref } from 'vue';
// import { swaggerApi } from '@/httpRequest'
import { ApartmentOutlined, CalendarOutlined, CloseCircleOutlined, InfoCircleOutlined, MailOutlined, MobileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons-vue';
import type { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon';
import dayjs from 'dayjs';
import type { Rule } from 'ant-design-vue/es/form';
import type { TableColumnType, TableProps, FormInstance } from 'ant-design-vue';
import { get } from 'lodash-es';
import { Modal, Switch, message } from 'ant-design-vue';
import MobileOrEmailModal from './components/modal/mobileOrEmail-modal.vue';
import { WeiMessage } from '@/utils/WeiMessage';
import type { UserProfileResponseDTO, UserProfileUpdatePasswordRequestDTO, UserUpdatePasswordRequestDTOModel } from '@/api/tags/data-contracts';
import { encryptValue, passwordPattern, passwordPatternMessage } from '@/utils';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
import { AdminApiSystemEpcUser } from '@/api/tags/管理后台用户EPC';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { CommonListRequestDTOModulemanaGementModel } from '@/api/models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel';
/** 用户个人信息 */
const profile = ref<UserProfileResponseDTO>();
const loading = ref(false);
/** 是否禁用修改密码表单 */
const disabledPasswordForm = computed(() => loading.value || !profile.value || get(profile.value, 'isAd') === '1');

/** 修改密码状态 */
const updatePasswordType = ref<boolean>(true);

const userStore = useUserStore();

/** 主手机号码 */
const mobile = ref<string>('');

/** 主手机号码 */
const mobileMain = ref<string>('');

/** 用户个人信息中的所有字段信息 */
interface ProfileField {
  icon: FunctionalComponent<AntdIconProps>;
  label: string;
  field: keyof UserProfileResponseDTO | ((profile: UserProfileResponseDTO) => string | undefined);
}

/** 用户类型，只有在当前得用户类型下面才能进行发动机绑定 */
const userType = ref<Array<string>>(['终端用户']);

const profileFields: Array<ProfileField> = [
  { icon: UserOutlined, label: '用户名称', field: 'username' },
  { icon: MobileOutlined, label: '手机号码', field: 'mobile' },
  { icon: MailOutlined, label: '用户邮箱', field: 'email' },
  {
    icon: ApartmentOutlined,
    label: '所属部门',
    /**
     * field
     * @param profile
     */
    // field: profile => profile.dept?.map(d => d.name).join(', '),
    field: profile => profile.dept?.name,
  },
  // { icon: TeamOutlined, label: '所属岗位', field: profile => profile.posts?.map(p => p.name).join(', ') },
  {
    icon: SolutionOutlined,
    label: '所属角色',
    /**
     * field
     * @param profile
     */
    field: profile => profile.roles?.map(r => r.name).join(', '),
  },
  {
    icon: CalendarOutlined,
    label: '创建日期',
    /**
     * field
     * @param profile
     */
    field: profile => dayjs(profile.createTime).format('YYYY-MM-DD HH:mm:ss'),
  },
];

/** 基本信息 - 修改密码 */
interface UserProfileUpdatePasswordForm extends UserProfileUpdatePasswordRequestDTO {
  confirmPassword: string;
}
const passwordFormData = ref<UserProfileUpdatePasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
/** validatePassword */
function validatePassword() {
  if (passwordFormData.value.confirmPassword !== '' && passwordFormData.value.newPassword !== '' && passwordFormData.value.confirmPassword !== passwordFormData.value.newPassword) {
    return Promise.reject(new Error('两次输入的密码必须一致'));
  } else {
    return Promise.resolve();
  }
}
const rules: Record<keyof UserProfileUpdatePasswordForm, Rule | Array<Rule>> = {
  oldPassword: [
    { required: true, message: `${WeiI18n.t('旧密码不能为空')}` },
    // { pattern: passwordPattern, message: passwordPatternMessage },
  ],
  newPassword: [
    { required: true, message: `${WeiI18n.t('新密码不能为空')}` },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: `${WeiI18n.t('新密码不能为空')}` },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'blur' },
  ],
};
/** tab切换key */
const activeKey = ref('1');
const activeKey2 = ref('1');
/** 电话列表 */
const mobiles = ref<any>([]);

/** 发动机列表 */
const bindVinSerial = ref<any>('');

/** 邮箱验证码弹窗 */
const phoneOrEmailVisible = ref<boolean>(false);

/** 表单对象 */
const formRef = ref<FormInstance>();

/** 修改类型   1:phone  2:email  3：绑定手机号码  4：发动机号 5：修改密码主手机号码验证 */
const updateType = ref('1');

/** 手机号码、邮箱修改弹窗 */
const modalTitle = ref(WeiI18n.$t('手机号码验证'));

const updatePassWordFlag = ref<boolean>(true);

/** get profile data */
async function getProfile() {
  loading.value = true;
  // const res = await swaggerApi.adminApi.profile().finally(() => loading.value = false)
  const res = await AdminApiSystemUserProfile.profile({
    id: `${userStore.getUser.id}`,
  }).finally(() => (loading.value = false));
  profile.value = res.data.data;
  mobiles.value = res.data.data?.mobiles; // 电话号码
  mobile.value = `${res.data.data?.mobile}`;
  bindVinSerial.value = res.data.data?.bindVinSerials; // 发动机号
}

getProfile();
// getaddressList();
/** resetForm */
function resetForm() {
  passwordFormData.value.oldPassword = '';
  passwordFormData.value.newPassword = '';
  passwordFormData.value.confirmPassword = '';
  formRef.value?.resetFields();
}
/** handleFinish */
async function handleFinish() {
  await formRef.value?.validateFields();
  loading.value = true;
  try {
    const requestParams: UserUpdatePasswordRequestDTOModel = {
      oldPassword: encryptValue(passwordFormData.value.oldPassword),
      newPassword: encryptValue(passwordFormData.value.newPassword),
      userId: userStore.getUser.id,
    };
    await AdminApiSystemEpcUser.updateUserPassword(requestParams);
    WeiMessage.success('修改成功');
  } finally {
    loading.value = false;
  }
}

/**
 * @description  删除电话 确认事件
 * @param row
 */
async function HandleDelPhone(row: any) {
  const parm = {
    userId: userStore.getUser.id,
    type: '3',
    operationType: 'delete',
    mobiles: [row],
  };
  const res = await AdminApiSystemUserProfile.updatePhoneOrEmailOrEngine({
    ...parm,
  });
  if (res.data) {
    message.info(WeiI18n.$t('删除成功'));
    getProfile();
  }
}

/**
 * @param row
 * @description 删除发动机号
 */
async function HandleDelEnginee(row: any) {
  const parm = {
    type: '4',
    operationType: 'delete',
    bindVinSerial: `${row}`,
  };
  const res = await AdminApiSystemUserProfile.updatePhoneOrEmailOrEngine({
    ...parm,
  });
  if (res.data) {
    message.info(WeiI18n.$t('删除成功'));
    getProfile();
  }
}

/**
 * @description 编辑事件
 * @param field
 */
function handleUpdate(field: any) {
  if (field.label === '手机号码') {
    updateType.value = '1';
    modalTitle.value = WeiI18n.$t('主手机号码验证');
    mobileMain.value = mobile.value;
  } else if (field.label === '用户邮箱') {
    modalTitle.value = WeiI18n.$t('修改邮箱信息');
    updateType.value = '2';
    mobileMain.value = '';
  }
  phoneOrEmailVisible.value = true;
}

/**
 * @param type
 * @description 添加手机号码
 */
function handleAddMobileOrEnginee(type: string) {
  if (type === '3') {
    modalTitle.value = WeiI18n.$t('新手机号码绑定');
  } else if (type === '4') {
    modalTitle.value = WeiI18n.$t('发动机号绑定');
  }
  mobileMain.value = '';
  updateType.value = type;
  phoneOrEmailVisible.value = true;
}

function handleMainPhoneSuccess() {
  modalTitle.value = WeiI18n.$t('新手机号码绑定');
  mobileMain.value = '';
}

/**
 * @description 号码 修改成功
 */
function handleUpdateSuccess() {
  getProfile();
  phoneOrEmailVisible.value = false;
}

/**
 * @description 点击修改，验证弹窗验证 主手机号码验证
 */
function handleMainPhone() {
  updateType.value = '5';
  modalTitle.value = WeiI18n.$t('主手机号码验证');
  mobileMain.value = mobile.value;
  phoneOrEmailVisible.value = true;
}

/**
 * @description 验证通过确认 事件
 */
function handleMainPhoneVerify() {
  phoneOrEmailVisible.value = false;
  updatePassWordFlag.value = false;
  if (updateType.value === '5') {
    updatePasswordType.value = false;
  }
}

/**
 * @description tab切换
 * @param key tab切换key
 */
function handleTabchange(key: string) {
  if (key === '2') {
    updatePassWordFlag.value = true;
  }
  updatePasswordType.value = true;
}
// ----------------------------------------------------------------------------------
/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any) => {
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
const requestParams = reactive(new CommonListRequestDTOModulemanaGementModel());
requestParams.condition = undefined;
const visible = ref<boolean>(false);
const tableloading = ref<boolean>(false);
const addOrUpdate = ref<any>();
const treeDataTranslate: any = inject('treeDataTranslate');
const columns: TableColumnType<any>[] = [
  {
    title: WeiI18n.t('收货人').value,
    dataIndex: 'name',
    key: 'name',
    width: 150,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('联系方式').value,
    dataIndex: 'mobile',
    key: 'mobile',
    width: 150,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('详细地址').value,
    dataIndex: 'address',
    key: 'address',
    width: 150,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('是否默认').value,
    dataIndex: 'defaultFlag',
    key: 'defaultFlag',
    width: 150,
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
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 列表数据 */
const dataSource = ref<Array<any>>([]);

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
/** 获取部门数据 */
async function getListData() {}
getListData();
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
 * @description 清除搜索
 */
function clearSearch() {
  if (requestParams.name === '') {
    requestParams.pageNo = 1;
    pagination.current = 1;
    getListData();
  }
}

// -------------------子账号------------
/** 列表数据 */
const Subaccountdata = ref<any>([]);
const subaccountcolumns = ref<any>([]);
/** 表格列属性 */
const chinacolumns = ref([
  // {
  //   title: WeiI18n.t('子账号').value,
  //   dataIndex: 'id',
  //   key: 'id',
  //   width: 180,
  //   sortDirections: ['descend', 'ascend'],
  // },
  {
    title: WeiI18n.t('登录名').value,
    dataIndex: 'username',
    key: 'username',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('昵称').value,
    dataIndex: 'nickname',
    key: 'nickname',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
]);
/** 表格列属性 */
const abroadcolumns = ref([
  // {
  //   title: WeiI18n.t('子账号').value,
  //   dataIndex: 'id',
  //   key: 'id',
  //   width: 180,
  //   sortDirections: ['descend', 'ascend'],
  // },
  {
    title: WeiI18n.t('登录名').value,
    dataIndex: 'username',
    key: 'username',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('手机号').value,
    dataIndex: 'mobile',
    key: 'mobile',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
]);
/**
 * @description
 */
async function getSubaccountListData() {
  // loading.value = true;
  // try {
  //   const res = await AdminApiSystemUser.getListByUser({ userId: `${userStore.getUser.id}` });
  //   if (res.data.code === 200) {
  //     Subaccountdata.value = res.data.data || [];
  //   }
  // } finally {
  //   loading.value = false;
  // }
}
getSubaccountListData();

/**
 * @description tab切换
 * @param key tab切换key
 */
function handleTabchange2(key: string) {
  if (userStore.getUser.type == '2') {
  } else {
  }
  if (key === '1') {
    getListData();
  } else {
    getSubaccountListData();
  }
}
</script>

<template>
  <div class="drawerContent">
    <a-card class="h-full wei-content-full">
      <a-tabs v-model:active-key="activeKey" @change="handleTabchange">
        <a-tab-pane key="1" :tab="$t('基本信息')" force-render>
          <div class="flex h-full" style="margin-top: 10px">
            <div :title="$t('个人信息')" class="w-[550px] min-w-[240px] pr-[20px]">
              <dl v-if="profile" class="space-y-2 border-y-4">
                <div v-for="(field, k) in profileFields" :key="k" style="display: flex; align-items: center">
                  <div class="flex justify-between min-h-[30px] profile-row" style="width: 450px">
                    <dt class="space-x-1 min-w-[100px]">
                      <component :is="field.icon" />
                      <span>{{ $t(field.label) }}</span>
                    </dt>
                    <dd>
                      {{ typeof field.field === 'string' ? profile[field.field] : field.field(profile) }}
                    </dd>
                  </div>
                  <a-button
                    v-if="
                      (field.label === '手机号码' || field.label === '用户邮箱') &&
                      ['终端用户', '中心库用户', '服务站用户', '主机厂用户', '加盟商用户'].includes(profile?.userCategoryName || '')
                    "
                    style="margin-left: 20px"
                    @click="handleUpdate(field)">
                    {{ $t('编辑') }}
                  </a-button>
                </div>
              </dl>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          v-if="
            [
              '液压中心库',
              '新能源中心库',
              '发动机中心库',
              '液压服务站',
              '新能源服务站',
              '发动机服务站',
              '发动机加盟商',
              '液压加盟商',
              '新能源加盟商',
              '主机厂用户',
              '终端用户',
            ].includes(profile?.userCategoryName || '')
          "
          key="2"
          :tab="$t('密码修改')"
          force-render>
          <div class="flex w-full justify-center" style="margin-top: 10px">
            <a-form
              ref="formRef"
              class="w-full max-w-[600px] min-w-[240px]"
              :model="passwordFormData"
              :rules="rules"
              :label-col="{ style: { width: '100px' } }"
              @finish="handleFinish">
              <a-form-item has-feedback :label="$t('旧密码')" name="oldPassword">
                <a-input v-model:value="passwordFormData.oldPassword" type="password" autocomplete="off" :disabled="updatePassWordFlag" />
              </a-form-item>
              <a-form-item has-feedback :label="$t('新密码')" name="newPassword" class="inputstyle">
                <a-input v-model:value="passwordFormData.newPassword" type="password" autocomplete="off" :disabled="updatePassWordFlag" />
                <a-tooltip
                  :title="
                    $t(
                      '密码必须包含4种形式文字:大写字母、小写字母、数字和特殊字符:密码中不能包含:连续的字母、数字或键盘符号、重复的字母或数字、工号、OA账号、名字全拼、姓名首字母缩写、电话号码:生日等常见密码或默认密码。'
                    )
                  ">
                  <InfoCircleOutlined class="iconstyle" />
                </a-tooltip>
              </a-form-item>
              <a-form-item has-feedback :label="$t('确认密码')" name="confirmPassword">
                <a-input v-model:value="passwordFormData.confirmPassword" type="password" autocomplete="off" :disabled="updatePassWordFlag" />
              </a-form-item>
              <a-form-item :wrapper-col="{ style: { marginLeft: '100px' } }">
                <a-button type="primary" style="margin-right: 10px" @click="handleMainPhone">
                  {{ $t('密码修改') }}
                </a-button>
                <a-button :disabled="disabledPasswordForm || updatePasswordType" type="primary" html-type="submit">
                  <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
                  {{ $t('提交') }}
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm">
                  <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
                  {{ $t('重置') }}
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>

        <a-tab-pane
          v-if="
            ['液压中心库', '新能源中心库', '发动机中心库', '液压服务站', '新能源服务站', '发动机服务站', '发动机加盟商', '液压加盟商', '新能源加盟商', '主机厂用户'].includes(
              profile?.userCategoryName || ''
            )
          "
          key="3"
          :tab="$t('绑定手机号')"
          force-render>
          <div class="flex w-full justify-center o-text">
            <a-form ref="formRef" class="w-full max-w-[600px] min-w-[240px]" :model="passwordFormData" :rules="rules" :label-col="{ style: { width: '100px' } }">
              <a-form-item has-feedback :label="$t('绑定手机号码')" name="oldPassword">
                <div style="display: flex; padding-left: 10px">
                  <div class="f-au-item" style="width: 320px">
                    <a-row v-for="(item, index) in mobiles" :key="index" style="width: 400px; height: 35px; line-height: 35px">
                      <span style="margin-right: 30px; width: 280px">{{ item }}</span>
                      <a-popconfirm :title="`${$t('确定要删除吗')}?`" :ok-text="$t('确定')" :cancel-text="$t('取消')" @confirm="HandleDelPhone(item)">
                        <span style="cursor: pointer"><CloseCircleOutlined /></span>
                      </a-popconfirm>
                    </a-row>
                  </div>
                  <a-button type="primary" style="margin-left: 20px" @click="handleAddMobileOrEnginee('3')"> 添加 </a-button>
                </div>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane
          v-if="['终端用户', '中心库用户', '服务站用户', '主机厂用户', '加盟商用户'].includes(profile?.userCategoryName || '')"
          key="4"
          :tab="$t('绑定发动机')"
          force-render>
          <div class="flex w-full justify-center o-text">
            <a-form ref="formRef" class="w-full max-w-[600px] min-w-[240px]" :model="passwordFormData" :rules="rules" :label-col="{ style: { width: '100px' } }">
              <a-form-item has-feedback :label="$t('绑定发动机号')" name="oldPassword">
                <div style="display: flex; padding-left: 10px">
                  <div class="f-au-item" style="width: 320px">
                    <a-row v-for="(item, index) in bindVinSerial2" :key="index" style="width: 400px; height: 35px; line-height: 35px">
                      <span style="margin-right: 30px; width: 280px">{{ item }}</span>
                      <a-popconfirm :title="`${$t('确定要删除吗')}?`" :ok-text="$t('确定')" :cancel-text="$t('取消')" @confirm="HandleDelEnginee(item)">
                        <span style="cursor: pointer"><CloseCircleOutlined /></span>
                      </a-popconfirm>
                    </a-row>
                  </div>
                  <a-button type="primary" style="margin-left: 20px" @click="handleAddMobileOrEnginee('4')"> 添加 </a-button>
                </div>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
  <MobileOrEmailModal
    :mobile-main="mobileMain"
    :modal-title="modalTitle"
    :modal-visible="phoneOrEmailVisible"
    :update-type="updateType"
    @on-close="phoneOrEmailVisible = false"
    @handle-update-success="handleUpdateSuccess"
    @handle-main-phone-success="handleMainPhoneSuccess"
    @handle-main-phone-verify="handleMainPhoneVerify" />
</template>

<style lang="less" scoped>
.inputstyle {
  position: relative;
}
.iconstyle {
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
  color: #165dff;
}

.o-text {
  margin-top: 10px;
  overflow: auto;
  height: calc(100vh - 280px);
}

.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}
</style>
