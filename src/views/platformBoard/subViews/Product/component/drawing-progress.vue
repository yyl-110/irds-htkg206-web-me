<template>
  <div class="drawing-progress">
    <div class="chart-grid" v-if="list.length">
      <div class="chart-item" v-for="item in list" :key="item.title">
        <div class="chart-title">{{ item.title }}</div>
        <pic-pie :data="item.data" />
      </div>
    </div>
    <div class="empty" v-else>暂无数据</div>
    <p class="footer-tip">图纸签审进度% = 完成签审图纸数量 / 已出图纸数量</p>
  </div>
</template>

<script setup lang="ts">
import picPie from './picPie.vue';

export interface DrawingProgressItem {
  title: string;
  data: {
    totalCount: number;
    archivedCount: number;
  };
}

defineProps<{
  list: DrawingProgressItem[];
}>();
</script>

<style lang="less" scoped>
.drawing-progress {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 24px 12px;
  box-sizing: border-box;

  .chart-grid {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 8px 12px;
    min-height: 0;
  }

  .chart-item {
    width: 120px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .chart-title {
      font-size: 14px;
      color: #fff;
      margin-bottom: 4px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    :deep(.chart) {
      width: 100%;
      height: 110px;
    }
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
    margin: 8px 0 0;
    text-align: center;
    font-size: 12px;
    color: rgba(186, 205, 245, 0.75);
    line-height: 1.4;
  }
}
</style>
