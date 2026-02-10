<script lang="ts" setup>
import { WeiI18n } from './utils/WeiI18n';
import { useWeiUpdateChecker } from './hooks/useWeiUpdateChecker';
import useRouteCache from '@/hooks/useRouteCache';
import { useUserStore } from '@/store/modules/user';
import { detectDevice } from '@/utils/tools';

const { collectCaches } = useRouteCache();
collectCaches();

const { start } = useWeiUpdateChecker();
start();

function parseTime(date: Date) {
  return date.toLocaleString().split(' ')[0];
}

const userStore = useUserStore();

onMounted(() => {
  detectDevice();
});
</script>

<template>
  <!-- 左右标识 -->
  <!-- :direction="state.direction" -->
  <a-config-provider :locale="WeiI18n.antdvLocale">
    <div>
      <router-view />
    </div>
  </a-config-provider>
</template>

<style lang="less" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
