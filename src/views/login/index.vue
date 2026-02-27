<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { SelectProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { MessageType } from 'ant-design-vue/es/message';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import Cookies from 'js-cookie';
import type { FormUserInfo } from './types';
import RetrievePassword from './components/retrieve-password.vue';
import { WeiVerify } from '@/wei-components';
import { useLayoutStore } from '@/store/modules/layout/layout';
import { removeLoginForm, setLoginForm, setTenantId, setToken } from '@/utils/auth';
import type { TenantResponseDTO } from '@/api/tags/data-contracts';
import type { TokenType } from '@/api/login/types';
import { HOME_PAGE_ROUTE_NAME, updateUserData } from '@/router/state';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
import { langValue } from '@/utils/changelang';
import { router } from '@/router';
import useRouteCache from '@/hooks/useRouteCache';
import { useWeiTab } from '@/hooks/useWeiTab';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const layoutStore = useLayoutStore();
// 在登录页清空路由缓存
const { caches } = useRouteCache();
const { clear } = useWeiTab();
caches.value = [];
clear(true);

const { push } = useRouter();

const verify = ref<InstanceType<typeof WeiVerify>>();
const loginLoading = ref(false);
const redirect = ref<string>('');
// const permissionStore = usePermissionStore()

const captchaType = ref('blockPuzzle'); // blockPuzzle 滑块 clickWord 点击文字

const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    username: '',
    password: '',
    captchaVerification: '',
    isAd: 0,
    isAppUser: true,
    phoneNumber: '',
    phoneCode: '',
    rememberMe: false,
    tenantName: '',
  },
});
const requestCodeSuccess = ref(false);
const randCodeImage = ref('');
const phoneVisible = ref(false);

// const { t } = useI18n()
const rules = ref<Partial<Record<keyof typeof loginData.loginForm, Array<RuleObject> | RuleObject>>>({
  // tenantName: { required: true, message: t('login.rules.tenantName') },
  username: { required: true, message: Changelanguage('rulesusername') },
  password: { required: true, message: Changelanguage('rulespassword') },
});

/** 手机号码校验规则 */
const phoneRules = ref([
  {
    required: true,
    pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
    message: Changelanguage('rulesphonenumber'),
    trigger: 'blur',
  },
]);

const tenants = ref<Array<TenantResponseDTO>>([]);

/** 页面权限常量判断  */
enum SystemType {
  system = 'system',
  outEpc = 'outEpc',
  other = 'other',
}

const tenantOptions = computed<SelectProps['options']>(() => {
  return tenants.value.map(t => ({ label: t.name, value: t.name }));
});

/** 验证码秒数 */
const countdownTime = ref<number>(60);

/** 发送验证码状态 */
const sendingType = ref<boolean>(true);

onMounted(() => {
  // getTenants();
});

let countdownInterval: any;

/**
 * 倒计时函数
 *
 * 该函数通过setInterval每秒更新一次倒计时，并在倒计时结束时更改发送类型为true。
 */
function countdown() {
  // 使用setInterval设置每秒更新一次倒计时
  countdownInterval = setInterval(() => {
    countdownTime.value--;
    // 检查倒计时是否结束
    if (countdownTime.value <= 0) {
      sendingType.value = true;
      // 清除定时器
      clearInterval(countdownInterval);
    }
  }, 1000); // 1000毫秒 = 1秒
}

function Changelanguage(lang: any) {
  const langtype = navigator.language;
  return langValue(lang, langtype);
}

/** 用于控制验证码组件是否渲染, 点击登录时更新 */
const toLoginComponentKey = ref(0);
/**
 * form finish event
 * @param _value form data
 */
async function onFinish(_value: FormUserInfo) {
  // 禁用验证码时直接登录
  if (loginData.captchaEnable === 'true') return handleLogin({});
  // 避免重复 点击 / 提交
  if (loginLoading.value === true) return;
  loginLoading.value = true;
  try {
    // 请求接口获取是否需要显示验证码
    // const res = await AdminApiSystemAuth.isCode({ userName: loginData.loginForm.username });
    // if (!res.data.data) return await handleLogin({});
    toLoginComponentKey.value++;
    nextTick(() => toLogin());
  } catch (err) {
    console.warn('loading false', 2);
    loginLoading.value = false;
    throw err;
  }
  // console.log(getName);
  // $router.push({ path: '/baseFormList' })
  // login(value)
}

/** to login */
function toLogin() {
  verify.value?.show();
}
function cancelLoginloading() {
  loginLoading.value = false;
}

/**
 * 发起登录请求并保存基本的账户信息
 * @param params params
 */
async function handleLogin(params: any) {
  let hideLoading: MessageType | undefined;
  try {
    const resPassword = await AdminApiSystemAuth.getEncryptPassword({
      password: loginData.loginForm.password,
    });
    if (resPassword.data.code !== 200) return;
    // await getTenantId();
    // const data = await validForm()
    // if (!data) {
    //   return
    // }
    loginData.loginForm.captchaVerification = params.captchaVerification;
    const requestParams: any = {
      ...loginData.loginForm,
      //  password: encryptValue(loginData.loginForm.password),
      password: resPassword.data.data,
    };
    const res = await AdminApiSystemAuth.login1(requestParams);
    if (!res.data) return;
    if (res.data.data?.isAllowLogin !== null && !res.data.data?.isAllowLogin) {
      message.error(Changelanguage('Integratedaccount'));
      loginLoading.value = false;
      return;
    }
    // 双因子验证 短信验证
    // if (res.data.data?.isMobileCheck) {
    //   phoneVisible.value = true;
    //   loginLoading.value = false;
    //   return;
    // push({ path: '/checkPassWord' })
    // return
    // }
    hideLoading = message.loading(Changelanguage('zheng-zai-jia-zai-xi-tong-zhong'), 0);
    layoutStore.setIsHomepage(true);
    layoutStore.setSystemType(SystemType.system);
    // ElLoading.service({
    //   lock: true,
    //   text: '正在加载系统中...',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    if (loginData.loginForm.rememberMe) {
      setLoginForm({
        ...loginData.loginForm,
        tenantName: loginData.loginForm.tenantName || '',
      });
    } else {
      removeLoginForm();
    }

    const resToken = res.data.data as unknown as TokenType;
    localStorage.setItem('Login-method', 'SDA');
    setToken(resToken);

    // 0:不需要修改  ,   1: 跳转修改密码
    const IsUpdatePassCheck = '0';

    // 跳转修改密码
    // if (res.data.data?.isUpdatePassCheck) {
    //   IsUpdatePassCheck = '1'
    //   Cookies.set('IsUpdatePassCheck', IsUpdatePassCheck)
    //   push({ path: '/checkPassWord', query: { userId: res.data.data.userId } })
    //   return
    // }
    Cookies.set('IsUpdatePassCheck', IsUpdatePassCheck);

    if (!redirect.value) redirect.value = '/';

    // 判断是否为SSO登录
    if (redirect.value.includes('sso')) {
      window.location.href = window.location.href.replace('/login?redirect=', '');
    } else {
      // push({ path: redirect.value || permissionStore.addRouters[0].path })
      // push({ path: redirect.value })
      await updateUserData(router, true);
      if (userStore.user.userCategoryName === '匹配手册用户') {
        layoutStore.setSystemType(SystemType.other);
        push({ path: '/EngineMatching' });
      } else if (userStore.user.userType === '3') {
        push({ path: 'system/abnormalmanage/dept' });
      } else if (userStore.user.userType === '4') {
        push({ path: 'system/abnormalmanage/user' });
      } else if (userStore.user.userType === '5') {
        push({ path: 'system/log/system:operate-log:query' });
      } else {
        push({ path: HOME_PAGE_ROUTE_NAME });
      }
    }
  } catch (err: any) {
    console.log(err);
    loginLoading.value = false;
  } finally {
    setTimeout(() => {
      hideLoading && hideLoading();
      // const loadingInstance = ElLoading.service()
      // loadingInstance.close()
    }, 400);
  }
}

/**
 * 手机验证码确认，跳转登录
 */
async function handleCheckCode() {
  let hideLoading: MessageType | undefined;
  try {
    const res = await AdminApiSystemAuth.checkMessageCode({
      userName: loginData.loginForm.username,
      mobile: loginData.loginForm.phoneNumber,
      code: loginData.loginForm.phoneCode,
    });
    if (!res.data) return;
    hideLoading = message.loading(Changelanguage('zheng-zai-jia-zai-xi-tong-zhong'), 0);

    layoutStore.setIsHomepage(true);
    if (loginData.loginForm.rememberMe) {
      setLoginForm({
        ...loginData.loginForm,
        tenantName: loginData.loginForm.tenantName || '',
      });
    } else {
      removeLoginForm();
    }

    const resToken = res.data.data as unknown as TokenType;
    setToken(resToken);

    // 0:不需要修改  ,   1: 跳转修改密码
    let IsUpdatePassCheck = '0';
    // 跳转修改密码
    if (res.data.data?.isUpdatePassCheck) {
      IsUpdatePassCheck = '1';
      Cookies.set('IsUpdatePassCheck', IsUpdatePassCheck);
      push({ path: '/checkPassWord', query: { userId: res.data.data.userId } });
      return;
    }
    Cookies.set('IsUpdatePassCheck', IsUpdatePassCheck);

    if (!redirect.value) redirect.value = '/';

    // 判断是否为SSO登录
    if (redirect.value.includes('sso')) {
      window.location.href = window.location.href.replace('/login?redirect=', '');
    } else {
      // push({ path: redirect.value || permissionStore.addRouters[0].path })
      // push({ path: redirect.value })
      await updateUserData(router, true);
      if (userStore.user.userCategoryName === '匹配手册用户') {
        layoutStore.setSystemType(SystemType.other);
        push({ path: '/EngineMatching' });
      } else {
        push({ path: HOME_PAGE_ROUTE_NAME });
      }
    }

    phoneVisible.value = false;
  } catch (err) {
    console.log(err);
    loginLoading.value = false;
  } finally {
    setTimeout(() => {
      hideLoading && hideLoading();
      // const loadingInstance = ElLoading.service()
      // loadingInstance.close()
    }, 400);
  }
}

/** finish failed event */
function onFinishFailed() {}

/**
 *@description 发送短信验证码
 */
async function handleSendSMS() {
  if (loginData.loginForm.username === '') {
    message.error(Changelanguage('Usernamecannotempty'));
    return;
  }

  if (loginData.loginForm.phoneNumber === '') {
    message.error(Changelanguage('Usernamecannotempty'));
    return;
  }
  const res = await AdminApiSystemAuth.sendingMessage({
    userName: loginData.loginForm.username,
    mobile: loginData.loginForm.phoneNumber,
  });
  if (res.data) {
    sendingType.value = false;
    countdownTime.value = 60;
    countdown();
    message.info(Changelanguage('Verificationcodesentsuccessfully'));
  } else {
    message.error(res.data?.msg || Changelanguage('Verificationcodesenterrorfully'));
  }
}

/**
 * @description 电话号码改变 事件
 * @param event 手机号码
 */
function handlePhoneChange(event: string) {
  const value = loginData.loginForm.phoneNumber;
  // 检查输入框的值是否只包含数字
  if (!/^\d+$/.test(value)) {
    loginData.loginForm.phoneNumber = '';
  }
}

/** 忘记密码弹窗 */
const retrieveModalVisible = ref<boolean>(false);

/**
 * @description 忘记密码点击事件
 */
function handleForgotPassword() {
  retrieveModalVisible.value = true;
}

onUnmounted(() => {
  clearInterval(countdownInterval);
});
onMounted(() => {
  console.log('login----------------mounted');
});
</script>

<template>
  <div class="main">
    <div style="display: flex">
      <!--    登录页背景图    -->
      <div class="main_center">
        <img style="width: 100%; height: 100%" src="@/assets/bg.jpg" />
        <!-- 背景图左上角添加企业logo -->
        <div class="logo_box">
          <img src="@/assets/zg_yt_bak.png" alt="logo" style="width: 400px" />
        </div>
      </div>
      <div class="main_right">
        <div class="Minbox flex-1 relative h-full">
          <div class="loaginMin absolute left-2/4 -translate-x-1/2 -translate-y-1/2 w-[500px] px-[50px]">
            <div class="text-xl">
              {{ Changelanguage('Welcometologin') }}
            </div>
            <div class="text-3xl font-bold">
              {{ Changelanguage('ElectronicCatalogPublishingSystem') }}
            </div>
            <div class="w-[300px] my-14 loginform">
              <a-form :model="loginData.loginForm" name="basic" autocomplete="off" :rules="rules" @finish="onFinish" @finish-failed="onFinishFailed">
                <a-form-item name="username">
                  <a-input v-model:value="loginData.loginForm.username" allow-clear :placeholder="Changelanguage('username')">
                    <template #prefix>
                      <UserOutlined class="icon_style" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="password">
                  <a-input-password
                    v-model:value="loginData.loginForm.password"
                    allow-clear
                    autocomplete="new-password"
                    :placeholder="Changelanguage('password')"
                    :visibility-toggle="true">
                    <template #prefix>
                      <LockOutlined class="icon_style" />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item class="text-center">
                  <a-button class="w-[300px] loginstyle" type="primary" size="size" html-type="submit" :loading="loginLoading">
                    {{ Changelanguage('deng-lu') }}
                  </a-button>
                </a-form-item>
                <!-- <a-form-item class="text-center">
                  <a href="javascript:;" @click="handleForgotPassword">{{ Changelanguage('forgotpassword') }}</a>
                </a-form-item> -->
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RetrievePassword :user-name="loginData.loginForm.username" :modal-visible="retrieveModalVisible" @on-close="retrieveModalVisible = false" />
  <WeiVerify
    v-if="toLoginComponentKey"
    :key="toLoginComponentKey"
    ref="verify"
    :captcha-type="captchaType"
    :img-size="{ width: '400px', height: '200px' }"
    mode="pop"
    @success="handleLogin"
    @cancel-loginloading="cancelLoginloading" />
  <a-modal
    v-model:visible="phoneVisible"
    style="width: 520px"
    :title="Changelanguage('Verificamobile')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handleCheckCode()"
    @cancel="phoneVisible = false">
    <div class="w-[462px] my-[30px]">
      <a-form :model="loginData.loginForm" name="basic" autocomplete="off" :rules="rules">
        <a-form-item name="phoneNumber" :rules="phoneRules">
          <a-input v-model:value="loginData.loginForm.phoneNumber" allow-clear :placeholder="Changelanguage('phoneNumber')" @change="handlePhoneChange">
            <template #prefix>
              <PhoneOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="phoneCode">
          <a-input-group compact>
            <a-input v-model:value="loginData.loginForm.phoneCode" style="width: calc(100% - 125.4px)" :placeholder="Changelanguage('phoneCode')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
            <a-button v-if="sendingType" type="primary" style="margin-left: 24px" @click="handleSendSMS">
              {{ Changelanguage('Sendverificationcode') }}
            </a-button>
            <a-button v-else type="link" style="width: 125px; text-align: center">
              {{ `${countdownTime}${Changelanguage('Resendinseconds')}` }}
            </a-button>
          </a-input-group>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.tenant-select {
  width: 100%;
  :deep(.ant-select-selector) {
    padding-left: 28px;
  }
}
.icon_style {
  color: #c5c5c5;
}
.code_bg {
  width: 101px;
  height: 32px;
  float: right;
  padding: 2px;
  border: 1px #e6ebf1 solid;
  border-radius: 0 2px 2px 0;
  text-align: center;
  cursor: pointer;
}
// relative h-full
.Minbox {
  background: hsla(0, 0%, 100%, 0.5)
  // width: 407px !important;
  // height: 545px !important;
  // background: #ffffff;
  // box-shadow: 0px 9px 8px 0px rgba(166, 190, 236, 0.54);
  // border-radius: 19px 19px 19px 19px;
}
.loaginMin {
  margin-top: 45%;
  margin-left: 15px;
}
.text-xl {
  color: #7b7b7b;
  margin-left: 130px;
}
.text-3xl {
  margin-top: 10px;
  margin-left: 5px;
}
.loginform {
  margin-left: 30px;
}
.loginstyle {
  background: #225df4;
  border-radius: 5px 5px 5px 5px;
}
.main {
  overflow: hidden;
}
.main_center {
  width: 70%;
  height: calc(100vh - 0rem);
  background-color: #f0f0f0;
}
.main_right {
  margin-top: 15%;
  height: 100%;
  width: 30%;
}
.fixed-bottom-right {
  position: fixed;
  right: 50px;
  bottom:-200px;
    cursor: pointer
}
.logo_box{
  z-index: 1000;
  position: absolute;
  top: 50px;
  left: 50px;
}
</style>
