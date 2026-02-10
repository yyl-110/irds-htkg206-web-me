export enum Distributionteam {
  PRODUCT_PLAN = 'PRODUCT_PLAN', // 产品规划团队
  TECHNICAL_PLAN = 'TECHNICAL_PLAN', // 技术规划团队
  PRODUCT_PROJECT = 'PRODUCT_PROJECT', // 产品立项团队
  PRODUCT_DEV = 'PRODUCT_DEV', // 产品开发团队
  DFX = 'DFX', // DFX需求管理团队
}
export const DistributionteamLabel = {
  [Distributionteam.PRODUCT_PLAN]: '产品规划团队',
  [Distributionteam.TECHNICAL_PLAN]: '技术规划团队',
  [Distributionteam.PRODUCT_PROJECT]: '产品立项团队',
  [Distributionteam.PRODUCT_DEV]: '产品开发团队',
  [Distributionteam.DFX]: 'DFX需求管理团队',
};

export const getDistributionteamLabel = (team: keyof typeof DistributionteamLabel): string => {
  return DistributionteamLabel[team] || '';
};
