<template>
  <div class="baseContainer">
    <screen-container :width="1920" :height="1080">
      <div class="screen-content-container">
        <header class="header">
          <img src="@/assets/data-screen/common/back.png" alt="" class="back" @click="back" />
          <img src="@/assets/data-screen/common/systemTitle.png" alt="" class="title" />
          <!-- 时间 -->
          <time-clock />
        </header>
        <main class="h-full">
          <a-row class="w-full" style="height: 100%; padding: 30px 24px 42px" :gutter="24">
            <a-col :span="8" style="height: 50%">
              <div class="userRank">
                <Title text="通用物料使用频次(TOP20)" />
                <div class="wrap">
                  <knowledge-rank :chartData="baseInfo?.applicationRanking" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="systemAvailable">
                <Title text="DFX数据汇总统计" />
                <div class="wrap">
                  <!-- <user-rank :userList="baseInfo?.activeUsersList" /> -->
                  <system-libraryList :chartData="baseInfo?.libraryList" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="totalVisitBoard">
                <Title text="系统可用率" />
                <div class="wrap">
                  <system-available :chartData="baseInfo?.systemAvailable" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="systemUser">
                <Title text="竞品数据汇总统计" />
                <div class="wrap">
                  <compar-chart :chartData="baseInfo?.competitorCount" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="memoryBoard">
                <Title text="通用计算数据统计" />
                <div class="wrap">
                  <check-chart :chartData="baseInfo?.checkLogs" />
                </div>
              </div>
            </a-col>
            <a-col :span="8" style="height: 50%">
              <div class="visitBoard">
                <Title text="内存占用情况" />
                <div class="wrap">
                  <memory-board :systemMemory="baseInfo?.systemMemory" />
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
import Title from '@/components/data-screen/title.vue';
import checkChart from './component/checkChart.vue';
import memoryBoard from './component/memoryBoard.vue';
import systemLibraryList from './component/systemLibraryList.vue';
import comparChart from './component/comparChart.vue';
import systemAvailable from './component/systemAvailable.vue';
import knowledgeRank from './component/knowledgeRank.vue';
import { getReportSystemList } from '@/api/data-screen';

const baseInfo = ref({});

const fetchData = async () => {
  try {
    const res = await getReportSystemList({});
    if (res.code === '0') {
      console.log(res, 999);
      baseInfo.value = res.data;
    }
  } catch (error) {
    console.log('error:', error);
  }
};

const back = () => {
  window.history.back();
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.baseContainer {
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
    height: 100%;    width: 100%;
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
      .systemUser {
        width: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);
        height: calc(100% - 20px);
        margin-top: 20px;

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          padding-left: 20px;
        }
      }

      .memoryBoard {
        width: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);
        height: calc(100% - 20px);
        margin-top: 20px;

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
        }
      }

      .totalVisitBoard {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          padding: 12px 16px;
        }
      }

      .userRank {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          // padding: 12px 16px;
        }
      }

      .systemAvailable {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
        }
      }

      .visitBoard {
        width: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(2, 2, 2, 0.4);
        height: calc(100% - 20px);
        margin-top: 20px;

        .wrap {
          width: 100%;
          flex: 1;
          height: 0;
          display: flex;
          justify-content: center;
          padding: 24px 12px;
        }
      }
    }
  }
}
</style>
