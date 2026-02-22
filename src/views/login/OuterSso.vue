<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';
import { OuterSSOLoginParams } from './types';
import { decryptValue, encryptValue } from '@/utils';
import { setToken } from '@/utils/auth';
import type { TokenType } from '@/api/login/types';
import { updateUserData } from '@/router/state';
import { router } from '@/router';
import { useLayoutStore } from '@/store/modules/layout/layout';
import dayjs from 'dayjs';
// 导入inject
// 注入刷新事件,这里括号中的参数要对应上前面provide中的第一个参数
const goRefresh = inject('reload');
const { push } = useRouter();
const layoutStore = useLayoutStore();
/** 页面权限常量判断  */
enum SystemType {
  system = 'system',
  outEpc = 'outEpc',
  other = 'other',
}

onMounted(() => {
  alert('1236');
  window.addEventListener('message', async event => {
    alert('123');
    console.log(event, '父组件传的值');
    let resToken: any = localStorage.getItem('access_token');
    console.log(resToken, 'resToken');
    if (resToken) {
      await setToken(resToken);
      localStorage.setItem('Login-method', 'INT');
      layoutStore.setSystemType(SystemType.system);
    }
    await updateUserData(router, true);
    push({ path: '/home/workbench' });
  });
});
const handleMessage = (event: any) => {
  console.log(event, '父组件传的值-');
};
onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<template>
  <main class="w-full h-full flex justify-center align-middle p-4">
    <div class="example">
      <a-spin class="spin" />
      <h1 class="spin" style="margin-left: 10px">{{ '加载数智研发系统中...' }}</h1>
    </div>
  </main>
</template>
<style lang="less" scoped>
.example {
  top: 40%;
  height: 500px;
  text-align: center;
  z-index: 1005;
  .spin {
    position: relative;
    top: 40%;
  }
}
</style>
