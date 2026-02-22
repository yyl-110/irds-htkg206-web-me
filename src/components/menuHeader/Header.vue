<script lang="ts" setup>
import { stringify } from 'node:querystring';
import {
  AppstoreOutlined,
  CalendarOutlined,
  DesktopOutlined,
  ExclamationCircleOutlined,
  FundOutlined,
  MessageOutlined,
  NotificationOutlined,
  PoweroffOutlined,
  ScheduleOutlined,
  UserOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue';
import type { FunctionalComponent } from 'vue';
import { computed, createVNode, ref } from 'vue';
import _ from 'lodash-es';
import { useRouter, useRoute } from 'vue-router';
import type { MenuProps } from 'ant-design-vue';
import { Modal, message } from 'ant-design-vue';
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface';
import type { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon';
import AntDVZhCN from 'ant-design-vue/es/locale/zh_CN';
import vxeZhCN from 'vxe-pc-ui/lib/language/zh-CN';
import { useLayoutStore } from '@/store/modules/layout/layout';
import { useUserStore } from '@/store/modules/user';
import type { WeiThemeKey } from '@/utils/WeiTheme';
import { WeiTheme } from '@/utils/WeiTheme';
import appStore from '@/store';
import { Locales, WeiI18n } from '@/utils/WeiI18n';
import { toLogin } from '@/httpRequest';
import { RequestDTOModel, tipsRequestDTOModel } from '@/api/models/searchCategory/belt/RequestDTOModel';
import { CommonListRequestDTOModulemanaGementModel } from '@/api/models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { encryptValue } from '@/utils';
import { debounce } from '@/hooks/useDebonce';
import { AdminApiSystemLanguage } from '@/api/tags/管理后台多语言';
import { removeWatermark } from '@/utils/watermark';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户'; // tag class
const timer = ref<any>(null);
const isTaskMessage = ref<boolean>(false);
const userNum = ref<number>(1);
/** 功能模块状态 */
const badgeNum = ref<number>();
const router = useRouter();
const route = useRoute();
const taskMessage = ref<any[]>(['Racing car sprays burning fuel into crowd.']);
const langtype = localStorage.getItem('wei-language') || navigator.language;
const LoginMethod = localStorage.getItem('Login-method') || '';
interface NoticeMenuItem {
  label: string;
  icon: FunctionalComponent<AntdIconProps>;
  badgeCount: number;
  onClick: () => any;
}

/**
 * on click language menu
 * @param e
 * @param key
 */
//  : keyof typeof
function onClickLanguageMenu(key: any) {
  const keys = key.vxeKey;
  // 调用语言编辑接口
  updateLanguage(key);

  // WeiI18n.saveLanguage(keys)
  // // WeiI18n.updateHTMLLang(keys)
  // WeiI18n.fetchLocales(key)
  // location.reload()
}

/**
 * 更新用户语言
 * @param key
 */
function updateLanguage(key: any) {
  const keys = key?.vxeKey;
  const userStore = useUserStore();
  AdminApiSystemLanguage.updateUserLanguage({
    userId: `${userStore.getUser.id}`,
    language: keys,
  }).then(res => {
    localStorage.setItem('wei-language', keys);
    WeiI18n.updateHTMLLang(keys);
    WeiI18n.fetchLocales(key);
    // setTimeout(() => {
    location.reload();
    // }, 500)
  });
}

/**
 * @description 功能模块
 */
function handleFunction() {
  message.info(WeiI18n.$t('功能开发中，敬请期待'));
}

const userStore = useUserStore();
const userName = ref(userStore.getUser.userName);

const themes = WeiTheme.Themes;
const isDark = WeiTheme.isDark;
const languages = ref([]);
const $router = useRouter();

const layoutStore = useLayoutStore();

/** 皮带-列表请求参数 */
const requestParams = reactive(new RequestDTOModel());

function initLanguage() {
  // const language = localStorage.getItem('language');
  // if (language) {
  //   languages.value = JSON.parse(language);
  //   return;
  // }
  // AdminApiSystemLanguage.languageList({}).then(res => {
  //   if (res.data.code === 200) {
  //     const languageList = res.data.data;
  //     if (languageList) {
  //       const obj: any = {};
  //       languageList.forEach(element => {
  //         obj[element.lang] = {
  //           name: element.langDesc,
  //           previewUrl: element.previewUrl,
  //           antdvLocale: AntDVZhCN,
  //           vxeKey: element.lang,
  //           vxeLocale: vxeZhCN,
  //           dayjsLocale: element.lang,
  //         };
  //         if (!localStorage.getItem(element.lang)) {
  //           setStoreLanguage(element);
  //         }
  //       });
  //       languages.value = obj;
  //       localStorage.setItem('language', JSON.stringify(languages.value));
  //     }
  //   }
  // });
}

/**
 * 存放语言数据到本地
 * @param key 语言key
 * @returns
 */
async function setStoreLanguage(key: any) {
  try {
    if (!key) return;
    // const response = await fetch(`${url}${key.previewUrl}`) // 这里直接指向 public 文件夹中的数据 或者预览路径
    const url = import.meta.env.VITE_BASE_HTMLPREVIEW_URL2;
    const response = await fetch(`${`${url}/files/language/`}${key.lang}.json`); // 这里直接指向 /usr/share/nginx/html/manual/languag    文件夹中的数据 或者预览路径
    const data = await response.json();
    await localStorage.setItem(key.lang, JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching style template:-----语言存放------------', error);
  }
}
/** handle login */
async function handleLogin() {
  let type = userStore.getUser.type;
  Modal.confirm({
    title: WeiI18n.t('温馨提示').value,
    icon: createVNode(ExclamationCircleOutlined),
    content: `${WeiI18n.t('是否退出本系统').value}?`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const userStore = appStore.useUser;
      try {
        await userStore.loginOut();
      } catch (error) {
        console.error(error);
      } finally {
        await toLogin();
        $router.replace('/login');
        location.reload();
        removeWatermark();
        // 多语言
        //initLanguage();
      }
    },
    onCancel() {},
  });
}

/**
 * switch  应用端、管理中心切换
 * @param type
 */
function switchSystem(type: boolean) {
  requestParams.text = '';
  // 单点登录状态判断
  if (layoutStore.systemType === 'system') {
    if (type) {
      layoutStore.setHomeType('home');
    }
    layoutStore.setIsHomepage(type);
    $router.push({ path: '/home/workbench' });
  }
}

/**
 * @description  我的任务，我的反馈跳转
 * @param path
 * @param type boolean
 */
function switchTaskOrFeedback(type: boolean, path: string) {
  if (type) {
    // layoutStore.setHomeType('home')
  }
  layoutStore.setHomeType('unHome');
  layoutStore.setIsHomepage(type);
  $router.push({ path });
}

function SwitchingMarketingCloud() {
  window.location.href = 'https://crm.ytogroup.com:61218/#/login';
}

/** 头像消息状态 */
const messageFlag = ref<boolean>(false);

/** 反馈提示状态 */
const feedbackPromptFlag = ref<any>(false);

/** 任务提示状态 */
const taskPromptFlag = ref<any>(false);

async function initFeedbackReadFlag(type: string) {}

initFeedbackReadFlag('1');
initFeedbackReadFlag('2');

watch(
  () => $router.currentRoute.value.path,
  (newPath, oldPath) => {},
  { immediate: true }
);
onMounted(() => {
  //initLanguage();
  // 设置定时器，每分钟(15000毫秒)执行一次
  // timer.value = setInterval(() => {}, 15000);
  getTaskMessageList();
});

// onBeforeUnmount(() => {
//   clearInterval(timer.value);
// });
function goPage(item: any) {
  console.log(item, 'item');
}
async function getTaskMessageList(type: boolean = false) {
  isTaskMessage.value = type;
  const res = await AdminApiSystemUser.getTaskMessage({ userId: `${userStore.getUser.id}` });
  if (res.data.code == 0) {
    let data: any = res.data.data;
    taskMessage.value = data.resultArrayList;
    badgeNum.value = data.size;
  }
}
</script>

<template>
  <div class="w-[100%] h-[100%] flex justify-between text-left px-3" style="box-shadow: var(--wei-page-layout-header-box-shadow); color: #ffffff">
    <div class="flex items-center space-x-4 min-w-[280px]" style="cursor: pointer" @click="switchSystem(true)">
      <img class="h-[32px]" src="@/assets/zg_yt.png" />
      <!-- <a-image class="h-[24px] inline" :src="imgUrl" :preview="false" /> -->
      <!-- <a-image class="h-[24px] ml-[13px] inline" :src="titleLogo" :preview="false" /> -->
      <span class="font-bold text-[20px] leading-[20px] w-min-[125px]" style="color: #ffffff">{{ $t('中车长客数智研发系统(CRIS)') }}</span>
      <!-- <span class="text-lg font-semibold text-white">前端基础框架</span> -->
    </div>

    <div class="flex items-center space-x-1">
      <div v-if="layoutStore.systemType === 'system'" class="header-menu-container" @click="switchSystem(true)">
        <EpcIcon type="icon-home1" style="font-size: 20px; margin-top: -4px; margin-left: 5px; color: #ffffff" />
        <span class="header-menu-text" style="color: #ffffff">{{ $t('主页') }}</span>
      </div>
      <div>
        <div class="online-user">
          <!-- <img src="../../assets/workbench/avatar.jpg" size="24" /> -->
        </div>
        <!-- <div style="cursor: pointer; float: left; color: #ffffff" @click="getOnlineUserList">当前在线{{ userNum }}人</div> -->
        <a-badge :count="badgeNum" :overflow-count="99" style="margin-left: 10px">
          <EpcIcon type="icon-lingdang1" style="font-size: 20px; margin-top: 22px; margin-left: 5px; color: #ffffff" @click="getTaskMessageList(true)" />
        </a-badge>
      </div>
      <!-- 功能模块 -->
      <div class="button-group flex space-x-5 items-center">
        <!-- 语言 -->
        <!-- <div class="button-group flex space-x-5 items-center">
          <a-dropdown @click.prevent>
            <div class="header-menu-container">
              <EpcIcon type="icon-language" style="font-size: 16px; margin-top: -1px" />
              <span class="header-menu-text">{{ $t('语言') }}</span>
            </div>
            <template #overlay>
              <a-menu
                @click="
                  ({ key }: any) => {
                    $i18n.locale = key;
                  }
                ">
                <a-menu-item v-for="(item, key) in languages" :key="key" @click="onClickLanguageMenu(item)">
                  <div class="flex">
                    <EpcIcon v-if="key === 'zh_CN'" type="icon-zhongguoguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'en_US'" type="icon-meiguoguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'ru_RU'" type="icon-eluosiguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'fr_FR'" type="icon-faguoguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'it_IT'" type="icon-yidaliguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'es_ES'" type="icon-xibanyaguoqi" class="lang-icon-cls" />
                    <EpcIcon v-else-if="key === 'vi_VN'" type="icon-yuenanguoqi" class="lang-icon-cls" />
                    <span :style="styleColor(key)">{{ $t(item.name) }}</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div> 代码合并 -->
        <a-dropdown v-if="layoutStore.systemType === 'system'" @click.prevent>
          <a-button type="text" style="height: 100%; margin-left: 5px !important; padding: 0 10px">
            <div class="flex items-center space-x-2 cursor-pointer">
              <a-badge :dot="messageFlag">
                <a-avatar class="bg-primary">
                  {{ userName.substring(0, 1) }}
                </a-avatar>
              </a-badge>
              <!-- class="text-secondary" -->
              <div style="color: #ffffff">
                {{ $t(userName) }}
              </div>
            </div>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <template #icon>
                  <UserOutlined class="text-[16px]" />
                </template>
                <a @click="$router.push('/personal-center/user/profile')">{{ $t('个人中心') }}</a>
              </a-menu-item>
              <a-menu-item>
                <template #icon>
                  <PoweroffOutlined class="text-[16px]" />
                </template>
                <a @click="handleLogin">{{ $t('退出登录') }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <a-drawer title="消息提醒" placement="right" :closable="false" :visible="isTaskMessage" @close="isTaskMessage = false">
      <div class="message-wrap">
        <p class="mes-list" size="small" @click="goPage(item)" v-for="(item, index) in taskMessage" :key="index">{{ item.showString }}</p>
        <a-divider v-if="taskMessage.length > 0" />
      </div>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.ant-badge .anticon) {
  margin-top: 5px !important;
}
@button-size: 32px;
.header-icon {
  @apply text-main;
  width: @button-size;
  height: @button-size;
}
.header-menu-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  .header-menu-img {
    width: 14px;
    height: 14px;
    line-height: 11px;
  }
  .header-menu-text {
    font-size: 14px;
    color: #666666;
    font-weight: 400px;
    margin-left: 7px;
    white-space: nowrap;
  }

  .header-menu-text-search {
    min-width: 56px;
    margin-left: 3px;
    height: 17px;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 14px;
    color: #165dff;
    line-height: 16px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}
.w-input-c {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  .search-select {
    width: 552px;

    :deep(.ant-input-lg) {
      border-radius: 8px 0 0 8px;
      height: 35px;
    }

    :deep(.ant-btn-lg) {
      border-radius: 0 8px 8px 0 !important;
      height: 35px;
    }

    :deep(.ant-input-group-addon) {
      border-radius: 0 8px 8px 0;
    }
  }
}
.row-more {
  display: flex;
  margin-top: 10px;
  margin-left: 20px;
  color: #10a3e7;
}
.titleBefore {
  width: 5px;
  height: 16px;
  border-radius: 3px;
  margin-right: 10px;
  margin-top: 3px;
  background-color: #0a84ff;
}
.searchList {
  width: 170px;
  height: 30px;
  margin: 10px 25px 0px 25px;
  border: 0.5px solid #938386;
  display: inline-flex;
  align-items: center;
  color: var(main-text-colord);
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    color: rgba(22, 93, 255, 1);
    transform: translateY(-6px);
    box-shadow: 0px 0 10px 0px var(--main-selected);
  }
  .searchList-text {
    margin-left: 5px;
  }
  .searchList-texts {
    line-height: 10px;
    margin-left: 5px;
    font-size: 10px;
  }
}
.iconfont-size {
  margin-left: 15px;
}
.lang-icon-cls {
  margin-right: 5px;
  margin-top: 4px;
}
</style>
