export interface TaskItem {
  id: number;
  title: string;
  tags: string[];
  startTime: string;
  endTime: string;
  type: string;
  category: 'assign' | 'product' | 'app' | 'compute';
  status: 'todo' | 'done';
  scene: 'product' | 'app' | 'compute' | 'general';
  progress: number;
  delayDays?: number;
  remainDays?: number;
  creatorName: string;
  creatorAvatar: string;
}

export const WORKBENCH_TABS = [
  { title: '设计任务', name: 'todo' },
  { title: '待审核', name: 'audit' },
];

export const WORKBENCH_SECONDARY_TABS = [
  { title: '待办', value: 'todo' },
  { title: '已办', value: 'done' },
  { title: '已转办', value: 'transfer' },
  { title: '产品设计待办', value: 'product' },
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
    progress: 32,
    remainDays: 12,
    creatorName: '李建明',
    creatorAvatar: '',
  }
];
