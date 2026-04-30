<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { forEach } from 'lodash-es';
const chartOption = ref({});

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const initChart = () => {
  let classify1s = props.chartData.classify1s;
  let coreCount = [];
  let techCount = [];
  let operationCount = [];
  forEach(props.chartData.demandSourceDataMap, (item, index) => {
    coreCount.push(item.coreCount);
    techCount.push(item.techCount);
    operationCount.push(item.operationCount);
  });
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['核心与强制性分类', '技术性分类', '运营与商业分类'],
      textStyle: {
        color: '#ffffff',
      },
      right: 20, // 距离右侧20px
      top: 20, // 距离顶部20px
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: classify1s,
        splitLine: { show: false }, // 去掉x轴方向的网格线（若有）
        axisLabel: {
          interval: 0, // 强制显示所有标签（默认可能会自动隐藏部分避免重叠）
          color: '#ffffff',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: { show: false }, // 去掉x轴方向的网格线（若有）
        axisLabel: {
          color: '#ffffff',
        },
      },
    ],
    series: [
      {
        name: '核心与强制性分类',
        type: 'bar',
        barGap: 0,
        barWidth: 20,
        data: coreCount,
      },
      {
        name: '技术性分类',
        type: 'bar',
        barWidth: 20,
        data: techCount,
      },
      {
        name: '运营与商业分类',
        type: 'bar',
        barWidth: 20,
        data: operationCount,
      },
    ],
  };
};

watch(
  () => props.chartData,
  () => {
    initChart();
  }
);
</script>

<style lang="less" scoped></style>
