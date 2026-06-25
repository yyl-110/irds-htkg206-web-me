<template>
  <div class="knowledgeBoardChart">
    <v-chart v-if="hasChartOption" :option="chartOption" class="chart" autoresize />
    <div v-else class="chart-empty">暂无数据</div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  chartData: {
    type: [Object, Array],
    default: () => null,
  },
});

const chartOption = ref({});
const hasChartOption = computed(() => {
  const opt = chartOption.value;
  return opt && typeof opt === 'object' && Object.keys(opt).length > 0;
});

const formatMonthLabel = (month) => {
  if (!month) return '';
  const parsed = dayjs(month);
  return parsed.isValid() ? `${parsed.month() + 1}月` : String(month);
};

const parseChartData = (raw) => {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    const months = raw.map((item) => formatMonthLabel(item.month ?? item.monthLabel ?? item.label));
    return {
      months,
      addedData: raw.map((item) => Number(item.addedCount ?? item.monthlyAdded ?? item.addCount ?? item.count ?? 0)),
      totalData: raw.map((item) => Number(item.totalCount ?? item.total ?? item.cumulativeTotal ?? 0)),
      previewData: raw.map((item) => Number(item.previewCount ?? item.preview ?? item.accessCount ?? item.clickCount ?? 0)),
    };
  }

  const months = (raw.months || raw.monthList || []).map(formatMonthLabel);
  if (!months.length) return null;

  return {
    months,
    addedData: (raw.monthlyAdded ?? raw.addedCounts ?? raw.monthlyAddedCounts ?? raw.addList ?? []).map(Number),
    totalData: (raw.totalCount ?? raw.totalCounts ?? raw.monthlyTotalCounts ?? raw.totalList ?? []).map(Number),
    previewData: (raw.previewCount ?? raw.previewCounts ?? raw.monthlyPreviewCounts ?? raw.previewList ?? []).map(Number),
  };
};

const initChart = () => {
  const parsed = parseChartData(props.chartData);
  if (!parsed || !parsed.months.length) {
    chartOption.value = {};
    return;
  }

  const { months, addedData, totalData, previewData } = parsed;

  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,95,182,0.5)',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      x: 'center',
      top: '2%',
      align: 'left',
      itemHeight: 10,
      icon: 'rect',
      itemWidth: 16,
      itemGap: 24,
      textStyle: {
        fontSize: 12,
        color: '#FFFFFF',
      },
      data: ['知识库', '知识总数量', '知识预览数量'],
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '8%',
      top: '16%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#334984',
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#CAD9FA',
        fontSize: 12,
      },
      data: months,
    },
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#397cbc',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#334984',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        position: 'right',
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#397cbc',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '知识库',
        type: 'bar',
        barWidth: 18,
        yAxisIndex: 0,
        data: addedData,
        itemStyle: {
          color: 'rgba(146, 209, 222, 0.65)',
          borderRadius: [2, 2, 0, 0],
        },
      },
      {
        name: '知识总数量',
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbolSize: 6,
        yAxisIndex: 0,
        data: totalData,
        itemStyle: {
          color: '#77FF00',
          borderColor: '#77FF00',
          borderWidth: 1,
        },
        lineStyle: {
          width: 2,
          color: '#77FF00',
        },
      },
      {
        name: '知识预览数量',
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbolSize: 6,
        yAxisIndex: 1,
        data: previewData,
        itemStyle: {
          color: '#FFAF1A',
          borderColor: '#FFAF1A',
          borderWidth: 1,
        },
        lineStyle: {
          width: 2,
          color: '#FFAF1A',
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
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.knowledgeBoardChart {
  width: 100%;
  height: 100%;
  padding: 8px 16px 12px;

  .chart {
    width: 100%;
    height: 100%;
  }

  .chart-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
  }
}
</style>
