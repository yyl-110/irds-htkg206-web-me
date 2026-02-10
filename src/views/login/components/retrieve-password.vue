<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref } from 'vue';
import { Button, Popconfirm, message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { WeiI18n } from '@/utils/WeiI18n';
import { encryptValue, passwordPattern, passwordPatternMessage } from '@/utils';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
import { langValue } from '@/utils/changelang';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 用户名称 */
  userName: {
    require: false,
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible1: boolean];
}>();

/** 表单对象 */
const formRef = ref<FormInstance>();
const langtype = navigator.language || localStorage.getItem('wei-language');

/** 密码输入状态 */
const inputFlag = ref<boolean>(true);

/** 密码对象 */
const passwordFormData = reactive<any>({
  userName: props.userName,
  phoneNumber: '',
  newPassword: '',
  confirmPassword: '',
});

/** 密码规则校验 */
const rules: Record<keyof any, Rule | Array<Rule>> = {
  newPassword: [
    { required: true, message: Changelanguage('Thenewpasswordcannotbeempty') },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: Changelanguage('Confirmpasswordcannotbeempty') },
    { pattern: passwordPattern, message: passwordPatternMessage },
    { validator: validatePassword, trigger: 'blur' },
  ],
};

/** 手机号码校验规则 */
const phoneRules = ref([
  {
    required: true,
    pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
    message: Changelanguage('rulesphonenumber'),
    trigger: 'blur',
  },
]);

function Changelanguage(lang: any) {
  const langtype = navigator.language;
  return langValue(lang, langtype);
}
/** 弹窗状态 */
const visible = ref<boolean>(false);

/** 验证码秒数 */
const countdownTime = ref<number>(60);

/** 发送验证码状态 */
const sendingType = ref<boolean>(true);

/** resetForm */
const resetForm = () => formRef.value?.resetFields();

/**
 * @description 点击确认
 */
async function handleSave() {
  await formRef.value?.validateFields();
  // 通过后先校验手机号码，然后再调用接口修改密码
  const res = await AdminApiSystemUserProfile.commonCheckMessageCode({ mobile: passwordFormData.phoneNumber, code: passwordFormData.phoneCode });
  if (res.data.code === 200) {
    const requestParams = {
      userName: passwordFormData.userName,
      newPassword: encryptValue(passwordFormData.newPassword),
    };
    const resL = await AdminApiSystemUserProfile.retrievePasswordCheckMobile(requestParams);
    if (resL.data.code === 200) {
      emit('onClose', false);
      message.success(Changelanguage('Modifiedsuccessfully'));
    }
  }
}

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}

function validatePassword() {
  if (passwordFormData.confirmPassword !== '' && passwordFormData.newPassword !== '' && passwordFormData.confirmPassword !== passwordFormData.newPassword) {
    return Promise.reject(new Error(Changelanguage('Thepasswordenteredtwicemustbeconsistent')));
  } else {
    return Promise.resolve();
  }
}

/**
 *@description 发送短信验证码
 */
async function handleSendSMS() {
  if (passwordFormData.userName === '') {
    message.error(Changelanguage('Usernamecannotempty'));
    return;
  }

  if (passwordFormData.phoneNumber === '') {
    message.error(Changelanguage('phonenumberempty'));
    return;
  }

  const res = await AdminApiSystemUserProfile.sendingTextMessage({ userName: passwordFormData.userName, mobile: passwordFormData.phoneNumber });
  if (res.data) {
    sendingType.value = false;
    inputFlag.value = false;
    countdownTime.value = 60;
    countdown();
    message.info(Changelanguage('Verificationcodesentsuccessfully'));
  } else {
    message.error(res.data?.msg || Changelanguage('Verificationcodesenterrorfully'));
  }
}

/**
 * 倒计时函数
 *
 * 该函数通过setInterval每秒更新一次倒计时，并在倒计时结束时更改发送类型为true。
 */
function countdown() {
  // 使用setInterval设置每秒更新一次倒计时
  const countdownInterval = setInterval(() => {
    countdownTime.value--;
    // 检查倒计时是否结束
    if (countdownTime.value <= 0) {
      sendingType.value = true;
      // 清除定时器
      clearInterval(countdownInterval);
    }
  }, 1000); // 1000毫秒 = 1秒
}

/**
 * @description 电话号码改变 事件
 * @param event 手机号码
 */
function handlePhoneChange(event: string) {
  const value = passwordFormData.phoneNumber;
  // 检查输入框的值是否只包含数字
  if (!/^\d+$/.test(value)) {
    passwordFormData.phoneNumber = '';
  }
}

watch(
  () => props.modalVisible,
  (newValue, oldValue) => {
    resetForm();
    visible.value = props.modalVisible;
    passwordFormData.userName = props.userName;
    sendingType.value = true;
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <!-- 发送验证码前还要验证，用户来源，统一的不允许修改 -->
  <a-modal
    v-model:visible="visible"
    style="width: 800px"
    :title="Changelanguage('Retrievepassword')"
    :confirm-loading="$isPending('save')"
    :ok-text="Changelanguage('sure')"
    :cancel-text="Changelanguage('Cancelación')"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel">
    <div class="flex w-full justify-center" style="margin-top: 10px">
      <a-form ref="formRef" class="w-full max-w-[600px] min-w-[240px]" :model="passwordFormData" :rules="rules" :label-col="{ style: { width: '100px' } }">
        <a-form-item :label="Changelanguage('username')" name="userName" :rules="[{ required: true, message: Changelanguage('rulesusername') }]">
          <a-input v-model:value="passwordFormData.userName" />
        </a-form-item>
        <a-form-item :label="Changelanguage('phoneNumber')" name="phoneNumber" :rules="phoneRules">
          <a-input v-model:value="passwordFormData.phoneNumber" allow-clear :placeholder="Changelanguage('Pleaseenteryourphonenumber')" @change="handlePhoneChange">
            <template #prefix>
              <PhoneOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :label="Changelanguage('verificationCode')" name="phoneCode" :rules="[{ required: true, message: Changelanguage('Pleaseentertheverificationcode') }]">
          <a-input-group compact>
            <a-input
              v-model:value="passwordFormData.phoneCode"
              :class="langtype === 'zh_CN' || langtype === 'zh-CN' ? 'input-text' : 'input-texts'"
              :placeholder="Changelanguage('Pleaseentertheverificationcode')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
            <a-button v-if="sendingType" type="primary" style="margin-left: 24px; white-space: nowrap" @click="handleSendSMS">
              {{ Changelanguage('Sendverificationcode') }}
            </a-button>
            <a-button v-else type="link" style="width: 125px; text-align: center"> {{ countdownTime }}{{ Changelanguage('Volveraenviardespuésdesegundos') }} </a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item has-feedback :label="Changelanguage('Password')" name="newPassword" class="inputstyle">
          <a-input v-model:value="passwordFormData.newPassword" type="password" autocomplete="off" :disabled="inputFlag" />
          <a-tooltip :title="Changelanguage('PasswordPrompt')">
            <InfoCircleOutlined class="iconstyle" />
          </a-tooltip>
        </a-form-item>
        <a-form-item has-feedback :label="Changelanguage('Confirmpassword')" name="confirmPassword">
          <a-input v-model:value="passwordFormData.confirmPassword" type="password" autocomplete="off" :disabled="inputFlag" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.iconstyle {
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
  color: #165dff;
}
.input-text {
  width: calc(100% - 125.4px);
}
.input-texts {
  width: calc(100% - 200.4px);
}
</style>
