<template>
  <div style="width: 86%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup>
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
  '结构科': { independent: 42, collaborative: 28 },
  '电气科': { independent: 35, collaborative: 51 },
  '暖通科': { independent: 27, collaborative: 33 },
  '给排水科': { independent: 18, collaborative: 45 },
  '建筑科': { independent: 56, collaborative: 37 },
  '总图科': { independent: 22, collaborative: 19 },
  '工艺科': { independent: 31, collaborative: 42 },
  '自控科': { independent: 14, collaborative: 26 },
}

const initChart = (data) => {
  if (!data || !Object.keys(data).length) return

  const xData = Object.keys(data)
  const seriesData = [
    {
      name: '独立应用',
      value: xData.map((key) => data[key].independent),
    },
    {
      name: '协同设计',
      value: xData.map((key) => data[key].collaborative),
    },
  ]

  const colorList = [
    ['#15728C', '#92D1DE'],
    ['#6A5FDC', '#6A5FDC'],
  ]

  chartOption.value = {
    grid: {
      left: '0',
      right: '0',
      bottom: '20%',
      top: '20',
      containLabel: true,
    },
    color: ['#92D1DE', '#6A5FDC'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesData.map((item) => item.name),
      x: 'right',
      bottom: '5%',
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