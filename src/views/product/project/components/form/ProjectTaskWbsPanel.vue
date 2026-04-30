<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import localeDatePickerZh from 'ant-design-vue/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  ColumnWidthOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  RollbackOutlined,
  SendOutlined,
} from '@ant-design/icons-vue';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';

dayjs.extend(isoWeek);

const props = defineProps<{
  projectId: string | number;
}>();

export type TaskWbsStatus = 'delayed' | 'completed' | 'in_progress' | 'pending';

export type WbsTaskNode = {
  id: string;
  /** 节点类型：1分类节点 2任务节点 */
  type?: number;
  serialNo: number;
  wbsCode: string;
  taskName: string;
  relatedTaskFlow?: string;
  startDate: string;
  endDate: string;
  durationWorkdays: number;
  progress: number;
  predecessor: string;
  status: TaskWbsStatus;
  resource: string;
  /** 负责人用户 id（每行仅一人，用于再次打开时回显） */
  responsibleUserId?: string;
  manager?: string;
  /** 管理者用户 id（每行仅一人，用于再次打开时回显） */
  managerUserId?: string;
  children?: WbsTaskNode[];
};

/** 与示意界面一致的示例树（后续可接项目 WBS 接口，用 projectId 拉取） */
function buildDemoTaskTree(): WbsTaskNode[] {
  return [
    {
      id: 't1',
      serialNo: 1,
      wbsCode: '1',
      taskName: '第一阶段——项目启动阶段',
      relatedTaskFlow: '',
      startDate: '2026-05-01',
      endDate: '2026-06-15',
      durationWorkdays: 36,
      progress: 58.3,
      predecessor: '',
      status: 'delayed',
      resource: '项目经理',
      manager: '项目经理',
      children: [
        {
          id: 't1-1',
          serialNo: 2,
          wbsCode: '1.1',
          taskName: '确定项目目标和范围',
          relatedTaskFlow: '',
          startDate: '2026-05-01',
          endDate: '2026-05-10',
          durationWorkdays: 8,
          progress: 100,
          predecessor: '',
          status: 'completed',
          resource: '项目经理',
          manager: '项目经理',
        },
        {
          id: 't1-2',
          serialNo: 3,
          wbsCode: '1.2',
          taskName: '组建项目团队',
          relatedTaskFlow: '',
          startDate: '2026-05-08',
          endDate: '2026-05-18',
          durationWorkdays: 9,
          progress: 100,
          predecessor: '2FS',
          status: 'completed',
          resource: '项目经理',
          manager: '项目经理',
        },
        {
          id: 't1-3',
          serialNo: 4,
          wbsCode: '1.3',
          taskName: '制定项目章程',
          relatedTaskFlow: '',
          startDate: '2026-05-15',
          endDate: '2026-05-28',
          durationWorkdays: 10,
          progress: 70,
          predecessor: '3FS',
          status: 'in_progress',
          resource: '质量经理',
          manager: '质量经理',
        },
      ],
    },
    {
      id: 't2',
      serialNo: 5,
      wbsCode: '2',
      taskName: '第二阶段——规划与设计',
      relatedTaskFlow: '',
      startDate: '2026-06-01',
      endDate: '2026-08-30',
      durationWorkdays: 65,
      progress: 35,
      predecessor: '4FS',
      status: 'in_progress',
      resource: '项目经理',
      manager: '项目经理',
      children: [
        {
          id: 't2-1',
          serialNo: 6,
          wbsCode: '2.1',
          taskName: '需求调研与分析',
          relatedTaskFlow: '',
          startDate: '2026-06-01',
          endDate: '2026-06-28',
          durationWorkdays: 20,
          progress: 80,
          predecessor: '',
          status: 'in_progress',
          resource: '质量经理',
          manager: '质量经理',
        },
        {
          id: 't2-2',
          serialNo: 7,
          wbsCode: '2.2',
          taskName: '技术方案设计',
          relatedTaskFlow: '',
          startDate: '2026-06-20',
          endDate: '2026-07-25',
          durationWorkdays: 24,
          progress: 40,
          predecessor: '6FS',
          status: 'pending',
          resource: '项目经理',
          manager: '项目经理',
        },
      ],
    },
  ];
}

const treeData = ref<WbsTaskNode[]>(buildDemoTaskTree());

function mapTaskStatus(status?: string): TaskWbsStatus {
  if (status === 'COMPLETED') return 'completed';
  if (status === 'DESIGNING' || status === 'CHANGING') return 'in_progress';
  return 'pending';
}

function toDateOnly(v?: string): string {
  if (!v) return '';
  return String(v).slice(0, 10);
}

function mapApiNodeToWbs(node: any, serialSeed: { v: number }): WbsTaskNode {
  const serialNo = serialSeed.v++;
  const children = Array.isArray(node?.children)
    ? node.children.map((c: any) => mapApiNodeToWbs(c, serialSeed))
    : undefined;
  const progressNum = Number(node?.completionRate ?? 0);
  return {
    id: String(node?.id ?? `${serialNo}`),
    type: Number(node?.type ?? 2),
    serialNo,
    wbsCode: String(node?.wbsCode ?? ''),
    taskName: String(node?.nodeName ?? ''),
    relatedTaskFlow: '',
    startDate: toDateOnly(node?.planStartTime),
    endDate: toDateOnly(node?.planEndTime),
    durationWorkdays: Number(node?.taskTime ?? 0),
    progress: Number.isFinite(progressNum) ? progressNum : 0,
    predecessor: '',
    status: mapTaskStatus(node?.taskStatus),
    resource: node?.chargeUserid ? String(node.chargeUserid) : '',
    responsibleUserId: node?.chargeUserid ? String(node.chargeUserid) : undefined,
    manager: node?.adminUserid ? String(node.adminUserid) : '',
    managerUserId: node?.adminUserid ? String(node.adminUserid) : undefined,
    children: children && children.length ? children : undefined,
  };
}

async function fetchProjectWbsTree() {
  if (!props.projectId) {
    treeData.value = [];
    return;
  }
  try {
    const res = await AdminApiProjectTemp.projectWbsTreeList({ projectId: props.projectId });
    const apiTree = res?.data?.data ?? [];
    if (Array.isArray(apiTree) && apiTree.length) {
      const seed = { v: 1 };
      treeData.value = apiTree.map((n: any) => mapApiNodeToWbs(n, seed));
    } else {
      treeData.value = [];
    }
  } catch {
    treeData.value = buildDemoTaskTree();
    message.warning('加载项目WBS失败，已展示示例数据');
  } finally {
    expandAllForTree(treeData.value);
    columns.value = createTaskColumns();
  }
}

/** 与表格树展开一致，甘特行数与左侧可见行一一对应 */
const expandedRowKeys = ref<string[]>([]);

function collectIdsWithChildren(nodes: WbsTaskNode[]): string[] {
  const out: string[] = [];
  for (const n of nodes) {
    if (n.children?.length) {
      out.push(n.id);
      out.push(...collectIdsWithChildren(n.children));
    }
  }
  return out;
}

function expandAllForTree(nodes: WbsTaskNode[]) {
  expandedRowKeys.value = collectIdsWithChildren(nodes);
}

watch(
  () => props.projectId,
  () => {
    void fetchProjectWbsTree();
  },
  { immediate: true },
);

watch(treeData, () => expandAllForTree(treeData.value));

expandAllForTree(treeData.value);

const SCROLL_X_BUFFER_PX = 48;

/** 工期(天)：结束日与开始日按自然日计算，含起止两日，即 dayjs 的 end.diff(start,'day') + 1 */
function computeTaskDurationDays(record: WbsTaskNode): number | null {
  const s = dayjs(record.startDate).startOf('day');
  const e = dayjs(record.endDate).startOf('day');
  if (!s.isValid() || !e.isValid() || e.isBefore(s, 'day')) return null;
  return e.diff(s, 'day') + 1;
}

function createTaskColumns(): TableColumnsType<WbsTaskNode> {
  return [
    { title: '序号', dataIndex: 'serialNo', key: 'serialNo', width: 56, align: 'center', resizable: true },
    { title: 'WBS', dataIndex: 'wbsCode', key: 'wbsCode', width: 108, ellipsis: true, resizable: true },
    { title: '任务', dataIndex: 'taskName', key: 'taskName', width: 220, ellipsis: true, resizable: true },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate', width: 124, align: 'center', resizable: true },
    { title: '完成时间', dataIndex: 'endDate', key: 'endDate', width: 124, align: 'center', resizable: true },
    {
      title: '工期(天)',
      key: 'durationWorkdays',
      dataIndex: 'durationWorkdays',
      width: 84,
      align: 'center',
      resizable: true,
      customRender: ({ record }) => computeTaskDurationDays(record) ?? record.durationWorkdays ?? '-',
    },
    {
      title: '进度',
      key: 'progress',
      width: 72,
      align: 'center',
      resizable: true,
      customRender: ({ record }) => `${record.progress}%`,
    },
    { title: '前置任务', dataIndex: 'predecessor', key: 'predecessor', width: 88, ellipsis: true, resizable: true },
    { title: '负责人', dataIndex: 'resource', key: 'resource', width: 168, ellipsis: true, resizable: true },
    { title: '状态', key: 'status', dataIndex: 'status', width: 112, align: 'center', resizable: true },
    {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      width: 220,
      align: 'center',
      fixed: 'right',
      resizable: false,
    },
  ];
}

const columns = ref<TableColumnsType<WbsTaskNode>>(createTaskColumns());

const scrollX = computed(
  () => columns.value.reduce((s, c) => s + (Number(c.width) || 0), 0) + SCROLL_X_BUFFER_PX,
);

function handleResizeColumn(w: number, col: { width?: number | string }) {
  col.width = w;
}

function onTaskEdit(record: WbsTaskNode) {
  message.info(`编辑：${record.taskName}`);
}

function onTaskDelete(record: WbsTaskNode) {
  message.warning(`删除：${record.taskName}`);
}

function onTaskPublish(record: WbsTaskNode) {
  message.info(`发布：${record.taskName}`);
}

function onTaskStart(record: WbsTaskNode) {
  message.info(`启动：${record.taskName}`);
}

function onTaskChangeRequest(record: WbsTaskNode) {
  message.info(`变更：${record.taskName}`);
}

function onTaskUnpublish(record: WbsTaskNode) {
  message.info(`撤销发布：${record.taskName}`);
}

type ResponsiblePickerUser = { id: string; name: string; username: string; deptId?: string };
type ResponsiblePickerDept = { id: string; name: string };

/** 单选弹窗内表示「不指定负责人」 */
const RESPONSIBLE_PICKER_NONE = '__wbs_responsible_none__';

const responsiblePickerVisible = ref(false);
const responsiblePickerUsers = ref<ResponsiblePickerUser[]>([]);
const responsiblePickerDepts = ref<ResponsiblePickerDept[]>([]);
const responsiblePickerTarget = ref<WbsTaskNode | null>(null);
const responsiblePickerField = ref<'responsible' | 'manager'>('responsible');
const responsiblePickerKeyword = ref('');
/** 选中用户 id，或 RESPONSIBLE_PICKER_NONE 表示不指定 */
const responsiblePickerSelectedUserId = ref<string>(RESPONSIBLE_PICKER_NONE);

const responsiblePickerDeptNameMap = computed(() => {
  const map = new Map<string, string>();
  for (const d of responsiblePickerDepts.value) map.set(d.id, d.name);
  return map;
});

const responsiblePickerFilteredUsers = computed(() => {
  const kw = responsiblePickerKeyword.value.trim().toLowerCase();
  const list = responsiblePickerUsers.value;
  if (!kw) return list;
  return list.filter(u => {
    const dept = u.deptId ? responsiblePickerDeptNameMap.value.get(u.deptId) ?? '' : '';
    return `${u.name}${u.username}${dept}`.toLowerCase().includes(kw);
  });
});

function formatResponsibleUserRow(u: ResponsiblePickerUser) {
  const dept = u.deptId ? responsiblePickerDeptNameMap.value.get(u.deptId) ?? '-' : '-';
  return `${u.name} / ${u.username} / ${dept}`;
}

async function openResponsiblePicker(record: WbsTaskNode, field: 'responsible' | 'manager' = 'responsible') {
  responsiblePickerTarget.value = record;
  responsiblePickerField.value = field;
  responsiblePickerKeyword.value = '';
  responsiblePickerSelectedUserId.value =
    (field === 'responsible' ? record.responsibleUserId : record.managerUserId) ?? RESPONSIBLE_PICKER_NONE;
  try {
    const res = await AdminApiSystemDept.getDeptInfo({} as any);
    if (res.data?.code === 200) {
      const payload = res.data.data as
        | { adminDeptResponseDTO?: ResponsiblePickerDept[]; adminUserResponseDTO?: ResponsiblePickerUser[] }
        | undefined;
      responsiblePickerDepts.value = payload?.adminDeptResponseDTO ?? [];
      responsiblePickerUsers.value = payload?.adminUserResponseDTO ?? [];
    } else {
      responsiblePickerDepts.value = [];
      responsiblePickerUsers.value = [];
    }
  } catch {
    message.error('加载用户列表失败');
    return;
  }
  responsiblePickerVisible.value = true;
}

function closeResponsiblePicker() {
  responsiblePickerVisible.value = false;
  responsiblePickerTarget.value = null;
}

function confirmResponsiblePicker() {
  const target = responsiblePickerTarget.value;
  if (!target) {
    closeResponsiblePicker();
    return;
  }
  const uid = responsiblePickerSelectedUserId.value;
  const isResponsible = responsiblePickerField.value === 'responsible';
  if (!uid || uid === RESPONSIBLE_PICKER_NONE) {
    if (isResponsible) {
      target.responsibleUserId = undefined;
      target.resource = '';
      message.success('已清空负责人');
    } else {
      target.managerUserId = undefined;
      target.manager = '';
      message.success('已清空管理者');
    }
    closeResponsiblePicker();
    return;
  }
  const u = responsiblePickerUsers.value.find(x => x.id === uid);
  if (isResponsible) {
    target.responsibleUserId = uid;
    target.resource = u?.name ?? uid;
    message.success('负责人已更新');
  } else {
    target.managerUserId = uid;
    target.manager = u?.name ?? uid;
    message.success('管理者已更新');
  }
  closeResponsiblePicker();
}

/** 在树中定位节点及其直接上级 */
function findNodeContext(
  nodes: WbsTaskNode[],
  id: string,
  parent: WbsTaskNode | null = null,
): { node: WbsTaskNode; parent: WbsTaskNode | null } | null {
  for (const n of nodes) {
    if (n.id === id) return { node: n, parent };
    if (n.children?.length) {
      const hit = findNodeContext(n.children, id, n);
      if (hit) return hit;
    }
  }
  return null;
}

/** 子树内所有子孙（不含 node 自身）的最小开始、最大完成 */
function descendantsMinStartMaxEnd(node: WbsTaskNode): { minS: Dayjs | null; maxE: Dayjs | null } {
  let minS: Dayjs | null = null;
  let maxE: Dayjs | null = null;
  function walk(n: WbsTaskNode) {
    const s = dayjs(n.startDate).startOf('day');
    const e = dayjs(n.endDate).startOf('day');
    if (s.isValid() && (!minS || s.isBefore(minS, 'day'))) minS = s;
    if (e.isValid() && (!maxE || e.isAfter(maxE, 'day'))) maxE = e;
    n.children?.forEach(walk);
  }
  node.children?.forEach(walk);
  return { minS, maxE };
}

function syncDurationWorkdays(record: WbsTaskNode) {
  const d = computeTaskDurationDays(record);
  if (d != null) record.durationWorkdays = d;
}

/** 校验当前行日期与上级、下级区间关系；通过返回 null */
function validateTaskDates(record: WbsTaskNode): string | null {
  const s = dayjs(record.startDate).startOf('day');
  const e = dayjs(record.endDate).startOf('day');
  const today = dayjs().startOf('day');
  if (!s.isValid() || !e.isValid()) return '请填写有效日期';
  if (s.isBefore(today, 'day')) return '开始时间不能早于今天';
  if (e.isBefore(s, 'day')) return '完成时间不能早于开始时间';

  const ctx = findNodeContext(treeData.value, record.id);
  if (ctx?.parent) {
    const ps = dayjs(ctx.parent.startDate).startOf('day');
    const pe = dayjs(ctx.parent.endDate).startOf('day');
    if (ps.isValid() && pe.isValid() && (s.isBefore(ps, 'day') || e.isAfter(pe, 'day'))) {
      return '任务日期需在上级任务时间范围内';
    }
  }

  if (record.children?.length) {
    const { minS, maxE } = descendantsMinStartMaxEnd(record);
    if (minS && s.isAfter(minS, 'day')) {
      return '有子任务时，开始时间不能晚于任一子任务的开始时间';
    }
    if (maxE && e.isBefore(maxE, 'day')) {
      return '有子任务时，完成时间不能早于任一子任务的完成时间';
    }
  }
  return null;
}

function disabledTaskStartDate(record: WbsTaskNode, current: Dayjs | undefined): boolean {
  if (!current) return false;
  const cur = current.startOf('day');
  const today = dayjs().startOf('day');
  if (cur.isBefore(today, 'day')) return true;

  const ctx = findNodeContext(treeData.value, record.id);
  if (ctx?.parent) {
    const ps = dayjs(ctx.parent.startDate).startOf('day');
    if (ps.isValid() && cur.isBefore(ps, 'day')) return true;
  }

  const { minS } = descendantsMinStartMaxEnd(record);
  if (minS && cur.isAfter(minS, 'day')) return true;
  return false;
}

function disabledTaskEndDate(record: WbsTaskNode, current: Dayjs | undefined): boolean {
  if (!current) return false;
  const cur = current.startOf('day');
  const start = dayjs(record.startDate).startOf('day');
  if (!start.isValid()) return false;
  if (cur.isBefore(start, 'day')) return true;

  const ctx = findNodeContext(treeData.value, record.id);
  if (ctx?.parent) {
    const pe = dayjs(ctx.parent.endDate).startOf('day');
    if (pe.isValid() && cur.isAfter(pe, 'day')) return true;
  }

  const { maxE } = descendantsMinStartMaxEnd(record);
  if (maxE && cur.isBefore(maxE, 'day')) return true;
  return false;
}

function onTaskStartDateChange(record: WbsTaskNode, v: string | null) {
  if (!v) return;
  const snapS = record.startDate;
  const snapE = record.endDate;
  const nextS = dayjs(v).startOf('day');
  let nextEndStr = record.endDate;
  const prevE = dayjs(record.endDate).startOf('day');
  if (prevE.isValid() && prevE.isBefore(nextS, 'day')) {
    nextEndStr = v;
  }
  record.startDate = v;
  record.endDate = nextEndStr;
  const err = validateTaskDates(record);
  if (err) {
    record.startDate = snapS;
    record.endDate = snapE;
    message.warning(err);
    return;
  }
  if (nextEndStr !== snapE && nextEndStr === v) {
    message.info('完成时间已随开始时间调整，且不得早于开始时间');
  }
  syncDurationWorkdays(record);
}

function onTaskEndDateChange(record: WbsTaskNode, v: string | null) {
  if (!v) return;
  const snapS = record.startDate;
  const snapE = record.endDate;
  record.endDate = v;
  const err = validateTaskDates(record);
  if (err) {
    record.startDate = snapS;
    record.endDate = snapE;
    message.warning(err);
    return;
  }
  syncDurationWorkdays(record);
}

function toDateString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  const d = dayjs(v as Dayjs);
  return d.isValid() ? d.format('YYYY-MM-DD') : null;
}

function makeDisabledTaskStart(record: WbsTaskNode) {
  return (current: Dayjs) => disabledTaskStartDate(record, current);
}

function makeDisabledTaskEnd(record: WbsTaskNode) {
  return (current: Dayjs) => disabledTaskEndDate(record, current);
}

function makeOnTaskStartChange(record: WbsTaskNode) {
  return (v: unknown) => {
    const str = toDateString(v);
    if (str) onTaskStartDateChange(record, str);
  };
}

function makeOnTaskEndChange(record: WbsTaskNode) {
  return (v: unknown) => {
    const str = toDateString(v);
    if (str) onTaskEndDateChange(record, str);
  };
}

const tableBodyHeight = ref(420);
/** 左侧表格区域宽度（px），null 表示用 CSS 默认比例；收起甘特前会记忆 */
const leftPaneWidthPx = ref<number | null>(null);
const leftPaneWidthBeforeCollapse = ref<number | null>(null);
const ganttCollapsed = ref(true);
const splitterDragging = ref(false);
const splitRootRef = ref<HTMLElement | null>(null);

/** 右侧时间轴+工具条区域高度，与左侧表头实测一致，保证首行数据对齐 */
const ganttChromeHeightPx = ref(72);
const tableWrapRef = ref<HTMLElement | null>(null);
const ganttBodyRef = ref<HTMLElement | null>(null);
/** 与表体横向滚动同步的时间轴头部轨道容器 */
const ganttHeaderScrollRef = ref<HTMLElement | null>(null);
let tableBodyEl: HTMLElement | null = null;
let ganttHeaderScrollEl: HTMLElement | null = null;
let scrollLock = false;
let hScrollLock = false;

function statusLabel(s: TaskWbsStatus) {
  if (s === 'delayed') return '已延迟';
  if (s === 'completed') return '已完成';
  if (s === 'in_progress') return '进行中';
  return '未开始';
}

/** 与项目列表等处的状态 Tag 色一致：未开始默认、进行中 gold、已完成 blue；已延迟为异常态用红 */
function wbsStatusTagColor(s: TaskWbsStatus): string | undefined {
  if (s === 'completed') return 'blue';
  if (s === 'in_progress') return 'gold';
  if (s === 'delayed') return 'red';
  return undefined;
}

/** 按表格可见顺序拍平（尊重 expandedRowKeys） */
function flattenVisible(nodes: WbsTaskNode[], expanded: string[], acc: WbsTaskNode[] = []): WbsTaskNode[] {
  for (const n of nodes) {
    acc.push(n);
    if (n.children?.length && expanded.includes(n.id)) {
      flattenVisible(n.children, expanded, acc);
    }
  }
  return acc;
}

const flatRows = computed(() => flattenVisible(treeData.value, expandedRowKeys.value));

/** 与甘特行同高（含底部分隔线），与左侧表格行高一一对应 */
const ROW_H = 35;
/** 与 .gantt-bar 高度一致，用于依赖箭头锚点 */
const GANTT_BAR_H = 13;

const timelineBounds = computed(() => {
  let min = dayjs('2099-12-31');
  let max = dayjs('1970-01-01');
  for (const r of flatRows.value) {
    const s = dayjs(r.startDate);
    const e = dayjs(r.endDate);
    if (s.isValid() && s.isBefore(min)) min = s;
    if (e.isValid() && e.isAfter(max)) max = e;
  }
  if (!min.isValid() || !max.isValid()) {
    min = dayjs().startOf('month');
    max = dayjs().add(2, 'month');
  }
  min = min.subtract(14, 'day');
  max = max.add(14, 'day');
  return { start: min.startOf('day'), end: max.endOf('day') };
});

const totalTimelineDays = computed(() =>
  Math.max(1, timelineBounds.value.end.diff(timelineBounds.value.start, 'day') + 1),
);

/** 每个日历日占用的像素宽度，用于缩放（略大默认利于月标题单行显示） */
const pxPerDay = ref(5);

function zoomIn() {
  pxPerDay.value = Math.min(16, pxPerDay.value + 0.5);
}

function zoomOut() {
  pxPerDay.value = Math.max(2.5, pxPerDay.value - 0.5);
}

/** 将时间轴宽度适配当前甘特可视区域（示意图中「横向适应」） */
function fitTimelineToView() {
  const el = ganttBodyRef.value;
  if (!el) return;
  const cw = el.clientWidth;
  if (cw <= 0) return;
  const days = totalTimelineDays.value;
  if (days <= 0) return;
  const next = Math.max(2.5, Math.min(24, cw / days));
  pxPerDay.value = Math.round(next * 10) / 10;
  nextTick(() => {
    const head = ganttHeaderScrollRef.value;
    if (head) head.scrollLeft = 0;
    if (el) el.scrollLeft = 0;
  });
}

const timelineWidthPx = computed(() => Math.ceil(totalTimelineDays.value * pxPerDay.value));

/** 可视区域变宽而时间轴未铺满时，自动按与「适应宽度」相同规则拉满，避免窗口或分割条拉大后右侧留白 */
function maybeFitGanttTimelineToView() {
  if (ganttCollapsed.value) return;
  const el = ganttBodyRef.value;
  if (!el) return;
  const cw = el.clientWidth;
  if (cw <= 0) return;
  if (timelineWidthPx.value >= cw - 0.5) return;
  fitTimelineToView();
}

const monthHeaderCells = computed(() => {
  const cells: { label: string; widthPx: number }[] = [];
  let cur = timelineBounds.value.start.startOf('month');
  const end = timelineBounds.value.end;
  while (cur.isBefore(end) || cur.isSame(end, 'month')) {
    const monthStart = cur.isBefore(timelineBounds.value.start) ? timelineBounds.value.start : cur;
    const monthEnd = cur.endOf('month').isAfter(timelineBounds.value.end) ? timelineBounds.value.end : cur.endOf('month');
    const days = monthEnd.diff(monthStart, 'day') + 1;
    cells.push({
      label: `${cur.year()}年${cur.month() + 1}月`,
      widthPx: days * pxPerDay.value,
    });
    cur = cur.add(1, 'month').startOf('month');
  }
  return cells;
});

const weekHeaderCells = computed(() => {
  const cells: { label: string; widthPx: number }[] = [];
  let cur = timelineBounds.value.start.clone().startOf('isoWeek');
  const end = timelineBounds.value.end;
  while (cur.isBefore(end)) {
    const segStart = cur.isBefore(timelineBounds.value.start) ? timelineBounds.value.start : cur;
    const weekEnd = cur.endOf('isoWeek');
    const segEnd = weekEnd.isAfter(timelineBounds.value.end) ? timelineBounds.value.end : weekEnd;
    const days = segEnd.diff(segStart, 'day') + 1;
    if (days > 0) {
      cells.push({ label: `W${segStart.isoWeek()}`, widthPx: days * pxPerDay.value });
    }
    cur = cur.add(1, 'week').startOf('isoWeek');
  }
  return cells;
});

function barMetrics(row: WbsTaskNode) {
  const s = dayjs(row.startDate);
  const e = dayjs(row.endDate);
  if (!s.isValid() || !e.isValid()) return { left: 0, width: 0 };
  const rangeStart = timelineBounds.value.start;
  const offsetDays = s.diff(rangeStart, 'day');
  const spanDays = Math.max(1, e.diff(s, 'day') + 1);
  const left = offsetDays * pxPerDay.value;
  const width = spanDays * pxPerDay.value;
  return { left, width };
}

function collectAllTaskNodes(nodes: WbsTaskNode[], acc: WbsTaskNode[] = []): WbsTaskNode[] {
  for (const n of nodes) {
    acc.push(n);
    if (n.children?.length) collectAllTaskNodes(n.children, acc);
  }
  return acc;
}

const allTaskNodesFlat = computed(() => collectAllTaskNodes(treeData.value));

const serialToTaskNode = computed(() => {
  const m = new Map<number, WbsTaskNode>();
  for (const n of allTaskNodesFlat.value) {
    if (!m.has(n.serialNo)) m.set(n.serialNo, n);
  }
  return m;
});

const wbsCodeToTaskNode = computed(() => {
  const m = new Map<string, WbsTaskNode>();
  for (const n of allTaskNodesFlat.value) {
    m.set(n.wbsCode, n);
  }
  return m;
});

/** 解析前置列：如 `2FS`、`1.2FS`，支持逗号/分号分隔多条 */
function parsePredecessorTokens(raw: string): { ref: string; link: string }[] {
  const s = raw?.trim();
  if (!s) return [];
  const out: { ref: string; link: string }[] = [];
  for (const part of s.split(/[,;，；]+/).map(p => p.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+(?:\.\d+)*)\s*([A-Za-z]{2})?$/);
    if (!m) continue;
    out.push({ ref: m[1], link: (m[2] || 'FS').toUpperCase() });
  }
  return out;
}

function resolvePredecessorTask(ref: string): WbsTaskNode | null {
  const t = ref.trim();
  if (!t) return null;
  if (/^\d+$/.test(t)) return serialToTaskNode.value.get(Number(t)) ?? null;
  return wbsCodeToTaskNode.value.get(t) ?? null;
}

/** FS：自前置条右端（或下端）折线连至当前条左端，风格接近 Project 示意图 */
function buildDependencyPathFs(predIdx: number, succIdx: number, predRight: number, succLeft: number): string {
  const rowCY = (i: number) => i * ROW_H + ROW_H / 2;
  const rowBottom = (i: number) => rowCY(i) + GANTT_BAR_H / 2;
  const rowTop = (i: number) => rowCY(i) - GANTT_BAR_H / 2;
  const succCY = rowCY(succIdx);
  const tipX = Math.max(succLeft - 2, 0);

  if (succIdx > predIdx) {
    const y0 = rowBottom(predIdx);
    const legY = y0 + Math.min(32, 8 + (succIdx - predIdx) * 5);
    return `M ${predRight} ${y0} L ${predRight} ${legY} L ${tipX} ${legY} L ${tipX} ${succCY} L ${succLeft} ${succCY}`;
  }
  if (succIdx < predIdx) {
    const y0 = rowTop(predIdx);
    const legY = y0 - Math.min(32, 8 + (predIdx - succIdx) * 5);
    return `M ${predRight} ${y0} L ${predRight} ${legY} L ${tipX} ${legY} L ${tipX} ${succCY} L ${succLeft} ${succCY}`;
  }
  const midY = rowBottom(predIdx) + 12;
  const stub = Math.min(16, Math.max(8, Math.abs(succLeft - predRight) * 0.15));
  return `M ${predRight} ${rowCY(predIdx)} L ${predRight + stub} ${rowCY(predIdx)} L ${predRight + stub} ${midY} L ${tipX} ${midY} L ${tipX} ${succCY} L ${succLeft} ${succCY}`;
}

const ganttArrowMarkerId = computed(() => `wbs-gantt-arr-${String(props.projectId).replace(/[^a-zA-Z0-9_-]/g, '-')}`);

const ganttDependencyLinks = computed(() => {
  const rows = flatRows.value;
  const items: { id: string; d: string }[] = [];
  let n = 0;
  for (let si = 0; si < rows.length; si++) {
    const succ = rows[si];
    const tokens = parsePredecessorTokens(succ.predecessor);
    for (const { ref } of tokens) {
      const pred = resolvePredecessorTask(ref);
      if (!pred) continue;
      const pi = rows.indexOf(pred);
      if (pi < 0) continue;
      const pm = barMetrics(pred);
      const sm = barMetrics(succ);
      if (pm.width <= 0 || sm.width <= 0) continue;
      const predRight = pm.left + pm.width;
      const succLeft = sm.left;
      const d = buildDependencyPathFs(pi, si, predRight, succLeft);
      items.push({ id: `dep-${succ.id}-${n++}`, d });
    }
  }
  return items;
});

let onTableScrollHandler: (() => void) | null = null;
let onGanttScrollHandler: (() => void) | null = null;
let onGanttHeaderScrollHandler: (() => void) | null = null;

function bindTableBodyScroll() {
  unbindTableBodyScroll();
  const wrap = tableWrapRef.value;
  if (!wrap) return;
  tableBodyEl = wrap.querySelector('.ant-table-body') as HTMLElement | null;
  const gEl = ganttBodyRef.value;
  ganttHeaderScrollEl = ganttHeaderScrollRef.value;
  if (!tableBodyEl || !gEl) return;

  onTableScrollHandler = () => {
    if (scrollLock) return;
    scrollLock = true;
    const t = tableBodyEl!.scrollTop;
    if (gEl.scrollTop !== t) gEl.scrollTop = t;
    requestAnimationFrame(() => {
      scrollLock = false;
    });
  };

  onGanttScrollHandler = () => {
    if (tableBodyEl) {
      if (!scrollLock) {
        scrollLock = true;
        const t = gEl.scrollTop;
        if (tableBodyEl.scrollTop !== t) tableBodyEl.scrollTop = t;
        requestAnimationFrame(() => {
          scrollLock = false;
        });
      }
    }
    if (ganttHeaderScrollEl) {
      if (!hScrollLock) {
        const l = gEl.scrollLeft;
        if (ganttHeaderScrollEl.scrollLeft !== l) {
          hScrollLock = true;
          ganttHeaderScrollEl.scrollLeft = l;
          requestAnimationFrame(() => {
            hScrollLock = false;
          });
        }
      }
    }
  };

  onGanttHeaderScrollHandler = () => {
    if (!gEl || hScrollLock) return;
    const l = ganttHeaderScrollEl!.scrollLeft;
    if (gEl.scrollLeft !== l) {
      hScrollLock = true;
      gEl.scrollLeft = l;
      requestAnimationFrame(() => {
        hScrollLock = false;
      });
    }
  };

  tableBodyEl.addEventListener('scroll', onTableScrollHandler, { passive: true });
  gEl.addEventListener('scroll', onGanttScrollHandler, { passive: true });
  if (ganttHeaderScrollEl) {
    ganttHeaderScrollEl.addEventListener('scroll', onGanttHeaderScrollHandler, { passive: true });
  }
}

function unbindTableBodyScroll() {
  if (tableBodyEl && onTableScrollHandler) {
    tableBodyEl.removeEventListener('scroll', onTableScrollHandler);
  }
  if (ganttBodyRef.value && onGanttScrollHandler) {
    ganttBodyRef.value.removeEventListener('scroll', onGanttScrollHandler);
  }
  if (ganttHeaderScrollEl && onGanttHeaderScrollHandler) {
    ganttHeaderScrollEl.removeEventListener('scroll', onGanttHeaderScrollHandler);
  }
  tableBodyEl = null;
  ganttHeaderScrollEl = null;
  onTableScrollHandler = null;
  onGanttScrollHandler = null;
  onGanttHeaderScrollHandler = null;
}

function measureTheadChromeHeight() {
  const thead = tableWrapRef.value?.querySelector('.ant-table-thead') as HTMLElement | null;
  if (thead) {
    const h = Math.round(thead.getBoundingClientRect().height);
    if (h > 0) ganttChromeHeightPx.value = h;
  }
}

/** scroll.y 仅为表体高度，须从左侧栏总高中减去表头，否则表体溢出、横向条被顶到视口外，无法与右侧甘特底部对齐 */
function measureTableBodyHeight() {
  const wrap = tableWrapRef.value;
  if (!wrap) return;
  const thead = wrap.querySelector('.ant-table-thead') as HTMLElement | null;
  const theadH = thead ? Math.ceil(thead.getBoundingClientRect().height) : Math.max(40, ganttChromeHeightPx.value);
  const borderReserve = 2;
  const h = Math.max(200, Math.floor(wrap.clientHeight - theadH - borderReserve));
  tableBodyHeight.value = h;
}

function measureSyncHeights() {
  measureTheadChromeHeight();
  measureTableBodyHeight();
}

const ganttGridMinHeightPx = computed(() => flatRows.value.length * ROW_H);

/** 拖拽命中区略大于视觉线宽，便于拖动 */
const SPLITTER_HIT_PX = 4;
const GANTT_MIN_W = 200;
const TABLE_MIN_W = 260;

function clampLeftWidth(rootW: number, w: number) {
  const maxL = Math.max(TABLE_MIN_W, rootW - SPLITTER_HIT_PX - GANTT_MIN_W);
  return Math.min(maxL, Math.max(TABLE_MIN_W, Math.round(w)));
}

function ensureLeftPaneWidthInitialized() {
  const root = splitRootRef.value;
  if (!root || ganttCollapsed.value) return;
  const rw = root.clientWidth;
  if (rw <= SPLITTER_HIT_PX + GANTT_MIN_W + TABLE_MIN_W) return;
  if (leftPaneWidthPx.value == null) {
    leftPaneWidthPx.value = clampLeftWidth(rw, rw * 0.7);
  } else {
    leftPaneWidthPx.value = clampLeftWidth(rw, leftPaneWidthPx.value);
  }
}

const leftPaneDynamicStyle = computed(() => {
  if (ganttCollapsed.value) {
    return {
      flex: '1 1 auto',
      width: 'auto',
      minWidth: 0,
      maxWidth: 'none',
    };
  }
  const px = leftPaneWidthPx.value;
  if (px == null) {
    return {
      flex: '0 0 70%',
      minWidth: `${TABLE_MIN_W}px`,
      maxWidth: '92%',
    };
  }
  return {
    flex: `0 0 ${px}px`,
    width: `${px}px`,
    minWidth: `${TABLE_MIN_W}px`,
    maxWidth: 'none',
  };
});

const rightPaneDynamicStyle = computed(() => {
  if (ganttCollapsed.value) {
    return { display: 'none' };
  }
  return {
    flex: '1 1 0',
    minWidth: `${GANTT_MIN_W}px`,
    minHeight: 0,
  };
});

/** 表体固定像素高，配合样式使左侧横向滚动条落在栏底，与右侧 .gantt-body 对齐 */
const tableWbsBodyCssVars = computed(() => ({
  '--wbs-table-body-h': `${Math.max(0, Math.floor(Number(tableBodyHeight.value) || 0))}px`,
}));

function toggleGanttCollapsed() {
  if (ganttCollapsed.value) {
    ganttCollapsed.value = false;
    nextTick(() => {
      ensureLeftPaneWidthInitialized();
      if (leftPaneWidthBeforeCollapse.value != null && splitRootRef.value) {
        const rw = splitRootRef.value.clientWidth;
        leftPaneWidthPx.value = clampLeftWidth(rw, leftPaneWidthBeforeCollapse.value);
      }
      void refreshScrollBinding();
    });
  } else {
    const leftEl = tableWrapRef.value;
    if (leftEl) {
      leftPaneWidthBeforeCollapse.value = Math.round(leftEl.getBoundingClientRect().width);
    } else if (leftPaneWidthPx.value != null) {
      leftPaneWidthBeforeCollapse.value = leftPaneWidthPx.value;
    }
    ganttCollapsed.value = true;
    nextTick(() => void refreshScrollBinding());
  }
}

let splitDragStartX = 0;
let splitDragStartWidth = 0;

function onSplitterMouseDown(e: MouseEvent) {
  if (ganttCollapsed.value) return;
  if ((e.target as HTMLElement).closest('.project-task-wbs__splitter-toggle')) return;
  const root = splitRootRef.value;
  const leftEl = tableWrapRef.value;
  if (!root || !leftEl) return;

  ensureLeftPaneWidthInitialized();
  const startW = leftPaneWidthPx.value ?? Math.round(leftEl.getBoundingClientRect().width);

  splitterDragging.value = true;
  splitDragStartX = e.clientX;
  splitDragStartWidth = startW;

  const onMove = (ev: MouseEvent) => {
    const rw = root.getBoundingClientRect().width;
    if (rw <= 0) return;
    const dx = ev.clientX - splitDragStartX;
    leftPaneWidthPx.value = clampLeftWidth(rw, splitDragStartWidth + dx);
  };

  const onUp = () => {
    splitterDragging.value = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    void refreshScrollBinding();
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  e.preventDefault();
}

let ro: ResizeObserver | null = null;

async function refreshScrollBinding() {
  await nextTick();
  measureSyncHeights();
  await nextTick();
  maybeFitGanttTimelineToView();
  bindTableBodyScroll();
}

onMounted(async () => {
  await nextTick();
  ensureLeftPaneWidthInitialized();
  measureSyncHeights();
  ro = new ResizeObserver(() => {
    measureSyncHeights();
    ensureLeftPaneWidthInitialized();
    nextTick(() => {
      maybeFitGanttTimelineToView();
      bindTableBodyScroll();
    });
  });
  if (tableWrapRef.value) ro.observe(tableWrapRef.value.parentElement ?? tableWrapRef.value);
  await nextTick();
  if (splitRootRef.value) ro.observe(splitRootRef.value);
  if (ganttBodyRef.value) ro.observe(ganttBodyRef.value);
  await refreshScrollBinding();
});

onBeforeUnmount(() => {
  ro?.disconnect();
  unbindTableBodyScroll();
});

watch([tableBodyHeight, flatRows, pxPerDay, expandedRowKeys, timelineWidthPx], async () => {
  await refreshScrollBinding();
});

watch(ganttChromeHeightPx, async () => {
  await nextTick();
  bindTableBodyScroll();
});

watch(ganttCollapsed, () => {
  nextTick(() => {
    if (!ganttCollapsed.value) ensureLeftPaneWidthInitialized();
    void refreshScrollBinding();
  });
});
</script>

<template>
  <div
    ref="splitRootRef"
    class="project-task-wbs"
    :class="{ 'is-split-dragging': splitterDragging }">
    <div ref="tableWrapRef" class="project-task-wbs__left" :style="leftPaneDynamicStyle">
      <a-table
        class="project-task-wbs-table"
        :style="tableWbsBodyCssVars"
        table-layout="fixed"
        size="small"
        bordered
        v-model:expanded-row-keys="expandedRowKeys"
        :expand-icon-column-index="1"
        :columns="columns"
        :data-source="treeData"
        :pagination="false"
        :scroll="{ x: scrollX, y: tableBodyHeight }"
        row-key="id"
        @resize-column="handleResizeColumn">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'wbsCode'">
            {{ record.wbsCode && !String(record.wbsCode).includes('.') ? `— ${record.wbsCode}` : record.wbsCode }}
          </template>
          <template v-if="column.key === 'startDate'">
            <div class="task-wbs-date-cell">
              <a-date-picker
                :locale="localeDatePickerZh"
                :value="record.startDate || undefined"
                class="task-wbs-date-picker"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                size="small"
                placeholder="开始"
                :disabled-date="makeDisabledTaskStart(record)"
                @change="makeOnTaskStartChange(record)" />
            </div>
          </template>
          <template v-else-if="column.key === 'endDate'">
            <div class="task-wbs-date-cell">
              <a-date-picker
                :locale="localeDatePickerZh"
                :value="record.endDate || undefined"
                class="task-wbs-date-picker"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                size="small"
                placeholder="完成"
                :disabled-date="makeDisabledTaskEnd(record)"
                @change="makeOnTaskEndChange(record)" />
            </div>
          </template>
          <template v-else-if="column.key === 'resource'">
            <div class="task-wbs-responsible-cell">
              <span class="task-wbs-responsible-text" :title="record.resource">{{ record.resource }}</span>
              <a-button type="primary" size="small" @click.stop="openResponsiblePicker(record, 'responsible')">
                浏览
              </a-button>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="task-wbs-status-cell">
              <span class="task-wbs-status-pill" :class="`is-${record.status}`">{{ statusLabel(record.status) }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space v-if="record.type === 1" :size="6" wrap class="task-wbs-ops">
              <a-button type="primary" size="small" @click.stop="onTaskStart(record)">启动</a-button>
            </a-space>
            <a-space v-else :size="6" wrap class="task-wbs-ops">
              <a-tooltip title="发布">
                <a-button type="link" size="small" class="task-wbs-ops__btn" @click.stop="onTaskPublish(record)">
                  <template #icon><SendOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="变更">
                <a-button type="link" size="small" class="task-wbs-ops__btn" @click.stop="onTaskChangeRequest(record)">
                  <template #icon><FormOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="撤销发布">
                <a-button type="link" size="small" class="task-wbs-ops__btn" @click.stop="onTaskUnpublish(record)">
                  <template #icon><RollbackOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑">
                <a-button type="link" size="small" class="task-wbs-ops__btn" @click.stop="onTaskEdit(record)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button type="link" size="small" danger class="task-wbs-ops__btn" @click.stop="onTaskDelete(record)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-modal
        v-model:visible="responsiblePickerVisible"
        :title="responsiblePickerField === 'responsible' ? '选择负责人' : '选择管理者'"
        width="560px"
        :mask-closable="false"
        destroy-on-close
        @cancel="closeResponsiblePicker">
        <div class="task-wbs-responsible-modal">
          <a-input
            v-model:value="responsiblePickerKeyword"
            allow-clear
            placeholder="搜索姓名、账号、部门"
            size="small" />
          <div class="task-wbs-responsible-modal__hint">每行任务仅可选一名负责人。</div>
          <div class="task-wbs-responsible-modal__list">
            <a-radio-group v-model:value="responsiblePickerSelectedUserId" class="task-wbs-responsible-modal__radios">
              <div class="task-wbs-responsible-modal__row">
                <a-radio :value="RESPONSIBLE_PICKER_NONE">不指定负责人</a-radio>
              </div>
              <div v-for="u in responsiblePickerFilteredUsers" :key="u.id" class="task-wbs-responsible-modal__row">
                <a-radio :value="u.id">{{ formatResponsibleUserRow(u) }}</a-radio>
              </div>
            </a-radio-group>
            <div v-if="!responsiblePickerFilteredUsers.length" class="task-wbs-responsible-modal__empty">无匹配用户</div>
          </div>
        </div>
        <template #footer>
          <a-button @click="closeResponsiblePicker">取消</a-button>
          <a-button type="primary" @click="confirmResponsiblePicker">确定</a-button>
        </template>
      </a-modal>
    </div>
    <div
      v-if="!ganttCollapsed"
      class="project-task-wbs__splitter"
      :class="{ 'is-collapsed': ganttCollapsed }"
      :style="{ flex: `0 0 ${SPLITTER_HIT_PX}px`, width: `${SPLITTER_HIT_PX}px` }"
      @mousedown="onSplitterMouseDown">
      <button
        type="button"
        class="project-task-wbs__splitter-toggle"
        :title="ganttCollapsed ? '展开甘特图' : '收起甘特图'"
        @mousedown.stop
        @click.stop="toggleGanttCollapsed">
        <RightOutlined v-if="!ganttCollapsed" />
        <LeftOutlined v-else />
      </button>
    </div>
    <div v-if="!ganttCollapsed" class="project-task-wbs__right" :style="rightPaneDynamicStyle">
      <div class="gantt-right-chrome" :style="{ height: `${ganttChromeHeightPx}px` }">
        <div class="gantt-timeline-header">
          <div ref="ganttHeaderScrollRef" class="gantt-timeline-header__tracks">
            <div class="gantt-scale-row gantt-scale-row--month" :style="{ width: `${timelineWidthPx}px` }">
              <div
                v-for="(c, i) in monthHeaderCells"
                :key="'m' + i"
                class="gantt-scale-cell gantt-scale-cell--month"
                :style="{ width: `${c.widthPx}px`, minWidth: `${c.widthPx}px` }">
                <span class="gantt-scale-cell__inner">{{ c.label }}</span>
              </div>
            </div>
            <div class="gantt-scale-row gantt-scale-row--week" :style="{ width: `${timelineWidthPx}px` }">
              <div
                v-for="(c, i) in weekHeaderCells"
                :key="'w' + i"
                class="gantt-scale-cell gantt-scale-cell--week"
                :style="{ width: `${c.widthPx}px`, minWidth: `${c.widthPx}px` }">
                <span class="gantt-scale-cell__inner">{{ c.label }}</span>
              </div>
            </div>
          </div>
          <div class="gantt-timeline-header__actions" @click.stop>
            <a-tooltip title="适应宽度">
              <a-button type="text" size="small" class="gantt-header-action-btn" @click="fitTimelineToView">
                <template #icon><ColumnWidthOutlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="缩小">
              <a-button type="text" size="small" class="gantt-header-action-btn" @click="zoomOut">
                <template #icon><MinusOutlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="放大">
              <a-button type="text" size="small" class="gantt-header-action-btn" @click="zoomIn">
                <template #icon><PlusOutlined /></template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
      <div ref="ganttBodyRef" class="gantt-body" :style="{ height: `${tableBodyHeight}px` }">
        <div
          class="gantt-grid"
          :style="{
            width: `${timelineWidthPx}px`,
            '--gantt-content-min-h': `${ganttGridMinHeightPx}px`,
          }">
          <div
            v-for="row in flatRows"
            :key="row.id"
            class="gantt-row"
            :style="{ height: `${ROW_H}px` }">
            <div class="gantt-row__grid-bg" />
            <div
              v-if="barMetrics(row).width > 0"
              class="gantt-bar__label-top"
              :title="`${row.taskName} ${row.progress}%`"
              :style="{
                left: `${barMetrics(row).left}px`,
                width: `${barMetrics(row).width}px`,
              }">
              {{ row.taskName }} {{ row.progress }}%
            </div>
            <div
              v-if="barMetrics(row).width > 0"
              class="gantt-bar"
              :style="{
                left: `${barMetrics(row).left}px`,
                width: `${barMetrics(row).width}px`,
              }">
              <div class="gantt-bar__progress" :style="{ width: `${Math.min(100, Math.max(0, row.progress))}%` }" />
            </div>
          </div>
          <svg
            class="gantt-links-layer"
            xmlns="http://www.w3.org/2000/svg"
            :width="timelineWidthPx"
            :height="ganttGridMinHeightPx"
            aria-hidden="true">
            <defs>
              <marker
                :id="ganttArrowMarkerId"
                markerWidth="7"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#1890ff" />
              </marker>
            </defs>
            <path
              v-for="item in ganttDependencyLinks"
              :key="item.id"
              class="gantt-link-path"
              :d="item.d"
              fill="none"
              stroke="#1890ff"
              stroke-width="1.5"
              stroke-linejoin="round"
              :marker-end="`url(#${ganttArrowMarkerId})`" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.project-task-wbs {
  display: flex;
  align-items: stretch;
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
  gap: 0;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.project-task-wbs.is-split-dragging {
  cursor: col-resize;
  user-select: none;
}

.project-task-wbs__left {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: none;
}

.project-task-wbs__splitter {
  position: relative;
  flex-shrink: 0;
  align-self: stretch;
  background: #fafafa;
  box-shadow: none;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  z-index: 2;
}

/* 避免分割条与左右块叠层产生边缘发灰 */
.project-task-wbs__splitter::before,
.project-task-wbs__splitter::after {
  display: none;
}

.project-task-wbs__splitter:not(.is-collapsed) {
  cursor: col-resize;
}

.project-task-wbs__splitter.is-collapsed {
  cursor: default;
}

/* 参考：浅灰圆底 + 深色单箭头；收起为向右 >，展开后为向左 < */
.project-task-wbs__splitter-toggle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  color: rgba(0, 0, 0, 0.72);
  line-height: 1;
  cursor: pointer;
  box-shadow: none;
}

.project-task-wbs__splitter-toggle:hover {
  background: #e8e8e8;
  color: rgba(0, 0, 0, 0.85);
}

.project-task-wbs__splitter-toggle:active {
  background: #e0e0e0;
}

.project-task-wbs__splitter-toggle :deep(.anticon) {
  font-size: 10px;
  line-height: 1;
}

.project-task-wbs__right {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: none;
}

.gantt-right-chrome {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
  background: #f5f5f5;
}

/* 与参考图一致：左侧为可横向滚动的双层时间轴，右侧为固定工具列 */
.gantt-timeline-header {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  align-items: stretch;
}

.gantt-timeline-header__tracks {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-gutter: stable;
  /* 避免子级把刻度撑出可视区导致日期裁切无省略 */
  max-width: 100%;
}

.gantt-timeline-header__tracks::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-timeline-header__tracks::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 4px;
}

.gantt-timeline-header__tracks::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
}

.gantt-timeline-header__actions {
  flex: 0 0 26px;
  width: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 2px 0;
  border-left: 1px solid #e0e0e0;
  background: #f5f5f5;
  box-sizing: border-box;
}

.gantt-header-action-btn {
  width: 22px;
  height: 20px;
  min-width: 22px !important;
  padding: 0 !important;
  margin: 0;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.55);
  font-size: 11px;
}

.gantt-header-action-btn :deep(.anticon) {
  font-size: 11px;
}

.gantt-header-action-btn:hover {
  color: #1890ff;
}

.gantt-scale-row {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  align-items: stretch;
  box-sizing: border-box;
}

.gantt-scale-row--month {
  border-bottom: 1px solid #e8e8e8;
}

.gantt-scale-cell {
  flex: 0 0 auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  writing-mode: horizontal-tb;
  overflow: hidden;
  padding: 0 4px;
}

/* flex 子项省略号：占满格宽后再截断，避免「2023年12月」等撑破或竖排 */
.gantt-scale-cell__inner {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}

.gantt-scale-cell--month {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.75);
  background: #f0f0f0;
}

.gantt-scale-cell--week {
  font-size: 11px;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.55);
  background: #fafafa;
}

.project-task-wbs-table {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 让表格占满左侧栏高度，表体底部即横向滚动条位置，与右侧 .gantt-body 底边对齐 */
.project-task-wbs-table :deep(.ant-spin-nested-loading),
.project-task-wbs-table :deep(.ant-spin-container) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.project-task-wbs-table :deep(.ant-table) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.project-task-wbs-table :deep(.ant-table-container) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.project-task-wbs-table :deep(.ant-table-content) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 去掉表格两侧固定列等产生的投影，避免左右发灰边 */
.project-task-wbs-table :deep(.ant-table-wrapper),
.project-task-wbs-table :deep(.ant-table),
.project-task-wbs-table :deep(.ant-table-container),
.project-task-wbs-table :deep(.ant-table-content) {
  box-shadow: none !important;
}

.project-task-wbs-table :deep(.ant-table-cell-fix-left),
.project-task-wbs-table :deep(.ant-table-cell-fix-right) {
  box-shadow: none !important;
}

/* 横向滚动时 Ant Table 在容器两侧加的 ping 渐变（::before/::after），紧贴分割条易看成阴影 */
.project-task-wbs-table :deep(.ant-table-container::before),
.project-task-wbs-table :deep(.ant-table-container::after) {
  box-shadow: none !important;
}

.project-task-wbs-table :deep(.ant-table-ping-left),
.project-task-wbs-table :deep(.ant-table-ping-right),
.project-task-wbs-table :deep(.ant-table-wrapper.ant-table-ping-left),
.project-task-wbs-table :deep(.ant-table-wrapper.ant-table-ping-right) {
  box-shadow: none !important;
}

.project-task-wbs-table :deep(.ant-table-cell-fix-left-first::after),
.project-task-wbs-table :deep(.ant-table-cell-fix-left-last::after),
.project-task-wbs-table :deep(.ant-table-cell-fix-right-first::after),
.project-task-wbs-table :deep(.ant-table-cell-fix-right-last::after) {
  box-shadow: none !important;
}

/* 有横向滚动时常见结构：scroll 容器包住 header+body，须占满剩余高度 */
.project-task-wbs-table :deep(.ant-table-scroll) {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.project-task-wbs-table :deep(.ant-table-scroll .ant-table-header) {
  flex: 0 0 auto;
}

/* 与甘特区一致：表体固定为 scroll.y 高度（避免仅用 max-height 随内容变矮），横向条贴在栏底与右侧对齐 */
.project-task-wbs-table :deep(.ant-table-body) {
  flex: 1 1 0;
  min-height: 0;
  height: var(--wbs-table-body-h, 420px) !important;
  max-height: var(--wbs-table-body-h, 420px) !important;
  scrollbar-width: thin;
  overflow-x: auto !important;
  overflow-y: scroll !important;
  scrollbar-gutter: stable;
}

.project-task-wbs-table :deep(.ant-table-body::-webkit-scrollbar),
.gantt-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.project-task-wbs-table :deep(.ant-table-body::-webkit-scrollbar-thumb),
.gantt-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 4px;
}

.project-task-wbs-table :deep(.ant-table-body::-webkit-scrollbar-track),
.gantt-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
}

.project-task-wbs-table :deep(.ant-table-thead > tr > th) {
  background: #f5f5f5;
  color: rgba(0, 0, 0, 0.85);
  font-size: 12px;
  font-weight: 600;
  padding: 7px 8px;
  vertical-align: middle;
}

.project-task-wbs-table :deep(.ant-table-tbody > tr) {
  height: 34px;
  box-sizing: border-box;
}

.project-task-wbs-table :deep(.ant-table-tbody > tr > td) {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.78);
  padding: 3px 8px;
  vertical-align: middle;
  height: 34px;
  box-sizing: border-box;
  line-height: 18px;
}

.task-wbs-status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.task-wbs-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 0 8px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.task-wbs-status-pill.is-completed {
  color: #1677ff;
  border-color: #b7d5ff;
  background: #eff6ff;
}

.task-wbs-status-pill.is-in_progress {
  color: #d48806;
  border-color: #ffe58f;
  background: #fffbe6;
}

.task-wbs-status-pill.is-delayed {
  color: #cf1322;
  border-color: #ffccc7;
  background: #fff1f0;
}

.task-wbs-status-pill.is-pending {
  color: rgba(0, 0, 0, 0.65);
  border-color: #d9d9d9;
  background: #fafafa;
}

.task-wbs-responsible-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.task-wbs-responsible-text {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-wbs-responsible-modal {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-wbs-responsible-modal__hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.4;
}

.task-wbs-responsible-modal__list {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px 12px;
  max-height: 360px;
  overflow-y: auto;
}

.task-wbs-responsible-modal__radios {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.task-wbs-responsible-modal__row {
  padding: 6px 0;
  border-bottom: 1px dashed #f5f5f5;
}

.task-wbs-responsible-modal__row:last-child {
  border-bottom: 0;
}

.task-wbs-responsible-modal__empty {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.35);
  text-align: center;
  padding: 16px 0;
}

.task-wbs-ops {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 0;
}

.task-wbs-date-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.task-wbs-date-picker {
  width: 100%;
  max-width: 118px;
}

.task-wbs-date-picker :deep(.ant-picker-input > input) {
  font-size: 13px;
  line-height: 20px;
}

.task-wbs-date-picker :deep(.ant-picker-input) {
  align-items: center;
}

.task-wbs-ops__btn {
  width: 20px;
  height: 20px;
  min-width: 20px !important;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #1677ff;
}

.task-wbs-ops__btn:hover {
  color: #4096ff;
}

.task-wbs-ops__btn.ant-btn-dangerous {
  color: #ff4d4f;
}

.gantt-body {
  flex: 1 1 0;
  min-height: 0;
  overflow-x: auto;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-gutter: stable;
  position: relative;
  background: #f5f5f5;
}

.gantt-grid {
  position: relative;
  /* 行数少时也铺满 .gantt-body 可视高，使竖向网格线延伸到底，避免下方大块留白 */
  min-height: max(100%, var(--gantt-content-min-h, 0px));
  box-sizing: border-box;
  background: #f5f5f5;
}

.gantt-links-layer {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
}

.gantt-row {
  position: relative;
  box-sizing: border-box;
  border-bottom: none;
}

.gantt-row__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gantt-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  height: 13px;
  border-radius: 3px;
  background: #0b78e3;
  box-shadow: 0 0 0 1px rgba(11, 120, 227, 0.22) inset;
  overflow: hidden;
  min-width: 2px;
}

.gantt-bar__progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #0b78e3;
  border-radius: 3px 0 0 3px;
  max-width: 100%;
}

.gantt-bar__label-top {
  position: absolute;
  z-index: 5;
  top: 1px;
  padding: 0 6px;
  font-size: 11px;
  line-height: 1.2;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
