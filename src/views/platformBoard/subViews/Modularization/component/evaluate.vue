<script setup lang="ts">
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

interface DeptUsageItem {
  deptName?: string
  usageCount?: string | number
}

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
  jumpPaths: {
    type: Array,
    default: () => ['/product/module/application', '/product/module'],
  },
})

const emit = defineEmits(['deptClick'])

const router = useRouter()
const chartOption = ref({})

const dataList = computed<DeptUsageItem[]>(() => {
  if (!Array.isArray(props.chartData))
    return []

  return props.chartData.map(item => ({
    deptName: item?.deptName || '',
    usageCount: Number(item?.usageCount || 0),
  }))
})

const initChart = () => {
  const xData = dataList.value.map(item => item.deptName)
  const barValues = dataList.value.map(item => Number(item.usageCount) || 0)
  const colorList = [['#15728C', '#92D1DE']]

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
      formatter(params) {
        const item = params?.[0]
        if (!item)
          return ''

        return `${item.name}：${item.value}`
      },
    },
    legend: {
      data: ['使用次数'],
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
      axisLine: {
        show: false,
        lineStyle: {
          color: '#555f58',
        },
      },
      axisLabel: {
        interval: 0,
        color: '#fff',
        margin: 15,
        formatter(value) {
          return value.length > 8 ? `${value.substring(0, 8)}...` : value
        },
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
        color: '#CCCCCC',
        fontSize: 12,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(220,220,220,0.3)',
        },
      },
    },
    series: [
      {
        name: '使用次数',
        type: 'bar',
        barWidth: '16',
        data: barValues,
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
          position: 'top',
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: colorList[0][0] },
            { offset: 1, color: colorList[0][1] },
          ]),
        },
      },
    ],
  }
}

const handleDeptClick = async (params) => {
  const deptName = params?.name
  const usageCount = params?.value

  if (!deptName)
    return

  emit('deptClick', {
    deptName,
    usageCount,
  })

  const targetPath = props.jumpPaths.find(path => router.resolve({ path }).matched.length)
  if (!targetPath)
    return

  await router.push({
    path: targetPath,
    query: {
      deptName,
    },
  })
}

watch(
  () => props.chartData,
  () => {
    initChart()
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div style="width: 90%; height: 100%">
    <v-chart :option="chartOption" class="chart" autoresize @click="handleDeptClick" />
  </div>
</template>

<style lang="less" scoped>
.chart {
  cursor: pointer;
}
</style>
