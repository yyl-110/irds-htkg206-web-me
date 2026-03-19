<script lang="ts" setup>
import { stringify } from 'node:querystring'
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
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { FunctionalComponent } from 'vue'
import { computed, createVNode, ref } from 'vue'
import _ from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import type { MenuProps } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface'
import type { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon'
import AntDVZhCN from 'ant-design-vue/es/locale/zh_CN'
import vxeZhCN from 'vxe-pc-ui/lib/language/zh-CN'
import { useLayoutStore } from '@/store/modules/layout/layout'
import { useUserStore } from '@/store/modules/user'
import type { WeiThemeKey } from '@/utils/WeiTheme'
import { WeiTheme } from '@/utils/WeiTheme'
import appStore from '@/store'
import { Locales, WeiI18n } from '@/utils/WeiI18n'
import { toLogin } from '@/httpRequest'
import { RequestDTOModel, tipsRequestDTOModel } from '@/api/models/searchCategory/belt/RequestDTOModel'
import { CommonListRequestDTOModulemanaGementModel } from '@/api/models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel'
import { EpcIcon } from '@/components/icon/EpcIcon.js'
import { encryptValue } from '@/utils'
import { debounce } from '@/hooks/useDebonce'
import { AdminApiSystemLanguage } from '@/api/tags/管理后台多语言'
import { removeWatermark } from '@/utils/watermark'
import { AdminApiSystemUser } from '@/api/tags/管理后台用户'

const timer = ref<any>(null)
const isTaskMessage = ref<boolean>(false)
const userNum = ref<number>(1)
/** 功能模块状态 */
const badgeNum = ref<number>()
const router = useRouter()
const route = useRoute()
const taskMessage = ref<any[]>(['Racing car sprays burning fuel into crowd.'])
const langtype = localStorage.getItem('wei-language') || navigator.language
const LoginMethod = localStorage.getItem('Login-method') || ''
interface NoticeMenuItem {
  label: string
  icon: FunctionalComponent<AntdIconProps>
  badgeCount: number
  onClick: () => any
}

/**
 * on click language menu
 * @param e
 * @param key
 */
//  : keyof typeof
function onClickLanguageMenu(key: any) {
  const keys = key.vxeKey
  // 调用语言编辑接口
  updateLanguage(key)

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
  const keys = key?.vxeKey
  const userStore = useUserStore()
  AdminApiSystemLanguage.updateUserLanguage({
    userId: `${userStore.getUser.id}`,
    language: keys,
  }).then(res => {
    localStorage.setItem('wei-language', keys)
    WeiI18n.updateHTMLLang(keys)
    WeiI18n.fetchLocales(key)
    // setTimeout(() => {
    location.reload()
    // }, 500)
  })
}

/**
 * @description 功能模块
 */
function handleFunction() {
  message.info(WeiI18n.$t('功能开发中，敬请期待'))
}

const userStore = useUserStore()
const userName = ref(userStore.getUser.userName)

const themes = WeiTheme.Themes
const isDark = WeiTheme.isDark
const languages = ref([])
const $router = useRouter()

const layoutStore = useLayoutStore()

/** 皮带-列表请求参数 */
const requestParams = reactive(new RequestDTOModel())

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
    if (!key) return
    // const response = await fetch(`${url}${key.previewUrl}`) // 这里直接指向 public 文件夹中的数据 或者预览路径
    const url = import.meta.env.VITE_BASE_HTMLPREVIEW_URL2
    const response = await fetch(`${`${url}/files/language/`}${key.lang}.json`) // 这里直接指向 /usr/share/nginx/html/manual/languag    文件夹中的数据 或者预览路径
    const data = await response.json()
    await localStorage.setItem(key.lang, JSON.stringify(data))
  } catch (error) {
    console.error('Error fetching style template:-----语言存放------------', error)
  }
}
/** handle login */
async function handleLogin() {
  const type = userStore.getUser.type
  Modal.confirm({
    title: WeiI18n.t('温馨提示').value,
    icon: createVNode(ExclamationCircleOutlined),
    content: `${WeiI18n.t('是否退出本系统').value}?`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const userStore = appStore.useUser
      try {
        await userStore.loginOut()
      } catch (error) {
        console.error(error)
      } finally {
        await toLogin()
        $router.replace('/login')
        location.reload()
        removeWatermark()
        // 多语言
        // initLanguage();
      }
    },
    onCancel() {},
  })
}

/**
 * switch  应用端、管理中心切换
 * @param type
 */
function switchSystem(type: boolean) {
  requestParams.text = ''
  // 单点登录状态判断
  if (layoutStore.systemType === 'system') {
    if (type) {
      layoutStore.setHomeType('home')
    }
    layoutStore.setIsHomepage(type)
    if (userStore.user.userType === '3') {
      $router.push({ path: 'system/abnormalmanage/dept' })
    } else if (userStore.user.userType === '4') {
      $router.push({ path: 'system/abnormalmanage/user' })
    } else if (userStore.user.userType === '5') {
      $router.push({ path: 'system/log/system:operate-log:query' })
    } else {
      $router.push({ path: '/home/workbench' })
    }
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
  layoutStore.setHomeType('unHome')
  layoutStore.setIsHomepage(type)
  $router.push({ path })
}

function SwitchingMarketingCloud() {
  window.location.href = 'https://crm.ytogroup.com:61218/#/login'
}

/** 头像消息状态 */
const messageFlag = ref<boolean>(false)

/** 反馈提示状态 */
const feedbackPromptFlag = ref<any>(false)

/** 任务提示状态 */
const taskPromptFlag = ref<any>(false)

async function initFeedbackReadFlag(type: string) {}

initFeedbackReadFlag('1')
initFeedbackReadFlag('2')

watch(
  () => $router.currentRoute.value.path,
  (newPath, oldPath) => {},
  { immediate: true },
)
onMounted(() => {
  // initLanguage();
  // 设置定时器，每分钟(15000毫秒)执行一次
  // timer.value = setInterval(() => {}, 15000);
  getTaskMessageList()
})

// onBeforeUnmount(() => {
//   clearInterval(timer.value);
// });
function goPage(item: any) {
  console.log(item, 'item')
}
async function getTaskMessageList(type: boolean = false) {
  isTaskMessage.value = type
  const res = await AdminApiSystemUser.getTaskMessage({ userId: `${userStore.getUser.id}` })
  if (res.data.code == 0) {
    const data: any = res.data.data
    taskMessage.value = data.resultArrayList
    badgeNum.value = data.size
  }
}
</script>

<template>
  <div class="w-[100%] h-[100%] flex justify-between text-left px-3" style="flex: 1">
    <div />
    <div>
      <EpcIcon type="icon-icon-xuqiu-yanshouguanli" style="font-size: 16px; color: #313133" />
      <span class="header-menu-text-name">&nbsp;&nbsp;陈颖琴（86291）&nbsp;&nbsp;|&nbsp;&nbsp;信息化</span>
      <span style="margin-left: 50px">
        <img class="h-[50px]" src="@/assets/images/miji.png" />
      </span>
    </div>
    <div class="flex items-center space-x-1">
      <div v-if="layoutStore.systemType === 'system'" class="header-menu-container" @click="switchSystem(true)">
        <span class="header-menu-text">12{{ $t('人在线') }}</span>
      </div>
      <div>
        <div class="online-user" />
        <a-badge :count="badgeNum" :overflow-count="99" style="margin-left: 10px">
          <EpcIcon
            type="icon-lingdang1"
            title="消息提醒"
            style="font-size: 20px; margin-top: 22px; margin-left: 5px"
            @click="getTaskMessageList(true)" />
        </a-badge>
      </div>

      <!-- 功能模块 -->
      <div class="button-group flex space-x-5 items-center">
        <span class="vertical-line" />
        <a-dropdown v-if="layoutStore.systemType === 'system'" @click.prevent>
          <!-- 竖线分隔符 -->

          <a-button type="text" style="height: 100%; margin-left: 5px !important; padding: 0 10px">
            <div class="flex items-center space-x-2 cursor-pointer">
              <a-badge :dot="messageFlag">
                <a-avatar class="bg-img-avatar">
                  <!-- {{ userName.substring(0, 1) }} -->
                </a-avatar>
              </a-badge>
              <!-- class="text-secondary" -->
              <div class="header-userName">
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
    <a-drawer
      title="消息提醒"
      placement="right"
      :closable="false"
      :visible="isTaskMessage"
      @close="isTaskMessage = false">
      <div class="message-wrap">
        <p v-for="(item, index) in taskMessage" :key="index" class="mes-list" size="small" @click="goPage(item)">
          {{ item.showString }}
        </p>
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
.header-menu-text-name {
  color: var(--Color-, #313133);
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
    color: var(--Color-, #313133);
    font-family: 'Source Sans 3';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
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
.header-userName {
  color: var(--Color-, #313133);
  font-family: 'Source Sans 3';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
.bg-img-avatar {
  background-image: url('@/assets/images/people.png') !important;
  background-size: cover;
  background-position: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8); /* 增强文字可读性 */
  width: 20px;
  height: 20px;
}

/* 竖线样式 */
.vertical-line {
  width: 1px;
  height: 30px; /* 竖线高度，和头像匹配 */
  background-color: #0e44ae; /* 浅灰色，可改 */
  margin-left: 10px;
}
</style>
