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
  SettingOutlined,
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
import ProjectSettingsDrawer from '@/components/project-settings/ProjectSettingsDrawer.vue'
import { useLayoutStore } from '@/store/modules/layout/layout'
import { useProjectUiStore } from '@/store/modules/layout/projectUi'
import { useUserStore } from '@/store/modules/user'
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

defineOptions({
  /** 多根节点时父级传入的 class（如 ml-auto）不会合并，须单根承接 $attrs */
  inheritAttrs: false,
})

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
const onLineNum = ref<number>();
const onLineUserList = ref<any>(null)
const isOnLineUser = ref<boolean>(false)
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

const languages = ref([])
const projectUi = useProjectUiStore()
const $router = useRouter()

const layoutStore = useLayoutStore()

/** 皮带-列表请求参数 */
const requestParams = reactive(new RequestDTOModel())

const columns = [
  {
    dataIndex: 'username',
    key: 'username',
    title: '用户名称',
    width: 150,
    align: 'left',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '姓名',
    width: 150,
    align: 'left',
  },
  {
    dataIndex: 'onLineNum',
    key: 'onLineNum',
    title: '在线时长',
    width: 150,
  },
  {
    dataIndex: 'ip',
    key: 'ip',
    title: '访问IP',
    width: 150,
  }
]

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
  getOnLineNum();
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
async function getOnLineNum() {
  const res = await AdminApiSystemUser.getAllOnlineUser();
  if (res.data.code == 0 || res.data.code == 200) {
    onLineNum.value = res.data.data?.length;
    onLineUserList.value = res.data.data;
  }
}
function showOnLineUser() {
  getOnLineNum();
  isOnLineUser.value = true;
}





</script>

<template>
  <div v-bind="$attrs" class="project-header-root">
  <div class="project-header-inner project-header-inner--bar project-header-inner--3col">
    <div class="project-header-center">
      <div class="project-header-center-inner flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <div class="project-header-cluster__user flex min-w-0 items-center gap-2">
          <EpcIcon type="icon-icon-xuqiu-yanshouguanli" class="header-bar-icon shrink-0" style="font-size: 16px" />
          <span class="header-menu-text-name whitespace-nowrap">陈颖琴（86291）| 信息化</span>
        </div>
        <div class="project-header-cluster__stamp flex shrink-0 items-center">
          <img class="header-miji-img" src="@/assets/images/miji.png" alt="" />
        </div>
      </div>
    </div>
    <div class="project-header-right">
      <div
        v-if="layoutStore.systemType === 'system'"
        class="header-menu-container shrink-0"
        @click="showOnLineUser()">
        <span class="header-menu-text">当前&nbsp;<b>{{ onLineNum }}</b>&nbsp;{{ $t('人在线') }}</span>
      </div>
      <div class="project-header-right-actions flex shrink-0 items-center gap-1">
        <a-badge :count="badgeNum" :overflow-count="99" class="header-bell-badge">
          <EpcIcon
            type="icon-lingdang1"
            class="header-bar-icon header-bar-icon--bell"
            title="消息提醒"
            @click="getTaskMessageList(true)" />
        </a-badge>
        <a-button type="text" class="header-settings-btn" title="样式配置" @click="projectUi.openSettings()">
          <SettingOutlined class="header-bar-icon" />
        </a-button>
        <span v-if="layoutStore.systemType === 'system'" class="vertical-line" />
        <a-dropdown v-if="layoutStore.systemType === 'system'" @click.prevent>
          <a-button type="text" class="header-user-dropdown-btn">
            <div class="flex cursor-pointer items-center gap-2">
              <a-badge :dot="messageFlag">
                <a-avatar class="bg-img-avatar">
                  <!-- {{ userName.substring(0, 1) }} -->
                </a-avatar>
              </a-badge>
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
  <!-- 弹窗显示在线用户列表-->
  <a-drawer
    title="当前在线用户"
    placement="right"
    :width="700"
    :closable="false"
    :visible="isOnLineUser"
    @close="isOnLineUser = false">
    <div class="message-wrap">
      <!-- 表格显示在线用户列表-->
       <a-table
        :columns="columns"
        :data-source="onLineUserList"
        :pagination="false"
        :scroll="{ y: 300 }"
       />
    </div>
    </a-drawer>
  <ProjectSettingsDrawer />
  </div>
</template>

<style lang="less" scoped>
.project-header-root {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  background-color: var(--project-header-bg, #fff);
}
.project-header-inner {
  color: var(--project-header-fg, #1f2937);
}
.project-header-inner--bar {
  flex: 1;
  align-items: center;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 0 12px;
  box-sizing: border-box;
}
/** 与 Main 顶栏左侧折叠按钮配合：中间区居中、右侧区贴右 */
.project-header-inner--3col {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  column-gap: 16px;
  width: 100%;
}
.project-header-center {
  display: flex;
  min-width: 0;
  justify-content: center;
  justify-self: stretch;
}
.project-header-center-inner {
  max-width: 100%;
}
.project-header-right {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px 12px;
}
.project-header-right-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
}
.header-miji-img {
  display: block;
  height: 36px;
  width: auto;
}
.header-bell-badge {
  display: inline-flex;
  align-items: center;
  line-height: 0;
}
.header-user-dropdown-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center;
  height: auto !important;
  margin-left: 4px !important;
  padding: 0 8px !important;
  color: var(--project-header-fg, #1f2937) !important;
}
.header-user-dropdown-btn:hover,
.header-user-dropdown-btn:focus-visible {
  color: var(--project-header-fg, #1f2937) !important;
  opacity: 0.88;
}
.header-bar-icon {
  color: var(--project-header-fg, #1f2937) !important;
  font-size: 16px;
}
.header-bar-icon--bell {
  font-size: 20px;
}
.project-header-inner :deep(.header-bar-icon svg),
.project-header-inner :deep(.header-bar-icon use) {
  fill: currentColor;
}
.header-settings-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 6px;
  color: var(--project-header-fg, #1f2937);
}
.project-header-inner :deep(.ant-btn-text) {
  color: var(--project-header-fg, #1f2937);
}
.project-header-inner :deep(.ant-btn-text:hover) {
  color: var(--project-header-fg, #1f2937);
  opacity: 0.85;
}
.header-bell-badge :deep(.ant-badge) {
  line-height: 0;
}
@button-size: 32px;
.header-icon {
  @apply text-main;
  width: @button-size;
  height: @button-size;
}
.header-menu-text-name {
  color: var(--project-header-fg, #1f2937);
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
    color: var(--project-header-fg, #1f2937);
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
  color: var(--project-header-fg, #1f2937);
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
  height: 22px;
  flex-shrink: 0;
  align-self: center;
  background-color: var(--project-header-divider, rgba(15, 23, 42, 0.12));
  margin: 0 4px 0 8px;
}

:deep(.ant-layout-header) {
  line-height: normal !important;
}
</style>
