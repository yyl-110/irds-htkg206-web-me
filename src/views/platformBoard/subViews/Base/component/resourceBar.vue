<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});

const processedData = computed(() => {
  if (!props.chartData || props.chartData.length === 0) return [];

  const list = props.chartData.map((item: any) => {
    const name = item.fileName || item.userName || item.name || '';
    const value = Number(
      item.accessCount || item.knowledgeCount || item.value || 0,
    );
    return { name, value };
  });

  // Sort by value descending and take top 10
  list.sort((a, b) => b.value - a.value);
  const topList = list.slice(0, 10);

  // Make duplicate names unique for ECharts legend/series mapping by appending zero-width spaces (\u200b)
  const nameCounts = new Map<string, number>();
  return topList.map((item) => {
    const count = nameCounts.get(item.name) || 0;
    nameCounts.set(item.name, count + 1);
    const uniqueName = count > 0 ? `${item.name}${'\u200b'.repeat(count)}` : item.name;
    return {
      name: uniqueName,
      value: item.value,
    };
  });
});

const initChart = () => {
  const data = processedData.value;
  if (data.length === 0) return;

  // High-contrast vibrant colors (completely red-free) for distinct adjacent sectors
  const colorPalette = [
    '#00E5FF', // Neon Cyan
    '#FFD32A', // Vibrant Gold/Yellow
    '#9B5DE5', // Neon Purple
    '#38EF7D', // Bright Neon Green
    '#FF9F43', // Vibrant Orange
    '#2575FC', // Electric Blue
    '#00F5D4', // Teal/Bright Mint
    '#8C7AE6', // Deep Violet
    '#00A8FF', // Sky Blue
    '#1DD1A1', // Emerald Green
  ];

  chartOption.value = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(7, 29, 53, 0.9)',
      borderColor: 'rgba(36, 226, 226, 0.5)',
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
      formatter(params: any) {
        // Beautiful multiline tooltip displaying full name
        return `<div style="max-width: 250px; white-space: normal; word-break: break-all; line-height: 1.6;">
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
          <strong>${params.name}</strong><br/>
          数量: <span style="color:#24E2E2;font-weight:bold;">${params.value}</span> (${params.percent}%)
        </div>`;
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      icon: 'circle',
      pageIconColor: '#24E2E2',
      pageIconInactiveColor: '#163a5f',
      pageTextStyle: {
        color: '#fff',
      },
      textStyle: {
        color: '#e0e6ed',
        fontSize: 13,
      },
      // Safely truncate name to prevent overflow while showing the full name on hover
      formatter (name: string) {
        return name.length > 8 ? name.substring(0, 8) + '...' : name;
      },
    },
    series: [
      {
        name: '资源访问占比',
        type: 'pie',
        // Nightingale Rose Chart type (makes radii correspond to data values) for high-tech premium aesthetics
        roseType: 'radius',
        radius: ['20%', '75%'],
        center: ['40%', '50%'],
        // Smooth entry animation
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay () {
          return Math.random() * 200;
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#06192e',
          borderWidth: 2,
        },
        label: {
          show: false, // Hide labels on pie chart to prevent overlapping, since we have the legend and tooltip
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(36, 226, 226, 0.5)',
            borderWidth: 0,
          },
        },
        data: data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colorPalette[index % colorPalette.length],
          },
        })),
      },
    ],
  };
};

watch(
  () => props.chartData,
  () => {
    initChart();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
