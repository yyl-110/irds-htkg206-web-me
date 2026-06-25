<template>
  <div class="dept-data-maintain-bar">
    <v-chart v-if="hasChartOption" :option="chartOption" class="chart" autoresize />
    <div v-else class="chart-empty">暂无维护数据</div>
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
  { name: '活动页面创建量', colors: ['#6A5FDC', '#8B7FE8'] },
  { name: '任务数据维护量', colors: ['#FF8D1A', '#FFB366'] },
  { name: '计算数据维护量', colors: ['#43CF7C', '#7AE0A8'] },
];

const pickRow = (row) => {
  if (!row || typeof row !== 'object') {
    return { activityPage: 0, task: 0, calc: 0 };
  }
  const activityPage =
    Number(
      row.activityPageCount ??
        row.activityPageCreateCount ??
        row.activityPageNum ??
        row.activityPageCreateNum,
    ) || 0;
  const task =
    Number(row.taskCreateCount ?? row.taskCount ?? row.taskCreateNum ?? row.taskNum) || 0;
  const calc =
    Number(
      row.calcCreateCount ??
        row.calculationCreateCount ??
        row.calcCount ??
        row.calcCreateNum,
    ) || 0;
  return { activityPage, task, calc };
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
    keys.map((item) => pickRow(props.chartData[item]).activityPage),
    keys.map((item) => pickRow(props.chartData[item]).task),
    keys.map((item) => pickRow(props.chartData[item]).calc),
  ];
  const yMax = calcYAxisMax(seriesValues.flat());
  const categoryCount = keys.length;
  const barWidth = categoryCount > 6 ? 10 : 12;

  chartOption.value = {
    grid: {
      left: '2%',
      right: '2%',
      top: 48,
      bottom: 32,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: SERIES_META.map((item) => item.name),
      top: 4,
      left: 'center',
      itemHeight: 10,
      icon: 'rect',
      itemWidth: 16,
      itemGap: 20,
      textStyle: {
        fontSize: 11,
        color: '#CCCCCC',
      },
    },
    xAxis: {
      axisLine: { show: false },
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 11,
        margin: 8,
        lineHeight: 14,
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
        fontSize: 10,
        position: 'top',
        distance: 3,
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
.dept-data-maintain-bar {
  width: 100%;
  height: 100%;
  padding: 0 8px 12px;
  box-sizing: border-box;
  overflow: hidden;

  .chart {
    width: 100%;
    height: 94%;
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
