<template>
  <div style="width: 100%; height: 100%; margin-left: 2px">
    <v-chart :option="chartOption" class="chart" :autoplay="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import rank from '@/assets/data-screen/module/rank.png';
import lightPoint from '@/assets/data-screen/common/lightPoint.png';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
  // 轮询配置
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000, // 轮询间隔，单位毫秒
  },
  visibleItems: {
    type: Number,
    default: 10, // 每次显示的项目数量
  },
});

const chartOption = ref({});
let timer = null;
let currentStartIndex = 0;

// 自动轮询函数
const startAutoScroll = () => {
  if (!props.autoplay || props.chartData.length <= props.visibleItems) {
    return;
  }

  stopAutoScroll(); // 先清除已有定时器

  timer = setInterval(() => {
    currentStartIndex++;
    if (currentStartIndex > props.chartData.length - props.visibleItems) {
      currentStartIndex = 0;
    }
    updateChartData();
  }, props.interval);
};

const stopAutoScroll = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 获取要显示的数据
const getDisplayData = () => {
  if (!props.chartData || props.chartData.length === 0) return [];

  // 如果数据量小于等于要显示的数量，直接返回全部
  if (props.chartData.length <= props.visibleItems) {
    return props.chartData;
  }

  // 获取当前要显示的数据段
  const endIndex = Math.min(currentStartIndex + props.visibleItems, props.chartData.length);
  let displayData = props.chartData.slice(currentStartIndex, endIndex);

  // 如果数据不足visibleItems，从开头补足
  if (displayData.length < props.visibleItems) {
    const needed = props.visibleItems - displayData.length;
    displayData = displayData.concat(props.chartData.slice(0, needed));
  }

  return displayData;
};

// 更新图表数据
const updateChartData = () => {
  const displayData = getDisplayData();
  initChart(displayData);
};

const initChart = displayData => {
  const dataList = displayData.map(item => ({
    name: item.name,
    value: item.number,
  }));

  chartOption.value = {
    grid: {
      left: '0',
      top: 8,
      bottom: 8,
      right: '0',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      formatter(params) {
        let res = '';
        const { marker, name, value } = params;
        if (name !== '') {
          res += `${marker}${name} : ${value}`;
        }
        return res;
      },
    },
    xAxis: [
      {
        type: 'value',
        show: false,
      },
      {
        type: 'value',
        show: false,
      },
    ],
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          textStyle: {
            rich: {
              bg: {
                color: '#fff',
                fontSize: 20,
                lineHeight: 30,
                backgroundColor: {
                  image: rank,
                },
                height: 30,
                width: 30,
                padding: [1, 0, 0, 0],
              },
            },
          },
          formatter: function (value) {
            // 显示全局排名
            const globalIndex = props.chartData.findIndex(item => item.name === value);
            return `{bg|${globalIndex !== -1 ? globalIndex + 1 : 'N/A'}}`;
          },
          align: 'center',
          padding: [0, 30, 0, 0],
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: dataList.map(item => item.name),
      },
      {
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          margin: 20,
          color: 'rgba(96, 98, 102, 1)',
          fontSize: 20,
          rich: {
            a: {
              width: 40,
              fontSize: 20,
              color: '#00F3FD',
              padding: [0, 10, 0, 0],
            },
            b: {
              fontSize: 16,
              color: '#fff',
            },
          },
          formatter: function (value, index) {
            const { name } = dataList[index];
            return `{a|${value}}{b|${name}}`;
          },
        },
        data: dataList.map(item => item.value),
      },
    ],
    series: [
      {
        name: '进度部分',
        type: 'bar',
        zlevel: 1,
        showBackground: true,
        backgroundStyle: {
          color: '#0B2233',
          borderRadius: 8,
        },
        itemStyle: {
          borderRadius: 8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(1,192,247,0)',
              },
              {
                offset: 1,
                color: '#00F6FF',
              },
            ],
          },
        },
        barWidth: 6,
        data: dataList,
      },
      // 进度条的小圆圈
      {
        name: '小圈圈',
        type: 'scatter',
        symbol: 'image://' + lightPoint,
        symbolSize: 40,
        emphasis: {
          scale: false,
        },
        z: 2,
        zlevel: 10,
        data: dataList,
        animationDelay: 500,
      },
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
  };
};

// 初始化时只显示前10条数据
const initDisplay = () => {
  if (props.chartData && props.chartData.length > 0) {
    currentStartIndex = 0; // 从第0条开始
    // 初始显示前10条（或全部数据如果不足10条）
    const initialDisplayData = props.chartData.slice(0, props.visibleItems);
    initChart(initialDisplayData);

    // 如果开启了自动轮询且数据量大于显示数量，延迟启动轮询
    if (props.autoplay && props.chartData.length > props.visibleItems) {
      // 延迟启动，让用户先看到初始数据
      setTimeout(() => {
        startAutoScroll();
      }, 2000); // 2秒后开始轮询
    }
  }
};

// 监听数据变化
watch(
  () => props.chartData,
  newVal => {
    if (newVal && newVal.length > 0) {
      // 重置并重新初始化显示
      stopAutoScroll();
      currentStartIndex = 0;
      initDisplay();
    } else {
      // 数据为空时清除图表
      chartOption.value = {};
    }
  },
  { deep: true, immediate: true }
);

// 组件生命周期
onMounted(() => {
  // 已经在initDisplay中处理了初始化
});

onUnmounted(() => {
  stopAutoScroll();
});

// 监听轮播配置变化
watch(
  () => props.autoplay,
  newVal => {
    if (newVal && props.chartData && props.chartData.length > props.visibleItems) {
      startAutoScroll();
    } else {
      stopAutoScroll();
      // 重置显示前10条数据
      currentStartIndex = 0;
      const displayData = props.chartData.slice(0, props.visibleItems);
      initChart(displayData);
    }
  }
);

// 监听显示数量变化
watch(
  () => props.visibleItems,
  newVal => {
    // 重新初始化显示
    stopAutoScroll();
    currentStartIndex = 0;
    initDisplay();
  }
);
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;

  // 添加悬停暂停效果
  &:hover {
    .autoplay-control {
      opacity: 1;
    }
  }
}

.autoplay-control {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 100;
}
</style>
