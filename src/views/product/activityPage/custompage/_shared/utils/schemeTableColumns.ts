/** 组合方案类表格共用列宽配置（page8/9/10/11 等） */

export const SCHEME_LEAF_WIDTH = 140;
export const SCHEME_METRIC_WIDTH = 150;
export const SCHEME_UNIT_WIDTH = 145;
export const SCHEME_COMBO_WIDTH = 130;
export const SCHEME_LONG_TITLE_WIDTH = 165;
export const SCHEME_MID_TITLE_WIDTH = 155;
export const SCHEME_PRODUCT_NAME_WIDTH = 150;
export const SCHEME_RATIO_WIDTH = 165;

export function schemeLeaf(title: string, dataIndex: string, width = SCHEME_LEAF_WIDTH) {
  return { title, dataIndex, key: dataIndex, align: 'center' as const, width };
}

export function schemeMetricGroup(title: string, dataIndex: string, unit: string, width = SCHEME_METRIC_WIDTH) {
  return {
    title,
    align: 'center' as const,
    width,
    children: [schemeLeaf(unit, dataIndex, width)],
  };
}

export function schemeUnitGroup(title: string, dataIndex: string, unit: string, width = SCHEME_UNIT_WIDTH) {
  return {
    title,
    align: 'center' as const,
    width,
    children: [schemeLeaf(unit, dataIndex, width)],
  };
}
