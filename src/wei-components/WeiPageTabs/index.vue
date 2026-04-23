<script setup lang="ts">
// 参考自: https://github.com/xiaocheng555/vue-tabs-cache/tree/master/vue3

import { CloseOutlined, MoreOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import type { RouteLocationMatched, RouteLocationNormalizedLoaded } from 'vue-router';
import { useRoute } from 'vue-router';
import type { Tabs } from 'ant-design-vue';
import Sortable, { type SortableEvent } from 'sortablejs';
import WeiPageTabsMenu from './components/WeiPageTabsMenu.vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { useWeiTab } from '@/hooks/useWeiTab';
import { WeiIcon } from '@/wei-components';

const props = withDefaults(
  defineProps<{
    tabRouteViewDepth?: number;
    getTabKey?: (routeMatch: RouteLocationMatched, _route: RouteLocationNormalizedLoaded) => string;
    tabTitleKey?: string;
    /** 卡片：editable-card；简约：line */
    tabStyle?: 'card' | 'line';
  }>(),
  {
    tabTitleKey: 'title',
    tabStyle: 'card',
    getTabKey: (routeMatch: RouteLocationMatched, _route: RouteLocationNormalizedLoaded) => routeMatch.path,
  },
);

const route = useRoute();
const router = useRouter();

const {
  tabs,
  curTabKey,
  currentTab,
  changeCurTab,
  clickTab,
  onClickMenu,
  removeTab,
  refreshCurrentTab,
} = useWeiTab(props.tabRouteViewDepth, props.getTabKey as any, props.tabTitleKey);

const tabsRef = ref<InstanceType<typeof Tabs>>();
let tabsSortable: ReturnType<typeof Sortable.create> | null = null;

function bindSortable() {
  nextTick(() => {
    tabsSortable?.destroy();
    tabsSortable = null;
    const inst = tabsRef.value;
    if (!inst) return;
    const tabsWrapperElement = inst.$el?.querySelector?.('.ant-tabs-nav-wrap .ant-tabs-nav-list');
    if (!tabsWrapperElement) return;
    tabsSortable = Sortable.create(tabsWrapperElement, {
      onEnd(event: SortableEvent) {
        const newIndex = event.newIndex;
        const oldIndex = event.oldIndex;
        if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return;
        const target = tabs.value.splice(oldIndex, 1)[0];
        tabs.value.splice(newIndex < oldIndex ? newIndex : newIndex + 1, 0, target);
      },
    });
  });
}

onMounted(bindSortable);
watch(() => props.tabStyle, bindSortable);

watch(() => route.path, changeCurTab, {
  immediate: true,
});

const goHome = () => {
  router.push({ path: '/' });
};

function onLineTabClose(e: MouseEvent, tabKey: string) {
  e.stopPropagation();
  removeTab(tabKey);
}
</script>

<template>
  <div
    class="wei-page-tabs-component bg-white"
    :class="{ 'wei-page-tabs-component--line': props.tabStyle === 'line' }">
    <a-tabs
      v-if="props.tabStyle === 'card'"
      ref="tabsRef"
      v-model:active-key="curTabKey"
      class="mb-0"
      type="editable-card"
      size="small"
      :animated="false"
      :hide-add="true"
      :tab-bar-gutter="5"
      @tab-click="clickTab"
      @edit="removeTab">
      <a-tab-pane v-for="item in tabs" :key="item.tabKey" class="py-3">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <div class="h-full" style="display: inline-block; width: calc(100% - 24px)">
              <span>{{ WeiI18n.getRouteTitle(item.title).value }}</span>
            </div>
            <template #overlay>
              <WeiPageTabsMenu :tabs="tabs" :tab="item" :current-tab-key="curTabKey" @click-menu="onClickMenu" />
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>

      <template #leftExtra>
        <div class="px-[7px] bg-white h-full homeBtn" @click="goHome">
          <WeiIcon :size="14" icon="svg-icon:tag" />
        </div>
      </template>
      <template #rightExtra>
        <div class="extra-button-group">
          <a-button class="w-[30px] h-[30px] p-0" @click="refreshCurrentTab">
            <ReloadOutlined />
          </a-button>
          <a-dropdown :trigger="['click']">
            <a-button class="w-[30px] h-[30px] p-0">
              <MoreOutlined />
            </a-button>
            <template #overlay>
              <WeiPageTabsMenu :tabs="tabs" :tab="currentTab" :current-tab-key="curTabKey" @click-menu="onClickMenu" />
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-tabs>

    <a-tabs
      v-else
      ref="tabsRef"
      v-model:active-key="curTabKey"
      class="mb-0 wei-page-tabs-line"
      type="line"
      size="small"
      :animated="false"
      :tab-bar-gutter="12"
      @tab-click="clickTab">
      <a-tab-pane v-for="item in tabs" :key="item.tabKey" class="py-3">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <span class="inline-flex items-center gap-1">
              <span>{{ WeiI18n.getRouteTitle(item.title).value }}</span>
              <CloseOutlined
                v-if="tabs.length > 1"
                class="line-tab-close"
                @click.stop="onLineTabClose($event, item.tabKey)" />
            </span>
            <template #overlay>
              <WeiPageTabsMenu :tabs="tabs" :tab="item" :current-tab-key="curTabKey" @click-menu="onClickMenu" />
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>

      <template #leftExtra>
        <div class="px-[7px] bg-white h-full homeBtn" @click="goHome">
          <WeiIcon :size="14" icon="svg-icon:tag" />
        </div>
      </template>
      <template #rightExtra>
        <div class="extra-button-group">
          <a-button class="w-[30px] h-[30px] p-0" @click="refreshCurrentTab">
            <ReloadOutlined />
          </a-button>
          <a-dropdown :trigger="['click']">
            <a-button class="w-[30px] h-[30px] p-0">
              <MoreOutlined />
            </a-button>
            <template #overlay>
              <WeiPageTabsMenu :tabs="tabs" :tab="currentTab" :current-tab-key="curTabKey" @click-menu="onClickMenu" />
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<style lang="less" scoped>
.wei-page-tabs-component {
  border-top: 1px solid #e7eaee;
}
:deep(.ant-tabs-content-holder) {
  display: none;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
}

:deep(.ant-tabs-tab) {
  padding: 4px 8px !important;
  font-size: 12px;
  border: none;
  border-right: 1px solid #e7eaee;
  background: #fff;
  margin: 0 !important;
  border-radius: 0 !important;
}
:deep(.ant-tabs-tab-active) {
  background: #f3f2f7 !important;
  border-bottom: none !important;
  /** 与「系统主题」一致（common.less 会钉死 --ant-primary-color） */
  .ant-tabs-tab-btn {
    color: var(--project-system-primary, var(--ant-primary-color)) !important;
  }
  .ant-tabs-tab-remove {
    color: var(--project-system-primary, var(--ant-primary-color));
  }
}
.homeBtn {
  cursor: pointer;
}

.layout-tabs {
  position: relative;
}

.close-tabs {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  cursor: pointer;
  color: #999;
}

.wei-page-tabs-component--line {
  :deep(.ant-tabs-tab) {
    border-right: none;
    border-radius: 4px 4px 0 0 !important;
  }
  :deep(.ant-tabs-ink-bar) {
    background: var(--project-system-primary, var(--ant-primary-color));
  }
  :deep(.ant-tabs-tab-active) {
    background: #fff !important;
    border-bottom: 2px solid var(--project-system-primary, var(--ant-primary-color)) !important;
  }
}
.line-tab-close {
  font-size: 10px;
  color: #9ca3af;
}
.line-tab-close:hover {
  color: var(--project-system-primary, var(--ant-primary-color));
}
</style>
