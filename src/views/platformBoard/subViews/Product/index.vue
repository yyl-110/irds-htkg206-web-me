<template>
  <div class="productContainer">
    <screen-container :width="1920" :height="1080">
      <div class="boardContainer">
        <header class="header">
          <img src="@/assets/data-screen/common/back.png" alt="" class="back" @click="back" />
          <img src="@/assets/data-screen/product/title.png" alt="" class="title" />
          <time-clock />
        </header>
        <main>
          <a-row style="height: 100%; padding: 30px" :gutter="18">
            <a-col :span="12">
              <div class="overview">
                <Title
                  text="项目概览"
                  showSelect
                  showTime
                  :timeOptions="timeOptions"
                  @changeTime="changeTime"
                  :defaultTime="timeType"
                />
                <div class="list">
                  <div class="item" v-for="(item, index) in list" :key="index">
                    <div>
                      <span class="count-style" :style="{ color: item.color }">{{ item.num }}</span>
                    </div>
                    <span>{{ item.title }}</span>
                  </div>
                </div>
                <div class="lineWrap">
                  <product-line chart-width="96%" :chartData="overviewInfo?.project5List" />
                </div>
              </div>
              <div class="task">
                <Title text="各科室数据维护量统计" />
                <div class="taskBody">
                  <dept-data-maintain-bar :chartData="deptDataMaintainBoard" />
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="board">
                <Title text="各科室应用情况" />
                <div class="wrap">
                  <interaction :chartData="deliveryBoardData" />
                </div>
              </div>
              <div class="picture">
                <Title text="产品设计活跃用户Top10" />
                <div class="pieWrap">
                  <design-active-user-rank :list="designActiveUserRankList" />
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
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import ScreenContainer from '../../components/screen-container.vue';
import timeClock from '../../components/time-clock.vue';
import Title from '../../components/title.vue';
import interaction from './component/interaction.vue';
import deptDataMaintainBar from './component/dept-data-maintain-bar.vue';
import productLine from './component/productLine.vue';
import designActiveUserRank from './component/design-active-user-rank.vue';
import type { DesignActiveUserRankItem } from './component/design-active-user-rank.vue';
import {
  productBoardDesignActiveUserTop10,
  productBoardDeptAppByYear,
  productBoardDeptDataMaintainByMenu,
  productBoardProjectOverview,
} from '@/api/data-screen';
import { useIndexStore } from '@/store/data-screen';
import {
  USE_MOCK_DATA,
  MOCK_DELIVERY_INFO,
  MOCK_DEPT_DATA_MAINTAIN_INFO,
  MOCK_DESIGN_ACTIVE_USER_TOP10,
} from './mock-data';

const EMPTY_DEPT_DATA_MAINTAIN: Record<
  string,
  { activityPageCount: number; taskCreateCount: number; calcCreateCount: number }
> = {};

const router = useRouter();
const indexStore = useIndexStore();
const { updateProjectList, updateSelectProjectId, updatePhaseList } = indexStore;
const { selectProjectId } = storeToRefs(indexStore);

const overviewInfo = ref<Record<string, any>>({});
const deptDataMaintainBoard = ref<Record<string, any>>({ ...EMPTY_DEPT_DATA_MAINTAIN });
const deliveryBoardData = ref<Record<string, any>>({});
const designActiveUserRankList = ref<DesignActiveUserRankItem[]>([]);

const list = ref([
  { title: '项目总数', num: 0, color: '#2A82E4' },
  { title: '在建项目', num: 0, color: '#FFAF1A' },
  { title: '完成项目', num: 0, color: '#43CF7C' },
  { title: '延期项目', num: 0, color: '#D43030' },
]);
const timeType = ref('6');

const timeOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const options = [
    { value: '6', label: '近6个月' },
    { value: '12', label: '近12个月' },
  ];
  for (let year = currentYear; year >= 2024; year--) {
    options.push({ value: String(year), label: `${year}年` });
  }
  return options;
});

/** 各科室数据维护量：映射后端汇总字段（部门名 -> 活动页面/任务/计算创建数） */
function mapDeptDataMaintainBoardData(raw: Record<string, any> | Array<Record<string, any>>) {
  const normalizeRow = (row: Record<string, any>) => ({
    activityPageCount:
      Number(
        row.activityPageCount ??
          row.activityPageCreateCount ??
          row.activityPageNum ??
          row.activityPageCreateNum,
      ) || 0,
    taskCreateCount:
      Number(row.taskCreateCount ?? row.taskCount ?? row.taskCreateNum ?? row.taskNum) || 0,
    calcCreateCount:
      Number(
        row.calcCreateCount ??
          row.calculationCreateCount ??
          row.calcCount ??
          row.calcCreateNum,
      ) || 0,
  });

  if (Array.isArray(raw)) {
    const out: Record<
      string,
      { activityPageCount: number; taskCreateCount: number; calcCreateCount: number }
    > = {};
    raw.forEach((row) => {
      const deptName = row.deptName ?? row.departmentName ?? row.name;
      if (!deptName) return;
      out[deptName] = normalizeRow(row);
    });
    return out;
  }

  if (!raw || typeof raw !== 'object') return {};
  const out: Record<
    string,
    { activityPageCount: number; taskCreateCount: number; calcCreateCount: number }
  > = {};
  Object.keys(raw).forEach((key) => {
    out[key] = normalizeRow(raw[key] || {});
  });
  return out;
}

/** 各科室应用情况：映射后端汇总字段（部门名 -> 协同/独立/计算应用任务数） */
function mapDeptAppBoardData(raw: Record<string, any> | Array<Record<string, any>>) {
  const normalizeRow = (deptName: string, row: Record<string, any>) => {
    const collab = Number(row.collabTaskCount ?? row.collabPublished ?? row.collabDesignTaskCount) || 0;
    const standalone = Number(row.standaloneAppCount ?? row.standaloneAppTaskCount) || 0;
    const calcApp =
      Number(
        row.calcAppCount ??
          row.calculationAppCount ??
          row.calcApplicationCount ??
          row.calcAppTaskCount,
      ) || 0;
    return {
      collabTaskCount: collab,
      standaloneAppCount: standalone,
      calcAppCount: calcApp,
    };
  };

  if (Array.isArray(raw)) {
    const out: Record<
      string,
      { collabTaskCount: number; standaloneAppCount: number; calcAppCount: number }
    > = {};
    raw.forEach((row) => {
      const deptName = row.deptName ?? row.departmentName ?? row.name;
      if (!deptName) return;
      out[deptName] = normalizeRow(deptName, row);
    });
    return out;
  }

  if (!raw || typeof raw !== 'object') return {};
  const out: Record<
    string,
    { collabTaskCount: number; standaloneAppCount: number; calcAppCount: number }
  > = {};
  Object.keys(raw).forEach((key) => {
    out[key] = normalizeRow(key, raw[key] || {});
  });
  return out;
}

/** httpRequest 返回 Axios response，业务数据在 res.data */
function isApiSuccess(res: any) {
  const code = res?.data?.code;
  return code === 200 || code === 0 || code === '0';
}

function getApiData<T = any>(res: any): T | undefined {
  return res?.data?.data;
}

function applyOverviewMock() {
  overviewInfo.value = {
    totleNum: 16,
    inDesignNum: 16,
    completedNum: 0,
    postponementNum: 1,
    project5List: [
      { projectName: '45A 复兴号', completeNums: 62, taskNums: 100 },
      { projectName: '30-动力分散', completeNums: 48, taskNums: 100 },
      { projectName: 'J1-300动集', completeNums: 71, taskNums: 100 },
      { projectName: 'J11-DF11', completeNums: 55, taskNums: 100 },
      { projectName: '15-驾驶台', completeNums: 38, taskNums: 100 },
    ],
  };
  list.value = [
    { title: '项目总数', num: overviewInfo.value.totleNum, color: '#2A82E4' },
    { title: '在建项目', num: overviewInfo.value.inDesignNum, color: '#FFAF1A' },
    { title: '完成项目', num: overviewInfo.value.completedNum, color: '#43CF7C' },
    { title: '延期项目', num: overviewInfo.value.postponementNum, color: '#D43030' },
  ];
}

const changeTime = (val: string) => {
  timeType.value = val;
  fetchProjectOverview();
  fetchDeptDataMaintainBoard();
  fetchDeptAppBoardData();
  fetchDesignActiveUserTop10();
};

const back = () => {
  router.back();
};

/** 映射产品设计活跃用户 Top10（按协同设计、独立应用、计算总和排序） */
function mapDesignActiveUserRankData(raw: Array<Record<string, any>>): DesignActiveUserRankItem[] {
  const items = (Array.isArray(raw) ? raw : [])
    .map((row) => {
      const collabDesignCount =
        Number(
          row.collabDesignCount ??
            row.collabTaskCount ??
            row.collabCount ??
            row.collabDesignTaskCount,
        ) || 0;
      const standaloneAppCount =
        Number(row.standaloneAppCount ?? row.standaloneCount ?? row.standaloneAppTaskCount) || 0;
      const calcCount =
        Number(row.calcCount ?? row.calcAppCount ?? row.calculationCount ?? row.calcCreateCount) ||
        0;
      const totalCount =
        Number(row.totalCount ?? row.total ?? row.sumCount) ||
        collabDesignCount + standaloneAppCount + calcCount;
      return {
        userId: row.userId ?? row.id,
        userName: row.userName ?? row.name ?? row.realName ?? row.nickName ?? '',
        collabDesignCount,
        standaloneAppCount,
        calcCount,
        totalCount,
      };
    })
    .filter((item) => item.userName);

  return items
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/** 左上-项目概览（按时间范围） */
const fetchProjectOverview = async () => {
  try {
    const res: any = await productBoardProjectOverview({ timeType: timeType.value });
    if (isApiSuccess(res)) {
      overviewInfo.value = getApiData(res) || {};
      list.value = [
        { title: '项目总数', num: overviewInfo.value.totleNum ?? 0, color: '#2A82E4' },
        { title: '在建项目', num: overviewInfo.value.inDesignNum ?? 0, color: '#FFAF1A' },
        { title: '完成项目', num: overviewInfo.value.completedNum ?? 0, color: '#43CF7C' },
        { title: '延期项目', num: overviewInfo.value.postponementNum ?? 0, color: '#D43030' },
      ];
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) applyOverviewMock();
};

/** 左下-各科室数据维护量（按时间范围汇总，无数据时展示空态） */
const fetchDeptDataMaintainBoard = async () => {
  try {
    const res: any = await productBoardDeptDataMaintainByMenu({ timeType: timeType.value });
    if (isApiSuccess(res)) {
      deptDataMaintainBoard.value = mapDeptDataMaintainBoardData(getApiData(res) || {});
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) {
    deptDataMaintainBoard.value = mapDeptDataMaintainBoardData(MOCK_DEPT_DATA_MAINTAIN_INFO);
    return;
  }
  deptDataMaintainBoard.value = { ...EMPTY_DEPT_DATA_MAINTAIN };
};

function applyDeptAppBoardMock() {
  deliveryBoardData.value = mapDeptAppBoardData(MOCK_DELIVERY_INFO);
}

/** 右上-各科室应用情况（按左侧时间范围汇总，无数据时展示空态） */
const fetchDeptAppBoardData = async () => {
  try {
    const res: any = await productBoardDeptAppByYear({ timeType: timeType.value });
    if (isApiSuccess(res)) {
      deliveryBoardData.value = mapDeptAppBoardData(getApiData(res) || {});
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) {
    applyDeptAppBoardMock();
    return;
  }
  deliveryBoardData.value = {};
};

function applyDesignActiveUserTop10Mock() {
  designActiveUserRankList.value = mapDesignActiveUserRankData(MOCK_DESIGN_ACTIVE_USER_TOP10);
}

/** 右下-产品设计活跃用户 Top10（按时间范围，协同设计+独立应用+计算总和排序） */
const fetchDesignActiveUserTop10 = async () => {
  try {
    const res: any = await productBoardDesignActiveUserTop10({
      timeType: timeType.value,
      limit: 10,
    });
    if (isApiSuccess(res)) {
      const data = getApiData(res);
      designActiveUserRankList.value = mapDesignActiveUserRankData(
        Array.isArray(data) ? data : [],
      );
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) {
    applyDesignActiveUserTop10Mock();
    return;
  }
  designActiveUserRankList.value = [];
};

const loadBoard = async () => {
  fetchProjectOverview();
  fetchDeptDataMaintainBoard();
  fetchDeptAppBoardData();
  fetchDesignActiveUserTop10();
};

// const ensureProjectSelected = async () => {
//   if (selectProjectId.value) return;
//   try {
//     const res: any = await getReportProjectPhaseList();
//     if (!isApiSuccess(res)) return;
//     const list = getApiData(res) || [];
//     if (!Array.isArray(list) || !list.length) return;
//     updateProjectList(list);
//     updateSelectProjectId(list[0]?.projectId);
//     updatePhaseList(list[0]?.phaseList);
//   } catch (error) {
//     console.log('error:', error);
//   }
// };

onMounted(async () => {
  // await ensureProjectSelected();
  await loadBoard();
});

watch(() => selectProjectId.value, loadBoard);
</script>

<style lang="less" scoped>
.productContainer {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/data-screen/common/commonBg.png');
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
          align-items: stretch;
          margin-top: 16px;
          padding: 0 8px 8px;
          box-sizing: border-box;
        }
      }

      .picture {
        width: 100%;
        background: rgba(2, 2, 2, 0.4);
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;

        .pieWrap {
          flex: 1;
          width: 100%;
          min-height: 0;
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }
      }

      .task {
        width: 100%;
        background: rgba(2, 2, 2, 0.4);
        flex: 1;
        height: 0;
        display: flex;
        flex-direction: column;
        min-height: 0;

        .taskBody {
          flex: 1;
          display: flex;
          align-items: stretch;
          min-height: 0;
          padding: 4px 12px 10px;
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
