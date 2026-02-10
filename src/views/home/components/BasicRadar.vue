<template>
  <div class="echarts-wrap">
    <div id="main"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

onMounted(() => {
  init();
});
const init = () => {
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: 140,
      left: 'center',
      data: ['全部', '待办', '已办', '已阅', '待阅'],
    },
    series: [
      {
        name: '项目情况',
        type: 'pie',
        radius: '50%',
        center: ['50%', '26%'],
        data: [
          { value: 1048, name: '全部' },
          { value: 735, name: '待办' },
          { value: 580, name: '已办' },
          { value: 484, name: '已阅' },
          { value: 484, name: '待阅' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  option && myChart.setOption(option);
  window.onresize = myChart.resize;
};
</script>
<style lang="less" scoped>
.echarts-wrap {
  width: 100%;
  height: 440px;
  margin-bottom: 10px;
  #main {
    width: 100%;
    min-height: 400px;
    margin: 0 auto;
  }
}
</style>
