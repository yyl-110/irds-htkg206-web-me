<template>
  <div class="projectBar" :style="{ width: chartWidth, height: '100%' }">
    <v-chart v-if="hasChartOption" :option="chartOption" class="chart" autoresize />
    <div v-else class="chart-empty">暂无项目进度数据</div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const chartOption = ref({});

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
  chartWidth: {
    type: String,
    default: '56%',
  },
});

const hasChartOption = computed(() => {
  const opt = chartOption.value;
  return opt && typeof opt === 'object' && Object.keys(opt).length > 0;
});

const calcPercent = (completeNums, taskNums) => {
  const total = Number(taskNums) || 0;
  const complete = Number(completeNums) || 0;
  if (total <= 0) return 0;
  return Math.min(100, Math.round((complete / total) * 100));
};

const initChart = () => {
  const list = Array.isArray(props.chartData) ? props.chartData : [];
  if (!list.length) {
    chartOption.value = {};
    return;
  }

  const completePercentList = list.map((item) =>
    calcPercent(item.completeNums, item.taskNums),
  );
  const unCompletePercentList = list.map((item, index) => {
    const total = Number(item.taskNums) || 0;
    if (total <= 0) return 0;
    return Math.max(0, 100 - completePercentList[index]);
  });

  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: { show: true },
      },
      formatter(params) {
        const projectName = params[0]?.name;
        const row = list.find((item) => item.projectName === projectName);
        const completeNums = Number(row?.completeNums) || 0;
        const taskNums = Number(row?.taskNums) || 0;
        const uncompletes = Math.max(0, taskNums - completeNums);
        return `${projectName}<br />
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#43CF7C;"></span>
          已完成: ${completeNums}/${taskNums}<br />
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#24E2E2;"></span>
          未完成: ${uncompletes}/${taskNums}`;
      },
    },
    grid: {
      left: '10%',
      top: '16%',
      right: '5%',
      bottom: '24%',
    },
    legend: {
      show: true,
      orient: 'horizontal',
      right: '5%',
      top: '2%',
      align: 'left',
      itemGap: 20,
      icon: 'rect',
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
      },
      itemWidth: 16,
      itemHeight: 16,
      data: ['已完成', '未完成'],
    },
    xAxis: {
      data: list.map((item) => item.projectName),
      axisLine: {
        show: true,
        lineStyle: { color: '#163a5f', width: 2 },
      },
      axisTick: { show: false, alignWithLabel: true },
      axisLabel: {
        show: true,
        color: '#fff',
        fontSize: 14,
        interval: 0,
        rotate: 30,
        formatter(value) {
          return value && value.length > 8 ? `${value.substring(0, 8)}…` : value;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '%',
      max: 100,
      min: 0,
      nameTextStyle: {
        color: '#ffffff',
        fontSize: 14,
        padding: [0, 0, 8, -30],
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#163a5f', width: 2 },
      },
      axisLabel: {
        show: true,
        color: '#ffffff',
        fontSize: 14,
      },
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        stack: 'progress',
        barWidth: 28,
        itemStyle: { color: '#43CF7C' },
        data: completePercentList,
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'progress',
        barWidth: 28,
        itemStyle: {
          color: '#24E2E2',
          borderRadius: [4, 4, 0, 0],
        },
        data: unCompletePercentList,
      },
    ],
  };
};

watch(
  () => props.chartData,
  () => initChart(),
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.projectBar {
  height: 100%;
  min-height: 200px;

  .chart {
    width: 100%;
    height: 100%;
    min-height: 200px;
  }

  .chart-empty {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }
}
</style>
