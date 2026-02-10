<template>
  <div class="echarts-inner">
    <div id="centerEchart2"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
import * as echarts from 'echarts';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  echartAllData2: Object,
});

const uStore = useUserStore();
const __router = useRouter();
const collapsStatus = computed(() => {
  return true;
});

watch(
  props.echartAllData2,
  (newVal, oldVal) => {
    init();
  },
  { immediate: true, deep: true }
);

watch(
  collapsStatus,
  (newVal, oldVal) => {
    collapsStatus.value = newVal;
    init(true);
  },
  { immediate: true, deep: true }
);

watch(__router.currentRoute, (newVal, oldVal) => {
  nextTick(() => {
    init(true);
  });
});

function init(booler) {
  nextTick(() => {
    let chartDom = document.getElementById('centerEchart2');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      let option = props.echartAllData2.config;
      option && myChart.setOption(option);
      if (booler) {
        myChart.resize();
      }
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    }
  });
}

onMounted(() => {
  init();
});
</script>
<style lang="less" scoped>
.echarts-inner {
  width: 100%;
  height: 400px;
  margin-bottom: 10px;
  #centerEchart2 {
    width: 100%;
    height: 400px;
    margin: 0 auto;
  }
}
</style>
