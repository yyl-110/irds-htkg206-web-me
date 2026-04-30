<template>
  <div style="width: 90%; height: 100%">
    <v-chart :option="chartOption" class="chart" style="margin-left: 40px" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { deliveryReport } from '@/api/data-screen';
import { useIndexStore } from '@/store/data-screen';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
const indexStore = useIndexStore();
const { selectPhaseId } = storeToRefs(indexStore);

const chartOption = ref({});

const props = defineProps({
  chartData: {
    type: Object,
    default: () => {},
  },
});

const initChart = () => {
  const keys = Object.keys(props.chartData);
  let xData = keys.map(item => props.chartData[item].name);
  let seriesData = [
    {
      name: '产品谱系',
      value: keys.map(item => props.chartData[item].num),
    },
  ];
  const colorList = [['#15728C', '#92D1DE']];

  chartOption.value = {
    grid: {
      left: '0',
      right: '0',
      bottom: '10',
      top: '20',
      containLabel: true,
    },
    color: ['#1DB750', '#C7F36A'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesData,
      x: 'right',
      top: '2%',
      align: 'left',
      itemHeight: 13,
      icon: 'rect',
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
        show: false, //隐藏X轴轴线
        lineStyle: {
          color: '#555f58',
        },
      },
      axisLabel: {
        interval: 0,
        rotate: 45,
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
        show: false, //隐藏X轴轴线
        lineStyle: {
          color: 'rgba(220,220,220,0.3)',
        },
      },
      axisTick: {
        show: false, //隐藏X轴刻度
      },
      axisLabel: {
        show: false, //隐藏X轴刻度
        textStyle: {
          fontSize: 12,
          color: '#CCCCCC',
        },
      },
      splitLine: {
        //网格线
        show: false,
        lineStyle: {
          color: 'rgba(220,220,220,0.3)',
        },
      },
    },
    series: (function () {
      let series = [];
      for (let i = 0; i < seriesData.length; i++) {
        let serie = {
          name: seriesData[i].name,
          type: 'bar',
          barWidth: '16',
          data: seriesData[i].value,
          label: {
            show: true,
            color: '#fff',
            fontSize: 12,
            position: 'top',
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: colorList[i][0] },
                { offset: 1, color: colorList[i][1] },
              ]),
            },
          },
        };
        series.push(serie);
      }
      return series;
    })(),
  };
};

watch(
  () => props.chartData,
  val => {
    initChart();
  },
  { deep: true }
);
</script>

<style lang="less" scoped></style>
