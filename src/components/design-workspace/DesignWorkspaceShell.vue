<script lang="ts" setup>
/**
 * 设计工作台通用壳：左 / 中 / 右三栏 + loading，无业务请求。
 * WBS / 独立应用 / 计算各自页面在此壳内填 slot。
 */
defineProps<{
  title?: string
  loading?: boolean
}>()
</script>

<template>
  <div class="design-workspace-shell">
    <a-spin :spinning="loading">
      <header v-if="title || $slots.header" class="design-workspace-shell__header">
        <slot name="header">
          <span class="design-workspace-shell__title">{{ title }}</span>
        </slot>
      </header>
      <div class="design-workspace-shell__grid">
        <aside class="design-workspace-shell__col design-workspace-shell__col--left">
          <slot name="left" />
        </aside>
        <main class="design-workspace-shell__col design-workspace-shell__col--center">
          <slot name="center" />
        </main>
        <aside class="design-workspace-shell__col design-workspace-shell__col--right">
          <slot name="right" />
        </aside>
      </div>
    </a-spin>
  </div>
</template>

<style lang="less" scoped>
.design-workspace-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: #f5f5f5;
}

.design-workspace-shell__header {
  flex-shrink: 0;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.design-workspace-shell__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.design-workspace-shell__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(200px, 240px) 1fr minmax(240px, 300px);
  gap: 1px;
  background: #e8e8e8;
}

.design-workspace-shell__col {
  min-height: 0;
  min-width: 0;
  background: #fff;
  overflow: auto;
}

.design-workspace-shell__col--center {
  padding: 12px 16px;
}

.design-workspace-shell__col--left,
.design-workspace-shell__col--right {
  padding: 12px;
}

:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
