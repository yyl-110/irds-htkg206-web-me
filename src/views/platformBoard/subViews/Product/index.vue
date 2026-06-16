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
                <Title
                  text="项目任务"
                  showSelect
                  showMenu
                  :menuId="taskMenuId"
                  :menuOptions="menuOptions"
                  @changeMenu="changeTaskMenu"
                />
                <div class="taskBody">
                  <complete-pie :chartData="productInfo?.taskNumsList" />
                  <task-detail class="taskRight" :phaseList="productInfo?.phaseList" />
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="board">
                <Title
                  text="项目交付看板"
                  showSelect
                  showMenu
                  :menuId="deliveryMenuId"
                  :menuOptions="menuOptions"
                  @changeMenu="changeDeliveryMenu"
                />
                <div class="wrap">
                  <interaction :chartData="deliveryBoardData" />
                </div>
              </div>
              <div class="picture">
                <Title
                  text="活动页面引用"
                  showSelect
                  showMenu
                  :menuId="activityRankMenuId"
                  :menuOptions="menuOptions"
                  @changeMenu="changeActivityRankMenu"
                />
                <div class="pieWrap">
                  <activity-page-ref-rank :list="activityRefRankList" />
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
import completePie from './component/completePie.vue';
import productLine from './component/productLine.vue';
import taskDetail from './component/task-detail.vue';
import activityPageRefRank from './component/activity-page-ref-rank.vue';
import type { ActivityPageRefRankItem } from './component/activity-page-ref-rank.vue';
import {
  getReportProjectPhaseList,
  productBoardActivityPageRefRank,
  productBoardDeliveryByMenu,
  productBoardProjectOverview,
  productBoardTaskByMenu,
} from '@/api/data-screen';
import { fetchPlatformPickerList } from '@/utils/platformPickerList';
import { useIndexStore } from '@/store/data-screen';
import {
  USE_MOCK_DATA,
  MOCK_PRODUCT_INFO,
} from './mock-data';

const EMPTY_TASK_INFO = {
  taskNumsList: [
    { taskState: 2, taskNums: 0, taskStateName: '已完成' },
    { taskState: 1, taskNums: 0, taskStateName: '进行中' },
    { taskState: 3, taskNums: 0, taskStateName: '变更中' },
    { taskState: 0, taskNums: 0, taskStateName: '未开始' },
  ],
  phaseList: [] as Array<{ nodeName?: string; countNums?: number; sumNum?: number }>,
};

const router = useRouter();
const indexStore = useIndexStore();
const { updateProjectList, updateSelectProjectId, updatePhaseList } = indexStore;
const { selectProjectId } = storeToRefs(indexStore);

const overviewInfo = ref<Record<string, any>>({});
const productInfo = ref<Record<string, any>>({ ...EMPTY_TASK_INFO });
const deliveryBoardData = ref<Record<string, any>>({});
const activityRefRankList = ref<ActivityPageRefRankItem[]>([]);

const taskMenuId = ref<string | number>('');
const deliveryMenuId = ref<string | number>('');
const activityRankMenuId = ref<string | number>('');
const menuOptions = ref<Array<{ value: string | number; label: string }>>([]);

const list = ref([
  { title: '项目总数', num: 0, color: '#2A82E4' },
  { title: '在建项目', num: 0, color: '#FFAF1A' },
  { title: '完成项目', num: 0, color: '#43CF7C' },
  { title: '延期项目', num: 0, color: '#D43030' },
]);
const timeType = ref(new Date().getFullYear().toString());

const timeOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: `${year}年` };
  });
});

/** 项目交付看板：映射后端汇总字段 */
function mapDeliveryBoardData(raw: Record<string, any>) {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, { totalCount: number; collabTaskCount: number; standaloneAppCount: number }> = {};
  Object.keys(raw).forEach((key) => {
    const row = raw[key] || {};
    const collab = Number(row.collabPublished ?? row.collabTaskCount) || 0;
    const standalone = Number(row.standaloneAppCount) || 0;
    out[key] = {
      totalCount: Number(row.totalPublishedCount ?? row.totalCount) || collab + standalone,
      collabTaskCount: collab,
      standaloneAppCount: standalone,
    };
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

function normalizeTaskBoardData(raw: Record<string, any>) {
  const taskNumsList = Array.isArray(raw?.taskNumsList) && raw.taskNumsList.length
    ? raw.taskNumsList
    : EMPTY_TASK_INFO.taskNumsList;
  return {
    taskNumsList,
    phaseList: Array.isArray(raw?.phaseList) ? raw.phaseList : [],
  };
}

function applyOverviewMock() {
  overviewInfo.value = {
    totleNum: MOCK_PRODUCT_INFO.totleNum,
    inDesignNum: MOCK_PRODUCT_INFO.inDesignNum,
    completedNum: MOCK_PRODUCT_INFO.completedNum,
    postponementNum: MOCK_PRODUCT_INFO.postponementNum,
    project5List: [...MOCK_PRODUCT_INFO.project5List],
  };
  list.value = [
    { title: '项目总数', num: overviewInfo.value.totleNum, color: '#2A82E4' },
    { title: '在建项目', num: overviewInfo.value.inDesignNum, color: '#FFAF1A' },
    { title: '完成项目', num: overviewInfo.value.completedNum, color: '#43CF7C' },
    { title: '延期项目', num: overviewInfo.value.postponementNum, color: '#D43030' },
  ];
}

const changeTime = (year: string) => {
  timeType.value = year;
  fetchProjectOverview();
};

const back = () => {
  router.back();
};

const changeTaskMenu = (val: string | number) => {
  taskMenuId.value = val;
  fetchTaskData(val);
};

const changeDeliveryMenu = (val: string | number) => {
  deliveryMenuId.value = val;
  fetchDeliveryBoardData(val);
};

const changeActivityRankMenu = (val: string | number) => {
  activityRankMenuId.value = val;
  fetchActivityPageRefRank(val);
};

/** 左上-项目概览（按年度） */
const fetchProjectOverview = async () => {
  const year = Number(timeType.value) || new Date().getFullYear();
  try {
    const res: any = await productBoardProjectOverview({ year });
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

/** 左下-项目任务（按 menuId 汇总，无数据时展示空态，不走 Mock） */
const fetchTaskData = async (menuIdParam?: string | number) => {
  const menuId = menuIdParam ?? taskMenuId.value;
  if (!menuId) {
    productInfo.value = { ...EMPTY_TASK_INFO, phaseList: [] };
    return;
  }
  try {
    const res: any = await productBoardTaskByMenu({ menuId });
    if (isApiSuccess(res)) {
      productInfo.value = normalizeTaskBoardData(getApiData(res) || {});
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  productInfo.value = { ...EMPTY_TASK_INFO, phaseList: [] };
};

const ensureMenuOptionsLoaded = async () => {
  if (menuOptions.value.length) return;
  try {
    const list = await fetchPlatformPickerList();
    menuOptions.value = list.map((item) => ({
      value: item.id,
      label: item.categoryName || item.name || String(item.id),
    }));
  } catch (error) {
    console.log('error:', error);
  }
};

const ensureTaskMenuSelected = () => {
  if (!taskMenuId.value && menuOptions.value.length) {
    taskMenuId.value = menuOptions.value[0].value;
  }
};

const ensureDeliveryMenuSelected = () => {
  if (!deliveryMenuId.value && menuOptions.value.length) {
    deliveryMenuId.value = menuOptions.value[0].value;
  }
};

const ensureActivityRankMenuSelected = () => {
  if (!activityRankMenuId.value && menuOptions.value.length) {
    activityRankMenuId.value = menuOptions.value[0].value;
  }
};

/** 右上-项目交付看板（按 menuId 汇总，无数据时展示空态） */
const fetchDeliveryBoardData = async (menuIdParam?: string | number) => {
  const menuId = menuIdParam ?? deliveryMenuId.value;
  if (!menuId) {
    deliveryBoardData.value = {};
    return;
  }
  try {
    const res: any = await productBoardDeliveryByMenu({ menuId });
    if (isApiSuccess(res)) {
      deliveryBoardData.value = mapDeliveryBoardData(getApiData(res) || {});
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  deliveryBoardData.value = {};
};

/** 右下-活动页面引用排行（按 menuId，无 Mock） */
const fetchActivityPageRefRank = async (menuIdParam?: string | number) => {
  const menuId = menuIdParam ?? activityRankMenuId.value;
  if (!menuId) {
    activityRefRankList.value = [];
    return;
  }
  try {
    const res: any = await productBoardActivityPageRefRank({ menuId, limit: 10 });
    if (isApiSuccess(res)) {
      const data = getApiData(res);
      activityRefRankList.value = Array.isArray(data) ? data : [];
      return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  activityRefRankList.value = [];
};

const loadBoard = async () => {
  fetchProjectOverview();
  await ensureMenuOptionsLoaded();
  ensureTaskMenuSelected();
  ensureDeliveryMenuSelected();
  ensureActivityRankMenuSelected();
  fetchTaskData();
  fetchDeliveryBoardData();
  fetchActivityPageRefRank();
};

const ensureProjectSelected = async () => {
  if (selectProjectId.value) return;
  try {
    const res: any = await getReportProjectPhaseList();
    if (!isApiSuccess(res)) return;
    const list = getApiData(res) || [];
    if (!Array.isArray(list) || !list.length) return;
    updateProjectList(list);
    updateSelectProjectId(list[0]?.projectId);
    updatePhaseList(list[0]?.phaseList);
  } catch (error) {
    console.log('error:', error);
  }
};

onMounted(async () => {
  await ensureProjectSelected();
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
          align-items: center;
          min-height: 0;
          padding: 8px 12px 14px;
          gap: 12px;
        }

        .taskRight {
          flex: 1;
          min-width: 0;
          height: 100%;
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
