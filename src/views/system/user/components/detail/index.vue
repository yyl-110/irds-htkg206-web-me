<script lang="ts" setup>
import type { FormInstance, FormProps } from 'ant-design-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import { Modal, Switch, message } from 'ant-design-vue';
import { ArrowLeftOutlined, CloseCircleOutlined, PhoneFilled, SearchOutlined } from '@ant-design/icons-vue';
import type { UserFormDTO } from '@/api/tags/data-contracts';
import { AdminApiSystemRole } from '@/api/tags/管理后台角色';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { useDictStore } from '@/store/modules/dict';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemCommon } from '@/api/tags/管理后台通用管理';
defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 反馈详情 id */
  id: {
    require: false,
    type: String,
    default: '',
  },
});
const emit = defineEmits(['canlemodalVisible']);
/** 行业 字典参数 */
const industryOption = ref<any>([]);
const formRef = ref<FormInstance>();
/** 获取字典 */
const useDict = useDictStore();
/** 角色id列表 */
const roleList = ref<Array<DefaultOptionType>>([]);
/**
 * @description: 用户组实体类
 */
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
const regionList = ref([]);
/** 部门id列表 */
const deptIdList = ref<Array<DefaultOptionType>>([]);
/** 电话号码输入值 */
const phoneVal = ref<string>('');
const phoneList = ref<Array<any>>([]);
/** 发动机编号输入值 */
const Numerodelmotor = ref<string>('');
const NumerodelmotorList = ref<Array<any>>([]);
/** 已授权数据 */
const targetKeys = ref<string[]>();

const targetKeys2 = ref<Array<number>[]>([]);
/** 表单数据 */
const formData = ref<Partial<UserFormDTO>>({
  id: 0,
  roleid: [], // 用户组
  nickname: '', // 姓名
  contract: '', // 联系人
  username: '', // 登录名
  deptId: '', // 所属部门
  region: '', // 区域
  mobile: '', // 电话
  address: '', // 地址
  email: '', // 邮箱
  workCard: '', // 客户编码
  mainMachineFactory: '', // 主机厂用户
  company: '', // 业务公司
  userCategory: '', // 用户角色
  remark: '', // 备注
  type: '', //用户
  industry: [], // 行业
  province: '',
  serviceStationName: '',
  productLine: '',
});
/** 页面下拉字典 page_combo_config 字典常量定义 */
const categoryList = computed(() => {
  return useDict.getDictOptions('page_combo_config');
});

// initDictionaryList();
/**
 * @description 获取字典
 */
async function initDictionaryList() {
  const parm = <Array<string>>[];
  const list = categoryList.value;
  if (list) {
    list.forEach(item => {
      parm.push(item?.value + '');
    });
  }
  if (parm.length > 0) {
    const res = await AdminApiSystemCommon.getDictionaryList({
      categoryList: parm,
    });
    if (res.data.code === 200) {
      const list = res.data.data;
      list?.forEach((item: any) => {
        if (item.category === 'ProductType') {
          industryOption.value = item.dict;
        }
      });
    }
  }
}
/**
 * @description 获取业务范围字典值
 * @param value 字典值
 */
function plainOptions() {
  return useDict.getDictOptions('biz_range');
}
async function getnoticeTypeText() {
  const res = await AdminApiSystemRole.getSimpleRoleList();
  roleList.value = [];
  res.data.data?.forEach((item: any) => {
    roleList.value.push({ label: item.name, value: `${item.id}` });
  });
}
getnoticeTypeText();
/** get role list */
async function getdeptList() {
  const res = await AdminApiSystemDept.listDepts({});
  deptIdList.value = res.data.data?.map(item => ({ label: item.name, value: item.id })) || [];
}
getdeptList();
const showfrom = ref('');
function roleidchange(value: string) {
  showfrom.value = value;
}
/**
 *
 * @param nextTargetKeys 已授权列表
 * @param direction 操作方向 left: 左移 right:右移
 * @param moveKeys 移动数据id列表
 */
const roleidnmae = ref('');
function handleChange(nextTargetKeys: any, direction: string, moveKeys: string[]) {
  // console.log('targetKeys:', nextTargetKeys)
  // console.log('direction: ', direction)
  // console.log('moveKeys: ', moveKeys)
  targetKeys.value = nextTargetKeys;
}

// 手机号校验
function phoneVerify(phone: any) {
  // 判断手机号是否为正确格式
  // 手机号格式为11位或者座机号码格式0xx[x]-xxxxxxx[x] 或者为 座机后缀xxxxxxx[x]
  // const reg = /^((\d{7,8})|(0\d{2,3}-\d{7,8})|(1[34589]\d{9}))$/
  const reg = /^1[3-9]\d{9}$/;
  // 最新验证：
  // var reg =/^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
  if (reg.test(phone)) {
    return true;
  } else {
    return false;
  }
}
function confirmPhone() {
  if (phoneVal.value === '') {
    message.error('手机号码为空，添加失败！');
    return;
  }
  phoneVerify(phoneVal.value);
  if (!phoneVerify(phoneVal.value)) {
    message.error(`${WeiI18n.$t('请输入正确的手机号')}!`);
    return;
  }
  const flag = [phoneVal.value].every((item: any) => {
    return phoneList.value.includes(item);
  });
  if (flag) {
    message.error(`${WeiI18n.$t('手机号重复,请重新填写')}!`);
    return;
  }
  phoneList.value.push(phoneVal.value);
}
/**
 * @description 手机号码删除
 * @param index 号码索引
 */
function delPhone(index: number) {
  phoneList.value.splice(index, 1);
}
/**
 * @description 删除发动机编号
 * @param type
 * @param index 编号索引
 */
function delNumerodelmotor(index: number) {
  NumerodelmotorList.value.splice(index, 1);
}
function confirmNumerodelmotor() {
  if (Numerodelmotor.value === '') {
    message.error(`${WeiI18n.$t('发动机编号为空，添加失败')}!`);
    return;
  }
  const flag = [Numerodelmotor.value].every((item: any) => {
    return NumerodelmotorList.value.includes(item);
  });
  if (flag) {
    message.error(`${WeiI18n.$t('发动机编号重复,请重新填写')}!`);
    return;
  }
  NumerodelmotorList.value.push(Numerodelmotor.value);
}
function cancelNumerodelmotor() {
  Numerodelmotor.value = '';
}
function cancel() {}
/**
 * @description: 手机号码输入框失去焦点事件
 */
function onBlur(): void {
  if (phoneVal.value.charAt(phoneVal.value.length - 1) === '.' || phoneVal.value === '-') {
    format(phoneVal.value.slice(0, -1), phoneVal.value);
  }
}
/**
 *@description: 格式化手机号码
 * @param val
 * @param preVal
 * @param {string} value
 * @returns {*}
 */
function format(val: string, preVal: string) {
  const reg = /^\d*$/;

  if (val === '' || reg.test(val)) {
    phoneVal.value = val;
  } else {
    phoneVal.value = preVal;
  }
}
watch(phoneVal, (val, preVal) => {
  format(val, preVal);
});
function canlemodalVisible() {
  emit('canlemodalVisible');
}
// 调用编辑查看详情方法
async function handleModalAddOrUpdate(id: any) {
  const res = await AdminApiSystemUser.getInfo({ id });
  const data = {
    id: (formData.value.id = res.data.data?.id),
    roleid: res.data.data?.roleid, // 用户组
    nickname: res.data.data?.nickname, // 姓名
    contract: res.data.data?.contract, // 联系人
    username: res.data.data?.username, // 登录名
    deptId: res.data.data?.deptId ? res.data.data?.deptId : '', // 所属部门
    region: res.data.data?.region, // 区域
    mobile: res.data.data?.mobile, // 电话
    address: res.data.data?.address, // 地址
    email: res.data.data?.email, // 邮箱
    workCard: res.data.data?.workCard, // 客户编码
    mainMachineFactory: res.data.data?.mainMachineFactory, // 主机厂用户
    company: res.data.data?.company, // 业务公司
    remark: res.data.data?.remark, // 备注
    type: res.data.data?.type, // 备注
    mobiles: res.data.data?.mobiles, // 绑定手机号
    bindVinSerials: res.data.data?.bindVinSerials == null || res.data.data?.bindVinSerials.length === 1 ? [] : res.data.data?.bindVinSerials, // 绑定手机号
    industry: res.data.data?.industry && res.data.data?.industry != null ? res.data.data?.industry.split(',') : [], // 行业
    province: res.data.data?.province,
    serviceStationName: res.data.data?.serviceStationName,
    productLine: res.data.data?.productLine,
  };
  showfrom.value = data.userCategory ? `${JSON.parse(data.userCategory)}` : '';
  targetKeys.value = res.data.data?.roles;
  if (res.data.data?.roles) {
    res.data.data?.roles?.forEach((item: any) => {
      targetKeys2.value.push(item.id);
    });
  }
  phoneList.value = res.data.data?.mobiles;
  // 赋值字符处理
  NumerodelmotorList.value = res.data.data?.bindVinSerials ? res.data.data?.bindVinSerials : [];
  if (NumerodelmotorList.value[0] === '' || NumerodelmotorList.value[0] === '') {
    NumerodelmotorList.value = [];
  }
  formData.value = { ...data };
  const arr: any = [];
  formData.value.roleid = [];
  targetKeys.value?.forEach((item: any) => {
    formData.value.roleid?.push(item.id);
    arr.push(item.name);
  });
  roleidnmae.value = arr.toString();
}

async function submit() {
  try {
    // 调用保存接口
    await formRef.value?.validate();
    // const requestParams = { ...formData.value }
    const data: any = {
      id: formData.value.id,
      roleId: formData.value.roleid, // 用户组
      nickname: formData.value.nickname, // 姓名
      contract: formData.value.contract, // 联系人
      username: formData.value.username, // 登录名
      deptId: formData.value.deptId?.toString(), // 所属部门
      region: formData.value.region, // 区域
      mobile: formData.value.mobile, // 电话
      address: formData.value.address, // 地址
      email: formData.value.email, // 邮箱
      workCard: formData.value.workCard, // 客户编码
      mainMachineFactory: formData.value.mainMachineFactory, // 主机厂用户
      company: formData.value.company, // 业务公司
      remark: formData.value.remark, // 备注
      type: formData.value.type, // 备注
      mobiles: phoneList.value, // 绑定手机号
      bindVinSerial: NumerodelmotorList.value.toString(), // 绑定发动机编号
      industry: formData.value.industry?.toString(), // 行业
      province: formData.value.province,
      serviceStationName: formData.value.serviceStationName,
      productLine: formData.value.productLine,
    };

    // 修改 保存
    AdminApiSystemUser.updateUser(data).then(() => {
      emit('canlemodalVisible');
      message.success('操作成功');
    });
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}

defineExpose({ handleModalAddOrUpdate });
</script>

<template>
  <!-- 新增、编辑页面 -->
  <div style="background-color: #ffffff; padding: 20px" class="page-body">
    <a-row type="flex" class="row-body" style="display: flex; justify-content: space-between">
      <span>
        <Label :title="$t('基本信息')" fong-size="18" />
      </span>
      <ArrowLeftOutlined class="g-back" @click="canlemodalVisible" />
    </a-row>

    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '120px' } }" style="padding-top: 20px">
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('登录名')" name="username" class="f-item">
            <a-input v-model:value="formData.username" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('姓名')" name="nickname" class="f-item">
            <a-input v-model:value="formData.nickname" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('电话')" name="mobile" class="f-item">
            <a-input v-model:value="formData.mobile" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('类型')" name="type" class="f-item">
            <a-select v-model:value="formData.type" :placeholder="$t('请选择用户类型')" disabled show-search>
              <a-select-option v-for="item in userType" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('用户角色')" name="roleid" class="f-item">
            <a-select v-model:value="formData.roleid" mode="multiple" disabled :placeholder="$t('请选择用户角色')" show-search @change="roleidchange">
              <a-select-option v-for="item in roleList" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('所属部门')" name="deptId" class="f-item">
            <a-select v-model:value="formData.deptId" disabled :placeholder="$t('请选择所属部门')" show-search>
              <a-select-option v-for="item in deptIdList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('备注')" name="remark" class="f-item">
            <a-input v-model:value="formData.remark" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="10"> </a-col>
      </a-row>
      <a-form-item>
        <div class="flex justify-end" style="margin-right: 30px">
          <!-- <a-button :loading="$isPending()" type="primary" style="margin-right: 10px" @click="submit">
            {{ $t('确定') }}
          </a-button> -->
          <a-button style="float: right" @click="canlemodalVisible">
            {{ $t('取消') }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.f-au-item {
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
