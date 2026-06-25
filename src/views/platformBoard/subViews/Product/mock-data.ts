import type { DrawingProgressItem } from './component/drawing-progress.vue';

/**
 * 除「项目概览」外是否 Mock。
 * 项目任务 / 项目交付 / 活跃用户 Top10 均走真实接口，失败时用 Mock 兜底。
 */
/** 接口无数据时是否用示意图 Mock 兜底（项目概览始终走真实接口） */
export const USE_MOCK_DATA = true;

export const MOCK_STATS_LIST = [
  { title: '项目总数', num: 16, color: '#2A82E4' },
  { title: '在建项目', num: 16, color: '#FFAF1A' },
  { title: '完成项目', num: 0, color: '#43CF7C' },
  { title: '延期项目', num: 1, color: '#D43030' },
];

export const MOCK_PRODUCT_INFO = {
  totleNum: 16,
  inDesignNum: 16,
  completedNum: 0,
  postponementNum: 1,
  project5List: [
    { projectName: '45A 复兴号', completeNums: 62, taskNums: 100 },
    { projectName: '30-动力分散', completeNums: 48, taskNums: 100 },
    { projectName: 'J1-300动集', completeNums: 71, taskNums: 100 },
    { projectName: 'J11-DF11', completeNums: 55, taskNums: 100 },
    { projectName: '15-驾驶台', completeNums: 38, taskNums: 100 },
  ],
  taskNumsList: [
    { taskState: 2, taskNums: 450, taskStateName: '已完成' },
    { taskState: 1, taskNums: 320, taskStateName: '进行中' },
    { taskState: 3, taskNums: 120, taskStateName: '变更中' },
    { taskState: 0, taskNums: 47, taskStateName: '未开始' },
  ],
  phaseList: [
    { nodeName: '设计立项', countNums: 1, sumNum: 4 },
    { nodeName: '设计策划', countNums: 17, sumNum: 25 },
    { nodeName: '设计输入', countNums: 18, sumNum: 23 },
    { nodeName: '方案设计', countNums: 274, sumNum: 339 },
    { nodeName: '技术设计', countNums: 290, sumNum: 329 },
    { nodeName: '施工设计', countNums: 212, sumNum: 234 },
  ],
};

export const MOCK_DEPT_DATA_MAINTAIN_INFO: Record<
  string,
  {
    activityPageCount: number;
    taskCreateCount: number;
    calcCreateCount: number;
  }
> = {
  企业信息管理部: { activityPageCount: 5, taskCreateCount: 12, calcCreateCount: 8 },
  设计部: { activityPageCount: 3, taskCreateCount: 27, calcCreateCount: 2 },
  总体: { activityPageCount: 8, taskCreateCount: 18, calcCreateCount: 6 },
  车体: { activityPageCount: 4, taskCreateCount: 15, calcCreateCount: 9 },
  转向架: { activityPageCount: 2, taskCreateCount: 11, calcCreateCount: 5 },
};

export const MOCK_DELIVERY_INFO: Record<
  string,
  {
    collabPublished: number;
    collabCompleted?: number;
    standaloneAppCount: number;
    calcAppCount: number;
    totalPublishedCount: number;
  }
> = {
  企业信息管理部: { collabPublished: 5, standaloneAppCount: 27, calcAppCount: 8, totalPublishedCount: 40 },
  设计部: { collabPublished: 0, standaloneAppCount: 2, calcAppCount: 6, totalPublishedCount: 8 },
  总体: { collabPublished: 36, standaloneAppCount: 39, calcAppCount: 15, totalPublishedCount: 90 },
  项目管理: { collabPublished: 9, standaloneAppCount: 6, calcAppCount: 4, totalPublishedCount: 19 },
  车体: { collabPublished: 5, standaloneAppCount: 4, calcAppCount: 7, totalPublishedCount: 16 },
  转向架: { collabPublished: 4, standaloneAppCount: 5, calcAppCount: 3, totalPublishedCount: 12 },
  制动系统: { collabPublished: 3, standaloneAppCount: 3, calcAppCount: 5, totalPublishedCount: 11 },
  电传动: { collabPublished: 5, standaloneAppCount: 4, calcAppCount: 6, totalPublishedCount: 15 },
  辅助系统: { collabPublished: 6, standaloneAppCount: 5, calcAppCount: 4, totalPublishedCount: 15 },
  柴油机: { collabPublished: 4, standaloneAppCount: 12, calcAppCount: 9, totalPublishedCount: 25 },
};

export const MOCK_PDM_PIC_LIST: DrawingProgressItem[] = [
  { title: '制动系统', data: { totalCount: 357, archivedCount: 126 } },
  { title: '总体', data: { totalCount: 420, archivedCount: 168 } },
  { title: '转向架', data: { totalCount: 298, archivedCount: 112 } },
  { title: '柴油机', data: { totalCount: 185, archivedCount: 74 } },
  { title: '辅助系统', data: { totalCount: 256, archivedCount: 98 } },
  { title: '车体', data: { totalCount: 312, archivedCount: 125 } },
  { title: '电传动', data: { totalCount: 274, archivedCount: 103 } },
];

export const MOCK_PHASE_OPTIONS = [
  { phaseId: '-1', phaseName: '全部' },
  { phaseId: '1', phaseName: '方案设计' },
  { phaseId: '2', phaseName: '技术设计' },
  { phaseId: '3', phaseName: '施工设计' },
];

export const MOCK_DESIGN_ACTIVE_USER_TOP10 = [
  { userName: '管理员', collabDesignCount: 12, standaloneAppCount: 10, calcCount: 5 },
  { userName: '郭洪雷', collabDesignCount: 8, standaloneAppCount: 6, calcCount: 4 },
  { userName: '张三', collabDesignCount: 5, standaloneAppCount: 3, calcCount: 2 },
  { userName: '李四', collabDesignCount: 3, standaloneAppCount: 2, calcCount: 2 },
  { userName: '王五', collabDesignCount: 4, standaloneAppCount: 2, calcCount: 1 },
  { userName: '赵六', collabDesignCount: 2, standaloneAppCount: 3, calcCount: 1 },
  { userName: '钱七', collabDesignCount: 3, standaloneAppCount: 1, calcCount: 2 },
  { userName: '孙八', collabDesignCount: 2, standaloneAppCount: 2, calcCount: 1 },
  { userName: '周九', collabDesignCount: 1, standaloneAppCount: 2, calcCount: 1 },
  { userName: '吴十', collabDesignCount: 2, standaloneAppCount: 1, calcCount: 1 },
];

export function applyProductBoardMock() {
  return {
    productInfo: { ...MOCK_PRODUCT_INFO },
    statsList: [...MOCK_STATS_LIST],
    deliveryInfo: { ...MOCK_DELIVERY_INFO },
    pdmPicList: [...MOCK_PDM_PIC_LIST],
  };
}
