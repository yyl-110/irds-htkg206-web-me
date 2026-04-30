<template>
  <div style="width: 100%; height: 100%">
    <!-- <v-chart :option="chartOption" class="chart" /> -->
    <table>
      <tr>
        <td style="width: 50%">
          <div class="chartDev">
            <div class="chartTitle">需求平均答复周期</div>
            <div class="chartMain">
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ lastAverageResponseCycle }}天</div>
                </div>
                <div class="pointTitle">{{ lastMonth }}</div>
              </div>
              <div style="width: 20%; display: flex; justify-content: center; align-items: center; margin-top: 20px">
                <img style="width: 40px; height: 40px" v-if="lastAverageResponseCycle < nowAverageResponseCycle" src="@/assets/data-screen/common/up.png" />
                <img style="width: 40px; height: 40px" v-else-if="lastAverageResponseCycle > nowAverageResponseCycle" src="@/assets/data-screen/common/down.png" alt="下降" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/data-screen/common/flat.png" />
              </div>
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ nowAverageResponseCycle }}天</div>
                </div>
                <div class="pointTitle">{{ nowMonth }}</div>
              </div>
            </div>
          </div>
        </td>
        <td width="40px;">&nbsp;&nbsp;</td>
        <td style="width: 50%">
          <div class="chartDev">
            <div class="chartTitle">需求及时实现率</div>
            <div class="chartMain">
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ lastImmediateImplementationRate }}%</div>
                </div>
                <div class="pointTitle">{{ lastMonth }}</div>
              </div>
              <div style="width: 20%; display: flex; justify-content: center; align-items: center; margin-top: 20px">
                <img style="width: 40px; height: 40px" v-if="lastImmediateImplementationRate < nowImmediateImplementationRate" src="@/assets/data-screen/common/up.png" />
                <img
                  style="width: 40px; height: 40px"
                  v-else-if="lastImmediateImplementationRate > nowImmediateImplementationRate"
                  src="@/assets/data-screen/common/down.png"
                  alt="下降" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/data-screen/common/flat.png" />
              </div>
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ nowImmediateImplementationRate }}%</div>
                </div>
                <div class="pointTitle">{{ nowMonth }}</div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 50%">
          <div class="chartDev">
            <div class="chartTitle">原始需求变更率</div>
            <div class="chartMain">
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ lastOriginalDemandChangeRate }}%</div>
                </div>
                <div class="pointTitle">{{ lastMonth }}</div>
              </div>
              <div style="width: 20%; display: flex; justify-content: center; align-items: center; margin-top: 20px">
                <img style="width: 40px; height: 40px" v-if="lastOriginalDemandChangeRate < nowOriginalDemandChangeRate" src="@/assets/data-screen/common/up.png" />
                <img style="width: 40px; height: 40px" v-else-if="lastOriginalDemandChangeRate > nowOriginalDemandChangeRate" src="@/assets/data-screen/common/down.png" alt="下降" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/data-screen/common/flat.png" />
              </div>
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ nowOriginalDemandChangeRate }}%</div>
                </div>
                <div class="pointTitle">{{ nowMonth }}</div>
              </div>
            </div>
          </div>
        </td>
        <td width="40px;">&nbsp;&nbsp;</td>
        <td>
          <div class="chartDev">
            <div class="chartTitle">中长期产品包需求比</div>
            <div class="chartMain">
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ lastMediumLongTermProductDemandRatio }}%</div>
                </div>
                <div class="pointTitle">{{ lastMonth }}</div>
              </div>
              <div style="width: 20%; display: flex; justify-content: center; align-items: center; margin-top: 20px">
                <img style="width: 40px; height: 40px" v-if="lastMediumLongTermProductDemandRatio < nowMediumLongTermProductDemandRatio" src="@/assets/data-screen/common/up.png" />
                <img
                  style="width: 40px; height: 40px"
                  v-else-if="lastMediumLongTermProductDemandRatio > nowMediumLongTermProductDemandRatio"
                  src="@/assets/data-screen/common/down.png"
                  alt="下降" />
                <img style="width: 40px; height: 40px" v-else src="@/assets/data-screen/common/flat.png" />
              </div>
              <div style="width: 40%">
                <div class="pointSquare">
                  <div class="pointItem">{{ nowMediumLongTermProductDemandRatio }}%</div>
                </div>
                <div class="pointTitle">{{ nowMonth }}</div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    default: () => {},
  },
});
const nowMonth = ref('');
const lastMonth = ref('');
const nowAverageResponseCycle = ref(0);
const nowImmediateImplementationRate = ref(0);
const nowOriginalDemandChangeRate = ref(0);
const nowMediumLongTermProductDemandRatio = ref(0);
const lastAverageResponseCycle = ref(0);
const lastImmediateImplementationRate = ref(0);
const lastOriginalDemandChangeRate = ref(0);
const lastMediumLongTermProductDemandRatio = ref(0);

const initChart = () => {
  let compareInfoList = props.chartData;
  if (compareInfoList.length >= 2) {
    lastMonth.value = compareInfoList[0].yearMonth;
    lastAverageResponseCycle.value = compareInfoList[0].averageResponseCycle;
    lastImmediateImplementationRate.value = (compareInfoList[0].immediateImplementationRate * 100).toFixed(1);
    lastOriginalDemandChangeRate.value = (compareInfoList[0].originalDemandChangeRate * 100).toFixed(1);
    lastMediumLongTermProductDemandRatio.value = (compareInfoList[0].mediumLongTermProductDemandRatio * 100).toFixed(1);
    nowMonth.value = compareInfoList[1].yearMonth;
    nowAverageResponseCycle.value = compareInfoList[1].averageResponseCycle;
    nowImmediateImplementationRate.value = (compareInfoList[1].immediateImplementationRate * 100).toFixed(1);
    nowOriginalDemandChangeRate.value = (compareInfoList[1].originalDemandChangeRate * 100).toFixed(1);
    nowMediumLongTermProductDemandRatio.value = (compareInfoList[1].mediumLongTermProductDemandRatio * 100).toFixed(1);
  }
};

watch(
  () => props.chartData,
  () => {
    initChart();
  },
  { deep: true }
);
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
.chartDev {
  opacity: 1;
  visibility: visible;
  width: 290px;
  height: 210px;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  box-shadow: none;
}
.chartTitle {
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #fff;
  padding-top: 20px;
  font-weight: bold;
}

.chartMain {
  display: flex;
}
.pointSquare {
  opacity: 1;
  display: flex;
  align-items: center;
  visibility: visible;
  width: 80px;
  height: 80px;
  background: #0882bf;
  pointer-events: auto;
  box-shadow: none;
  border-radius: 0px;
  margin-left: 20px;
  margin-top: 40px;
}

.pointItem {
  opacity: 1;
  visibility: visible;
  width: 60px;
  height: 60px;
  background: rgb(15, 56, 71);
  pointer-events: auto;
  box-shadow: none;
  border-radius: 100%;
  margin-left: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 15px;
  color: #fff;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.pointTitle {
  margin-left: 20px;
  margin-top: 5px;
  width: 80px;
  text-align: center;
  font-size: 13px;
  color: #fff;
  font-weight: bold;
}
</style>
