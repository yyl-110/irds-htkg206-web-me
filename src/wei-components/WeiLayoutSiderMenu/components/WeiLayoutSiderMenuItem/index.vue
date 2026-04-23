<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router';
// import { WeiOverflowTooltip } from 'wei-ui-vue'
import { WeiI18n } from '@/utils/WeiI18n';
import { WeiIcon } from '@/wei-components';

interface ComponentProps {
  collapsed: boolean;
  route: RouteRecordRaw;
}
defineOptions({ name: 'WeiLayoutSiderMenuItem' });
const props = defineProps<ComponentProps>();
const label = WeiI18n.getRouteTitle(props.route.meta);
</script>

<template>
  <a-menu-item :key="route.path">
    <template #icon>
      <div :class="collapsed ? 'inline-block w-[16px]' : 'flex justify-center'">
        <WeiIcon :size="20" :icon="route.meta?.icon" />
      </div>
    </template>
    <span v-if="collapsed" style="font-weight: 600">{{ label }}</span>
  </a-menu-item>
</template>
