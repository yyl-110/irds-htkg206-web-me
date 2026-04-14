<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { message, Modal } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { encryptValue } from '@/utils';
import Empty from '@/components/Empty/index.vue';
import NoticeDetail from './components/notice-detail.vue';
/** 列表请求参数 */
const requestNoticeParams = reactive(new NoticePageRequestDTOModel());
const router = useRouter();
const userStore = useUserStore();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h({
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const viewTypeName = ref('任务卡片');
const isShowRigth = ref('收起');
const userInfoObj = ref<any>({
  name: '',
  departName: '',
});
const projectStatistics = ref<any>({});
const activeName = ref('myWork');
const taskIndex = ref('1');
// 定义问候语文本
const greetingText = ref('');
// 定时器标识，用于清除定时器
let timer = null;

// 待办任务统计 mock 数据
const todoChartData = ref({
  delay: 2,    // 延期
  todo: 4,     // 待办
  done: 7,     // 已办
  total: 13,   // 参与项目
});

let todoChartInstance: echarts.ECharts | null = null;

function initTodoChart() {
  const el = document.getElementById('eachart-main');
  if (!el) return;
  if (todoChartInstance) {
    todoChartInstance.dispose();
  }
  todoChartInstance = echarts.init(el);
  const { delay, todo, done, total } = todoChartData.value;
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 12,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 5,
      icon: 'circle',
      textStyle: {
        fontSize: 13,
        color: '#313133',
      },
      formatter: (name: string) => {
        const map: Record<string, number> = { '延期': delay, '待办': todo, '已办': done };
        return `${name}  ${map[name] ?? ''}`;
      },
    },
    series: [
      {
        name: '待办任务统计',
        type: 'pie',
        radius: ['48%', '70%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `{total|${total}}\n{sub|参与项目}`,
          rich: {
            total: {
              fontSize: 28,
              fontWeight: 'bold',
              color: '#313133',
              fontFamily: 'DIN Alternate, DIN Alternate',
              lineHeight: 36,
            },
            sub: {
              fontSize: 13,
              color: '#6A696E',
              lineHeight: 22,
            },
          },
        },
        emphasis: {
          label: { show: true },
          scaleSize: 5,
        },
        labelLine: { show: false },
        data: [
          { value: delay, name: '延期', itemStyle: { color: '#FF7C7C' } },
          { value: todo, name: '待办', itemStyle: { color: '#FFBA18' } },
          { value: done, name: '已办', itemStyle: { color: '#2B5FD9' } },
        ],
      },
    ],
  };
  todoChartInstance.setOption(option);
}

const tabList = reactive([
  {
    title: '平台公告',
    name: 'sysnotice',
    list: [],
  },
]);

/** 列表请求参数 */
const requestParams = reactive(new NoticePageRequestDTOModel());
requestParams.releaseFlag = 0;
requestParams.userid = userStore.getUser.id;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getNoticePage);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const powerModel = ref<any>(null);
const powVisible = ref<boolean>(false);
function handleClosePowModal() {
  powVisible.value = false;
}

function showRightContent() {
  if (isShowRigth.value == '展开') {
    isShowRigth.value = '收起';
  } else {
    isShowRigth.value = '展开';
  }
}

function getGreeting() {
  const hour = new Date().getHours(); // 获取当前小时数（0-23）

  if (hour >= 0 && hour < 6) {
    greetingText.value = '凌晨好';
  } else if (hour >= 12 && hour < 18) {
    // 12-18点 下午
    greetingText.value = '下午好';
  } else if (hour >= 18 && hour < 24) {
    // 18-24点 晚上
    greetingText.value = '晚上好';
  } else {
    // 6-12点 上午（兜底也显示上午好）
    greetingText.value = '上午好';
  }
}

async function getNoticePage() {
  // requestNoticeParams.currentPage = 1;
  // requestNoticeParams.numberPage = 10;
  // requestNoticeParams.title = '';
  // requestNoticeParams.type = '';
  // requestNoticeParams.releaseFlag = 1;
  // requestNoticeParams.userid = userStore.getUser.id;
  requestParams.currentPage = requestParams.pageNo;
  requestParams.numberPage = requestParams.pageSize;
  const res = await AdminApiSystemNotice.getNoticePageListToWork({ ...requestParams });
  if (res.data.code == 0 || res.data.code == 200) {
    tabList[0].list = res.data.data.list;
  }
}
/**
 * 详情查看页面
 */
async function seeDetailFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
  let data = res.data.data.systemNoticeInfoBaseDTO;
  let filedata = res.data.data;
  powVisible.value = true;
  nextTick(() => {
    powerModel.value.getDetailFromMain(data, filedata);
  });
}

// 页面挂载时执行一次，并设置定时器每分钟更新（避免时间变化后问候语不更新）
onMounted(() => {
  getNoticePage();
  getGreeting();
  // 每分钟更新一次，确保时间准确
  timer = setInterval(getGreeting, 60 * 1000);
  nextTick(() => {
    initTodoChart();
  });
});

// 页面卸载时清除定时器，避免内存泄漏
onUnmounted(() => {
  //clearInterval(timer);
  if (todoChartInstance) {
    todoChartInstance.dispose();
    todoChartInstance = null;
  }
});
</script>

<template>
  <div class="layout h-full">
    <div class="layout-content h-full">
      <div class="lf-cont" :style="{ marginRight: isShowRigth == '展开' ? '0' : '16px' }">
        <div class="top-wrap">
          <a-row style="height: 100%; width: 100%">
            <a-col :span="7">
              <a-card :hoverable="true" style="height: 108px">
                <div class="user-info">
                  <!-- <i :class="userInfoObj.sex == '男' ? 'man' : 'women'"></i> -->
                  <div class="pic"><img src="../../assets/workbench/people.png" alt="" /></div>
                  <div class="info">
                    <div class="name">{{ greetingText }}，{{ userInfoObj.name }}</div>
                    <div class="job">
                      部门：<span>{{ userInfoObj.departName }}</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :span="17">
              <div class="statistics-info">
                <a-card :hoverable="true" style="height: 108px">
                  <a-card-grid style="width: 20%; height: 108px">
                    <!-- @click="getActOnSbTo(1)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="num">
                        <span class="num-num" style="color: #124dd6">{{ projectStatistics.totalNum }}5</span>
                      </div>
                      <div class="type" style="margin-top: 20px; color: #6a696e">待办任务</div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center; height: 108px">
                    <div class="sta-list">
                      <div class="num">
                        <span class="num-num" style="color: #124dd6">{{ projectStatistics.participatedPlanProjectCount
                        }}6</span>
                      </div>
                      <div class="type" style="margin-top: 20px; color: #6a696e">审批待办</div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center; height: 108px">
                    <!-- @click="getActOnSbTo(4)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="num" :style="{ color: projectStatistics.deferredNum > 0 ? 'red' : '' }">
                        <span class="num-num">{{ projectStatistics.deferredNum }}2</span>
                      </div>
                      <div class="type" style="margin-top: 20px; color: #6a696e">延期任务</div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center; height: 108px">
                    <!-- @click="getActOnSbTo(3)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="num">
                        <span class="num-num" style="color: #124dd6">{{ projectStatistics.forwardNum }}6</span>
                      </div>
                      <div class="type" style="margin-top: 20px; color: #6a696e">转办任务</div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center; height: 108px">
                    <div class="sta-list">
                      <div class="num">
                        <span class="num-num">{{ projectStatistics.inNum }}9</span>
                      </div>
                      <div class="type" style="margin-top: 20px; color: #6a696e">参与项目</div>
                    </div>
                  </a-card-grid>
                </a-card>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="work-wrap">
          <div class="onoff-btn" v-if="activeName != 'processtask'">{{ viewTypeName }}</div>
          <a-tabs v-model="activeName" class="work_nav_top">
            <a-tab-pane key="myWork">
              <template #tab>
                产品设计任务<span v-if="projectStatistics.todoNum > 0">&nbsp;&nbsp;&nbsp;</span>
                <a-badge v-if="projectStatistics.todoNum > 0"
                  style="position: absolute; left: 43px; top: -0px; display: flex; justify-content: center"
                  :count="projectStatistics.todoNum" :overflow-count="99">
                </a-badge>
              </template>
              <a-tabs v-model="taskIndex" class="body_box"> </a-tabs>
            </a-tab-pane>
            <a-tab-pane key="processtask">
              <template #tab>
                审批 / 打分任务<span v-if="projectStatistics.flowNum > 0">&nbsp;&nbsp;&nbsp;</span>
                <a-badge v-if="projectStatistics.flowNum > 0"
                  style="position: absolute; left: 50px; top: -0px; display: flex; justify-content: center"
                  :count="projectStatistics.flowNum" :overflow-count="99">
                </a-badge>
              </template>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="rt-cont" :style="{ display: isShowRigth == '展开' ? 'none' : 'flex' }">
        <div class="rt-cont-list quick-entry">
          <div class="rt-cont-title">系统快速入口</div>
          <div class="cont-list">
            <div class="lis">
              <img src="../../assets/workbench/quick-entry-logo.png" />
              <span>快速入口</span>
            </div>
            <div class="lis">
              <img src="../../assets/workbench/quick-entry-logo.png" />
              <span>快速入口</span>
            </div>
            <div class="lis">
              <img src="../../assets/workbench/quick-entry-logo.png" />
              <span>快速入口</span>
            </div>
            <div class="lis">
              <img src="../../assets/workbench/quick-entry-logo.png" />
              <span>快速入口</span>
            </div>
          </div>
        </div>
        <div class="rt-cont-list project-statistics">
          <div class="rt-cont-title">待办任务统计</div>
          <div class="eachrts-wrap">
            <div id="eachart-main"></div>
          </div>
        </div>
        <div class="rt-cont-list announcement">
          <div class="rt-cont-title">通知公告</div>
          <div class="cont-list wei-scrollbar">
            <div class="news-list" v-for="(i, idx) in tabList[0].list" :key="idx">
              <img v-if="idx > 2" src="../../assets/workbench/news.png" />
              <img v-else src="../../assets/workbench/act-news.png" />
              <div class="news-cont">
                <div class="title" @click="seeDetailFun(i.id)">{{ i.title }}</div>
                <div class="detalis">平台公告 ｜{{ i.createTime.substring(0, 10) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="show-right-content-btn" @click="showRightContent">{{ isShowRigth }}</div>

  <a-card class="mt-[10px] b-body2">
    <NoticeDetail ref="powerModel" :modal-visible="powVisible" @close="handleClosePowModal" />
  </a-card>
</template>

<style lang="less" scoped>
@import '../../assets/css/workbench/workbench.less';

// :deep()
.box {
  height: 100%;
  width: 100%;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
  /*display: flex;*/
  /*flex-wrap:nowrap;*/
  /*justify-content:space-between;*/
  overflow-x: hidden;
  background: #fff;
  display: flex;
}

.work-list {
  margin: 0 10px;
  padding: 0;
  // height: 100vh;
  width: 80%;
  overflow: hidden;

  .tabs-main-wrap {
    background: #fff;
    padding-top: 10px;
    padding-right: 10px;
  }
}

.sysmsg-list-ref {
  width: 20%;
  height: 100%;
  overflow: hidden;
  background: #f7f8fa;

  .title {
    padding-left: 24px;
    padding-top: 16px;
    padding-bottom: 10px;
    font-size: 14px;
    color: #515a6e;
  }

  .tabs-wrap {
    background: #fff;
    padding-bottom: 10px;
    margin-top: 10px;
    overflow: hidden;

    .tab-pane-list {
      min-height: 30vh;
      max-height: 30vh;
    }

    .cell-group-wrap {
      margin-top: -10px;
      margin-left: -5px;
      height: calc(40vh - 10px);
      overflow-y: auto;
    }

    // .InfoItem {
    //   overflow: auto;
    // }
    .info-item {
      display: flex;
      justify-content: space-between;
      margin: 12px 0px;
      flex-wrap: nowrap;
      overflow: hidden;
      cursor: pointer;

      &-nums {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0px 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        color: var(--color);
        background-color: var(--background-color);
      }

      &-text {
        margin: 0px 0 0 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        line-height: 16px;
        width: 40%;

        &:hover {
          color: #2d8cf0;
        }
      }

      &-text-def {
        &:hover {
          color: #515a6e;
        }
      }

      &-time {
        margin-right: 10px;
        font-size: 12px;
        width: 60%;
        height: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
      }
    }
  }

  .fold-flag2 {
    padding: 0 10px;

    .fold-flag2-wrap {
      width: 100%;
      background: #fff;

      .title {
        height: 36px;
        line-height: 36px;
        padding-top: 0;
        border-bottom: 1px solid #f0f0f0;
      }

      :deep(.grid-wrap) {
        max-height: 70px;
        overflow: hidden;
      }

      :deep(.ivu-grid-item) {
        border-right: 1px solid #f0f0f0;
        box-shadow: none;
        cursor: pointer;

        &:hover {
          box-shadow: -3px 5px 8px 5px #eee;
          color: #2d8cf0;
        }
      }

      :deep(.ivu-grid-item-main) {
        padding: 0px !important;
        text-align: center;
        line-height: 70px;
        height: 70px;
        overflow: hidden;
      }
    }
  }
}

.elrow {
  height: 40px;
  margin-bottom: 10px;

  .grid-content {
    height: 100%;
    // background: rgb(225, 246, 255, 0.2);
    background: #f9f9f9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    border: 1px solid #f5f7fa;

    .act-btn {
      display: flex;
      align-items: center;
      margin-right: 15px;
      color: #1971ff;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: #1971ff;
      }
    }
  }
}

.top-title {
  height: 100%;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-collapse-item__header) {
  background: #f5f7fa;
}

.mg10 {
  margin-top: 10px;
}

.fast-wrap {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  height: 156px;
  overflow: hidden;

  .fast-list {
    width: 25%;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 10px;
    flex: 0 0 25%;

    &:hover {
      .tit {
        color: #1971ff;
      }
    }

    img {
      display: block;
      width: 40px;
      height: 40px;
      background: #ccc;
      border-radius: 4px;
      border: 1px solid #f6f6f6;
      margin: 0 auto;
      overflow: hidden;
    }

    .tit {
      font-size: 12px;
      color: #0c1116;
      text-align: center;
      margin: 3px auto 0 auto;
      height: 20px;
      max-width: 70px;
      overflow: hidden;
    }
  }
}

:deep(.layout) {
  padding: 0 0px 0px 0px !important;
}

// .user-selector-modal{
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

// :deep(.ant-table-tbody > tr > td) {
//   padding: 5px;
// }

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

.show-right-content-btn {
  position: fixed;
  bottom: 30px;
  right: 20px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  background: #124dd6;
  z-index: 10;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 0px solid #f0f0f0 !important;
}

:deep(.ant-tabs-tab) {
  margin-right: 0px !important;
}

/* 成员选择弹窗：固定高度，头部/搜索/底部固定，中间表格滚动 */
.member-modal-body {
  width: 100%;
  background: #fff;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  /* 固定高度，可根据需要调整 */
  height: 520px;
}

.member-search-row {
  padding: 12px 0;
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 3;
}

.member-table-wrap {
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
