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
      <div class="inline-block w-[16px]" style="margin-top: -4px">
        <WeiIcon :size="16" :icon="route.meta?.icon" />
        <!-- <a-icon :size="16" :icon="assets / icon / clo.png" /> -->
      </div>
    </template>
    <span v-if="collapsed" style="font-weight: 600">{{ label }}</span>
    <!-- <WeiOverflowTooltip v-else :title="label" placement="right" /> -->
  </a-menu-item>
</template>
