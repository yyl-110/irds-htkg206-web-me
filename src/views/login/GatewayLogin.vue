<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { message } from 'ant-design-vue';
import { setToken } from '@/utils/auth';
import type { TokenType } from '@/api/login/types';
import { updateUserData, HOME_PAGE_ROUTE_NAME } from '@/router/state';
import { router } from '@/router';
import { useLayoutStore } from '@/store/modules/layout/layout';

const route = useRoute();
const { push } = useRouter();
const layoutStore = useLayoutStore();
const loadingText = ref('正在进入系统工作台…');

function parseLegacyCasicToken(raw: string): Partial<TokenType> | null {
  try {
    const parsed = JSON.parse(raw);
    const data = parsed?.data ?? parsed;
    if (data?.accessToken) {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        expiresTime: data.expiresTime,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function resolveTokenFromQuery(): Partial<TokenType> | null {
  const accessToken = route.query.accessToken as string | undefined;
  const refreshToken = route.query.refreshToken as string | undefined;
  const userId = route.query.userId as string | undefined;
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken, userId: userId ? Number(userId) : undefined };
  }
  const casic = route.query.CASICTOKEN as string | undefined;
  if (casic) {
    return parseLegacyCasicToken(decodeURIComponent(casic));
  }
  return null;
}

async function enterWorkbench() {
  const token = resolveTokenFromQuery();
  if (!token?.accessToken || !token?.refreshToken) {
    message.error('未获取到有效登录令牌，请从 Key 网关重新访问');
    loadingText.value = '登录令牌无效';
    return;
  }
  setToken(token as TokenType);
  localStorage.setItem('Login-method', 'GATEWAY');
  Cookies.set('IsUpdatePassCheck', '0');
  layoutStore.setIsHomepage(true);
  layoutStore.setSystemType('system');
  await updateUserData(router, true);
  const state = (route.query.state as string) || HOME_PAGE_ROUTE_NAME;
  const targetPath = state.startsWith('/') ? state : `/${state}`;
  if (window.opener) {
    push({ path: targetPath });
    return;
  }
  push({ path: targetPath });
}

onMounted(() => {
  void enterWorkbench();
});
</script>

<template>
  <main class="gateway-login-page">
    <a-spin size="large" />
    <p class="tip">{{ loadingText }}</p>
  </main>
</template>

<style lang="less" scoped>
.gateway-login-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  .tip {
    color: #666;
    font-size: 16px;
  }
}
</style>
