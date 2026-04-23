<script lang="ts" setup>
import type { RouteRecordNormalized } from 'vue-router';
// import { WeiOverflowTooltip } from 'wei-ui-vue'
import WeiLayoutSiderMenuItem from '../WeiLayoutSiderMenuItem/index.vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { WeiIcon } from '@/wei-components';

interface ComponentProps {
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
      <div class="inline-flex w-5 flex-shrink-0 items-center justify-center self-center">
        <WeiIcon :size="20" :icon="route.meta?.icon" />
      </div>
    </template>
    <template #title>
      <span style="font-weight: 600">{{ label }}</span>
    </template>

    <template v-for="(item, key) in route.children" :key="key">
      <wei-layout-sider-sub-menu v-if="item.children && item.children.some(subItem => !subItem.meta?.hidden)" :route="item" />
      <WeiLayoutSiderMenuItem v-else :route="item" />
    </template>
  </a-sub-menu>
</template>
