<script lang="ts" setup>
import type { FunctionalComponent } from 'vue';
import { computed, ref } from 'vue';
// import { swaggerApi } from '@/httpRequest'
import { ApartmentOutlined, CalendarOutlined, CloseCircleOutlined, InfoCircleOutlined, MailOutlined, MobileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { WeiMessage } from '@/utils/WeiMessage';
import type { UserProfileResponseDTO, UserProfileUpdatePasswordRequestDTO, UserUpdatePasswordRequestDTOModel } from '@/api/tags/data-contracts';
import { encryptValue, passwordPattern, passwordPatternMessage } from '@/utils';
import { AdminApiSystemEpcUser } from '@/api/tags/管理后台用户EPC';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
import appStore from '@/store';
import { toLogin } from '@/httpRequest';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
const userStore = useUserStore();
const loading = ref(false);

/** 密码对象 */
const passwordFormData = ref<UserProfileUpdatePasswordForm>({ oldPassword: '', newPassword: '', confirmPassword: '' });

/** 是否禁用修改密码表单 */
const disabledPasswordForm = computed(() => !passwordFormData.value.oldPassword || !passwordFormData.value.newPassword || !passwordFormData.value.confirmPassword);

/** 基本信息 - 修改密码 */
interface UserProfileUpdatePasswordForm extends UserProfileUpdatePasswordRequestDTO {
  confirmPassword: string;
}

/** 表单对象 */
const formRef = ref<FormInstance>();

const { push, $router } = useRouter();

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
    { required: true, message: '旧密码不能为空' },
    { pattern: passwordPattern, message: passwordPatternMessage },
  ],
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
const router = useRoute();

/** resetForm */
const resetForm = () => formRef.value?.resetFields();

resetForm();

/**
 * @description  修改密码 提交事件
 */
async function handleFinish() {
  await formRef.value?.validateFields();
  loading.value = true;
  try {
    const ress = await getEncryptPassword1(passwordFormData.value.oldPassword);
    const resss = await getEncryptPassword1(passwordFormData.value.newPassword);
    const requestParams: UserUpdatePasswordRequestDTOModel = {
      // oldPassword: encryptValue(passwordFormData.value.oldPassword),
      // newPassword: encryptValue(passwordFormData.value.newPassword),
      oldPassword: ress.data.data,
      newPassword: resss.data.data,
      userId: Number(router.query.userId) ? Number(router.query.userId) : userStore.getUser.id,
    };
    const res = await AdminApiSystemEpcUser.updateUserPassword(requestParams);
    if (res.data.code === 200) {
      WeiMessage.success('修改成功');
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
  } finally {
    loading.value = false;
  }
}
async function getEncryptPassword1(password: any) {
  return await AdminApiSystemAuth.getEncryptPassword({
    password: password,
  });
}

// onMounted(() => {
//   passwordFormData.value.oldPassword = ''
//   passwordFormData.value.newPassword = ''
//   passwordFormData.value.confirmPassword = ''
// })
</script>

<template>
  <div class="drawerContent">
  <a-card  >
    <div class="flex w-full justify-center" style="margin-top: 30px">
      <a-form ref="formRef" class="w-full max-w-[600px] min-w-[240px]" :model="passwordFormData" :rules="rules" :label-col="{ style: { width: '100px' } }" @finish="handleFinish">
        <a-form-item has-feedback :label="$t('旧密码')" name="oldPassword">
          <a-input v-model:value="passwordFormData.oldPassword" type="password" autocomplete="off" />
        </a-form-item>
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
        <a-form-item :wrapper-col="{ style: { marginLeft: '100px' } }">
          <a-button :disabled="disabledPasswordForm" type="primary" html-type="submit">
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
  </a-card>
  </div>
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

 
</style>
