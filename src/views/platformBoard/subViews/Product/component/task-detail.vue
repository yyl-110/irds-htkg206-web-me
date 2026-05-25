<template>
  <div class="task-detail">
    <div class="platform-block" v-if="platformList.length">
      <span class="platform-label">平台</span>
      <div class="phase-row">
        <div class="phase-card" v-for="item in platformList" :key="item.nodeName">
          <span class="phase-name">{{ item.nodeName }}</span>
          <span class="phase-num">{{ item.countNums }}/{{ item.sumNum }}</span>
        </div>
      </div>
    </div>
    <div class="bar-section">
      <div class="bar-label">已完成任务/全部</div>
      <overview :data="barList" />
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
  padding-right: 12px;
  box-sizing: border-box;

  .platform-block {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    padding-left: 8px;

    .platform-label {
      font-size: 16px;
      color: #66ffff;
      font-weight: bold;
      flex-shrink: 0;
      line-height: 48px;
    }

    .phase-row {
      flex: 1;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .phase-card {
      min-width: 100px;
      padding: 8px 16px;
      background: rgba(12, 56, 120, 0.55);
      border: 1px solid rgba(25, 236, 255, 0.35);
      border-radius: 4px;
      text-align: center;

      .phase-name {
        display: block;
        font-size: 14px;
        color: #fff;
        margin-bottom: 6px;
      }

      .phase-num {
        font-size: 18px;
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

    .bar-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 4px;
      padding-left: 8px;
    }

    :deep(.chart) {
      height: 100%;
    }
  }
}
</style>
