<template>
  <div style="width: 90%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, watch } from "vue";

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});

const initChart = () => {
  if (!props.chartData || props.chartData.length === 0) return;

  const xData = props.chartData.map((item) => item.deptName);
  const barValues = props.chartData.map((item) => Number(item.knowledgeCount) || 0);

  const colorList = [["#15728C", "#92D1DE"]];

  chartOption.value = {
    grid: {
      left: "0",
      right: "0",
      bottom: "10%",
      top: "20%",
      containLabel: true,
    },
    color: ["#92D1DE"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["知识数量"],
      x: "center",
      bottom: "3%",
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
        // rotate: 45,
        formatter: function (value) {
          return value.length > 8 ? value.substring(0, 8) + "..." : value;
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      data: xData,
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
    series: [
      {
        name: "知识数量",
        type: "bar",
        barWidth: "16",
        data: barValues,
        label: {
          show: true,
          color: "#fff",
          fontSize: 12,
          position: "top",
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: colorList[0][0] },
              { offset: 1, color: colorList[0][1] },
            ]),
          },
        },
      },
    ],
  };
};

watch(
  () => props.chartData,
  () => {
    initChart();
  },
  { deep: true }
);
</script>

<style lang="less" scoped></style>
