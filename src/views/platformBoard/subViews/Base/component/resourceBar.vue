<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const colorPalette = [
  '#00E5FF',
  '#FFD32A',
  '#9B5DE5',
  '#38EF7D',
  '#FF9F43',
  '#2575FC',
  '#00F5D4',
  '#8C7AE6',
  '#00A8FF',
  '#1DD1A1',
];

const listData = computed(() => {
  if (!props.chartData || props.chartData.length === 0) return [];

  const list = props.chartData.map((item: any) => {
    const name = item.fileName || item.userName || item.name || '';
    const value = Number(item.accessCount || item.knowledgeCount || item.value || 0);
    return { name, value };
  });

  list.sort((a, b) => b.value - a.value);
  const topList = list.slice(0, 10);
  const total = topList.reduce((sum, item) => sum + item.value, 0);

  return topList.map((item, index) => ({
    rank: index + 1,
    name: item.name || '-',
    value: item.value,
    percent: total > 0 ? Number(((item.value / total) * 100).toFixed(2)) : 0,
    color: colorPalette[index % colorPalette.length],
  }));
});
</script>

<template>
  <div class="resource-list">
    <div v-if="listData.length === 0" class="resource-list__empty">暂无数据</div>
    <template v-else>
      <div class="resource-list__header">
        <span class="col-rank">排名</span>
        <span class="col-name">人员</span>
        <span class="col-value">数量</span>
        <span class="col-percent">占比</span>
      </div>
      <div class="resource-list__body">
        <div v-for="item in listData" :key="`${item.rank}-${item.name}`" class="resource-list__row">
          <span class="col-rank">
            <span class="rank-badge" :style="{ borderColor: item.color, color: item.color }">{{ item.rank }}</span>
          </span>
          <span class="col-name" :title="item.name">{{ item.name }}</span>
          <span class="col-value" :style="{ color: item.color }">{{ item.value }}</span>
          <span class="col-percent">
            <span class="percent-bar">
              <span class="percent-bar__fill" :style="{ width: `${item.percent}%`, backgroundColor: item.color }" />
            </span>
            <span class="percent-text">{{ item.percent }}%</span>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.resource-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 4px 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.resource-list__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
}

.resource-list__header,
.resource-list__row {
  display: grid;
  grid-template-columns: 44px minmax(0, 0.45fr) 48px minmax(320px, 1.55fr);
  align-items: center;
  column-gap: 8px;
}

.resource-list__header {
  flex-shrink: 0;
  padding: 0 8px 8px;
  color: rgba(224, 230, 237, 0.75);
  font-size: 12px;
  border-bottom: 1px solid rgba(36, 226, 226, 0.15);
}

.resource-list__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-top: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(36, 226, 226, 0.35);
    border-radius: 4px;
  }
}

.resource-list__row {
  padding: 7px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(36, 226, 226, 0.08);
  }
}

.col-rank {
  display: flex;
  justify-content: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.col-name {
  color: #e0e6ed;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-value {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.col-percent {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.percent-bar {
  flex: 1;
  height: 10px;
  background: rgba(11, 34, 51, 0.9);
  border-radius: 6px;
  overflow: hidden;
}

.percent-bar__fill {
  display: block;
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.percent-text {
  flex-shrink: 0;
  width: 68px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  text-align: right;
}
</style>
