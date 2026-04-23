<script lang="ts" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import type { Ref, VNode } from 'vue'
import { computed, h, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import type { LayoutSider } from 'ant-design-vue'
import { get } from 'lodash-es'
import useRouteCache from '@/hooks/useRouteCache'
import WeiPageTabs from '@/wei-components/WeiPageTabs/index.vue'
import MainHeader from '@/components/menuHeader/Header.vue'
import WeiLayoutMenuSider from '@/wei-components/WeiLayoutSiderMenu/index.vue'
import { useLayoutStore } from '@/store/modules/layout/layout'
import { useProjectUiStore } from '@/store/modules/layout/projectUi'
import { computeMenuChromeCssVars } from '@/utils/menuThemeChrome'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils/tools'
import { notification } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
const layoutStore = useLayoutStore()
const projectUi = useProjectUiStore()
const collapsed: Ref<boolean> = ref(false)
const { caches } = useRouteCache()

const userStore = useUserStore()

const route = useRoute()
const $router = useRouter()
/** 侧栏菜单主题 CSS 变量（挂在侧栏列容器上，避免影响顶栏横向菜单） */
const siderColumnTheme = computed(() => {
  const { vars, isLight } = computeMenuChromeCssVars(projectUi.menuBg)
  const style: Record<string, string> = {
    '--project-menu-bg': projectUi.menuBg,
    ...vars,
  }
  return { style, isLight }
})

watch(
  () => [projectUi.grayscale, projectUi.colorWeak, projectUi.headerBg, projectUi.menuBg, projectUi.systemThemeKey],
  () => projectUi.applyDomEffects(),
  { deep: true },
)
const { getTabNameByFullPath, wrapperMap } = useRouteCache()

/** 高级搜索 弹窗状态 */
const visible = computed(() => {
  return layoutStore.advancedDrawerVisible
})

/** 不展示左侧菜单的页面路由 */
const homeList = ref([
  '/home-main/HomeMain',
  '/home-main/components/replaceRelationship/index',
  '/business/information-views/index',
])

watch(
  () => $router.currentRoute.value.path,
  (newPath, oldPath) => {
    let type = <boolean>false
    if (homeList.value.includes(newPath)) {
      type = true
    }
    layoutStore.setIsHomepage(type)
    if ('/home-main/HomeMain'.includes(newPath)) {
      layoutStore.setHomeType('home')
    }
  },
  { immediate: true },
)

/**
 * 为路由页面组件包裹一层可以自定义 name 的组件用于修改 keep-alive 缓存的组件 name
 * @see 实现方式参考自 https://github.com/vuejs/core/pull/4339#issuecomment-1238984279
 * @param component vue-router slot 的 component 参数
 * @param route vue-router 的 route 参数
 */
function wrap(component: VNode, route: RouteLocationNormalizedLoaded) {
  let wrapperComponent
  const wrapperComponentName = getTabNameByFullPath(route)
  if (wrapperMap[wrapperComponentName]) {
    const _component = wrapperMap[wrapperComponentName]
    if (!_component) throw new Error('Missing Route Wrapper Component')
    wrapperComponent = _component
  } else {
    wrapperComponent = {
      name: wrapperComponentName,
      render() {
        return h('div', { className: 'route-page-wrapper' }, component)
      },
    }
    wrapperMap[wrapperComponentName] = wrapperComponent
  }
  return h(wrapperComponent)
}

/** 左侧 aside 默认宽度 */
const ASIDE_DEFAULT_WIDTH = 240
/** 左侧 aside 最小宽度 */
const ASIDE_MIN_WIDTH = 240
/** 左侧 aside 最大宽度 */
const ASIDE_MAX_WIDTH = 800
/** 侧栏折叠宽度：略宽于仅图标，避免 55px 下 antd 内联菜单被裁切；Logo 在样式内等比缩小 */
const SIDER_COLLAPSED_WIDTH = 64
/** localStorage 存储的 Key */
const ASIDE_WIDTH_STORAGE_KEY = 'asideWidth'

const asideRef = ref<InstanceType<typeof LayoutSider>>()
/** 左侧 aside 宽度 */
const _asideWidth = ref(Number(localStorage.getItem(ASIDE_WIDTH_STORAGE_KEY)) || ASIDE_DEFAULT_WIDTH)
/** 左侧 aside 宽度 */
const asideWidth = computed({
  get() {
    return _asideWidth.value
  },
  set(width: number) {
    _asideWidth.value = width
    localStorage.setItem(ASIDE_WIDTH_STORAGE_KEY, width.toString())
  },
})
const asideWidthStyle = computed(() => `${asideWidth.value}px`)
/** 业务里 marginLeft 等用的实际侧栏占位宽：折叠时用折叠宽 */
const effectiveAsideWidthStyle = computed(() =>
  collapsed.value ? `${SIDER_COLLAPSED_WIDTH}px` : asideWidthStyle.value,
)
watch(
  effectiveAsideWidthStyle,
  v => {
    layoutStore.setAsideWidthStyle(v)
  },
  { immediate: true },
)
const asideResizing = ref(false)

/**
 * mouse down event function
 * @param event
 */
function handleMouseDown(event: MouseEvent | TouchEvent) {
  event.preventDefault()
  event.stopPropagation()

  asideResizing.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('touchmove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchend', handleMouseUp)
}
/**
 * mouse move event function
 * @param event
 */
function handleMouseMove(event: MouseEvent | TouchEvent) {
  const clientX = get(event, 'clientX') || get(event, ['touches', 0, 'clientX'])
  let newWidth = clientX - asideRef.value?.$el?.getBoundingClientRect().left
  if (newWidth < ASIDE_MIN_WIDTH) newWidth = ASIDE_MIN_WIDTH
  if (newWidth > ASIDE_MAX_WIDTH) newWidth = ASIDE_MAX_WIDTH
  if (asideRef.value) asideWidth.value = newWidth
}
/**
 * mouse up event function
 */
function handleMouseUp() {
  asideResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchend', handleMouseUp)
}

const loading = ref<boolean>(true)

function parseTime(date: Date) {
  return date.toLocaleString().split(' ')[0]
}
const timer = ref<any>(null)

onMounted(() => {
  // 加载默认语言
  if (!localStorage.getItem('wei-language')) {
    localStorage.setItem('wei-language', navigator.language.replace(/-/g, '_') || WeiI18n.DEFAULT_LANGUAGE)
  }
  setTimeout(() => {
    loading.value = false
  }, 500)
})

onBeforeMount(() => {
  loading.value = true
})
</script>

<template>
  <a-spin :spinning="loading" tip="加载中...">
    <a-layout
      class="main-root-layout"
      :class="{ 'main-root-layout--sider-right': projectUi.siderOnRight }"
      style="min-height: 100vh">
      <div
        v-if="projectUi.showSider"
        class="sider-column-wrap"
        :class="{ 'project-ui-menu-light': siderColumnTheme.isLight }"
        :style="siderColumnTheme.style">
        <a-layout-sider
          ref="asideRef"
          v-model:collapsed="collapsed"
          :collapsedWidth="SIDER_COLLAPSED_WIDTH"
          :trigger="null"
          class="sider-wrapper p-0"
          :data-resizing="asideResizing"
          collapsible>
          <aside
            class="sider-aside-column flex h-full min-h-0 flex-col bg-[var(--project-menu-bg,#1a3677)] pt-4"
            :class="collapsed ? 'overflow-x-visible' : 'overflow-x-hidden'">
            <div class="sider-header" style="cursor: pointer" v-if="!collapsed">
              <img class="sider-header-img" src="@/assets/zg_yt.png" />
              <div class="sider-header-text">{{ $t('机械设备快速设计系统') }}</div>
            </div>
            <div v-else class="sider-header-collapsed">
              <img class="sider-header-collapsed-img" src="@/assets/zg_yt.png" />
            </div>
            <div class="sider-menu-scroll min-h-0 flex-1">
              <WeiLayoutMenuSider :collapsed="collapsed" />
            </div>
            <div
              v-if="projectUi.showSider && !projectUi.collapseInHeader"
              class="sider-footer-collapse flex flex-shrink-0 justify-center border-t py-2">
              <a-button type="text" size="small" class="sider-collapse-bottom-btn" @click="collapsed = !collapsed">
                <MenuFoldOutlined v-if="collapsed" class="text-base" />
                <MenuUnfoldOutlined v-else class="text-base" />
              </a-button>
            </div>
          </aside>
        </a-layout-sider>
      </div>
      <a-layout>
        <a-layout-header class="collapsed-header flex min-w-0 items-center px-0">
          <div
            class="collapsed-header-leading flex h-full min-h-0 min-w-0 flex-shrink-0 items-center gap-1 self-stretch bg-[var(--project-header-bg,#fff)] pl-2">
            <a-button
              v-if="projectUi.showSider && projectUi.collapseInHeader"
              type="text"
              size="small"
              @click="collapsed = !collapsed">
              <MenuFoldOutlined v-if="collapsed" class="text-base" />
              <MenuUnfoldOutlined v-else class="text-base" />
            </a-button>
          </div>
          <div
            v-if="projectUi.menuInHeader"
            class="project-ui-top-menu-wrap flex min-h-0 min-w-0 flex-1 items-center self-stretch overflow-x-auto"
            data-align="center">
            <WeiLayoutMenuSider mode="horizontal" :collapsed="true" />
          </div>
          <MainHeader class="main-header-slot flex h-full min-h-0 min-w-0 flex-1 items-center" />
        </a-layout-header>
        <!-- 页面标签栏 -->
        <WeiPageTabs v-if="!layoutStore.homepage && projectUi.showTabs" tab-style="card" />
        <!-- 页面容器 -->
        <a-layout-content
          class="layout-container"
          v-overlay-scrollbar
          :class="[
            !layoutStore.homepage && route.name === 'ProductProjectEditor'
              ? 'px-[16px] pb-[16px] pt-2 layout-container--white layout-container--editor-fill'
              : !layoutStore.homepage
                ? 'p-[16px] pt-[16px] pl-[11px]'
                : '',
          ]">
          <div
            class="layout-router-host min-h-0 flex w-full min-w-0 flex-1 flex-col"
            :class="{
              'layout-router-host--fill': !layoutStore.homepage && route.name === 'ProductProjectEditor',
            }">
            <pre style="display: none">{{ caches }}</pre>
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="caches">
                <component :is="wrap(Component, route)" />
              </keep-alive>
            </router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<style lang="less" scoped>
/* 左侧栏固定视口高度，菜单区超出出现滚动条，底部折叠条固定 */
.sider-column-wrap {
  display: flex;
  flex-shrink: 0;
  align-self: stretch;
  height: 100vh;
  max-height: 100vh;
  min-height: 0;
  box-shadow: none !important;
}

.main-root-layout {
  min-height: 100vh;
  flex-direction: row !important;
  align-items: stretch;

  /* 右侧主区域：定高列布局，避免 header+标签+内容用 calc 叠出 >100vh 导致整页出滚动条 */
  :deep(> .ant-layout) {
    flex: 1;
    min-width: 0;
    min-height: 0;
    max-height: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.collapsed-header {
  padding: 0;
  // position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 0;
  // padding-left: 50px;
}

/* 顶栏内菜单折叠：与 --project-header-fg 一致（白顶栏深色图标，彩色顶栏白图标） */
.collapsed-header-leading :deep(.ant-btn.ant-btn-text),
.collapsed-header-leading :deep(.ant-btn.ant-btn-text:hover),
.collapsed-header-leading :deep(.ant-btn.ant-btn-text:focus-visible) {
  color: var(--project-header-fg, #1f2937) !important;
}
.collapsed-header-leading :deep(.ant-btn.ant-btn-text .anticon),
.collapsed-header-leading :deep(.ant-btn.ant-btn-text:hover .anticon),
.collapsed-header-leading :deep(.ant-btn.ant-btn-text:focus-visible .anticon) {
  color: inherit !important;
}
.collapsed-header-leading :deep(.ant-btn.ant-btn-text .anticon svg) {
  fill: currentColor;
}

.sider-wrapper {
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  .sider-menu-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    /* 隐藏滚动条，仍可用滚轮 / 触控板滚动 */
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }

  .sider-footer-bar {
    flex-shrink: 0;
  }

  .sider-header {
    // width: 215px;
    height: 45px;
    box-shadow: none !important;
    display: flex;
    justify-content: center;
    .sider-header-img {
      // width: 55px;
      margin-left: -15px;
      height: 34px;
      aspect-ratio: 55/34;
    }
    .sider-header-text {
      // width: 78px;
      margin-top: 7px;
      height: 38px;
      color: var(--project-menu-logo-text, #fff);
      text-align: center;
      font-family: 'Source Sans 3';
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
  .sider-header-collapsed {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    overflow: visible;
    .sider-header-collapsed-img {
      display: block;
      width: 40px;
      height: auto;
      max-width: 100%;
      object-fit: contain;
      aspect-ratio: 55/34;
    }
  }

  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  background-color: var(--project-menu-bg, #1a3677);
  &[data-resizing='true'] {
    transition: none;
  }
  &:not(.ant-layout-sider-collapsed) {
    width: v-bind('asideWidthStyle') !important;
    max-width: v-bind('asideWidthStyle') !important;
    min-width: v-bind('asideWidthStyle') !important;
    // margin-top: 5px;
  }
  &.ant-layout-sider-collapsed .resizable-bar {
    width: 0;
  }

  /* 折叠：一级仅图标，行内水平+垂直居中；勿改 .ant-menu-title-content 的 display */
  &.ant-layout-sider-collapsed {
    :deep(ul.ant-menu-inline-collapsed.ant-menu-root) {
      text-align: center;
    }
    :deep(.ant-menu-inline-collapsed.ant-menu-root > .ant-menu-item),
    :deep(.ant-menu-inline-collapsed.ant-menu-root > .ant-menu-submenu > .ant-menu-submenu-title) {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    :deep(
      .ant-menu-inline-collapsed.ant-menu-root
        > .ant-menu-item
        .ant-menu-item-icon,
      .ant-menu-inline-collapsed.ant-menu-root
        > .ant-menu-submenu
        > .ant-menu-submenu-title
        .ant-menu-item-icon
    ) {
      position: static !important;
      margin: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    /* antd 会给 .anticon 内联 margin-left 做“居中”，与当前 :collapsedWidth 不一致时偏移，须清掉 */
    :deep(.ant-menu-inline-collapsed.ant-menu-root .ant-menu-item-icon .anticon),
    :deep(.ant-menu-inline-collapsed.ant-menu-root .ant-menu-item-icon span[role='img']),
    :deep(
      .ant-menu-inline-collapsed.ant-menu-root
        > .ant-menu-submenu
        > .ant-menu-submenu-title
        .ant-menu-item-icon
        .anticon
    ),
    :deep(
      .ant-menu-inline-collapsed.ant-menu-root
        > .ant-menu-submenu
        > .ant-menu-submenu-title
        .ant-menu-item-icon
        span[role='img']
    ) {
      margin: 0 !important;
      margin-left: 0 !important;
      margin-inline: 0 !important;
    }
    :deep(
      .ant-menu-inline-collapsed.ant-menu-root
        > .ant-menu-submenu
        > .ant-menu-submenu-title
        .ant-menu-submenu-arrow
    ) {
      display: none;
    }
  }
}

/* 侧栏：展开时图标+文字垂直对齐；折叠时不能用 inline-flex 盖标题区（与 antd inlineCollapsed 冲突） */
.sider-wrapper :deep(.ant-menu) {
  .ant-menu-item-icon {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 0;
  }
}

.sider-wrapper :deep(.ant-menu:not(.ant-menu-inline-collapsed)) {
  .ant-menu-item,
  .ant-menu-submenu-title {
    display: flex !important;
    align-items: center !important;
  }
  .ant-menu-title-content {
    display: inline-flex !important;
    align-items: center;
    line-height: normal;
  }
}

.resizable-bar {
  height: 100%;
  width: 5px;
  // background-color: rgba(150, 150, 150, 0.2);
  // opacity: 0.2;
  // transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ew-resize;
  .resizable-bar-icon {
    width: calc(100% - 2px);
    // width: 2px;
    opacity: 0;
    background-color: var(--ant-primary-color);
    // background-color: rgba(100, 100, 100, 0.2);
    // height: 100%;
    transition: all 0.2s ease-in-out;
    height: 5vw;
    min-height: 10px;
    max-height: 25px;
    border-radius: 2px;
  }
  &:hover {
    background-color: rgba(200, 200, 200, 0.3);

    .resizable-bar-icon {
      opacity: 1;
      // width: calc(100% - 4px);
      // background-color: rgba(100, 100, 100, 0.3);
    }
  }
  &[data-collapsed='true'] {
    width: 0;
  }
}
:deep(.ant-layout-header) {
  background-color: var(--project-header-bg, #fff) !important;
  color: var(--project-header-fg, #1f2937);
  flex: 0 0 auto;
}

:deep(.wei-page-tabs-component) {
  flex: 0 0 auto;
}

/* 主工作区占满右侧列剩余高度；由本区 overflow-y: auto 负责竖条，避免与 100vh 叠算成整页滚动 */
.layout-container {
  flex: 1 1 0%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}

/** 项目信息创建页：主内容区铺满白底，避免透出外层 #f3f2f7 灰边 */
.layout-container.layout-container--white {
  background-color: #fff;
}

/** 项目信息编辑页：高度交给内部，由表单区滚动，标签与底部按钮固定 */
.layout-container.layout-container--editor-fill {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.layout-router-host--fill {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-router-host--fill :deep(.route-page-wrapper) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ant-layout {
  background: #f3f2f7;
}

.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
  border: none!important;
}

/* 仅侧栏垂直菜单：底色与选中条随「菜单主题」变量（变量来自 .sider-column-wrap :style） */
.sider-wrapper {
  :deep(.ant-menu) {
    background-color: var(--project-menu-bg, #1a3677) !important;
    color: var(--project-menu-text, #e2ebff);
    padding: 0 6px;

    .ant-menu {
      padding-right: 0;
      background: transparent !important;
    }
    .ant-menu-item {
      padding-left: 16px !important;
    }
    .ant-menu-submenu-title {
      padding-left: 16px !important;
    }
    .ant-menu-submenu-arrow {
      color: var(--project-menu-arrow, #e2ebff);
    }
    .ant-menu-item-selected {
      background: var(--project-menu-bg-active) !important;
      /* 与未选中项同一套「默认」字色/图标色，不强制白字 */
      color: var(--project-menu-text, #e2ebff) !important;
      &::after {
        display: none;
      }
      a,
      span:not(.ant-menu-submenu-arrow) {
        color: var(--project-menu-text, #e2ebff) !important;
      }
      .ant-menu-item-icon,
      .anticon {
        color: var(--project-menu-text, #e2ebff) !important;
      }
      .anticon svg {
        fill: currentColor;
      }
      .ant-menu-submenu-arrow {
        color: var(--project-menu-arrow, #e2ebff);
      }
    }
    .ant-menu-inline {
      .ant-menu-submenu-title {
        padding-left: 24px !important;
      }
    }
    .ant-menu-submenu {
      .ant-menu-item {
        padding-left: 24px !important;
      }
    }
  }

  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover),
  :deep(.ant-menu-submenu-title:hover) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content span),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover a),
  :deep(.ant-menu-submenu-title:hover .ant-menu-title-content),
  :deep(.ant-menu-submenu-title:hover .ant-menu-title-content span),
  :deep(.ant-menu-submenu-title:hover a) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }

  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-item-icon),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon),
  :deep(.ant-menu-submenu-title:hover .ant-menu-item-icon),
  :deep(.ant-menu-submenu-title:hover .anticon) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon svg),
  :deep(.ant-menu-submenu-title:hover .anticon svg) {
    fill: currentColor;
  }

  /** 选中行背景已是主色时，悬停仍用默认字色以免与主色字重叠 */
  :deep(.ant-menu-item-selected:hover),
  :deep(.ant-menu-item-selected:hover .ant-menu-item-icon),
  :deep(.ant-menu-item-selected:hover .anticon),
  :deep(.ant-menu-item-selected:hover .ant-menu-title-content),
  :deep(.ant-menu-item-selected:hover .ant-menu-title-content span),
  :deep(.ant-menu-item-selected:hover a) {
    color: var(--project-menu-text, #fff) !important;
  }

  :deep(.ant-menu-submenu-selected) {
    color: var(--project-menu-submenu-selected, #fff) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
    color: var(--project-menu-submenu-selected, #fff) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-item-icon),
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .anticon) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-title-content),
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-title-content span) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-selected .ant-menu-item-icon),
  :deep(.ant-menu-submenu-selected .anticon),
  :deep(.ant-menu-submenu-selected .ant-menu-title-content) {
    color: var(--project-menu-submenu-selected, #fff) !important;
  }
  :deep(.ant-menu-submenu-selected .anticon svg) {
    fill: currentColor;
  }
  :deep(.ant-menu-submenu-selected .ant-menu-submenu-arrow) {
    color: var(--project-menu-submenu-arrow-sel, rgba(255, 255, 255, 0.88)) !important;
  }
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title) {
    color: var(--project-menu-text, #e2ebff) !important;
  }
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover .ant-menu-item-icon),
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover .anticon) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover .anticon svg) {
    fill: currentColor;
  }
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover .ant-menu-title-content),
  :deep(.ant-menu-submenu-active > .ant-menu-submenu-title:hover .ant-menu-title-content span) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
}

/* 浅色侧栏：覆盖 Ant 默认把链接/图标设为主色（悬停、展开、active） */
.sider-column-wrap.project-ui-menu-light .sider-wrapper {
  :deep(.ant-menu a),
  :deep(.ant-menu-item-active a) {
    color: var(--project-menu-text) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover a),
  :deep(.ant-menu-submenu-title:hover a) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content span),
  :deep(.ant-menu-submenu-title:hover .ant-menu-title-content),
  :deep(.ant-menu-submenu-title:hover .ant-menu-title-content span) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title),
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-title-content) {
    color: var(--project-menu-text) !important;
  }
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow) {
    color: var(--project-menu-arrow) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-item-icon),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon),
  :deep(.ant-menu-submenu-title:hover .ant-menu-item-icon),
  :deep(.ant-menu-submenu-title:hover .anticon) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-item-icon),
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title .anticon),
  :deep(.ant-menu-submenu-selected .ant-menu-item-icon),
  :deep(.ant-menu-submenu-selected .anticon) {
    color: var(--project-menu-text) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .anticon),
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-item-icon) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-title-content),
  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title:hover .ant-menu-title-content span) {
    color: var(--project-menu-hover, var(--project-system-primary, var(--ant-primary-color))) !important;
  }
  :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon svg),
  :deep(.ant-menu-submenu-title:hover .anticon svg),
  :deep(.ant-menu-submenu-open > .ant-menu-submenu-title .anticon svg),
  :deep(.ant-menu-submenu-selected .anticon svg) {
    fill: currentColor;
  }
}

.sider-footer-collapse {
  border-top-color: var(--project-menu-footer-border, rgba(255, 255, 255, 0.1));
}
.sider-collapse-bottom-btn {
  color: var(--project-menu-collapse-btn, #fff) !important;
}

// :deep(.anticon) {
//     margin-left: 53px !important;
//   }
</style>
