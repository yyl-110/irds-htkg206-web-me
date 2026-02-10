<script lang="ts" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import type { Ref, VNode } from 'vue';
import { computed, h, ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import type { LayoutSider } from 'ant-design-vue';
import { get } from 'lodash-es';
import useRouteCache from '@/hooks/useRouteCache';
import WeiPageTabs from '@/wei-components/WeiPageTabs/index.vue';
import MainHeader from '@/components/menuHeader/Header.vue';
import WeiLayoutMenuSider from '@/wei-components/WeiLayoutSiderMenu/index.vue';
import { useLayoutStore } from '@/store/modules/layout/layout';
import { useUserStore } from '@/store/modules/user';
import { formatDate } from '@/utils/tools';
import { notification } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const layoutStore = useLayoutStore();
const collapsed: Ref<boolean> = ref(false);
const { caches } = useRouteCache();

const userStore = useUserStore();
/** 菜单栏是否显示在顶部(默认显示在左侧) */
const menuPosition: 'top' | 'left' = import.meta.env.VITE_APP_MENU_POSITION || 'left';

const route = useRoute();
const $router = useRouter();
/** 当前页面是否显示 footer bar */
// const showFooterBar = computed(() => pageFooterUrls.value.includes(route.fullPath));
const showFooterBar = computed(() => false);
const { getTabNameByFullPath, wrapperMap } = useRouteCache();

/** 高级搜索 弹窗状态 */
const visible = computed(() => {
  return layoutStore.advancedDrawerVisible;
});

/** 不展示左侧菜单的页面路由 */
const homeList = ref(['/home-main/HomeMain', '/home-main/components/replaceRelationship/index', '/business/information-views/index']);

watch(
  () => $router.currentRoute.value.path,
  (newPath, oldPath) => {
    let type = <boolean>false;
    if (homeList.value.includes(newPath)) {
      type = true;
    }
    layoutStore.setIsHomepage(type);
    if ('/home-main/HomeMain'.includes(newPath)) {
      layoutStore.setHomeType('home');
    }
  },
  { immediate: true }
);

/**
 * 为路由页面组件包裹一层可以自定义 name 的组件用于修改 keep-alive 缓存的组件 name
 * @see 实现方式参考自 https://github.com/vuejs/core/pull/4339#issuecomment-1238984279
 * @param component vue-router slot 的 component 参数
 * @param route vue-router 的 route 参数
 */
function wrap(component: VNode, route: RouteLocationNormalizedLoaded) {
  let wrapperComponent;
  const wrapperComponentName = getTabNameByFullPath(route);
  if (wrapperMap[wrapperComponentName]) {
    const _component = wrapperMap[wrapperComponentName];
    if (!_component) throw new Error('Missing Route Wrapper Component');
    wrapperComponent = _component;
  } else {
    wrapperComponent = {
      name: wrapperComponentName,
      render() {
        return h('div', { className: 'route-page-wrapper' }, component);
      },
    };
    wrapperMap[wrapperComponentName] = wrapperComponent;
  }
  return h(wrapperComponent);
}

/** 左侧 aside 默认宽度 */
const ASIDE_DEFAULT_WIDTH = 240;
/** 左侧 aside 最小宽度 */
const ASIDE_MIN_WIDTH = 240;
/** 左侧 aside 最大宽度 */
const ASIDE_MAX_WIDTH = 800;
/** localStorage 存储的 Key */
const ASIDE_WIDTH_STORAGE_KEY = 'asideWidth';

const asideRef = ref<InstanceType<typeof LayoutSider>>();
/** 左侧 aside 宽度 */
const _asideWidth = ref(Number(localStorage.getItem(ASIDE_WIDTH_STORAGE_KEY)) || ASIDE_DEFAULT_WIDTH);
/** 左侧 aside 宽度 */
const asideWidth = computed({
  get() {
    return _asideWidth.value;
  },
  set(width: number) {
    _asideWidth.value = width;
    localStorage.setItem(ASIDE_WIDTH_STORAGE_KEY, width.toString());
  },
});
const asideWidthStyle = computed(() => `${asideWidth.value}px`);
layoutStore.setAsideWidthStyle(asideWidthStyle.value);
const asideResizing = ref(false);
/**
 * mouse down event function
 * @param event
 */
function handleMouseDown(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  event.stopPropagation();

  asideResizing.value = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchend', handleMouseUp);
}
/**
 * mouse move event function
 * @param event
 */
function handleMouseMove(event: MouseEvent | TouchEvent) {
  const clientX = get(event, 'clientX') || get(event, ['touches', 0, 'clientX']);
  let newWidth = clientX - asideRef.value?.$el?.getBoundingClientRect().left;
  if (newWidth < ASIDE_MIN_WIDTH) newWidth = ASIDE_MIN_WIDTH;
  if (newWidth > ASIDE_MAX_WIDTH) newWidth = ASIDE_MAX_WIDTH;
  if (asideRef.value) asideWidth.value = newWidth;
}
/**
 * mouse up event function
 */
function handleMouseUp() {
  asideResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('touchmove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('touchend', handleMouseUp);
}

const loading = ref<boolean>(true);

function parseTime(date: Date) {
  return date.toLocaleString().split(' ')[0];
}
const timer = ref<any>(null);

onMounted(() => {
  // 加载默认语言
  if (!localStorage.getItem('wei-language')) {
    localStorage.setItem('wei-language', navigator.language.replace(/-/g, '_') || WeiI18n.DEFAULT_LANGUAGE);
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

onBeforeMount(() => {
  loading.value = true;
});
</script>

<template>
  <a-spin :spinning="loading" tip="加载中...">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="collapsed-header bg-layout-header">
        <MainHeader>
          <WeiLayoutMenuSider v-if="menuPosition === 'top'" mode="horizontal" :collapsed="true" style="background-color: blue" />
        </MainHeader>
      </a-layout-header>
      <a-layout class="mt-[57px]" style="height: calc(100vh - 64px)">
        <a-layout-sider ref="asideRef" v-model:collapsed="collapsed" :trigger="null" class="sider-wrapper p-0 overflow-y-auto" :data-resizing="asideResizing" collapsible>
          <aside style="height: calc(100% - 40px)" class="overflow-y-auto overflow-x-hidden wei-scrollbar wei-scrollbar-hover">
            <WeiLayoutMenuSider :collapsed="true" />
          </aside>
          <footer class="h-[50px] flex justify-center items-center" style="background-color: rgb(var(--color-bg-layout-header))">
            <a-button type="text" size="small" @click="collapsed = !collapsed">
              <MenuFoldOutlined v-if="collapsed" class="text-base" />
              <MenuUnfoldOutlined v-else class="text-base" />
            </a-button>
          </footer>
        </a-layout-sider>
        <div v-if="menuPosition === 'left' && !layoutStore.homepage" class="resizable-bar" :data-collapsed="collapsed" @mousedown="handleMouseDown" @touchstart="handleMouseDown">
          <div class="resizable-bar-icon" />
        </div>
        <a-layout>
          <!-- 页面标签栏 -->
          <WeiPageTabs v-if="!layoutStore.homepage" />
          <!-- 页面容器 -->
          <a-layout-content v-overlay-scrollbar :class="!layoutStore.homepage ? 'p-[5px] pt-[10px] overflow-y-hidden' : ''">
            <pre style="display: none">{{ caches }}</pre>
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="caches">
                <component :is="wrap(Component, route)" />
              </keep-alive>
            </router-view>
          </a-layout-content>

          <!-- 页脚栏, 一般用于显示操作按钮 -->
          <a-layout-footer
            v-show="showFooterBar"
            id="page-layout-footer"
            :data-show="showFooterBar"
            class="bg-layout-header pt-[10px] pb-[10px] pl-[20px] pr-[20px]"
            style="box-shadow: var(--wei-page-layout-footer-box-shadow); z-index: 20" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<style lang="less" scoped>
.collapsed-header {
  width: 100%;
  padding: 0;
  position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  // padding-left: 50px;
}
.sider-wrapper {
  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
  }

  background-color: rgb(var(--color-bg-layout-header));
  &[data-resizing='true'] {
    transition: none;
  }
  &:not(.ant-layout-sider-collapsed) {
    width: v-bind('asideWidthStyle') !important;
    max-width: v-bind('asideWidthStyle') !important;
    min-width: v-bind('asideWidthStyle') !important;
    margin-top: 5px;
  }
  &.ant-layout-sider-collapsed .resizable-bar {
    width: 0;
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
    opacity: 0.3;
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
  background-color: rgb(var(--color-bg-layout-header-blue)) !important;
}
</style>
