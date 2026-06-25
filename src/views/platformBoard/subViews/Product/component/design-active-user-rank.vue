<template>
  <div class="design-active-user-rank">
    <div class="rank-list" v-if="displayList.length">
      <div
        class="rank-item"
        v-for="item in displayList"
        :key="`${item.rank}-${item.userId ?? item.userName}`"
      >
        <div class="rank-badge" :class="rankBadgeClass(item.rank)">
          {{ item.rank }}
        </div>
        <span class="user-name" :title="item.userName">{{ item.userName }}</span>
        <div class="bar-track">
          <div class="bar-segments" :style="{ width: barTotalWidth(item.totalCount) }">
            <div
              v-if="item.collabDesignCount > 0"
              class="seg-wrap"
              :style="{ flexGrow: item.collabDesignCount }"
            >
              <a-tooltip
                :title="`用户协同设计：${item.collabDesignCount}`"
                placement="top"
                :mouse-enter-delay="0.15"
                :overlay-inner-style="tooltipStyle"
              >
                <div class="seg seg-collab" />
              </a-tooltip>
            </div>
            <div
              v-if="item.collabDesignCount > 0 && item.standaloneAppCount > 0"
              class="seg-gap"
            />
            <div
              v-if="item.standaloneAppCount > 0"
              class="seg-wrap"
              :style="{ flexGrow: item.standaloneAppCount }"
            >
              <a-tooltip
                :title="`独立应用：${item.standaloneAppCount}`"
                placement="top"
                :mouse-enter-delay="0.15"
                :overlay-inner-style="tooltipStyle"
              >
                <div class="seg seg-standalone" />
              </a-tooltip>
            </div>
            <div
              v-if="item.standaloneAppCount > 0 && item.calcCount > 0"
              class="seg-gap"
            />
            <div
              v-if="item.calcCount > 0"
              class="seg-wrap"
              :style="{ flexGrow: item.calcCount }"
            >
              <a-tooltip
                :title="`计算：${item.calcCount}`"
                placement="top"
                :mouse-enter-delay="0.15"
                :overlay-inner-style="tooltipStyle"
              >
                <div class="seg seg-calc" />
              </a-tooltip>
            </div>
          </div>
        </div>
        <span class="total-count" :style="{ color: rankColor(item.rank) }">{{ item.totalCount }}</span>
      </div>
    </div>
    <div class="empty" v-else>暂无活跃用户数据</div>
    <div class="legend" v-if="displayList.length">
      <span class="legend-item"><i class="dot collab" />用户协同设计</span>
      <span class="legend-item"><i class="dot standalone" />独立应用</span>
      <span class="legend-item"><i class="dot calc" />计算</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface DesignActiveUserRankItem {
  rank?: number;
  userId?: number | string;
  userName?: string;
  collabDesignCount?: number;
  standaloneAppCount?: number;
  calcCount?: number;
  totalCount?: number;
}

const props = defineProps<{
  list?: DesignActiveUserRankItem[];
}>();

const displayList = computed(() => props.list || []);

const maxTotal = computed(() => {
  const values = displayList.value.map((item) => Number(item.totalCount) || 0);
  return Math.max(...values, 1);
});

const RANK_COLORS: Record<number, string> = {
  1: '#69CCF6',
  2: '#FFB020',
  3: '#9B7FE8',
};

const rankColor = (rank?: number) => {
  if (rank && RANK_COLORS[rank]) return RANK_COLORS[rank];
  return '#43CF7C';
};

const rankBadgeClass = (rank?: number) => {
  if (rank === 1) return 'top1';
  if (rank === 2) return 'top2';
  if (rank === 3) return 'top3';
  return 'normal';
};

const barTotalWidth = (total?: number) => {
  const val = Number(total) || 0;
  const max = maxTotal.value;
  const pct = max > 0 ? (val / max) * 100 : 0;
  return `${Math.max(pct, val > 0 ? 6 : 0)}%`;
};

const tooltipStyle = {
  background: 'rgba(8, 28, 58, 0.96)',
  color: '#fff',
  fontSize: '12px',
  padding: '4px 10px',
  minHeight: 'auto',
};

</script>

<style lang="less" scoped>
.design-active-user-rank {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 24px 12px;
  box-sizing: border-box;

  .rank-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
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
    align-items: center;
    gap: 14px;
    min-height: 32px;
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
    color: #fff;

    &.top1 {
      background: linear-gradient(135deg, #69ccf6, #15728c);
      box-shadow: 0 0 10px rgba(105, 204, 246, 0.45);
    }

    &.top2 {
      background: linear-gradient(135deg, #ffb020, #ff8d1a);
      box-shadow: 0 0 10px rgba(255, 141, 26, 0.45);
    }

    &.top3 {
      background: linear-gradient(135deg, #9b7fe8, #6a5fdc);
      box-shadow: 0 0 10px rgba(106, 95, 220, 0.4);
    }

    &.normal {
      background: linear-gradient(135deg, #43cf7c, #2a9e55);
      box-shadow: 0 0 8px rgba(67, 207, 124, 0.35);
    }
  }

  .user-name {
    width: 72px;
    flex-shrink: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.92);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .total-count {
    width: 40px;
    flex-shrink: 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    text-align: right;
  }

  .bar-track {
    flex: 1;
    min-width: 0;
    height: 10px;
    border-radius: 2px;
    background: rgba(38, 99, 218, 0.15);
    display: flex;
    align-items: center;
  }

  .bar-segments {
    display: flex;
    align-items: stretch;
    height: 100%;
    min-width: 0;
    transition: width 0.35s ease;
  }

  .seg-wrap {
    min-width: 2px;
    height: 100%;
    display: flex;

    :deep(.ant-tooltip) {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }

  .seg {
    width: 100%;
    height: 100%;
    min-width: 2px;
    border-radius: 1px;
    cursor: pointer;

    &.seg-collab {
      background: linear-gradient(90deg, #6a5fdc, #8b7fe8);
    }

    &.seg-standalone {
      background: linear-gradient(90deg, #ff8d1a, #ffb366);
    }

    &.seg-calc {
      background: linear-gradient(90deg, #43cf7c, #7ae0a8);
    }
  }

  .seg-gap {
    width: 3px;
    flex-shrink: 0;
    height: 100%;
  }

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 12px;
    flex-shrink: 0;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(186, 205, 245, 0.85);

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 1px;
        display: inline-block;

        &.collab {
          background: #6a5fdc;
        }

        &.standalone {
          background: #ff8d1a;
        }

        &.calc {
          background: #43cf7c;
        }
      }
    }
  }
}
</style>
