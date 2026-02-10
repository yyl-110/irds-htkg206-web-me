export enum ProductPortfolio {
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
  IMPLEMENTATION_PENDING = 'IMPLEMENTATION_PENDING', // 开发中
  TO_BE_SUBMITTED = 'TO_BE_SUBMITTED', // 待提交
  SUBMITTED = 'SUBMITTED', // 已提交
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  UNPROCESSED = 'UNPROCESSED', // 待办
  COMPLETED = 'COMPLETED', // 已关闭
  TRANSFER = 'TRANSFER', // 转办
  TRANSFERFINISH = 'TRANSFERFINISH', // 完成
  DISPATCHED = 'DISPATCHED', // 已分发
  ACCEPTANCE_PENDING = 'ACCEPTANCE_PENDING', // 待验收
}
export const ProductPortfolioLabel = {
  [ProductPortfolio.DRAFT]: '草稿',
  [ProductPortfolio.RME_AP]: '待RME分析',
  [ProductPortfolio.RME_ANALYZING]: 'RME分析中',
  [ProductPortfolio.A_CLOSED]: '需求分析已关闭',
  [ProductPortfolio.RME_ANALYZED]: 'RME已分析/待处理',
  [ProductPortfolio.RAT_NOT_ANALYZED]: 'RAT待分析',
  [ProductPortfolio.RAT_ANALYZING]: 'RAT分析中',
  [ProductPortfolio.RAT_AC]: 'RAT分析完成',
  [ProductPortfolio.IPMT_PD]: 'IPMT待决策',
  [ProductPortfolio.IPMT_DEC]: 'IPMT已决策',
  [ProductPortfolio.UP_CLOSED]: '升级决策已关闭',
  [ProductPortfolio.FD_CLOSED]: '最终决策已关闭',
  [ProductPortfolio.DISPATCH_PENDING]: '最终决策/待分发',
  [ProductPortfolio.DISTRIBUTION]: '分发中',
  [ProductPortfolio.IMPLEMENTATION_PENDING]: '开发中',
  [ProductPortfolio.TO_BE_SUBMITTED]: '待提交',
  [ProductPortfolio.SUBMITTED]: '已提交',
  [ProductPortfolio.IN_PROGRESS]: '进行中',
  [ProductPortfolio.UNPROCESSED]: '待办',
  [ProductPortfolio.COMPLETED]: '已关闭',
  [ProductPortfolio.TRANSFER]: '转办',
  [ProductPortfolio.TRANSFERFINISH]: '完成',
  [ProductPortfolio.DISPATCHED]: '已分发',
  [ProductPortfolio.ACCEPTANCE_PENDING]: '待验收',
};

export const getDistributionteamLabel = (team: keyof typeof ProductPortfolioLabel): string => {
  return ProductPortfolioLabel[team] || '';
};
