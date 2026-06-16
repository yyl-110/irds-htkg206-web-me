<template>
  <div class="task-detail">
    <overview v-if="barList.length" :data="barList" chart-width="100%" />
    <div v-else class="task-empty">暂无任务进度</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Overview from './overview.vue';

interface PhaseItem {
  nodeName?: string;
  countNums?: number;
  sumNum?: number;
}

const props = defineProps<{
  phaseList?: PhaseItem[];
}>();

const barList = computed(() => props.phaseList || []);
</script>

<style lang="less" scoped>
.task-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 20px 16px 8px;
  box-sizing: border-box;

  .task-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 13px;
  }

  :deep(.overviewChart) {
    flex: 1;
    min-height: 0;
  }

  :deep(.chart) {
    height: 100%;
  }
}
</style>
