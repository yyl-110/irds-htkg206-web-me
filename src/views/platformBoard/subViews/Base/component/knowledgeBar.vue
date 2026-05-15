<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup>
import * as echarts from "echarts";

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});
const chartOption = ref({});

const initChart = () => {
  if (!props.chartData || props.chartData.length === 0) return;

  let Ydata = [];
  let barData = [];

  props.chartData.forEach((item) => {
    Ydata.push(item.nodeName);
    barData.push(Number(item.cnt) || 0);
  });

  // 背景柱数据用最大值
  const maxBgValue = Math.max(...barData);
  const maxBgArr = props.chartData.map(() => maxBgValue);

  const seriesData = [
    // 背景柱
    {
      type: "bar",
      barGap: "-100%",
      barWidth: 14,
      xAxisIndex: 0,
      z: 0,
      data: maxBgArr,
      tooltip: {
        show: false,
      },
      itemStyle: {
        normal: {
          barBorderRadius: 20,
          color: 'rgba(252,71,104,0.3)',
        },
      },
      label: {
        show: false,
      },
    },
    // 数据柱
    {
      name: "数量",
      type: "bar",
      barWidth: 14,
      itemStyle: {
        normal: {
          barBorderRadius: 20,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#00E0DB",
              },
              {
                offset: 1,
                color: "#50EFB1",
              },
            ],
          },
        },
      },
      label: {
        position: [0, 20],
        color: "#fff",
        align: "left",
        show: true,
        formatter: (params) => {
          return `${params.name}  ${params.value}`;
        },
      },
      z: 1,
      data: barData,
    },
  ];

  chartOption.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "rgba(0, 255, 233,0)",
        },
      },
    },
    grid: {
      left: 20,
      right: 40,
      bottom: 10,
      top: 10,
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: "value",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          fontSize: 16,
          color: "#fff",
        },
        data: Ydata,
      },
    ],
    series: seriesData,
  };
};

watch(() => props.chartData, initChart);
</script>

<style lang="less" scoped></style>