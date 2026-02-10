export enum ChangeType {
  INIT = 'INIT', //初始变更
  ORIGINAL = 'ORIGINAL', //原始变更
}
export const ChangeTypeLabel = {
  [ChangeType.INIT]: '初始变更',
  [ChangeType.ORIGINAL]: '原始变更',
};

export const getDistributionteamLabel = (team: keyof typeof ChangeTypeLabel): string => {
  return ChangeTypeLabel[team] || '';
};
