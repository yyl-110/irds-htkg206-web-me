<script lang="ts" setup>
import type { RouteRecordNormalized } from 'vue-router';
// import { WeiOverflowTooltip } from 'wei-ui-vue'
import WeiLayoutSiderMenuItem from '../WeiLayoutSiderMenuItem/index.vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { WeiIcon } from '@/wei-components';

interface ComponentProps {
  collapsed: boolean;
  route: RouteRecordNormalized;
}

defineOptions({
  name: 'WeiLayoutSiderSubMenu',
});
const props = defineProps<ComponentProps>();
const label = WeiI18n.getRouteTitle(props.route.meta);
</script>

<template>
  <a-sub-menu :key="route.path">
    <template #icon>
      <div class="inline-block w-[16px]">
        <WeiIcon :size="16" :icon="route.meta?.icon" />
      </div>
    </template>
    <template #title>
      <span v-if="collapsed" style="font-weight: 600">{{ label }}</span>
      <!-- <WeiOverflowTooltip v-else :title="label" placement="right" /> -->
    </template>

    <template v-for="(item, key) in route.children" :key="key">
      <wei-layout-sider-sub-menu v-if="item.children && item.children.some(subItem => !subItem.meta?.hidden)" :collapsed="collapsed" :route="item" />
      <WeiLayoutSiderMenuItem v-else :collapsed="collapsed" :route="item" />
    </template>
  </a-sub-menu>
</template>
