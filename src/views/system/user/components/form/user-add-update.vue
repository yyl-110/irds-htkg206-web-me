<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, CloseCircleOutlined, PhoneFilled } from '@ant-design/icons-vue';
import type { UserFormDTO } from '@/api/tags/data-contracts';
import { AdminApiSystemRole } from '@/api/tags/管理后台角色';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { useDictStore } from '@/store/modules/dict';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { listToTree } from '@/utils/tools';
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
const loading = ref(false);
/** 新增页面编辑状态 */
const updFlag = ref<boolean>(false);
const formRef = ref<FormInstance>();
const userType = ref([
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
]);

const confidentialLevelList = ref([
  {
    label: '公开',
    value: 1,
  },
  {
    label: '一般',
    value: 2,
  },
  {
    label: '重要',
    value: 3,
  },
  {
    label: '核心',
    value: 4,
  },
]);


const regionList = ref([]);
/** 获取字典 */
const useDict = useDictStore();
/** 角色id列表 */
const roleList = ref<Array<DefaultOptionType>>([]);
/**
 * @description: 用户组实体类
 */
interface GroupData {
  id: number;
  deptId?: number;
  name: string;
  roleClass?: number;
  key?: object;
}
/** 行业 字典参数 */
const industryOption = ref<any>([]);
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
  remark: '', // 备注
  type: 2, //用户类型
  industry: [], // 行业
  province: '',
  serviceStationName: '',
  productLine: '',
  confidentialLevel: 1,
  idNumber:'',
});
/** 页面下拉字典 page_combo_config 字典常量定义 */
const categoryList = computed(() => {
  return useDict.getDictOptions('page_combo_config');
});
// initDictionaryList();
// getregionList();
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
async function getnoticeTypeText() {
  const res = await AdminApiSystemRole.getSimpleRoleList();
  roleList.value = [];
  res.data.data?.forEach((item: any) => {
    roleList.value.push({ label: item.name, value: `${item.id}` });
  });
}
getnoticeTypeText();

const treeDefaultExpandedKeys = ref<any>('');
/** get role list */
async function getdeptList() {
  const res = await AdminApiSystemDept.listDepts({});
  const list = res.data.data?.map(item => ({ label: item.name, value: item.id, id: item.id, parentId: item.parentId })) || [];
  deptIdList.value = listToTree(list || []);
  if (res.data.data[0]) {
    treeDefaultExpandedKeys.value = res.data.data[0].id;
  }
}
getdeptList();
const showfrom = ref('407');
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
async function confirmPhone() {
  if (phoneVal.value === '') {
    message.error('手机号码为空，添加失败！');
    return;
  }
  phoneVerify(phoneVal.value);
  if (!phoneVerify(phoneVal.value)) {
    message.error('请输入正确的手机号！');
    return;
  }
  const flag = [phoneVal.value].every((item: any) => {
    return phoneList.value.includes(item);
  });
  if (flag) {
    message.error('手机号重复,请重新填写！');
    return;
  }
  phoneList.value.push(phoneVal.value);
}
/**
 * @description 删除绑定手机号
 * @param type
 * @param index 号码索引
 */
function delPhone(index: number) {
  phoneList.value.splice(index, 1);
}
function cancel() {
  phoneVal.value = '';
}

/**
 * 修改发动机编号
 * @param type
 */
function confirmNumerodelmotor() {
  if (Numerodelmotor.value === '') {
    message.error('发动机编号为空，添加失败！');
    return;
  }
  const flag = [Numerodelmotor.value].every((item: any) => {
    return NumerodelmotorList.value.includes(item);
  });
  if (flag) {
    message.error('发动机编号重复,请重新填写！');
    return;
  }
  NumerodelmotorList.value.push(Numerodelmotor.value);
}
function cancelNumerodelmotor() {
  Numerodelmotor.value = '';
}
/**
 * @description 删除发动机编号
 * @param type
 * @param index 编号索引
 */
function delNumerodelmotor(index: number) {
  NumerodelmotorList.value.splice(index, 1);
}

async function updatePhoneOrEmailOrEngines(data: any) {
  const res = await AdminApiSystemUserProfile.updatePhoneOrEmailOrEngine(data);
  if (res.data) {
    message.info(WeiI18n.$t('修改成功'));
  } else {
    message.error(WeiI18n.$t(res.data?.msg || '修改失败'));
  }
}
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

/**
 * @description: 发动机编号输入框失去焦点事件
 */
function onBlurNumerodelmotor(): void {
  // if (
  //   Numerodelmotor.value.charAt(Numerodelmotor.value.length - 1) === '.'
  //   || Numerodelmotor.value === '-'
  // ) {
  //   formatonBlurNumerodelmotor(
  //     Numerodelmotor.value.slice(0, -1),
  //     Numerodelmotor.value,
  //   )
  // }
}
/**
 *@description: 格式化发动机编号
 * @param val
 * @param preVal
 * @param {string} value
 * @returns {*}
 */
// function formatonBlurNumerodelmotor(val: string, preVal: string) {
//   const reg = /^\d*$/

//   if (val === '' || reg.test(val)) {
//     Numerodelmotor.value = val
//   }
//   else {
//     Numerodelmotor.value = preVal
//   }
// }
// watch(Numerodelmotor, (val, preVal) => {
//   formatonBlurNumerodelmotor(val, preVal)
// })

function canlemodalVisible() {
  emit('canlemodalVisible');
}
// 调用编辑查看详情方法
async function handleModalAddOrUpdate(id: any) {
  try {
    loading.value = true;
    updFlag.value = true;
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
      type: res.data.data?.type, // 备注
      remark: res.data.data?.remark, // 备注
      mobiles: res.data.data?.mobiles, // 绑定手机号
      bindVinSerials: res.data.data?.bindVinSerials == null || res.data.data?.bindVinSerials.length === 1 ? [] : res.data.data?.bindVinSerials, // 绑定手机号
      industry: res.data.data?.industry && res.data.data?.industry != null ? res.data.data?.industry.split(',') : [], // 行业
      province: res.data.data?.province,
      serviceStationName: res.data.data?.serviceStationName,
      productLine: res.data.data?.productLine,
      confidentialLevel: Number(res.data.data?.confidentialLevel || 1),
      idNumber: res.data.data?.idNumber,
    };
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
  } catch (error) {
    loading.value = false;
    console.log(error);
  } finally {
    loading.value = false;
  }
}
async function submit() {
  try {
    // 调用保存接口
    await formRef.value?.validate();
    // const requestParams = { ...formData.value }
    const data: any = {
      id: formData.value.id,
      roleId: formData.value?.roleid, // 用户组
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
      confidentialLevel: Number(formData.value.confidentialLevel || 1),
      idNumber: formData.value.idNumber,

    };
    if (formData.value.id) {
      // 修改 保存
      AdminApiSystemUser.updateUser(data).then(() => {
        emit('canlemodalVisible');
        message.success('操作成功');
      });
    } else {
      // 新增 保存
      AdminApiSystemUser.createUser(data).then(() => {
        emit('canlemodalVisible');
        message.success('操作成功');
      });
    }
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}

defineExpose({ handleModalAddOrUpdate });
</script>

<template>
  <!-- 新增、编辑页面 -->
  <!-- height: 100vh -->
  <div v-if="!loading" style="background-color: #ffffff; padding: 20px; overflow: auto" class="page-body">
    <a-row type="flex" class="row-body" style="display: flex; justify-content: space-between">
      <span>
        <Label :title="$t('基本信息')" fong-size="18" />
      </span>
      <ArrowLeftOutlined class="g-back" @click="canlemodalVisible" />
    </a-row>

    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '120px' } }" style="padding-top: 20px">
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('登录名')" name="username" :rules="[{ required: true, message: `${$t('请输入用户名称')}` }]" class="f-item">
            <a-input v-model:value="formData.username" :disabled="updFlag" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('姓名')" name="nickname" :rules="[{ required: true, message: `${$t('请输入姓名')}` }]" class="f-item">
            <a-input v-model:value="formData.nickname" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="10">
          <a-form-item
            :label="$t('联系电话')"
            name="mobile"
            :rules="[
              {
                required: true,
                message: `${$t('请输入正确的联系电话')}`,
                pattern: /^(1[3456789]\d{9}|0\d{2,3}-\d{7,8})$/,
              },
            ]"
            class="f-item">
            <a-input v-model:value="formData.mobile" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('邮箱')" name="email" class="f-item">
            <a-input v-model:value="formData.email" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('用户角色')" name="roleid" :rules="[{ required: true, message: `${$t('请选择用户角色')}` }]" class="f-item">
            <a-select v-model:value="formData.roleid" mode="multiple" :placeholder="$t('请选择用户角色')" show-search @change="roleidchange">
              <a-select-option v-for="item in roleList" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <!-- :rules="[{ required: true, message: `${$t('请选择部门')}` }]" -->
          <a-form-item :label="$t('所属部门')" name="deptId" class="f-item">
            <a-tree-select
              v-model:value="formData.deptId"
              show-search
              :placeholder="$t('请选择所属部门')"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              allow-clear
              :treeDefaultExpandedKeys="[treeDefaultExpandedKeys]"
              :tree-data="deptIdList"
              tree-node-filter-prop="label">
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('身份证号')" name="idNumber" class="f-item" :rules="[{ required: true, message: `${$t('请输入身份证号')}` }]">
            <a-input v-model:value="formData.idNumber" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label="$t('是否专家')" name="type" class="f-item">
            <a-select v-model:value="formData.type" :placeholder="$t('请选择是否专家')" show-search>
              <a-select-option v-for="item in userType" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        
      </a-row>
      <a-row> 
        <a-col :span="10">
          <a-form-item :label="$t('密级')" name="confidentialLevel" class="f-item" :rules="[{ required: true, message: `${$t('请选择密级')}` }]">
            <a-select v-model:value="formData.confidentialLevel" :placeholder="$t('请选择密级')" show-search>
              <a-select-option v-for="item in confidentialLevelList" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
            

      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('备注')" name="remark" class="f-item">
            <a-input v-model:value="formData.remark" />
          </a-form-item>
        </a-col>
        <a-col :span="10"> </a-col>
      </a-row>
      <a-form-item>
        <div class="flex justify-end" style="margin-right: 30px; height: 150px">
          <a-button :loading="$isPending()" type="primary" style="margin-right: 10px" @click="submit">
            {{ $t('确定') }}
          </a-button>
          <a-button style="float: right" @click="canlemodalVisible">
            {{ $t('取消') }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
  <div v-if="loading" class="example" style="background-color: #ffffff; padding: 20px; overflow: auto">
    <a-spin v-if="loading" class="spin" tip="加载中..." />
  </div>
</template>

<style scoped lang="less">
.f-au-item {
  min-height: calc(100vh - 850px);
  /* overflow-y: auto;
  overflow-x: hidden; */
  padding-bottom: 60px;
}
.example {
  min-height: calc(100vh - 250px);
  text-align: center;
  z-index: 1005;
  .spin {
    margin-top: 200px;
  }
}
</style>
