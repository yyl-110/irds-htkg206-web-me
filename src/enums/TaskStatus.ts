export enum TaskStatus {
  DRAFT = 'DRAFT', // 草稿
  RME_AP = 'RME_AP', // 待RME分析
  RME_ANALYZING = 'RME_ANALYZING', // RME分析中
  A_CLOSED = 'A_CLOSED', // 需求分析已关闭
  RME_ANALYZED = 'RME_ANALYZED', // RME已分析/待处理
  RAT_NOT_ANALYZED = 'RAT_NOT_ANALYZED', // RAT待分析
  RAT_ANALYZING = 'RAT_ANALYZING', // RAT分析中
  RAT_AC = 'RAT_AC', // RAT分析完成
  IPMT_PD = 'IPMT_PD', // IPMT待决策
  IPMT_DEC = 'IPMT_DEC', // IPMT已决策
  UP_CLOSED = 'UP_CLOSED', // 升级决策已关闭
  FD_CLOSED = 'FD_CLOSED', // 最终决策已关闭
  DISPATCH_PENDING = 'DISPATCH_PENDING', // 最终决策/待分发
  DISTRIBUTION = 'DISTRIBUTION', // 分发中
  DISPATCHED = 'DISPATCHED', // 已分发
  IMPLEMENTATION_PENDING = 'IMPLEMENTATION_PENDING', // 开发中
  ACCEPTANCE_PENDING = 'ACCEPTANCE_PENDING', // 待验收
  COMPLETED = 'COMPLETED', // 已关闭
  TO_BE_SUBMITTED = 'TO_BE_SUBMITTED', // 待提交
  SUBMITTED = 'SUBMITTED', // 已提交
  Done = 'Done', // 已办
  To_do = 'To_do', // 待办
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
}
// 状态标签映射表（键为枚举值，值为显示文本）
export const TaskStatusLabel: Record<TaskStatus, string> = {
  [TaskStatus.DRAFT]: '草稿',
  [TaskStatus.RME_AP]: '待RME分析',
  [TaskStatus.RME_ANALYZING]: 'RME分析中',
  [TaskStatus.A_CLOSED]: '需求分析已关闭',
  [TaskStatus.RME_ANALYZED]: 'RME已分析/待处理',
  [TaskStatus.RAT_NOT_ANALYZED]: 'RAT待分析',
  [TaskStatus.RAT_ANALYZING]: 'RAT分析中',
  [TaskStatus.RAT_AC]: 'RAT分析完成',
  [TaskStatus.IPMT_PD]: 'IPMT待决策',
  [TaskStatus.IPMT_DEC]: 'IPMT已决策',
  [TaskStatus.UP_CLOSED]: '升级决策已关闭',
  [TaskStatus.FD_CLOSED]: '最终决策已关闭',
  [TaskStatus.DISPATCH_PENDING]: '最终决策/待分发',
  [TaskStatus.DISTRIBUTION]: '分发中',
  [TaskStatus.DISPATCHED]: '已分发',
  [TaskStatus.IMPLEMENTATION_PENDING]: '开发中',
  [TaskStatus.ACCEPTANCE_PENDING]: '待验收',
  [TaskStatus.COMPLETED]: '已关闭',
  [TaskStatus.TO_BE_SUBMITTED]: '待提交',
  [TaskStatus.SUBMITTED]: '已提交',
  [TaskStatus.Done]: '已办',
  [TaskStatus.IN_PROGRESS]: '进行中',
  [TaskStatus.To_do]: '待办',
};
export const getTaskStatusLabel = (status: keyof typeof TaskStatusLabel): string => {
  return TaskStatusLabel[status] || '';
};
