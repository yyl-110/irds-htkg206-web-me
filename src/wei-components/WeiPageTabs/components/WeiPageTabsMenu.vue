<script lang="ts" setup name="WeiPageTabsMenu">
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface';
import { ClearOutlined, CloseOutlined, DoubleLeftOutlined, DoubleRightOutlined, MinusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import type { WeiPageTabItem, WeiPageTabMenus } from '../typings';

export interface WeiPageTabMenuComponentProps {
  /** 所有标签页 */
  tabs: Array<WeiPageTabItem>;
  /** 当前标签页 */
  tab: WeiPageTabItem;
  /** 当前页面标签页 key */
  currentTabKey: string;
}

interface ComponentEmits {
  /**
   * 点击菜单项
   * @param event
   * @param key 菜单项 key
   */
  (event: 'clickMenu', key: WeiPageTabMenus, tab: WeiPageTabMenuComponentProps['tab']): void;
}

const props = defineProps<WeiPageTabMenuComponentProps>();
const emit = defineEmits<ComponentEmits>();

const handleMenuClick: MenuClickEventHandler = event => {
  const key = event.key as WeiPageTabMenus;
  emit('clickMenu', key, props.tab);
};
</script>

<template>
  <a-menu @click="handleMenuClick">
    <!-- <template v-for="(menu, key) in WeiPageTabMenusMap" :key="key">
      <div>
        <a-menu-item :disabled="menu.disabled(currentTabKey, tabs, tab)" :key="key">
          <component :is="menu.icon" class="ml-[6px] mr-[5px]"></component>
          <span class="mr-[6px]">{{ menu.label }}</span>
        </a-menu-item>
      </div>
      <a-menu-divider v-if="menu.hasDivider"></a-menu-divider>
    </template> -->
    <a-menu-item key="refresh" :disabled="!!tab && tab.tabKey !== currentTabKey">
      <ReloadOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('重新加载') }}</span>
    </a-menu-item>
    <a-menu-item key="close" :disabled="tabs.length <= 1">
      <CloseOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('关闭标签页') }}</span>
    </a-menu-item>
    <a-menu-divider />
    <a-menu-item key="closeLeft" :disabled="tabs[0].tabKey === (tab ? tab.tabKey : currentTabKey)">
      <DoubleLeftOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('关闭左侧标签页') }}</span>
    </a-menu-item>
    <a-menu-item key="closeRight" :disabled="tabs[tabs.length - 1].tabKey === (tab ? tab.tabKey : currentTabKey)">
      <DoubleRightOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('关闭右侧标签页') }}</span>
    </a-menu-item>
    <a-menu-divider />
    <a-menu-item key="closeOther" :disabled="tabs.length <= 1">
      <MinusOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('关闭其他标签页') }}</span>
    </a-menu-item>
    <!-- <a-menu-item key="closeAll" :disabled="tabs.length <= 1">
      <ClearOutlined class="ml-[6px] mr-[5px]" />
      <span class="mr-[6px]">{{ $t('关闭全部标签页') }}</span>
    </a-menu-item> -->
  </a-menu>
</template>
