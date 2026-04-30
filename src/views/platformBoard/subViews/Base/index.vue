<template>
  <div class="productContainer">
    <screen-container :width="1920" :height="1080">
      <div class="screen-content-container">
        <header class="header">
          <img src="@/assets/data-screen/common/back.png" alt="" class="back" @click="back" />
          <img src="@/assets/data-screen/base/title.png" alt="" class="title" />

          <!-- 时间 -->
          <time-clock />
        </header>
        <main class="h-full">
          <a-row class="w-full" style="height: 100%; padding: 30px" :gutter="18">
            <a-col :span="12">
              <div class="overview">
                <Title text="产品规划概览" showSelect :optionsPlan="productInfoSel" @changePlan="changePlan" :showPlatform="false" :showProject="false" />
                <div class="list">
                  <div class="item" v-for="(item, index) in list" :key="index">
                    <div>
                      <count-to :startVal="0" :endVal="item.num" :duration="1000" :autoplay="true" :separator="','" class="count-style" :style="{ color: item.color }" />
                    </div>
                    <span>{{ item.title }}</span>
                  </div>
                </div>
                <div class="lineWrap">
                  <Overview :data="productInfo?.phaseList" />
                </div>
              </div>
              <div class="task">
                <Title text="规划任务统计及进度" showPhase :phaseId="taskPhaseId" />
                <div class="taskPie">
                  <complete-pie :chartData="productInfo?.taskNumsList" />
                  <product-line :chartData="productInfo?.project5List" />
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="board">
                <Title text="产品规划需求数量" showPhase :phaseId="interactionPhaseId" @changePhase="changeInteractionPhase" />
                <div class="statistics">
                  <knowledge-bar :chartData="productInfo?.knowledgeList" />
                </div>
              </div>
              <div class="board">
                <Title text="产品规划组合清单" />
                <div class="statistics">
                  <plan-combined :chartData="productInfo?.planCombinedList" />
                </div>
              </div>
            </a-col>
          </a-row>
        </main>
      </div>
    </screen-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import ScreenContainer from '@/components/data-screen/screen-container.vue';
import timeClock from '@/components/data-screen/time-clock.vue';
import CountTo from '@/components/data-screen/count-to.vue';
import Title from '@/components/data-screen/title.vue';
import Overview from './component/overview.vue';
import interaction from './component/interaction.vue';
import planCombined from './component/planCombined.vue';
import completePie from './component/completePie.vue';
import productLine from './component/productLine.vue';
import knowledgeBar from './component/knowledgeBar.vue';
import statistics from './component/statistics.vue';
import { deliveryReport, getProductPlanList, pdmPicReport, getReportModuleList } from '@/api/data-screen';
import { useIndexStore } from '@/store/data-screen';
import { storeToRefs } from 'pinia';
import { forEach } from 'lodash-es';

const indexStore = useIndexStore();
const { selectProjectId, selectPhaseId, projectList } = storeToRefs(indexStore);
const productInfo = ref({});
const productInfoSel = ref([]);
const moduleInfo = ref({});
const pdmPicReportList = ref([]);
const deliveryInfo = ref({});
const interactionPhaseId = ref('-1'); // 项目交付看板阶段id
const taskPhaseId = ref('-1'); // 项目任务阶段id
//产品规划列表获取
const fetchProductInfo = async () => {
  const res = await getProductPlanList({
    projectId: selectProjectId.value,
  });
  if (res.code === '0' || res.code == '200') {
    productInfo.value = res.data;
  }
};

//产品规划列表获取
const fetchProductInfo1 = async () => {
  productInfoSel.value = [];
  const res = await getProductPlanList({
    projectId: selectProjectId.value,
  });
  if (res.code === '0' || res.code == '200') {
    forEach(res.data.list, item => {
      item.num = item.taskNum;
      let items = {};
      items.label = item.planName;
      items.value = item.id;
      productInfoSel.value.push(items);
    });

    list.value = [
      {
        title: '规划总数',
        num: res.data.totleNum,
        color: '#2A82E4',
      },
      {
        title: '在建规划',
        num: res.data.inDesignNum,
        color: '#FFAF1A',
      },
      {
        title: '完成规划',
        num: res.data.completedNum,
        color: '#43CF7C',
      },
      {
        title: '延期规划',
        num: res.data.postponementNum,
        color: '#D43030',
      },
    ];
    productInfo.value = res.data;
  }
};

const list = ref([]);

const back = () => {
  window.history.back();
};

const changeTaskPhase = val => {
  taskPhaseId.value = val;
  fetchData(val);
};

const changeInteractionPhase = val => {
  interactionPhaseId.value = val;
  // fetchDeliveryData();
};

const changePlan = async projectId => {
  selectProjectId.value = projectId;
};

// 二位图纸进展
const fetchPdmPicReport = async () => {
  try {
    const res = await pdmPicReport({ projectId: selectProjectId.value });
    if (res.code === '0') {
      const keys = Object.keys(res.data);
      pdmPicReportList.value = keys.map(key => ({
        title: key,
        value: res.data[key],
      }));
    }
  } catch (error) {
    console.log('error:', error);
  }
};

// 产品设计看板

// 项目交付看板
const fetchDeliveryData = async () => {
  try {
    const res = await deliveryReport({
      phaseId: interactionPhaseId.value === '-1' ? '' : interactionPhaseId.value,
      projectId: selectProjectId.value,
    });
    if (res.code === '0') {
      deliveryInfo.value = res.data;
    }
  } catch (error) {
    console.log('error:', error);
  }
};

onMounted(() => {
  fetchProductInfo1();
});

watch(
  () => selectProjectId.value,
  () => {
    if (selectProjectId.value) {
      interactionPhaseId.value = '-1';
      taskPhaseId.value = '-1';
      fetchProductInfo();

      //fetchPdmPicReport();
      //fetchDeliveryData();
    }
  },
  { immediate: true }
);

// watch(
//   () => selectPhaseId.value,
//   () => {
//     if (selectPhaseId.value) {
//       interactionPhaseId.value = selectPhaseId.value;
//       taskPhaseId.value = selectPhaseId.value;
//       fetchDeliveryData();
//     }
//   },
//   { immediate: true }
// );
</script>

<style lang="less" scoped>
.productContainer {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  background-image: url('@/assets/data-screen/common/commonBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .screen-content-container {
    height: 100%; width: 100%;
    display: flex;
    flex-direction: column;

    .header {
      height: 97px; width: 100%;
      padding: 0 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('@/assets/data-screen/common/headerBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;

      .back {
        width: 35px;
        position: absolute;
        left: 80px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .title {
        width: 357px;
      }
    }

    main {
      height: 0; width: 100%; flex: 1;

      :deep(.ant-col) {
        height: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 18px;
      }

      .overview {
        width: 100%;
        height: 50%;
        background: rgba(2, 2, 2, 0.4);

        .list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 94px;

          .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            div {
              width: 80px;
              height: 80px;
              background-image: url('@/assets/data-screen/product/groupBg.png');
              background-repeat: no-repeat;
              background-size: 100% 100%;
              display: flex;
              align-items: center;
              justify-content: center;

              .count-style {
                font-size: 50px;
                font-weight: bold;
              }
            }

            span {
              font-size: 16px;
              color: #fff;
              line-height: 24px;
              margin-top: 10px;
            }
          }
        }

        .lineWrap {
          margin-top: 26px;
          width: 100%;
          height: 300px;
          display: flex;
          justify-content: center;
        }
      }

      .board {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }
      }

      .picture {
        width: 100%;
        background: rgba(2, 2, 2, 0.4);
        flex: 1;

        .pieWrap {
          .hint {
            color: #fff;
            width: 100%;
            text-align: right;
            // margin-top: 10px;
            padding-right: 20px;
          }

          .row1 {
            display: flex;
            justify-content: space-around;
            padding: 0;

            .pieItem {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .pie {
                width: 145px;
                height: 145px;
              }

              span {
                color: #fff;
                font-size: 18px;
                line-height: 24px;
              }
            }
          }

          .row2 {
            display: flex;
            justify-content: space-around;
            margin-top: 10px;

            .pieItem {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .pie {
                width: 145px;
                height: 145px;
              }

              span {
                color: #fff;
                font-size: 18px;
                line-height: 24px;
              }
            }
          }
        }
      }

      .task {
        width: 100%;
        height: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);

        .taskPie {
          flex: 1;
          display: flex;
          align-items: center;
        }
      }
    }

    .a-col {
      display: flex;
      flex-direction: column;
      row-gap: 18px;
    }
  }
}

.statistics {
  width: calc(100%);
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  margin: 0px;
}
</style>
