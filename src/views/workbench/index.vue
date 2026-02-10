<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { message, Modal } from 'ant-design-vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import HomeTaskTable from './components/HomeTaskTable.vue';
import { AdminApiWorkbench } from '@/api/tags/workbench/工作台';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { WorkBenchPageRequestDTOModel } from '@/api/models/workbench/WorkBenchPageRequestDTOModel';
import { WorkBenchTaskPageRequestDTOModel } from '@/api/models/workbench/WorkBenchTaskPageRequestDTOModel';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import planTaskWork from './components/planTaskWork.vue';
import processtaskTable from './components/processtaskTable.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
// import { downloadFile } from '@/config/commonMethod';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { encryptValue } from '@/utils';
import Empty from '@/components/Empty/index.vue';
import NoticeDetail from './components/notice-detail.vue';
const router = useRouter();
/** 列表请求参数 */
const requestUserParams = reactive(new WorkBenchPageRequestDTOModel());

/** 列表请求参数 */
const requestNoticeParams = reactive(new NoticePageRequestDTOModel());

/** 列表请求参数 */
const requestTaskParams = reactive(new WorkBenchTaskPageRequestDTOModel());

const taskTable = ref<any>(null);
const taskManaementRef = ref();
const processtaskTableRef = ref();
const calculateColumnData = ref([]);
const loading = ref<boolean>(false);
const tabIndex = ref(0);
const announcementDetailsTitle = ref('');
const announcementDetailsWindow = ref(false);
const announcementDetailsContent = ref('');
const pdfSrc = ref('');
const taskIndex = ref('1');
const productPlanIndex = ref('1');
const ProcessTaskIndex = ref('4');
const definitionDialog = ref(false); // 定义任务
const definitionFos = ref({}); // 编辑当前数据
const relevantData = ref({}); // 相关文件
const relevantString = ref(''); // 相关文件解释
const workExplainString = ref(''); // 工作说明
const userStore = useUserStore();
const loginPlace = reactive({
  userId: userStore.getUser.id,
});
// 添加项目的表单结构
const formValidate = reactive({});
const tabList = reactive([
  {
    title: '平台公告',
    name: 'sysnotice',
    list: [],
  },
]);
const activeName = ref('myWork');
const mySendTaskData = ref<any>([]);
const isSendTask = ref(false);
const loadingPro = ref<boolean>(false);
// ————————
const memberDialogDesign = ref(false); // 选择角色弹窗
const radio = ref(''); // 角色选择
const memberPrimitiveData = ref([]); // 角色列表
const dialogDesign = ref(false); // 任务详情弹窗
const activeDesign = ref('first'); // 项目tab
const fosTask = ref({}); // 当前操作的任务
const platformTableData = ref([]); // 系列参数列表
const gbomPlatformTableData = ref([]); // 获取bom参数定义
const memberData = reactive([{ member: '设计经理' }, { member: '机械主管' }, { member: '电气主管' }]);
const enParameterList = ref([]);
const enInventoryData = ref([]); //模块清单表头
const enInventoryColumnList = ref([]); //模块清单数据
const enModuleParaList = ref([]); // 模块清单详情数据
const enDesignModul = ref(false); // 模块详情弹窗
const enDesignName = ref('模块参数'); // 模块名称
const enCollapseNames = ref('1');
const fosModule = ref({}); //需要操作的模块数据
const attachmentListData = ref([]); //本地文件预览
const pdmResultData = ref([]); //pdm文件打开
const getGbomData = ref([]); //bom数据
const definitionTaName = ref('输入配置'); // 工程师任务定义配置tap
const definitionCollapseNames = ref(['系统参数', '相关文件', '模块清单', '工作说明描述', '查核项配置', '文件类', '三维模型工程图', '工作完成描述']); // 工程师任务定义配置Collapse
const pdfName = ref('');
const pdfDetail = ref(false);
const bomInfoData = ref([]); //编辑应用结构
const actionPlaceUrl = ref(''); // 本地上传

const fileListData = ref([]); // 文件类列表
// const filteredEnModuleParaList = computed(() => {
//   return enModuleParaList.value.filter(item => item.columnProperties === 1);
// });
// const filterDefinedParaList = computed(() => {
//   return enModuleParaList.value.filter(item => item.columnProperties !== 1);
// });
const applicationEditFlag = ref(false); // 编辑应用弹窗
const getDefinitionData = ref({}); //获取任务定义详情
const dimensionalString = ref(''); //三维图描述
const accomplishString = ref(''); // 工作完成描述
const chIds = ref([]); // 第三轮查核数据选择
const mulchRef = ref();
const auditDataListData = ref([]); //获取任务定义关联的查核数据
const fosAuditData = ref({}); // 编辑查核库说明当前数据
const auditDialog = ref(false); // 编辑查核库说明
const auditExplainStr = ref(''); // 查核库说明
const isWhether = ref(false); // 是否已经提交
const chAuditData = ref([]); // 查核库数据
const userInfoObj = ref<any>({
  name: '',
  departName: '',
});
const timeQuantum = ref();
const __router = useRouter();
const viewType = ref('card');
const viewTypeName = ref('任务卡片');
const projectStatistics = ref<any>({});
const pieData = ref();
const isShowRigth = ref('展开');
const projectParametersArr = ref([]);
const isShowDialog = ref(false);
const versionData = ref([]);
const seeTaskStatus = ref(true);
const finishType = ref(); //1-近五天要完工 2-近15天要完工 3-超期任务
const projectNameKeywords = ref(''); // 项目名称
const codeKeywords = ref(''); // 项目编号
const nameKeywords = ref(''); // 任务名称
const selectedUserRowList = ref<any[]>([]);
const types = ref();
const designPage = reactive({
  currentPage: 1,
  numberPage: 10,
  total: 0,
});
/** 主表格勾选事件 */
const rowSelectionUser: TableProps['rowSelection'] = {
  type: 'radio',
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedUserRowList.value = selectedRows;
  },
};
const usercolumns = ref<TableColumnType[]>([
  {
    title: WeiI18n.$t('成员'),
    dataIndex: 'userName',
    key: 'userName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
    width: 200,
  },
  {
    title: WeiI18n.$t('工号'),
    dataIndex: 'userId',
    key: 'userId',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.userId, b.userId),
    width: 300,
  },
  {
    title: WeiI18n.$t('PDM职位'),
    dataIndex: 'roleName',
    key: 'roleName',
    align: 'left',
    resizable: false,
    sorter: (a: any, b: any) => sortermethod(a.roleName, b.roleName),
    width: 300,
  },
]);
// 产品设计任务tap
const ProductDesignTabLabelList = reactive([
  {
    label: '待办',
    id: 1,
    isActive: true,
  },
  {
    label: '已办',
    id: 3,
    isActive: false,
  },
  {
    label: '已转办',
    id: 4,
    isActive: false,
  },
  {
    label: '全部',
    id: 5,
    isActive: false,
  },
  {
    label: '我发起的',
    id: 6,
    isActive: false,
  },
]);
//产品规划任务tap
const tabLabelList = reactive([
  {
    label: '待办',
    id: 1,
    isActive: true,
  },
  {
    label: '已办',
    id: 3,
    isActive: false,
  },
  {
    label: '已转办',
    id: 4,
    isActive: false,
  },
  {
    label: '全部',
    id: 5,
    isActive: false,
  },
]);
//工作台系统审批任务tap
const tabProcessTaskList = reactive([
  {
    label: '我的待办',
    id: 4,
    isActive: false,
  },
  {
    label: '我发起的',
    id: 1,
    isActive: true,
  },
  {
    label: '我处理的',
    id: 2,
    isActive: false,
  },
  {
    label: '全部',
    id: 3,
    isActive: false,
  },
]);

const taskData = ref<any>([]); // 工作台数据
const taskloading = ref(false); // 工作台loading
function onShowSizeChange(current: number, pageSize: number) {
  designPage.currentPage = current;
  designPage.numberPage = pageSize;
  if (activeName.value == 'myWork') {
    if (taskIndex.value == '5') {
      getMySendTask();
    } else {
      getTaskPage();
    }
  }
}
async function getUserInfo() {
  requestUserParams.userid = userStore.getUser.id;
  const res = await AdminApiSystemUserProfile.profile({ id: `${userStore.getUser.id}` });
  userInfoObj.value.name = res.data.data.nickname;
  userInfoObj.value.departName = res.data.data.dept.name;
}

async function getCkProjectEstimator() {
  requestUserParams.userId = userStore.getUser.id;
  const res = await AdminApiWorkbench.getCkProjectEstimatorApiV1({ ...requestUserParams });
  projectStatistics.value = res.data.data.projectStatistics;
  pieData.value = res.data.data.pieData;
  echartsInit();
}

function echartsInit() {
  var chartDom = document.getElementById('eachart-main');
  if (chartDom) {
    var myChart = chartDom && echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '5%',
        left: 'center',
        formatter: function (name) {
          let nameStr = '';
          pieData.value.forEach(item => {
            if (item.name == name) {
              nameStr = name + ' ' + item.value;
            }
          });
          return nameStr;
        },
      },
      series: [
        {
          name: '待办任务统计',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '38%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData.value
            ? pieData.value
            : [
                { value: 1048, name: '待办' },
                { value: 735, name: '已办' },
                { value: 580, name: '已转办' },
              ],
        },
      ],
    };

    option && myChart.setOption(option);
  }
}

function changeViewType() {
  let type = viewType.value;
  if (type == 'card') {
    viewType.value = 'table';
    viewTypeName.value = '任务列表';
  } else {
    viewType.value = 'card';
    viewTypeName.value = '任务卡片';
  }
  if (taskIndex.value == '5') {
    getMySendTask();
    isSendTask.value = true;
  } else {
    getTaskPage();
    isSendTask.value = false;
  }
}

async function getMySendTask() {
  taskloading.value = true;
  requestTaskParams.projectName = projectNameKeywords.value;
  requestTaskParams.code = codeKeywords.value;
  requestTaskParams.keywords = nameKeywords.value;
  requestTaskParams.userId = userStore.getUser.id;
  requestTaskParams.currentPage = designPage.currentPage;
  requestTaskParams.finishType = finishType.value;
  requestTaskParams.numberPage = viewTypeName.value == '任务卡片' ? 5000 : designPage.numberPage;
  const res = await AdminApiWorkbench.getMyCreatTaskApi({ ...requestTaskParams });
  mySendTaskData.value = res.data.data.data || [];
  designPage.total = res.data.data.pageCount;
  designPage.currentPage = res.data.data.currentPage;
  taskloading.value = false;
}

function handleClick(tab: any, event: any) {
  activeName.value = tab;
  finishType.value = '';
  if (tab == 'myPlanTask') {
    nextTick(() => {
      taskManaementRef.value?.selectTaskInfo(productPlanIndex.value, viewTypeName.value);
    });
  } else if (tab == 'processtask') {
    nextTick(() => {
      processtaskTableRef.value?.selectTaskInfo();
    });
  } else if (tab == 'myWork') {
    if (taskIndex.value == '5') {
      getMySendTask();
      isSendTask.value = true;
    } else {
      getTaskPage();
      isSendTask.value = false;
    }
  }
}
//获取工作台分页参数
async function getTaskPage() {
  taskloading.value = true;
  requestTaskParams.projectName = projectNameKeywords.value;
  requestTaskParams.code = codeKeywords.value;
  requestTaskParams.keywords = nameKeywords.value;
  requestTaskParams.workStatus = taskIndex.value;
  requestTaskParams.userId = userStore.getUser.id;
  requestTaskParams.currentPage = designPage.currentPage;
  requestTaskParams.numberPage = viewTypeName.value == '任务卡片' ? 5000 : designPage.numberPage;
  requestTaskParams.finishType = finishType.value;
  const res = await AdminApiWorkbench.getTaskPageApi({ ...requestTaskParams });
  taskData.value = res.data.data.data;
  taskloading.value = false;
  designPage.total = res.data.data.pageCount;
  designPage.currentPage = res.data.data.currentPage;
}

// tab切换
function getTasks(task: any) {
  restTabsActive(task);
  taskIndex.value = task;
  if (task == '5') {
    // 我发起的调用逻辑
    getMySendTask();
    isSendTask.value = true;
  } else {
    isSendTask.value = false;
    designPage.currentPage = 1;
    nextTick(() => {
      getTaskPage();
    });
  }
}

function getMyPlanTasks(task: any) {
  restTabsActive2(task);
  nextTick(() => {
    productPlanIndex.value = task;
    taskManaementRef.value?.selectTaskInfo(task);
  });
}
function getProcessTasks(task: any) {
  ProcessTaskIndex.value = task;
  nextTick(() => {
    processtaskTableRef.value?.selectTaskInfo(task);
  });
}

function restTabsActive(task: any) {
  nextTick(() => {
    let doms = document.querySelectorAll('.body_box .ant-tabs-tab');
    if (doms && doms.length) {
      doms.forEach(item => {
        item.className = 'ant-tabs-tab';
      });
      doms[task - 1].className = 'ant-tabs-tab ant-tabs-tab-active ant-tabs-tab-focused';
    }
  });
}
function restTabsActive2(task: any) {
  nextTick(() => {
    let doms = document.querySelectorAll('.body_box2 .ant-tabs-tab');
    if (doms && doms.length) {
      doms.forEach(item => {
        item.className = 'ant-tabs-tab';
      });
      doms[task - 1].className = 'ant-tabs-tab ant-tabs-tab-active ant-tabs-tab-focused';
    }
  });
}

function resetTaskSearch() {
  projectNameKeywords.value = '';
  codeKeywords.value = '';
  nameKeywords.value = '';
  finishType.value = '';
  taskSearch();
}

function querySearch() {
  projectNameKeywords.value = '';
  nameKeywords.value = '';
  taskSearch();
}
// 模糊查询
function taskSearch() {
  designPage.currentPage = 1;
  nextTick(() => {
    if (taskIndex.value == '5') {
      getMySendTask();
    } else {
      getTaskPage();
    }
  });
}
const DateCompletedList = ref([
  {
    label: '近5天要完成',
    value: '1',
  },
  {
    label: '近15天要完成',
    value: '2',
  },
  {
    label: '延期未完成',
    value: '3',
  },
]);

function getFinishType(task: string) {
  if (finishType.value == task) {
    resetTaskSearch();
    return;
  }
  finishType.value = task;
  nextTick(() => {
    if (taskIndex.value == '5') {
      getMySendTask();
    } else {
      getTaskPage();
    }
  });
}
const getActOnSbTo = async (task: any) => {
  if (isSendTask.value) {
    return;
  }
  if (task == 4) {
    finishType.value = 3;
  } else {
    finishType.value = '';
  }
  await restTabsActive(task);
  await getTasks(task);
};

function seeTask(row: any) {
  let taskInfo = JSON.stringify(row);
  let prop: any = {
    id: row.id,
    type: row.type,
    seriesId: row.seriesId,
    code: row.code,
    projectId: row.projectId,
    seriesGbomId: row.seriesGbomId,
    platformId: row.platformId,
    taskSourceId: row.taskSourceId,
    seeTask: true,
    taskInfo: taskInfo,
  };

  if (row.type == 1) {
    router.push({
      path: '/home/designFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  } else if (row.type == 2) {
    router.push({
      path: '/home/engineerFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  } else {
    router.push({
      path: '/home/endFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  }
}

//展示任务详情
async function detailTask(row: any) {
  activeDesign.value = 'first';
  fosTask.value = row;
  // formValidate.platformName = row.platformName;
  requestUserParams.id = row.projectId;
  const res = await AdminApiWorkbench.getProjectDetailApi({ ...requestUserParams });
  // if (res.code == 0) {
  //   formValidate.code = res.data.code;
  //   formValidate.nameCN = res.data.nameCN;
  //   formValidate.projectCategory = res.data.projectCategory;
  //   formValidate.projectType = res.data.projectType;
  //   formValidate.endTime = res.data.endTime;
  //   formValidate.startTime = res.data.startTime;
  //   requestUserParams.project = res.data.code + '';
  //   const respo = await AdminApiWorkbench.sycnProjectUserApi({ ...requestUserParams });
  //   if (respo.code == 0) {
  //     let designManager = {};
  //     let mechanical = {};
  //     let electrical = {};
  //     if (respo.data.designManagerUserName) {
  //       designManager = respo.data.filter(item => item.userId === data.designManagerUserName)[0];
  //     }
  //     if (data.mechanicalUserName) {
  //       mechanical = respo.data.filter(item => item.userId === data.mechanicalUserName)[0];
  //     }
  //     if (data.electricalUserName) {
  //       electrical = respo.data.filter(item => item.userId === data.electricalUserName)[0];
  //     }
  //     memberData[0] = { ...designManager, member: '设计经理' };
  //     memberData[1] = { ...mechanical, member: '机械主管' };
  //     memberData[2] = { ...electrical, member: '电气主管' };
  //     dialogDesign.value = true;
  //   }
  // }
}

// 任务开始
async function startTask(row: any) {
  if (row.taskStatus == 0) {
    requestUserParams.id = row.id;
    const res = await AdminApiWorkbench.startTaskApi({ ...requestUserParams });
    getTaskPage();
    settingsTask(row); // 进任务流程
  } else {
    settingsTask(row);
  }
}

// 驳回任务
async function turnDownTask(row: any) {
  Modal.confirm({
    title: `确定要驳回任务吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      requestUserParams.id = row.id;
      const res = await AdminApiWorkbench.rejectTaskApi({ ...requestUserParams });
      message.success('驳回任务成功');
      getTaskPage();
    },
  });
}

// 转办
async function turnToTask(row: any) {
  memberPrimitiveData.value = [];
  fosTask.value = row;
  // 请求初始列表（默认用行上的 assigneeUserName）
  let reqParam: any = { project: row.code, userName: row.assigneeUserName || '' };
  const res = await AdminApiWorkbench.sycnProjectUserApi(reqParam);
  memberPrimitiveData.value = res.data.data || [];
  memberDialogDesign.value = true;
}

// 在弹窗内执行搜索（使用 fosTask 的 project）
async function searchMembers() {
  const project = fosTask.value?.code || fosTask.value?.project || '';
  const req: any = { project, userName: userName.value || '' };
  try {
    const res = await AdminApiWorkbench.sycnProjectUserApi(req);
    memberPrimitiveData.value = res.data.data || [];
  } catch (err) {
    message.error('查询成员失败');
  }
}

const resetTurnToTask = () => {
  userName.value = '';
  // 重新加载当前任务下的成员列表（若 fosTask 未定义则清空）
  memberPrimitiveData.value = [];
  // if (fosTask.value && (fosTask.value.code || fosTask.value.project)) {
  searchMembers();
  // }
};
// 右侧系统入口区，各系统单击后跳转
function pointUrl(pointUrl: string) {
  window.open(pointUrl);
}

function exportTask(item: any) {
  exportAllTask(item);
}

async function exportAllTask(item: any) {
  requestUserParams.taskId = item.id;
  const res = await AdminApiWorkbench.getExportAllTaskApi({ ...requestUserParams });
  const fileName = item.taskName + '-项目计划.xlsx';
  downloadFileFromStream(res, fileName);
}

// 任务流程
function settingsTask(row: any) {
  let taskInfo = JSON.stringify(row);
  let prop: any = {
    id: row.id,
    type: row.type,
    seriesId: row.seriesId,
    code: row.code,
    projectId: row.projectId,
    seriesGbomId: row.seriesGbomId,
    platformId: row.platformId,
    taskSourceId: row.taskSourceId,
    taskInfo: taskInfo,
  };
  if (row.type == 1) {
    router.push({
      path: '/home/designFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  } else if (row.type == 2) {
    router.push({
      path: '/home/engineerFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  } else {
    router.push({
      path: '/home/endFlow',
      query: { parms: encryptValue(JSON.stringify(prop)) },
    });
  }
}

function modificationTask(item: any) {
  editTask(item);
}
async function editTask(item: any) {
  requestUserParams.taskId = item.id;
  const res = await AdminApiWorkbench.rollBackTaskApi({ ...requestUserParams });
  getTaskPage();
}
function seeToTask(item: any) {
  seeTask(item);
}

function showRightContent() {
  if (isShowRigth.value == '展开') {
    isShowRigth.value = '收起';
  } else {
    isShowRigth.value = '展开';
  }
}

// 获取右侧数据
async function getFastPointInfo() {
  const res = await AdminApiWorkbench.getFastPointInfoById({});
  calculateColumnData.value = res.data.data.list;
}

async function getNoticePage() {
  requestNoticeParams.currentPage = 1;
  requestNoticeParams.numberPage = 10;
  requestNoticeParams.title = '';
  requestNoticeParams.type = '';
  requestNoticeParams.releaseFlag = 1;
  requestNoticeParams.userid = userStore.getUser.id;
  const res = await AdminApiSystemNotice.getNoticePageList({ ...requestNoticeParams });
  if (res.data.code == 0) {
    tabList[0].list = res.data.data;
  }
}

async function announcementDetailsFun(item: any) {
  if (!item || tabIndex.value != 0) return;
  announcementDetailsTitle.value = item.title || '';
  requestNoticeParams.id = item.id;

  const stripHtml = (html: string) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').trim();
  };

  try {
    const res = await AdminApiSystemNotice.getNoticeDetail({ ...requestNoticeParams });
    if (res?.data && (res.data.code === 0 || res.data.code === '0')) {
      const payload = res.data.data?.data ?? res.data.data ?? {};
      announcementDetailsWindow.value = true;

      // TYPE 1 = html content, TYPE 2 = pdf/file
      if (String(item.TYPE) === '1' || item.type === 1) {
        const raw = payload.content ?? payload.html ?? '';
        announcementDetailsContent.value = stripHtml(raw);
        pdfSrc.value = '';
      } else if (String(item.TYPE) === '2' || item.type === 2) {
        pdfSrc.value = payload.filePath ?? payload.fileUrl ?? '';
        announcementDetailsContent.value = '';
      } else {
        const raw = payload.content ?? '';
        announcementDetailsContent.value = stripHtml(raw);
        pdfSrc.value = '';
      }
    } else {
      message.error(res?.data?.msg || '获取公告详情失败');
    }
  } catch (err) {
    console.error('announcementDetailsFun error:', err);
    message.error('获取公告详情异常');
  }
}

function closeAnnouncementDetailsWindow() {
  announcementDetailsWindow.value = false;
  pdfSrc.value = '';
  announcementDetailsContent.value = '';
}

function memberCancel() {
  memberDialogDesign.value = false;
}

// 确认选择转办的人员
async function memberOk() {
  let requestUserParams = new WorkBenchPageRequestDTOModel();
  requestUserParams.id = fosTask.value.id;
  requestUserParams.userName = selectedUserRowList.value[0].userId;
  const res = await AdminApiWorkbench.transferTaskApi({ ...requestUserParams });
  message.success('转办任务成功');
  memberDialogDesign.value = false;
  getTaskPage();
  radio.value = '';
}

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h({
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const expandChange = (expandedRows: any, expanded: any) => {
  if (types.value == '2') getTaskTree(taskId.value, updateDefaultExpandedKeys(expandedRows, expanded.id));
  else if (types.value == '1') {
    getProjectBOM(taskId.value, updateDefaultExpandedKeys(expandedRows, expanded.id));
  }
};
const updateDefaultExpandedKeys = (type: any, id: any) => {
  if (type) {
    defaultExpandedKeys.value.push(id);
    let uniqueValues = [...new Set(defaultExpandedKeys.value)];
    defaultExpandedKeys.value = uniqueValues;
  } else {
    defaultExpandedKeys.value = defaultExpandedKeys.value.filter(item => item != id);
  }
  return defaultExpandedKeys.value;
};

const defaultExpandedKeys = ref<any>([]);
const systemTableData = ref<any>([]);
const Timecooling = ref<boolean>(false);
const schmelDialogDesign = ref(false); // 项目进度弹窗
const taskId = ref();

function seeSchmel(obj: any) {
  debugger;
  const taskType = obj.type;
  taskId.value = obj.id;
  types.value = taskType;
  if (taskType == 1) {
    types.value = '1';
    getProjectBOM(taskId.value);
  } else {
    types.value = '2';
    getTaskTree(taskId.value);
  }
  // getTaskTree(taskId.value);
  schmelDialogDesign.value = true;
}
const getTaskTree = (taskId: number, defaultExpandedKeys?: string[]) => {
  debugger;
  if (!defaultExpandedKeys) {
    loading.value = true;
  }
  if (Timecooling.value) {
    loading.value = false;
  }
  try {
    const obj: any = {
      taskId,
      defaultExpandedKeys,
      userId: userStore.getUser.id,
      userName: userStore.getUser.nickname,
    };
    DesignApiInfo.ckSystemDesignGetTree(obj).then(function (res) {
      debugger;
      if (res.data.code == 0) {
        systemTableData.value = res.data.data || [];
        loading.value = false;
        Timecooling.value = false;
      } else {
        message.error(res.data.msg);
      }
    });
  } catch (error) {
    loading.value = false;
    Timecooling.value = false;
    console.log(error);
  }
};

const getProjectBOM = (taskId: number, defaultExpandedKeys?: string[]) => {
  debugger;
  if (!defaultExpandedKeys) {
    loading.value = true;
  }
  if (Timecooling.value) {
    loading.value = false;
  }
  try {
    const obj: any = {
      taskId,
      requestSource: '设计任务发放',
      // defaultExpandedKeys,
      // userId: userStore.getUser.id,
      // userName: userStore.getUser.nickname,
    };
    DesignApiInfo.getProjectBOMApi(obj).then(function (res) {
      debugger;
      if (res.data.code == 0) {
        systemTableData.value = res.data.data || [];
        loading.value = false;
        Timecooling.value = false;
      } else {
        message.error(res.data.msg);
      }
    });
  } catch (error) {
    loading.value = false;
    Timecooling.value = false;
    console.log(error);
  }
};

// 新增：回退任务（修改）确认并调用接口
async function confirmRollback(record: any) {
  const designtaskIdVar = record.designTaskId;
  if (!designtaskIdVar) {
    message.error('无法获取任务ID');
    return;
  }

  Modal.confirm({
    title: '确认修改',
    content: '该任务已完成，确认要回退为可修改状态吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await AdminApiWorkbench.rollBackTaskApi({ taskId: designtaskIdVar });
        // 兼容返回格式
        const code = String(res?.data?.code ?? res?.code ?? '');
        if (code == '0' || code == '200') {
          message.success('回退成功');
          console.log('confirmRollback: 回退成功 taskId.value:', taskId.value);

          // 刷新当前列表
          await getTaskTree(taskId.value);
        } else {
          message.error(res?.data?.msg ?? '回退失败');
        }
      } catch (err) {
        console.error('rollBackTaskApi error:', err);
        message.error('回退失败');
      }
    },
    onCancel() {
      // 取消则不做操作
    },
  });
}

const columns = ref<any>([
  {
    title: WeiI18n.t('超级GBOM').value,
    dataIndex: 'descript',
    key: 'descript',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('负责人').value,
    dataIndex: 'headName',
    key: 'headName',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('开始时间').value,
    dataIndex: 'startTime',
    key: 'startTime',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('完成时间').value,
    dataIndex: 'endTime',
    key: 'endTime',
    width: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'sendStatus',
    key: 'sendStatus',
    width: 80,
    align: 'center',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  // 把 操作 列放到最后并固定到右侧
  {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    width: 140,
    align: 'center',
    fixed: 'left',
  },
]);
function acFinishTime(data: any) {
  if (data) {
    return data;
  } else {
    return '';
  }
}

const requestParams = reactive(new NoticePageRequestDTOModel());
const powerModel = ref<any>(null);
const powVisible = ref<boolean>(false);
function handleClosePowModal() {
  powVisible.value = false;
}

const userName = ref<string>('');
// const resetTurnToTask = () => {
//   userName.value = '';
// };

/**
 * 详情查看页面
 */
async function seeDetailFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
  let data = res.data.data.data;
  let filedata = res.data.data;
  powVisible.value = true;
  nextTick(() => {
    powerModel.value.getDetailFromMain(data, filedata);
  });
}
onMounted(() => {
  getNoticePage();
  getFastPointInfo();
  getUserInfo();
  getTaskPage();
});
getCkProjectEstimator();
</script>

<template>
  <div class="layout" :style="{ height: viewTypeName == '任务列表' ? 'calc(100vh - 60px)' : 'calc(100vh - 60px)' }">
    <div class="layout-content">
      <div class="lf-cont" :style="{ marginRight: isShowRigth == '展开' ? '0' : '10px' }">
        <div class="top-wrap">
          <a-row style="height: 100%; width: 100%">
            <a-col :span="7">
              <a-card :hoverable="true" style="height: 100%">
                <div class="user-info">
                  <!-- <i :class="userInfoObj.sex == '男' ? 'man' : 'women'"></i> -->
                  <div class="pic"><img src="../../assets/workbench/avatar.jpg" alt="" /></div>
                  <div class="info">
                    <div class="name">{{ userInfoObj.name }}</div>
                    <div class="job">
                      部门：<span>{{ userInfoObj.departName }}</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :span="17">
              <div class="statistics-info">
                <a-card :hoverable="true">
                  <a-card-grid style="width: 20%">
                    <!-- @click="getActOnSbTo(1)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="type">待办任务</div>
                      <div class="num">
                        <span class="num-num">{{ projectStatistics.totalNum }}</span
                        ><span class="unit">个 </span>
                        <EpcIcon type="icon-daibanrenwu" style="font-size: 32px; color: #1890ff" />
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center">
                    <!-- @click="getActOnSbTo(4)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="type">延期任务</div>
                      <div class="num" :style="{ color: projectStatistics.deferredNum > 0 ? 'red' : '' }">
                        <span class="num-num">{{ projectStatistics.deferredNum }}</span
                        ><span class="unit">个 </span>
                        <EpcIcon type="icon-yanqirenwu" style="font-size: 32px; color: #f79c23" />
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center">
                    <!-- @click="getActOnSbTo(3)" :style="!isSendTask ? 'cursor: pointer;' : 'cursor: default;'" -->
                    <div class="sta-list">
                      <div class="type">转办任务</div>
                      <div class="num">
                        <span class="num-num">{{ projectStatistics.forwardNum }}</span
                        ><span class="unit">个 </span>
                        <EpcIcon type="icon-zhuanban1" style="font-size: 32px; color: #aa95f5" />
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center">
                    <div class="sta-list">
                      <div class="type">参与项目</div>
                      <div class="num">
                        <span class="num-num">{{ projectStatistics.inNum }}</span
                        ><span class="unit">个 </span>
                        <EpcIcon type="icon-canyuxiangmu" style="font-size: 32px; color: #46b7c9" />
                      </div>
                    </div>
                  </a-card-grid>
                  <a-card-grid style="width: 20%; text-align: center">
                    <div class="sta-list">
                      <div class="type">参与规划</div>
                      <div class="num">
                        <span class="num-num">{{ projectStatistics.participatedPlanProjectCount }}</span
                        ><span class="unit">个 </span>
                        <EpcIcon type="icon-guihuaguanli" style="font-size: 32px; color: #1890ff" />
                      </div>
                    </div>
                  </a-card-grid>
                </a-card>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="work-wrap">
          <div class="onoff-btn" v-if="activeName != 'processtask'" @click="changeViewType()">{{ viewTypeName }}</div>
          <a-tabs v-model="activeName" class="work_nav_top" @tab-click="handleClick">
            <a-tab-pane key="myWork">
              <template #tab>
                产品设计任务<span v-if="projectStatistics.todoNum > 0">&nbsp;&nbsp;&nbsp;</span>
                <a-badge
                  v-if="projectStatistics.todoNum > 0"
                  style="position: absolute; left: 43px; top: -0px; display: flex; justify-content: center"
                  :count="projectStatistics.todoNum"
                  :overflow-count="99">
                </a-badge>
              </template>
              <a-tabs v-model="taskIndex" @tab-click="getTasks" class="body_box">
                <a-tab-pane v-for="(item, index) in ProductDesignTabLabelList" :key="index + 1" :tab="item.label" style="border: 0px">
                  <div v-if="taskIndex != '5'">
                    <a-row class="elrow">
                      <a-col :span="24">
                        <div class="form-wrap">
                          <a-input class="input-list" style="width: 220px" v-model:value="projectNameKeywords" placeholder="请输入项目名称" />
                          <a-input class="input-list" style="width: 220px" v-model:value="nameKeywords" placeholder="请输入任务名称" allowClear />
                          <a-button type="primary" @click="taskSearch"
                            ><template #icon> <SearchOutlined /> </template>查询</a-button
                          >
                          <a-button style="margin-left: 10px" @click="querySearch"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
                          <span class="seach-append">
                            <a
                              v-for="item in DateCompletedList"
                              :style="{ color: finishType === item.value ? '#165dff' : '' }"
                              :key="item.value"
                              class="elLink"
                              @click.stop="getFinishType(item.value)"
                              >{{ item.label }}</a
                            >
                          </span>
                        </div>
                      </a-col>
                    </a-row>
                    <div v-if="viewType == 'card'" class="layoutBody">
                      <div v-for="(item, index) in taskData" :key="index" class="layoutTableBox">
                        <div class="card-detail">
                          <div class="card-list" :style="{ width: isShowRigth == '展开' ? '384px' : '401px' }">
                            <div class="title">
                              <span class="tit"
                                >{{ item.taskName }}
                                <span class="status" :class="item.taskStatus == 0 ? 'daiban' : item.taskStatus == 1 ? 'working' : 'yiban'">{{
                                  item.taskStatus == 0 ? '待启动' : item.taskStatus == 1 ? '正在工作' : '已完成'
                                }}</span>
                              </span>
                              <span class="t-more">
                                <a-dropdown>
                                  <div class="dot">...</div>
                                  <template #overlay>
                                    <a-menu>
                                      <div style="text-align: left">
                                        <a-menu-item>
                                          <a v-if="item.workStatus == 1 && !isSendTask" @click.stop="startTask(item)">开始</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 开始 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.workStatus == 1 && !isSendTask && item.taskStatus != 1" @click.stop="turnToTask(item)">转办</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 转办 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.taskStatus == 0" @click.stop="turnDownTask(item)">驳回</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 驳回 </a>
                                        </a-menu-item>
                                        <!-- <a-menu-item>
                                          <a v-if="item.type == 1 && !isSendTask" @click.stop="exportAllTask(item)">导出</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 导出 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.workStatus == 2 && !isSendTask" @click.stop="editTask(item)">修改</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 修改 </a>
                                        </a-menu-item> -->
                                        <a-menu-item>
                                          <a v-if="(item.workStatus == 2 && !isSendTask) || (item.taskStatus == 2 && !isSendTask)" @click.stop="seeTask(item)">查看</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 查看 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.type == 1 || item.type == 2" @click.stop="seeSchmel(item)">查看进度</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 查看进度 </a>
                                        </a-menu-item>
                                      </div>
                                    </a-menu>
                                  </template>
                                </a-dropdown>
                              </span>
                            </div>
                            <div class="time">项目时间：{{ item.startTime }} ~ {{ item.endTime }}</div>
                            <a-tooltip>
                              <template #title>{{ item.nameCN }}</template>
                              <div class="time">项目名称：{{ item.nameCN }}</div>
                            </a-tooltip>
                            <div class="time">
                              任务类型：{{
                                item.projectType === '1' ? '一般改进型产品' : item.projectType === '2' ? '重大改进型产品' : item.projectType === '3' ? '延续型产品' : '全新产品'
                              }}
                            </div>
                            <div class="schedule">
                              <span class="schedule-info"
                                >当前进度：<span class="num">{{ item.taskPercentage }}%</span></span
                              >
                              <span class="schedule-time" :style="item.delayDays && item.taskStatus != 2 ? 'color:red;' : ''">{{
                                item.taskStatus == ' 2'
                                  ? '完成时间：' + acFinishTime(item.acFinishTime)
                                  : item.delayDays
                                    ? '延期' + item.delayDays + '天'
                                    : '距截止还剩' + item.deadlineDays + '天'
                              }}</span>
                            </div>
                            <a-progress :text-inside="true" :stroke-width="12" :percent="item.taskPercentage" color="linear-gradient( 270deg, #6F96FA 0%, #3172F5 72%)" />
                            <div class="create-pop">
                              创建人：<span class="user"
                                ><img src="../../assets/workbench/avatar.jpg" alt="" />{{
                                  item.createName != undefined && item.createName != null ? item.createName : item.porName
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <HomeTaskTable
                      v-if="viewType == 'table'"
                      :isSendTask="isSendTask"
                      :tableData="taskData"
                      :loading="taskloading"
                      ref="taskTable"
                      :page="designPage"
                      @onShowSizeChange="onShowSizeChange"
                      @detailTask="detailTask"
                      @startTask="startTask"
                      @seeSchmel="seeSchmel"
                      @turnDownTask="turnDownTask"
                      @settingsTask="settingsTask"
                      @turnToTask="turnToTask"
                      @exportTask="exportTask"
                      @modificationTask="modificationTask"
                      @seeToTask="seeToTask" />
                  </div>
                  <div v-else>
                    <a-row class="elrow">
                      <a-col :span="24">
                        <div class="form-wrap">
                          <a-input class="input-list" style="width: 220px" v-model:value="projectNameKeywords" placeholder="请输入项目名称" allowClear />
                          <a-input class="input-list" style="width: 220px" v-model:value="nameKeywords" placeholder="请输入任务名称" allowClear />
                          <a-button type="primary" @click="taskSearch"
                            ><template #icon> <SearchOutlined /> </template>查询</a-button
                          >
                          <a-button style="margin-left: 10px" @click="querySearch"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
                          <span class="seach-append">
                            <a
                              v-for="item in DateCompletedList"
                              :key="item.value"
                              :style="{ color: finishType === item.value ? '#165dff' : '' }"
                              class="elLink"
                              @click.stop="getFinishType(item.value)"
                              >{{ item.label }}</a
                            >
                          </span>
                        </div>
                      </a-col>
                    </a-row>
                    <div v-if="viewType == 'card'" class="layoutBody">
                      <div v-for="(item, index) in mySendTaskData" :key="index" class="layoutTableBox">
                        <div class="card-detail">
                          <div class="card-list" :style="{ width: isShowRigth == '展开' ? '384px' : '401px' }">
                            <div class="title">
                              <span class="tit"
                                >{{ item.taskName }}
                                <span class="status" :class="item.taskStatus == 0 ? 'daiban' : item.taskStatus == 1 ? 'working' : 'yiban'">{{
                                  item.taskStatus == 0 ? '待启动' : item.taskStatus == 1 ? '正在工作' : '已完成'
                                }}</span>
                              </span>
                              <span class="t-more">
                                <a-dropdown>
                                  <div class="dot">...</div>
                                  <template #overlay>
                                    <a-menu>
                                      <div style="text-align: left">
                                        <a-menu-item>
                                          <a v-if="item.workStatus == 1 && !isSendTask" @click.stop="startTask(item)">开始</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 开始 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.workStatus == 1 && !isSendTask && item.taskStatus != 1" @click.stop="turnToTask(item)">转办</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 转办 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="item.taskStatus != 1 && !isSendTask" @click.stop="turnDownTask(item)">驳回</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 驳回 </a>
                                        </a-menu-item>
                                        <a-menu-item>
                                          <a v-if="(item.workStatus == 2 && !isSendTask) || (item.taskStatus == 2 && !isSendTask)" @click.stop="seeTask(item)">查看</a>
                                          <a v-else style="margin-left: 0px; color: #cccccc"> 查看 </a>
                                        </a-menu-item>
                                      </div>
                                    </a-menu>
                                  </template>
                                </a-dropdown>
                              </span>
                            </div>
                            <div class="time">项目时间：{{ item.startTime }} ~ {{ item.endTime }}</div>
                            <a-tooltip>
                              <template #title>{{ item.nameCN }}</template>
                              <div class="time">项目名称：{{ item.nameCN }}</div>
                            </a-tooltip>
                            <div class="time">
                              任务类型：{{
                                item.projectType === '1' ? '一般改进型产品' : item.projectType === '2' ? '重大改进型产品' : item.projectType === '3' ? '延续型产品' : '全新产品'
                              }}
                            </div>
                            <div class="schedule">
                              <span class="schedule-info"
                                >当前进度：<span class="num">{{ item.taskPercentage }}%</span></span
                              >
                              <span class="schedule-time" :style="item.delayDays && item.taskStatus != 2 ? 'color:red;' : ''">{{
                                item.taskStatus == ' 2'
                                  ? '完成时间：' + acFinishTime(item.acFinishTime)
                                  : item.delayDays
                                    ? '延期' + item.delayDays + '天'
                                    : '距截止还剩' + item.deadlineDays + '天'
                              }}</span>
                            </div>
                            <a-progress :text-inside="true" :stroke-width="12" :percent="item.taskPercentage" color="linear-gradient( 270deg, #6F96FA 0%, #3172F5 72%)" />
                            <div class="create-pop">
                              接收人：<span class="user"><img src="../../assets/workbench/avatar.jpg" alt="" />{{ item.designName }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <HomeTaskTable
                      v-if="viewType == 'table'"
                      :isSendTask="isSendTask"
                      :tableData="mySendTaskData"
                      :loading="taskloading"
                      ref="taskTable"
                      :page="designPage"
                      @seeSchmel="seeSchmel"
                      @onShowSizeChange="onShowSizeChange"
                      @detailTask="detailTask"
                      @startTask="startTask"
                      @turnDownTask="turnDownTask"
                      @settingsTask="settingsTask"
                      @turnToTask="turnToTask"
                      @exportTask="exportTask"
                      @modificationTask="modificationTask"
                      @seeToTask="seeToTask" />
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
            <a-tab-pane key="myPlanTask">
              <template #tab>
                产品规划任务<span v-if="projectStatistics.planNum > 0">&nbsp;&nbsp;&nbsp;</span>
                <a-badge
                  v-if="projectStatistics.planNum > 0"
                  style="position: absolute; left: 43px; top: -0px; display: flex; justify-content: center"
                  :count="projectStatistics.planNum"
                  :overflow-count="99">
                </a-badge>
              </template>
              <a-tabs v-model="productPlanIndex" @tab-click="getMyPlanTasks" class="body_box">
                <a-tab-pane v-for="(item, index) in tabLabelList" :key="index + 1" :tab="item.label" style="border: 0px"> </a-tab-pane>
              </a-tabs>
              <planTaskWork :viewType="viewType" :isSendTask="isSendTask" :isShowRigth="isShowRigth" ref="taskManaementRef"></planTaskWork>
            </a-tab-pane>
            <a-tab-pane key="processtask">
              <template #tab>
                审批 / 打分任务<span v-if="projectStatistics.flowNum > 0">&nbsp;&nbsp;&nbsp;</span>
                <a-badge
                  v-if="projectStatistics.flowNum > 0"
                  style="position: absolute; left: 50px; top: -0px; display: flex; justify-content: center"
                  :count="projectStatistics.flowNum"
                  :overflow-count="99">
                </a-badge>
              </template>
              <a-tabs v-model="ProcessTaskIndex" @tab-click="getProcessTasks" class="body_box">
                <a-tab-pane v-for="item in tabProcessTaskList" :key="item.id" :tab="item.label" style="border: 0px"> </a-tab-pane>
              </a-tabs>
              <processtaskTable :tsakType="ProcessTaskIndex" ref="processtaskTableRef"></processtaskTable>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="rt-cont" :style="{ display: isShowRigth == '展开' ? 'none' : 'block' }">
        <div class="rt-cont-list quick-entry">
          <div class="rt-cont-title">系统快速入口</div>
          <div class="cont-list">
            <div class="lis" v-for="item in calculateColumnData" :key="item.id" @click="pointUrl(item.pointUrl)">
              <img src="../../assets/workbench/quick-entry-logo.png" />
              <span>{{ item.pointName }}</span>
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
          <div class="cont-list">
            <div class="news-list" v-for="(i, idx) in tabList[0].list.data" :key="idx">
              <img v-if="idx > 2" src="../../assets/workbench/news.png" />
              <img v-else src="../../assets/workbench/act-news.png" />
              <div class="news-cont">
                <div class="title" @click="seeDetailFun(i.id)">{{ i.title }}</div>
                <div class="detalis">平台公告 ｜{{ i.addTime.substring(0, 10) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="show-right-content-btn" @click="showRightContent">{{ isShowRigth }}</div>
  <a-modal
    v-model:visible="announcementDetailsWindow"
    style="width: 90%"
    :style="{ top: '5%' }"
    :title="$t('公告详情')"
    :ok-text="false"
    :confirm-loading="$isPending()"
    :mask-closable="false">
    <h3 style="text-align: center; margin-bottom: 20px">
      {{ announcementDetailsTitle }}
    </h3>
    <div style="height: 500px; overflow-y: auto">
      {{ announcementDetailsContent }}
      <iframe v-if="pdfSrc" width="100%" height="100%" :src="`/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(pdfSrc)}`"></iframe>
      <div v-html="announcementDetailsContent" v-else></div>
    </div>
    <template #footer>
      <a-button key="back" type="primary" @click="closeAnnouncementDetailsWindow"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
    </template>
  </a-modal>
  <!-- 选择成员弹窗 -->
  <a-modal v-model:visible="memberDialogDesign" title="选择转办用户" draggable width="1000px">
    <div class="member-modal-body">
      <div class="member-search-row">
        <a-input v-model:value="userName" style="width: 240px" placeholder="请输入关键字" />
        <a-button type="primary" @click="searchMembers" style="margin-left: 10px"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />搜索</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>

      <div class="member-table-wrap">
        <!-- 表格处 -->
        <a-table
          v-if="!loadingPro"
          :scroll="{ x: 800 }"
          :row-key="(record: any) => record.userId"
          :columns="usercolumns"
          :row-selection="rowSelectionUser"
          :pagination="false"
          style="width: 100%"
          :locale="locale"
          :data-source="memberPrimitiveData"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              {{ record.name }}
            </template>
          </template>
        </a-table>
        <div v-else class="example">
          <a-spin tip="加载中..." />
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="memberOk()"> 确定 </a-button>
        <a-button @click="memberCancel()">取消</a-button>
      </span>
    </template>
  </a-modal>

  <a-modal v-model:visible="schmelDialogDesign" title="进度查看" draggable width="1000px">
    <div style="margin: 0px 20px 28px 16px; width: 100%">
      <a-table
        style="margin-top: 5px; margin-right: 16px"
        :loading="loading"
        :scroll="{ y: 400 }"
        row-key="id"
        :locale="localeA"
        :pagination="false"
        :data-source="systemTableData"
        :columns="columns"
        @expand="expandChange"
        v-model:expandedRowKeys="defaultExpandedKeys"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'headName'">
            <div style="display: flex">
              <div style="width: 100px">{{ record.headName }}</div>
            </div>
          </template>

          <!-- 状态列：leve === 1 时显示 '/' -->
          <template v-if="column.dataIndex === 'sendStatus'">
            <div v-if="Number(record.level) === 1">/</div>
            <div v-else>
              <!-- {{record.taskStatus}} -->
              <span v-if="record.taskStatus == '正在工作'" style="color: #e6a23c">正在工作</span>
              <span v-if="record.taskStatus == '已完成'" style="color: #67c23a">已完成</span>
              <span v-if="record.taskStatus == '待启动'">待启动</span>
              <span v-if="record.taskStatus == '已驳回'" style="color: #9370db">已驳回</span>
              <span v-if="record.taskStatus == '/'">/</span>
            </div>
          </template>

          <template v-if="column.dataIndex === 'startTime'">
            <a-date-picker
              v-if="record.button == 1"
              :locale="locale"
              v-model:value="record.startTime"
              :disabled="true"
              format="YYYY-MM-DD "
              value-format="YYYY-MM-DD"
              style="text-align: left"
              :placeholder="'开始时间'" />
          </template>

          <template v-if="column.dataIndex === 'endTime'">
            <a-date-picker
              v-if="record.button == 1"
              :locale="locale"
              v-model:value="record.endTime"
              :disabled="true"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="text-align: left"
              :placeholder="'完成时间'" />
          </template>

          <!-- 操作列：把修改按钮放到这里，和未来的其他操作统一展示 -->
          <template v-if="column.dataIndex === 'operations'">
            <!-- <div v-if="record.designTaskId != null" class="action-buttons"> -->
            <!-- 当任务已完成时显示 修改 图标 -->
            <a-tooltip placement="top" title="变更">
              <a v-if="record.taskStatus == '已完成' && record.designTaskId != null" @click.stop="confirmRollback(record)">
                <EpcIcon type="icon-bianji1" style="font-size: 15px" />
              </a>
              <a v-else :disabled="true" type="primary"><EpcIcon type="icon-bianji1" style="font-size: 15px" /></a>
            </a-tooltip>
            <!-- </div> -->
          </template>

          <!-- 任务定义列：leve === 1 时显示 '/' -->
          <template v-if="column.dataIndex === 'definition'">
            <div v-if="Number(record.level) === 1">/</div>
            <a v-else type="primary" style="cursor: pointer">
              {{ record.whether ? '已定义' : '定义任务' }}
            </a>
          </template>
        </template>
      </a-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button @click="schmelDialogDesign = false" type="primary"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
      </span>
    </template>
  </a-modal>

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
  background: rgb(13, 83, 226, 0.2);
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
