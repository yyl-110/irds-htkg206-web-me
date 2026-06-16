<template>
  <div class="activity-ref-rank">
    <div class="rank-header">活动页面被引用次数排行</div>
    <div class="rank-list" v-if="displayList.length">
      <div
        class="rank-item"
        v-for="item in displayList"
        :key="`${item.rank}-${item.activityPageId}`"
      >
        <div class="rank-badge" :class="rankBadgeClass(item.rank)">
          {{ item.rank }}
        </div>
        <div class="rank-content">
          <div class="rank-top">
            <span class="page-name" :title="item.activityPageName">{{ item.activityPageName }}</span>
            <span class="ref-count">{{ item.refCount }}<small>次</small></span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: barPercent(item.refCount) }" />
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>暂无引用数据</div>
    <p class="footer-tip">引用次数 = 该平台下设计任务发布节点挂载该活动页的次数</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ActivityPageRefRankItem {
  rank?: number;
  activityPageId?: number | string;
  activityPageName?: string;
  refCount?: number;
}

const props = defineProps<{
  list?: ActivityPageRefRankItem[];
}>();

const displayList = computed(() => props.list || []);

const maxRefCount = computed(() => {
  const values = displayList.value.map((item) => Number(item.refCount) || 0);
  return Math.max(...values, 1);
});

const barPercent = (count?: number) => {
  const val = Number(count) || 0;
  const max = maxRefCount.value;
  const pct = max > 0 ? Math.round((val / max) * 100) : 0;
  return `${Math.max(pct, val > 0 ? 8 : 0)}%`;
};

const rankBadgeClass = (rank?: number) => {
  if (rank === 1) return 'top1';
  if (rank === 2) return 'top2';
  if (rank === 3) return 'top3';
  return 'normal';
};
</script>

<style lang="less" scoped>
.activity-ref-rank {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px 20px 10px;
  box-sizing: border-box;

  .rank-header {
    text-align: center;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.88);
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .rank-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(105, 204, 246, 0.35);
      border-radius: 4px;
    }
  }

  .rank-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .rank-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
    color: #fff;
    background: rgba(38, 99, 218, 0.55);
    box-shadow: 0 0 8px rgba(38, 99, 218, 0.35);

    &.top1 {
      background: linear-gradient(135deg, #ffb020, #ff6b1a);
      box-shadow: 0 0 10px rgba(255, 141, 26, 0.45);
    }

    &.top2 {
      background: linear-gradient(135deg, #8ea8ff, #6a5fdc);
      box-shadow: 0 0 10px rgba(106, 95, 220, 0.4);
    }

    &.top3 {
      background: linear-gradient(135deg, #69ccf6, #15728c);
      box-shadow: 0 0 10px rgba(105, 204, 246, 0.4);
    }
  }

  .rank-content {
    flex: 1;
    min-width: 0;
  }

  .rank-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  .page-name {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.95);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ref-count {
    flex-shrink: 0;
    font-size: 18px;
    font-weight: 700;
    color: #69ccf6;
    line-height: 1;

    small {
      margin-left: 2px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.65);
    }
  }

  .bar-track {
    height: 8px;
    border-radius: 999px;
    background: rgba(38, 99, 218, 0.18);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #2663da 0%, #69ccf6 100%);
    box-shadow: 0 0 8px rgba(105, 204, 246, 0.45);
    transition: width 0.35s ease;
  }

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }

  .footer-tip {
    margin: 10px 0 0;
    text-align: center;
    font-size: 12px;
    color: rgba(186, 205, 245, 0.75);
    line-height: 1.4;
    flex-shrink: 0;
  }
}
</style>
