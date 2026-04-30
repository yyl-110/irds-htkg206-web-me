<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" style="margin-left: 10px" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { getReportSystemLoginUser } from '@/api/data-screen';
import * as echarts from 'echarts';
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});
const initChart = () => {
  let xData = props.chartData.map(item => item.nodeName);
  let seriesData = props.chartData.map(item => item.progress);

  chartOption.value = {
    grid: {
      left: '0',
      right: '20',
      bottom: '13%',
      top: '10%',
      containLabel: true,
    },
    color: ['#1DB750', '#C7F36A'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesData,
      x: 'center',
      bottom: '3%',
      align: 'left',
      itemHeight: 13,
      icon: 'circle',
      itemWidth: 22,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        color: '#CCCCCC',
      },
    },
    xAxis: {
      showBackground: true,
      nameTextStyle: {
        color: '#c0c3cd',
        padding: [0, 0, -10, 0],
        fontSize: 14,
      },
      axisLine: {
        show: true, //隐藏X轴轴线
        lineStyle: {
          color: '#3875AE',
        },
      },
      axisLabel: {
        interval: 0,
        rotate: 30, // 顺时针旋转30度（推荐30/45度，角度太大易阅读困难）
        textStyle: {
          color: '#fff', //坐标轴字颜色
        },
        margin: 15,
      },
      axisTick: {
        show: false, //隐藏X轴刻度
      },
      splitLine: {
        //网格线
        show: false,
      },
      data: xData,
      type: 'category',
    },
    yAxis: {
      axisLine: {
        show: true, //隐藏X轴轴线
        lineStyle: {
          color: '#3875AE',
        },
      },
      axisTick: {
        show: false, //隐藏X轴刻度
      },
      axisLabel: {
        textStyle: {
          fontSize: 12,
          color: '#CCCCCC',
        },
      },
      splitLine: {
        //网格线
        show: true,
        lineStyle: {
          color: '#334984',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        barWidth: 25,
      },
    ],
  };
};
watch(() => props.chartData, initChart);
// const fetchData = async () => {
//   try {
//     const res = await getReportSystemLoginUser({})
//     if (res.code === '0') {
//       chartData.value = res.data
//       initChart();
//       console.log('res:', res.data)
//     }
//   } catch (error) {
//     console.log('error:', error)
//   }
// };

// onMounted(() => {
//   fetchData()
// });
</script>

<style lang="less" scoped></style>
