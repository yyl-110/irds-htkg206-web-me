<template>
  <div style="width: 86%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup>
import * as echarts from "echarts";

const chartOption = ref({});

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({}),
  },
});

const initChart = () => {
  if (!props.chartData || !Object.keys(props.chartData).length) return;
  const keys = Object.keys(props.chartData);
  const seriesData = [
    {
      name: "已发布任务任务",
      value: keys.map((k) => Number(props.chartData[k]?.collabPublished) || 0),
    },
    {
      name: "协同已完成",
      value: keys.map((k) => Number(props.chartData[k]?.collabCompleted) || 0),
    },
    {
      name: "独立应用数",
      value: keys.map((k) => Number(props.chartData[k]?.standaloneAppCount) || 0),
    },
  ];
  const colorList = [
    ["#15728C", "#92D1DE"],
    ["#43CF7C", "#1a8f4a"],
    ["#6A5FDC", "#6A5FDC"],
  ];

  chartOption.value = {
    grid: {
      left: "0",
      right: "0",
      bottom: "20%",
      top: "20",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: seriesData.map((item) => item.name),
      x: "right",
      bottom: "5%",
      align: "left",
      itemHeight: 13,
      icon: "rect",
      itemWidth: 22,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        color: "#CCCCCC",
      },
    },
    xAxis: {
      showBackground: true,
      nameTextStyle: {
        color: "#c0c3cd",
        padding: [0, 0, -10, 0],
        fontSize: 14,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#555f58",
        },
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: "#fff",
        },
        margin: 15,
        formatter: (value) =>
          value && value.length > 6 ? value.substring(0, 6) + "…" : value,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      data: keys,
      type: "category",
    },
    yAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: "rgba(220,220,220,0.3)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          fontSize: 12,
          color: "#CCCCCC",
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(220,220,220,0.3)",
        },
      },
    },
    series: (function () {
      const series = [];
      for (let i = 0; i < seriesData.length; i++) {
        series.push({
          name: seriesData[i].name,
          type: "bar",
          barWidth: "16",
          data: seriesData[i].value,
          label: {
            show: true,
            color: "#fff",
            fontSize: 12,
            position: "top",
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: colorList[i][0] },
                { offset: 1, color: colorList[i][1] },
              ]),
            },
          },
        });
      }
      return series;
    })(),
  };
};

watch(
  () => props.chartData,
  () => initChart(),
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped></style>
