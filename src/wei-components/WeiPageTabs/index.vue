<script setup lang="ts">
// 参考自: https://github.com/xiaocheng555/vue-tabs-cache/tree/master/vue3

import { onMounted, ref, watch } from 'vue';
import type { RouteLocationMatched, RouteLocationNormalizedLoaded } from 'vue-router';
import { useRoute } from 'vue-router';
import { MoreOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import type { Tabs } from 'ant-design-vue';
import Sortable, { type SortableEvent } from 'sortablejs';
import WeiPageTabsMenu from './components/WeiPageTabsMenu.vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { useWeiTab } from '@/hooks/useWeiTab';

const props = defineProps({
  // 【根据项目修改】tab页面在路由的第几层，或者说第几层的 router-view 组件（当前项目为第二层）
  tabRouteViewDepth: {
    type: Number,
  },
  // tab页面的key值，从route对象中取，一个key值对应一个tab页面
  // 默认为route.name值（不要设为route.path，因为route.path为'/detail/:id'时会造成一个路由对应多个tab页），可以自己设置 route.meta.tabKey
  getTabKey: {
    type: Function,
    default: (routeMatch: RouteLocationMatched, _route: RouteLocationNormalizedLoaded) => {
      return routeMatch.path;
    },
  },
  // tab页签的标题，默认从路由meta.title中获取
  tabTitleKey: {
    type: String,
    default: 'title',
  },
});

const route = useRoute();

const {
  tabs,
  curTabKey,
  currentTab,
  changeCurTab,
  clickTab,
  onClickMenu,
  removeTab,
  // gotoTab,
  // refreshTab,
  // refreshPage,
  refreshCurrentTab,
  // closeOtherTabs,
  // closeLeftOrRightTabs,
  // closeLayoutTab,
  // setCurTabTitle,
} = useWeiTab(props.tabRouteViewDepth, props.getTabKey as any, props.tabTitleKey);

// 对外提供的事件：关闭弹窗；设置tab标题
// EventBus.on('LayoutTabs:closeTab', (tabKey) => {
//   closeLayoutTab(tabKey)
// })
// EventBus.on('LayoutTabs:setTabTitle', (title) => {
//   setCurTabTitle(title)
// })

const tabsRef = ref<InstanceType<typeof Tabs>>();

onMounted(() => {
  if (!tabsRef.value) throw new Error('Missing tabs component');
  const tabsWrapperElement = tabsRef.value.$el.querySelector('.ant-tabs-nav-wrap .ant-tabs-nav-list');
  Sortable.create(tabsWrapperElement, {
    onEnd(event: SortableEvent) {
      const newIndex = event.newIndex;
      const oldIndex = event.oldIndex;
      if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return;
      // 拖拽排序后更新 tabs 中的顺序
      // [tabs.value[newIndex], tabs.value[oldIndex]] = [tabs.value[oldIndex], tabs.value[newIndex]]
      const target = tabs.value.splice(oldIndex, 1)[0];
      tabs.value.splice(newIndex < oldIndex ? newIndex : newIndex + 1, 0, target);
    },
  });
});

watch(() => route.path, changeCurTab, {
  immediate: true,
});
</script>

<template>
  <div class="wei-page-tabs-component mx-1">
    <a-tabs
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
:deep(.ant-tabs-content-holder) {
  display: none;
}

:deep(.ant-tabs-nav) {
  top: 2px;
  margin-bottom: 0 !important;
}

:deep(.ant-tabs-nav-list) {
  margin-top: 8px;
  margin-bottom: 5px;
}

:deep(.ant-tabs-tab) {
  padding: 3px 10px !important;
  font-size: 12px;
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
</style>
