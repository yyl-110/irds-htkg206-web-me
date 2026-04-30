<template>
  <div class="systemContainer">
    <screen-container :width="1920" :height="1080">
      <div class="screen-content-container">
        <header class="header">
          <img src="@/assets/data-screen/common/back.png" alt="" class="back" @click="back" />
          <img src="@/assets/data-screen/common/baseTitle.png" alt="" class="title" />
          <!-- 时间 -->
          <time-clock />
        </header>
        <main class="h-full">
          <a-row class="w-full" style="height: 100%; padding: 30px 24px 42px" :gutter="24">
            <a-col :span="8" style="height: 50%">
              <div class="demand">
                <Title text="需求来源分级报表" />
                <div class="wrap">
                  <demand-bar :chartData="visitReportInfo?.originalDemandSourceGrade" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div>
                <demand-total :chartData="demandYearInfo" />
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="knowledgeRank">
                <Title text="需求状态统计" showBtn>
                  <div @click="lookList" style="cursor: pointer">查看清单</div>
                </Title>
                <div class="wrap">
                  <demand-rank :chartData="visitReportInfo?.demandStatusCount" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="resourceTotal">
                <Title text="需求区域分类报表" />
                <div class="wrap">
                  <resource-bar :chartData="visitReportInfo?.demandRegionClassify" />
                </div>
              </div>
            </a-col>
            <a-col :span="16" style="height: 50%">
              <div class="knowledgeBoard">
                <Title text="需求管理应用记录" showSelect showTime :timeOptions="timeOptions" @changeTime="changeTime" :showPlatform="false" :showSeries="false" :showProject="false" />
                <div class="wrap">
                  <demand-board :chartData="visitReportInfo?.demandSourceMonth" :timeType="timeType" />
                </div>
              </div>
            </a-col>
          </a-row>
        </main>
      </div>
    </screen-container>
  </div>
  <module-demand-list ref="lookListRef" :lookListVisible="lookListVisible" @close="businessTemplateDialogCancel" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import ScreenContainer from '@/components/data-screen/screen-container.vue';
import timeClock from '@/components/data-screen/time-clock.vue';
import Title from '@/components/data-screen/title.vue';
import demandRank from './component/demandRank.vue';
import resourceBar from './component/resourceBar.vue';
import demandBoard from './component/demandBoard.vue';
import demandBar from './component/demandBar.vue';
import demandTotal from './component/demandTotal.vue';
import ModuleDemandList from './component/demandList.vue';
import { chartReportInfo, compareReportInfo } from '@/api/data-screen';
import dayjs from 'dayjs';

const timeOptions = [
  {
    value: '1',
    label: '近半年',
  },
  {
    value: '2',
    label: '近一年',
  },
];

const demandYearInfo = ref({});
const visitReportInfo = ref([]);
const timeType = ref('1');
const lookListVisible = ref(false);
const lookListRef = ref();

const fetchData = async () => {
  try {
    const res = await compareReportInfo({});
    if (res.code === '0' || res.code == 200) {
      demandYearInfo.value = res.data.compareInfoList;
    }
  } catch (error) {
    console.log('error:', error);
  }
};

async function chartReportInfoStr(type) {
  try {
    let data = {};
    if (type == 1) {
      //获取当前时间和半年前时间yyyy-mm-dd
      const startDate = new Date().getTime() - 1000 * 60 * 60 * 24 * 180;
      data = {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
      };
    } else if (type == 2) {
      const startDate = new Date().getTime() - 1000 * 60 * 60 * 24 * 365;
      //获取当前时间和一年前时间
      data = {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
      };
    } else {
      data = {};
    }
    const res = await chartReportInfo(data);
    if (res.code === '0' || res.code == 200) {
      visitReportInfo.value = res.data;
    }
  } catch (error) {
    console.log('error:', error);
  }
}

const back = () => {
  window.history.back();
};

const changeTime = val => {
  timeType.value = val;
  chartReportInfoStr(val);
};

const lookList = () => {
  lookListVisible.value = true;
  nextTick(() => {
    lookListRef.value?.fetchData();
  });
};

function businessTemplateDialogCancel() {
  lookListVisible.value = false;
}

onMounted(() => {
  fetchData();
  chartReportInfoStr(1);
});
</script>

<style lang="less" scoped>
.systemContainer {
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
      .knowledgeBoard {
        width: 100%;
        height: calc(100% - 24px);
        display: flex;
        flex-direction: column;
        margin-top: 24px;
        background: rgba(0, 0, 0, 0.3);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
        }
      }

      .resourceTotal {
        width: 100%;
        height: calc(100% - 24px);
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.3);
        margin-top: 24px;

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          padding: 0 10px;
        }
      }

      .knowledgeRank {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.3);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          padding: 0 10px;
        }
      }

      .demand {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.3);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
        }
      }

      .demandTotal {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.3);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
