<template>
  <div class="echartsWrap">
    <div id="centerEchart1"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
import * as echarts from 'echarts';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  echartAllData1: Object,
});

const uStore = useUserStore();
const __router = useRouter();
const collapsStatus = computed(() => {
  return true;
});

watch(
  props.echartAllData1,
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
    let chartDom = document.getElementById('centerEchart1');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      let option = props.echartAllData1.config;
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
.echartsWrap {
  width: 100%;
  height: 310px;
  #centerEchart1 {
    width: 100%;
    height: 310px;
    margin: 0 auto;
  }
}
</style>
