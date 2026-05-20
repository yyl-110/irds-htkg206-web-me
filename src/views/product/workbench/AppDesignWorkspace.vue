<script setup lang="ts">
/**
 * 独立应用设计工作台薄壳：委托既有流程页，后续可在容器内接入 useStandaloneDesignApi 并逐步下沉请求。
 */
import ProcessFlowAppWorkspace from '@/views/product/designTaskApplication/components/components/process-flow-app-workspace.vue'
</script>

<template>
  <ProcessFlowAppWorkspace />
</template>
