/** 工作台待办任务大类（与后端推送字段对齐时可单独增加枚举值） */
export type WorkbenchTaskKind = 'wbs' | 'standalone' | 'compute' | 'other';

export interface TaskItem {
  /** 与后端 Long 主键一致，可能为数字或字符串（防精度丢失） */
  id: number | string;
  title: string;
  tags: string[];
  startTime: string;
  endTime: string;
  type: string;
  category: 'assign' | 'product' | 'app' | 'compute';
  status: 'todo' | 'done';
  scene: 'product' | 'app' | 'compute' | 'general';
  /** 卡片样式与默认操作按钮集由此字段区分 */
  taskKind: WorkbenchTaskKind;
  progress: number;
  delayDays?: number;
  remainDays?: number;
  creatorName: string;
  creatorAvatar: string;
  /** 设计任务业务 id（用于应用列表、设计页 query） */
  taskId?: number | string;
  /** 项目 id（WBS 协同设计页 query） */
  projectId?: number | string;
  /** 独立应用 id，优先用于进入设计工作台 */
  standaloneAppId?: number | string;
  /** WBS 行 id（business_workbench_todo_card.project_wbs_id），已办协同任务发起变更用 */
  projectWbsId?: number | string;
  /** 「我已转办」列表：仅展示，不可操作任务 */
  viewOnly?: boolean;
  /** 当前承办人展示名（服务端回填 assigneeDisplayName） */
  assigneeDisplayName?: string;
}

/** 类型展示名 */
export const TASK_KIND_LABEL: Record<WorkbenchTaskKind, string> = {
  wbs: 'WBS系统任务',
  standalone: '独立应用任务',
  compute: '计算任务',
  other: '其他任务',
};

/**
 * 各类型卡片右下角默认可出现的能力键（仍会与权限函数 `canAssign` 等求交集）
 * 后续新增类型时在此扩展即可
 */
export const TASK_KIND_ACTIONS: Record<
  WorkbenchTaskKind,
  Array<'assign' | 'transfer' | 'detail' | 'design' | 'change'>
> = {
  /** WBS：指派、转办、详情、设计；已办另由 taskActionAllowed 开放「变更」 */
  wbs: ['assign', 'transfer', 'detail', 'design', 'change'],
  /** 独立应用：不支持工作台转办（仅 WBS 协同可转办） */
  standalone: ['detail', 'design'],
  /** 计算任务：以查看与进入设计/计算为主 */
  compute: ['detail', 'design'],
  other: ['assign', 'detail', 'design'],
};

/**
 * 工作台顶栏两大业务域（数据源互不共用）：
 * - 设计任务：workbench-todo-card（WBS / 独立应用 / 计算等）
 * - 待审核：OA 等审批流，由独立接口接入后在此列表展示
 */
export const WORKBENCH_TABS = [
  { title: '设计任务', name: 'todo' },
  { title: '待审核', name: 'audit' },
];

export const WORKBENCH_SECONDARY_TABS = [
  { title: '待办', value: 'todo' },
  { title: '已办', value: 'done' },
  { title: '已转办', value: 'transfer' },
  { title: 'WBS协同待办', value: 'wbs' },
  { title: '独立应用待办', value: 'app' },
  { title: '计算待办', value: 'compute' },
  { title: '全部', value: 'all' },
] as const;

export const MOCK_TODO_LIST: TaskItem[] = [
  {
    id: 1,
    title: '坦克00123车窗户形状创意设计',
    tags: ['延', '待办'],
    startTime: '2026年6月21日',
    endTime: '2026年7月21日',
    type: '任务指派',
    category: 'assign',
    status: 'todo',
    scene: 'general',
    taskKind: 'wbs',
    progress: 24,
    delayDays: 32,
    creatorName: '李建明',
    creatorAvatar: '',
  },
  {
    id: 2,
    title: '自动化装配线机械臂结构设计',
    tags: ['转', '待办'],
    startTime: '2026年6月21日',
    endTime: '2026年7月21日',
    type: '独立应用',
    category: 'app',
    status: 'todo',
    scene: 'app',
    taskKind: 'standalone',
    progress: 14,
    remainDays: 4,
    creatorName: '李建明',
    creatorAvatar: '',
  },
  {
    id: 3,
    title: '高精度数控转台回转支撑机构设计与仿真...',
    tags: ['待办'],
    startTime: '2026年6月21日',
    endTime: '2026年7月21日',
    type: '计算',
    category: 'compute',
    status: 'todo',
    scene: 'compute',
    taskKind: 'compute',
    progress: 50,
    remainDays: 10,
    creatorName: '李建明',
    creatorAvatar: '',
  },
  {
    id: 4,
    title: '轻量化电动车传动系统设计',
    tags: ['待办'],
    startTime: '2026年6月21日',
    endTime: '2026年7月21日',
    type: '产品设计',
    category: 'product',
    status: 'done',
    scene: 'product',
    taskKind: 'wbs',
    progress: 100,
    creatorName: '李建明',
    creatorAvatar: '',
  },
  {
    id: 5,
    title: '新能源驱动总成壳体外观与工艺优化',
    tags: ['待办'],
    startTime: '2026年6月25日',
    endTime: '2026年7月30日',
    type: '产品设计',
    category: 'product',
    status: 'todo',
    scene: 'product',
    taskKind: 'wbs',
    progress: 32,
    remainDays: 12,
    creatorName: '李建明',
    creatorAvatar: '',
  }
];
