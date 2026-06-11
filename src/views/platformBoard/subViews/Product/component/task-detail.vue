<template>
  <div class="task-detail">
    <div class="platform-block" v-if="platformList.length">
      <span class="section-label">平台</span>
      <div class="platform-items">
        <div class="platform-item" v-for="item in platformList" :key="item.nodeName">
          <span class="phase-name">{{ item.nodeName }}</span>
          <span class="phase-num">{{ item.countNums }}/{{ item.sumNum }}</span>
        </div>
      </div>
    </div>
    <div class="bar-section">
      <div class="section-label">已完成任务/全部</div>
      <overview :data="barList" chart-width="100%" />
    </div>
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

const platformList = computed(() => {
  const list = props.phaseList || [];
  if (list.length <= 3) return list;
  return list.slice(0, 3);
});

const barList = computed(() => {
  const list = props.phaseList || [];
  if (list.length <= 3) return list;
  return list.slice(3);
});
</script>

<style lang="less" scoped>
.task-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px 12px 8px 0;
  box-sizing: border-box;
  gap: 10px;

  .section-label {
    font-size: 15px;
    color: #ff5757;
    font-weight: 600;
    flex-shrink: 0;
    line-height: 1.2;
  }

  .platform-block {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-left: 4px;

    .platform-items {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 18px 28px;
      padding-top: 1px;
    }

    .platform-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      white-space: nowrap;

      .phase-name {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.92);
      }

      .phase-num {
        font-size: 16px;
        color: #66ffff;
        font-weight: 600;
      }
    }
  }

  .bar-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 4px;

    :deep(.overviewChart) {
      flex: 1;
      min-height: 0;
    }

    :deep(.chart) {
      height: 100%;
    }
  }
}
</style>
