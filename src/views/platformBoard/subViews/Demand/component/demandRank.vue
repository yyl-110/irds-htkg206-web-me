<template>
  <div style="width: 100%; height: 100%">
    <v-chart :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});

const initChart = () => {
  let receivedCount = props.chartData.receivedCount;
  let devCount = props.chartData.devCount;
  let completedCount = props.chartData.completedCount;
  chartOption.value = {
    legend: {
      data: ['已接收', '开发中', '已完成'],
      textStyle: {
        color: '#ffffff',
      },
      right: 20, // 距离右侧20px
      top: 20, // 距离顶部20px
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        label: {
          show: true, // 显示标签
          position: 'inside', // 标签在漏斗内部
          formatter: '{b}: {c}', // 只显示数值（{c}代表value）
          textStyle: {
            color: '#fff', // 文字白色（适配深色漏斗背景）
            fontSize: 14,
            fontWeight: 'bold',
          },
        },

        data: [
          { value: receivedCount, name: '已接收' },
          { value: devCount, name: '开发中' },
          { value: completedCount, name: '已完成' },
        ],
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
