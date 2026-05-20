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

const pickRow = (row) => {
  if (!row || typeof row !== "object") {
    return { total: 0, collab: 0, standalone: 0 };
  }
  if ("totalCount" in row || "collabTaskCount" in row) {
    return {
      total: Number(row.totalCount) || 0,
      collab: Number(row.collabTaskCount) || 0,
      standalone: Number(row.standaloneAppCount) || 0,
    };
  }
  return {
    total: Number(row.total_docs) || 0,
    collab: 0,
    standalone: 0,
  };
};

const initChart = () => {
  if (!props.chartData || !Object.keys(props.chartData).length) return;
  const keys = Object.keys(props.chartData);
  const seriesData = [
    {
      name: "总任务数",
      value: keys.map((item) => pickRow(props.chartData[item]).total),
    },
    {
      name: "协同任务数",
      value: keys.map((item) => pickRow(props.chartData[item]).collab),
    },
    {
      name: "独立应用数",
      value: keys.map((item) => pickRow(props.chartData[item]).standalone),
    },
  ];
  const colorList = [
    ["#15728C", "#92D1DE"],
    ["#6A5FDC", "#6A5FDC"],
    ["#FF8D1A", "#FF8D1A"],
  ];

  chartOption.value = {
    title: {
      text: "总任务数、协同任务数、独立应用数",
      left: "center",
      top: 6,
      textStyle: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 13,
        fontWeight: 500,
      },
    },
    grid: {
      left: "0",
      right: "0",
      bottom: "20%",
      top: "16%",
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
