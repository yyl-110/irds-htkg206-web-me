<template>
  <div class="interaction-chart">
    <v-chart v-if="hasChartOption" :option="chartOption" class="chart" autoresize />
    <div v-else class="chart-empty">暂无交付数据</div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';

const chartOption = ref({});
const hasChartOption = computed(() => {
  const opt = chartOption.value;
  return opt && typeof opt === 'object' && Object.keys(opt).length > 0;
});

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({}),
  },
});

const SERIES_META = [
  { name: '总任务数', colors: ['#15728C', '#92D1DE'] },
  { name: '协同任务数', colors: ['#6A5FDC', '#8B7FE8'] },
  { name: '独立应用数', colors: ['#FF8D1A', '#FFB366'] },
];

const pickRow = (row) => {
  if (!row || typeof row !== 'object') {
    return { total: 0, collab: 0, standalone: 0 };
  }
  const collab = Number(row.collabTaskCount ?? row.collabPublished) || 0;
  const standalone = Number(row.standaloneAppCount) || 0;
  return {
    total: Number(row.totalCount ?? row.totalPublishedCount) || collab + standalone,
    collab,
    standalone,
  };
};

const calcYAxisMax = (values) => {
  const maxVal = Math.max(...values, 0);
  if (maxVal <= 0) return 10;
  if (maxVal <= 20) return 20;
  if (maxVal <= 50) return 50;
  if (maxVal <= 80) return 80;
  return Math.ceil(maxVal / 10) * 10;
};

const initChart = () => {
  if (!props.chartData || !Object.keys(props.chartData).length) {
    chartOption.value = {};
    return;
  }

  const keys = Object.keys(props.chartData);
  const seriesValues = [
    keys.map((item) => pickRow(props.chartData[item]).total),
    keys.map((item) => pickRow(props.chartData[item]).collab),
    keys.map((item) => pickRow(props.chartData[item]).standalone),
  ];
  const yMax = calcYAxisMax(seriesValues.flat());
  const categoryCount = keys.length;
  const barWidth = categoryCount > 6 ? 12 : 14;

  chartOption.value = {
    title: {
      text: '总任务数、协同任务数、独立应用数',
      left: 'center',
      top: 4,
      textStyle: {
        color: 'rgba(255,255,255,0.92)',
        fontSize: 13,
        fontWeight: 500,
      },
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '20%',
      top: '16%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: SERIES_META.map((item) => item.name),
      right: '1%',
      bottom: '1%',
      align: 'left',
      itemHeight: 10,
      icon: 'rect',
      itemWidth: 18,
      itemGap: 18,
      textStyle: {
        fontSize: 12,
        color: '#CCCCCC',
      },
    },
    xAxis: {
      axisLine: { show: false },
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12,
        margin: 14,
        lineHeight: 16,
        formatter: (value) =>
          value && value.length > 5 ? `${value.substring(0, 5)}…` : value,
      },
      axisTick: { show: false },
      splitLine: { show: false },
      data: keys,
      type: 'category',
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yMax,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#CCCCCC',
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(220,220,220,0.18)',
          type: 'dashed',
        },
      },
    },
    series: SERIES_META.map((meta, index) => ({
      name: meta.name,
      type: 'bar',
      barWidth,
      barGap: '18%',
      barCategoryGap: categoryCount > 6 ? '32%' : '40%',
      data: seriesValues[index],
      label: {
        show: true,
        color: '#fff',
        fontSize: 11,
        position: 'top',
        distance: 5,
        formatter: (params) => {
          const val = Number(params.value) || 0;
          return val > 0 ? String(val) : '';
        },
      },
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0, color: meta.colors[0] },
          { offset: 1, color: meta.colors[1] },
        ]),
      },
    })),
  };
};

watch(
  () => props.chartData,
  () => initChart(),
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.interaction-chart {
  width: 100%;
  height: 100%;
  padding: 0 4px 4px;
  box-sizing: border-box;

  .chart {
    width: 100%;
    height: 100%;
  }

  .chart-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }
}
</style>
