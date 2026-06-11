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
  return {
    total: Number(row.totalCount ?? row.totalPublishedCount ?? row.total_docs) || 0,
    collab: Number(row.collabTaskCount ?? row.collabPublished) || 0,
    standalone: Number(row.standaloneAppCount) || 0,
  };
};

const calcYAxisMax = (values) => {
  const maxVal = Math.max(...values, 0);
  if (maxVal <= 0) return 100;
  if (maxVal <= 20) return 20;
  if (maxVal <= 50) return 50;
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

  chartOption.value = {
    title: {
      text: '总任务数、协同任务数、独立应用数',
      left: 'center',
      top: 0,
      textStyle: {
        color: 'rgba(255,255,255,0.92)',
        fontSize: 13,
        fontWeight: 500,
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '18%',
      top: '14%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: SERIES_META.map((item) => item.name),
      right: '2%',
      bottom: '2%',
      align: 'left',
      itemHeight: 10,
      icon: 'rect',
      itemWidth: 18,
      itemGap: 16,
      textStyle: {
        fontSize: 12,
        color: '#CCCCCC',
      },
    },
    xAxis: {
      name: '部门',
      nameLocation: 'end',
      nameGap: 8,
      nameTextStyle: {
        color: '#FF5757',
        fontSize: 13,
        padding: [8, 0, 0, 0],
      },
      axisLine: { show: false },
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12,
        margin: 12,
        formatter: (value) =>
          value && value.length > 6 ? `${value.substring(0, 6)}…` : value,
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
      splitNumber: 5,
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
      barWidth: 14,
      barGap: '20%',
      barCategoryGap: '38%',
      data: seriesValues[index],
      label: {
        show: true,
        color: '#fff',
        fontSize: 11,
        position: 'top',
        distance: 4,
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
  width: 96%;
  height: 100%;

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
