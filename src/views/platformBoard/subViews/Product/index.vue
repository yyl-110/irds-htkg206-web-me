<template>
  <div class="productContainer">
    <screen-container :width="1920" :height="1080">
      <div class="boardContainer">
        <header class="header">
          <img src="@/assets/data-screen/common/back.png" alt="" class="back" @click="back" />
          <img src="@/assets/data-screen/product/title.png" alt="" class="title" />
          <!-- 时间 -->
          <time-clock />
        </header>
        <main>
          <a-row style="height: 100%; padding: 30px" :gutter="18">
            <a-col :span="12">
              <div class="overview">
                <Title text="项目概览" showSelect showTime :timeOptions="timeOptions" @changeTime="changeTime" :defaultTime="timeType" />
                <div class="list">
                  <div class="item" v-for="(item, index) in list" :key="index">
                    <div>
                      <span class="count-style" :style="{ color: item.color }">{{ item.num }}</span>
                    </div>
                    <span>{{ item.title }}</span>
                  </div>
                </div>
                <div class="lineWrap">
                  <product-line chart-width="96%" :chartData="productInfo?.project5List" />
                </div>
              </div>
              <div class="task">
                <Title text="项目任务" showSelect showPhase :phaseId="taskPhaseId" @changePhase="changeTaskPhase" />
                <div class="taskBody">
                  <complete-pie :chartData="productInfo?.taskNumsList" />
                  <div class="taskRight">
                    <div class="platformBlock">
                      <div class="blockTitle">平台</div>
                      <div class="platformLines">
                        <div v-for="(row, idx) in platformPhaseLines" :key="'p-' + idx">
                          {{ row.nodeName }} {{ row.countNums }}/{{ row.sumNum }}
                        </div>
                      </div>
                      <div class="blockTitle blockTitleSub">已完成任务/全部</div>
                      <div class="phaseBarWrap">
                        <Overview :data="tailPhaseList" chart-width="100%" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="board">
                <Title text="项目交付看板" showSelect showPhase :phaseId="interactionPhaseId"
                  @changePhase="changeInteractionPhase" />
                <div class="wrap">
                  <interaction :chartData="mergedDeliveryCollab" />
                </div>
              </div>
              <div class="picture">
                <Title text="WBS协同与独立应用" />
                <div class="pieWrap">
                  <wbs-collab-standalone-bar :chartData="collabStandaloneInfo" />
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from "pinia";
import { LeftOutlined } from '@ant-design/icons-vue';
import ScreenContainer from '../../components/screen-container.vue';
import timeClock from "../../components/time-clock.vue";
import Title from "../../components/title.vue";
import Overview from "./component/overview.vue";
import interaction from "./component/interaction.vue";
import completePie from "./component/completePie.vue";
import productLine from "./component/productLine.vue";
import wbsCollabStandaloneBar from "./component/wbsCollabStandaloneBar.vue";
import {
  collabStandaloneBoard,
  deliveryReport,
  getReportProjectList,
} from "@/api/data-screen";
import { useIndexStore } from "@/store/data-screen";

const router = useRouter();
const indexStore = useIndexStore();
const { selectProjectId, selectPhaseId, projectList } = storeToRefs(indexStore);

const productInfo = ref<any>({});
const deliveryInfo = ref<any>({});
const collabStandaloneInfo = ref<Record<string, any>>({});

const interactionPhaseId = ref('-1'); // 项目交付看板阶段id
const taskPhaseId = ref("-1"); // 项目任务阶段id

const list = ref<any[]>([]);
const timeType = ref(new Date().getFullYear().toString())

const timeOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year.toString(),
      label: `${year}年`
    };
  });
});

/** 项目交付看板：与示意图一致为「总任务数、协同任务数、独立应用数」，按交付看板科室维度对齐 */
const mergedDeliveryCollab = computed(() => {
  const d = deliveryInfo.value;
  const c = collabStandaloneInfo.value || {};
  if (!d || typeof d !== "object" || !Object.keys(d).length) {
    return {};
  }
  const out: Record<string, { totalCount: number; collabTaskCount: number; standaloneAppCount: number }> = {};
  for (const k of Object.keys(d)) {
    const rowD = d[k] || {};
    const rowC = c[k] || {};
    out[k] = {
      totalCount: Number(rowD.total_docs) || 0,
      collabTaskCount: Number(rowC.collabPublished) || 0,
      standaloneAppCount: Number(rowC.standaloneAppCount) || 0,
    };
  }
  return out;
});

const platformPhaseLines = computed(() => (productInfo.value?.phaseList || []).slice(0, 3));

const tailPhaseList = computed(() => (productInfo.value?.phaseList || []).slice(3));

const changeTime = () => {}

const back = () => {
  router.back();
};

const changeTaskPhase = (val: string) => {
  taskPhaseId.value = val;
  fetchData(val);
};

const changeInteractionPhase = (val: string) => {
  interactionPhaseId.value = val;
  fetchDeliveryData();
  fetchCollabStandaloneData();
};

// 产品设计看板
const fetchData = async (val?: string) => {
  try {
    const phaseIdData = val ? val : selectPhaseId.value;
    const res: any = await getReportProjectList({
      projectId: selectProjectId.value,
      phaseId: phaseIdData === "-1" ? "" : phaseIdData,
    });
    if (res.code === "0" || res.code === 200) {
      productInfo.value = res.data;
      list.value = [
        {
          title: "项目总数",
          num: res.data.totleNum,
          color: "#2A82E4",
        },
        {
          title: "在建项目",
          num: res.data.inDesignNum,
          color: "#FFAF1A",
        },
        {
          title: "完成项目",
          num: res.data.completedNum,
          color: "#43CF7C",
        },
        {
          title: "延期项目",
          num: res.data.postponementNum,
          color: "#D43030",
        },
      ];
    }
  } catch (error) {
    console.log("error:", error);
  }
};

// 项目交付看板
const fetchDeliveryData = async () => {
  try {
    const res: any = await deliveryReport({
      phaseId:
        interactionPhaseId.value === "-1" ? "" : interactionPhaseId.value,
      projectId: selectProjectId.value,
    });
    if (res.code === "0" || res.code === 200) {
      deliveryInfo.value = res.data;
    }
  } catch (error) {
    console.log("error:", error);
  }
};

// WBS 协同任务 + 独立应用（按 WBS 一级分类）
const fetchCollabStandaloneData = async () => {
  try {
    const res: any = await collabStandaloneBoard({
      projectId: selectProjectId.value,
      phaseId:
        interactionPhaseId.value === "-1" ? "" : interactionPhaseId.value,
    });
    if (res.code === "0" || res.code === 200) {
      collabStandaloneInfo.value = res.data || {};
    }
  } catch (error) {
    console.log("error:", error);
  }
};

watch(
  () => selectProjectId.value,
  () => {
    if (selectProjectId.value) {
      interactionPhaseId.value = "-1";
      taskPhaseId.value = "-1";
      fetchData();
      fetchDeliveryData();
      fetchCollabStandaloneData();
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.productContainer {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/data-screen/common/commonBg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .boardContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      height: 97px;
      padding: 0 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url("@/assets/data-screen/common/headerBg.png");
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
      width: 100%;
      flex: 1;
      height: 0;

      .overview {
        width: 100%;
        height: 45%;
        background: rgba(2, 2, 2, 0.4);
        display: flex;
        flex-direction: column;

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
              background-image: url("@/assets/data-screen/product/groupBg.png");
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
          margin-top: 20px;
          width: 100%;
          flex: 1;
          min-height: 200px;
          display: flex;
          justify-content: center;
        }
      }

      .board {
        width: 100%;
        height: 45%;
        background: rgba(2, 2, 2, 0.4);
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
        display: flex;
        flex-direction: column;

        .pieWrap {
          flex: 1;
          width: 100%;
           display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }

      .task {
        width: 100%;
        background: rgba(2, 2, 2, 0.4);
        flex: 1;
        height: 0;
        display: flex;
        flex-direction: column;

        .taskBody {
          flex: 1;
          display: flex;
          align-items: stretch;
          min-height: 0;
          padding: 0 8px 10px;
          gap: 4px;
        }

        .taskRight {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          color: #fff;
        }

        .platformBlock {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .blockTitle {
          font-weight: bold;
          font-size: 15px;
          color: #69ccf6;
          margin: 4px 0 6px;
        }

        .blockTitleSub {
          margin-top: 10px;
          font-size: 14px;
        }

        .platformLines {
          font-size: 14px;
          line-height: 24px;
        }

        .platformLines div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .phaseBarWrap {
          flex: 1;
          min-height: 120px;
          display: flex;
          justify-content: center;
        }
      }
    }
     .ant-col {
      display: flex;
      flex-direction: column;
      row-gap: 18px;
    }
  }
}
</style>