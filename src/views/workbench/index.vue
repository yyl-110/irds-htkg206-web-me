<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { message, Modal } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ReloadOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { encryptValue } from '@/utils';
import Empty from '@/components/Empty/index.vue';
import NoticeDetail from './components/notice-detail.vue';
import { WORKBENCH_TABS, MOCK_TODO_LIST } from './data';
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
const activeName = ref('todo');
const taskIndex = ref('1');

const searchQuery = ref('');
const secondaryFilter = ref('');
const viewMode = ref('grid'); // 'grid' | 'list'

const mockTodoList = ref(MOCK_TODO_LIST);
// 定义问候语文本
const greetingText = ref('');
// 定时器标识，用于清除定时器
let timer = null;

const todoColumns = [
  { title: '任务名称', dataIndex: 'title', key: 'title', ellipsis: true, width: 250 },
  { title: '标签', dataIndex: 'tags', key: 'tags', width: 150 },
  { title: '任务类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '项目时间', key: 'time', width: 200 },
  { title: '当前进度', dataIndex: 'progress', key: 'progress', width: 150 },
  { title: '状态', key: 'status', width: 120 },
  { title: '创建人', dataIndex: 'creatorName', key: 'creatorName', width: 100 },
  { title: '操作', key: 'action', width: 80, align: 'center' }
];
const rowClassName = (_record: any, index: number) =>
  index % 2 === 1 ? "table-striped" : "";

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
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 3
        },
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

const tabs = reactive(WORKBENCH_TABS);

const getTagClass = (tag: string) => {
  if (tag === '延') return 'tag-red';
  if (tag === '转') return 'tag-blue';
  if (tag === '待办') return 'tag-yellow';
  return 'tag-default';
}

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
          <a-tabs v-model:activeKey="activeName" class="work_nav_top">
            <template #rightExtra>
              <a-input v-model:value="searchQuery" placeholder="请输入项目名称/项目编号" style="width: 240px; border-radius: 4px;">
                <template #suffix>
                  <search-outlined style="color: rgba(0,0,0,.45)" />
                </template>
              </a-input>
            </template>
            <a-tab-pane v-for="item in tabs" :key="item.name">
              <template #tab>
                <div :class="['text-[16px]', { 'font-bold': activeName === item.name }]"
                  :style="{ color: activeName === item.name ? '#124dd6' : '' }">
                  {{ item.title }}<span
                    v-if="item.name === 'todo' && projectStatistics.todoNum > 0">&nbsp;&nbsp;&nbsp;</span>
                  <a-badge v-if="item.name === 'todo' && projectStatistics.todoNum > 0"
                    style="position: absolute; left: 43px; top: -0px; display: flex; justify-content: center"
                    :count="projectStatistics.todoNum" :overflow-count="99">
                  </a-badge>
                </div>
              </template>

              <div class="task-content h-full flex flex-col" v-if="item.name === 'todo'">
                <div class="filter-bar flex justify-between items-center mb-[16px] mt-[8px]">
                  <div class="capsule-group flex gap-[12px]">
                    <div class="capsule" :class="{ active: secondaryFilter === '' }" @click="secondaryFilter = ''">全部
                    </div>
                    <div class="capsule" :class="{ active: secondaryFilter === 'delay' }"
                      @click="secondaryFilter = 'delay'">延期待办
                    </div>
                    <div class="capsule" :class="{ active: secondaryFilter === 'transfer' }"
                      @click="secondaryFilter = 'transfer'">
                      转办待办</div>
                    <div class="capsule" :class="{ active: secondaryFilter === '5days' }"
                      @click="secondaryFilter = '5days'">近5日待办
                    </div>
                    <div class="capsule" :class="{ active: secondaryFilter === '15days' }"
                      @click="secondaryFilter = '15days'">
                      近15日待办
                    </div>
                  </div>
                  <div class="view-toggles flex gap-[16px] text-[18px]">
                    <appstore-outlined
                      :class="{ 'text-[var(--ant-primary-color)]': viewMode === 'grid', 'text-[#999]': viewMode !== 'grid' }"
                      class="cursor-pointer" @click="viewMode = 'grid'" />
                    <unordered-list-outlined
                      :class="{ 'text-[var(--ant-primary-color)]': viewMode === 'list', 'text-[#999]': viewMode !== 'list' }"
                      class="cursor-pointer" @click="viewMode = 'list'" />
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto overflow-x-hidden wei-scrollbar">
                  <template v-if="viewMode === 'grid'">
                    <a-row :gutter="[16, 16]">
                      <a-col flex="0 0 380px" style="width: 380px; max-width: 380px;" v-for="item in mockTodoList" :key="item.id">
                        <div class="task-card">
                          <div class="tc-header flex justify-between items-start">
                            <div class="title-wrap flex items-center flex-1 pr-[8px] overflow-hidden">
                              <span class="title-text truncate font-bold text-[16px] text-[#313133]"
                                :title="item.title">{{
                                  item.title
                                }}</span>
                              <span v-for="tag in item.tags" :key="tag" class="tc-tag flex-shrink-0"
                                :class="getTagClass(tag)">{{ tag
                                }}</span>
                            </div>
                            <ellipsis-outlined class="text-[20px] text-[#999] cursor-pointer mt-[2px]" />
                          </div>

                          <div class="tc-body mt-[16px] space-y-[12px] text-[14px] text-[#6A696E]">
                            <div class="flex">
                              <span class="w-[75px] flex-shrink-0">项目时间：</span>
                              <span>{{ item.startTime }} ~ {{ item.endTime }}</span>
                            </div>
                            <div class="flex">
                              <span class="w-[75px] flex-shrink-0">任务类型：</span>
                              <span>{{ item.type }}</span>
                            </div>
                            <div class="flex justify-between items-center pr-[10px]">
                              <div class="flex">
                                <span class="w-[75px] flex-shrink-0">当前进度：</span>
                                <span class="text-[#313133] font-bold">{{ item.progress }}%</span>
                              </div>
                              <span v-if="item.delayDays" class="text-[#FF4D4F]">已延期 {{ item.delayDays }} 天</span>
                              <span v-else-if="item.remainDays" class="text-[#6A696E]">距截止还剩 {{ item.remainDays }}
                                天</span>
                            </div>
                            <a-progress :percent="item.progress" :show-info="false" :stroke-width="8"
                              :trail-color="'#F0F0F0'"
                              :class="['mt-[8px]', '!mb-0', item.delayDays ? 'delay-progress' : 'normal-progress']" />
                          </div>

                          <div class="tc-footer mt-[12px] flex items-center text-[14px] text-[#6A696E]">
                            <span class="w-[60px] flex-shrink-0">创建人：</span>
                            <div class="creator-badge flex items-center bg-[#F4F4F5] rounded-[14px] px-[8px] py-[3px]">
                              <img v-if="item.creatorAvatar" :src="item.creatorAvatar"
                                class="w-[20px] h-[20px] rounded-full mr-[6px]" />
                              <img v-else src="../../assets/workbench/people.png"
                                class="w-[20px] h-[20px] rounded-full mr-[6px]" />
                              <span>{{ item.creatorName }}</span>
                            </div>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                  
                  <template v-else>
                    <a-table 
                      :columns="todoColumns" 
                      :data-source="mockTodoList" 
                      :row-class-name="rowClassName"
                      :pagination="false"
                      :row-key="record => record.id"
                      bordered
                      class="bg-white"
                      :scroll="{x: 600}"
                    >
                      <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'title'">
                          <span class="font-bold text-[#313133]">{{ record.title }}</span>
                        </template>
                        <template v-if="column.key === 'tags'">
                          <span v-for="tag in record.tags" :key="tag" class="tc-tag flex-shrink-0 inline-block mr-[4px]" :class="getTagClass(tag)">{{ tag }}</span>
                        </template>
                        <template v-if="column.key === 'time'">
                          {{ record.startTime }} ~ {{ record.endTime }}
                        </template>
                        <template v-if="column.key === 'progress'">
                          <div class="flex items-center gap-[8px]">
                            <span class="text-[#313133] font-bold w-[30px]">{{ record.progress }}%</span>
                            <a-progress class="flex-1 !mb-0" :percent="record.progress" :show-info="false" :stroke-width="8" :trail-color="'#F0F0F0'" :class="record.delayDays ? 'delay-progress' : 'normal-progress'" />
                          </div>
                        </template>
                        <template v-if="column.key === 'status'">
                          <span v-if="record.delayDays" class="text-[#FF4D4F]">已延期 {{ record.delayDays }} 天</span>
                          <span v-else-if="record.remainDays" class="text-[#6A696E]">距截止还剩 {{ record.remainDays }} 天</span>
                        </template>
                        <template v-if="column.key === 'creatorName'">
                          <div class="flex items-center">
                            <img v-if="record.creatorAvatar" :src="record.creatorAvatar" class="w-[20px] h-[20px] rounded-full mr-[6px]" />
                            <img v-else src="../../assets/workbench/people.png" class="w-[20px] h-[20px] rounded-full mr-[6px]" />
                            <span>{{ record.creatorName }}</span>
                          </div>
                        </template>
                        <template v-if="column.key === 'action'">
                          <a class="text-primary cursor-pointer text-[14px]">详情</a>
                        </template>
                      </template>
                    </a-table>
                  </template>
                </div>
              </div>
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

  <!-- 公告详情为 Modal，勿再套 b-body2（会占 calc(100vh-205px) 高度与主区叠成双屏滚动） -->
  <div class="workbench-notice-mount">
    <NoticeDetail ref="powerModel" :modal-visible="powVisible" @close="handleClosePowModal" />
  </div>
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
  background: var(--ant-primary-color);
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

.capsule {
  padding: 4px 16px;
  background: #F4F4F5;
  border-radius: 16px;
  font-size: 14px;
  color: #6A696E;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--ant-primary-color, #124dd6);
  }

  &.active {
    background: #E6EAFF;
    color: var(--ant-primary-color, #124dd6);
    font-weight: 500;
  }
}

.task-card {
  background: #FFFFFF;
  border: 1px solid #EAEAF1;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--ant-primary-color, #124dd6);
  }
}

.tc-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;

  &.tag-red {
    background: #FF4D4F;
    color: #FFF;
  }

  &.tag-blue {
    background: #2B5FD9;
    color: #FFF;
  }

  &.tag-yellow {
    border: 1px solid #FAAD14;
    color: #FAAD14;
    background: #FFFBE6;
  }
}

/* 占位不占纵向流式高度，避免与 .layout 叠出整页外侧滚动条 */
.workbench-notice-mount {
  height: 0;
  overflow: visible;
  position: relative;
}

.delay-progress :deep(.ant-progress-bg) {
  background: linear-gradient(270deg, #FF7864 2.51%, #FF584B 72.46%) !important;
}

.normal-progress :deep(.ant-progress-bg) {
  background: linear-gradient(270deg, #6F86FA 2.51%, #1A58E8 72.46%) !important;
}
</style>
