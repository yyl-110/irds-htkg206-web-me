<template>
  <div class="w-full h-full createProduct">
    <header>
      <div class="flex items-center">
        <LeftOutlined :style="{ fontSize: '24px', color: '#555D6D' }" />
        <span class="text-[20px] font-bold ml-[8px]">创建项目</span>
      </div>
      <a-tabs v-model:active-key="activeKey" class="mt-[8px]">
        <a-tab-pane tab="基础信息" key="1" />
        <a-tab-pane tab="结构团队" key="2" />
      </a-tabs>
    </header>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined } from "@ant-design/icons-vue";

const activeKey = ref("1");
</script>

<style lang="scss" scoped>
.createProduct {
  header {
    display: flex;
    padding: 16px 20px 0 20px;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      var(#e5efff, rgba(229, 239, 255, 0.7)) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
  }
}
</style>