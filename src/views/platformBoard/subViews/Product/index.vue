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
                  showPhase
                  :phaseId="taskPhaseId"
                  @changePhase="changeTaskPhase"
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
                  showPhase
                  :phaseId="interactionPhaseId"
                  @changePhase="changeInteractionPhase"
                />
                <div class="wrap">
                  <interaction :chartData="mergedDeliveryCollab" />
                </div>
              </div>
              <div class="picture">
                <Title text="二维图纸进展" />
                <div class="pieWrap">
                  <drawing-progress :list="pdmPicList" />
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
import drawingProgress from './component/drawing-progress.vue';
import type { DrawingProgressItem } from './component/drawing-progress.vue';
import {
  collabStandaloneBoard,
  deliveryByDeptBoard,
  deliveryReport,
  getReportProjectList,
  getReportProjectPhaseList,
  pdmPicReport,
  productBoardProjectOverview,
} from '@/api/data-screen';
import { useIndexStore } from '@/store/data-screen';
import {
  USE_MOCK_DATA,
  MOCK_PRODUCT_INFO,
  MOCK_DELIVERY_INFO,
  MOCK_PDM_PIC_LIST,
} from './mock-data';

const router = useRouter();
const indexStore = useIndexStore();
const { updateProjectList, updateSelectProjectId, updatePhaseList } = indexStore;
const { selectProjectId, selectPhaseId } = storeToRefs(indexStore);

const overviewInfo = ref<Record<string, any>>({});
const productInfo = ref<Record<string, any>>({});
const deliveryInfo = ref<Record<string, any>>({});
const collabStandaloneInfo = ref<Record<string, any>>({});
const pdmPicRaw = ref<Record<string, any>>({});

const interactionPhaseId = ref('-1');
const taskPhaseId = ref('-1');

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

/** 项目交付看板：总任务数、协同任务数、独立应用数 */
function mergeDeliveryCollabData(
  delivery: Record<string, any>,
  collab: Record<string, any>,
) {
  const d = delivery || {};
  const c = collab || {};
  const keys = new Set([...Object.keys(d), ...Object.keys(c)]);
  if (!keys.size) return {};
  const out: Record<string, { totalCount: number; collabTaskCount: number; standaloneAppCount: number }> = {};
  keys.forEach((k) => {
    const rowD = d[k] || {};
    const rowC = c[k] || {};
    out[k] = {
      totalCount: Number(rowD.totalCount ?? rowD.totalPublishedCount ?? rowD.total_docs ?? rowC.totalPublishedCount) || 0,
      collabTaskCount: Number(rowC.collabTaskCount ?? rowC.collabPublished ?? rowD.collabPublished) || 0,
      standaloneAppCount: Number(rowC.standaloneAppCount ?? rowD.standaloneAppCount) || 0,
    };
  });
  return out;
}

const mergedDeliveryCollab = computed(() =>
  mergeDeliveryCollabData(deliveryInfo.value, collabStandaloneInfo.value),
);

const pdmPicList = computed<DrawingProgressItem[]>(() => mapPdmPicData(pdmPicRaw.value));

/** httpRequest 返回 Axios response，业务数据在 res.data */
function isApiSuccess(res: any) {
  const code = res?.data?.code;
  return code === 200 || code === 0 || code === '0';
}

function getApiData<T = any>(res: any): T | undefined {
  return res?.data?.data;
}

function normalizeMapData(raw: unknown): Record<string, any> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw as Record<string, any>;
}

function hasMapData(raw: Record<string, any>) {
  return Object.keys(raw || {}).length > 0;
}

function hasTaskBoardData(raw: Record<string, any>) {
  const tasks = raw?.taskNumsList;
  const phases = raw?.phaseList;
  return Array.isArray(tasks) && tasks.length > 0 && Array.isArray(phases) && phases.length > 0;
}

function hasDeliveryBoardData(raw: Record<string, any>) {
  return hasMapData(raw);
}

function mapPdmPicData(raw: Record<string, any>): DrawingProgressItem[] {
  if (!raw || typeof raw !== 'object') return [];
  return Object.keys(raw).map((title) => {
    const row = raw[title];
    if (row && typeof row === 'object') {
      return {
        title,
        data: {
          totalCount: Number(row.totalCount ?? row.total ?? row.taskNums ?? 0),
          archivedCount: Number(
            row.archivedCount ?? row.archived ?? row.completeNums ?? row.archivedNums ?? 0,
          ),
        },
      };
    }
    return { title, data: { totalCount: 0, archivedCount: 0 } };
  });
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

function applyTaskMock() {
  productInfo.value = {
    taskNumsList: MOCK_PRODUCT_INFO.taskNumsList,
    phaseList: MOCK_PRODUCT_INFO.phaseList,
  };
}

function applyDeliveryMock() {
  deliveryInfo.value = {};
  collabStandaloneInfo.value = { ...MOCK_DELIVERY_INFO };
}

function applyPdmPicMock() {
  pdmPicRaw.value = MOCK_PDM_PIC_LIST.reduce<Record<string, any>>((acc, item) => {
    acc[item.title] = { ...item.data };
    return acc;
  }, {});
}

const changeTime = (year: string) => {
  timeType.value = year;
  fetchProjectOverview();
};

const back = () => {
  router.back();
};

const changeTaskPhase = (val: string) => {
  taskPhaseId.value = val;
  fetchTaskData(val);
};

const changeInteractionPhase = (val: string) => {
  interactionPhaseId.value = val;
  fetchDeliveryBoardData();
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

/** 左下-项目任务（按项目+阶段） */
const fetchTaskData = async (val?: string) => {
  if (!selectProjectId.value) {
    if (USE_MOCK_DATA) applyTaskMock();
    return;
  }
  try {
    const phaseIdData = val ?? taskPhaseId.value ?? selectPhaseId.value;
    const res: any = await getReportProjectList({
      projectId: selectProjectId.value,
      phaseId: phaseIdData === '-1' ? '' : phaseIdData,
    });
    if (isApiSuccess(res)) {
      const data = getApiData(res) || {};
      if (hasTaskBoardData(data)) {
        productInfo.value = data;
        return;
      }
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) applyTaskMock();
};

const fetchDeliveryBoardData = async () => {
  deliveryInfo.value = {};
  collabStandaloneInfo.value = {};

  if (!selectProjectId.value) {
    if (USE_MOCK_DATA) applyDeliveryMock();
    return;
  }

  const phaseParam = interactionPhaseId.value === '-1' ? '' : interactionPhaseId.value;
  const req = { projectId: selectProjectId.value, phaseId: phaseParam };

  const loaders = [
    deliveryByDeptBoard(req),
    collabStandaloneBoard(req),
    deliveryReport(req),
  ];

  const results = await Promise.allSettled(loaders);
  results.forEach((result, index) => {
    if (result.status !== 'fulfilled' || !isApiSuccess(result.value)) return;
    const data = normalizeMapData(getApiData(result.value));
    if (!hasMapData(data)) return;
    if (index === 0 || index === 1) {
      collabStandaloneInfo.value = { ...collabStandaloneInfo.value, ...data };
    } else {
      deliveryInfo.value = { ...deliveryInfo.value, ...data };
    }
  });

  const merged = mergeDeliveryCollabData(deliveryInfo.value, collabStandaloneInfo.value);
  if (!hasDeliveryBoardData(merged) && USE_MOCK_DATA) {
    applyDeliveryMock();
  }
};

const fetchPdmPicReport = async () => {
  try {
    const res: any = await pdmPicReport({ projectId: selectProjectId.value });
    if (isApiSuccess(res)) {
      pdmPicRaw.value = getApiData(res) || {};
      if (Object.keys(pdmPicRaw.value).length) return;
    }
  } catch (error) {
    console.log('error:', error);
  }
  if (USE_MOCK_DATA) applyPdmPicMock();
};

const loadBoard = () => {
  fetchProjectOverview();
  if (!selectProjectId.value) {
    if (USE_MOCK_DATA) {
      applyTaskMock();
      applyDeliveryMock();
      applyPdmPicMock();
    }
    return;
  }
  interactionPhaseId.value = '-1';
  taskPhaseId.value = '-1';
  fetchTaskData();
  fetchDeliveryBoardData();
  fetchPdmPicReport();
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
  loadBoard();
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
          padding: 4px 8px 10px;
          gap: 4px;
        }

        .taskRight {
          flex: 1;
          min-width: 0;
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
