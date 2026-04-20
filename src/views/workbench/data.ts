export interface TaskItem {
  id: number;
  title: string;
  tags: string[];
  startTime: string;
  endTime: string;
  type: string;
  progress: number;
  delayDays?: number;
  remainDays?: number;
  creatorName: string;
  creatorAvatar: string;
}

export const WORKBENCH_TABS = [
  { title: '待办', name: 'todo' },
  { title: '待审核', name: 'audit' },
  { title: '已办', name: 'done' },
  { title: '已转办', name: 'transfer' },
  { title: '已审批', name: 'approval' }
];

export const MOCK_TODO_LIST: TaskItem[] = [
  {
    id: 1,
    title: '坦克00123车窗户形状创意设计',
    tags: ['延', '待办'],
    startTime: '2026年6月21日',
    endTime: '2026年7月21日',
    type: '重大改进项目',
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
    type: '重大改进项目',
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
    type: '重大改进项目',
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
    type: '重大改进项目',
    progress: 34,
    remainDays: 15,
    creatorName: '李建明',
    creatorAvatar: '',
  }
];
