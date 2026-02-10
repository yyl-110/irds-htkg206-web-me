<template>
  <div class="echarts-inner">
    <div id="centerEchart4"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue';
import * as echarts from 'echarts';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  echartAllData4: Object,
});

const uStore = useUserStore();
const __router = useRouter();
const collapsStatus = computed(() => {
  return true;
});
const configData = ref({});

watch(
  props.echartAllData4,
  (newVal, oldVal) => {
    configData.value.config = null;
    nextTick(() => {
      configData.value.config = newVal.config;
      init();
    });
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
    let chartDom = document.getElementById('centerEchart4');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      let option = null;
      option = configData.value.config;
      console.log('option :', option);
      option && myChart.setOption(option);
      if (booler) {
        myChart.resize();
      }

      myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)',
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      });

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
  height: 480px;
  margin-bottom: 10px;
  #centerEchart4 {
    width: 100%;
    height: 480px;
    margin: 0 auto;
  }
}
</style>
