<template>
  <div style="width: 90%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const chartOption = ref({})

const props = defineProps({
  chartData: {
    type: Object,
    default: () => null,
  },
})

// ====== Mock 数据 ======
const mockChartData = {
  '结构科': { count: 120 },
  '电气科': { count: 85 },
  '暖通科': { count: 65 },
  '给排水科': { count: 45 },
  '建筑科': { count: 150 },
  '总图科': { count: 35 },
  '工艺科': { count: 95 },
  '自控科': { count: 55 },
}

const initChart = (data) => {
  if (!data || !Object.keys(data).length) return

  const xData = Object.keys(data)
  const seriesData = [
    {
      name: '模块数量',
      value: xData.map((key) => data[key].count),
    }
  ]

  const colorList = [
    ['#15728C', '#92D1DE'],
  ]

  chartOption.value = {
    grid: {
      left: '0',
      right: '0',
      bottom: '10%',
      top: '20%',
      containLabel: true,
    },
    color: ['#92D1DE'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesData.map((item) => item.name),
      x: 'center',
      bottom: '3%',
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
        show: false,
        lineStyle: {
          color: '#555f58',
        },
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#fff',
        },
        margin: 15,
        rotate: 45,
        formatter: function (value) {
          return value.length > 8 ? value.substring(0, 8) + '...' : value;
        }
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      data: xData,
      type: 'category',
    },
    yAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgba(220,220,220,0.3)',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          fontSize: 12,
          color: '#CCCCCC',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(220,220,220,0.3)',
        },
      },
    },
    series: (function () {
      let series = []
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
        }
        series.push(serie)
      }
      return series
    })(),
  }
}

onMounted(() => {
  // 没有真实数据时使用 mock 数据
  if (!props.chartData) {
    initChart(mockChartData)
  }
})

watch(
  () => props.chartData,
  (val) => {
    if (val) {
      initChart(val)
    }
  },
  { deep: true }
)
</script>

<style lang="less" scoped></style>
