<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { forEach } from 'lodash-es';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});
const chartOption = ref({});

const initChart = () => {
  let highCountStr = [];
  let middleCountStr = [];
  let lowCountStr = [];
  forEach(props.chartData.demandSourceDataMap, (item, index) => {
    highCountStr.push(item.highCount);
    middleCountStr.push(item.middleCount);
    lowCountStr.push(item.lowCount);
  });

  const xAxisStr = props.chartData.demandSources;
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: true, // 强制显示图例（默认true，可省略）
      data: ['高', '中', '低'], // 图例项名称（需与series.name一致）
      textStyle: {
        color: '#ffffff',
      },
      right: 20, // 距离右侧20px
      top: 20, // 距离顶部20px
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisStr,
        splitLine: { show: false }, // 去掉x轴方向的网格线（若有）
        axisLabel: {
          rotate: 45, // 关键：x轴文字顺时针旋转45°
          interval: 0, // 强制显示所有标签（默认可能会自动隐藏部分避免重叠）
          margin: 15, // 文字与坐标轴的距离（防止旋转后贴太紧）
          align: 'right', // 旋转后文字右对齐（可选，优化显示效果）
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
        name: '高',
        type: 'bar',
        barWidth: 20,
        stack: 'types',
        data: highCountStr,
      },
      {
        name: '中',
        type: 'bar',
        stack: 'types',
        data: middleCountStr,
      },
      {
        name: '低',
        type: 'bar',
        stack: 'types',
        data: lowCountStr,
      },
    ],
  };
};

watch(() => props.chartData, initChart);
</script>

<style lang="less" scoped></style>
