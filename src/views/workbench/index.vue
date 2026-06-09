<script setup lang="ts">
import { computed, nextTick, onActivated, onMounted, onUnmounted, reactive, ref, watch, type Component } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import * as echarts from 'echarts';
import { DICT_TYPE } from '@/utils/dict';
import { Modal, message } from 'ant-design-vue';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BranchesOutlined,
  CloudServerOutlined,
  EllipsisOutlined,
  FilterOutlined,
  FormOutlined,
  HighlightOutlined,
  HistoryOutlined,
  MobileOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  SwapOutlined,
  UndoOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
} from '@ant-design/icons-vue';
import NoticeDetail from './components/notice-detail.vue';
import CancellationProcess from './components/modal/cancellationProcess.vue';
import {
  TASK_KIND_ACTIONS,
  TASK_KIND_LABEL,
  type TaskItem,
  type WorkbenchBpmTaskItem,
  WORKBENCH_AUDIT_SECONDARY_TABS,
  WORKBENCH_SECONDARY_TABS,
  WORKBENCH_TABS,
  type WorkbenchTaskKind,
} from './data';
import DictTag from '@/components/DictTag/src/DictTag.vue';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { showRequestErrorIfNeeded } from '@/httpRequest';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { encryptValue } from '@/utils';
import { formatPast2, timestampToDateString } from '@/utils/formatTime';
import { getMyTodoTask, getMyDoneTask, getMyProcessInstance } from '@/api/bpm/task';
import { ETASKTYPE } from '@/views/bpm/processInstance/components/config/constant';
import Empty from '@/components/Empty/index.vue';
import { renderTableEmptyText } from '@/utils/emptyState';
import { RRQueryParams } from './components/config/query';
import { useDictStore } from '@/store/modules/dict';
import { buildWorkbenchReturnQuery, isWorkbenchReturnRouteQuery, parseWorkbenchRouteQuery } from './workbenchRouteQuery';
/** 列表请求参数 */
const requestNoticeParams = reactive(new NoticePageRequestDTOModel());
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: renderTableEmptyText('数据为空'),
});
/** 获取字典 */
const useDict = useDictStore();
const isShowRigth = ref('收起');
const userInfoObj = ref<any>({
  name: '',
  departName: '',
});
const projectStatistics = ref<any>({});
const activeName = ref('todo');
const searchQuery = ref('');
const secondaryFilter = ref<(typeof WORKBENCH_SECONDARY_TABS)[number]['value']>('todo');
const auditSecondaryFilter = ref<(typeof WORKBENCH_AUDIT_SECONDARY_TABS)[number]['value']>('todo');
const viewMode = ref('grid'); // 'grid' | 'list'

const secondaryTabs = WORKBENCH_SECONDARY_TABS;
const auditSecondaryTabs = WORKBENCH_AUDIT_SECONDARY_TABS;
const todoList = ref<TaskItem[]>([]);
/** 设计任务列表：数据来自 /business/workbench-todo-card/page */
const todoListLoading = ref(false);
/** 设计任务分页（与系统公告等列表页 usePagination 一致） */
const todoRequestParams = reactive({
  pageNo: 1,
  pageSize: 10,
});
const { pagination: todoPagination } = usePagination(todoRequestParams, loadTodoListFromApi);
todoPagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
todoPagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
todoPagination.showQuickJumper = false;
/** 流程任务列表：OA/BPM 等独立接口接入后填充 */
const auditList = ref<WorkbenchBpmTaskItem[]>([]);
const auditListLoading = ref(false);
const auditProcessTotal = ref(0);

/** 已转办 WBS：发起变更（mark-change + reopen-task），与项目页 WBS 逻辑一致 */
const wbsChangeModalVisible = ref(false);
const wbsChangeTargetTask = ref<TaskItem | null>(null);
const wbsChangeApplyLatest = ref<0 | 1>(0);
const wbsChangeSubmitLoading = ref(false);

/** 转办弹窗 */
const transferModalVisible = ref(false);
const transferTargetTask = ref<TaskItem | null>(null);
const transferSelectedUserId = ref<string | undefined>(undefined);
const transferSubmitLoading = ref(false);
const transferCandidateOptions = ref<Array<{ userId: string; displayName: string }>>([]);
const transferCandidatesLoading = ref(false);

/** 驳回弹窗 */
const rejectModalVisible = ref(false);
const rejectTargetTask = ref<TaskItem | WorkbenchBpmTaskItem | null>(null);
const rejectOpinion = ref('');
const rejectSubmitLoading = ref(false);

/** 我的流程 — 取消流程弹窗 */
const bpmCancelModalVisible = ref(false);
const bpmCancelTargetTask = ref<WorkbenchBpmTaskItem | null>(null);

const transferSelectOptions = computed(() =>
  transferCandidateOptions.value.map(u => ({
    value: u.userId,
    label: u.displayName,
  })),
);

// 定义问候语文本
const greetingText = ref('');
// 定时器标识，用于清除定时器
let timer = null;

const todoColumns = ref([
  {
    title: '任务名称',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    width: 250,
    fixed: 'left',
    resizable: true,
    customFilterDropdown: true,
    onFilter: (value: string, record: TaskItem) =>
      workbenchCardDisplayTitle(record).toLowerCase().includes(String(value).toLowerCase()),
    sorter: (a: TaskItem, b: TaskItem) => workbenchCardDisplayTitle(a).localeCompare(workbenchCardDisplayTitle(b), 'zh-CN'),
  },
  {
    title: '任务大类',
    dataIndex: 'type',
    key: 'type',
    width: 176,
    resizable: true,
    ellipsis: true,
    sorter: (a: TaskItem, b: TaskItem) => a.taskKind.localeCompare(b.taskKind) || a.type.localeCompare(b.type),
  },
  {
    title: '项目时间',
    key: 'time',
    width: 240,
    resizable: true,
    sorter: (a: any, b: any) => getTimeSortValue(a) - getTimeSortValue(b),
  },
  {
    title: '当前进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 248,
    resizable: true,
    ellipsis: true,
    sorter: (a: TaskItem, b: TaskItem) => a.progress - b.progress,
  },
  { title: '操作', key: 'action', width: 140, align: 'center', fixed: 'right', resizable: true },
]);

function handleResizeColumn(width: number, col: any) {
  col.width = width;
}
const rowKey = (record: TaskItem) => String(record.id);
function rowClassName(_record: any, index: number) {
  return index % 2 === 1 ? 'table-striped' : '';
}

function getTimeSortValue(task: TaskItem) {
  if (!hasTimelineInfo(task)) return 0;
  const start = task.startTime.replace('年', '-').replace('月', '-').replace('日', '');
  const timestamp = new Date(start).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/** 我的流程：时间戳/日期格式化；待办/已办：原样展示 */
function formatWorkbenchDateTime(value: unknown, fallback?: unknown): string {
  if (auditSecondaryFilter.value !== 'myProcess') {
    const raw = value ?? fallback;
    if (raw == null || raw === '') return '';
    return String(raw);
  }
  return timestampToDateString(value ?? fallback);
}

function getBpmFieldTimestamp(value: unknown): number {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return value < 1e12 ? value * 1000 : value;
  const n = Number(value);
  if (!Number.isNaN(n) && /^\d+$/.test(String(value).trim())) return n < 1e12 ? n * 1000 : n;
  const t = dayjs(value as string).valueOf();
  return Number.isNaN(t) ? 0 : t;
}

function getBpmRecordTimeSortValue(record: Record<string, unknown>, field: string) {
  return getBpmFieldTimestamp(record[field]);
}

// 待办任务统计 mock 数据
const todoChartData = ref({
  delay: 0, // 延期
  todo: 0, // 待办
  audit: 0, // 审批待办
  done: 0, // 已转办
  total: 0, // 参与项目
});

let todoChartInstance: echarts.ECharts | null = null;

function initTodoChart() {
  const el = document.getElementById('eachart-main');
  if (!el) return;
  if (todoChartInstance) {
    todoChartInstance.dispose();
  }
  todoChartInstance = echarts.init(el);
  const { delay, todo, audit, done, total } = todoChartData.value;
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
        const map: Record<string, number> = { 延期: delay, 待办: todo, 审批待办: audit, 已转办: done };
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
          borderWidth: 3,
        },
        data: [
          { value: delay, name: '延期', itemStyle: { color: '#FF7C7C' } },
          { value: todo, name: '待办', itemStyle: { color: '#FFBA18' } },
          { value: audit, name: '审批待办', itemStyle: { color: '#00B96B' } },
          { value: done, name: '已转办', itemStyle: { color: '#2B5FD9' } },
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

function getTagClass(tag: string) {
  if (tag === '延') return 'tag-red';
  if (tag === '转') return 'tag-blue';
  if (tag === '已转办') return 'tag-blue';
  if (tag === '待办') return 'tag-yellow';
  return 'tag-default';
}

/** 待办且类型支持转办（与 TASK_KIND_ACTIONS 一致；当前仅 WBS 含 transfer） */
function canRejectOrTransfer(task: TaskItem): boolean {
  if (task.viewOnly) return false;
  const actions = TASK_KIND_ACTIONS[task.taskKind] ?? TASK_KIND_ACTIONS.other;
  return actions.includes('transfer');
}
const canDesign = (task: TaskItem) => task.category !== 'assign';

/** 后端 WBS 工作台卡片 task_type 为「协同任务」时，为真实协同设计待办（与发布任务写入一致） */
const WBS_TASK_TYPE_COLLAB = '协同任务';
const WBS_TASK_TYPE_CATEGORY = '分类协同（分配下级）';
const WBS_TASK_TYPE_ASSIGN = 'WBS人员指派';

/** 协同任务且接口已明确 WBS 未发布（如驳回后）：应走任务管理，不可直接进协同设计 */
function isWbsCollabTaskUnpublishedForDesign(task: TaskItem): boolean {
  if (task.taskKind !== 'wbs') return false;
  if (String(task.type ?? '').trim() !== WBS_TASK_TYPE_COLLAB) return false;
  const pub = task.wbsPublishStatus;
  if (pub === undefined || pub === null) return false;
  return Number(pub) !== 1;
}

/**
 * WBS 卡片：后端 publish 分类节点时 taskType 为「分类协同…」，卡片用于提醒负责人继续分配下级，非独立协同设计任务
 */
function isWbsCategoryCollaborationWorkbenchTask(task: TaskItem): boolean {
  if (task.taskKind !== 'wbs') return false;
  const t = String(task.type ?? '');
  return t.includes('分类协同') || t.includes('分类节点');
}

/** 已办「变更」等协同设计能力：仅 task_type 为「协同任务」的 WBS 卡片（排除分类协同、WBS 人员指派等） */
function isWbsDesignTaskEligibleForChange(task: TaskItem): boolean {
  return task.taskKind === 'wbs' && String(task.type ?? '').trim() === WBS_TASK_TYPE_COLLAB;
}

/** 设计按钮提示：分类协同 → 任务管理；协同未发布 → 重新分配发布；独立应用 → 设计；否则协同设计 */
function designWorkspaceTooltip(task: TaskItem): string {
  if (isWbsCategoryCollaborationWorkbenchTask(task)) return '任务管理（分配下级）';
  if (isWbsCollabTaskUnpublishedForDesign(task)) return '任务管理（重新分配并发布）';
  if (task.taskKind === 'standalone') return '设计';
  return '协同设计';
}
const canAssign = (task: TaskItem) => task.category === 'assign';
const hasTimelineInfo = (task: { category?: TaskItem['category'] }) => task.category === 'product';

function formatProjectDateCn(v: unknown): string {
  if (v == null || v === '') return '';
  const d = dayjs(v as string);
  return d.isValid() ? d.format('YYYY年M月D日') : '';
}

/**
 * 对齐后端 card_kind（WorkbenchCardKindEnum）与 JSON 里的 taskKind slug
 * @param v
 */
function normalizeTaskKindFromApi(v: unknown): WorkbenchTaskKind {
  const raw = String(v ?? '').trim();
  const s = raw.toLowerCase().replace(/-/g, '_');
  if (s === 'wbs' || s === 'standalone' || s === 'compute' || s === 'other') {
    return s as WorkbenchTaskKind;
  }
  if (s === 'standalone_app') return 'standalone';
  return 'other';
}

/**
 * 仅「协同任务」类 WBS 待办、且未开始执行时，展示右上角「⋯」驳回入口
 * @param task
 */
function showWbsRejectMenu(task: {
  viewOnly?: boolean;
  taskKind?: WorkbenchTaskKind;
  status?: TaskItem['status'];
  type?: string;
  progress?: number;
}): boolean {
  if (task.viewOnly) return false;
  if (task.taskKind !== 'wbs') return false;
  if (task.status !== 'todo') return false;
  const t = String(task.type ?? '').trim();
  if (t === WBS_TASK_TYPE_COLLAB && (task.progress ?? 0) > 0) return false;
  return t === WBS_TASK_TYPE_COLLAB || t === WBS_TASK_TYPE_CATEGORY || t === WBS_TASK_TYPE_ASSIGN;
}

function inferCategoryForTaskItem(taskType: string, taskKind: WorkbenchTaskKind): TaskItem['category'] {
  if (taskType.includes('指派')) return 'assign';
  if (taskKind === 'standalone') return 'app';
  if (taskKind === 'compute') return 'compute';
  return 'product';
}

function inferSceneForTaskItem(taskKind: WorkbenchTaskKind): TaskItem['scene'] {
  if (taskKind === 'standalone') return 'app';
  if (taskKind === 'compute') return 'compute';
  if (taskKind === 'wbs') return 'product';
  return 'general';
}

function pickNonEmptyDisplay(raw: unknown): string | undefined {
  const s = String(raw ?? '').trim();
  return s === '' ? undefined : s;
}

/** 待办且存在延期天数时：红色进度条、延期文案、右上角「延期」角标 */
function workbenchShowOverdueUi(task: { status?: TaskItem['status']; delayDays?: number }): boolean {
  return task.status === 'todo' && task.delayDays != null && task.delayDays > 0;
}

/** 卡片 / 列表展示标题（仅展示服务端 title，不追加项目/应用名括号后缀） */
function workbenchCardDisplayTitle(task: TaskItem): string {
  return String(task.title ?? '').trim();
}

/**
 * 将 workbench-todo-card/page 单行映射为首页卡片 TaskItem（含 taskKind、标签、延期/剩余天）
 * @param row
 */
function mapWorkbenchApiRowToTaskItem(row: Record<string, unknown>): TaskItem {
  const taskKind = normalizeTaskKindFromApi(row.taskKind ?? row.cardKind);
  const st = String(row.status ?? '').toUpperCase();
  const tags: string[] = [];
  if (st === 'TRANSFERRED') {
    tags.push('转');
    tags.push('待办');
  } else {
    if (st === 'TODO') tags.push('待办');
  }
  const startTime = formatProjectDateCn(row.projectStartDate);
  const endTime = formatProjectDateCn(row.projectEndDate);
  const taskTypeStr = String(row.taskType ?? '');
  const progress = Math.min(100, Math.max(0, Number(row.progress ?? 0)));
  const apiOverdue = Math.max(0, Number(row.overdueDays) || 0);
  let delayDays: number | undefined = apiOverdue > 0 ? apiOverdue : undefined;
  const endRaw = row.projectEndDate ?? row.project_end_date;
  const projectEndDateRaw = endRaw != null && String(endRaw).trim() !== '' ? String(endRaw) : undefined;
  if (delayDays == null && st === 'TODO' && projectEndDateRaw) {
    const end = dayjs(projectEndDateRaw).startOf('day');
    if (end.isValid()) {
      const late = dayjs().startOf('day').diff(end, 'day');
      if (late > 0) delayDays = late;
    }
  }
  const uiStatus: 'todo' | 'done' = st === 'DONE' ? 'done' : 'todo';
  let remainDays: number | undefined;
  if (st === 'TODO' && (delayDays == null || delayDays <= 0) && projectEndDateRaw) {
    const end = dayjs(projectEndDateRaw).startOf('day');
    if (end.isValid()) {
      const d = end.diff(dayjs().startOf('day'), 'day');
      if (d >= 0) remainDays = d;
    }
  }
  const taskIdRaw = row.taskId ?? row.task_id;
  const projectIdRaw = row.projectId ?? row.project_id;
  const standaloneRaw = row.standaloneAppId ?? row.standalone_app_id;
  const projectWbsIdRaw = row.projectWbsId ?? row.project_wbs_id;
  const projectNameRaw = row.projectName ?? row.project_name;
  const appNameRaw = row.appName ?? row.app_name;
  const lastRejectRaw = row.lastRejectRemark ?? row.last_reject_remark;
  const wbsPubRaw = row.wbsPublishStatus ?? row.wbs_publish_status;
  let wbsPublishStatus: number | undefined;
  if (wbsPubRaw !== undefined && wbsPubRaw !== null && String(wbsPubRaw).trim() !== '') {
    const n = Number(wbsPubRaw);
    if (!Number.isNaN(n)) wbsPublishStatus = n;
  }
  return {
    id: row.id != null ? String(row.id) : '',
    title: String(row.title ?? ''),
    tags,
    startTime,
    endTime,
    type: taskTypeStr,
    category: inferCategoryForTaskItem(taskTypeStr, taskKind),
    status: uiStatus,
    scene: inferSceneForTaskItem(taskKind),
    taskKind,
    progress,
    delayDays,
    remainDays,
    creatorName: String(row.creatorName ?? ''),
    creatorAvatar: '',
    taskId: taskIdRaw != null && taskIdRaw !== '' ? taskIdRaw : undefined,
    projectId: projectIdRaw != null && projectIdRaw !== '' ? projectIdRaw : undefined,
    standaloneAppId: standaloneRaw != null && standaloneRaw !== '' ? standaloneRaw : undefined,
    projectWbsId:
      projectWbsIdRaw !== undefined && projectWbsIdRaw !== null && projectWbsIdRaw !== '' ? projectWbsIdRaw : undefined,
    assigneeDisplayName:
      row.assigneeDisplayName != null && String(row.assigneeDisplayName).trim() !== ''
        ? String(row.assigneeDisplayName)
        : undefined,
    projectDisplayName: pickNonEmptyDisplay(projectNameRaw),
    appDisplayName: pickNonEmptyDisplay(appNameRaw),
    lastRejectRemark: pickNonEmptyDisplay(lastRejectRaw),
    projectEndDateRaw,
    wbsPublishStatus,
  };
}

/**
 * 「我已转办」与 page 同源字段；只读并带「已转办」标签
 * @param row
 */
function mapTransferOutRowToTaskItem(row: Record<string, unknown>): TaskItem {
  const base = mapWorkbenchApiRowToTaskItem(row);
  const tags = Array.from(new Set([...base.tags.filter(t => t !== '待办'), '已转办']));
  return {
    ...base,
    tags,
    viewOnly: true,
    assigneeDisplayName:
      row.assigneeDisplayName != null && String(row.assigneeDisplayName).trim() !== ''
        ? String(row.assigneeDisplayName)
        : base.assigneeDisplayName,
  };
}

function resetTodoListPage() {
  todoPagination.current = 1;
  todoRequestParams.pageNo = 1;
}

/** 对接 /business/workbench-todo-card/page（分页；WBS 且无 timeBucket 时含独立应用） */
async function loadTodoListFromApi() {
  const uid = userStore.getUser?.id;
  if (uid == null) {
    todoList.value = [];
    todoPagination.total = 0;
    return;
  }
  todoListLoading.value = true;
  try {
    const kw = searchQuery.value.trim();
    const pageNo = todoRequestParams.pageNo;
    const pageSize = todoRequestParams.pageSize;
    if (secondaryFilter.value === 'transfer') {
      const res = await AdminApiProjectTemp.workbenchTodoTransferOutPage({
        pageNo,
        pageSize,
        ...(kw ? { keyword: kw } : {}),
      });
      const code = res?.data?.code;
      const payload = res?.data?.data as { list?: Record<string, unknown>[]; total?: number } | undefined;
      const raw = payload?.list;
      if ((code === 0 || code === 200) && Array.isArray(raw)) {
        todoList.value = raw.map(mapTransferOutRowToTaskItem);
        todoPagination.total = Number(payload?.total ?? 0);
      } else {
        todoList.value = [];
        todoPagination.total = 0;
      }
      return;
    }
    const f = secondaryFilter.value;
    const pageBody: Parameters<typeof AdminApiProjectTemp.workbenchTodoCardPage>[0] = {
      pageNo,
      pageSize,
      assigneeUserId: String(uid),
      cardKind: 'WBS',
      ...(kw ? { keyword: kw } : {}),
    };
    if (f === 'todo') {
      pageBody.status = 'TODO';
    } else if (f === 'done') {
      pageBody.status = 'DONE';
    } else if (f === 'due5') {
      pageBody.status = 'TODO';
      pageBody.timeBucket = 'DUE_5D';
    } else if (f === 'due15') {
      pageBody.status = 'TODO';
      pageBody.timeBucket = 'DUE_15D';
    } else if (f === 'overdue') {
      pageBody.status = 'TODO';
      pageBody.timeBucket = 'OVERDUE';
    }
    const res = await AdminApiProjectTemp.workbenchTodoCardPage(pageBody);
    const code = res?.data?.code;
    const payload = res?.data?.data as { list?: Record<string, unknown>[]; total?: number } | undefined;
    const raw = payload?.list;
    if ((code === 0 || code === 200) && Array.isArray(raw)) {
      todoList.value = raw.map(mapWorkbenchApiRowToTaskItem);
      todoPagination.total = Number(payload?.total ?? 0);
    } else {
      todoList.value = [];
      todoPagination.total = 0;
    }
  } catch {
    message.error('加载待办列表失败');
    todoList.value = [];
    todoPagination.total = 0;
  } finally {
    todoListLoading.value = false;
  }
}

function taskCardKindClass(task: TaskItem): string {
  const map: Record<WorkbenchTaskKind, string> = {
    wbs: 'task-card--kind-wbs',
    standalone: 'task-card--kind-standalone',
    compute: 'task-card--kind-compute',
    other: 'task-card--kind-other',
  };
  return map[task.taskKind] ?? 'task-card--kind-other';
}

function taskKindBadgeLabel(task: TaskItem): string {
  return TASK_KIND_LABEL[task.taskKind] ?? TASK_KIND_LABEL.other;
}

/** 列表「任务大类」子类型：去掉前导「类型」等冗余，避免与表头/大类重复啰嗦 */
function workbenchListTaskSubtypeClean(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .replace(/^类型[:：\s]*/u, '')
    .trim();
}

/** 列表单元格单行主文案：大类 + 子类型（中点连接，过长由 CSS 省略） */
function workbenchTaskTypeListLine(task: TaskItem): string {
  const kind = taskKindBadgeLabel(task);
  const sub = workbenchListTaskSubtypeClean(task.type);
  if (!sub) return kind;
  return `${kind} · ${sub}`;
}

/** 悬停展示完整子类型、驳回说明（列表格内不再占第二行） */
function workbenchTaskTypeListTooltip(task: TaskItem): string {
  const parts: string[] = [];
  const rawType = String(task.type ?? '').trim();
  if (rawType) parts.push(`子类型：${rawType}`);
  if (task.lastRejectRemark) parts.push(`驳回：${task.lastRejectRemark}`);
  return parts.join('\n');
}

/** 任务类型行前图标：独立应用 / WBS / 协同设计等子类型区分 */
function resolveWorkbenchTaskTypeIcon(task: TaskItem): Component {
  const type = String(task.type ?? '').trim();
  if (task.taskKind === 'standalone' || type.includes('独立应用')) {
    return AppstoreOutlined;
  }
  if (type === WBS_TASK_TYPE_COLLAB || type.includes('协同任务') || type.includes('协同设计')) {
    return HighlightOutlined;
  }
  if (type === WBS_TASK_TYPE_ASSIGN || type.includes('人员指派')) {
    return UserAddOutlined;
  }
  if (type.includes('分类协同') || type === WBS_TASK_TYPE_CATEGORY) {
    return BranchesOutlined;
  }
  if (task.taskKind === 'compute' || type.includes('计算')) {
    return CloudServerOutlined;
  }
  if (task.taskKind === 'wbs') {
    return ApartmentOutlined;
  }
  return SettingOutlined;
}

/**
 * 类型维度允许的按钮 ∩ 业务权限；仅已办展示详情；已办独立应用另展示变更；已办不展示设计
 * 已办：不展示指派/转办（完成后仅保留详情）；WBS 仅 task_type 为「协同任务」的卡片展示变更（分类协同、WBS 人员指派等不展示）
 * @param task
 * @param action
 */
function taskActionAllowed(task: TaskItem, action: TaskActionKey): boolean {
  if (task.viewOnly) {
    return false;
  }
  if (action === 'detail') {
    return task.status === 'done';
  }
  if (action === 'change') {
    if (task.status !== 'done') return false;
    if (task.taskKind === 'standalone') return true;
    if (task.taskKind === 'wbs') {
      if (!isWbsDesignTaskEligibleForChange(task)) return false;
      const wid = task.projectWbsId;
      return wid !== undefined && wid !== null && String(wid).trim() !== '';
    }
    return false;
  }
  if (action === 'design' && task.status === 'done') {
    return false;
  }
  if (task.status === 'done') {
    if (action === 'transfer' || action === 'assign') return false;
  }
  const allowed = TASK_KIND_ACTIONS[task.taskKind] ?? TASK_KIND_ACTIONS.other;
  if (!allowed.includes(action)) return false;
  if (action === 'assign') return canAssign(task);
  if (action === 'transfer') {
    if ((task.progress ?? 0) > 0) return false;
    return canRejectOrTransfer(task);
  }
  if (action === 'design') return canDesign(task);
  return true;
}

/**
 * 「WBS分配」类待办：进入项目信息编辑 — 任务管理，用于为下层节点分配负责人（需先拉取项目创建人信息）
 */
function openWbsPersonAssignFromWorkbench(task: TaskItem) {
  const title = String(task.title ?? '');
  if (!title.startsWith('【WBS分配】')) {
    message.info('请在项目任务管理中为下级分配负责人');
    return;
  }
  const projectId = task.projectId != null ? String(task.projectId).trim() : '';
  if (!projectId) {
    message.warning('待办缺少项目标识');
    return;
  }
  router.push({
    path: '/internal/project-info-editor',
    query: {
      id: projectId,
      tab: '3',
      wbsAssignEntry: '1',
    },
  });
}

/**
 * 设计入口：WBS 走协同参数页；独立应用走 project-pages → workspace；计算占位
 * @param task
 */
async function openDesignWorkspace(task: TaskItem) {
  if (task.taskKind === 'wbs') {
    const projectId = task.projectId != null ? String(task.projectId).trim() : '';
    /** 分类节点无独立「协同设计任务」：由发布/启动推送到工作台，用于提醒进入项目 WBS 继续分配人员 */
    if (isWbsCategoryCollaborationWorkbenchTask(task)) {
      if (!projectId) {
        message.warning('待办缺少项目标识，无法进入任务管理');
        return;
      }
      await router.push({
        path: '/internal/project-info-editor',
        query: {
          id: projectId,
          tab: '3',
          wbsAssignEntry: '1',
        },
      });
      return;
    }
    /** 协同任务已驳回或未发布：须先在项目 WBS 重新分配人员并发布，不可直接进协同设计 */
    if (isWbsCollabTaskUnpublishedForDesign(task)) {
      if (!projectId) {
        message.warning('待办缺少项目标识，无法进入任务管理');
        return;
      }
      message.info('当前任务未发布或已驳回，请先在项目任务管理中重新分配人员并发布任务');
      await router.push({
        path: '/internal/project-info-editor',
        query: {
          id: projectId,
          tab: '3',
          wbsAssignEntry: '1',
        },
      });
      return;
    }
    const taskId = task.taskId != null ? String(task.taskId).trim() : '';
    if (!taskId) {
      message.warning('缺少任务标识，无法进入协同设计');
      return;
    }
    if (!projectId) {
      message.warning('待办未返回项目标识，无法进入 WBS 协同设计（需接口补充 projectId）');
      return;
    }
    const hide = message.loading('加载协同设计工作台…', 0);
    try {
      const res = await AdminApiProjectTemp.wbsCollabProjectPages({
        projectId,
        taskId,
      });
      const payload = res?.data?.data as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        message.error('协同流程数据为空（请确认任务已发布 COLLAB 版本）');
        return;
      }
      const cacheKey = `designTaskCollabWorkspace:${projectId}:${taskId}:${Date.now()}`;
      sessionStorage.setItem(cacheKey, JSON.stringify(payload));
      const projectNameQ = task.projectDisplayName ? String(task.projectDisplayName).trim() : '';
      await router.push({
        path: '/internal/design-task-app-workspace',
        query: {
          cacheKey,
          taskId,
          projectId,
          workspaceMode: 'wbs',
          ...(projectNameQ ? { projectName: projectNameQ } : {}),
        },
      });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { msg?: string; message?: string } } };
      const serverMsg = err?.response?.data?.msg ?? err?.response?.data?.message;
      message.error(typeof serverMsg === 'string' && serverMsg.trim() ? serverMsg : '加载协同设计工作台失败');
    } finally {
      hide();
    }
    return;
  }
  if (task.taskKind === 'compute') {
    message.info('计算任务设计工作台尚未接入');
    return;
  }

  let appId: string | undefined = task.standaloneAppId != null ? String(task.standaloneAppId).trim() : '';
  if (!appId || appId === '0') {
    const tid = task.taskId != null ? String(task.taskId).trim() : '';
    if (tid) {
      try {
        const res = await AdminApiSystemProcessTask.appList({ taskId: tid });
        const list = res?.data?.data as Array<{ appId?: unknown; id?: unknown }> | undefined;
        const first = Array.isArray(list) && list.length ? list[0] : null;
        const aid = first?.appId ?? first?.id;
        if (aid != null && aid !== '') {
          appId = String(aid).trim();
        }
      } catch {
        // 忽略，后面统一提示
      }
    }
  }
  if (!appId || appId === '0') {
    message.warning('当前任务暂无关联独立应用，无法进入设计页面');
    return;
  }
  try {
    const res = await AdminApiSystemProcessTask.projectPages({ appId });
    const payload = res?.data?.data as Record<string, unknown> | undefined;
    if (!payload || typeof payload !== 'object') {
      message.error('流程页面数据为空');
      return;
    }
    const cacheKey = `designTaskAppWorkspace:${String(payload.appId ?? appId)}:${Date.now()}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    const taskId = String(task.taskId ?? '').trim();
    const targetAppId = String((payload.appId as string | number | undefined) ?? appId).trim();
    await router.push({
      path: '/internal/design-task-app-workspace',
      query: { cacheKey, taskId, appId: targetAppId },
    });
  } catch {
    message.error('获取流程页面失败');
  }
}

/**
 * 已办进入设计任务应用列表页
 * @param task
 */
function openTaskAppDetail(task: TaskItem) {
  if (task.status !== 'done') {
    return;
  }
  const tid = task.taskId ?? task.id;
  if (tid == null || tid === '') {
    message.warning('缺少任务标识，无法打开详情');
    return;
  }
  const taskObj = {
    id: tid,
    processName: workbenchCardDisplayTitle(task),
    categoryName: workbenchCardDisplayTitle(task),
  };
  const cacheKey = `designTaskAppDetail:${String(tid)}:${Date.now()}`;
  sessionStorage.setItem(cacheKey, JSON.stringify(taskObj));
  void router.push({
    path: '/internal/design-task-app-detail',
    query: { cacheKey, returnPath: route.fullPath },
  });
}

function closeWbsChangeModal() {
  wbsChangeModalVisible.value = false;
  wbsChangeTargetTask.value = null;
}

async function openTransferModal(task: TaskItem) {
  if ((task.progress ?? 0) > 0) {
    message.warning('任务已开始执行（进度大于 0），不可转办');
    return;
  }
  const pid = task.projectId != null ? String(task.projectId).trim() : '';
  if (!pid) {
    message.warning('缺少项目信息，无法转办');
    return;
  }
  transferTargetTask.value = task;
  transferSelectedUserId.value = undefined;
  transferCandidateOptions.value = [];
  transferModalVisible.value = true;
  await loadTransferCandidates(pid);
}

function closeTransferModal() {
  transferModalVisible.value = false;
  transferTargetTask.value = null;
}

async function loadTransferCandidates(projectId: string) {
  transferCandidatesLoading.value = true;
  transferCandidateOptions.value = [];
  try {
    const res = await AdminApiProjectTemp.workbenchTodoTransferCandidates({ projectId });
    const code = res?.data?.code;
    const raw = res?.data?.data as unknown;
    const list = Array.isArray(raw) ? raw : (raw as { list?: unknown[] })?.list;
    if ((code === 0 || code === 200) && Array.isArray(list)) {
      transferCandidateOptions.value = list
        .map((row: Record<string, unknown>) => ({
          userId: String(row.userId ?? row.user_id ?? ''),
          displayName: String(row.displayName ?? row.display_name ?? ''),
        }))
        .filter(u => u.userId.trim() !== '')
        .map(u => ({
          ...u,
          displayName: u.displayName.trim() !== '' ? u.displayName : u.userId,
        }));
    }
  } catch {
    message.error('加载项目团队成员失败');
  } finally {
    transferCandidatesLoading.value = false;
  }
}

async function submitWorkbenchTransfer() {
  const task = transferTargetTask.value;
  const toId = transferSelectedUserId.value;
  if (!task || !toId) {
    message.warning('请选择接收人');
    return;
  }
  transferSubmitLoading.value = true;
  try {
    await AdminApiProjectTemp.workbenchTodoCardTransfer({
      cardId: String(task.id),
      toAssigneeUserId: String(toId),
    });
    closeTransferModal();
    message.success('转办成功');
    await loadTodoListFromApi();
    await loadWorkbenchSummary();
  } catch (e: unknown) {
    showRequestErrorIfNeeded(e, '转办失败');
  } finally {
    transferSubmitLoading.value = false;
  }
}

function openRejectModal(task: TaskItem | WorkbenchBpmTaskItem) {
  rejectTargetTask.value = task;
  rejectOpinion.value = '';
  rejectModalVisible.value = true;
}

function closeRejectModal() {
  rejectModalVisible.value = false;
  rejectTargetTask.value = null;
  rejectOpinion.value = '';
}

async function submitWorkbenchReject() {
  const task = rejectTargetTask.value;
  const opinion = rejectOpinion.value.trim();
  if (!task) {
    return;
  }
  if (!opinion) {
    message.warning('请填写驳回意见');
    return;
  }
  rejectSubmitLoading.value = true;
  try {
    await AdminApiProjectTemp.workbenchTodoCardReject({
      cardId: String(task.id),
      opinion,
    });
    closeRejectModal();
    message.success('已驳回，任务已退回上级分配人，进度已重置');
    await loadTodoListFromApi();
    await loadWorkbenchSummary();
  } catch (e: unknown) {
    showRequestErrorIfNeeded(e, '驳回失败');
  } finally {
    rejectSubmitLoading.value = false;
  }
}

/**
 * 已转办 WBS：标记变更并确认重开 → 进入协同设计（与 ProjectTaskWbsPanel 变更流程一致）
 */
async function executeWbsChangeFromWorkbench() {
  const task = wbsChangeTargetTask.value;
  const wbsIdRaw = task?.projectWbsId;
  if (!task || wbsIdRaw === undefined || wbsIdRaw === null || String(wbsIdRaw).trim() === '') {
    message.warning('缺少 WBS 节点标识');
    return;
  }
  const wbsIdStr = String(wbsIdRaw).trim();
  const applyLatest = wbsChangeApplyLatest.value === 1 ? 1 : 0;
  wbsChangeSubmitLoading.value = true;
  try {
    await AdminApiProjectTemp.projectWbsMarkChange({ id: wbsIdStr });
    await AdminApiProjectTemp.projectWbsReopenTask({
      id: wbsIdStr,
      applyLatestValue: applyLatest,
    });
    closeWbsChangeModal();
    message.success('已发起变更，正在进入协同设计…');
    await openDesignWorkspace(task);
    await loadTodoListFromApi();
  } catch (e: unknown) {
    showRequestErrorIfNeeded(e, '变更失败');
  } finally {
    wbsChangeSubmitLoading.value = false;
  }
}

/**
 * 已办独立应用：后端撤销末节点完成态后进入设计页（末节点「设计中」）；已办 WBS 弹出变更选项后走协同
 * @param task
 */
async function openChangeWorkspace(task: TaskItem) {
  if (task.status !== 'done') return;
  if (task.taskKind === 'wbs') {
    if (!isWbsDesignTaskEligibleForChange(task)) {
      message.info('仅「协同任务」支持发起变更；分类协同请在任务管理中分配下级，人员指派类任务无协同变更流程');
      return;
    }
    const wid = task.projectWbsId;
    if (wid === undefined || wid === null || String(wid).trim() === '') {
      message.warning('待办缺少 WBS 节点标识，无法发起变更');
      return;
    }
    wbsChangeTargetTask.value = task;
    wbsChangeApplyLatest.value = 0;
    wbsChangeModalVisible.value = true;
    return;
  }
  if (task.taskKind !== 'standalone') {
    return;
  }
  let appId: string | undefined = task.standaloneAppId != null ? String(task.standaloneAppId).trim() : '';
  if (!appId || appId === '0') {
    const tid = task.taskId != null ? String(task.taskId).trim() : '';
    if (tid) {
      try {
        const res = await AdminApiSystemProcessTask.appList({ taskId: tid });
        const list = res?.data?.data as Array<{ appId?: unknown; id?: unknown }> | undefined;
        const first = Array.isArray(list) && list.length ? list[0] : null;
        const aid = first?.appId ?? first?.id;
        if (aid != null && aid !== '') {
          appId = String(aid).trim();
        }
      } catch {
        /* ignore */
      }
    }
  }
  if (!appId || appId === '0') {
    message.warning('当前任务暂无关联独立应用，无法变更');
    return;
  }
  const taskIdStr = String(task.taskId ?? '').trim();
  if (!taskIdStr) {
    message.warning('缺少任务标识');
    return;
  }
  const hideLoading = message.loading('变更处理中，请稍候…', 0);
  try {
    await AdminApiSystemProcessTask.reopenLastNodeForChange({
      appId,
      taskId: taskIdStr,
    });
    await openDesignWorkspace(task);
    await loadTodoListFromApi();
  } catch (e: unknown) {
    showRequestErrorIfNeeded(e, '变更失败');
  } finally {
    hideLoading();
  }
}
const tableTodoList = computed(() =>
  todoList.value.map(item => ({
    ...item,
    displayTime: hasTimelineInfo(item) ? `${item.startTime} ~ ${item.endTime}` : '/',
  })),
);

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

function syncLoginUserInfo() {
  const currentUser = (userStore.getUser || {}) as Record<string, any>;
  userInfoObj.value.name = currentUser.nickname || currentUser.userName || '';
  userInfoObj.value.departName =
    currentUser.departName ||
    currentUser.departmentName ||
    currentUser.deptName ||
    currentUser.orgName ||
    currentUser.userCategoryName ||
    '';
}

/** 对接后端 WorkbenchTodoCardSummaryVO，驱动首页顶部数字条 */
async function loadWorkbenchSummary() {
  const uid = userStore.getUser?.id;
  if (uid == null) return;
  try {
    const res = await AdminApiProjectTemp.workbenchTodoCardSummary({
      assigneeUserId: String(uid),
    });
    const code = res?.data?.code;
    const payload = res?.data?.data as Record<string, number> | undefined;
    if ((code === 0 || code === 200) && payload && typeof payload === 'object') {
      projectStatistics.value = payload;
      todoChartData.value = {
        delay: payload.deferredNum ?? 0,
        todo: payload.totalNum ?? 0,
        audit: payload.participatedPlanProjectCount ?? 0,
        done: payload.doneNum ?? payload.finishNum ?? 0,
        total: payload.inNum ?? 0,
      };
      nextTick(() => {
        initTodoChart();
      });
    }
  } catch {
    /** 汇总失败时保留默认 0，不打断首页 */
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
 * @param id
 */
async function seeDetailFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
  const data = res.data.data.systemNoticeInfoBaseDTO;
  const filedata = res.data.data;
  powVisible.value = true;
  nextTick(() => {
    powerModel.value.getDetailFromMain(data, filedata);
  });
}
// -----------------------------------------------流程任务-------------------------------------------------------
// 查询参数
const queryParams = reactive<RRQueryParams>({
  pageIndex: 1,
  pageRows: 30,
  orderByBean: { sortType: 'asc', attributeName: '' },
  params: {},
});
/**
 * 流程任务列表：按 auditSecondaryFilter 分别调用待办 / 已转办 / 我的流程接口。
 */
function buildProcessQueryParams() {
  const keyword = searchQuery.value.trim();
  return {
    pageIndex: queryParams.pageIndex,
    pageRows: queryParams.pageRows,
    orderByBean: queryParams.orderByBean,
    params: {
      ...queryParams.params,
      ...(keyword ? { name: keyword } : {}),
    },
  };
}

/** 解析 BPM 分页响应（兼容 data 为数组或 { data, count } 嵌套） */
function parseBpmTaskPageResponse(res: { data?: { code?: number; data?: unknown } }): {
  list: WorkbenchBpmTaskItem[];
  total: number;
} {
  const body = res?.data;
  if (!body || (body.code !== 200 && body.code !== 0)) {
    return { list: [], total: 0 };
  }
  const inner = body.data;
  if (Array.isArray(inner)) {
    return { list: inner as WorkbenchBpmTaskItem[], total: inner.length };
  }
  if (inner && typeof inner === 'object') {
    const pageData = inner as {
      data?: WorkbenchBpmTaskItem[];
      count?: number;
      total?: number;
      totalCount?: number;
    };
    const list = Array.isArray(pageData.data) ? pageData.data : [];
    const total = Number(pageData.count ?? pageData.total ?? pageData.totalCount ?? list.length);
    return { list, total: Number.isFinite(total) ? total : list.length };
  }
  return { list: [], total: 0 };
}

async function loadAuditListFromApi() {
  auditListLoading.value = true;
  try {
    const requestBody = buildProcessQueryParams();
    let res;
    switch (auditSecondaryFilter.value) {
      case 'todo':
        res = await getMyTodoTask(requestBody);
        break;
      case 'done':
        res = await getMyDoneTask(requestBody);
        break;
      case 'myProcess':
        res = await getMyProcessInstance(requestBody);
        break;
      default:
        auditList.value = [];
        auditProcessTotal.value = 0;
        return;
    }
    const { list, total } = parseBpmTaskPageResponse(res);
    auditList.value = list;
    auditProcessTotal.value = total;
  } catch (e) {
    showRequestErrorIfNeeded(e, '加载流程任务列表失败');
    auditList.value = [];
    auditProcessTotal.value = 0;
  } finally {
    auditListLoading.value = false;
  }
}
const tableProcessList = computed(() =>
  filteredAuditList.value.map(item => ({
    ...item,
    displayTime: hasTimelineInfo(item) ? `${item.startTime} ~ ${item.endTime}` : '/',
  })),
);

function handleProcessTablePageChange(page: number, pageSize: number) {
  queryParams.pageIndex = page;
  queryParams.pageRows = pageSize;
  void loadAuditListFromApi();
}

const processTablePagination = computed(() => ({
  current: queryParams.pageIndex,
  pageSize: queryParams.pageRows,
  total: auditProcessTotal.value,
  showSizeChanger: true,
  showQuickJumper: false,
  showTotal: (total: number) => `${WeiI18n.$t('共')}${total}${WeiI18n.$t('条')}`,
  pageSizeOptions: ['10', '20', '30', '50'],
  onChange: handleProcessTablePageChange,
  onShowSizeChange: handleProcessTablePageChange,
}));
/** 卡片 / 列表展示标题（仅展示服务端 title， */
function workbenchbpmCardDisplayTitle(task: WorkbenchBpmTaskItem): string {
  return String(task.processInstance.processVariables?.ModelList?.[0]?.para1 ?? '').trim();
}
const processColumns = ref([
  {
    title: '主题',
    dataIndex: 'PROCESS_BUSINESS_TYPE_NAME',
    key: 'PROCESS_BUSINESS_TYPE_NAME',
    width: 250,
    resizable: true,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '流程节点',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 80,
    resizable: true,
    align: 'center',
    customFilterDropdown: true,
    onFilter: (value: string, record: TaskItem) =>
      workbenchCardDisplayTitle(record).toLowerCase().includes(String(value).toLowerCase()),
    sorter: (a: TaskItem, b: TaskItem) => workbenchCardDisplayTitle(a).localeCompare(workbenchCardDisplayTitle(b), 'zh-CN'),
  },
  {
    title: '流程状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
    align: 'center',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '执行人',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120,
    align: 'center',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '发起时间',
    key: 'createTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getTimeSortValue(a) - getTimeSortValue(b),
  },
  { title: '操作', key: 'action', width: 80, align: 'center', fixed: 'right', resizable: true },
]);
const doneColumns = ref([
  {
    title: '主题',
    dataIndex: 'PROCESS_BUSINESS_TYPE_NAME',
    key: 'PROCESS_BUSINESS_TYPE_NAME',
    width: 250,
    resizable: true,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '流程节点',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 80,
    resizable: true,
    align: 'center',
    customFilterDropdown: true,
    onFilter: (value: string, record: TaskItem) =>
      workbenchCardDisplayTitle(record).toLowerCase().includes(String(value).toLowerCase()),
    sorter: (a: TaskItem, b: TaskItem) => workbenchCardDisplayTitle(a).localeCompare(workbenchCardDisplayTitle(b), 'zh-CN'),
  },
  {
    title: '流程状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
    align: 'center',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '执行人',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120,
    align: 'center',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '发起时间',
    key: 'createTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'createTime') - getBpmRecordTimeSortValue(b, 'createTime'),
  },
  {
    title: '任务开始时间',
    key: 'taskCreateTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'createTime') - getBpmRecordTimeSortValue(b, 'createTime'),
  },
  {
    title: '任务结束时间',
    key: 'endTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'endTime') - getBpmRecordTimeSortValue(b, 'endTime'),
  },
  {
    title: '审批建议',
    dataIndex: 'reason',
    key: 'reason',
    width: 176,
    resizable: true,
    ellipsis: true,
  },
  {
    title: '耗时',
    dataIndex: 'durationInMillis',
    key: 'durationInMillis',
    width: 100,
    resizable: true,
    ellipsis: true,
  },
  { title: '操作', key: 'action', width: 80, align: 'center', fixed: 'right', resizable: true },
]);
const myProcessColumns = ref([
  {
    title: '主题',
    dataIndex: 'PROCESS_BUSINESS_TYPE_NAME',
    key: 'PROCESS_BUSINESS_TYPE_NAME',
    width: 250,
    resizable: true,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '流程节点',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 140,
    resizable: true,
    align: 'center',
    customFilterDropdown: true,
    onFilter: (value: string, record: TaskItem) =>
      workbenchCardDisplayTitle(record).toLowerCase().includes(String(value).toLowerCase()),
    sorter: (a: TaskItem, b: TaskItem) => workbenchCardDisplayTitle(a).localeCompare(workbenchCardDisplayTitle(b), 'zh-CN'),
  },
  {
    title: '流程状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
    align: 'center',
    resizable: true,
    ellipsis: true,
  },
  {
    title: '发起时间',
    key: 'createTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'createTime') - getBpmRecordTimeSortValue(b, 'createTime'),
  },
  {
    title: '任务开始时间',
    key: 'startTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'startTime') - getBpmRecordTimeSortValue(b, 'startTime'),
  },
  {
    title: '任务结束时间',
    key: 'endTime',
    width: 150,
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => getBpmRecordTimeSortValue(a, 'endTime') - getBpmRecordTimeSortValue(b, 'endTime'),
  },
  {
    title: '耗时',
    dataIndex: 'durationInMillis',
    key: 'durationInMillis',
    width: 100,
    resizable: true,
    ellipsis: true,
  },
  { title: '操作', key: 'action', width: 80, align: 'center', fixed: 'right', resizable: true },
]);
/** 流程任务列表视图：待办 processColumns，已办 doneColumns，我的流程 myProcessColumns */
const currentProcessTableColumns = computed(() => {
  switch (auditSecondaryFilter.value) {
    case 'myProcess':
      return myProcessColumns.value;
    case 'done':
      return doneColumns.value;
    default:
      return processColumns.value;
  }
});

const processTableScrollX = computed(() => {
  const cols = currentProcessTableColumns.value;
  return cols.reduce((sum, col) => sum + (typeof col.width === 'number' ? col.width : 0), 0) + 24;
});

/** 流程任务列表筛选（关键字前端过滤；列表数据由接口按二级 Tab 返回） */
const filteredAuditList = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  if (!keyword) return auditList.value;

  return auditList.value.filter(item => {
    const hay =
      `${item.name ?? ''} ${workbenchbpmCardDisplayTitle(item)} ${item.processInstance?.name ?? ''} ${item.projectDisplayName ?? ''} ${item.appDisplayName ?? ''}`
        .trim()
        .toLowerCase();
    return hay.includes(keyword);
  });
});
type BpmTaskAction = 'design' | 'detail' | 'history' | 'cancel';

/** 流程待办：编制节点展示「提交」，其余节点展示「审批」 */
function isBpmEstablishmentTask(task: WorkbenchBpmTaskItem) {
  return task.name === ETASKTYPE.ESTABLISHMENT;
}

/** 流程任务按钮权限：待办=待办+详情，已办=历史，我的流程=详情+取消 */
function taskbpmActionAllowed(_task: WorkbenchBpmTaskItem, action: BpmTaskAction) {
  switch (auditSecondaryFilter.value) {
    case 'todo':
      return action === 'design' || action === 'detail';
    case 'done':
      return action === 'history';
    case 'myProcess':
      return action === 'detail' || action === 'cancel';
    default:
      return false;
  }
}

const openbpmDesignWorkspace = (task: WorkbenchBpmTaskItem) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: task.processInstance.id,
      pDefinitionId: task.processInstance.processDefinitionId,
      pProcessDefinitionKey: task.processInstance.processDefinitionKey,
      type: task.name,
      pIId: task.processInstance.id,
      activeTab: 1,
      tId: task.id,
      pageIndex: queryParams.pageIndex,
      taskDefinitionKey: task.taskDefinitionKey,
      taskName: task.name,
      ...buildWorkbenchReturnQuery({
        activeName: activeName.value as 'todo' | 'process',
        auditSecondaryFilter: auditSecondaryFilter.value,
        secondaryFilter: secondaryFilter.value,
      }),
    },
  });
};

const openbpmTaskAppDetail = (task: WorkbenchBpmTaskItem) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: task.processInstance.id,
      pDefinitionId: task.processInstance.processDefinitionId,
      pProcessDefinitionKey: task.processInstance.processDefinitionKey,
      pIId: task.processInstance.id,
      readType: 0,
      pageIndex: queryParams.pageIndex,
      ...buildWorkbenchReturnQuery({
        activeName: activeName.value as 'todo' | 'process',
        auditSecondaryFilter: auditSecondaryFilter.value,
        secondaryFilter: secondaryFilter.value,
      }),
    },
  });
};

const openbpmTaskHistory = (task: WorkbenchBpmTaskItem) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: task.processInstance.id,
      taskId: task.id,
      ...buildWorkbenchReturnQuery({
        activeName: activeName.value as 'todo' | 'process',
        auditSecondaryFilter: auditSecondaryFilter.value,
        secondaryFilter: secondaryFilter.value,
      }),
    },
  });
};

function openBpmCancelModal(task: WorkbenchBpmTaskItem) {
  bpmCancelTargetTask.value = task;
  bpmCancelModalVisible.value = true;
}

function handleBpmCancelVisibleChange(visible: boolean) {
  bpmCancelModalVisible.value = visible;
  if (!visible) {
    bpmCancelTargetTask.value = null;
  }
}

// 页面挂载时执行一次，并设置定时器每分钟更新（避免时间变化后问候语不更新）
let todoSearchDebounce: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, () => {
  if (todoSearchDebounce) clearTimeout(todoSearchDebounce);
  todoSearchDebounce = setTimeout(() => {
    if (activeName.value === 'process') {
      queryParams.pageIndex = 1;
      void loadAuditListFromApi();
    } else {
      resetTodoListPage();
      void loadTodoListFromApi();
    }
  }, 400);
});

watch(secondaryFilter, () => {
  resetTodoListPage();
  void loadTodoListFromApi();
});

watch(auditSecondaryFilter, () => {
  queryParams.pageIndex = 1;
  void loadAuditListFromApi();
});

watch(activeName, name => {
  if (name === 'process') {
    void loadAuditListFromApi();
  }
});

watch(
  () => userStore.getUser?.id,
  () => {
    void loadWorkbenchSummary();
    void loadTodoListFromApi();
  },
);

/** 从流程详情返回时，根据路由 query 恢复顶栏 / 二级 Tab 并加载列表 */
function applyWorkbenchRouteQuery() {
  if (!isWorkbenchReturnRouteQuery(route.query)) {
    return;
  }

  const parsed = parseWorkbenchRouteQuery(route.query);
  if (parsed.activeName) {
    activeName.value = parsed.activeName;
  }
  if (parsed.auditSecondaryFilter) {
    auditSecondaryFilter.value = parsed.auditSecondaryFilter;
  }
  if (parsed.secondaryFilter) {
    secondaryFilter.value = parsed.secondaryFilter;
  }

  if (activeName.value === 'process') {
    void loadAuditListFromApi();
  } else {
    void loadTodoListFromApi();
  }
}

watch(
  () => [route.query.activeName, route.query.auditSecondaryFilter, route.query.secondaryFilter],
  () => applyWorkbenchRouteQuery(),
  { immediate: true },
);

onMounted(() => {
  syncLoginUserInfo();
  void loadWorkbenchSummary();
  void loadTodoListFromApi();
  getNoticePage();
  getGreeting();
  // 每分钟更新一次，确保时间准确
  timer = setInterval(getGreeting, 60 * 1000);
  nextTick(() => {
    initTodoChart();
  });
});

/** 从设计工作台等子页 router.back 返回时 Main keep-alive 不会触发 onMounted，需在此刷新列表与顶部指标（跳过首次与 onMounted 重复的一次） */
const skipWorkbenchActivatedRefreshOnce = ref(true);
onActivated(() => {
  const restoredFromRoute = isWorkbenchReturnRouteQuery(route.query);
  applyWorkbenchRouteQuery();
  if (skipWorkbenchActivatedRefreshOnce.value) {
    skipWorkbenchActivatedRefreshOnce.value = false;
    return;
  }
  void loadWorkbenchSummary();
  if (!restoredFromRoute) {
    if (activeName.value === 'process') {
      void loadAuditListFromApi();
    } else {
      void loadTodoListFromApi();
    }
  }
});

// 页面卸载时清除定时器，避免内存泄漏
onUnmounted(() => {
  // clearInterval(timer);
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
        <div
          class="top-wrap items-center !rounded-[6px] border border-[#EAEAF1] !bg-white wei-scrollbar overflow-x-auto overflow-y-hidden">
          <!-- 左侧用户信息 -->
          <div class="user-info w-[320px] flex-shrink-0 pl-[24px]">
            <div class="pic">
              <img src="../../assets/workbench/people.png" alt="" />
              <i :class="userInfoObj.sex == '女' ? 'women' : 'man'" />
            </div>
            <div class="info">
              <div class="name">{{ greetingText }}，{{ userInfoObj.name }}</div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="w-[1px] h-[60px] bg-[#EAEAF1] mx-[16px] flex-shrink-0 self-center" />

          <!-- 右侧统计数据 -->
          <div class="statistics-info flex-1 flex justify-around items-center h-full">
            <div class="sta-list min-w-[56px]">
              <div class="num" style="color: #ff4d4f">
                {{ projectStatistics.deferredNum ?? 0 }}
              </div>
              <div class="type !mb-0" style="margin-top: 8px">延期待办</div>
            </div>
            <div class="sta-list min-w-[56px]">
              <div class="num" style="color: #faad14">
                {{ projectStatistics.totalNum ?? 0 }}
              </div>
              <div class="type !mb-0" style="margin-top: 8px">任务待办</div>
            </div>
            <div class="sta-list min-w-[56px]">
              <div class="num" style="color: #1a58e8">
                {{ projectStatistics.participatedPlanProjectCount ?? 0 }}
              </div>
              <div class="type !mb-0" style="margin-top: 8px">审批待办</div>
            </div>
            <div class="sta-list min-w-[56px]">
              <div class="num" style="color: #1a58e8">
                {{ projectStatistics.forwardNum ?? 0 }}
              </div>
              <div class="type !mb-0" style="margin-top: 8px">我已转办</div>
            </div>
            <div class="sta-list min-w-[56px]">
              <div class="num" style="color: #313133">
                {{ projectStatistics.inNum ?? 0 }}
              </div>
              <div class="type !mb-0" style="margin-top: 8px">参与项目</div>
            </div>
          </div>
        </div>
        <div class="work-wrap">
          <a-tabs v-model:active-key="activeName" class="work_nav_top">
            <template #rightExtra>
              <a-input v-model:value="searchQuery" placeholder="请输入任务名称" style="width: 240px; border-radius: 4px">
                <template #suffix>
                  <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
                </template>
              </a-input>
            </template>
            <a-tab-pane v-for="item in tabs" :key="item.name">
              <template #tab>
                <div
                  class="flex items-center gap-1 text-[16px]"
                  :class="{ 'font-bold': activeName === item.name }"
                  :style="{ color: activeName === item.name ? '#124dd6' : '' }">
                  <span>{{ item.title }}</span>
                  <!-- 角标仅挂在「设计任务」上；勿用固定 left 像素，否则会叠到「待审核」标签上 -->
                  <a-badge
                    v-if="item.name === 'todo' && (projectStatistics.todoNum ?? 0) > 0"
                    :count="projectStatistics.todoNum"
                    :overflow-count="99" />
                  <a-badge
                    v-if="item.name === 'process' && (projectStatistics.participatedPlanProjectCount ?? 0) > 0"
                    :count="projectStatistics.participatedPlanProjectCount"
                    :overflow-count="99" />
                </div>
              </template>

              <div v-if="item.name === 'todo'" class="task-content flex flex-col flex-1 min-h-0 h-full">
                <div class="filter-bar flex-shrink-0 flex justify-between items-center mb-[16px] mt-[3px]">
                  <div class="capsule-group flex gap-[12px]">
                    <div
                      v-for="subTab in secondaryTabs"
                      :key="subTab.value"
                      class="capsule"
                      :class="{ active: secondaryFilter === subTab.value }"
                      @click="secondaryFilter = subTab.value">
                      {{ subTab.title }}
                    </div>
                  </div>
                  <div class="view-toggles flex gap-[16px] text-[18px]">
                    <AppstoreOutlined
                      :class="{
                        'text-[var(--ant-primary-color)]': viewMode === 'grid',
                        'text-[#999]': viewMode !== 'grid',
                      }"
                      class="cursor-pointer"
                      @click="viewMode = 'grid'" />
                    <UnorderedListOutlined
                      :class="{
                        'text-[var(--ant-primary-color)]': viewMode === 'list',
                        'text-[#999]': viewMode !== 'list',
                      }"
                      class="cursor-pointer"
                      @click="viewMode = 'list'" />
                  </div>
                </div>

                <a-spin :spinning="todoListLoading" class="task-list-spin flex-1 min-h-0 flex flex-col">
                  <div class="task-list-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden wei-scrollbar h-full">
                    <Empty v-if="!todoListLoading && todoList.length === 0" description="暂无数据" />
                    <template v-else-if="viewMode === 'grid'">
                      <a-row :gutter="[16, 12]" align="top" class="task-card-grid">
                        <a-col v-for="item in todoList" :key="String(item.id)" :span="8">
                          <div class="task-card" :class="taskCardKindClass(item)">
                            <div v-if="workbenchShowOverdueUi(item)" class="task-card__overdue-corner">延期</div>
                            <div class="task-card__type-ribbon">
                              <span class="task-card__type-ribbon-inner">
                                <ApartmentOutlined v-if="item.taskKind === 'wbs'" />
                                <MobileOutlined v-else-if="item.taskKind === 'standalone'" />
                                <CloudServerOutlined v-else-if="item.taskKind === 'compute'" />
                                <SettingOutlined v-else />
                                {{ taskKindBadgeLabel(item) }}
                              </span>
                            </div>
                            <div class="tc-header flex justify-between items-start">
                              <div class="title-wrap flex items-center flex-1 pr-[6px] overflow-hidden">
                                <span
                                  class="title-text truncate font-bold text-[14px] leading-[20px] text-[#313133]"
                                  :title="workbenchCardDisplayTitle(item)"
                                  >{{ workbenchCardDisplayTitle(item) }}</span
                                >

                                <span
                                  v-for="tag in item.tags.filter(
                                    t => t !== '待办' && !(workbenchShowOverdueUi(item) && t === '延'),
                                  )"
                                  :key="tag"
                                  class="tc-tag flex-shrink-0"
                                  :class="getTagClass(tag)"
                                  >{{ tag }}</span
                                >
                              </div>
                              <a-dropdown v-if="showWbsRejectMenu(item)" :trigger="['hover']">
                                <EllipsisOutlined class="text-[18px] text-[#999] cursor-pointer" />
                                <template #overlay>
                                  <a-menu @click="({ key }: { key: string }) => key === 'reject' && openRejectModal(item)">
                                    <a-menu-item key="reject"> 驳回 </a-menu-item>
                                  </a-menu>
                                </template>
                              </a-dropdown>
                            </div>

                            <div class="tc-body mt-[8px] space-y-[6px] text-[13px] leading-[18px] text-[#6A696E]">
                              <div class="flex">
                                <span class="w-[68px] flex-shrink-0">项目时间：</span>
                                <span class="min-w-0 truncate">{{
                                  hasTimelineInfo(item) ? `${item.startTime} ~ ${item.endTime}` : '/'
                                }}</span>
                              </div>
                              <div class="tc-type-row flex items-center gap-[4px] min-w-0 text-[13px] leading-[18px]">
                                <span class="w-[68px] flex-shrink-0 text-[#6A696E]">任务类型：</span>
                                <span class="text-[#313133] min-w-0 flex-1 flex items-center gap-[4px]">
                                  <component :is="resolveWorkbenchTaskTypeIcon(item)" class="tc-type-icon flex-shrink-0" />
                                  <span class="truncate">{{ item.type }}</span>
                                </span>
                                <template v-if="item.lastRejectRemark">
                                  <a-tooltip placement="topLeft" :overlay-style="{ maxWidth: '360px' }">
                                    <template #title>
                                      <span style="white-space: pre-wrap">驳回：{{ item.lastRejectRemark }}</span>
                                    </template>
                                    <span
                                      class="reject-inline flex-shrink-0 max-w-[42%] min-w-0 text-[12px] font-medium text-[#FA8C16] truncate cursor-default border-l border-[#F0F0F0] pl-[8px] ml-[2px]">
                                      驳回：{{ item.lastRejectRemark }}
                                    </span>
                                  </a-tooltip>
                                </template>
                              </div>
                              <div v-if="item.viewOnly && item.assigneeDisplayName" class="flex">
                                <span class="w-[68px] flex-shrink-0">当前承办：</span>
                                <span class="text-[#313133] font-medium truncate">{{ item.assigneeDisplayName }}</span>
                              </div>
                              <div class="flex justify-between items-center pr-[6px]">
                                <div class="flex min-w-0">
                                  <span class="w-[68px] flex-shrink-0">当前进度：</span>
                                  <span class="text-[#313133] font-bold">{{ item.progress }}%</span>
                                </div>
                                <span v-if="item.status === 'todo' && item.delayDays" class="text-[#FF4D4F]"
                                  >已延期 {{ item.delayDays }} 天</span
                                >
                                <span v-else-if="hasTimelineInfo(item) && item.remainDays" class="text-[#6A696E]"
                                  >距截止还剩 {{ item.remainDays }} 天</span
                                >
                              </div>
                              <a-progress
                                :percent="item.progress"
                                :show-info="false"
                                :stroke-width="6"
                                trail-color="#F0F0F0"
                                class="mt-[4px] !mb-0"
                                :class="workbenchShowOverdueUi(item) ? 'delay-progress' : 'normal-progress'" />
                            </div>

                            <div class="tc-footer mt-[8px] flex items-center text-[13px] leading-[18px] text-[#6A696E]">
                              <span class="w-[52px] flex-shrink-0">创建人：</span>
                              <div class="creator-badge flex items-center bg-[#F4F4F5] rounded-[12px] px-[6px] py-[1px]">
                                <img
                                  v-if="item.creatorAvatar"
                                  :src="item.creatorAvatar"
                                  class="w-[18px] h-[18px] rounded-full mr-[4px]" />
                                <img
                                  v-else
                                  src="../../assets/workbench/people.png"
                                  class="w-[18px] h-[18px] rounded-full mr-[4px]" />
                                <span class="truncate max-w-[88px]">{{ item.creatorName }}</span>
                              </div>
                              <div class="tc-actions ml-auto flex items-center gap-[10px]">
                                <a-tooltip v-if="taskActionAllowed(item, 'design')" :title="designWorkspaceTooltip(item)">
                                  <a
                                    href="#"
                                    class="tc-action-icon text-primary cursor-pointer text-[15px] leading-none"
                                    @click.prevent.stop="openDesignWorkspace(item)">
                                    <HighlightOutlined />
                                  </a>
                                </a-tooltip>
                                <a-tooltip v-if="taskActionAllowed(item, 'assign')" title="指派">
                                  <a
                                    href="#"
                                    class="tc-action-icon text-primary cursor-pointer text-[15px] leading-none"
                                    @click.prevent.stop="openWbsPersonAssignFromWorkbench(item)">
                                    <UserAddOutlined />
                                  </a>
                                </a-tooltip>
                                <a-tooltip v-if="taskActionAllowed(item, 'transfer')" title="转办">
                                  <a
                                    href="#"
                                    class="tc-action-icon text-primary cursor-pointer text-[15px] leading-none"
                                    @click.prevent.stop="openTransferModal(item)">
                                    <SwapOutlined />
                                  </a>
                                </a-tooltip>
                                <a-tooltip v-if="taskActionAllowed(item, 'detail')" title="详情">
                                  <a
                                    href="#"
                                    class="tc-action-icon text-primary cursor-pointer text-[15px] leading-none"
                                    @click.prevent.stop="openTaskAppDetail(item)">
                                    <ProfileOutlined />
                                  </a>
                                </a-tooltip>
                                <a-tooltip v-if="taskActionAllowed(item, 'change')" title="变更">
                                  <a
                                    href="#"
                                    class="tc-action-icon text-primary cursor-pointer text-[15px] leading-none"
                                    @click.prevent.stop="openChangeWorkspace(item)">
                                    <FormOutlined />
                                  </a>
                                </a-tooltip>
                              </div>
                            </div>
                          </div>
                        </a-col>
                      </a-row>
                    </template>

                    <template v-else>
                      <a-table
                        :columns="todoColumns"
                        :data-source="tableTodoList"
                        :row-class-name="rowClassName"
                        :pagination="false"
                        :row-key="rowKey"
                        bordered
                        class="workbench-main-table bg-white"
                        :scroll="{ x: 1386 }"
                        @resize-column="handleResizeColumn">
                        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                          <div v-if="column.key === 'title'" class="p-[12px] w-[220px]">
                            <a-input
                              :value="selectedKeys[0]"
                              placeholder="搜索任务名称"
                              allow-clear
                              @change="setSelectedKeys($event.target.value ? [$event.target.value] : [])"
                              @press-enter="confirm()" />
                            <div class="mt-[10px] flex gap-[8px]">
                              <a-button type="primary" size="small" @click="confirm()"> 搜索 </a-button>
                              <a-button size="small" @click="clearFilters({ confirm: true })"> 重置 </a-button>
                            </div>
                          </div>
                        </template>
                        <template #customFilterIcon="{ filtered, column }">
                          <FilterOutlined
                            v-if="column.key === 'title'"
                            :style="{ color: filtered ? '#124dd6' : '#B1B5C3', fontSize: '14px' }" />
                        </template>
                        <template #bodyCell="{ column, record }">
                          <template v-if="column.key === 'title'">
                            <div class="flex items-center gap-[8px] min-w-0">
                              <span class="font-bold text-[#313133] truncate">{{ workbenchCardDisplayTitle(record) }}</span>
                              <span
                                v-if="workbenchShowOverdueUi(record)"
                                class="flex-shrink-0 px-[6px] py-[1px] text-[11px] font-semibold leading-[18px] rounded text-white bg-[#FF4D4F]"
                                >延期</span
                              >
                            </div>
                          </template>
                          <template v-if="column.key === 'type'">
                            <div class="wb-cell-type min-w-0 max-w-full">
                              <div
                                class="wb-task-kind-line text-[13px] leading-[22px] font-medium text-[#313133] flex items-center gap-[4px] min-w-0"
                                :title="workbenchTaskTypeListTooltip(record) || undefined">
                                <component :is="resolveWorkbenchTaskTypeIcon(record)" class="tc-type-icon flex-shrink-0" />
                                <span class="truncate">{{ workbenchTaskTypeListLine(record) }}</span>
                              </div>
                            </div>
                          </template>
                          <template v-if="column.key === 'time'">
                            {{ record.displayTime }}
                          </template>
                          <template v-if="column.key === 'progress'">
                            <div class="wb-cell-progress flex items-center gap-[8px] w-full min-w-0">
                              <span class="text-[#313133] font-bold whitespace-nowrap flex-shrink-0 tabular-nums"
                                >{{ record.progress }}%</span
                              >
                              <a-progress
                                class="wb-progress-inline flex-1 min-w-[64px] !mb-0"
                                :percent="record.progress"
                                :show-info="false"
                                :stroke-width="8"
                                trail-color="#F0F0F0"
                                :class="workbenchShowOverdueUi(record) ? 'delay-progress' : 'normal-progress'" />
                              <a-tooltip v-if="workbenchShowOverdueUi(record)" :title="`已延期 ${record.delayDays} 天`">
                                <span class="text-[#FF4D4F] text-[12px] whitespace-nowrap flex-shrink-0 cursor-default"
                                  >延期{{ record.delayDays }}天</span
                                >
                              </a-tooltip>
                            </div>
                          </template>
                          <template v-if="column.key === 'action'">
                            <div class="flex w-full items-center justify-center gap-[12px] whitespace-nowrap">
                              <a-tooltip v-if="taskActionAllowed(record, 'design')" :title="designWorkspaceTooltip(record)">
                                <a
                                  href="#"
                                  class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openDesignWorkspace(record)">
                                  <HighlightOutlined />
                                </a>
                              </a-tooltip>
                              <a-tooltip v-if="taskActionAllowed(record, 'assign')" title="指派">
                                <a
                                  href="#"
                                  class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openWbsPersonAssignFromWorkbench(record)">
                                  <UserAddOutlined />
                                </a>
                              </a-tooltip>
                              <a-tooltip v-if="taskActionAllowed(record, 'transfer')" title="转办">
                                <a
                                  href="#"
                                  class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openTransferModal(record)">
                                  <SwapOutlined />
                                </a>
                              </a-tooltip>
                              <a-tooltip v-if="showWbsRejectMenu(record)" title="驳回">
                                <a
                                  href="#"
                                  class="tc-action-icon text-[#FA8C16] cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openRejectModal(record)">
                                  <UndoOutlined />
                                </a>
                              </a-tooltip>
                              <a-tooltip v-if="taskActionAllowed(record, 'detail')" title="详情">
                                <a
                                  href="#"
                                  class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openTaskAppDetail(record)">
                                  <ProfileOutlined />
                                </a>
                              </a-tooltip>
                              <a-tooltip v-if="taskActionAllowed(record, 'change')" title="变更">
                                <a
                                  href="#"
                                  class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                  @click.prevent.stop="openChangeWorkspace(record)">
                                  <FormOutlined />
                                </a>
                              </a-tooltip>
                            </div>
                          </template>
                        </template>
                      </a-table>
                    </template>
                  </div>
                </a-spin>
                <div v-if="(todoPagination.total ?? 0) > 0" class="workbench-todo-pagination flex-shrink-0  flex justify-end">
                  <a-pagination v-bind="todoPagination" class="ant-table-pagination" />
                </div>
              </div>
              <div v-else-if="item.name === 'process'" class="task-content flex flex-col flex-1 min-h-0 h-full">
                <div class="filter-bar flex-shrink-0 flex items-center mb-[16px] mt-[3px]">
                  <div class="capsule-group flex gap-[12px]">
                    <div
                      v-for="subTab in auditSecondaryTabs"
                      :key="subTab.value"
                      class="capsule"
                      :class="{ active: auditSecondaryFilter === subTab.value }"
                      @click="auditSecondaryFilter = subTab.value">
                      {{ subTab.title }}
                    </div>
                  </div>
                </div>

                <a-spin :spinning="auditListLoading" class="task-list-spin flex-1 min-h-0 flex flex-col">
                  <div class="task-list-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden wei-scrollbar h-full">
                    <a-table
                      :columns="currentProcessTableColumns"
                      :data-source="tableProcessList"
                      :locale="{ emptyText: renderTableEmptyText('暂无数据') }"
                      :row-class-name="rowClassName"
                      :pagination="processTablePagination"
                      :row-key="rowKey"
                      bordered
                      class="workbench-main-table bg-white"
                      :scroll="{ x: processTableScrollX }"
                      @resize-column="handleResizeColumn">
                      <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                        <div v-if="column.key === 'title'" class="p-[12px] w-[220px]">
                          <a-input
                            :value="selectedKeys[0]"
                            placeholder="搜索任务名称"
                            allow-clear
                            @change="setSelectedKeys($event.target.value ? [$event.target.value] : [])"
                            @press-enter="confirm()" />
                          <div class="mt-[10px] flex gap-[8px]">
                            <a-button type="primary" size="small" @click="confirm()"> 搜索 </a-button>
                            <a-button size="small" @click="clearFilters({ confirm: true })"> 重置 </a-button>
                          </div>
                        </div>
                      </template>
                      <template #customFilterIcon="{ filtered, column }">
                        <FilterOutlined
                          v-if="column.key === 'title'"
                          :style="{ color: filtered ? '#124dd6' : '#B1B5C3', fontSize: '14px' }" />
                      </template>
                      <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'PROCESS_BUSINESS_TYPE_NAME'">
                          <div class="wb-cell-type min-w-0 max-w-full">
                            <div class="wb-task-kind-line text-[13px] leading-[22px] font-medium text-[#313133]">
                              {{ record.processInstance.processVariables.PROCESS_BUSINESS_TYPE_NAME }}
                            </div>
                          </div>
                        </template>
                        <template v-if="column.key === 'state'">
                          <div v-if="auditSecondaryFilter === 'done' || auditSecondaryFilter === 'myProcess'">
                            <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="record.status" />
                          </div>
                          <div v-else>
                            <a-tag v-if="isBpmEstablishmentTask(record)" size="small" color="success" style="color: #2e8702">
                              {{ $t('编制中') }}
                            </a-tag>
                            <a-tag v-else type="primary" size="small" color="processing">
                              {{ $t('审批中') }}
                            </a-tag>
                          </div>
                        </template>
                        <template v-if="column.key === 'nickname'">
                          {{ record.assigneeUser?.nickname }}
                        </template>
                        <template v-if="column.key === 'createTime'">
                          {{ formatWorkbenchDateTime(record.createTime, record.startTime) }}
                        </template>
                        <template v-if="column.key === 'taskCreateTime'">
                          {{ formatWorkbenchDateTime(record.createTime) }}
                        </template>
                        <template v-if="column.key === 'startTime'">
                          {{ formatWorkbenchDateTime(record.startTime) }}
                        </template>
                        <template v-if="column.key === 'endTime'">
                          {{ formatWorkbenchDateTime(record.endTime) }}
                        </template>
                        <template v-if="column.key === 'reason'">
                          {{ record.reason }}
                        </template>
                        <template v-if="column.key === 'durationInMillis'">
                          {{ formatPast2(record.durationInMillis) }}
                        </template>
                        <template v-if="column.key === 'action'">
                          <div class="flex w-full items-center justify-center gap-[12px] whitespace-nowrap">
                            <a-tooltip
                              v-if="taskbpmActionAllowed(record, 'design') && isBpmEstablishmentTask(record)"
                              title="提交">
                              <a
                                href="#"
                                class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                @click.prevent.stop="openbpmDesignWorkspace(record)">
                                <FormOutlined />
                              </a>
                            </a-tooltip>
                            <a-tooltip v-else-if="taskbpmActionAllowed(record, 'design')" title="审批">
                              <a
                                href="#"
                                class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                @click.prevent.stop="openbpmDesignWorkspace(record)">
                                <AuditOutlined />
                              </a>
                            </a-tooltip>
                            <a-tooltip v-if="taskbpmActionAllowed(record, 'detail')" title="详情">
                              <a
                                href="#"
                                class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                @click.prevent.stop="openbpmTaskAppDetail(record)">
                                <ProfileOutlined />
                              </a>
                            </a-tooltip>
                            <a-tooltip v-if="taskbpmActionAllowed(record, 'history')" title="历史">
                              <a
                                href="#"
                                class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                @click.prevent.stop="openbpmTaskHistory(record)">
                                <HistoryOutlined />
                              </a>
                            </a-tooltip>
                            <a-tooltip v-if="taskbpmActionAllowed(record, 'cancel') && record.status === 1" title="取消">
                              <a
                                href="#"
                                class="tc-action-icon text-primary cursor-pointer text-[16px] leading-none"
                                @click.prevent.stop="openBpmCancelModal(record)">
                                <UndoOutlined />
                              </a>
                            </a-tooltip>
                          </div>
                        </template>
                      </template>
                    </a-table>
                  </div>
                </a-spin>
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
            <div id="eachart-main" />
          </div>
        </div>
        <div class="rt-cont-list announcement">
          <div class="rt-cont-title">通知公告</div>
          <div class="cont-list wei-scrollbar">
            <div v-for="(i, idx) in tabList[0].list" :key="idx" class="news-list">
              <img v-if="idx > 2" src="../../assets/workbench/news.png" />
              <img v-else src="../../assets/workbench/act-news.png" />
              <div class="news-cont">
                <div class="title" @click="seeDetailFun(i.id)">
                  {{ i.title }}
                </div>
                <div class="detalis">平台公告 ｜{{ i.createTime.substring(0, 10) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="show-right-content-btn" @click="showRightContent">
    {{ isShowRigth }}
  </div>

  <!-- 公告详情为 Modal，勿再套 b-body2（会占 calc(100vh-205px) 高度与主区叠成双屏滚动） -->
  <div class="workbench-notice-mount">
    <NoticeDetail ref="powerModel" :modal-visible="powVisible" @close="handleClosePowModal" />
  </div>

  <a-modal
    v-model:visible="wbsChangeModalVisible"
    title="发起任务变更"
    width="520px"
    :confirm-loading="wbsChangeSubmitLoading"
    :mask-closable="false"
    destroy-on-close
    ok-text="确认并进入协同设计"
    cancel-text="取消"
    @ok="executeWbsChangeFromWorkbench"
    @cancel="closeWbsChangeModal">
    <p style="margin-bottom: 12px; color: #666; line-height: 1.6">
      将标记变更并重开协同任务。协同侧的末节点完成态需在设计工作台内调整；可选是否同步上游最新参数。
    </p>
    <a-radio-group v-model:value="wbsChangeApplyLatest" style="display: flex; flex-direction: column; gap: 8px">
      <div>
        <a-radio :value="1"> 采用上游最新参数值 </a-radio>
      </div>
      <div>
        <a-radio :value="0"> 保留本任务当前已存参数值 </a-radio>
      </div>
    </a-radio-group>
  </a-modal>

  <a-modal
    v-model:visible="transferModalVisible"
    title="转办任务"
    width="520px"
    :confirm-loading="transferSubmitLoading"
    :mask-closable="false"
    destroy-on-close
    ok-text="确认转办"
    cancel-text="取消"
    @ok="submitWorkbenchTransfer"
    @cancel="closeTransferModal">
    <p v-if="transferTargetTask" style="margin-bottom: 12px; color: #666">
      将「{{ workbenchCardDisplayTitle(transferTargetTask) }}」转给他人承办，转办后您将不再可操作该任务。
    </p>
    <div style="margin-bottom: 8px; color: #313133">接收人</div>
    <a-select
      v-model:value="transferSelectedUserId"
      show-search
      allow-clear
      :loading="transferCandidatesLoading"
      :options="transferSelectOptions"
      option-filter-prop="label"
      placeholder="请选择本项目团队成员"
      style="width: 100%" />
  </a-modal>

  <a-modal
    v-model:visible="rejectModalVisible"
    title="驳回任务"
    width="520px"
    class="workbench-reject-modal"
    :confirm-loading="rejectSubmitLoading"
    :mask-closable="false"
    destroy-on-close
    ok-text="确认驳回"
    cancel-text="取消"
    @ok="submitWorkbenchReject"
    @cancel="closeRejectModal">
    <p v-if="rejectTargetTask" class="workbench-reject-modal__tip">
      将退回给上级分配人（分配操作人或父节点负责人），对方待办将重新打开；协同/分类类已发布任务将撤销发布以便重新选人分配。请填写驳回原因（对方在任务类型旁可见摘要，悬停查看全文）。
    </p>
    <div class="workbench-reject-modal__label">驳回意见</div>
    <a-textarea
      v-model:value="rejectOpinion"
      class="workbench-reject-modal__textarea"
      :rows="4"
      :maxlength="500"
      show-count
      placeholder="请说明不适宜承办的原因，便于对方调整分配"
      allow-clear />
  </a-modal>

  <CancellationProcess
    :visible="bpmCancelModalVisible"
    :target-task="bpmCancelTargetTask"
    @update:visible="handleBpmCancelVisibleChange"
    @success="() => void loadAuditListFromApi()" />
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

:deep(.workbench-main-table .ant-table-thead > tr > th) {
  background: #f7f8fa;
  color: #313133;
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 1px solid #eaeaf1;
}

:deep(.workbench-main-table .ant-table-tbody > tr > td) {
  padding: 10px 12px;
  color: #313133;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.workbench-main-table .ant-table-tbody > tr:hover > td) {
  background: #f9fbff;
}

:deep(.workbench-main-table .ant-table-thead > tr > th.ant-table-cell-fix-left),
:deep(.workbench-main-table .ant-table-thead > tr > th.ant-table-cell-fix-right) {
  background: #f7f8fa;
}

:deep(.workbench-main-table .ant-table-tbody > tr > td.ant-table-cell-fix-left),
:deep(.workbench-main-table .ant-table-tbody > tr > td.ant-table-cell-fix-right) {
  background: #fff;
}

:deep(.workbench-main-table .wb-cell-progress .ant-progress) {
  display: flex;
  align-items: center;
  min-width: 0;
}

:deep(.workbench-main-table .wb-cell-progress .ant-progress-outer) {
  min-width: 0;
}

:deep(.workbench-main-table .wb-cell-type .wb-task-kind-line) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.task-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

:deep(.work_nav_top .ant-tabs-tabpane) {
  display: flex;
  flex-direction: column;
}

.task-list-spin {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

:deep(.task-list-spin.ant-spin-nested-loading) {
  flex: 1;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.task-list-spin .ant-spin-container) {
  flex: 1;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.workbench-todo-pagination {
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
  padding-top: 16px;
  padding-bottom: 0;

  :deep(.ant-table-pagination.ant-pagination) {
    margin-bottom: 0;
  }
}

.layout .layout-content .lf-cont .work-wrap {
  padding-bottom: 10px;
}

.capsule {
  padding: 4px 16px;
  background: #f4f4f5;
  border-radius: 16px;
  font-size: 14px;
  color: #6a696e;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--ant-primary-color, #124dd6);
  }

  &.active {
    background: #e6eaff;
    color: var(--ant-primary-color, #124dd6);
    font-weight: 500;
  }
}

.task-card-grid {
  width: 100%;
}

.task-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #eaeaf1;
  border-radius: 8px;
  padding: 10px 12px 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--ant-primary-color, #124dd6);
  }
}

.task-card__overdue-corner {
  position: absolute;
  z-index: 4;
  top: 8px;
  right: 10px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  color: #fff;
  background: #ff4d4f;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(255, 77, 79, 0.35);
  pointer-events: none;
}

.task-card__overdue-corner--with-menu {
  right: 40px;
}

.task-card__type-ribbon {
  margin: -2px 0 6px;
}

.task-card__type-ribbon-inner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  padding: 3px 8px;
  border-radius: 4px;
}

.task-card--kind-wbs,
.task-card--kind-standalone {
  background: linear-gradient(180deg, rgba(26, 88, 232, 0.06) 0%, #fff 44px);

  &:hover {
    border-color: #1a58e8;
  }

  .task-card__type-ribbon-inner {
    color: #1a58e8;
    background: rgba(26, 88, 232, 0.1);
  }
}

.task-card--kind-compute {
  background: linear-gradient(180deg, rgba(250, 140, 22, 0.07) 0%, #fff 44px);

  &:hover {
    border-color: #fa8c16;
  }

  .task-card__type-ribbon-inner {
    color: #d46b08;
    background: rgba(250, 140, 22, 0.12);
  }
}

.task-card--kind-other {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, #fff 44px);

  &:hover {
    border-color: #8c8c8c;
  }

  .task-card__type-ribbon-inner {
    color: #595959;
    background: rgba(0, 0, 0, 0.06);
  }
}

.tc-body {
  min-height: 0;
}

.tc-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  border-radius: 3px;
  font-size: 11px;
  margin-left: 6px;

  &.tag-red {
    background: #ff4d4f;
    color: #fff;
  }

  &.tag-blue {
    background: #2b5fd9;
    color: #fff;
  }

  &.tag-yellow {
    border: 1px solid #faad14;
    color: #faad14;
    background: #fffbe6;
  }
}

.tc-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-primary-color, #124dd6);
  transition: all 0.2s;

  &:hover {
    color: #1a58e8;
    transform: translateY(-1px);
  }
}

.user-info {
  .info {
    display: flex;
    align-items: center;
    height: 64px;

    .name {
      margin-bottom: 0;
      transform: translateY(2px);
    }
  }
}

/* 占位不占纵向流式高度，避免与 .layout 叠出整页外侧滚动条 */
.workbench-notice-mount {
  height: 0;
  overflow: visible;
  position: relative;
}

.delay-progress :deep(.ant-progress-bg) {
  background: linear-gradient(270deg, #ff7864 2.51%, #ff584b 72.46%) !important;
}

.tc-type-row {
  width: 100%;
  flex-wrap: nowrap;
}

.tc-type-icon {
  font-size: 14px;
  color: #1a58e8;
  line-height: 1;
}

.normal-progress :deep(.ant-progress-bg) {
  background: linear-gradient(270deg, #6f86fa 2.51%, #1a58e8 72.46%) !important;
}

.workbench-reject-modal__tip {
  margin-bottom: 12px;
  color: #666;
  line-height: 1.6;
}

.workbench-reject-modal__label {
  margin-bottom: 8px;
  color: #313133;
}

.workbench-reject-modal__textarea {
  :deep(textarea.ant-input) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: calc(1.5715 * 14px * 4 + 8px);
    resize: vertical;
    overflow: auto;
  }
}
</style>

<style lang="less">
.workbench-reject-modal {
  .ant-modal {
    max-width: calc(100vw - 32px);
  }

  .ant-modal-content {
    max-width: 100%;
    box-sizing: border-box;
  }

  .ant-modal-body {
    overflow: hidden;
    word-break: break-word;
  }

  .ant-input-affix-wrapper-textarea-with-clear-btn {
    display: block;
    height: auto !important;
    overflow: visible;
  }
}
</style>
