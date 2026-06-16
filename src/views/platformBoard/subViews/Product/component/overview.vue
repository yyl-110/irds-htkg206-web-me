<template>
  <div class="overviewChart" :style="{ width: chartWidth, height: '100%' }">
    <v-chart v-if="hasChartOption" :option="chartOption" class="chart" autoresize />
    <div v-else class="chart-empty">暂无进度数据</div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  chartWidth: {
    type: String,
    default: '100%',
  },
});

const chartOption = ref({});
const hasChartOption = computed(() => {
  const opt = chartOption.value;
  return opt && typeof opt === 'object' && Object.keys(opt).length > 0;
});

const initChart = () => {
  if (!props.data || !props.data.length) {
    chartOption.value = {};
    return;
  }

  const yAxisData = props.data.map((item) => item.nodeName);
  const completeData = props.data.map((item) => Number(item.countNums) || 0);
  const totalData = props.data.map((item) => Number(item.sumNum) || 0);
  const xMax = Math.max(...totalData, 1);

  const rowCount = yAxisData.length;
  const barWidth = rowCount <= 3 ? 18 : 16;
  const gridTop = rowCount <= 3 ? 16 : 8;
  const gridBottom = rowCount <= 3 ? 16 : 4;

  chartOption.value = {
    grid: {
      top: gridTop,
      left: 0,
      right: 76,
      bottom: gridBottom,
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: 'value',
      max: xMax,
    },
    yAxis: {
      type: 'category',
      inverse: true,
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 14,
        color: 'rgba(255, 255, 255, 0.92)',
        fontSize: 14,
        lineHeight: 22,
      },
      data: yAxisData,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: (params) => {
        const index = params[1]?.dataIndex ?? params[0]?.dataIndex ?? 0;
        return `${yAxisData[index]}<br/>${completeData[index]}/${totalData[index]}`;
      },
    },
    series: [
      {
        type: 'bar',
        barGap: '-100%',
        barWidth,
        silent: true,
        z: 0,
        data: totalData,
        itemStyle: {
          borderRadius: 8,
          color: 'rgba(38, 99, 218, 0.22)',
        },
      },
      {
        type: 'bar',
        barWidth,
        z: 1,
        data: completeData,
        label: {
          show: true,
          position: 'right',
          distance: 10,
          color: '#fff',
          fontSize: 14,
          formatter: (params) => {
            const index = params.dataIndex;
            return `${completeData[index]}/${totalData[index]}`;
          },
        },
        itemStyle: {
          borderRadius: 8,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#2663DA' },
            { offset: 1, color: '#69CCF6' },
          ]),
        },
      },
    ],
  };
};

watch(
  () => props.data,
  () => {
    initChart();
  },
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.overviewChart {
  min-width: 0;

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
    font-size: 13px;
  }
}
</style>
